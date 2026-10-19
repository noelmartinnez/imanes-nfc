"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { Foto } from "@/lib/contenido";

type Props = {
  fotos: Foto[];
  nombre: string;
  inicial: number;
  onCerrado: () => void;
};

type Gesto = { x: number; y: number; t: number; id: number; modo: "cerrar" | "pasar" | null };

const CIERRE_DISTANCIA = 110;
const CIERRE_VELOCIDAD = 0.11; // px/ms: un gesto rápido basta aunque sea corto

/**
 * Visor a pantalla completa. Se desliza en horizontal con scroll nativo y se cierra
 * arrastrando hacia abajo, con Esc o con el botón "atrás" del móvil.
 */
export function Visor({ fotos, nombre, inicial, onCerrado }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const pista = useRef<HTMLDivElement>(null);
  const fondo = useRef<HTMLDivElement>(null);
  const figuras = useRef<(HTMLElement | null)[]>([]);
  const gesto = useRef<Gesto | null>(null);
  const historial = useRef(false);
  const cerrando = useRef(false);
  const [actual, setActual] = useState(inicial);
  const [vistas, setVistas] = useState(() => new Set([inicial]));

  const cerrar = useCallback(() => {
    const d = dialogo.current;
    if (!d || cerrando.current) return;
    cerrando.current = true;
    d.dataset.cerrando = "";
    window.setTimeout(() => {
      d.close();
      onCerrado();
    }, 180);
  }, [onCerrado]);

  // El cierre siempre pasa por el historial, así el botón "atrás" de Android también cierra.
  const pedirCierre = useCallback(() => {
    if (historial.current) window.history.back();
    else cerrar();
  }, [cerrar]);

  useLayoutEffect(() => {
    const d = dialogo.current!;
    const p = pista.current!;
    if (!d.open) d.showModal();
    p.scrollLeft = inicial * p.clientWidth;
    if (!historial.current) {
      window.history.pushState({ visor: true }, "");
      historial.current = true;
    }
    const alVolver = () => {
      historial.current = false;
      cerrar();
    };
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, [inicial, cerrar]);

  const ir = (indice: number) => {
    const p = pista.current!;
    const destino = Math.max(0, Math.min(fotos.length - 1, indice));
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    p.scrollTo({ left: destino * p.clientWidth, behavior: suave ? "smooth" : "auto" });
  };

  const alDesplazar = () => {
    const p = pista.current!;
    const indice = Math.round(p.scrollLeft / p.clientWidth);
    if (indice !== actual) {
      setActual(indice);
      setVistas((v) => (v.has(indice) ? v : new Set(v).add(indice)));
    }
  };

  const soltar = (y: number | null) => {
    const g = gesto.current;
    gesto.current = null;
    if (g?.modo !== "cerrar") return;
    const figura = figuras.current[actual];
    const dy = y === null ? 0 : y - g.y;
    const velocidad = dy / (performance.now() - g.t);
    if (dy > CIERRE_DISTANCIA || velocidad > CIERRE_VELOCIDAD) {
      pedirCierre();
      return;
    }
    if (figura) {
      figura.style.transition = "transform 320ms var(--ease-drawer)";
      figura.style.transform = "";
    }
    if (fondo.current) {
      fondo.current.style.transition = "opacity 320ms var(--ease-drawer)";
      fondo.current.style.opacity = "1";
    }
  };

  return (
    <dialog
      ref={dialogo}
      aria-label={`Fotos de ${nombre}`}
      onCancel={(e) => {
        e.preventDefault();
        pedirCierre();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(actual + 1);
        if (e.key === "ArrowLeft") ir(actual - 1);
      }}
      className="visor fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden bg-transparent p-0 text-tapa-texto"
    >
      <div ref={fondo} className="absolute inset-0 bg-tapa-hondo" />

      <div
        ref={pista}
        onScroll={alDesplazar}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" || gesto.current) return;
          gesto.current = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, modo: null };
        }}
        onPointerMove={(e) => {
          const g = gesto.current;
          if (!g || e.pointerId !== g.id) return;
          const dx = e.clientX - g.x;
          const dy = e.clientY - g.y;
          if (g.modo === null) {
            if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) g.modo = "pasar";
            else if (dy > 10 && dy > Math.abs(dx)) {
              g.modo = "cerrar";
              e.currentTarget.setPointerCapture(e.pointerId);
            }
          }
          if (g.modo !== "cerrar") return;
          // Hacia arriba se resiste; hacia abajo sigue al dedo.
          const y = dy > 0 ? dy : dy * 0.2;
          const figura = figuras.current[actual];
          if (figura) {
            figura.style.transition = "none";
            figura.style.transform = `translateY(${y}px) scale(${1 - Math.min(Math.max(dy, 0) / 2400, 0.08)})`;
          }
          if (fondo.current) {
            fondo.current.style.transition = "none";
            fondo.current.style.opacity = String(1 - Math.min(Math.max(dy, 0) / 500, 0.6));
          }
        }}
        onPointerUp={(e) => soltar(e.clientY)}
        onPointerCancel={() => soltar(null)}
        className="visor-pista relative flex h-full snap-x snap-mandatory overflow-x-auto"
      >
        {fotos.map((foto, i) => (
          <div
            key={foto.src}
            className="flex h-full w-full shrink-0 snap-center snap-always items-center justify-center pt-[calc(env(safe-area-inset-top)+3.5rem)] pb-[calc(env(safe-area-inset-bottom)+2.5rem)]"
          >
            <figure ref={(el) => void (figuras.current[i] = el)} className="relative flex h-full w-full items-center justify-center">
              {Math.abs(i - actual) <= 1 || vistas.has(i) ? (
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  width={foto.ancho}
                  height={foto.alto}
                  sizes="100vw"
                  loading="eager"
                  placeholder="blur"
                  blurDataURL={foto.blur}
                  draggable={false}
                  className="h-auto max-h-full w-auto max-w-full object-contain select-none"
                />
              ) : null}
            </figure>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-14 items-center justify-between box-content px-4 pt-[env(safe-area-inset-top)]">
        <p aria-hidden className="font-mono text-[13px] font-medium tracking-[0.06em] text-tapa-suave">
          {String(actual + 1).padStart(2, "0")} / {String(fotos.length).padStart(2, "0")}
        </p>
        <p className="sr-only" aria-live="polite">
          Foto {actual + 1} de {fotos.length}
        </p>
        <button
          type="button"
          onClick={pedirCierre}
          aria-label="Cerrar"
          className="pulsable pointer-events-auto -mr-2 grid size-11 place-items-center rounded-full text-tapa-texto hover:bg-white/8"
        >
          <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </button>
      </div>

      {fotos.length > 1 ? (
        <>
          <Flecha direccion="anterior" desactivada={actual === 0} onClick={() => ir(actual - 1)} />
          <Flecha direccion="siguiente" desactivada={actual === fotos.length - 1} onClick={() => ir(actual + 1)} />
        </>
      ) : null}
    </dialog>
  );
}

function Flecha({ direccion, desactivada, onClick }: { direccion: "anterior" | "siguiente"; desactivada: boolean; onClick: () => void }) {
  const izquierda = direccion === "anterior";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactivada}
      aria-label={izquierda ? "Foto anterior" : "Foto siguiente"}
      className={`pulsable absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-tapa-suave/30 text-tapa-texto hover:bg-white/8 disabled:opacity-25 pointer-fine:grid ${izquierda ? "left-5" : "right-5"}`}
    >
      <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={izquierda ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
      </svg>
    </button>
  );
}
