// Gestos del globo: arrastrar para girar (con inercia), pellizcar o rueda para el zoom,
// tocar para elegir país, y teclado (flechas y +/−).

import type { PaisGeo } from "@/lib/geo";
import type { MotorGlobo } from "./motor";

const UMBRAL_TOQUE = 6; // px: más que esto ya es un arrastre
const PASO_TECLADO = 80; // px de arrastre equivalentes por pulsación

type Puntero = { x: number; y: number };

export function conectarGestos(
  lienzo: HTMLCanvasElement,
  motor: MotorGlobo,
  alTocar: (pais: PaisGeo | null) => void,
) {
  const punteros = new Map<number, Puntero>();
  let recorrido = 0;
  let inicio = 0;
  let velocidad = { vx: 0, vy: 0 };
  let ultimo = 0;
  let pinza: { distancia: number; escala: number; medio: Puntero } | null = null;

  const local = (e: PointerEvent | WheelEvent): Puntero => {
    const r = lienzo.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const distancia = (a: Puntero, b: Puntero) => Math.hypot(a.x - b.x, a.y - b.y);
  const medio = (a: Puntero, b: Puntero) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  const empezarPinza = () => {
    const [a, b] = [...punteros.values()];
    pinza = { distancia: distancia(a, b), escala: motor.escala, medio: medio(a, b) };
  };

  const alBajar = (e: PointerEvent) => {
    // Un segundo dedo cuando ya hay dos (o más) se ignora: evita saltos.
    if (punteros.size >= 2) return;
    try {
      lienzo.setPointerCapture(e.pointerId);
    } catch {
      // Sin captura el gesto sigue funcionando mientras el dedo esté sobre el globo.
    }
    punteros.set(e.pointerId, local(e));
    motor.agarrar();
    if (punteros.size === 1) {
      recorrido = 0;
      inicio = ultimo = performance.now();
      velocidad = { vx: 0, vy: 0 };
    } else {
      recorrido = Infinity; // con dos dedos ya no es un toque
      empezarPinza();
    }
  };

  const alMover = (e: PointerEvent) => {
    const anterior = punteros.get(e.pointerId);
    if (!anterior) {
      // Ratón sin pulsar: resaltar el país con fotos bajo el cursor.
      if (e.pointerType === "mouse") {
        const { x, y } = local(e);
        const pais = motor.paisEn(x, y);
        const iso3 = motor.esVisitado((pais?.id as string) ?? null) ? (pais!.id as string) : null;
        if (iso3 !== motor.hover) {
          motor.hover = iso3;
          motor.redibujar();
        }
        lienzo.style.cursor = iso3 ? "pointer" : "grab";
      }
      return;
    }
    const actual = local(e);
    punteros.set(e.pointerId, actual);

    if (pinza && punteros.size === 2) {
      const [a, b] = [...punteros.values()];
      const m = medio(a, b);
      motor.fijarEscala(pinza.escala * (distancia(a, b) / pinza.distancia));
      motor.arrastrar(m.x - pinza.medio.x, m.y - pinza.medio.y);
      pinza.medio = m;
      return;
    }

    const dx = actual.x - anterior.x;
    const dy = actual.y - anterior.y;
    recorrido += Math.abs(dx) + Math.abs(dy);
    const ahora = performance.now();
    const dt = Math.max(ahora - ultimo, 1);
    ultimo = ahora;
    velocidad = { vx: velocidad.vx * 0.6 + (dx / dt) * 0.4, vy: velocidad.vy * 0.6 + (dy / dt) * 0.4 };
    motor.arrastrar(dx, dy);
  };

  const alSoltar = (e: PointerEvent, cancelado = false) => {
    const punto = punteros.get(e.pointerId);
    if (!punto) return;
    punteros.delete(e.pointerId);

    if (pinza) {
      if (punteros.size === 0) pinza = null;
      else {
        // De dos dedos a uno: seguir arrastrando sin saltos.
        pinza = null;
        ultimo = performance.now();
      }
      return;
    }
    if (cancelado) return;
    const reposo = performance.now() - ultimo > 80; // si se paró antes de soltar, sin inercia
    if (recorrido < UMBRAL_TOQUE && performance.now() - inicio < 500) {
      alTocar(motor.paisEn(punto.x, punto.y));
    } else if (!reposo) {
      motor.lanzar(velocidad.vx, velocidad.vy);
    }
  };

  const alRueda = (e: WheelEvent) => {
    e.preventDefault();
    motor.agarrar();
    motor.fijarEscala(motor.escala * Math.exp(-e.deltaY * 0.0018));
  };

  const alTeclear = (e: KeyboardEvent) => {
    const acciones: Record<string, () => void> = {
      ArrowLeft: () => motor.arrastrar(PASO_TECLADO, 0),
      ArrowRight: () => motor.arrastrar(-PASO_TECLADO, 0),
      ArrowUp: () => motor.arrastrar(0, PASO_TECLADO),
      ArrowDown: () => motor.arrastrar(0, -PASO_TECLADO),
      "+": () => motor.fijarEscala(motor.escala * 1.25),
      "=": () => motor.fijarEscala(motor.escala * 1.25),
      "-": () => motor.fijarEscala(motor.escala / 1.25),
    };
    const accion = acciones[e.key];
    if (!accion) return;
    e.preventDefault();
    motor.agarrar();
    accion();
  };

  const alCancelar = (e: PointerEvent) => alSoltar(e, true);
  const alSalir = () => {
    if (motor.hover) {
      motor.hover = null;
      motor.redibujar();
    }
  };

  lienzo.addEventListener("pointerdown", alBajar);
  lienzo.addEventListener("pointermove", alMover);
  lienzo.addEventListener("pointerup", alSoltar);
  lienzo.addEventListener("pointercancel", alCancelar);
  lienzo.addEventListener("pointerleave", alSalir);
  lienzo.addEventListener("wheel", alRueda, { passive: false });
  lienzo.addEventListener("keydown", alTeclear);
  return () => {
    lienzo.removeEventListener("pointerdown", alBajar);
    lienzo.removeEventListener("pointermove", alMover);
    lienzo.removeEventListener("pointerup", alSoltar);
    lienzo.removeEventListener("pointercancel", alCancelar);
    lienzo.removeEventListener("pointerleave", alSalir);
    lienzo.removeEventListener("wheel", alRueda);
    lienzo.removeEventListener("keydown", alTeclear);
  };
}
