import { CAMPUS_CONFIG } from '../../data/campusConfig';
import { CAMPUS_BUILDINGS } from '../../data/buildings';
import { isPointInPolygon } from '../../utils/geo';

// Pre-compute bounding boxes for ultra-fast collision rejection
interface BuildingCollider {
  id: string;
  name: string;
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
  polygon: [number, number][];
}

const COLLISION_BUFFER_DEG = 0.000018; // ~1.9 meters collision buffer

const buildingColliders: BuildingCollider[] = CAMPUS_BUILDINGS.map((b) => {
  const lons = b.footprint.map((p) => p[0]);
  const lats = b.footprint.map((p) => p[1]);
  return {
    id: b.id,
    name: b.name,
    minLon: Math.min(...lons) - COLLISION_BUFFER_DEG,
    maxLon: Math.max(...lons) + COLLISION_BUFFER_DEG,
    minLat: Math.min(...lats) - COLLISION_BUFFER_DEG,
    maxLat: Math.max(...lats) + COLLISION_BUFFER_DEG,
    polygon: b.footprint,
  };
});

/**
 * Checks if a candidate coordinate collides with any building footprint or campus boundary
 * Returns { allowed: boolean, collidingBuilding?: string }
 */
export function checkCollision(
  targetLon: number,
  targetLat: number
): { allowed: boolean; collidingBuilding?: string } {
  // 1. Boundary check: must be inside campus perimeter
  const insideCampus = isPointInPolygon([targetLon, targetLat], CAMPUS_CONFIG.boundary);
  if (!insideCampus) {
    return { allowed: false, collidingBuilding: 'Campus Boundary Wall' };
  }

  // 2. Building collision check
  for (const collider of buildingColliders) {
    // Fast AABB bounding box rejection
    if (
      targetLon >= collider.minLon &&
      targetLon <= collider.maxLon &&
      targetLat >= collider.minLat &&
      targetLat <= collider.maxLat
    ) {
      // Precise point-in-polygon check
      if (isPointInPolygon([targetLon, targetLat], collider.polygon)) {
        return { allowed: false, collidingBuilding: collider.name };
      }
    }
  }

  return { allowed: true };
}

/**
 * Computes a slide vector along wall if collision occurs
 */
export function resolveMovementWithCollision(
  currentLon: number,
  currentLat: number,
  nextLon: number,
  nextLat: number
): { lon: number; lat: number; collided: boolean } {
  // Test direct next step
  const directCheck = checkCollision(nextLon, nextLat);
  if (directCheck.allowed) {
    return { lon: nextLon, lat: nextLat, collided: false };
  }

  // Attempt X-only slide (Lon movement)
  const xCheck = checkCollision(nextLon, currentLat);
  if (xCheck.allowed) {
    return { lon: nextLon, lat: currentLat, collided: true };
  }

  // Attempt Y-only slide (Lat movement)
  const yCheck = checkCollision(currentLon, nextLat);
  if (yCheck.allowed) {
    return { lon: currentLon, lat: nextLat, collided: true };
  }

  // Blocked in both directions
  return { lon: currentLon, lat: currentLat, collided: true };
}
