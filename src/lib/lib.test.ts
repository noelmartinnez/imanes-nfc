import { readFileSync } from "node:fs";
import { geoContains } from "d3-geo";
import { describe, expect, it } from "vitest";
import { repartirEnColumnas } from "./columnas";
import {
  getLugar,
  getLugares,
  getPaises,
  getRutas,
  getVecinos,
  ordenarFotos,
  ordenarPaises,
  PAIS_DE_CASA,
  type Lugar,
  type Pais,
} from "./contenido";
import { getPasaporte, paginaDeLugar, paginarPasaporte } from "./pasaporte";
import { aLonLat, type PaisGeo } from "./geo";
import { leerEtiquetas, resolverEtiqueta, validarEtiquetas } from "./etiquetas";
import { compararFechas, fechaLarga, fechaSello } from "./fecha";
import { digitoControl, lineasMrz, lineasMrzPasaporte, transliterar } from "./mrz";
import { hash, rotacionSello } from "./sello";

describe("fechas", () => {
  it("formatea mes y día en español", () => {
    expect(fechaLarga("2024-08")).toBe("agosto de 2024");
    expect(fechaLarga("2024-08-04")).toBe("4 de agosto de 2024");
    expect(fechaSello("2024-08")).toBe("AGO 2024");
    expect(fechaSello("2024-08-04")).toBe("04 AGO 2024");
  });

  it("rechaza fechas mal escritas", () => {
    expect(() => fechaLarga("08/2024")).toThrow(/AAAA-MM/);
    expect(() => fechaLarga("2024-13")).toThrow();
  });

  it("ordena las fechas y deja al final las que faltan", () => {
    expect(["2025-01", null, "2023-04"].sort(compararFechas)).toEqual(["2023-04", "2025-01", null]);
  });
});

describe("MRZ", () => {
  it("calcula los dígitos de control del estándar ICAO", () => {
    // Ejemplos del documento ICAO 9303
    expect(digitoControl("L898902C3")).toBe("6");
    expect(digitoControl("740812")).toBe("2");
    expect(digitoControl("120415")).toBe("9");
  });

  it("translitera tildes y espacios", () => {
    expect(transliterar("San Sebastián")).toBe("SAN<SEBASTIAN");
    expect(transliterar("España")).toBe("ESPANA");
  });

  it("genera dos líneas de 44 caracteres", () => {
    const [a, b] = lineasMrz({ lugar: "Sofía", pais: "Bulgaria", iso3: "BGR", fecha: "2025-10", numero: 3 });
    expect(a).toHaveLength(44);
    expect(b).toHaveLength(44);
    expect(a.startsWith("V<BGRSOFIA<<BULGARIA<")).toBe(true);
    expect(b.slice(13, 19)).toBe("2510<<");
  });
});

describe("sellos", () => {
  it("son estables para el mismo lugar", () => {
    expect(hash("italia/roma")).toBe(hash("italia/roma"));
    expect(rotacionSello(hash("italia/roma"))).not.toBe(0);
  });
});

describe("columnas", () => {
  it("equilibra la altura y conserva el índice", () => {
    const fotos = [
      { ancho: 1, alto: 2 },
      { ancho: 1, alto: 1 },
      { ancho: 1, alto: 1 },
      { ancho: 1, alto: 1 },
    ];
    const [izq, der] = repartirEnColumnas(fotos, 2);
    expect(izq.map((c) => c.indice)).toEqual([0, 3]);
    expect(der.map((c) => c.indice)).toEqual([1, 2]);
  });
});

describe("etiquetas", () => {
  const rutas = new Set(["/", "/italia/roma"]);

  it("resuelve ids conocidos y nada más", () => {
    const etiquetas = { roma: "/italia/roma" };
    expect(resolverEtiqueta("roma", etiquetas)).toBe("/italia/roma");
    expect(resolverEtiqueta("paris", etiquetas)).toBeNull();
    expect(resolverEtiqueta("constructor", etiquetas)).toBeNull();
  });

  it("detecta destinos rotos o inseguros", () => {
    expect(validarEtiquetas({ roma: "/italia/roma", album: "https://photos.app.goo.gl/x" }, rutas)).toEqual([]);
    expect(validarEtiquetas({ paris: "/francia/paris" }, rutas)).toHaveLength(1);
    expect(validarEtiquetas({ raro: "http://ejemplo.com" }, rutas)).toHaveLength(1);
  });

  it("rechaza ids con mayúsculas o espacios", () => {
    expect(() => leerEtiquetas({ "San Sebastian": "/" })).toThrow(/minúsculas/);
  });
});

describe("contenido real del repo", () => {
  it("se carga sin errores y todas las etiquetas apuntan a algo que existe", () => {
    expect(getPaises().length).toBeGreaterThan(0);
    expect(validarEtiquetas(leerEtiquetas(), getRutas())).toEqual([]);
  });

  it("cada lugar con ubicación cae dentro de su país (detecta latitud y longitud al revés)", () => {
    const mapa = JSON.parse(readFileSync("public/mapa/mundo.json", "utf8")) as { features: PaisGeo[] };
    for (const lugar of getLugares()) {
      if (!lugar.coords) continue;
      const pais = mapa.features.find((f) => f.id === lugar.pais.iso3);
      expect(pais, `${lugar.pais.iso3} no está en el mapa`).toBeDefined();
      expect(geoContains(pais!, aLonLat(lugar.coords)), `${lugar.ruta} cae fuera de ${lugar.pais.nombre}`).toBe(true);
    }
  });

  it("numera las páginas sin huecos", () => {
    const paginas = getPaises()
      .flatMap((p) => p.lugares.map((l) => l.pagina))
      .sort((a, b) => a - b);
    expect(paginas).toEqual(paginas.map((_, i) => i + 1));
    expect(getLugar("espana", "madrid")?.pais.iso3).toBe("ESP");
  });

  it("pasando páginas se recorre todo el pasaporte, de la primera a la última", () => {
    const lugares = getLugares();
    expect(getVecinos(lugares[0]).anterior).toBeNull();
    expect(getVecinos(lugares.at(-1)!).siguiente).toBeNull();

    const recorrido = [lugares[0].ruta];
    for (let v = getVecinos(lugares[0]).siguiente; v; ) {
      recorrido.push(v.ruta);
      v = getVecinos(v).siguiente;
    }
    expect(recorrido).toEqual(lugares.map((l) => l.ruta));
  });
});

describe("pasaporte", () => {
  const lugar = (pais: string, slug: string, fecha: string | null) =>
    ({
      slug,
      ruta: `/${pais}/${slug}`,
      nombre: slug,
      fecha,
      forma: "circulo",
      tinta: "carmin",
      semilla: hash(slug),
      pais: { slug: pais, nombre: pais, iso: "XX", iso3: "XXX" },
    }) as Lugar;
  const pais = (slug: string, iso3: string, fechas: (string | null)[]) =>
    ({
      slug,
      nombre: slug,
      iso: "XX",
      iso3,
      tinta: "verde",
      lugares: fechas.map((f, i) => lugar(slug, `${slug}-${i}`, f)),
    }) as Pais;

  it("pone primero el país de casa y después el resto por su primer viaje", () => {
    const paises = [
      pais("italia", "ITA", ["2024-05"]),
      pais("sin-fecha", "AAA", [null]),
      pais("espana", PAIS_DE_CASA, ["2025-01"]),
      pais("bulgaria", "BGR", ["2025-03", "2023-10"]),
    ];
    expect(ordenarPaises(paises).map((p) => p.slug)).toEqual(["espana", "bulgaria", "italia", "sin-fecha"]);
  });

  it("agrupa los sellos por país, sigue en otra página si no caben y deja páginas libres", () => {
    const paginas = paginarPasaporte([pais("espana", "ESP", Array(5).fill(null)), pais("italia", "ITA", [null])], 4);
    expect(paginas.map((p) => [p.numero, p.pais?.slug ?? null, p.sellos.length])).toEqual([
      [1, "espana", 4],
      [2, "espana", 1],
      [3, "italia", 1],
      [4, null, 0],
    ]);
    expect(paginarPasaporte([pais("italia", "ITA", [null])])).toHaveLength(2);
    expect(paginaDeLugar(paginas, "/italia/italia-0")).toBe(3);
  });

  it("su MRZ tiene dos líneas de 44 y los dígitos de control del TD3", () => {
    const [a, b] = lineasMrzPasaporte({
      titular: "Worldtour",
      codigo: "WTR",
      numero: "WT0000014",
      desde: "2023-10",
      hasta: "2025-04-26",
      paises: 4,
      lugares: 14,
    });
    expect(a).toHaveLength(44);
    expect(b).toHaveLength(44);
    expect(a.startsWith("P<WTRWORLDTOUR<<")).toBe(true);
    expect(b.slice(0, 10)).toBe(`WT0000014${digitoControl("WT0000014")}`);
    expect(b.slice(13, 19)).toBe("2310<<");
    expect(b.slice(21, 27)).toBe("250426");
    const compuesto = b.slice(0, 10) + b.slice(13, 20) + b.slice(21, 43);
    expect(b[43]).toBe(digitoControl(compuesto));
  });

  it("con el contenido real, España abre el pasaporte y cada lugar tiene su sello", () => {
    const { paginas, datos } = getPasaporte();
    expect(paginas[0].pais?.slug).toBe("espana");
    expect(paginas.length % 2).toBe(0);
    expect(paginas.flatMap((p) => p.sellos)).toHaveLength(getLugares().length);
    expect(datos.lugares).toBe(getLugares().length);
  });
});

describe("orden de las fotos", () => {
  it("van por hora de toma, las que no la tienen al final y por nombre", () => {
    const fotos = [
      { archivo: "IMG_0240.JPG", tomada: "2025-04-27T21:31:00" },
      { archivo: "IMG_10.JPG", tomada: null },
      { archivo: "IMG_9652.JPG", tomada: "2025-04-26T11:00:00" },
      { archivo: "IMG_9.JPG" },
      { archivo: "IMG_0769.JPEG", tomada: "2025-04-26T12:02:00" },
    ];
    expect(ordenarFotos(fotos).map((f) => f.archivo)).toEqual([
      "IMG_9652.JPG",
      "IMG_0769.JPEG",
      "IMG_0240.JPG",
      "IMG_9.JPG",
      "IMG_10.JPG",
    ]);
  });

  it("deshace empates por nombre y no toca la lista original", () => {
    const fotos = [
      { archivo: "b.jpg", tomada: "2025-01-01T10:00:00" },
      { archivo: "a.jpg", tomada: "2025-01-01T10:00:00" },
    ];
    expect(ordenarFotos(fotos).map((f) => f.archivo)).toEqual(["a.jpg", "b.jpg"]);
    expect(fotos[0].archivo).toBe("b.jpg");
  });
});
