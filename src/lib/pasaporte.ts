// Las páginas del pasaporte de la portada: la de datos y las de visados, con un sello por lugar.
// Los sellos de un mismo país comparten página; si no caben, el país sigue en la siguiente.

import { getPaises, type Lugar, type Pais } from "./contenido";
import { compararFechas } from "./fecha";
import type { Forma, Tinta } from "./sello";

/** Sellos que caben en una página sin taparse los nombres. */
export const SELLOS_POR_PAGINA = 4;

export type SelloPagina = {
  id: string;
  ruta: string;
  nombre: string;
  pais: string;
  codigo: string;
  fecha: string | null;
  forma: Forma;
  tinta: Tinta;
  semilla: number;
};

export type PaginaVisado = {
  /** Número impreso en la página, desde 1. */
  numero: number;
  /** null en las páginas que aún no tienen sellos. */
  pais: Pick<Pais, "slug" | "nombre" | "iso" | "tinta"> | null;
  sellos: SelloPagina[];
};

export type DatosPasaporte = {
  paises: number;
  lugares: number;
  desde: string | null;
  hasta: string | null;
  /** La foto de la página de datos: la portada del viaje más reciente. */
  retrato: { src: string; blur: string; lugar: string } | null;
};

export type Pasaporte = { datos: DatosPasaporte; paginas: PaginaVisado[] };

function sello(l: Lugar): SelloPagina {
  return {
    id: `pasaporte-${l.pais.slug}-${l.slug}`,
    ruta: l.ruta,
    nombre: l.nombre,
    pais: l.pais.nombre,
    codigo: l.pais.iso3,
    fecha: l.fecha,
    forma: l.forma,
    tinta: l.tinta,
    semilla: l.semilla,
  };
}

/**
 * Reparte los lugares en páginas, país a país y en el orden en que llegan. Al final siempre
 * quedan páginas libres, y en total son pares para que las dobles páginas cuadren.
 */
export function paginarPasaporte(paises: Pais[], porPagina = SELLOS_POR_PAGINA): PaginaVisado[] {
  const paginas: PaginaVisado[] = [];
  for (const pais of paises) {
    for (let i = 0; i < pais.lugares.length; i += porPagina) {
      paginas.push({
        numero: paginas.length + 1,
        pais: { slug: pais.slug, nombre: pais.nombre, iso: pais.iso, tinta: pais.tinta },
        sellos: pais.lugares.slice(i, i + porPagina).map(sello),
      });
    }
  }
  const libres = paginas.length % 2 ? 1 : 2;
  for (let i = 0; i < libres; i++) paginas.push({ numero: paginas.length + 1, pais: null, sellos: [] });
  return paginas;
}

export function datosPasaporte(paises: Pais[]): DatosPasaporte {
  const lugares = paises.flatMap((p) => p.lugares);
  const fechas = lugares.map((l) => l.fecha).filter((f): f is string => Boolean(f)).sort();
  const reciente = lugares
    .filter((l) => l.fotos.length)
    // El más reciente primero; los que no tienen fecha, al final.
    .sort((a, b) => Number(Boolean(b.fecha)) - Number(Boolean(a.fecha)) || compararFechas(b.fecha, a.fecha))[0];
  return {
    paises: paises.filter((p) => p.lugares.length).length,
    lugares: lugares.length,
    desde: fechas[0] ?? null,
    hasta: fechas.at(-1) ?? null,
    retrato: reciente ? { src: reciente.fotos[0].src, blur: reciente.fotos[0].blur, lugar: reciente.nombre } : null,
  };
}

/** La página del pasaporte donde está el sello de un lugar. */
export function paginaDeLugar(paginas: PaginaVisado[], ruta: string) {
  return paginas.find((p) => p.sellos.some((s) => s.ruta === ruta))?.numero ?? null;
}

let cache: Pasaporte | null = null;

export function getPasaporte(): Pasaporte {
  const paises = getPaises().filter((p) => p.lugares.length);
  cache ??= { datos: datosPasaporte(paises), paginas: paginarPasaporte(paises) };
  return cache;
}
