import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MotorGlobo } from "./motor";

// Un navegador mínimo: canvas que no dibuja nada y requestAnimationFrame manual.
let reloj = 0;
let pendientes = new Map<number, FrameRequestCallback>();
let siguienteId = 1;

/** Avanza un fotograma de 60 Hz y ejecuta lo que estuviera pedido. */
function fotograma() {
  reloj += 1000 / 60;
  const ahora = pendientes;
  pendientes = new Map();
  for (const fn of ahora.values()) fn(reloj);
}

function motorDePrueba() {
  const ctx = new Proxy({} as Record<string | symbol, unknown>, {
    get: (t, k) => (k in t ? t[k] : () => {}),
    set: (t, k, v) => ((t[k] = v), true),
  });
  const lienzo = { width: 0, height: 0, getContext: () => ctx } as unknown as HTMLCanvasElement;
  const motor = new MotorGlobo(lienzo, { reducido: false, centro: [0, 20], color: () => "#000" });
  motor.redimensionar(800, 600, { arriba: 0, abajo: 0 });
  return motor;
}

beforeEach(() => {
  reloj = 0;
  pendientes = new Map();
  vi.spyOn(performance, "now").mockImplementation(() => reloj);
  vi.stubGlobal("window", { devicePixelRatio: 1 });
  vi.stubGlobal("document", { hidden: false, addEventListener() {}, removeEventListener() {} });
  vi.stubGlobal(
    "Image",
    class {
      onload: (() => void) | null = null;
      src = "";
    },
  );
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
    pendientes.set(siguienteId, fn);
    return siguienteId++;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => pendientes.delete(id));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("bucle del globo", () => {
  it("con inercia nunca deja más de un fotograma pedido", () => {
    const motor = motorDePrueba();
    fotograma();
    motor.agarrar();
    motor.lanzar(1.5, 0.4);
    for (let i = 0; i < 120 && pendientes.size; i++) {
      fotograma();
      expect(pendientes.size).toBeLessThanOrEqual(1);
    }
    motor.destruir();
  });

  it("la inercia frena siempre hacia el mismo lado y termina", () => {
    const motor = motorDePrueba();
    fotograma();
    motor.agarrar();
    motor.lanzar(1.5, 0);
    let anterior = motor.rotacion[0];
    let paso = Infinity;
    let fotogramas = 0;
    while (pendientes.size && fotogramas < 1000) {
      fotograma();
      fotogramas++;
      const avance = motor.rotacion[0] - anterior;
      expect(avance).toBeGreaterThanOrEqual(0);
      expect(avance).toBeLessThanOrEqual(paso + 1e-9);
      paso = avance;
      anterior = motor.rotacion[0];
    }
    expect(pendientes.size).toBe(0);
    expect(motor.enMovimiento).toBe(false);
    motor.destruir();
  });

  it("arrastrar varias veces entre fotogramas pide uno solo", () => {
    const motor = motorDePrueba();
    fotograma();
    motor.agarrar();
    for (let i = 0; i < 5; i++) motor.arrastrar(10, 0);
    expect(pendientes.size).toBe(1);
    fotograma();
    expect(pendientes.size).toBe(0);
    motor.destruir();
  });
});
