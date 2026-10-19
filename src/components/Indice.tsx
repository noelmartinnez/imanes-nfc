import Image from "next/image";
import Link from "next/link";
import type { Pais } from "@/lib/contenido";
import { fechaSello } from "@/lib/fecha";
import { Bandera } from "./Bandera";

type Fila = {
  ruta: string;
  nombre: string;
  fecha: string | null;
  portada: { src: string; blur: string } | null;
};

/** Una fila del índice: portada, nombre y fecha. También la usa la ficha del globo. */
export function FilaLugar({ ruta, nombre, fecha, portada }: Fila) {
  return (
    <Link href={ruta} className="pulsable grid grid-cols-[56px_1fr_auto] items-center gap-4 py-3">
      <span className="relative size-14 overflow-hidden rounded-[2px] bg-papel-hondo">
        {portada ? (
          <Image src={portada.src} alt="" fill sizes="56px" placeholder="blur" blurDataURL={portada.blur} className="object-cover" />
        ) : null}
      </span>
      <span className="truncate text-[30px] leading-none font-extrabold uppercase font-stretch-extra-condensed">{nombre}</span>
      <span className="font-mono text-[12px] text-texto-suave">{fecha ? fechaSello(fecha) : null}</span>
    </Link>
  );
}

/** Índice de lugares agrupado por país, con la portada de cada uno. */
export function Indice({ paises, conPais = true }: { paises: Pais[]; conPais?: boolean }) {
  return (
    <nav aria-label="Lugares">
      {paises.map((pais) => (
        <section key={pais.slug} className="mt-10 first:mt-0">
          {conPais ? (
            <h2 className="flex items-center gap-3">
              <Link
                href={pais.ruta}
                className="control flex h-11 items-center gap-2.5 text-[15px] font-bold tracking-[0.12em] uppercase font-stretch-condensed hover:text-cobalto"
              >
                <Bandera iso={pais.iso} className="h-[14px] w-[21px]" />
                {pais.nombre}
              </Link>
              <span aria-hidden className="h-px flex-1 bg-regla" />
              <span className="font-mono text-[12px] text-texto-suave">{pais.lugares.length}</span>
            </h2>
          ) : null}
          <ul>
            {pais.lugares.map((lugar) => (
              <li key={lugar.ruta} className="border-b border-regla/80 last:border-0">
                <FilaLugar ruta={lugar.ruta} nombre={lugar.nombre} fecha={lugar.fecha} portada={lugar.fotos[0] ?? null} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
