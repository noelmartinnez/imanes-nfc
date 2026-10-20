// Lee los países y lugares de content/ durante el build.
//
//   content/<pais>/pais.json          { "nombre", "iso", "iso3", "tinta"? }
//   content/<pais>/<lugar>/lugar.json { "nombre", "fecha"?, "sello"?, "portada"?, "textos"? }
//   content/fotos.generated.json      lo genera `npm run fotos`
//
// Si algo no es válido, el build falla con un mensaje que dice qué archivo arreglar.

import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { compararFechas, FECHA_REGEX } from "./fecha";
import { medianaCoords, type Coords } from "./geo";
import { elegir, FORMAS, hash, TINTAS, type Forma, type Tinta } from "./sello";

const CONTENIDO = path.join(process.cwd(), "content");
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const EsquemaPais = z.strictObject({
  nombre: z.string().min(1),
  iso: z.string().regex(/^[A-Z]{2}$/, "código de 2 letras, p. ej. ES"),
  iso3: z.string().regex(/^[A-Z]{3}$/, "código de 3 letras, p. ej. ESP"),
  tinta: z.enum(TINTAS).optional(),
});

const EsquemaLugar = z.strictObject({
  nombre: z.string().min(1),
  fecha: z.string().regex(FECHA_REGEX, "usa AAAA-MM o AAAA-MM-DD").optional(),
  sello: z.enum(FORMAS).optional(),
  portada: z.string().optional(),
  textos: z.record(z.string(), z.string()).optional(),
  coords: z
    .tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)], {
      error: "usa [latitud, longitud], p. ej. [43.32, -1.98]",
    })
    .optional(),
});

const EsquemaGps = z.tuple([z.number(), z.number()]);

const EsquemaFotos = z.record(
  z.string(),
  z.array(
    z.object({
      archivo: z.string(),
      src: z.string(),
      ancho: z.number().int().positive(),
      alto: z.number().int().positive(),
      blur: z.string(),
      fecha: z.string().nullable(),
      tomada: z.string().nullable().optional(),
      gps: EsquemaGps.nullable().optional(),
    }),
  ),
);

type FotoProcesada = z.infer<typeof EsquemaFotos>[string][number];

/** Por orden de toma (hora de la cámara); las que no la tienen, al final y por nombre. */
export function ordenarFotos<T extends Pick<FotoProcesada, "archivo" | "tomada">>(fotos: T[]): T[] {
  return [...fotos].sort(
    (a, b) =>
      compararFechas(a.tomada ?? null, b.tomada ?? null) ||
      a.archivo.localeCompare(b.archivo, "es", { numeric: true }),
  );
}

export type Foto = {
  src: string;
  ancho: number;
  alto: number;
  blur: string;
  alt: string;
};

export type Lugar = {
  slug: string;
  ruta: string;
  nombre: string;
  fecha: string | null;
  /** [latitud, longitud]: la de lugar.json o, si no, la mediana del GPS de las fotos. */
  coords: Coords | null;
  forma: Forma;
  tinta: Tinta;
  semilla: number;
  pagina: number;
  fotos: Foto[];
  pais: { slug: string; nombre: string; iso: string; iso3: string };
};

export type Pais = {
  slug: string;
  ruta: string;
  nombre: string;
  iso: string;
  iso3: string;
  tinta: Tinta;
  lugares: Lugar[];
};

function leerJson<T>(archivo: string, esquema: z.ZodType<T>): T {
  const relativo = path.relative(process.cwd(), archivo).replaceAll("\\", "/");
  let json: unknown;
  try {
    json = JSON.parse(fs.readFileSync(archivo, "utf8"));
  } catch (error) {
    throw new Error(`${relativo}: no se puede leer como JSON (${(error as Error).message})`);
  }
  const resultado = esquema.safeParse(json);
  if (!resultado.success) {
    throw new Error(`${relativo} no es válido:\n${z.prettifyError(resultado.error)}`);
  }
  return resultado.data;
}

function carpetasCon(dir: string, ficha: string) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(dir, e.name, ficha)))
    .map((e) => {
      if (!SLUG.test(e.name)) {
        throw new Error(
          `La carpeta "${e.name}" no vale como URL: usa minúsculas sin tildes ni espacios (p. ej. san-sebastian)`,
        );
      }
      return e.name;
    });
}

function cargar(): Pais[] {
  const archivoFotos = path.join(CONTENIDO, "fotos.generated.json");
  const fotos = fs.existsSync(archivoFotos) ? leerJson(archivoFotos, EsquemaFotos) : {};

  const paises: Pais[] = carpetasCon(CONTENIDO, "pais.json").map((slugPais) => {
    const dirPais = path.join(CONTENIDO, slugPais);
    const pais = leerJson(path.join(dirPais, "pais.json"), EsquemaPais);
    const tinta = pais.tinta ?? elegir(TINTAS, hash(slugPais));

    const lugares = carpetasCon(dirPais, "lugar.json").map((slug): Lugar => {
      const lugar = leerJson(path.join(dirPais, slug, "lugar.json"), EsquemaLugar);
      const semilla = hash(`${slugPais}/${slug}`);
      const procesadas = ordenarFotos(fotos[`${slugPais}/${slug}`] ?? []);
      const portada = lugar.portada
        ? procesadas.findIndex((f) => f.archivo === lugar.portada)
        : 0;
      if (lugar.portada && portada === -1) {
        throw new Error(
          `content/${slugPais}/${slug}/lugar.json: la portada "${lugar.portada}" no está entre las fotos (¿has ejecutado npm run fotos?)`,
        );
      }
      const ordenadas = procesadas.length
        ? [procesadas[portada], ...procesadas.filter((_, i) => i !== portada)]
        : [];
      const fechaFotos = procesadas
        .map((f) => f.fecha)
        .filter((f): f is string => Boolean(f))
        .sort()[0];
      const coords =
        lugar.coords ?? medianaCoords(procesadas.map((f) => f.gps).filter((g): g is Coords => Boolean(g)));
      if (!coords) {
        console.warn(
          `  ! content/${slugPais}/${slug}: sin ubicación (ni "coords" en lugar.json ni GPS en las fotos); no tendrá chincheta en el globo.`,
        );
      }

      return {
        slug,
        ruta: `/${slugPais}/${slug}`,
        nombre: lugar.nombre,
        fecha: lugar.fecha ?? fechaFotos ?? null,
        coords,
        forma: lugar.sello ?? elegir(FORMAS, semilla),
        tinta,
        semilla,
        pagina: 0,
        fotos: ordenadas.map((f, i) => ({
          src: f.src,
          ancho: f.ancho,
          alto: f.alto,
          blur: f.blur,
          alt: lugar.textos?.[f.archivo] ?? `${lugar.nombre}, foto ${i + 1} de ${ordenadas.length}`,
        })),
        pais: { slug: slugPais, nombre: pais.nombre, iso: pais.iso, iso3: pais.iso3 },
      };
    });

    return { slug: slugPais, ruta: `/${slugPais}`, nombre: pais.nombre, iso: pais.iso, iso3: pais.iso3, tinta, lugares };
  });

  // Las páginas del pasaporte se numeran por orden de viaje.
  const todos = paises.flatMap((p) => p.lugares).sort(ordenLugares);
  todos.forEach((lugar, i) => (lugar.pagina = i + 1));
  for (const pais of paises) pais.lugares.sort(ordenLugares);
  return paises.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

function ordenLugares(a: Lugar, b: Lugar) {
  return compararFechas(a.fecha, b.fecha) || a.nombre.localeCompare(b.nombre, "es");
}

let cache: Pais[] | null = null;

export function getPaises() {
  cache ??= cargar();
  return cache;
}

export function getPais(slug: string) {
  return getPaises().find((p) => p.slug === slug) ?? null;
}

export function getLugares() {
  return getPaises()
    .flatMap((p) => p.lugares)
    .sort((a, b) => a.pagina - b.pagina);
}

export function getLugar(pais: string, lugar: string) {
  return getPais(pais)?.lugares.find((l) => l.slug === lugar) ?? null;
}

export type Vecino = Pick<Lugar, "ruta" | "nombre" | "fecha" | "pagina">;

/** Las páginas de antes y de después en el pasaporte; null en la primera y en la última. */
export function getVecinos(lugar: Pick<Lugar, "pagina">): { anterior: Vecino | null; siguiente: Vecino | null } {
  const lugares = getLugares();
  const vecino = (pagina: number): Vecino | null => {
    const l = lugares.find((x) => x.pagina === pagina);
    return l ? { ruta: l.ruta, nombre: l.nombre, fecha: l.fecha, pagina: l.pagina } : null;
  };
  return { anterior: vecino(lugar.pagina - 1), siguiente: vecino(lugar.pagina + 1) };
}

export type PaisMundo = Omit<Pais, "lugares"> & { lugares: LugarMundo[] };
export type LugarMundo = Pick<Lugar, "slug" | "ruta" | "nombre" | "fecha" | "coords"> & {
  portada: Pick<Foto, "src" | "blur"> | null;
};

/** Lo justo para el globo de /mundo: sin la lista completa de fotos. */
export function getMundo(): PaisMundo[] {
  return getPaises()
    .filter((p) => p.lugares.length)
    .map(({ lugares, ...pais }) => ({
      ...pais,
      lugares: lugares.map((l) => ({
        slug: l.slug,
        ruta: l.ruta,
        nombre: l.nombre,
        fecha: l.fecha,
        coords: l.coords,
        portada: l.fotos[0] ? { src: l.fotos[0].src, blur: l.fotos[0].blur } : null,
      })),
    }));
}

/** Todas las rutas internas que existen, para validar las etiquetas. */
export function getRutas() {
  return new Set(["/", ...getPaises().flatMap((p) => [p.ruta, ...p.lugares.map((l) => l.ruta)])]);
}
