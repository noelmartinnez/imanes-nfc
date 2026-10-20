import Link from "next/link";
import type { Vecino } from "@/lib/contenido";
import { fechaSello } from "@/lib/fecha";

function Flecha({ siguiente = false }: { siguiente?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-3" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={siguiente ? "M6 3l5 5-5 5" : "M10 3 5 8l5 5"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Hoja({ vecino, siguiente = false }: { vecino: Vecino; siguiente?: boolean }) {
  return (
    <Link
      href={vecino.ruta}
      rel={siguiente ? "next" : "prev"}
      className={`control pulsable group flex min-w-0 flex-col gap-1.5 py-3 ${siguiente ? "items-end text-right" : "items-start"}`}
    >
      <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-[0.12em] text-texto-suave uppercase group-hover:text-texto">
        {siguiente ? null : <Flecha />}
        Pág. {String(vecino.pagina).padStart(2, "0")}
        {siguiente ? <Flecha siguiente /> : null}
      </span>
      <span className="max-w-full truncate text-[30px] leading-none font-extrabold uppercase font-stretch-extra-condensed">
        {vecino.nombre}
      </span>
      {vecino.fecha ? <span className="font-mono text-[12px] text-texto-suave">{fechaSello(vecino.fecha)}</span> : null}
    </Link>
  );
}

/** Al pie del visado: la página de antes y la de después del pasaporte. */
export function PasarPagina({ anterior, siguiente }: { anterior: Vecino | null; siguiente: Vecino | null }) {
  if (!anterior && !siguiente) return null;
  return (
    <nav aria-label="Páginas del pasaporte" className="mt-14 grid grid-cols-2 gap-4 border-t border-regla">
      {anterior ? <Hoja vecino={anterior} /> : <span />}
      {siguiente ? <Hoja vecino={siguiente} siguiente /> : <span />}
    </nav>
  );
}
