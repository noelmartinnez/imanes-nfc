import Link from "next/link";
import type { Lugar } from "@/lib/contenido";
import { Sello } from "./Sello";

const ANCHO: Record<Lugar["forma"], string> = {
  circulo: "w-[min(44vw,210px)] sm:w-[164px]",
  octogono: "w-[min(42vw,200px)] sm:w-[158px]",
  rectangulo: "w-[min(46vw,230px)] sm:w-[172px]",
};

/** Una hoja de visados llena de sellos que se pisan unos a otros. */
export function Pliego({ lugares }: { lugares: Lugar[] }) {
  if (lugares.length === 1) {
    const [l] = lugares;
    return (
      <div className="flex justify-center">
        <Link href={l.ruta} className="pulsable block w-[min(64vw,250px)] hover:scale-[1.03]">
          <Sello id={`pliego-${l.pais.slug}-${l.slug}`} {...datosSello(l)} />
        </Link>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 justify-items-center gap-x-1 sm:grid-cols-3">
      {lugares.map((l, i) => {
        const desplazamiento = ((l.semilla % 21) - 10) * 1.2;
        return (
          <li
            key={l.ruta}
            className={`${i >= 2 ? "-mt-8 sm:mt-0" : ""} ${i % 2 ? "translate-y-10 sm:translate-y-0" : ""} ${i % 3 === 1 ? "sm:translate-y-12" : ""}`}
            style={{ marginLeft: `${desplazamiento}px` }}
          >
            <Link href={l.ruta} className={`pulsable block hover:scale-[1.03] ${ANCHO[l.forma]}`}>
              <Sello id={`pliego-${l.pais.slug}-${l.slug}`} {...datosSello(l)} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function datosSello(l: Lugar) {
  return {
    nombre: l.nombre,
    pais: l.pais.nombre,
    codigo: l.pais.iso3,
    fecha: l.fecha,
    forma: l.forma,
    tinta: l.tinta,
    semilla: l.semilla,
  };
}
