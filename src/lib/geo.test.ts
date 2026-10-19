import { describe, expect, it } from "vitest";
import { aDecimal } from "../../scripts/fotos.mjs";
import { centroDe, encuadre, esVisible, medianaCoords, rotacionHacia, ZOOM_MAX, type PaisGeo } from "./geo";

// En el sentido de las agujas del reloj, como espera d3-geo (y como viene world-atlas).
const cuadrado = (lon: number, lat: number, lado: number) => [
  [
    [lon, lat],
    [lon, lat + lado],
    [lon + lado, lat + lado],
    [lon + lado, lat],
    [lon, lat],
  ],
];

// Un país de prueba: una "península" de 8° y una isla pequeña muy al sur.
const pais: PaisGeo = {
  type: "Feature",
  properties: { n: "Prueba" },
  geometry: { type: "MultiPolygon", coordinates: [cuadrado(-8, 36, 8), cuadrado(-16, 28, 1)] },
};

describe("GPS de las fotos", () => {
  it("pasa grados, minutos y segundos a decimal con el signo correcto", () => {
    expect(aDecimal([43, 19, 6], "N", "S")).toBe(43.318);
    expect(aDecimal([1, 58, 52], "W", "W")).toBe(-1.981);
    expect(aDecimal([1, 2], "N", "S")).toBeNull();
  });

  it("usa la mediana para ignorar una foto hecha lejos", () => {
    expect(medianaCoords([[43.3, -1.9], [43.32, -1.98], [40.4, -3.7]])).toEqual([43.3, -1.98]);
    expect(medianaCoords([])).toBeNull();
  });
});

describe("globo", () => {
  it("la rotación hacia un punto lo deja en el centro", () => {
    expect(centroDe(rotacionHacia([12.5, 41.9]))).toEqual([12.5, 41.9]);
  });

  it("sabe qué cara de la bola se ve", () => {
    expect(esVisible([0, 0], [10, 0])).toBe(true);
    expect(esVisible([180, 0], [0, 0])).toBe(false);
  });

  it("encuadra el territorio principal, no las islas lejanas", () => {
    const { centro, zoom } = encuadre(pais, []);
    expect(centro[0]).toBeCloseTo(-4, 0);
    expect(centro[1]).toBeCloseTo(40, 0);
    expect(zoom).toBeGreaterThan(3);
  });

  it("amplía el encuadre si hay un lugar con fotos en la isla", () => {
    const solo = encuadre(pais, []);
    const conIsla = encuadre(pais, [[-15.5, 28.5]]);
    expect(conIsla.zoom).toBeLessThan(solo.zoom);
    expect(conIsla.centro[1]).toBeLessThan(solo.centro[1]);
  });

  it("no pasa del zoom máximo en países diminutos", () => {
    const diminuto: PaisGeo = { ...pais, geometry: { type: "Polygon", coordinates: cuadrado(12.4, 41.9, 0.01) } };
    expect(encuadre(diminuto, []).zoom).toBe(ZOOM_MAX);
  });
});
