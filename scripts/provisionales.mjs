// Genera fotos provisionales (claramente marcadas) para los lugares que aún no tienen
// fotos, para poder ver la web antes de añadir las reales. Se escriben como
// content/<pais>/<lugar>/provisional-NN.jpg y se ignoran en cuanto la carpeta tiene
// alguna foto real.
//
// Uso: npm run provisionales   (después ejecuta npm run fotos)

import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const CONTENIDO = path.join(process.cwd(), "content");
const IMAGENES = /\.(jpe?g|png|webp|avif|tiff?|hei[cf])$/i;
const FORMATOS = [
  [1200, 1500],
  [1500, 1000],
  [1200, 1600],
  [1200, 1200],
  [1000, 1500],
  [1600, 1066],
  [1200, 1500],
];

// Cielo, horizonte, tierra y primer plano: tonos aproximados de cada lugar.
const PALETAS = {
  "espana/san-sebastian": ["#a9c6d6", "#e6dccb", "#3f6f8f", "#5b7a5a"],
  "italia/roma": ["#ecd2ad", "#c98a55", "#9c4f36", "#5e4a3a"],
  "bulgaria/sofia": ["#cdd8da", "#7d8f94", "#4f6b4b", "#c9a24a"],
};
const PALETA_NEUTRA = ["#d4d8d6", "#a7adab", "#6f7774", "#4c524f"];

function aleatorio(semilla) {
  let s = semilla;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function svgProvisional(ancho, alto, paleta, n, nombre, semilla) {
  const r = aleatorio(semilla);
  const [cielo, horizonte, medio, frente] = paleta;
  const h1 = alto * (0.38 + r() * 0.2);
  const h2 = h1 + alto * (0.08 + r() * 0.12);
  const onda = (y, amp) => {
    const fase = r() * Math.PI * 2;
    let d = `M0 ${y}`;
    for (let i = 0; i <= 24; i++) {
      const x = (ancho * i) / 24;
      d += ` L${x.toFixed(1)} ${(y + Math.sin((i / 24) * Math.PI * 2 + fase) * amp).toFixed(1)}`;
    }
    return `${d} L${ancho} ${alto} L0 ${alto} Z`;
  };
  const texto = Math.round(ancho * 0.028);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}">
  <defs>
    <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${cielo}"/><stop offset="1" stop-color="${horizonte}"/>
    </linearGradient>
    <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${n}"/>
      <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.09 0"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#c)"/>
  <path d="${onda(h1, alto * 0.03)}" fill="${medio}"/>
  <path d="${onda(h2, alto * 0.05)}" fill="${frente}"/>
  <rect width="100%" height="100%" filter="url(#g)"/>
  <text x="${texto * 1.4}" y="${alto - texto * 1.6}" font-family="Arial, sans-serif" font-size="${texto}"
    font-weight="700" letter-spacing="${texto * 0.12}" fill="#ffffff" fill-opacity="0.85">FOTO PROVISIONAL · ${String(n).padStart(2, "0")} · ${nombre.toUpperCase()}</text>
</svg>`;
}

async function main() {
  let creadas = 0;
  for (const pais of await readdir(CONTENIDO, { withFileTypes: true })) {
    if (!pais.isDirectory() || !existsSync(path.join(CONTENIDO, pais.name, "pais.json"))) continue;
    for (const lugar of await readdir(path.join(CONTENIDO, pais.name), { withFileTypes: true })) {
      const carpeta = path.join(CONTENIDO, pais.name, lugar.name);
      const ficha = path.join(carpeta, "lugar.json");
      if (!lugar.isDirectory() || !existsSync(ficha)) continue;
      if ((await readdir(carpeta)).some((a) => IMAGENES.test(a))) continue;

      const { nombre } = JSON.parse(await readFile(ficha, "utf8"));
      const clave = `${pais.name}/${lugar.name}`;
      const paleta = PALETAS[clave] ?? PALETA_NEUTRA;
      for (const [i, [ancho, alto]] of FORMATOS.entries()) {
        const n = i + 1;
        const svg = svgProvisional(ancho, alto, paleta, n, nombre, clave.length * 97 + n * 31);
        const jpg = await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toBuffer();
        await writeFile(path.join(carpeta, `provisional-${String(n).padStart(2, "0")}.jpg`), jpg);
        creadas++;
      }
      console.log(`  ✓ ${clave}: ${FORMATOS.length} fotos provisionales`);
    }
  }
  console.log(creadas ? `\n${creadas} fotos provisionales creadas.` : "Todos los lugares tienen fotos.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
