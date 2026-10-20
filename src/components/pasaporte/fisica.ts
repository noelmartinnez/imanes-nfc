// Geometría y física del pasaporte, sin DOM: qué hojas tiene el libro, qué se ve en cada
// momento, cuánto mide y cómo se mueve una hoja al soltarla.
//
// El libro es una pila de hojas que giran sobre el lomo. `abiertas` es cuántas están pasadas:
// 0 es el pasaporte cerrado por la tapa y `hojas.length` cerrado por la contratapa.

export type Modo = "doble" | "simple";

export type Cara =
  | { tipo: "tapa" }
  | { tipo: "contratapa" }
  | { tipo: "guarda" }
  | { tipo: "datos" }
  | { tipo: "visado"; indice: number }
  | { tipo: "reverso" };

export type Hoja = { frente: Cara; dorso: Cara };

/** Alto entre ancho de una página de pasaporte (88 × 125 mm, ICAO TD3). */
export const PROPORCION_PAGINA = 125 / 88;

/** Por debajo de este ancho de página no caben dos a la vez: se ve una sola. */
const ANCHO_MINIMO_DOBLE = 280;

/**
 * El tamaño de página que cabe en el escenario. A doble página si las dos caben con un ancho
 * cómodo; si no, una sola, con el lomo a la izquierda.
 */
export function medirLibro(ancho: number, alto: number): { modo: Modo; ancho: number; alto: number } {
  const altoDoble = Math.min(alto * 0.9, ((ancho * 0.92) / 2) * PROPORCION_PAGINA);
  const anchoDoble = altoDoble / PROPORCION_PAGINA;
  if (anchoDoble >= ANCHO_MINIMO_DOBLE) {
    return { modo: "doble", ancho: Math.floor(anchoDoble), alto: Math.floor(altoDoble) };
  }
  const anchoSimple = Math.max(160, Math.min(ancho - 40, (alto * 0.92) / PROPORCION_PAGINA));
  return { modo: "simple", ancho: Math.floor(anchoSimple), alto: Math.floor(anchoSimple * PROPORCION_PAGINA) };
}

/**
 * Las hojas del libro para `visados` páginas de visado (par a doble página).
 * Doble: la página de datos va detrás de la tapa y cada hoja lleva dos visados.
 * Simple: cada página va en el frente de su hoja; detrás, el reverso del papel.
 */
export function construirHojas(visados: number, modo: Modo): Hoja[] {
  const visado = (indice: number): Cara => ({ tipo: "visado", indice });
  if (modo === "doble") {
    const interiores = Array.from({ length: Math.ceil(visados / 2) }, (_, j): Hoja => ({
      frente: visado(2 * j),
      dorso: 2 * j + 1 < visados ? visado(2 * j + 1) : { tipo: "reverso" },
    }));
    return [{ frente: { tipo: "tapa" }, dorso: { tipo: "datos" } }, ...interiores, { frente: { tipo: "guarda" }, dorso: { tipo: "contratapa" } }];
  }
  return [
    { frente: { tipo: "tapa" }, dorso: { tipo: "guarda" } },
    { frente: { tipo: "datos" }, dorso: { tipo: "reverso" } },
    ...Array.from({ length: visados }, (_, i): Hoja => ({ frente: visado(i), dorso: { tipo: "reverso" } })),
    { frente: { tipo: "guarda" }, dorso: { tipo: "contratapa" } },
  ];
}

/** Las caras que se ven con `abiertas` hojas pasadas, como "hoja:lado". */
export function carasVisibles(abiertas: number, modo: Modo, total: number): string[] {
  const caras: string[] = [];
  if (modo === "doble") {
    if (abiertas > 0) caras.push(`${abiertas - 1}:dorso`);
    if (abiertas < total) caras.push(`${abiertas}:frente`);
  } else {
    caras.push(abiertas < total ? `${abiertas}:frente` : `${total - 1}:dorso`);
  }
  return caras;
}

/**
 * Página que representa lo que se ve, para la URL (?p=): 0 es la de datos y n el visado n.
 * null con el pasaporte cerrado o en la guarda final.
 */
export function paginaVisible(abiertas: number, modo: Modo, total: number): number | null {
  if (abiertas <= 0 || abiertas >= total) return null;
  if (modo === "doble") return abiertas === 1 ? 1 : 2 * (abiertas - 1);
  return abiertas >= total - 1 ? null : abiertas - 1;
}

/** Cuántas hojas hay que pasar para ver la página `pagina` (0 = datos). */
export function abiertasParaPagina(pagina: number, modo: Modo, total: number): number {
  const abiertas = modo === "doble" ? Math.floor(pagina / 2) + 1 : pagina + 1;
  return Math.min(Math.max(abiertas, 1), total - 1);
}

/**
 * Cuánto se desplaza el libro para quedar centrado: cerrado se ve media anchura (la tapa o la
 * contratapa) y abierto, el pliego entero. En simple solo se ve la página de la derecha.
 */
export function desplazamientoLibro(modo: Modo, anchoPagina: number, anguloTapa: number, anguloContratapa: number) {
  const tapa = anguloTapa / 180;
  const contratapa = anguloContratapa / 180;
  if (modo === "simple") return -anchoPagina / 2 + contratapa * anchoPagina;
  return (-anchoPagina / 2) * (1 - tapa) + (anchoPagina / 2) * contratapa;
}

// --- Movimiento --------------------------------------------------------------------------

/** Velocidad (px/ms) a partir de la cual un gesto rápido pasa la hoja aunque no llegue a la mitad. */
export const UMBRAL_VELOCIDAD = 0.11;

/** Al soltar una hoja: ¿termina de pasar (180) o vuelve (0)? `vx` < 0 es hacia la izquierda. */
export function anguloAlSoltar(angulo: number, vx: number): 0 | 180 {
  if (vx < -UMBRAL_VELOCIDAD) return 180;
  if (vx > UMBRAL_VELOCIDAD) return 0;
  return angulo > 90 ? 180 : 0;
}

/** Píxeles de arrastre que dan media vuelta a una hoja. */
export function recorridoArrastre(modo: Modo, anchoPagina: number) {
  return modo === "doble" ? anchoPagina * 1.5 : anchoPagina;
}

export type Muelle = { rigidez: number; amortiguacion: number };

/**
 * Muelle definido como en Apple: duración percibida (s) y rebote (0 = sin rebote).
 * Masa 1; con rebote 0 la amortiguación es la crítica.
 */
export function muelle(duracion: number, rebote = 0): Muelle {
  const w = (2 * Math.PI) / duracion;
  return { rigidez: w * w, amortiguacion: 2 * w * (1 - rebote) };
}

export const MUELLE_HOJA = muelle(0.5);
export const MUELLE_INCLINACION = muelle(0.7, 0.2);

/** Un paso del muelle (Euler semiimplícito, estable con dt pequeños). Devuelve [x, v]. */
export function pasoMuelle(x: number, v: number, objetivo: number, dt: number, m: Muelle): [number, number] {
  let posicion = x;
  let velocidad = v;
  const pasos = Math.max(1, Math.ceil(dt / (1 / 240)));
  const h = dt / pasos;
  for (let i = 0; i < pasos; i++) {
    velocidad += (-m.rigidez * (posicion - objetivo) - m.amortiguacion * velocidad) * h;
    posicion += velocidad * h;
  }
  return [posicion, velocidad];
}

/** Lento al principio y al final, como una tapa que pesa. */
export function suavizado(t: number) {
  const x = Math.min(Math.max(t, 0), 1);
  return x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2;
}

/** Una hoja que se levanta con el aire de la tapa y vuelve a caer: 0 → amplitud → 0. */
export function aleteo(t: number, inicio: number, duracion: number, amplitud: number) {
  const x = (t - inicio) / duracion;
  if (x <= 0 || x >= 1) return 0;
  return amplitud * Math.sin(Math.PI * x) * (1 - x * 0.35);
}
