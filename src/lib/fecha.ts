// Fechas de viaje en formato "AAAA-MM" o "AAAA-MM-DD".

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const MESES_CORTOS = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

export const FECHA_REGEX = /^(\d{4})-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/;

export function partesFecha(fecha: string) {
  const m = FECHA_REGEX.exec(fecha);
  if (!m) throw new Error(`Fecha no válida: "${fecha}" (usa AAAA-MM o AAAA-MM-DD)`);
  return { anio: Number(m[1]), mes: Number(m[2]), dia: m[3] ? Number(m[3]) : null };
}

/** "14 de agosto de 2024" o "agosto de 2024" */
export function fechaLarga(fecha: string) {
  const { anio, mes, dia } = partesFecha(fecha);
  return `${dia ? `${dia} de ` : ""}${MESES[mes - 1]} de ${anio}`;
}

/** "14 AGO 2024" o "AGO 2024", para los sellos */
export function fechaSello(fecha: string) {
  const { anio, mes, dia } = partesFecha(fecha);
  return `${dia ? `${String(dia).padStart(2, "0")} ` : ""}${MESES_CORTOS[mes - 1]} ${anio}`;
}

/** Más antiguas primero; los lugares sin fecha van al final. */
export function compararFechas(a: string | null, b: string | null) {
  if (a === b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a < b ? -1 : 1;
}
