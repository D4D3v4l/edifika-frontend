import { CommonArea } from '../model/common-area.model';

/**
 * Paleta usada para identificar cada area comun dentro del calendario.
 * El color se asigna por el orden en que el backend devuelve las areas,
 * de modo que es estable entre recargas.
 */
export const AREA_PALETTE: readonly string[] = [
  '#990099',
  '#4B5563',
  '#7C3AED',
  '#0E7490',
  '#B45309',
  '#BE185D',
  '#166534',
  '#1D4ED8',
];

export const CANCELLED_COLOR = '#C62020';

/** Se usa cuando la reserva apunta a un area que no vino en la respuesta. */
export const FALLBACK_AREA_COLOR = '#4B5563';

/**
 * Reserva un color por area y mantiene el orden de aparicion.
 */
export function buildAreaColorMap(areas: CommonArea[]): Map<number, string> {
  return new Map(
    areas.map((area, index) => [
      Number(area.id),
      AREA_PALETTE[index % AREA_PALETTE.length],
    ]),
  );
}

/**
 * Aclara un color hexadecimal mezclandolo con blanco.
 */
export function tint(hex: string, amount = 0.86): string {
  const value = hex.replace('#', '');

  if (value.length !== 6) {
    return hex;
  }

  const channels = [0, 2, 4].map(offset => {
    const channel = parseInt(value.slice(offset, offset + 2), 16);

    return Math.round(channel + (255 - channel) * amount);
  });

  return `rgb(${channels.join(', ')})`;
}
