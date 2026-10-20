// Lo impreso en cada cara del pasaporte. Todo se mide en unidades del contenedor (cqw), así una
// página se ve igual en un móvil que en una pantalla grande: es un objeto, no una maqueta.

import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { fechaSello } from "@/lib/fecha";
import { lineasMrzPasaporte } from "@/lib/mrz";
import type { DatosPasaporte, PaginaVisado } from "@/lib/pasaporte";
import { transicionSello, type Tinta } from "@/lib/sello";
import { Bandera } from "../Bandera";
import { NumeroPerforado } from "../NumeroPerforado";
import { Microtexto, Roseta } from "../Papel";
import { Sello } from "../Sello";

const COLOR: Record<Tinta, string> = {
  carmin: "text-carmin",
  violeta: "text-violeta",
  cobalto: "text-cobalto",
  verde: "text-verde",
};

/**
 * Dónde cae cada sello según cuántos hay en la página (centro y ancho, en %). Como mucho se
 * rozan por el aro: ningún sello tapa el nombre de otro ni queda bajo su zona de toque.
 */
const RANURAS: Record<number, { x: number; y: number; w: number }[]> = {
  1: [{ x: 50, y: 50, w: 62 }],
  2: [
    { x: 36, y: 31, w: 48 },
    { x: 64, y: 72, w: 48 },
  ],
  3: [
    { x: 30, y: 27, w: 42 },
    { x: 70, y: 47, w: 40 },
    { x: 34, y: 77, w: 42 },
  ],
  4: [
    { x: 28, y: 30, w: 41 },
    { x: 72, y: 34, w: 39 },
    { x: 28, y: 72, w: 41 },
    { x: 72, y: 76, w: 39 },
  ],
};

const condensada = { fontStretch: "62.5%", fontWeight: 800 } as const;

/** Al tocar un sello, la página del lugar sabe que llega volando y no lo vuelve a estampar. */
function marcarVuelo(ruta: string) {
  try {
    sessionStorage.setItem("worldtour:vuelo", ruta);
  } catch {}
}

export function Tapa() {
  const relieve = "url(#brillo-tapa)";
  return (
    <div className="cuero absolute inset-0">
      <svg viewBox="0 0 88 125" aria-hidden className="absolute inset-0 size-full font-sans">
        <defs>
          <linearGradient id="brillo-tapa" data-brillo gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="88" y2="62" spreadMethod="reflect">
            <stop offset="0" style={{ stopColor: "var(--color-tapa-suave)" }} />
            <stop offset="0.42" style={{ stopColor: "var(--color-tapa-texto)" }} />
            <stop offset="0.5" stopColor="#fffaf7" />
            <stop offset="0.58" style={{ stopColor: "var(--color-tapa-texto)" }} />
            <stop offset="1" style={{ stopColor: "var(--color-tapa-suave)" }} />
          </linearGradient>
        </defs>
        <text x="44" y="22" textAnchor="middle" fontSize="5.2" letterSpacing="1.6" fill={relieve} style={{ fontStretch: "75%", fontWeight: 700 }}>
          PASAPORTE
        </text>
        <g fill="none" stroke={relieve}>
          <circle cx="44" cy="58" r="20.6" strokeWidth="0.35" />
          <circle cx="44" cy="58" r="19" strokeWidth="1.1" />
          <circle cx="44" cy="58" r="13.5" strokeWidth="0.7" />
          <ellipse cx="44" cy="58" rx="5.6" ry="13.5" strokeWidth="0.5" />
          <ellipse cx="44" cy="58" rx="10.6" ry="13.5" strokeWidth="0.4" />
          <path d="M30.5 58h27M32.34 51.2h23.32M32.34 64.8h23.32M37.27 46.3h13.46M37.27 69.7h13.46" strokeWidth="0.45" />
        </g>
        <text x="44" y="97" textAnchor="middle" fontSize="12.5" letterSpacing="0.9" fill={relieve} style={condensada}>
          WORLDTOUR
        </text>
        <g fill="none" stroke={relieve} strokeWidth="0.55">
          <rect x="38.6" y="105" width="10.8" height="7" rx="1.1" />
          <circle cx="44" cy="108.5" r="1.7" />
          <path d="M38.6 108.5h3.7M45.7 108.5h3.7" />
        </g>
      </svg>
    </div>
  );
}

export function Contratapa() {
  return <div className="cuero absolute inset-0" />;
}

/** El interior de las tapas: papel más hondo con la roseta. */
export function Guarda() {
  return (
    <div className="mesa absolute inset-0 isolate">
      <Roseta className="top-1/2 left-1/2 -z-10 w-[150cqw] max-w-none -translate-1/2 opacity-70" />
    </div>
  );
}

export function Reverso() {
  return <div className="hoja absolute inset-0" />;
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[2.3cqw] font-semibold tracking-[0.12em] text-texto-suave uppercase">{etiqueta}</dt>
      <dd className="mt-[0.6cqw] font-mono text-[3.6cqw] leading-tight font-medium tracking-[0.04em] uppercase">{children}</dd>
    </div>
  );
}

const dosCifras = (n: number) => String(n).padStart(2, "0");

export function PaginaDatos({ datos }: { datos: DatosPasaporte }) {
  const [a, b] = lineasMrzPasaporte({
    titular: "Worldtour",
    codigo: "WTR",
    numero: `WT${String(datos.lugares).padStart(7, "0")}`,
    desde: datos.desde,
    hasta: datos.hasta,
    paises: datos.paises,
    lugares: datos.lugares,
  });
  return (
    <div className="hoja absolute inset-0 flex flex-col px-[6cqw] pt-[6cqw] pb-[5cqw]">
      <div className="flex items-baseline justify-between gap-[3cqw]">
        <p className="text-[7cqw] leading-none uppercase" style={condensada}>
          Pasaporte
        </p>
        <p className="font-mono text-[2.6cqw] font-semibold tracking-[0.12em] text-texto-suave">P · WTR</p>
      </div>
      <div className="mt-[2.5cqw]">
        <Microtexto texto="Worldtour pasaporte" />
      </div>
      <div className="mt-[5cqw] grid grid-cols-[44cqw_1fr] gap-x-[5cqw]">
        <figure>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-papel-hondo">
            {datos.retrato ? (
              <Image
                src={datos.retrato.src}
                alt=""
                fill
                sizes="200px"
                placeholder="blur"
                blurDataURL={datos.retrato.blur}
                className="object-cover mix-blend-multiply grayscale contrast-[1.08]"
              />
            ) : null}
          </div>
          {datos.retrato ? (
            <figcaption className="mt-[1.4cqw] truncate font-mono text-[2.2cqw] font-semibold tracking-[0.1em] text-texto-suave uppercase">
              {datos.retrato.lugar}
            </figcaption>
          ) : null}
        </figure>
        <dl className="grid content-start gap-[3.4cqw]">
          <Campo etiqueta="Países">{dosCifras(datos.paises)}</Campo>
          <Campo etiqueta="Lugares">{dosCifras(datos.lugares)}</Campo>
          {datos.desde ? <Campo etiqueta="Primer viaje">{fechaSello(datos.desde)}</Campo> : null}
          {datos.hasta ? <Campo etiqueta="Último viaje">{fechaSello(datos.hasta)}</Campo> : null}
        </dl>
      </div>
      <pre aria-hidden className="mt-auto -mx-[2cqw] overflow-hidden bg-papel-hondo/80 px-[2cqw] py-[1.6cqw] font-mono text-[3.25cqw] leading-[1.5] font-medium text-texto/80">
        {a}
        {"\n"}
        {b}
      </pre>
    </div>
  );
}

export function PaginaVisa({ pagina }: { pagina: PaginaVisado }) {
  const ranuras = RANURAS[pagina.sellos.length] ?? RANURAS[4];
  return (
    <div className="hoja absolute inset-0 flex flex-col">
      <div className="flex h-[13cqw] items-end justify-between gap-[3cqw] px-[6cqw]">
        {pagina.pais ? (
          <p
            className={`flex min-w-0 items-center gap-[2cqw] text-[5cqw] leading-none font-bold tracking-[0.12em] uppercase font-stretch-condensed ${COLOR[pagina.pais.tinta]}`}
          >
            <Bandera iso={pagina.pais.iso} className="h-[3.4cqw] w-[5.1cqw]" />
            <span className="truncate">{pagina.pais.nombre}</span>
          </p>
        ) : (
          <span />
        )}
        <NumeroPerforado numero={pagina.numero} className="h-[5.2cqw] shrink-0" />
      </div>
      <div className="mx-[6cqw] mt-[2.5cqw]">
        <Microtexto texto={pagina.pais?.nombre ?? "Visados"} />
      </div>
      <ul className="relative flex-1">
        {pagina.sellos.map((s, i) => {
          const r = ranuras[i];
          const dx = ((s.semilla % 9) - 4) * 0.7;
          const dy = (((s.semilla >>> 4) % 9) - 4) * 0.6;
          // El rectángulo es más bajo y puede ensancharse algo, salvo en una página llena.
          const ancho = s.forma === "rectangulo" && pagina.sellos.length < 4 ? r.w * 1.1 : r.w;
          return (
            <li
              key={s.ruta}
              className="absolute -translate-1/2"
              style={{ left: `${r.x + dx}%`, top: `${r.y + dy}%`, width: `${ancho}%` }}
            >
              <Link
                href={s.ruta}
                // Con Cmd/Ctrl se abre en otra pestaña: allí no llega volando.
                onClick={(e) => !(e.metaKey || e.ctrlKey || e.shiftKey) && marcarVuelo(s.ruta)}
                className="sello-hoja pulsable block rounded-full hover:scale-[1.04]"
                style={{ "--i": i } as React.CSSProperties}
              >
                <ViewTransition name={transicionSello(s.ruta)} share="morph" default="none">
                  <Sello id={s.id} nombre={s.nombre} pais={s.pais} codigo={s.codigo} fecha={s.fecha} forma={s.forma} tinta={s.tinta} semilla={s.semilla} />
                </ViewTransition>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
