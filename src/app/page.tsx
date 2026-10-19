import Link from "next/link";
import { Indice } from "@/components/Indice";
import { Microtexto, Roseta } from "@/components/Papel";
import { Pliego } from "@/components/Pliego";
import { getLugares, getPaises } from "@/lib/contenido";

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

export default function Inicio() {
  const paises = getPaises();
  const lugares = getLugares();

  return (
    <main className="hoja mx-auto min-h-dvh max-w-[36rem] px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <header className="box-content flex h-14 items-center justify-between pt-[env(safe-area-inset-top)]">
        <h1 className="text-[17px] font-extrabold tracking-[0.2em] uppercase font-stretch-extra-condensed">Imanes</h1>
        <div className="flex items-center gap-3">
          {/* En pantallas estrechas, el recuento cede su sitio al enlace al globo */}
          <p className="font-mono text-[12px] font-medium tracking-[0.06em] text-texto-suave uppercase max-[419px]:hidden">
            {plural(lugares.length, "lugar", "lugares")} · {plural(paises.length, "país", "países")}
          </p>
          <Link
            href="/mundo"
            className="control pulsable -mr-2 flex h-11 items-center gap-1.5 px-2 text-[17px] font-extrabold tracking-[0.2em] uppercase font-stretch-extra-condensed hover:text-cobalto"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="8" cy="8" r="6.3" />
              <ellipse cx="8" cy="8" rx="2.8" ry="6.3" />
              <path d="M1.9 8h12.2M2.9 4.8h10.2M2.9 11.2h10.2" strokeWidth="1.1" />
            </svg>
            Mundo
          </Link>
        </div>
      </header>
      <Microtexto texto="Imanes" />

      {lugares.length ? (
        <>
          <section aria-label="Sellos" className="relative isolate pt-10 pb-20">
            <Roseta className="top-[45%] left-1/2 -z-10 w-[600px] max-w-none -translate-1/2 opacity-60" />
            <Pliego lugares={lugares} />
          </section>
          <Indice paises={paises.filter((p) => p.lugares.length)} />
        </>
      ) : (
        <p className="mt-16 text-center text-[15px] text-texto-suave">
          Todavía no hay ningún lugar. Crea una carpeta en content/ para añadir el primero.
        </p>
      )}
    </main>
  );
}
