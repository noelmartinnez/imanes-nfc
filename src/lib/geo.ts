// Cálculos del globo de /mundo. Coordenadas de lugar en [latitud, longitud] (como las da
// un móvil o Google Maps); d3-geo trabaja en [longitud, latitud].

import { geoArea, geoBounds, geoDistance } from "d3-geo";
import type { Feature, MultiPolygon, Polygon } from "geojson";

export type Coords = [lat: number, lon: number];
export type LonLat = [lon: number, lat: number];
export type PaisGeo = Feature<Polygon | MultiPolygon, { n: string }>;

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 8;
export const INCLINACION_MAX = 80;

export const limitar = (valor: number, min: number, max: number) => Math.min(max, Math.max(min, valor));

export const aLonLat = ([lat, lon]: Coords): LonLat => [lon, lat];

/** Mediana de la latitud y de la longitud: ignora fotos sueltas hechas lejos del lugar. */
export function medianaCoords(lista: Coords[]): Coords | null {
  if (!lista.length) return null;
  const mediana = (valores: number[]) => {
    const v = [...valores].sort((a, b) => a - b);
    const m = Math.floor(v.length / 2);
    return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
  };
  return [mediana(lista.map((c) => c[0])), mediana(lista.map((c) => c[1]))];
}

/** Rotación de d3 que deja `centro` en el medio de la bola. */
export const rotacionHacia = ([lon, lat]: LonLat): [number, number, number] => [-lon, -lat, 0];

/** Punto del mapa que está en el centro de la bola con esta rotación. */
export const centroDe = ([lambda, phi]: [number, number, number?]): LonLat => [-lambda, -phi];

/** ¿Se ve el punto desde este centro? (está en la cara visible de la bola) */
export const esVisible = (punto: LonLat, centro: LonLat) => geoDistance(punto, centro) < Math.PI / 2 - 0.02;

/** El polígono más grande de un país: la península, no las islas lejanas. */
export function poligonoPrincipal(pais: PaisGeo): Feature<Polygon> {
  const g = pais.geometry;
  const poligonos = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  const mayor = poligonos
    .map((coordinates) => ({ type: "Feature" as const, properties: {}, geometry: { type: "Polygon" as const, coordinates } }))
    .reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a));
  return mayor;
}

/**
 * Centro y zoom para encuadrar un país: su territorio principal más los lugares con
 * fotos (si hay uno en Canarias, entra también).
 */
export function encuadre(pais: PaisGeo, lugares: LonLat[]): { centro: LonLat; zoom: number } {
  let [[oeste, sur], [este, norte]] = geoBounds(poligonoPrincipal(pais));
  if (este < oeste) este += 360; // cruza el antimeridiano
  for (const [lonOriginal, lat] of lugares) {
    const lon = lonOriginal < oeste - 180 ? lonOriginal + 360 : lonOriginal;
    oeste = Math.min(oeste, lon);
    este = Math.max(este, lon);
    sur = Math.min(sur, lat);
    norte = Math.max(norte, lat);
  }
  const centro: LonLat = [((((oeste + este) / 2 + 180) % 360) + 360) % 360 - 180, (sur + norte) / 2];
  const semiAncho = ((este - oeste) / 2) * Math.cos((centro[1] * Math.PI) / 180);
  const semiAlto = (norte - sur) / 2;
  const radio = (Math.max(semiAncho, semiAlto, 0.4) * Math.PI) / 180;
  // Con zoom k, un punto a `radio` del centro queda a sin(radio)·k del radio de la bola.
  return { centro, zoom: limitar(0.55 / Math.sin(radio), ZOOM_MIN, ZOOM_MAX) };
}

/** Curva de entrada y salida fuerte para movimientos dentro de la pantalla. */
export const suaveEntradaSalida = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);
