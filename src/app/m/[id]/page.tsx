// Punto de entrada de las pegatinas NFC: https://<dominio>/m/<id>
// La URL de la pegatina no cambia nunca; el destino se decide en content/tags.json.
// redirect() responde con 307 (temporal), así el móvil no recuerda el destino y se
// puede cambiar sin volver a grabar la pegatina.

import { notFound, redirect } from "next/navigation";
import { getRutas } from "@/lib/contenido";
import { leerEtiquetas, resolverEtiqueta, validarEtiquetas } from "@/lib/etiquetas";

export const dynamicParams = false;

export function generateStaticParams() {
  const etiquetas = leerEtiquetas();
  const errores = validarEtiquetas(etiquetas, getRutas());
  if (errores.length) {
    throw new Error(`content/tags.json tiene errores:\n- ${errores.join("\n- ")}`);
  }
  return Object.keys(etiquetas).map((id) => ({ id }));
}

export default async function Etiqueta({ params }: PageProps<"/m/[id]">) {
  const { id } = await params;
  const destino = resolverEtiqueta(id, leerEtiquetas());
  if (!destino) notFound();
  redirect(destino);
}
