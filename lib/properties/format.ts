const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const full = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });

export const formatPrice = (n: number, opts?: { compact?: boolean; symbol?: string }) =>
  `${opts?.symbol ?? '$'}${opts?.compact ? compact.format(n) : full.format(n)}`;

export const formatYield = (n: number) => `${n.toFixed(1)}%`;

export const formatArea = (n: number) => `${full.format(n)} m²`;

/** "44.43° N, 26.10° E" — shown on cards because location is the core of this product. */
export function formatCoords(lat: number | null, lng: number | null) {
  if (lat == null || lng == null) return null;
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lng).toFixed(2)}° ${ew}`;
}
