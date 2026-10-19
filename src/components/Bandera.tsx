import type { ComponentType, SVGProps } from "react";
import * as banderas from "country-flag-icons/react/3x2";

// Banderas en SVG (los emoji de bandera no se ven en Windows).
const BANDERAS = banderas as unknown as Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

export function Bandera({ iso, className = "" }: { iso: string; className?: string }) {
  const Svg = BANDERAS[iso];
  if (!Svg) return null;
  return <Svg aria-hidden className={`inline-block shrink-0 rounded-[1px] ${className}`} />;
}
