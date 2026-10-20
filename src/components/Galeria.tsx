"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { repartirEnColumnas } from "@/lib/columnas";
import type { Foto } from "@/lib/contenido";
import { Visor } from "./Visor";

type Props = {
  ruta: string;
  fotos: Foto[];
  nombre: string;
  /** El sello, que se estampa sobre la esquina de la portada. */
  sello: ReactNode;
  /** Nombre, país y fecha, entre la portada y el resto de fotos. */
  datos: ReactNode;
};

/** Si se llega tocando su sello en el pasaporte, el sello ya viene volando: no se estampa otra vez. */
// (Se compara con la ruta del lugar y no con la URL: al navegar, la URL cambia después de pintar.)
function useLlegaVolando(ruta: string) {
  const [volando] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem("worldtour:vuelo") === ruta;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.removeItem("worldtour:vuelo");
    } catch {}
  }, []);
  return volando;
}

export function Galeria({ ruta, fotos, nombre, sello, datos }: Props) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const volando = useLlegaVolando(ruta);
  const [portada, ...resto] = fotos;
  const total = fotos.length;

  // En el móvil, dos columnas; en pantallas anchas, tres junto a la portada.
  const mamposteria = (n: number, clase: string, sizes: string) => (
    <div className={`items-start gap-2 ${clase}`} style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
      {repartirEnColumnas(resto, n).map((columna, c) => (
        <div key={c} className="grid gap-2">
          {columna.map(({ foto, indice }) => (
            <button
              key={foto.src}
              type="button"
              onClick={() => setAbierta(indice + 1)}
              aria-label={`Abrir foto ${indice + 2} de ${total}`}
              className="pulsable block overflow-hidden rounded-[2px] bg-papel-hondo"
            >
              <Revelada foto={foto} width={foto.ancho} height={foto.alto} sizes={sizes} className="h-auto w-full" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-x-12 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] xl:gap-x-16">
      <div className="lg:sticky lg:top-6">
        <div className="relative">
          {portada ? (
            <button
              type="button"
              onClick={() => setAbierta(0)}
              aria-label={`Abrir foto 1 de ${total}`}
              className="pulsable relative block aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-papel-hondo"
            >
              <Revelada
                foto={portada}
                fill
                priority
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 416px, (min-width: 576px) 544px, calc(100vw - 32px)"
                className="object-cover"
              />
            </button>
          ) : (
            <div className="grid aspect-[4/5] w-full place-items-center rounded-[2px] border border-dashed border-perforado px-10 text-center text-[15px] text-texto-suave">
              Aún no hay fotos de {nombre}.
            </div>
          )}
          <div className="pointer-events-none absolute right-1 -bottom-8 w-[44%] max-w-[210px]">
            <div className={volando ? undefined : "estampar"}>{sello}</div>
          </div>
        </div>

        {datos}
      </div>

      {resto.length > 0 ? (
        <>
          {mamposteria(2, "mt-8 grid lg:hidden", "(min-width: 576px) 268px, calc(50vw - 20px)")}
          {mamposteria(3, "hidden lg:grid", "(min-width: 1280px) 300px, 240px")}
        </>
      ) : null}

      {abierta !== null ? (
        <Visor fotos={fotos} nombre={nombre} inicial={abierta} onCerrado={() => setAbierta(null)} />
      ) : null}
    </div>
  );
}

/** Foto que se "revela": pasa de borrosa a nítida al terminar de cargar. */
function Revelada({ foto, className = "", ...props }: { foto: Foto } & Omit<ImageProps, "src" | "alt">) {
  const [cargada, setCargada] = useState(false);
  return (
    <Image
      {...props}
      src={foto.src}
      alt={foto.alt}
      placeholder="blur"
      blurDataURL={foto.blur}
      draggable={false}
      data-cargada={cargada || undefined}
      ref={(img) => {
        if (img?.complete && img.naturalWidth) setCargada(true);
      }}
      onLoad={() => setCargada(true)}
      className={`revelado ${className}`}
    />
  );
}
