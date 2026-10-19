// Zona de lectura mecánica (MRZ) de un visado tipo MRV-A: dos líneas de 44 caracteres,
// con los dígitos de control del estándar ICAO 9303. Es decorativa, pero correcta.

import { partesFecha } from "./fecha";

const LARGO = 44;

function valor(caracter: string) {
  if (caracter === "<") return 0;
  if (caracter >= "0" && caracter <= "9") return Number(caracter);
  return caracter.charCodeAt(0) - 55; // A = 10 … Z = 35
}

export function digitoControl(texto: string) {
  const pesos = [7, 3, 1];
  const suma = [...texto].reduce((total, c, i) => total + valor(c) * pesos[i % 3], 0);
  return String(suma % 10);
}

export function transliterar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "<")
    .replace(/^<|<$/g, "");
}

function fechaMrz(fecha: string | null) {
  if (!fecha) return "<<<<<<";
  const { anio, mes, dia } = partesFecha(fecha);
  const dd = dia ? String(dia).padStart(2, "0") : "<<";
  return `${String(anio % 100).padStart(2, "0")}${String(mes).padStart(2, "0")}${dd}`;
}

export function lineasMrz(datos: {
  lugar: string;
  pais: string;
  iso3: string;
  fecha: string | null;
  numero: number;
}): [string, string] {
  const primera = `V<${datos.iso3}${transliterar(datos.lugar)}<<${transliterar(datos.pais)}`
    .padEnd(LARGO, "<")
    .slice(0, LARGO);
  const documento = `IMN${String(datos.numero).padStart(6, "0")}`.slice(0, 9);
  const fecha = fechaMrz(datos.fecha);
  const segunda = [
    documento,
    digitoControl(documento),
    datos.iso3,
    fecha,
    digitoControl(fecha),
    "<",
    "<<<<<<",
    digitoControl("<<<<<<"),
  ]
    .join("")
    .padEnd(LARGO, "<");
  return [primera, segunda];
}
