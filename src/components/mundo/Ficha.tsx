"use client";

import { useEffect, useRef } from "react";
import type { PaisMundo } from "@/lib/contenido";
import { Bandera } from "../Bandera";
import { FilaLugar } from "../Indice";

const CIERRE_DISTANCIA = 90;
const CIERRE_VELOCIDAD = 0.11; // px/ms, como en el visor

type Props = {
  pais: PaisMundo | null;
  abierta: boolean;
  tinta: string;
  activo: string | null;
  alCerrar: () => void;
};

/**
 * Hoja de papel con los lugares del país elegido. En el móvil sube desde abajo y se
 * cierra arrastrándola; en pantallas anchas aparece a la derecha.
 */
export function Ficha({ pais, abierta, tinta, activo, alCerrar }: Props) {
  const hoja = useRef<HTMLElement>(null);
  const gesto = useRef<{ y: number; t: number; id: number } | null>(null);

  useEffect(() => {
    if (!activo) return;
    hoja.current?.querySelector(`[data-ruta="${CSS.escape(activo)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activo]);

  const soltar = (y: number | null) => {
    const g = gesto.current;
    const el = hoja.current;
    gesto.current = null;
    if (!g || !el) return;
    const dy = y === null ? 0 : Math.max(0, y - g.y);
    const velocidad = dy / (performance.now() - g.t);
    el.style.transition = "";
    if (dy > CIERRE_DISTANCIA || velocidad > CIERRE_VELOCIDAD) {
      el.style.transform = "";
      alCerrar();
    } else {
      el.style.transform = "";
    }
  };

  const n = pais?.lugares.length ?? 0;

  return (
    <section
      ref={hoja}
      aria-label={pais ? `Lugares de ${pais.nombre}` : undefined}
      data-abierta={abierta || undefined}
      inert={!abierta}
      className="ficha hoja absolute inset-x-0 bottom-0 z-20 flex max-h-[54dvh] flex-col border-t border-regla md:inset-x-auto md:top-24 md:right-4 md:bottom-auto md:max-h-[calc(100dvh-8rem)] md:w-[380px] md:rounded-[3px] md:border"
    >
      <div
        className="control shrink-0 touch-none px-4 pt-2 md:touch-auto"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" || (e.target as HTMLElement).closest("button")) return;
          gesto.current = { y: e.clientY, t: performance.now(), id: e.pointerId };
          e.currentTarget.setPointerCapture(e.pointerId);
          if (hoja.current) hoja.current.style.transition = "none";
        }}
        onPointerMove={(e) => {
          const g = gesto.current;
          if (!g || e.pointerId !== g.id || !hoja.current) return;
          const dy = e.clientY - g.y;
          // Hacia arriba se resiste; hacia abajo sigue al dedo.
          hoja.current.style.transform = `translateY(${dy > 0 ? dy : dy * 0.15}px)`;
        }}
        onPointerUp={(e) => soltar(e.clientY)}
        onPointerCancel={() => soltar(null)}
      >
        <div aria-hidden className="mx-auto h-1 w-10 rounded-full bg-regla md:hidden" />
        {pais ? (
          <div className="flex items-center gap-3 pt-3">
            <Bandera iso={pais.iso} className="h-[18px] w-[27px]" />
            <h2 className={`min-w-0 flex-1 truncate text-[40px] leading-[1.05] font-extrabold uppercase font-stretch-extra-condensed ${tinta}`}>
              {pais.nombre}
            </h2>
            <button
              type="button"
              onClick={alCerrar}
              aria-label="Cerrar"
              className="pulsable -mr-2 grid size-11 place-items-center rounded-full text-texto-suave hover:bg-papel-hondo hover:text-texto"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
              </svg>
            </button>
          </div>
        ) : null}
        <p className="mt-1 border-b border-regla pb-2 font-mono text-[12px] font-medium tracking-[0.06em] text-texto-suave uppercase">
          {n} {n === 1 ? "lugar" : "lugares"} con fotos
        </p>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {pais?.lugares.map((lugar) => (
          <li
            key={lugar.ruta}
            data-ruta={lugar.ruta}
            data-activo={activo === lugar.ruta || undefined}
            className="-mx-4 border-b border-regla/80 px-4 transition-colors duration-200 last:border-0 data-[activo]:bg-papel-hondo"
          >
            <FilaLugar ruta={lugar.ruta} nombre={lugar.nombre} fecha={lugar.fecha} portada={lugar.portada} />
          </li>
        ))}
      </ul>
    </section>
  );
}
