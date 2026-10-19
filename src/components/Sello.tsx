import { fechaLarga, fechaSello } from "@/lib/fecha";
import { rotacionSello, type Forma, type Tinta } from "@/lib/sello";

const COLOR: Record<Tinta, string> = {
  carmin: "text-carmin",
  violeta: "text-violeta",
  cobalto: "text-cobalto",
  verde: "text-verde",
};

type Props = {
  id: string;
  nombre: string;
  pais: string;
  codigo: string;
  fecha: string | null;
  forma: Forma;
  tinta: Tinta;
  semilla: number;
  className?: string;
};

// Tamaño de letra para que un texto en mayúsculas condensadas quepa en `disponible`.
function ajustar(texto: string, disponible: number, maximo: number, ancho = 0.6) {
  return Math.min(maximo, disponible / (texto.length * ancho));
}

const condensada = { fontStretch: "62.5%", fontWeight: 800 } as const;

export function Sello({ id, nombre, pais, codigo, fecha, forma, tinta, semilla, className = "" }: Props) {
  const NOMBRE = nombre.toUpperCase();
  const PAIS = pais.toUpperCase();
  const FECHA = fecha ? fechaSello(fecha) : null;
  const filtro = `${id}-tinta`;
  const etiqueta = `Sello de ${nombre}, ${pais}${fecha ? `, ${fechaLarga(fecha)}` : ""}`;
  const giro = rotacionSello(semilla);

  const tintaFiltro = (
    <filter id={filtro} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={semilla % 97} result="grano" />
      <feDisplacementMap in="SourceGraphic" in2="grano" scale={2.2} xChannelSelector="R" yChannelSelector="G" result="borde" />
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={3} seed={(semilla >>> 7) % 97} result="manchas" />
      <feColorMatrix in="manchas" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2 1.95" result="mascara" />
      <feComposite in="borde" in2="mascara" operator="in" />
    </filter>
  );

  let dibujo: React.ReactNode;
  let caja: string;

  if (forma === "rectangulo") {
    caja = "0 0 240 160";
    dibujo = (
      <>
        <rect x="4" y="4" width="232" height="152" rx="12" fill="none" stroke="currentColor" strokeWidth="4.5" />
        <rect x="12" y="12" width="216" height="136" rx="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <text x="120" y="38" textAnchor="middle" fontSize={ajustar(PAIS, 180, 13, 0.75)} letterSpacing="2.5" fill="currentColor" style={condensada}>
          {PAIS}
        </text>
        <text x="120" y="92" textAnchor="middle" fontSize={ajustar(NOMBRE, 196, 50, 0.52)} fill="currentColor" style={condensada}>
          {NOMBRE}
        </text>
        <path d="M30 106H210" stroke="currentColor" strokeWidth="1.4" />
        {FECHA ? (
          <>
            <text x="30" y="132" fontSize="13" fill="currentColor" className="font-mono" fontWeight={600}>{codigo}</text>
            <text x="210" y="132" textAnchor="end" fontSize="13" fill="currentColor" className="font-mono" fontWeight={600}>{FECHA}</text>
          </>
        ) : (
          <text x="120" y="132" textAnchor="middle" fontSize="13" fill="currentColor" className="font-mono" fontWeight={600}>{codigo}</text>
        )}
      </>
    );
  } else if (forma === "octogono") {
    caja = "0 0 200 200";
    const octogono = (r: number) =>
      Array.from({ length: 8 }, (_, i) => {
        const a = Math.PI / 8 + (i * Math.PI) / 4;
        return `${(100 + r * Math.cos(a)).toFixed(2)},${(100 + r * Math.sin(a)).toFixed(2)}`;
      }).join(" ");
    dibujo = (
      <>
        <polygon points={octogono(96)} fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
        <polygon points={octogono(87)} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <text x="100" y="64" textAnchor="middle" fontSize={ajustar(PAIS, 110, 13, 0.75)} letterSpacing="2.5" fill="currentColor" style={condensada}>
          {PAIS}
        </text>
        <path d="M46 76H154" stroke="currentColor" strokeWidth="1.4" />
        <text x="100" y="118" textAnchor="middle" fontSize={ajustar(NOMBRE, 136, 42, 0.52)} fill="currentColor" style={condensada}>
          {NOMBRE}
        </text>
        <path d="M46 132H154" stroke="currentColor" strokeWidth="1.4" />
        <text x="100" y="154" textAnchor="middle" fontSize="12.5" fill="currentColor" className="font-mono" fontWeight={600}>
          {FECHA ?? codigo}
        </text>
      </>
    );
  } else {
    caja = "0 0 200 200";
    const arriba = `${id}-arriba`;
    const abajo = `${id}-abajo`;
    dibujo = (
      <>
        <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="4.5" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path id={arriba} d="M37 100A63 63 0 0 1 163 100" fill="none" />
        <path id={abajo} d="M24 100A76 76 0 0 0 176 100" fill="none" />
        <text fontSize={ajustar(NOMBRE, 150, 19)} letterSpacing="1.5" fill="currentColor" style={condensada}>
          <textPath href={`#${arriba}`} startOffset="50%" textAnchor="middle">{NOMBRE}</textPath>
        </text>
        <text fontSize={ajustar(PAIS, 150, 13, 0.75)} letterSpacing="2.5" fill="currentColor" style={condensada}>
          <textPath href={`#${abajo}`} startOffset="50%" textAnchor="middle">{PAIS}</textPath>
        </text>
        <Estrella x={30} y={100} />
        <Estrella x={170} y={100} />
        {FECHA ? (
          <>
            <text x="100" y="100" textAnchor="middle" fontSize="26" fill="currentColor" style={condensada}>{codigo}</text>
            <text x="100" y="121" textAnchor="middle" fontSize="11.5" fill="currentColor" className="font-mono" fontWeight={600}>{FECHA}</text>
          </>
        ) : (
          <text x="100" y="110" textAnchor="middle" fontSize="30" fill="currentColor" style={condensada}>{codigo}</text>
        )}
      </>
    );
  }

  return (
    <svg
      viewBox={caja}
      role="img"
      aria-label={etiqueta}
      className={`sello font-sans ${COLOR[tinta]} ${className}`}
      style={{ rotate: `${giro}deg` }}
    >
      <defs>{tintaFiltro}</defs>
      <g filter={`url(#${filtro})`} opacity={0.92}>
        {dibujo}
      </g>
    </svg>
  );
}

function Estrella({ x, y }: { x: number; y: number }) {
  const puntos = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? 2.4 : 5.6;
    return `${(x + r * Math.cos(a)).toFixed(2)},${(y + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return <polygon points={puntos} fill="currentColor" />;
}
