import { Navegacion } from "@/components/Navegacion";
import { Microtexto } from "@/components/Papel";
import { getLugares, getPaises } from "@/lib/contenido";

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** Las tres vistas (pasaporte, mundo y lista) comparten cabecera y barra: no se vuelven a montar. */
export default function LayoutViajes({ children }: { children: React.ReactNode }) {
  const paises = getPaises().filter((p) => p.lugares.length);
  const lugares = getLugares();

  return (
    <>
      <header data-cabecera className="fixed inset-x-0 top-0 z-30 bg-papel/90 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-4 px-4 lg:px-8">
          <p className="text-[17px] font-extrabold tracking-[0.2em] uppercase font-stretch-extra-condensed">Worldtour</p>
          <p className="font-mono text-[12px] font-medium tracking-[0.06em] text-texto-suave uppercase">
            {plural(lugares.length, "lugar", "lugares")} · {plural(paises.length, "país", "países")}
          </p>
        </div>
        <Microtexto texto="Worldtour" />
      </header>
      {children}
      <Navegacion />
    </>
  );
}
