"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const VISTAS = [
  {
    href: "/",
    texto: "Pasaporte",
    icono: (
      <>
        <rect x="3.2" y="1.8" width="9.6" height="12.4" rx="1.2" />
        <circle cx="8" cy="7" r="2.4" />
        <path d="M5.6 11.2h4.8" />
      </>
    ),
  },
  {
    href: "/mundo",
    texto: "Mundo",
    icono: (
      <>
        <circle cx="8" cy="8" r="6.3" />
        <ellipse cx="8" cy="8" rx="2.8" ry="6.3" />
        <path d="M1.9 8h12.2" />
      </>
    ),
  },
  {
    href: "/lista",
    texto: "Lista",
    icono: <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />,
  },
] as const;

function Opciones({ activa, enlaces }: { activa: number; enlaces: boolean }) {
  return VISTAS.map((v, i) => {
    const contenido = (
      <>
        <svg viewBox="0 0 16 16" aria-hidden className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          {v.icono}
        </svg>
        {v.texto}
      </>
    );
    const clase =
      "flex h-14 flex-col items-center justify-center gap-1 text-[12px] font-extrabold tracking-[0.14em] uppercase font-stretch-extra-condensed sm:h-11 sm:flex-row sm:gap-2 sm:text-[15px]";
    return enlaces ? (
      <Link
        key={v.href}
        href={v.href}
        aria-current={i === activa ? "page" : undefined}
        className={`control pulsable rounded-[2px] text-texto-suave hover:text-texto ${clase}`}
      >
        {contenido}
      </Link>
    ) : (
      <span key={v.href} className={clase}>
        {contenido}
      </span>
    );
  });
}

/**
 * Barra de las tres vistas. La opción activa es una copia en tinta oscura de la misma barra,
 * recortada a su casilla: al cambiar de vista el recorte se desliza y el color cambia a la vez.
 */
export function Navegacion() {
  const ruta = usePathname();
  const activa = Math.max(
    0,
    VISTAS.findIndex((v) => (v.href === "/" ? ruta === "/" : ruta.startsWith(v.href))),
  );
  const izquierda = (activa * 100) / 3;
  const derecha = ((2 - activa) * 100) / 3;

  return (
    <nav
      aria-label="Vistas"
      data-navegacion
      className="fixed inset-x-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30 rounded-[3px] border border-regla bg-papel p-1 sm:inset-x-auto sm:left-1/2 sm:w-[25rem] sm:-translate-x-1/2"
    >
      <div className="relative grid grid-cols-3">
        <Opciones activa={activa} enlaces />
        <div
          aria-hidden
          className="navegacion-activa pointer-events-none absolute inset-0 grid grid-cols-3 rounded-[2px] bg-texto text-papel"
          style={{ clipPath: `inset(0 ${derecha}% 0 ${izquierda}% round 2px)` }}
        >
          <Opciones activa={activa} enlaces={false} />
        </div>
      </div>
    </nav>
  );
}
