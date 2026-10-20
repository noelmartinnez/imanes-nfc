import type { Metadata } from "next";
import { ViewTransition } from "react";
import { ListaPaises } from "@/components/ListaPaises";
import { getMundo } from "@/lib/contenido";

export const metadata: Metadata = { title: "Por país" };

export default function PaginaLista() {
  return (
    <ViewTransition enter="vista" exit="vista" default="none">
      <main className="hoja min-h-dvh pt-[calc(4.75rem+env(safe-area-inset-top))] pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-[72rem] px-4 lg:px-8">
          <h1 className="mt-8 mb-8 text-[clamp(3rem,12vw,6rem)] leading-[0.86] font-extrabold uppercase font-stretch-extra-condensed sm:mt-12 sm:mb-12">
            Por país
          </h1>
          <ListaPaises paises={getMundo()} />
        </div>
      </main>
    </ViewTransition>
  );
}
