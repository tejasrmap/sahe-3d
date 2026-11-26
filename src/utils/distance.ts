/**
 * Haversine distance and travel time calculation utilities
 */

export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

export function estimateWalkingMinutes(meters: number): number {
  // Average campus walking pace is ~4.5 km/h = ~75 meters per minute
  const minutes = meters / 75;
  return Math.max(1, Math.round(minutes));
}

export function formatWalkingTime(minutes: number): string {
  if (minutes < 1) return '< 1 min walk';
  if (minutes === 1) return '1 min walk';
  if (minutes < 60) return `${minutes} mins walk`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours} hr ${remaining} mins walk`;
}
