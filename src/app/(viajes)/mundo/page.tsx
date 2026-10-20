import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Mundo } from "@/components/mundo/Mundo";
import { getMundo } from "@/lib/contenido";

export const metadata: Metadata = { title: "Mundo" };

export default function PaginaMundo() {
  return (
    <ViewTransition enter="vista" exit="vista" default="none">
      <main className="pantalla-mundo hoja fixed inset-0 overflow-hidden">
        <h1 className="sr-only">Mundo</h1>
        <Mundo paises={getMundo()} />
      </main>
    </ViewTransition>
  );
}
