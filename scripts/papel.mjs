// Genera los recursos del "papel de seguridad" y los iconos de la app:
//   - public/papel/ondas.svg   trama de guilloché en mosaico (fondo de todas las páginas)
//   - public/papel/roseta.svg  roseta de guilloché (detrás del sello)
//   - src/app/icon.svg, src/app/apple-icon.png, public/iconos/*.png
//
// Uso: npm run papel   (solo hace falta si cambias los colores o el dibujo)

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAIZ = process.cwd();
const TEAL = "#6fa9a3";
const LILA = "#a597c7";
const PAPEL = "#e9efeb";
const CARMIN = "#b02a3e"; // = --color-carmin

const f = (n) => n.toFixed(2);

function linea(puntos) {
  return puntos.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join("");
}

function ondas() {
  const ancho = 240;
  const alto = 96;
  const trazos = [];
  const familia = (color, desfase, amplitud, periodos, grosor) => {
    const d = [];
    for (let y0 = -16; y0 <= alto + 16; y0 += 8) {
      const puntos = [];
      for (let x = 0; x <= ancho; x += 3) {
        puntos.push([x, y0 + desfase + amplitud * Math.sin((x / ancho) * Math.PI * 2 * periodos + (desfase ? Math.PI : 0))]);
      }
      d.push(linea(puntos));
    }
    trazos.push(`<path d="${d.join("")}" stroke="${color}" stroke-width="${grosor}"/>`);
  };
  familia(TEAL, 0, 5, 1, 0.5);
  familia(LILA, 4, 5, 1, 0.5);
  familia(TEAL, 2, 1.6, 4, 0.35);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}" fill="none" stroke-linecap="round" opacity="0.5">${trazos.join("")}</svg>`;
}

function roseta() {
  const c = 300;
  const banda = (radio, amplitud, lobulos, copias, color, grosor) => {
    const d = [];
    for (let i = 0; i < copias; i++) {
      const fase = (i / copias) * Math.PI * 2;
      const puntos = [];
      for (let paso = 0; paso <= 720; paso++) {
        const t = (paso / 720) * Math.PI * 2;
        const r = radio + amplitud * Math.sin(lobulos * t + fase) + amplitud * 0.35 * Math.sin(lobulos * 3 * t - fase);
        puntos.push([c + r * Math.cos(t), c + r * Math.sin(t)]);
      }
      d.push(`${linea(puntos)}Z`);
    }
    return `<path d="${d.join("")}" stroke="${color}" stroke-width="${grosor}"/>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" fill="none" opacity="0.55">${[
    banda(236, 36, 12, 18, TEAL, 0.6),
    banda(150, 28, 9, 16, LILA, 0.6),
    banda(70, 18, 6, 12, TEAL, 0.5),
  ].join("")}</svg>`;
}

function icono(tam, conFondo) {
  const c = tam / 2;
  const marcas = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r1 = tam * 0.3;
    const r2 = tam * 0.335;
    marcas.push(`M${f(c + r1 * Math.cos(a))} ${f(c + r1 * Math.sin(a))}L${f(c + r2 * Math.cos(a))} ${f(c + r2 * Math.sin(a))}`);
  }
  const estrella = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    const r = i % 2 ? tam * 0.075 : tam * 0.18;
    estrella.push([c + r * Math.cos(a), c + r * Math.sin(a)]);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}" viewBox="0 0 ${tam} ${tam}">
  ${conFondo ? `<rect width="${tam}" height="${tam}" fill="${PAPEL}"/>` : ""}
  <g fill="none" stroke="${CARMIN}" transform="rotate(-8 ${c} ${c})">
    <circle cx="${c}" cy="${c}" r="${f(tam * 0.4)}" stroke-width="${f(tam * 0.045)}"/>
    <circle cx="${c}" cy="${c}" r="${f(tam * 0.355)}" stroke-width="${f(tam * 0.012)}"/>
    <path d="${marcas.join("")}" stroke-width="${f(tam * 0.014)}"/>
  </g>
  <path d="${linea(estrella)}Z" fill="${CARMIN}" transform="rotate(-8 ${c} ${c})"/>
</svg>`;
}

async function main() {
  const papel = path.join(RAIZ, "public", "papel");
  const iconos = path.join(RAIZ, "public", "iconos");
  await mkdir(papel, { recursive: true });
  await mkdir(iconos, { recursive: true });
  await writeFile(path.join(papel, "ondas.svg"), ondas());
  await writeFile(path.join(papel, "roseta.svg"), roseta());
  await writeFile(path.join(RAIZ, "src", "app", "icon.svg"), icono(64, true));
  await sharp(Buffer.from(icono(180, true))).png().toFile(path.join(RAIZ, "src", "app", "apple-icon.png"));
  for (const tam of [192, 512]) {
    await sharp(Buffer.from(icono(tam, true))).png().toFile(path.join(iconos, `${tam}.png`));
  }
  console.log("Papel e iconos generados.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
