// Procesa las fotos originales que hay en content/<pais>/<lugar>/ y genera:
//   - public/fotos/<pais>/<lugar>/<nombre>.webp  (lado mayor ≤ 2400 px, sin metadatos)
//   - content/fotos.generated.json               (tamaño, desenfoque, fecha y hora de cada foto)
//
// Uso: npm run fotos
// Las fotos ya procesadas se saltan; las que borres de content/ se borran de public/.
// Si un lugar tiene fotos reales, las provisional-*.jpg de esa carpeta se ignoran.

import { readdir, readFile, writeFile, mkdir, stat, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import exifReader from "exif-reader";

const RAIZ = process.cwd();
const CONTENIDO = path.join(RAIZ, "content");
const SALIDA = path.join(RAIZ, "public", "fotos");
const MANIFIESTO = path.join(CONTENIDO, "fotos.generated.json");
const LADO_MAX = 2400;
const CALIDAD = 82;
const IMAGENES = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);
const HEIC = new Set([".heic", ".heif"]);

const ordenNatural = (a, b) => a.localeCompare(b, "es", { numeric: true });
const esProvisional = (archivo) => archivo.toLowerCase().startsWith("provisional-");

function slugArchivo(archivo) {
  return path
    .parse(archivo)
    .name.normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function subcarpetas(dir) {
  const entradas = await readdir(dir, { withFileTypes: true });
  return entradas.filter((e) => e.isDirectory()).map((e) => e.name).sort(ordenNatural);
}

/** Cuándo se hizo la foto, "AAAA-MM-DDTHH:MM:SS" en la hora local de la cámara, o null.
 *  Sirve para ordenar las fotos de un viaje; la EXIF no lleva zona horaria. */
function fechaHoraExif(metadatos) {
  if (!metadatos.exif) return null;
  try {
    const fecha = exifReader(metadatos.exif).Photo?.DateTimeOriginal;
    return fecha instanceof Date && !Number.isNaN(fecha.getTime())
      ? fecha.toISOString().slice(0, 19)
      : null;
  } catch {
    return null;
  }
}

/** Lo que se guarda de la EXIF en el manifiesto (las fotos publicadas no la llevan). */
function datosExif(metadatos) {
  const tomada = fechaHoraExif(metadatos);
  return { fecha: tomada?.slice(0, 10) ?? null, tomada, gps: gpsExif(metadatos) };
}

/** Grados, minutos y segundos de la EXIF a grados decimales (3 decimales ≈ 100 m). */
export function aDecimal(gms, ref, refNegativa) {
  if (!Array.isArray(gms) || gms.length < 3 || gms.some((n) => typeof n !== "number" || Number.isNaN(n))) {
    return null;
  }
  const valor = gms[0] + gms[1] / 60 + gms[2] / 3600;
  return Math.round((ref === refNegativa ? -valor : valor) * 1000) / 1000;
}

/** Posición [latitud, longitud] de la foto, o null. Solo se guarda en el manifiesto:
 *  las fotos publicadas no llevan GPS. */
export function gpsExif(metadatos) {
  if (!metadatos.exif) return null;
  try {
    const gps = exifReader(metadatos.exif).GPSInfo;
    const lat = aDecimal(gps?.GPSLatitude, gps?.GPSLatitudeRef, "S");
    const lon = aDecimal(gps?.GPSLongitude, gps?.GPSLongitudeRef, "W");
    return lat === null || lon === null ? null : [lat, lon];
  } catch {
    return null;
  }
}

async function procesarFoto(origen, destino) {
  const entrada = await readFile(origen);
  const metadatos = await sharp(entrada).metadata();
  const info = await sharp(entrada)
    .rotate()
    .resize({ width: LADO_MAX, height: LADO_MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: CALIDAD })
    .toFile(destino);
  const miniatura = await sharp(entrada)
    .rotate()
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();
  return {
    ancho: info.width,
    alto: info.height,
    blur: `data:image/webp;base64,${miniatura.toString("base64")}`,
    ...datosExif(metadatos),
  };
}

async function main() {
  const anterior = existsSync(MANIFIESTO)
    ? JSON.parse(await readFile(MANIFIESTO, "utf8"))
    : {};
  const manifiesto = {};
  const avisos = [];
  let nuevas = 0;

  for (const pais of await subcarpetas(CONTENIDO)) {
    if (!existsSync(path.join(CONTENIDO, pais, "pais.json"))) continue;

    for (const lugar of await subcarpetas(path.join(CONTENIDO, pais))) {
      const carpeta = path.join(CONTENIDO, pais, lugar);
      if (!existsSync(path.join(carpeta, "lugar.json"))) continue;

      const clave = `${pais}/${lugar}`;
      const archivos = (await readdir(carpeta)).sort(ordenNatural);
      for (const archivo of archivos) {
        if (HEIC.has(path.extname(archivo).toLowerCase())) {
          avisos.push(`${clave}/${archivo}: HEIC no está soportado; expórtala como JPG.`);
        }
      }
      let fotos = archivos.filter((a) => IMAGENES.has(path.extname(a).toLowerCase()));
      if (fotos.some((a) => !esProvisional(a))) fotos = fotos.filter((a) => !esProvisional(a));

      const carpetaSalida = path.join(SALIDA, pais, lugar);
      await mkdir(carpetaSalida, { recursive: true });
      const previas = new Map((anterior[clave] ?? []).map((f) => [f.archivo, f]));
      const usados = new Set();
      manifiesto[clave] = [];

      for (const archivo of fotos) {
        let nombre = slugArchivo(archivo) || "foto";
        for (let n = 2; usados.has(nombre); n++) nombre = `${slugArchivo(archivo)}-${n}`;
        usados.add(nombre);

        const origen = path.join(carpeta, archivo);
        const destino = path.join(carpetaSalida, `${nombre}.webp`);
        const src = `/fotos/${pais}/${lugar}/${nombre}.webp`;
        const previa = previas.get(archivo);
        const alDia =
          previa?.src === src &&
          existsSync(destino) &&
          (await stat(destino)).mtimeMs >= (await stat(origen)).mtimeMs;

        if (alDia && "gps" in previa && "tomada" in previa) {
          manifiesto[clave].push(previa);
          continue;
        }
        if (alDia) {
          // El WebP está bien; solo faltan datos nuevos de la EXIF: no hace falta recodificarlo.
          const metadatos = await sharp(await readFile(origen)).metadata();
          manifiesto[clave].push({ ...previa, ...datosExif(metadatos) });
          continue;
        }
        try {
          manifiesto[clave].push({ archivo, src, ...(await procesarFoto(origen, destino)) });
          nuevas++;
          console.log(`  ✓ ${clave}/${archivo}`);
        } catch (error) {
          avisos.push(`${clave}/${archivo}: no se pudo procesar (${error.message}).`);
        }
      }

      // Borra de public/ las fotos cuyo original ya no existe.
      for (const salida of await readdir(carpetaSalida)) {
        if (!usados.has(path.parse(salida).name)) await rm(path.join(carpetaSalida, salida));
      }
    }
  }

  await writeFile(MANIFIESTO, `${JSON.stringify(manifiesto, null, 2)}\n`);
  const total = Object.values(manifiesto).reduce((n, fotos) => n + fotos.length, 0);
  console.log(`\n${total} fotos en ${Object.keys(manifiesto).length} lugares (${nuevas} nuevas).`);
  for (const aviso of avisos) console.warn(`  ! ${aviso}`);
}

// Solo se ejecuta como script (los tests importan las funciones de arriba).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
