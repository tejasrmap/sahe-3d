import * as Cesium from 'cesium';

/**
 * Geographic conversion and Cesium helper utilities
 */

export function coordinatesToCartesian3Array(coordinates: [number, number][], height = 0): Cesium.Cartesian3[] {
  return coordinates.map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat, height));
}

export function coordinateToCartesian3(lon: number, lat: number, height = 0): Cesium.Cartesian3 {
  return Cesium.Cartesian3.fromDegrees(lon, lat, height);
}

export function cartesian3ToCoordinate(cartesian: Cesium.Cartesian3): { longitude: number; latitude: number; height: number } {
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  return {
    longitude: Cesium.Math.toDegrees(cartographic.longitude),
    latitude: Cesium.Math.toDegrees(cartographic.latitude),
    height: cartographic.height,
  };
}

export function calculateCentroid(points: [number, number][]): [number, number] {
  if (!points || points.length === 0) return [0, 0];
  let sumLon = 0;
  let sumLat = 0;
  for (const [lon, lat] of points) {
    sumLon += lon;
    sumLat += lat;
  }
  return [sumLon / points.length, sumLat / points.length];
}

export function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
