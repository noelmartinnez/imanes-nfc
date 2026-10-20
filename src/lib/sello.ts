// Tintas y formas de los sellos. Cuando lugar.json o pais.json no las indican,
// se eligen de forma estable a partir del nombre de la carpeta.

export const TINTAS = ["carmin", "violeta", "cobalto", "verde"] as const;
export const FORMAS = ["circulo", "rectangulo", "octogono"] as const;

export type Tinta = (typeof TINTAS)[number];
export type Forma = (typeof FORMAS)[number];

/** Hash FNV-1a de 32 bits: el mismo texto siempre da el mismo número. */
export function hash(texto: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function elegir<T>(opciones: readonly T[], semilla: number) {
  return opciones[semilla % opciones.length];
}

const ROTACIONES = [-9, 6, -5, 8, -7, 4, -4, 9, -6, 5];

/** Nombre de la transición que lleva el sello del pasaporte a la página de su lugar. */
export function transicionSello(ruta: string) {
  return `sello${ruta.replaceAll("/", "-")}`;
}

/** Inclinación del sello en grados; nunca recto, como un sello hecho a mano. */
export function rotacionSello(semilla: number) {
  return elegir(ROTACIONES, semilla);
}
