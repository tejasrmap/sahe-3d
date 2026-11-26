import { CAMPUS_BUILDINGS } from '../../data/buildings';
import { CAMPUS_POIS } from '../../data/pois';
import { calculateDistanceMeters } from '../../utils/distance';
import { Building, POI } from '../../types/campus';

export interface ProximityTarget {
  type: 'building' | 'poi';
  id: string;
  name: string;
  category: string;
  distanceMeters: number;
  building?: Building;
  poi?: POI;
}

/**
 * Computes closest building and POI from given coordinates
 */
export function getNearbyDiscoveries(
  currentLat: number,
  currentLon: number,
  maxDistanceMeters = 80
): {
  nearestBuilding: ProximityTarget | null;
  nearestPoi: ProximityTarget | null;
  allNearby: ProximityTarget[];
} {
  const nearby: ProximityTarget[] = [];

  for (const b of CAMPUS_BUILDINGS) {
    const dist = calculateDistanceMeters(currentLat, currentLon, b.latitude, b.longitude);
    if (dist <= maxDistanceMeters) {
      nearby.push({
        type: 'building',
        id: b.id,
        name: b.name,
        category: b.category,
        distanceMeters: dist,
        building: b,
      });
    }
  }

  for (const p of CAMPUS_POIS) {
    const dist = calculateDistanceMeters(currentLat, currentLon, p.latitude, p.longitude);
    if (dist <= maxDistanceMeters) {
      nearby.push({
        type: 'poi',
        id: p.id,
        name: p.name,
        category: p.category,
        distanceMeters: dist,
        poi: p,
      });
    }
  }

  nearby.sort((a, b) => a.distanceMeters - b.distanceMeters);

  const nearestBuilding = nearby.find((n) => n.type === 'building') || null;
  const nearestPoi = nearby.find((n) => n.type === 'poi') || null;

  return {
    nearestBuilding,
    nearestPoi,
    allNearby: nearby.slice(0, 4),
  };
}
