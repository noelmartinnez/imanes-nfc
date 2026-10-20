import { ViewTransition } from "react";
import { Pasaporte } from "@/components/pasaporte/Pasaporte";
import { Roseta } from "@/components/Papel";
import { getPasaporte } from "@/lib/pasaporte";

export default function Inicio() {
  const libro = getPasaporte();

  return (
    <ViewTransition enter="vista" exit="vista" default="none">
      <main className="pantalla-pasaporte mesa fixed inset-0 isolate flex flex-col overflow-hidden pt-[calc(4.75rem+env(safe-area-inset-top))] pb-[calc(5.25rem+env(safe-area-inset-bottom))] sm:pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        <h1 className="sr-only">Pasaporte</h1>
        <Roseta className="top-1/2 left-1/2 -z-10 w-[min(130vmin,1100px)] max-w-none -translate-1/2 opacity-50" />
        {libro.datos.lugares ? (
          <Pasaporte libro={libro} />
        ) : (
          <p className="m-auto max-w-[34ch] text-center text-[15px] text-texto-suave">
            Todavía no hay ningún viaje. Crea una carpeta en content/ para añadir el primero.
          </p>
        )}
      </main>
    </ViewTransition>
  );
}
