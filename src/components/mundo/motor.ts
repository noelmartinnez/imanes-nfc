// Motor del globo de /mundo: proyección ortográfica dibujada en un canvas 2D.
// Todo es imperativo (sin estado de React por fotograma): solo se redibuja cuando algo
// cambia, y el bucle se detiene cuando el globo está quieto.

import { geoCentroid, geoContains, geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import {
  centroDe,
  esVisible,
  INCLINACION_MAX,
  limitar,
  rotacionHacia,
  suaveEntradaSalida,
  ZOOM_MAX,
  ZOOM_MIN,
  type LonLat,
  type PaisGeo,
} from "@/lib/geo";

const GIRO_AUTOMATICO = 4; // grados por segundo
const ROZAMIENTO = 0.94; // por fotograma de 60 Hz
const GRATICULA = geoGraticule10();
const ESFERA = { type: "Sphere" } as const;

export type Desplazamiento = { dx: number; dy: number };

/**
 * Ruido de valor que encaja en los bordes: `celdas` valores al azar por lado,
 * interpolados con suavidad. Devuelve 0–1 para cada píxel de un cuadrado de `lado`.
 */
function ruidoSuave(lado: number, celdas: number) {
  const valores = Array.from({ length: celdas * celdas }, () => Math.random());
  const v = (cx: number, cy: number) => valores[((cy + celdas) % celdas) * celdas + ((cx + celdas) % celdas)];
  const suave = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const fx = (x / lado) * celdas;
    const fy = (y / lado) * celdas;
    const cx = Math.floor(fx);
    const cy = Math.floor(fy);
    const tx = suave(fx - cx);
    const ty = suave(fy - cy);
    const arriba = v(cx, cy) + (v(cx + 1, cy) - v(cx, cy)) * tx;
    const abajo = v(cx, cy + 1) + (v(cx + 1, cy + 1) - v(cx, cy + 1)) * tx;
    return arriba + (abajo - arriba) * ty;
  };
}
export type Punto = { lonlat: LonLat; tinta: string };

type Vuelo = {
  inicio: number;
  duracion: number;
  camino: (t: number) => [number, number];
  escala: [number, number];
  desde: Desplazamiento;
  hasta: Desplazamiento;
};

type Opciones = {
  reducido: boolean;
  centro: LonLat;
  /** Lee los colores de los tokens CSS (--color-*). */
  color: (token: string) => string;
};

export class MotorGlobo {
  // Sin remuestreo adaptativo: con el mapa 1:110m los tramos ya son cortos y es lo más caro.
  readonly proyeccion = geoOrthographic().clipAngle(90).precision(0);
  rotacion: [number, number, number];
  escala = 1;
  hover: string | null = null;

  private ctx: CanvasRenderingContext2D;
  private ruta;
  private ancho = 0;
  private alto = 0;
  private radioBase = 0;
  private desplazamiento: Desplazamiento = { dx: 0, dy: 0 };
  private paises: PaisGeo[] = [];
  /** Círculo que contiene cada país: si queda entero en la cara oculta, no se proyecta. */
  private alcance: { centro: LonLat; radio: number }[] = [];
  private tintas = new Map<string, string>();
  private puntos: Punto[] = [];
  private seleccionado: string | null = null;
  private aparicion = 1;
  private vuelo: Vuelo | null = null;
  private inercia: { vx: number; vy: number } | null = null;
  private girando: boolean;
  private raf = 0;
  private ultimo = 0;
  private saltar = false;
  private sucio = true;
  private observadores = new Set<() => void>();
  private llegadas = new Set<() => void>();
  /** Espacio ocupado arriba (cabecera) y abajo (controles): el globo se centra en el resto. */
  private banda = { arriba: 0, abajo: 0 };
  /** La trama de guilloché del papel, para el océano. */
  private papel: CanvasPattern | null = null;
  /** Tinta con grano y manchas, como la de los sellos (una por color). */
  private tintasConGrano = new Map<string, CanvasPattern>();

  constructor(
    private lienzo: HTMLCanvasElement,
    private opciones: Opciones,
  ) {
    this.ctx = lienzo.getContext("2d")!;
    this.ruta = geoPath(this.proyeccion, this.ctx);
    this.rotacion = rotacionHacia(opciones.centro);
    this.girando = !opciones.reducido;
    document.addEventListener("visibilitychange", this.alCambiarVisibilidad);
    const trama = new Image();
    trama.onload = () => {
      this.papel = this.ctx.createPattern(trama, "repeat");
      this.pedir();
    };
    trama.src = "/papel/ondas.svg";
  }

  destruir() {
    cancelAnimationFrame(this.raf);
    document.removeEventListener("visibilitychange", this.alCambiarVisibilidad);
    this.observadores.clear();
    this.llegadas.clear();
  }

  /** Avisa cuando termina un vuelo (para que las chinchetas caigan al llegar). */
  alLlegar(fn: () => void) {
    this.llegadas.add(fn);
    return () => void this.llegadas.delete(fn);
  }

  private avisarLlegada() {
    for (const fn of this.llegadas) fn();
  }

  /** Avisa después de cada fotograma dibujado (para colocar las chinchetas). */
  observar(fn: () => void) {
    this.observadores.add(fn);
    fn();
    return () => void this.observadores.delete(fn);
  }

  redimensionar(ancho: number, alto: number, banda: { arriba: number; abajo: number }) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.ancho = ancho;
    this.alto = alto;
    this.banda = banda;
    const libre = Math.max(alto - banda.arriba - banda.abajo, 120);
    // En vertical, el 90 % del ancho: los países pequeños tienen más superficie para el dedo.
    this.radioBase = (Math.min(ancho, libre) / 2) * (ancho < alto ? 0.9 : 0.88);
    this.lienzo.width = Math.round(ancho * dpr);
    this.lienzo.height = Math.round(alto * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.pedir();
  }

  fijarDatos(paises: PaisGeo[], tintas: Map<string, string>, puntos: Punto[]) {
    this.paises = paises;
    this.alcance = paises.map((pais) => {
      const centro = geoCentroid(pais) as LonLat;
      let radio = 0;
      const anillos = pais.geometry.type === "Polygon" ? [pais.geometry.coordinates] : pais.geometry.coordinates;
      for (const poligono of anillos)
        for (const anillo of poligono) for (const v of anillo) radio = Math.max(radio, geoDistance(centro, v as LonLat));
      return { centro, radio };
    });
    this.tintas = tintas;
    this.puntos = puntos;
    this.aparicion = this.opciones.reducido ? 1 : 0;
    this.pedir();
  }

  seleccionar(iso3: string | null) {
    this.seleccionado = iso3;
    this.pedir();
  }

  // ——— Interacción ———

  /** El usuario toca el globo: se para todo lo que se movía solo. */
  agarrar() {
    this.girando = false;
    this.vuelo = null;
    this.inercia = null;
  }

  arrastrar(dx: number, dy: number) {
    this.girar(dx, dy);
    this.pedir();
  }

  /** Solo cambia la rotación: dentro del bucle no hay que pedir otro fotograma. */
  private girar(dx: number, dy: number) {
    // Un píxel en el centro de la bola equivale a estos grados: el punto sigue al dedo.
    const grados = 180 / (Math.PI * this.radioBase * this.escala);
    const [lambda, phi] = this.rotacion;
    this.rotacion = [lambda + dx * grados, limitar(phi - dy * grados, -INCLINACION_MAX, INCLINACION_MAX), 0];
  }

  /** Hay algo moviendo el globo solo (vuelo o inercia), aparte del giro lento. */
  get enMovimiento() {
    return this.vuelo !== null || this.inercia !== null;
  }

  /** Suelta con velocidad (px/ms): sigue girando y frena poco a poco. */
  lanzar(vx: number, vy: number) {
    if (this.opciones.reducido || Math.hypot(vx, vy) < 0.05) return;
    this.inercia = { vx, vy };
    this.pedir();
  }

  fijarEscala(escala: number) {
    this.escala = limitar(escala, ZOOM_MIN, ZOOM_MAX);
    this.pedir();
  }

  /** Zoom de los botones +/−: suave y sin mover el centro. */
  zoomSuave(factor: number) {
    this.volarA(this.centro, this.escala * factor, this.desplazamiento);
  }

  redibujar() {
    this.pedir();
  }

  /** Gira y acerca hasta `centro` con un movimiento suave (o de golpe con movimiento reducido). */
  volarA(centro: LonLat, escala: number, desplazamiento: Desplazamiento) {
    const desde = centroDe(this.rotacion);
    const destinoEscala = limitar(escala, ZOOM_MIN, ZOOM_MAX);
    this.girando = false;
    this.inercia = null;
    if (this.opciones.reducido) {
      this.rotacion = rotacionHacia(centro);
      this.escala = destinoEscala;
      this.desplazamiento = desplazamiento;
      this.vuelo = null;
      this.pedir();
      this.avisarLlegada();
      return;
    }
    const distancia = geoDistance(desde, centro) / Math.PI;
    const cambioZoom = Math.abs(Math.log(destinoEscala / this.escala));
    this.vuelo = {
      inicio: performance.now(),
      duracion: limitar(450 + distancia * 500 + cambioZoom * 90, 450, 950),
      camino: geoInterpolate(desde, centro),
      escala: [this.escala, destinoEscala],
      desde: { ...this.desplazamiento },
      hasta: desplazamiento,
    };
    this.pedir();
  }

  get centro() {
    return centroDe(this.rotacion);
  }

  /** Posición en pantalla de un punto, o null si está en la cara oculta. */
  proyectar(lonlat: LonLat): [number, number] | null {
    if (!esVisible(lonlat, this.centro)) return null;
    return this.proyeccion(lonlat);
  }

  /** País bajo un punto de la pantalla (primero los visitados, que se dibujan encima). */
  paisEn(x: number, y: number): PaisGeo | null {
    const lonlat = this.proyeccion.invert?.([x, y]);
    if (!lonlat || Number.isNaN(lonlat[0])) return null;
    // Solo los países cuyo círculo contiene el punto: geoContains es lo caro.
    const cerca = this.paises.filter((_, i) => geoDistance(this.alcance[i].centro, lonlat) <= this.alcance[i].radio + 1e-6);
    const visitados = cerca.filter((p) => this.tintas.has(p.id as string));
    return [...visitados, ...cerca].find((p) => geoContains(p, lonlat)) ?? null;
  }

  esVisitado(iso3: string | null) {
    return iso3 !== null && this.tintas.has(iso3);
  }

  // ——— Bucle ———

  private alCambiarVisibilidad = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    } else {
      this.pedir();
    }
  };

  private pedir() {
    this.sucio = true;
    if (!this.raf && !document.hidden) {
      this.ultimo = performance.now();
      this.raf = requestAnimationFrame(this.fotograma);
    }
  }

  private fotograma = (ahora: number) => {
    this.raf = 0;
    const dt = limitar(ahora - this.ultimo, 0, 64);
    this.ultimo = ahora;
    let sigue = false;

    if (this.vuelo) {
      const v = this.vuelo;
      const p = Math.min((ahora - v.inicio) / v.duracion, 1);
      const t = suaveEntradaSalida(p);
      this.rotacion = rotacionHacia(v.camino(t));
      this.escala = v.escala[0] * (v.escala[1] / v.escala[0]) ** t;
      this.desplazamiento = {
        dx: v.desde.dx + (v.hasta.dx - v.desde.dx) * t,
        dy: v.desde.dy + (v.hasta.dy - v.desde.dy) * t,
      };
      if (p < 1) sigue = true;
      else {
        this.vuelo = null;
        this.avisarLlegada();
      }
    } else if (this.inercia) {
      const { vx, vy } = this.inercia;
      this.girar(vx * dt, vy * dt);
      const frena = ROZAMIENTO ** (dt / 16.7);
      this.inercia = { vx: vx * frena, vy: vy * frena };
      if (Math.hypot(vx, vy) > 0.01) sigue = true;
      else this.inercia = null;
    } else if (this.girando) {
      // El giro lento no necesita 60 fps: uno de cada dos fotogramas ahorra batería.
      this.saltar = !this.saltar;
      if (this.saltar) {
        this.ultimo = ahora - dt;
        this.raf = requestAnimationFrame(this.fotograma);
        return;
      }
      this.rotacion = [this.rotacion[0] + (GIRO_AUTOMATICO * dt) / 1000, this.rotacion[1], 0];
      sigue = true;
    }

    if (this.aparicion < 1) {
      this.aparicion = Math.min(1, this.aparicion + dt / 300);
      sigue = true;
    }

    if (this.sucio || sigue) this.dibujar();
    this.sucio = false;
    // Si algo ya pidió el siguiente fotograma durante este, no se pide otro: nunca más de uno.
    if (sigue && !this.raf && !document.hidden) this.raf = requestAnimationFrame(this.fotograma);
  };

  /**
   * Patrón de 384 px de tinta irregular: manchas de ruido suave (dos octavas, sin ninguna
   * dirección), grano fino y algún poro sin tinta. Encaja en los bordes, así que el mosaico
   * no deja costuras ni rayas.
   */
  private tintaConGrano(color: string) {
    const guardado = this.tintasConGrano.get(color);
    if (guardado) return guardado;
    const lado = 384;
    const lienzo = document.createElement("canvas");
    lienzo.width = lienzo.height = lado;
    const c = lienzo.getContext("2d")!;
    c.fillStyle = color;
    c.fillRect(0, 0, 1, 1);
    const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
    const imagen = c.createImageData(lado, lado);
    const manchas = ruidoSuave(lado, 9);
    const detalle = ruidoSuave(lado, 23);
    for (let y = 0; y < lado; y++) {
      for (let x = 0; x < lado; x++) {
        const grano = Math.random();
        const mancha = 0.65 * manchas(x, y) + 0.35 * detalle(x, y);
        let alfa = 0.14 + 0.24 * mancha + 0.1 * (grano - 0.5);
        if (grano < 0.035) alfa *= 0.25; // poros sin tinta
        const i = (y * lado + x) * 4;
        imagen.data.set([r, g, b, Math.round(Math.min(Math.max(alfa, 0), 1) * 255)], i);
      }
    }
    c.clearRect(0, 0, lado, lado);
    c.putImageData(imagen, 0, 0);
    const patron = this.ctx.createPattern(lienzo, "repeat")!;
    this.tintasConGrano.set(color, patron);
    return patron;
  }

  private dibujar() {
    const { ctx, ruta, opciones } = this;
    const c = opciones.color;
    ctx.clearRect(0, 0, this.ancho, this.alto);
    const centroY = (this.banda.arriba + this.alto - this.banda.abajo) / 2;
    this.proyeccion
      .translate([this.ancho / 2 + this.desplazamiento.dx, centroY + this.desplazamiento.dy])
      .scale(this.radioBase * this.escala)
      .rotate(this.rotacion);

    // Océano: papel hondo con la trama de guilloché (fija, como el papel) y retícula
    ctx.beginPath();
    ruta(ESFERA);
    ctx.fillStyle = c("papel-hondo");
    ctx.fill();
    if (this.papel) {
      ctx.fillStyle = this.papel;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.beginPath();
    ruta(GRATICULA);
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = c("guilloche");
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Tierra (solo los países con alguna parte en la cara visible)
    const centro = this.centro;
    const visibles = this.paises.filter(
      (_, i) => geoDistance(this.alcance[i].centro, centro) - this.alcance[i].radio < Math.PI / 2,
    );
    ctx.globalAlpha = this.aparicion;
    ctx.beginPath();
    for (const pais of visibles) if (!this.tintas.has(pais.id as string)) ruta(pais);
    ctx.fillStyle = c("papel");
    ctx.fill();
    ctx.globalAlpha = this.aparicion * 0.55;
    ctx.strokeStyle = c("texto-suave");
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Países con fotos, en la tinta de su sello: con grano y manchas, multiplicada sobre el papel
    for (const pais of visibles) {
      const tinta = this.tintas.get(pais.id as string);
      if (!tinta) continue;
      const elegido = pais.id === this.seleccionado;
      ctx.beginPath();
      ruta(pais);
      const grano = this.tintaConGrano(tinta);
      // El grano viaja con el país (no se queda fijo en la pantalla mientras gira)
      const ancla = this.proyeccion(this.alcance[this.paises.indexOf(pais)].centro) ?? [0, 0];
      grano.setTransform(new DOMMatrix().translate(ancla[0], ancla[1]));
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = grano;
      ctx.globalAlpha = this.aparicion * (elegido ? 1 : pais.id === this.hover ? 0.85 : 0.7);
      ctx.fill();
      if (elegido) ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = this.aparicion;
      ctx.strokeStyle = tinta;
      ctx.lineWidth = elegido ? 1.6 : 1;
      ctx.stroke();
    }

    // Un punto de tinta por cada lugar con fotos
    const radio = limitar(1.6 + this.escala * 0.35, 2, 4);
    for (const { lonlat, tinta } of this.puntos) {
      const p = this.proyectar(lonlat);
      if (!p) continue;
      ctx.beginPath();
      ctx.arc(p[0], p[1], radio, 0, Math.PI * 2);
      ctx.fillStyle = tinta;
      ctx.fill();
    }

    // Doble aro, como el borde de un sello
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ruta(ESFERA);
    ctx.strokeStyle = c("texto");
    ctx.lineWidth = 1.4;
    ctx.stroke();
    const [cx, cy] = this.proyeccion.translate();
    ctx.beginPath();
    ctx.arc(cx, cy, this.proyeccion.scale() + 5, 0, Math.PI * 2);
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 0.6;
    ctx.stroke();
    ctx.globalAlpha = 1;

    for (const fn of this.observadores) fn();
  }
}
