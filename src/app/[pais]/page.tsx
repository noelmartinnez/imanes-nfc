import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bandera } from "@/components/Bandera";
import { Indice } from "@/components/Indice";
import { Cabecera, Microtexto, Roseta } from "@/components/Papel";
import { Pliego } from "@/components/Pliego";
import { getPais, getPaises } from "@/lib/contenido";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPaises().map((p) => ({ pais: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[pais]">): Promise<Metadata> {
  const pais = getPais((await params).pais);
  return pais ? { title: pais.nombre } : {};
}

export default async function PaginaPais({ params }: PageProps<"/[pais]">) {
  const pais = getPais((await params).pais);
  if (!pais) notFound();

  return (
    <main className="hoja min-h-dvh pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-[48rem] px-4 lg:px-8">
        <Cabecera volver={{ href: "/lista", texto: "Por país" }} />
        <Microtexto texto={pais.nombre} />

        <h1 className="mt-8 flex items-center gap-3 text-[clamp(3rem,15.5vw,5.25rem)] leading-[0.86] font-extrabold uppercase font-stretch-extra-condensed">
          <Bandera iso={pais.iso} className="h-[0.42em] w-[0.63em]" />
          {pais.nombre}
        </h1>

        <section aria-label="Sellos" className="relative isolate pt-10 pb-16">
          <Roseta className="top-1/2 left-1/2 -z-10 w-[560px] max-w-none -translate-1/2" />
          <Pliego lugares={pais.lugares} />
        </section>

        <Indice paises={[pais]} conPais={false} />
      </div>
    </main>
  );
}
