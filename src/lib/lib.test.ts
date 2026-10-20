import { readFileSync } from "node:fs";
import { geoContains } from "d3-geo";
import { describe, expect, it } from "vitest";
import { repartirEnColumnas } from "./columnas";
import { getLugar, getLugares, getPaises, getRutas, getVecinos, ordenarFotos } from "./contenido";
import { aLonLat, type PaisGeo } from "./geo";
import { leerEtiquetas, resolverEtiqueta, validarEtiquetas } from "./etiquetas";
import { compararFechas, fechaLarga, fechaSello } from "./fecha";
import { digitoControl, lineasMrz, transliterar } from "./mrz";
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
