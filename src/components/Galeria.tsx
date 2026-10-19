"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type ReactNode } from "react";
import { repartirEnColumnas } from "@/lib/columnas";
import type { Foto } from "@/lib/contenido";
import { Visor } from "./Visor";

type Props = {
  fotos: Foto[];
  nombre: string;
  /** El sello, que se estampa sobre la esquina de la portada. */
  sello: ReactNode;
  /** Nombre, país y fecha, entre la portada y el resto de fotos. */
  datos: ReactNode;
};

export function Galeria({ fotos, nombre, sello, datos }: Props) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const [portada, ...resto] = fotos;
  const columnas = repartirEnColumnas(resto, 2);
  const total = fotos.length;

  return (
    <>
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
              sizes="(min-width: 576px) 544px, calc(100vw - 32px)"
              className="object-cover"
            />
          </button>
        ) : (
          <div className="grid aspect-[4/5] w-full place-items-center rounded-[2px] border border-dashed border-perforado px-10 text-center text-[15px] text-texto-suave">
            Aún no hay fotos de {nombre}.
          </div>
        )}
        <div className="pointer-events-none absolute right-1 -bottom-8 w-[44%] max-w-[210px]">
          <div className="estampar">{sello}</div>
        </div>
      </div>

      {datos}

      {resto.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 items-start gap-2">
          {columnas.map((columna, c) => (
            <div key={c} className="grid gap-2">
              {columna.map(({ foto, indice }) => (
                <button
                  key={foto.src}
                  type="button"
                  onClick={() => setAbierta(indice + 1)}
                  aria-label={`Abrir foto ${indice + 2} de ${total}`}
                  className="pulsable block overflow-hidden rounded-[2px] bg-papel-hondo"
                >
                  <Revelada
                    foto={foto}
                    width={foto.ancho}
                    height={foto.alto}
                    sizes="(min-width: 576px) 268px, calc(50vw - 20px)"
                    className="h-auto w-full"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {abierta !== null ? (
        <Visor fotos={fotos} nombre={nombre} inicial={abierta} onCerrado={() => setAbierta(null)} />
      ) : null}
    </>
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
