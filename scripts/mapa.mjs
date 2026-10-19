// Prepara el mapa del globo (/mundo) a partir de Natural Earth (paquete world-atlas):
//   - todo el mundo a escala 1:110m (ligero)
//   - los países con fotos a 1:50m (costas más finas e incluye microestados)
// Escribe public/mapa/mundo.json (GeoJSON) con el código de 3 letras de cada país y su
// nombre en español. Se ejecuta solo antes de dev, build y test.
//
// Uso: npm run mapa

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import paises from "i18n-iso-countries";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
paises.registerLocale(require("i18n-iso-countries/langs/es.json"));

const RAIZ = process.cwd();
const CONTENIDO = path.join(RAIZ, "content");
const SALIDA = path.join(RAIZ, "public", "mapa", "mundo.json");

function redondear(coordenadas, decimales) {
  const f = 10 ** decimales;
  return Array.isArray(coordenadas[0])
    ? coordenadas.map((c) => redondear(c, decimales))
    : coordenadas.map((n) => Math.round(n * f) / f);
}

function paisesDe(topologia, decimales) {
  return feature(topologia, topologia.objects.countries).features.map((f) => {
    const iso3 = f.id ? paises.numericToAlpha3(f.id) ?? null : null;
    return {
      type: "Feature",
      id: iso3,
      properties: { n: (iso3 && paises.getName(iso3, "es")) || f.properties.name },
      geometry: { ...f.geometry, coordinates: redondear(f.geometry.coordinates, decimales) },
    };
  });
}

async function visitados() {
  const codigos = new Set();
  for (const e of await readdir(CONTENIDO, { withFileTypes: true })) {
    const ficha = path.join(CONTENIDO, e.name, "pais.json");
    if (e.isDirectory() && existsSync(ficha)) codigos.add(JSON.parse(await readFile(ficha, "utf8")).iso3);
  }
  return codigos;
}

async function main() {
  const conFotos = await visitados();
  const detalle = new Map(paisesDe(require("world-atlas/countries-50m.json"), 3).map((f) => [f.id, f]));
  const mundo = paisesDe(require("world-atlas/countries-110m.json"), 2).filter((f) => !conFotos.has(f.id));

  for (const iso3 of conFotos) {
    const pais = detalle.get(iso3);
    if (pais) mundo.push(pais);
    else console.warn(`  ! ${iso3}: no está en el mapa de Natural Earth; se verá sin resaltar.`);
  }

  await mkdir(path.dirname(SALIDA), { recursive: true });
  const json = JSON.stringify({ type: "FeatureCollection", features: mundo });
  await writeFile(SALIDA, json);
  console.log(`Mapa: ${mundo.length} países (${conFotos.size} con fotos), ${Math.round(json.length / 1024)} KB.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
