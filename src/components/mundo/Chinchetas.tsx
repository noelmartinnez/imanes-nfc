"use client";

import { useEffect, useMemo, useRef } from "react";
import type { LugarMundo } from "@/lib/contenido";
import { aLonLat } from "@/lib/geo";
import type { MotorGlobo } from "./motor";

type Props = {
  motor: MotorGlobo | null;
  lugares: LugarMundo[];
  /** Clase de color de la tinta del país (text-carmin…). */
  tinta: string;
  activo: string | null;
  alElegir: (ruta: string) => void;
};

/**
 * Chinchetas de los lugares del país elegido: botones HTML sobre el canvas, colocados
 * en cada fotograma por el motor (sin pasar por el estado de React).
 */
export function Chinchetas({ motor, lugares, tinta, activo, alElegir }: Props) {
  const nodos = useRef(new Map<string, HTMLDivElement>());
  const conUbicacion = useMemo(() => lugares.filter((l) => l.coords), [lugares]);

  useEffect(() => {
    if (!motor) return;
    return motor.observar(() => {
      for (const lugar of conUbicacion) {
        const nodo = nodos.current.get(lugar.ruta);
        if (!nodo) continue;
        const p = motor.proyectar(aLonLat(lugar.coords!));
        nodo.style.visibility = p ? "visible" : "hidden";
        if (p) nodo.style.transform = `translate(${p[0]}px, ${p[1]}px)`;
      }
    });
  }, [motor, conUbicacion]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {conUbicacion.map((lugar, i) => (
        <div
          key={lugar.ruta}
          ref={(nodo) => {
            if (nodo) nodos.current.set(lugar.ruta, nodo);
            else nodos.current.delete(lugar.ruta);
          }}
          className="absolute top-0 left-0"
          style={{ visibility: "hidden" }}
        >
          <button
            type="button"
            onClick={() => alElegir(lugar.ruta)}
            aria-pressed={activo === lugar.ruta}
            aria-description={activo === lugar.ruta ? "Toca otra vez para abrir sus fotos" : undefined}
            className={`chincheta control pointer-events-auto relative -mt-[22px] -ml-[22px] flex size-11 items-center justify-center ${tinta}`}
            style={{ "--i": i } as React.CSSProperties}
          >
            <span aria-hidden className="size-3.5 rounded-full border-2 border-papel bg-current" />
            <span
              className={`absolute top-1/2 left-[34px] -translate-y-1/2 rounded-[2px] border border-current bg-papel px-1.5 py-0.5 text-[15px] leading-none font-extrabold tracking-[0.08em] whitespace-nowrap uppercase font-stretch-extra-condensed ${
                activo === lugar.ruta ? "bg-current" : ""
              }`}
            >
              <span className={activo === lugar.ruta ? "text-papel" : ""}>{lugar.nombre}</span>
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
