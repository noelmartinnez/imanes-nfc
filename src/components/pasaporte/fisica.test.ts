import { describe, expect, it } from "vitest";
import {
  abiertasParaPagina,
  anguloAlSoltar,
  carasVisibles,
  construirHojas,
  desplazamientoLibro,
  medirLibro,
  MUELLE_HOJA,
  paginaVisible,
  pasoMuelle,
} from "./fisica";

describe("hojas del pasaporte", () => {
  it("a doble página, los datos van detrás de la tapa y cada hoja lleva dos visados", () => {
    const hojas = construirHojas(4, "doble");
    expect(hojas).toHaveLength(4);
    expect(hojas[0]).toEqual({ frente: { tipo: "tapa" }, dorso: { tipo: "datos" } });
    expect(hojas[1]).toEqual({ frente: { tipo: "visado", indice: 0 }, dorso: { tipo: "visado", indice: 1 } });
    expect(hojas.at(-1)?.dorso).toEqual({ tipo: "contratapa" });
  });

  it("a una página, cada página va en el frente de su hoja", () => {
    const hojas = construirHojas(4, "simple");
    expect(hojas).toHaveLength(7);
    expect(hojas[1].frente).toEqual({ tipo: "datos" });
    expect(hojas[2].frente).toEqual({ tipo: "visado", indice: 0 });
    expect(hojas.every((h, i) => i === 0 || i === hojas.length - 1 || h.dorso.tipo === "reverso")).toBe(true);
  });

  it("al abrirlo se ven los datos frente al primer visado", () => {
    expect(carasVisibles(0, "doble", 4)).toEqual(["0:frente"]);
    expect(carasVisibles(1, "doble", 4)).toEqual(["0:dorso", "1:frente"]);
    expect(carasVisibles(4, "doble", 4)).toEqual(["3:dorso"]);
    expect(carasVisibles(7, "simple", 7)).toEqual(["6:dorso"]);
  });

  it("la página de la URL lleva de vuelta a la misma doble página, en los dos modos", () => {
    for (const modo of ["doble", "simple"] as const) {
      const total = construirHojas(6, modo).length;
      for (let abiertas = 1; abiertas < total; abiertas++) {
        const pagina = paginaVisible(abiertas, modo, total);
        if (pagina === null) continue;
        expect(abiertasParaPagina(pagina, modo, total), `${modo} ${abiertas}`).toBe(abiertas);
      }
    }
    expect(paginaVisible(0, "doble", 5)).toBeNull();
    expect(abiertasParaPagina(99, "doble", 5)).toBe(4);
  });
});

describe("medidas", () => {
  it("en un portátil va a doble página y en un móvil, a una", () => {
    expect(medirLibro(1440, 700).modo).toBe("doble");
    const movil = medirLibro(390, 620);
    expect(movil.modo).toBe("simple");
    expect(movil.ancho).toBeLessThanOrEqual(350);
    expect(movil.alto / movil.ancho).toBeCloseTo(125 / 88, 1);
  });

  it("cerrado, el libro se desplaza para centrar la tapa", () => {
    expect(desplazamientoLibro("doble", 400, 0, 0)).toBe(-200);
    expect(desplazamientoLibro("doble", 400, 180, 0)).toBe(0);
    expect(desplazamientoLibro("doble", 400, 180, 180)).toBe(200);
    expect(desplazamientoLibro("simple", 300, 180, 0)).toBe(-150);
  });
});

describe("gesto de pasar página", () => {
  it("un gesto rápido pasa la hoja aunque no llegue a la mitad, y uno lento depende de dónde se suelte", () => {
    expect(anguloAlSoltar(20, -0.3)).toBe(180);
    expect(anguloAlSoltar(160, 0.3)).toBe(0);
    expect(anguloAlSoltar(100, 0)).toBe(180);
    expect(anguloAlSoltar(80, -0.05)).toBe(0);
  });

  it("el muelle de la hoja llega a su sitio sin pasarse", () => {
    let [x, v] = [0, 0];
    let maximo = 0;
    for (let i = 0; i < 90; i++) {
      [x, v] = pasoMuelle(x, v, 180, 1 / 60, MUELLE_HOJA);
      maximo = Math.max(maximo, x);
    }
    expect(x).toBeCloseTo(180, 0);
    expect(maximo).toBeLessThanOrEqual(180.01);
  });
});
