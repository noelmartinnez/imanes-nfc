// Reparte fotos en columnas de altura parecida conservando el índice original,
// que es el que usa el visor.

export function repartirEnColumnas<T extends { ancho: number; alto: number }>(
  fotos: T[],
  columnas: number,
) {
  const resultado = Array.from({ length: columnas }, () => [] as { foto: T; indice: number }[]);
  const alturas = new Array<number>(columnas).fill(0);
  fotos.forEach((foto, indice) => {
    const destino = alturas.indexOf(Math.min(...alturas));
    resultado[destino].push({ foto, indice });
    alturas[destino] += foto.alto / foto.ancho;
  });
  return resultado;
}
