"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { PaisMundo } from "@/lib/contenido";
import { aLonLat, encuadre, type LonLat, type PaisGeo } from "@/lib/geo";
import type { Tinta } from "@/lib/sello";
import { Bandera } from "../Bandera";
import { Chinchetas } from "./Chinchetas";
import { Ficha } from "./Ficha";
import { conectarGestos } from "./gestos";
import { MotorGlobo, type Desplazamiento } from "./motor";

const COLOR: Record<Tinta, string> = {
  carmin: "text-carmin",
  violeta: "text-violeta",
  cobalto: "text-cobalto",
  verde: "text-verde",
};

const MAPA = "/mapa/mundo.json";

function centroInicial(paises: PaisMundo[]): LonLat {
  const puntos = paises.flatMap((p) => p.lugares.flatMap((l) => (l.coords ? [aLonLat(l.coords)] : [])));
  if (!puntos.length) return [0, 20];
  const media = (i: 0 | 1) => puntos.reduce((s, p) => s + p[i], 0) / puntos.length;
  return [media(0), media(1) - 6];
}

/** Globo de /mundo: giro, zoom, países con fotos, chinchetas y ficha de lugares. */
export function Mundo({ paises }: { paises: PaisMundo[] }) {
  const router = useRouter();
  const contenedor = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const controles = useRef<HTMLDivElement>(null);
  const [llegado, setLlegado] = useState(false);
  const geometrias = useRef(new Map<string, PaisGeo>());
  const historial = useRef(false);
  const [motor, setMotor] = useState<MotorGlobo | null>(null);
  const [elegido, setElegido] = useState<string | null>(null);
  const [mostrado, setMostrado] = useState<string | null>(null);
  const [activo, setActivo] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState("");
  const [error, setError] = useState(false);

  const pais = paises.find((p) => p.slug === mostrado) ?? null;
  const tinta = pais ? COLOR[pais.tinta] : "";

  /**
   * Dónde queda el globo con la ficha abierta: centrado en el hueco que deja libre
   * (arriba de la ficha en el móvil, a su izquierda en pantallas anchas).
   */
  const desplazamientoFicha = (): Desplazamiento => {
    const r = contenedor.current!.getBoundingClientRect();
    const ficha = contenedor.current!.querySelector<HTMLElement>(".ficha");
    const { arriba, abajo } = bandaLibre();
    const centroActual = (arriba + r.height - abajo) / 2;
    if (r.width >= 768) {
      const panel = (ficha?.offsetWidth ?? 380) + 16;
      return { dx: -panel / 2, dy: 0 };
    }
    const altoFicha = Math.min(ficha?.offsetHeight ?? r.height * 0.4, r.height * 0.54);
    return { dx: 0, dy: (arriba + r.height - altoFicha) / 2 - centroActual };
  };

  /** Lo que ocupan la cabecera (arriba) y los controles (abajo): el globo vive entre ambos. */
  const bandaLibre = () => {
    if (!contenedor.current) return { arriba: 0, abajo: 0 };
    const r = contenedor.current.getBoundingClientRect();
    const cabecera = document.querySelector("[data-cabecera-mundo]")?.getBoundingClientRect();
    const barra = controles.current?.getBoundingClientRect();
    return {
      arriba: cabecera ? Math.max(cabecera.bottom - r.top, 0) : 0,
      abajo: barra ? Math.max(r.bottom - barra.top, 0) : 0,
    };
  };

  const enfocar = (slug: string | null) => {
    const m = motor;
    if (!m) return;
    const p = paises.find((x) => x.slug === slug);
    if (!p) {
      setElegido(null);
      setActivo(null);
      m.seleccionar(null);
      m.volarA(m.centro, 1, { dx: 0, dy: 0 });
      setAnuncio("Vista del mundo entero");
      return;
    }
    setElegido(p.slug);
    setMostrado(p.slug);
    setActivo(null);
    setLlegado(false);
    m.seleccionar(p.iso3);
    const lugares = p.lugares.flatMap((l) => (l.coords ? [aLonLat(l.coords)] : []));
    const geometria = geometrias.current.get(p.iso3);
    const destino = geometria
      ? encuadre(geometria, lugares)
      : { centro: lugares[0] ?? m.centro, zoom: 5 };
    m.volarA(destino.centro, destino.zoom, desplazamientoFicha());
    const n = p.lugares.length;
    setAnuncio(`${p.nombre}: ${n} ${n === 1 ? "lugar" : "lugares"} con fotos`);
  };
  const enfocarDesdeEfecto = useEffectEvent((slug: string | null) => enfocar(slug));

  const elegir = (slug: string) => {
    if (slug === elegido) return;
    const url = `/mundo?pais=${encodeURIComponent(slug)}`;
    if (historial.current) window.history.replaceState({ mundo: slug }, "", url);
    else window.history.pushState({ mundo: slug }, "", url);
    historial.current = true;
    enfocar(slug);
  };

  const cerrar = () => {
    if (historial.current) {
      window.history.back(); // popstate vuelve a la vista general
    } else {
      window.history.replaceState(null, "", "/mundo");
      enfocar(null);
    }
  };

  const alTocar = useEffectEvent((geometria: PaisGeo | null) => {
    const p = geometria ? paises.find((x) => x.iso3 === geometria.id) : null;
    if (p) return elegir(p.slug);
    if (geometria) {
      setAviso(geometria.properties.n);
      setAnuncio(`${geometria.properties.n}: sin fotos`);
      return;
    }
    if (elegido) cerrar();
  });

  // Motor, gestos y tamaño del lienzo
  useEffect(() => {
    const estilos = getComputedStyle(document.documentElement);
    const color = (token: string) => estilos.getPropertyValue(`--color-${token}`).trim();
    const m = new MotorGlobo(lienzo.current!, {
      reducido: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      centro: centroInicial(paises),
      color,
    });
    const desconectar = conectarGestos(lienzo.current!, m, (g) => alTocar(g));
    const dejarDeEsperar = m.alLlegar(() => setLlegado(true));
    const observador = new ResizeObserver(() => {
      // Puede llegar un aviso tardío justo al salir de la página.
      if (!contenedor.current) return;
      const r = contenedor.current.getBoundingClientRect();
      m.redimensionar(r.width, r.height, bandaLibre());
    });
    observador.observe(contenedor.current!);
    if (controles.current) observador.observe(controles.current);

    let cancelado = false;
    fetch(MAPA)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${MAPA}: ${r.status}`))))
      .then((mapa: { features: PaisGeo[] }) => {
        if (cancelado) return;
        for (const g of mapa.features) if (g.id) geometrias.current.set(g.id as string, g);
        const tintas = new Map(paises.map((p) => [p.iso3, color(p.tinta)]));
        const puntos = paises.flatMap((p) =>
          p.lugares.flatMap((l) => (l.coords ? [{ lonlat: aLonLat(l.coords), tinta: color(p.tinta) }] : [])),
        );
        m.fijarDatos(mapa.features, tintas, puntos);
        setMotor(m);
      })
      .catch(() => !cancelado && setError(true));

    return () => {
      cancelado = true;
      observador.disconnect();
      dejarDeEsperar();
      desconectar();
      m.destruir();
    };
  }, [paises]);

  // Al cargar el mapa, abrir el país de la URL (/mundo?pais=espana) y escuchar "atrás".
  useEffect(() => {
    if (!motor) return;
    const desdeUrl = () => new URLSearchParams(window.location.search).get("pais");
    const inicial = desdeUrl();
    const fotograma = requestAnimationFrame(() => inicial && enfocarDesdeEfecto(inicial));
    const alVolver = () => {
      const slug = desdeUrl();
      historial.current = Boolean(slug) && historial.current;
      enfocarDesdeEfecto(slug);
    };
    window.addEventListener("popstate", alVolver);
    return () => {
      cancelAnimationFrame(fotograma);
      window.removeEventListener("popstate", alVolver);
    };
  }, [motor]);

  // Esc cierra la ficha
  useEffect(() => {
    if (!elegido) return;
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  });

  // El aviso de "sin fotos" desaparece solo
  useEffect(() => {
    if (!aviso) return;
    const t = window.setTimeout(() => setAviso(null), 1800);
    return () => window.clearTimeout(t);
  }, [aviso]);

  const nombres = paises.map((p) => p.nombre).join(", ");

  return (
    <div ref={contenedor} className="absolute inset-0">
      <canvas
        ref={lienzo}
        tabIndex={0}
        role="img"
        aria-label={`Globo terráqueo. Países con fotos: ${nombres}. Arrastra o usa las flechas para girarlo y + o − para acercarte.`}
        className="globo absolute inset-0 size-full"
      />

      {pais ? (
        <Chinchetas
          motor={motor}
          lugares={elegido && llegado ? pais.lugares : []}
          tinta={tinta}
          activo={activo}
          // Primer toque: resalta el lugar en la ficha. Segundo toque: abre su página.
          alElegir={(ruta) => (ruta === activo ? router.push(ruta) : setActivo(ruta))}
        />
      ) : null}

      {aviso ? (
        <p
          key={aviso}
          className="aviso pointer-events-none absolute top-[calc(env(safe-area-inset-top)+6rem)] left-1/2 z-10 -translate-x-1/2 rounded-[3px] border border-regla bg-papel px-3 py-2 text-[15px] font-bold tracking-[0.1em] whitespace-nowrap text-texto-suave uppercase font-stretch-condensed"
        >
          {aviso} · sin fotos
        </p>
      ) : null}

      {error ? (
        <p className="absolute top-1/2 left-1/2 z-10 -translate-1/2 rounded-[3px] border border-regla bg-papel px-4 py-3 text-center text-[15px] text-texto-suave">
          No se ha podido cargar el mapa. Recarga la página para intentarlo de nuevo.
        </p>
      ) : null}

      <div
        ref={controles}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
      >
        <nav aria-label="Países con fotos" className="pointer-events-auto">
          <ul className="flex flex-wrap gap-2">
            {paises.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => elegir(p.slug)}
                  aria-pressed={elegido === p.slug}
                  className={`group pulsable flex h-11 items-center gap-2 rounded-[3px] border-[1.5px] border-current bg-papel px-3 text-[15px] font-bold tracking-[0.1em] uppercase font-stretch-condensed aria-pressed:bg-current ${COLOR[p.tinta]}`}
                >
                  <Bandera iso={p.iso} className="h-[12px] w-[18px]" />
                  <span className="group-aria-pressed:text-papel">{p.nombre}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="pointer-events-auto flex shrink-0 flex-col overflow-hidden rounded-[3px] border border-regla bg-papel">
          <BotonZoom etiqueta="Acercar" onClick={() => motor?.zoomSuave(1.6)} d="M8 3v10M3 8h10" />
          <span aria-hidden className="h-px bg-regla" />
          <BotonZoom etiqueta="Alejar" onClick={() => motor?.zoomSuave(1 / 1.6)} d="M3 8h10" />
        </div>
      </div>

      <Ficha pais={pais} abierta={Boolean(elegido)} tinta={tinta} activo={activo} alCerrar={cerrar} />

      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>
    </div>
  );
}

function BotonZoom({ etiqueta, onClick, d }: { etiqueta: string; onClick: () => void; d: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className="pulsable grid size-11 place-items-center text-texto hover:bg-papel-hondo"
    >
      <svg viewBox="0 0 16 16" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d={d} />
      </svg>
    </button>
  );
}
