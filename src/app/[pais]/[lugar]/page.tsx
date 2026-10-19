import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bandera } from "@/components/Bandera";
import { Galeria } from "@/components/Galeria";
import { Cabecera, Microtexto, Mrz, Roseta } from "@/components/Papel";
import { datosSello } from "@/components/Pliego";
import { Sello } from "@/components/Sello";
import { getLugar, getLugares } from "@/lib/contenido";
import { fechaLarga } from "@/lib/fecha";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLugares().map((l) => ({ pais: l.pais.slug, lugar: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[pais]/[lugar]">): Promise<Metadata> {
  const { pais, lugar: slug } = await params;
  const lugar = getLugar(pais, slug);
  if (!lugar) return {};
  return {
    title: lugar.nombre,
    description: `${lugar.nombre}, ${lugar.pais.nombre}${lugar.fecha ? ` · ${fechaLarga(lugar.fecha)}` : ""}`,
    openGraph: lugar.fotos[0] ? { images: [{ url: lugar.fotos[0].src }] } : undefined,
  };
}

export default async function PaginaLugar({ params }: PageProps<"/[pais]/[lugar]">) {
  const { pais, lugar: slug } = await params;
  const lugar = getLugar(pais, slug);
  if (!lugar) notFound();

  return (
    <main className="hoja mx-auto min-h-dvh max-w-[36rem] px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <Cabecera volver={{ href: "/", texto: "Imanes" }} pagina={lugar.pagina} />
      <Microtexto texto={`${lugar.nombre} ${lugar.pais.nombre}`} />

      <div className="relative isolate mt-4">
        <Roseta className="top-[42%] -right-44 -z-10 w-[560px] max-w-none" />
        <Galeria
          fotos={lugar.fotos}
          nombre={lugar.nombre}
          sello={<Sello id="sello" {...datosSello(lugar)} />}
          datos={
            <div className="mt-12">
              <h1 className="text-[clamp(3rem,15.5vw,5.25rem)] leading-[0.86] font-extrabold text-balance uppercase font-stretch-extra-condensed">
                {lugar.nombre}
              </h1>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-regla pt-3">
                <div>
                  <dt className="font-mono text-[11px] font-semibold tracking-[0.12em] text-texto-suave uppercase">País</dt>
                  <dd className="mt-1.5 flex items-center gap-2 text-[17px] font-semibold">
                    <Bandera iso={lugar.pais.iso} className="h-[14px] w-[21px]" />
                    {lugar.pais.nombre}
                  </dd>
                </div>
                {lugar.fecha ? (
                  <div>
                    <dt className="font-mono text-[11px] font-semibold tracking-[0.12em] text-texto-suave uppercase">Fecha</dt>
                    <dd className="mt-1.5 text-[17px] font-semibold">
                      <time dateTime={lugar.fecha}>{fechaLarga(lugar.fecha)}</time>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          }
        />
      </div>

      <Mrz lugar={lugar.nombre} pais={lugar.pais.nombre} iso3={lugar.pais.iso3} fecha={lugar.fecha} numero={lugar.pagina} />
    </main>
  );
}
