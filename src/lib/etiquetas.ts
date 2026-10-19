// Etiquetas NFC: cada pegatina guarda https://<dominio>/m/<id> para siempre.
// content/tags.json decide a dónde lleva cada id: una página de la web ("/italia/roma")
// o una dirección externa ("https://photos.app.goo.gl/…").

import { z } from "zod";
import datos from "../../content/tags.json";

export const ID_ETIQUETA = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type Etiquetas = Record<string, string>;

const EsquemaEtiquetas = z.record(z.string(), z.string().min(1));

export function leerEtiquetas(json: unknown = datos): Etiquetas {
  const resultado = EsquemaEtiquetas.safeParse(json);
  if (!resultado.success) {
    throw new Error(`content/tags.json no es válido: ${z.prettifyError(resultado.error)}`);
  }
  for (const id of Object.keys(resultado.data)) {
    if (!ID_ETIQUETA.test(id)) {
      throw new Error(`content/tags.json: el id "${id}" solo puede tener minúsculas, números y guiones`);
    }
  }
  return resultado.data;
}

export function resolverEtiqueta(id: string, etiquetas: Etiquetas) {
  return Object.hasOwn(etiquetas, id) ? etiquetas[id] : null;
}

/** Devuelve los problemas encontrados (vacío si todo está bien). */
export function validarEtiquetas(etiquetas: Etiquetas, rutasInternas: Set<string>) {
  const errores: string[] = [];
  for (const [id, destino] of Object.entries(etiquetas)) {
    if (destino.startsWith("/")) {
      if (!rutasInternas.has(destino)) errores.push(`"${id}" apunta a ${destino}, que no existe`);
      continue;
    }
    let url: URL | null = null;
    try {
      url = new URL(destino);
    } catch {}
    if (url?.protocol !== "https:") {
      errores.push(`"${id}" debe apuntar a una ruta ("/pais/lugar") o a una URL https://`);
    }
  }
  return errores;
}
