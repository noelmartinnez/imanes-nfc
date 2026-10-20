"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Pasaporte as Libro } from "@/lib/pasaporte";
import { Contratapa, Guarda, PaginaDatos, PaginaVisa, Reverso, Tapa } from "./Caras";
import {
  abiertasParaPagina,
  carasVisibles,
  construirHojas,
  medirLibro,
  paginaVisible,
  type Cara,
  type Modo,
} from "./fisica";
import { MotorLibro } from "./libro";

/** En la misma sesión, el pasaporte ya no se vuelve a abrir solo. */
const CLAVE_ABIERTO = "worldtour:pasaporte-abierto";
/** Lo que tarda el último sello de la primera doble página en estamparse. */
const DURACION_ESTAMPADO = 900;

type Fase = "oculto" | "apertura" | "estampando" | "listo";
type Medida = { modo: Modo; ancho: number; alto: number };

function leerSesion() {
  try {
    return sessionStorage.getItem(CLAVE_ABIERTO) === "1";
  } catch {
    return false;
  }
}

function guardarSesion() {
  try {
    sessionStorage.setItem(CLAVE_ABIERTO, "1");
  } catch {}
}

function paginaDeUrl() {
  const p = new URLSearchParams(window.location.search).get("p");
  const n = p === null ? NaN : Number(p);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

const pagina = (n: number) => String(n).padStart(2, "0");

/** Lo que se ve, en palabras: para el paginador y para los lectores de pantalla. */
function rotulo(caras: Cara[], libro: Libro) {
  if (caras.some((c) => c.tipo === "tapa")) return "Tapa";
  if (caras.some((c) => c.tipo === "contratapa")) return "Contratapa";
  const visados = caras.flatMap((c) => (c.tipo === "visado" ? [libro.paginas[c.indice]] : []));
  const partes: string[] = [];
  if (caras.some((c) => c.tipo === "datos")) partes.push("Datos");
  if (visados.length) {
    const numeros = visados.map((v) => pagina(v.numero));
    partes.push(`Pág. ${numeros.join("–")}`);
  }
  const paises = [...new Set(visados.flatMap((v) => (v.pais ? [v.pais.nombre] : [])))];
  if (paises.length) partes.push(paises.join(" / "));
  return partes.join(" · ") || "Guarda";
}

function nombreCara(cara: Cara, libro: Libro) {
  switch (cara.tipo) {
    case "tapa":
      return "Tapa del pasaporte. Tócala para abrirlo.";
    case "contratapa":
      return "Contratapa";
    case "datos":
      return "Página de datos";
    case "visado": {
      const p = libro.paginas[cara.indice];
      return p.pais ? `Página ${p.numero}: ${p.pais.nombre}` : `Página ${p.numero}, sin sellos`;
    }
    default:
      return undefined;
  }
}

function Contenido({ cara, libro }: { cara: Cara; libro: Libro }) {
  switch (cara.tipo) {
    case "tapa":
      return <Tapa />;
    case "contratapa":
      return <Contratapa />;
    case "guarda":
      return <Guarda />;
    case "datos":
      return <PaginaDatos datos={libro.datos} />;
    case "visado":
      return <PaginaVisa pagina={libro.paginas[cara.indice]} />;
    case "reverso":
      return <Reverso />;
  }
}

/**
 * El pasaporte de la portada: se abre solo la primera vez, se inclina bajo el puntero y sus
 * hojas se pasan arrastrando, tocando a un lado o con las flechas. Cada sello lleva a su viaje.
 */
export function Pasaporte({ libro }: { libro: Libro }) {
  const escenario = useRef<HTMLDivElement>(null);
  const elLibro = useRef<HTMLDivElement>(null);
  const motor = useRef<MotorLibro | null>(null);
  const estado = useRef<{ modo: Modo; abiertas: number; total: number } | null>(null);
  const [medida, setMedida] = useState<Medida | null>(null);
  const [abiertas, setAbiertas] = useState(0);
  const [fase, setFase] = useState<Fase>("oculto");

  const modo = medida?.modo ?? null;
  const hojas = useMemo(() => (modo ? construirHojas(libro.paginas.length, modo) : []), [modo, libro.paginas.length]);
  const total = hojas.length;
  const visibles = modo ? carasVisibles(abiertas, modo, total) : [];
  const carasVistas = visibles.map((clave) => {
    const [i, lado] = clave.split(":");
    return hojas[Number(i)][lado as "frente" | "dorso"];
  });

  // El tamaño de página sale del hueco libre; si cambia mucho, cambia el modo.
  useEffect(() => {
    const el = escenario.current!;
    const observador = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      const m = medirLibro(r.width, r.height);
      el.style.setProperty("--ancho-pagina", `${m.ancho}px`);
      el.style.setProperty("--alto-pagina", `${m.alto}px`);
      motor.current?.redimensionar(m.ancho);
      setMedida((antes) => (antes?.modo === m.modo && antes.ancho === m.ancho && antes.alto === m.alto ? antes : m));
    });
    observador.observe(el);
    return () => {
      observador.disconnect();
      motor.current?.destruir();
      motor.current = null;
    };
  }, []);

  // Con las hojas ya pintadas: arrancar el motor, o recolocarlo al cambiar de modo.
  const prepararLibro = useEffectEvent((modo: Modo) => {
    const m = medida!;
    const dom = [...elLibro.current!.querySelectorAll<HTMLElement>("[data-hoja]")];
    if (motor.current) {
      // Mismo sitio en el otro modo: la misma página, o cerrado por el mismo lado.
      const antes = estado.current;
      let destino = 1;
      if (antes) {
        const p = paginaVisible(antes.abiertas, antes.modo, antes.total);
        if (p !== null) destino = abiertasParaPagina(p, modo, total);
        else if (antes.abiertas === 0) destino = 0;
        else destino = antes.abiertas >= antes.total ? total : total - 1;
      }
      motor.current.fijar(modo, m.ancho, dom, destino);
      return;
    }
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nuevo = new MotorLibro(escenario.current!, elLibro.current!, { reducido, alCambiar: setAbiertas });
    motor.current = nuevo;
    const p = paginaDeUrl();
    if (p !== null || leerSesion() || reducido) {
      nuevo.fijar(modo, m.ancho, dom, p === null ? 1 : abiertasParaPagina(p, modo, total));
      guardarSesion();
      setFase("listo");
      return;
    }
    nuevo.fijar(modo, m.ancho, dom, 0);
    setFase("apertura");
    nuevo.abrirConMagia((interrumpida) => {
      guardarSesion();
      setFase(interrumpida ? "listo" : "estampando");
    });
  });

  useLayoutEffect(() => {
    // El motor coloca las hojas recién pintadas y dice dónde quedan antes de que se vea nada.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (modo) prepararLibro(modo);
  }, [modo]);

  useEffect(() => {
    if (modo) estado.current = { modo, abiertas, total };
  }, [modo, abiertas, total]);

  // Los sellos de la primera doble página se estampan uno tras otro y después, quietos.
  useEffect(() => {
    if (fase !== "estampando") return;
    const t = window.setTimeout(() => setFase("listo"), DURACION_ESTAMPADO);
    return () => window.clearTimeout(t);
  }, [fase]);

  // La página que se ve queda en la URL (?p=), para volver a ella desde un viaje.
  useEffect(() => {
    if (!modo || fase === "oculto" || fase === "apertura") return;
    const p = paginaVisible(abiertas, modo, total);
    const url = new URL(window.location.href);
    if (p === null) url.searchParams.delete("p");
    else url.searchParams.set("p", String(p));
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [abiertas, modo, total, fase]);

  // Flechas, Inicio y Fin pasan páginas al instante: el teclado no espera a ninguna animación.
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      const m = motor.current;
      if (!m || e.altKey || e.ctrlKey || e.metaKey) return;
      if ((e.target as HTMLElement).closest?.("input, textarea, select, [contenteditable='true']")) return;
      const destinos: Record<string, number> = {
        ArrowRight: m.pasadas + 1,
        ArrowLeft: m.pasadas - 1,
        Home: 1,
        End: m.total - 1,
      };
      if (!(e.key in destinos)) return;
      e.preventDefault();
      m.ir(destinos[e.key], false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, []);

  const cerrado = abiertas === 0 || abiertas === total;
  const texto = rotulo(carasVistas, libro);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center">
      <div
        ref={escenario}
        data-fase={fase}
        role="region"
        aria-roledescription="pasaporte"
        aria-label="Pasaporte de viajes"
        className="escenario-libro relative min-h-0 w-full flex-1"
      >
        {/* Flex y no grid: el libro mide dos páginas aunque solo se vea una, y debe seguir centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={elLibro} data-modo={modo ?? undefined} data-cerrado={cerrado || undefined} className="libro relative">
            <span aria-hidden className="canto canto-izquierdo" />
            <span aria-hidden className="canto canto-derecho" />
            {hojas.map((hoja, i) => {
              // Las tapas son algo mayores que las páginas: abiertas, dejan un filo de piel alrededor.
              const tapa = i === 0 || i === total - 1;
              return (
                <div key={`${modo}-${i}`} data-hoja={i} className={`hoja-libro ${tapa ? "hoja-tapa" : ""}`}>
                  {(["frente", "dorso"] as const).map((lado) => {
                    const cara = hoja[lado];
                    const visible = visibles.includes(`${i}:${lado}`);
                    const papel = cara.tipo !== "tapa" && cara.tipo !== "contratapa";
                    return (
                      <section
                        key={lado}
                        aria-label={nombreCara(cara, libro)}
                        aria-hidden={!visible || undefined}
                        inert={!visible}
                        data-visible={visible || undefined}
                        className={`cara cara-${lado} ${tapa ? "cuero" : ""}`}
                      >
                        <div className={`pagina ${papel ? "pagina-papel" : ""} ${tapa && papel ? "pagina-forrada" : ""}`}>
                          <Contenido cara={cara} libro={libro} />
                        </div>
                        <span aria-hidden className="sombra-hoja" />
                      </section>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="paginador mt-3 flex shrink-0 items-center gap-2" data-fase={fase}>
        <BotonPagina etiqueta="Página anterior" d="M10 3 5 8l5 5" desactivado={!modo || abiertas === 0} alPulsar={() => motor.current?.anterior()} />
        <p aria-live="polite" className="min-w-[17ch] text-center font-mono text-[12px] font-medium tracking-[0.06em] text-texto-suave uppercase">
          {modo ? texto : ""}
        </p>
        <BotonPagina etiqueta="Página siguiente" d="M6 3l5 5-5 5" desactivado={!modo || abiertas === total} alPulsar={() => motor.current?.siguiente()} />
      </div>

      <noscript>
        <p className="mt-6 text-center text-[15px] text-texto-suave">
          El pasaporte necesita JavaScript. Todos los viajes están en la{" "}
          <Link href="/lista" className="underline underline-offset-4">
            lista por país
          </Link>
          .
        </p>
      </noscript>
    </div>
  );
}

function BotonPagina({ etiqueta, d, desactivado, alPulsar }: { etiqueta: string; d: string; desactivado: boolean; alPulsar: () => void }) {
  return (
    <button
      type="button"
      onClick={alPulsar}
      disabled={desactivado}
      aria-label={etiqueta}
      className="pulsable grid size-11 place-items-center rounded-full text-texto hover:bg-papel disabled:text-regla disabled:hover:bg-transparent"
    >
      <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </button>
  );
}
