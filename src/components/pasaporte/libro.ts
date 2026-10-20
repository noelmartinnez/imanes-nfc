// Motor del pasaporte: mueve las hojas y el libro con transformaciones, fuera de React.
// Solo pide fotogramas mientras algo se mueve; en reposo no hace nada.
//
// Cada hoja gira sobre el lomo con su propia perspectiva y el orden de apilado lo decide
// z-index (la que está a la izquierda o a la derecha según su ángulo). El libro entero es
// plano y se inclina como un objeto: así no hay hojas que se crucen en 3D ni Safari las aplana.

import {
  aleteo,
  anguloAlSoltar,
  desplazamientoLibro,
  MUELLE_HOJA,
  MUELLE_INCLINACION,
  pasoMuelle,
  recorridoArrastre,
  suavizado,
  type Modo,
} from "./fisica";

type Opciones = {
  reducido: boolean;
  /** Cuántas hojas quedan pasadas: al soltar, al pulsar o al terminar la apertura. */
  alCambiar: (abiertas: number) => void;
};

type Arrastre = {
  id: number;
  x0: number;
  y0: number;
  hoja: number | null;
  angulo0: number;
  muestras: { x: number; t: number }[];
  decidido: boolean;
};

/** Píxeles antes de decidir si el gesto pasa página o desplaza la pantalla. */
const ZONA_MUERTA = 6;
/** Inclinación máxima hacia el puntero, en grados. */
const INCLINACION = { x: 4, y: 6 };
/** Solo cuenta la velocidad de los últimos ms: si el dedo se para, la hoja no sale lanzada. */
const VENTANA_VELOCIDAD = 100;

// Apertura de la primera visita: espera a que el libro se asiente, la tapa se abre despacio
// y las primeras hojas se levantan con su aire y vuelven a caer, una tras otra.
const ESPERA = 600;
const GIRO_TAPA = 1000;
const ALETEO = { inicio: 380, paso: 45, duracion: 560, amplitudes: [26, 17, 10, 5] };
const DURACION_APERTURA =
  ESPERA + Math.max(GIRO_TAPA, ALETEO.inicio + (ALETEO.amplitudes.length - 1) * ALETEO.paso + ALETEO.duracion);

const limitar = (x: number, min: number, max: number) => Math.min(Math.max(x, min), max);

export class MotorLibro {
  private hojas: HTMLElement[] = [];
  private caras: { frente: HTMLElement | null; dorso: HTMLElement | null; ultimo: boolean | null }[] = [];
  private sombras: HTMLElement[][] = [];
  private angulos: number[] = [];
  private velocidades: number[] = [];
  private objetivos: number[] = [];
  private abiertas = 0;
  private modo: Modo = "doble";
  private ancho = 300;
  private inclinacion = { x: 0, y: 0, vx: 0, vy: 0, ox: 0, oy: 0 };
  private arrastre: Arrastre | null = null;
  private arrastrado = false;
  private apertura: { inicio: number; alTerminar: (interrumpida: boolean) => void } | null = null;
  private raf = 0;
  private ultimo = 0;
  private brillo: Element | null = null;
  private ultimoBrillo = "";
  private fino: MediaQueryList;

  constructor(
    private escenario: HTMLElement,
    private libro: HTMLElement,
    private opciones: Opciones,
  ) {
    this.fino = window.matchMedia("(hover: hover) and (pointer: fine)");
    escenario.addEventListener("pointerdown", this.alPulsar);
    escenario.addEventListener("pointermove", this.alMover);
    escenario.addEventListener("pointerup", this.alSoltar);
    escenario.addEventListener("pointercancel", this.alCancelar);
    escenario.addEventListener("pointerleave", this.alSalir);
    escenario.addEventListener("click", this.alHacerClic, true);
  }

  destruir() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.escenario.removeEventListener("pointerdown", this.alPulsar);
    this.escenario.removeEventListener("pointermove", this.alMover);
    this.escenario.removeEventListener("pointerup", this.alSoltar);
    this.escenario.removeEventListener("pointercancel", this.alCancelar);
    this.escenario.removeEventListener("pointerleave", this.alSalir);
    this.escenario.removeEventListener("click", this.alHacerClic, true);
  }

  /** Recoge las hojas recién pintadas (al empezar o al cambiar de modo) y las coloca sin animar. */
  fijar(modo: Modo, ancho: number, hojas: HTMLElement[], abiertas: number) {
    this.modo = modo;
    this.ancho = ancho;
    this.hojas = hojas;
    this.sombras = hojas.map((h) => [...h.querySelectorAll<HTMLElement>(".sombra-hoja")]);
    this.caras = hojas.map((h) => ({
      frente: h.querySelector<HTMLElement>(":scope > .cara-frente"),
      dorso: h.querySelector<HTMLElement>(":scope > .cara-dorso"),
      ultimo: null,
    }));
    this.brillo = this.libro.querySelector("[data-brillo]");
    this.ultimoBrillo = "";
    const n = limitar(abiertas, 0, hojas.length);
    this.objetivos = hojas.map((_, i) => (i < n ? 180 : 0));
    this.angulos = [...this.objetivos];
    this.velocidades = hojas.map(() => 0);
    this.cambiarAbiertas(n);
    this.aplicar();
  }

  redimensionar(ancho: number) {
    this.ancho = ancho;
    this.aplicar();
  }

  get total() {
    return this.hojas.length;
  }

  get pasadas() {
    return this.abiertas;
  }

  /** Lleva el libro a `abiertas` hojas pasadas. Con el teclado, sin animar. */
  ir(abiertas: number, animar = true) {
    this.interrumpir();
    const n = limitar(abiertas, 0, this.total);
    if (n === this.abiertas && this.objetivos.every((o, i) => o === (i < n ? 180 : 0))) return;
    this.objetivos = this.hojas.map((_, i) => (i < n ? 180 : 0));
    if (!animar || this.opciones.reducido) {
      this.angulos = [...this.objetivos];
      this.velocidades = this.hojas.map(() => 0);
      if (animar) this.fundir();
    }
    this.cambiarAbiertas(n);
    this.aplicar();
    this.pedir();
  }

  siguiente() {
    this.ir(this.abiertas + 1);
  }

  anterior() {
    this.ir(this.abiertas - 1);
  }

  /** La apertura de la primera visita. Cualquier toque o tecla la lleva al final. */
  abrirConMagia(alTerminar: (interrumpida: boolean) => void) {
    if (this.opciones.reducido || this.total < 3) {
      this.ir(1, false);
      alTerminar(true);
      return;
    }
    this.ir(0, false);
    this.apertura = { inicio: performance.now(), alTerminar };
    this.pedir();
  }

  interrumpir() {
    if (this.apertura) this.terminarApertura(true);
  }

  private terminarApertura(interrumpida: boolean) {
    const fin = this.apertura;
    if (!fin) return;
    this.apertura = null;
    this.objetivos = this.hojas.map((_, i) => (i < 1 ? 180 : 0));
    this.angulos = [...this.objetivos];
    this.velocidades = this.hojas.map(() => 0);
    this.cambiarAbiertas(1);
    this.aplicar();
    this.pedir();
    fin.alTerminar(interrumpida);
  }

  private cambiarAbiertas(n: number) {
    this.abiertas = n;
    // Los cantos de las páginas: más gruesos del lado donde quedan más hojas.
    this.libro.style.setProperty("--hojas-izquierda", String(n));
    this.libro.style.setProperty("--hojas-derecha", String(this.total - n));
    this.opciones.alCambiar(n);
  }

  /** Con movimiento reducido, cambiar de página es un fundido corto. */
  private fundir() {
    this.libro.animate?.([{ opacity: 0.35 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
  }

  // --- Gestos -----------------------------------------------------------------------------

  private alPulsar = (e: PointerEvent) => {
    this.interrumpir();
    // Un segundo dedo no cambia de hoja a mitad de gesto.
    if (this.arrastre || e.button > 0) return;
    this.arrastrado = false;
    this.arrastre = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      hoja: null,
      angulo0: 0,
      muestras: [{ x: e.clientX, t: e.timeStamp }],
      decidido: false,
    };
  };

  private alMover = (e: PointerEvent) => {
    const a = this.arrastre;
    if (!a || a.id !== e.pointerId) {
      if (e.pointerType === "mouse" && this.fino.matches) this.inclinarHacia(e.clientX, e.clientY, 1);
      return;
    }
    const dx = e.clientX - a.x0;
    const dy = e.clientY - a.y0;
    if (!a.decidido) {
      if (Math.hypot(dx, dy) < ZONA_MUERTA) return;
      // En vertical, el gesto es de la página: se deja desplazar.
      if (Math.abs(dy) > Math.abs(dx)) {
        this.arrastre = null;
        return;
      }
      a.decidido = true;
      this.arrastrado = true;
      if (dx < 0) a.hoja = this.abiertas < this.total ? this.abiertas : null;
      else a.hoja = this.abiertas > 0 ? this.abiertas - 1 : null;
      if (a.hoja !== null) a.angulo0 = this.angulos[a.hoja];
      this.escenario.setPointerCapture(e.pointerId);
    }
    a.muestras.push({ x: e.clientX, t: e.timeStamp });
    while (a.muestras.length > 2 && e.timeStamp - a.muestras[0].t > VENTANA_VELOCIDAD) a.muestras.shift();
    if (a.hoja !== null) {
      const recorrido = recorridoArrastre(this.modo, this.ancho);
      this.angulos[a.hoja] = limitar(a.angulo0 - (dx / recorrido) * 180, 0, 180);
      this.velocidades[a.hoja] = 0;
    }
    this.inclinarHacia(e.clientX, e.clientY, 0.6);
    this.pedir();
  };

  private alSoltar = (e: PointerEvent) => {
    const a = this.arrastre;
    if (!a || a.id !== e.pointerId) return;
    this.arrastre = null;
    if (!a.decidido) return this.tocar(e);
    if (e.pointerType !== "mouse") this.inclinacion.ox = this.inclinacion.oy = 0;
    if (a.hoja === null) return this.pedir();

    const recientes = a.muestras.filter((m) => e.timeStamp - m.t <= VENTANA_VELOCIDAD);
    const [primera, ultima] = [recientes[0], recientes.at(-1)];
    const vx = primera && ultima && ultima.t > primera.t ? (ultima.x - primera.x) / (ultima.t - primera.t) : 0;
    this.terminarArrastre(a.hoja, vx);
  };

  private alCancelar = (e: PointerEvent) => {
    const a = this.arrastre;
    if (!a || a.id !== e.pointerId) return;
    this.arrastre = null;
    this.inclinacion.ox = this.inclinacion.oy = 0;
    if (a.decidido && a.hoja !== null) this.terminarArrastre(a.hoja, 0);
  };

  private terminarArrastre(hoja: number, vx: number) {
    const objetivo = anguloAlSoltar(this.angulos[hoja], vx);
    this.objetivos[hoja] = objetivo;
    const recorrido = recorridoArrastre(this.modo, this.ancho);
    this.velocidades[hoja] = ((-vx * 1000) / recorrido) * 180;
    if (this.opciones.reducido) {
      this.angulos[hoja] = objetivo;
      this.velocidades[hoja] = 0;
    }
    this.cambiarAbiertas(objetivo === 180 ? hoja + 1 : hoja);
    this.pedir();
  }

  /** Un toque sin arrastrar: en la mitad derecha pasa página y en la izquierda vuelve. */
  private tocar(e: PointerEvent) {
    if ((e.target as Element).closest("a, button")) return;
    const r = this.libro.getBoundingClientRect();
    const lomo = r.left + r.width / 2;
    if (this.abiertas === 0) return this.siguiente();
    if (this.abiertas === this.total) return this.anterior();
    const limite = this.modo === "doble" ? lomo : lomo + this.ancho * 0.3;
    if (e.clientX > limite) this.siguiente();
    else this.anterior();
  }

  private alSalir = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || this.arrastre) return;
    this.inclinacion.ox = this.inclinacion.oy = 0;
    this.pedir();
  };

  /** Tras arrastrar, el clic que llega al soltar no abre el sello que había debajo. */
  private alHacerClic = (e: MouseEvent) => {
    if (!this.arrastrado) return;
    this.arrastrado = false;
    e.preventDefault();
    e.stopPropagation();
  };

  private inclinarHacia(x: number, y: number, fuerza: number) {
    if (this.opciones.reducido) return;
    const r = this.libro.getBoundingClientRect();
    const nx = limitar((x - (r.left + r.width / 2)) / (r.width / 2 || 1), -1, 1);
    const ny = limitar((y - (r.top + r.height / 2)) / (r.height / 2 || 1), -1, 1);
    // El lado bajo el puntero se hunde un poco, como un objeto que se toca.
    this.inclinacion.ox = -ny * INCLINACION.x * fuerza;
    this.inclinacion.oy = nx * INCLINACION.y * fuerza;
    this.pedir();
  }

  // --- Bucle ------------------------------------------------------------------------------

  private pedir() {
    if (this.raf) return;
    this.ultimo = performance.now();
    this.raf = requestAnimationFrame(this.paso);
  }

  private paso = (ahora: number) => {
    this.raf = 0;
    const dt = limitar((ahora - this.ultimo) / 1000, 0, 1 / 20);
    this.ultimo = ahora;
    let enMovimiento = false;

    if (this.apertura) {
      enMovimiento = this.pasoApertura(ahora);
    } else {
      for (let i = 0; i < this.hojas.length; i++) {
        if (this.arrastre?.hoja === i && this.arrastre.decidido) continue;
        const objetivo = this.objetivos[i];
        let angulo = this.angulos[i];
        let v = this.velocidades[i];
        if (Math.abs(angulo - objetivo) < 0.05 && Math.abs(v) < 0.5) {
          angulo = objetivo;
          v = 0;
        } else {
          [angulo, v] = pasoMuelle(angulo, v, objetivo, dt, MUELLE_HOJA);
          // Una hoja no atraviesa las demás: al tocar el tope, se queda quieta.
          if (angulo <= 0 || angulo >= 180) {
            angulo = limitar(angulo, 0, 180);
            v = 0;
          }
          enMovimiento = true;
        }
        this.angulos[i] = angulo;
        this.velocidades[i] = v;
      }
    }

    const inc = this.inclinacion;
    for (const eje of ["x", "y"] as const) {
      const objetivo = eje === "x" ? inc.ox : inc.oy;
      const clave = eje === "x" ? "vx" : "vy";
      if (Math.abs(inc[eje] - objetivo) < 0.01 && Math.abs(inc[clave]) < 0.05) {
        inc[eje] = objetivo;
        inc[clave] = 0;
      } else {
        [inc[eje], inc[clave]] = pasoMuelle(inc[eje], inc[clave], objetivo, dt, MUELLE_INCLINACION);
        enMovimiento = true;
      }
    }

    this.aplicar();
    if (enMovimiento || this.arrastre?.decidido) this.pedir();
  };

  private pasoApertura(ahora: number) {
    const t = ahora - this.apertura!.inicio;
    if (t >= DURACION_APERTURA) {
      this.terminarApertura(false);
      return true;
    }
    const tapa = t - ESPERA;
    this.angulos[0] = 180 * suavizado(tapa / GIRO_TAPA);
    ALETEO.amplitudes.forEach((amplitud, i) => {
      if (i + 1 < this.total - 1) {
        this.angulos[i + 1] = aleteo(tapa, ALETEO.inicio + i * ALETEO.paso, ALETEO.duracion, amplitud);
      }
    });
    // Mientras se abre, el libro se acerca un poco al que mira, como si lo levantara.
    this.inclinacion.ox = 5 * Math.sin(Math.PI * limitar(tapa / (GIRO_TAPA * 1.3), 0, 1));
    return true;
  }

  private aplicar() {
    const total = this.hojas.length;
    // Lejana: la hoja que gira apenas crece y no invade la cabecera ni el paginador.
    const perspectiva = Math.round(this.ancho * 8);
    for (let i = 0; i < total; i++) {
      const angulo = this.angulos[i];
      const hoja = this.hojas[i];
      const girando = angulo > 0.01 && angulo < 179.99;
      // Las tapas se ven siempre: abiertas, forman el filo de piel alrededor de las páginas.
      const cerca = i === 0 || i === total - 1 || (i >= this.abiertas - 2 && i <= this.abiertas + 1);
      // De dos en dos, para que los cantos (z 3) queden entre las tapas y las páginas.
      hoja.style.zIndex = String(2 * (angulo > 90 ? i + 1 : total - i));
      hoja.style.transform = `perspective(${perspectiva}px) rotateY(${(-angulo).toFixed(3)}deg)`;
      hoja.style.visibility = girando || cerca ? "" : "hidden";
      // Qué cara mira al frente lo decide el ángulo, no backface-visibility: hay motores que
      // aplanan la hoja y entonces enseñarían el dorso en espejo.
      const caras = this.caras[i];
      const deFrente = angulo < 90;
      if (caras && caras.ultimo !== deFrente) {
        if (caras.frente) caras.frente.style.visibility = deFrente ? "" : "hidden";
        if (caras.dorso) caras.dorso.style.visibility = deFrente ? "hidden" : "";
        caras.ultimo = deFrente;
      }
      // La hoja que gira se oscurece un poco al levantarse: deja de recibir la luz de frente.
      const sombra = girando ? (Math.sin((angulo * Math.PI) / 180) * 0.22).toFixed(3) : "0";
      for (const s of this.sombras[i]) s.style.opacity = sombra;
    }

    const { x, y } = this.inclinacion;
    const desplazamiento = desplazamientoLibro(this.modo, this.ancho, this.angulos[0] ?? 0, this.angulos[total - 1] ?? 0);
    this.libro.style.transform = `translateX(${desplazamiento.toFixed(2)}px) rotateX(${x.toFixed(3)}deg) rotateY(${y.toFixed(3)}deg)`;

    // El dorado de la tapa recoge la luz según se inclina.
    if (this.brillo) {
      // En unidades de la tapa (88 de ancho): el reflejo recorre un cuarto de ella.
      const brillo = `translate(${((y / INCLINACION.y) * 24 + (x / INCLINACION.x) * 6).toFixed(2)} 0)`;
      if (brillo !== this.ultimoBrillo) {
        this.brillo.setAttribute("gradientTransform", brillo);
        this.ultimoBrillo = brillo;
      }
    }
  }
}
