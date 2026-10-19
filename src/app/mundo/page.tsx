import type { Metadata } from "next";
import { Mundo } from "@/components/mundo/Mundo";
import { Cabecera, Microtexto } from "@/components/Papel";
import { getMundo } from "@/lib/contenido";

export const metadata: Metadata = { title: "Mundo" };

export default function PaginaMundo() {
  return (
    <main className="pantalla-mundo hoja fixed inset-0 overflow-hidden">
      <Mundo paises={getMundo()} />
      <div data-cabecera-mundo className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-papel/90 pb-1">
        {/* En pantallas anchas, mismo eje izquierdo que los controles y la ficha */}
        <div className="mx-auto max-w-[36rem] px-4 md:mx-0 md:max-w-none">
          <h1 className="sr-only">Mundo</h1>
          <div className="pointer-events-auto">
            <Cabecera volver={{ href: "/", texto: "Imanes" }} />
          </div>
          <Microtexto texto="Mundo" />
        </div>
      </div>
    </main>
  );
}
