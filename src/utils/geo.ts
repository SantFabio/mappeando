import type { MapItem } from '../types';

// ── Haversine ─────────────────────────────────────────────────────────────────
export function distKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function filterByDistance(
  list: MapItem[] | undefined | null,
  lat: number,
  lon: number,
  radius: number,
) {
  if (!Array.isArray(list)) return [];

  return list.filter(item => {
    if (!item.latitude || !item.longitude) return false;
    if (!isFinite(item.latitude) || !isFinite(item.longitude)) return false;
    return distKm(lat, lon, item.latitude, item.longitude) <= radius;
  });
}
