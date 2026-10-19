import Link from "next/link";
import { lineasMrz } from "@/lib/mrz";
import { NumeroPerforado } from "./NumeroPerforado";

/** Barra superior de cada hoja: volver y número de página perforado. */
export function Cabecera({ volver, pagina }: { volver?: { href: string; texto: string }; pagina?: number }) {
  return (
    <header className="flex h-14 items-center justify-between pt-[env(safe-area-inset-top)] box-content">
      {volver ? (
        <Link
          href={volver.href}
          className="control pulsable -ml-2 flex h-11 items-center gap-1.5 px-2 text-[17px] font-extrabold tracking-[0.2em] text-texto-suave uppercase font-stretch-extra-condensed hover:text-texto"
        >
          <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {volver.texto}
        </Link>
      ) : (
        <span />
      )}
      {pagina ? <NumeroPerforado numero={pagina} /> : null}
    </header>
  );
}

/** Línea de microimpresión: el texto repetido en letra diminuta, como en el papel de seguridad. */
export function Microtexto({ texto }: { texto: string }) {
  const linea = `${texto.toUpperCase().replace(/\s+/g, "·")} — `.repeat(50);
  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-regla/70 py-px font-mono text-[5px] leading-[7px] font-semibold tracking-[0.06em] whitespace-nowrap text-guilloche select-none"
    >
      {linea}
    </div>
  );
}

/** Roseta de guilloché detrás del sello. */
export function Roseta({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/papel/roseta.svg" alt="" aria-hidden className={`pointer-events-none absolute select-none ${className}`} />;
}

/** Zona de lectura mecánica al pie de la página del visado. */
export function Mrz(props: Parameters<typeof lineasMrz>[0]) {
  const [a, b] = lineasMrz(props);
  return (
    <div aria-hidden className="mt-14 -mx-4 bg-papel-hondo/80 px-4 py-3 select-none">
      <pre className="overflow-hidden font-mono text-[min(3.15vw,15px)] leading-[1.5] font-medium tracking-[0.02em] text-texto/80">
        {a}
        {"\n"}
        {b}
      </pre>
    </div>
  );
}
