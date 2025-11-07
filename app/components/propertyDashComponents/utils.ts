import { Location } from "./location";

export function getBoundingBox(locations: Location[]) {
  const lats = locations.map(l => l.lat);
  const lngs = locations.map(l => l.lng);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

export function getMaxDistance(bounds: {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}) {
  const latDiff = bounds.maxLat - bounds.minLat;
  const lngDiff = bounds.maxLng - bounds.minLng;
  return Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111; // approx km
}

export function shouldShowGlobe(locations: Location[]): boolean {
  const bounds = getBoundingBox(locations);
  const maxDistance = getMaxDistance(bounds);
  return maxDistance > 3000;
}