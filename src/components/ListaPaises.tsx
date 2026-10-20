"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { LugarMundo, PaisMundo } from "@/lib/contenido";
import { fechaSello } from "@/lib/fecha";
import type { Tinta } from "@/lib/sello";
import { Bandera } from "./Bandera";

// Los nombres de país toman su tinta al pasar por encima y al abrirse.
const TINTA: Record<Tinta, string> = {
  carmin: "group-hover:text-carmin group-aria-expanded:text-carmin",
  violeta: "group-hover:text-violeta group-aria-expanded:text-violeta",
  cobalto: "group-hover:text-cobalto group-aria-expanded:text-cobalto",
  verde: "group-hover:text-verde group-aria-expanded:text-verde",
};

function rango(lugares: LugarMundo[]) {
  const fechas = lugares.map((l) => l.fecha).filter((f): f is string => Boolean(f)).sort();
  if (!fechas.length) return null;
  const [desde, hasta] = [fechaSello(fechas[0]), fechaSello(fechas.at(-1)!)];
  return desde === hasta ? desde : `${desde} – ${hasta}`;
}

/** Un lugar, como una línea de un registro: miniatura, nombre y fecha. */
function FilaRegistro({ lugar }: { lugar: LugarMundo }) {
  return (
    <Link href={lugar.ruta} className="group/lugar pulsable grid grid-cols-[56px_1fr_auto] items-center gap-4 py-3">
      <span className="relative block size-14 overflow-hidden rounded-[2px] bg-papel-hondo">
        {lugar.portada ? (
          <Image
            src={lugar.portada.src}
            alt=""
            fill
            sizes="56px"
            placeholder="blur"
            blurDataURL={lugar.portada.blur}
            className="object-cover"
          />
        ) : null}
      </span>
      <span className="truncate pt-[0.1em] text-[30px] leading-none font-extrabold uppercase transition-colors duration-200 font-stretch-extra-condensed group-hover/lugar:text-cobalto">
        {lugar.nombre}
      </span>
      <span className="font-mono text-[12px] text-texto-suave">{lugar.fecha ? fechaSello(lugar.fecha) : null}</span>
    </Link>
  );
}

function Pais({ pais }: { pais: PaisMundo }) {
  const [abierto, setAbierto] = useState(false);
  const id = `lista-${pais.slug}`;
  const n = pais.lugares.length;
  const fechas = rango(pais.lugares);

  return (
    <li className="border-b border-regla">
      <h2>
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls={id}
          onClick={() => setAbierto((a) => !a)}
          className="group control flex min-h-11 w-full items-center gap-4 py-5 text-left sm:gap-6"
        >
          <Bandera iso={pais.iso} className="h-[18px] w-[27px]" />
          <span
            // El relleno de arriba deja sitio a la tilde de la Ñ, que el recorte de truncate taparía
            className={`min-w-0 flex-1 truncate pt-[0.14em] text-[clamp(2.25rem,7vw,4rem)] leading-[0.9] font-extrabold uppercase transition-colors duration-200 font-stretch-extra-condensed ${TINTA[pais.tinta]}`}
          >
            {pais.nombre}
          </span>
          {fechas ? (
            <span className="hidden font-mono text-[12px] font-medium tracking-[0.06em] text-texto-suave uppercase md:block">{fechas}</span>
          ) : null}
          <span className="font-mono text-[12px] font-medium tracking-[0.06em] text-texto-suave uppercase">
            {n} {n === 1 ? "lugar" : "lugares"}
          </span>
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className="size-4 shrink-0 text-texto-suave transition-[rotate] duration-200 ease-[var(--ease-out)] group-aria-expanded:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6l5 5 5-5" />
          </svg>
        </button>
      </h2>
      <div id={id} role="region" aria-label={`Lugares de ${pais.nombre}`} data-abierto={abierto || undefined} inert={!abierto} className="desplegable">
        <div className="min-h-0 overflow-hidden">
          <ul className="grid pb-4 lg:grid-cols-2 lg:gap-x-12">
            {pais.lugares.map((lugar) => (
              <li key={lugar.ruta} className="border-b border-regla/80">
                <FilaRegistro lugar={lugar} />
              </li>
            ))}
          </ul>
          <Link
            href={`/mundo?pais=${pais.slug}`}
            className="control pulsable -ml-2 mb-6 inline-flex h-11 items-center gap-2 px-2 text-[15px] font-extrabold tracking-[0.14em] text-texto-suave uppercase font-stretch-extra-condensed hover:text-texto"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="8" cy="8" r="6.3" />
              <ellipse cx="8" cy="8" rx="2.8" ry="6.3" />
              <path d="M1.9 8h12.2" strokeWidth="1.1" />
            </svg>
            Ver en el globo
          </Link>
        </div>
      </div>
    </li>
  );
}

/** Todos los países, plegados: al tocar uno se despliegan sus lugares. */
export function ListaPaises({ paises }: { paises: PaisMundo[] }) {
  return (
    <ul className="border-t border-regla">
      {paises.map((pais) => (
        <Pais key={pais.slug} pais={pais} />
      ))}
    </ul>
  );
}
