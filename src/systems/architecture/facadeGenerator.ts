import * as Cesium from 'cesium';
import { ArchitecturalProfile, EntranceConfig } from './architectureProfiles';

export interface FloorLevelBand {
  floorIndex: number;
  heightStart: number;
  heightEnd: number;
  isWindowBand: boolean;
  material: Cesium.Color;
  outlineColor: Cesium.Color;
}

export interface EntranceStructure {
  id: string;
  positions: Cesium.Cartesian3[];
  height: number;
  extrudedHeight: number;
  material: Cesium.Color;
  columns?: { position: Cesium.Cartesian3; height: number; radius: number }[];
}

/**
 * Generate vertical floor-by-floor divisions with alternating window ribbons & concrete spandrels
 */
export function generateFloorBands(
  floorsCount: number,
  totalHeight: number,
  profile: ArchitecturalProfile
): FloorLevelBand[] {
  const bands: FloorLevelBand[] = [];
  const actualFloorHeight = totalHeight / Math.max(1, floorsCount);
  const wallColor = Cesium.Color.fromCssColorString(profile.wallColor);
  const windowColor = Cesium.Color.fromCssColorString(profile.windowPattern.glassColor).withAlpha(0.85);
  const trimColor = Cesium.Color.fromCssColorString(profile.trimColor || '#22C55E').withAlpha(0.9);

  for (let i = 0; i < floorsCount; i++) {
    const floorBase = i * actualFloorHeight;
    const sillHeight = 0.9;
    const windowHeight = actualFloorHeight * 0.55;
    const spandrelHeight = actualFloorHeight - (sillHeight + windowHeight);

    // 1. Lower concrete sill wall
    bands.push({
      floorIndex: i,
      heightStart: floorBase,
      heightEnd: floorBase + sillHeight,
      isWindowBand: false,
      material: wallColor,
      outlineColor: Cesium.Color.WHITE.withAlpha(0.2),
    });

    // 2. Glazed window ribbon band
    bands.push({
      floorIndex: i,
      heightStart: floorBase + sillHeight,
      heightEnd: floorBase + sillHeight + windowHeight,
      isWindowBand: true,
      material: windowColor,
      outlineColor: Cesium.Color.fromCssColorString(profile.windowPattern.frameColor || '#000000').withAlpha(0.5),
    });

    // 3. Upper floor spandrel & architectural chajja belt
    bands.push({
      floorIndex: i,
      heightStart: floorBase + sillHeight + windowHeight,
      heightEnd: floorBase + actualFloorHeight,
      isWindowBand: false,
      material: i === floorsCount - 1 ? trimColor : wallColor,
      outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
    });
  }

  return bands;
}

/**
 * Procedurally generate an architectural entrance portico at the building front
 */
export function generateEntrancePortico(
  buildingId: string,
  centroid: [number, number],
  entranceConfig: EntranceConfig
): EntranceStructure | null {
  if (!entranceConfig.hasPortico || entranceConfig.widthMeters <= 0) return null;

  const [centerLon, centerLat] = centroid;
  // Calculate a projected front canopy box
  // Degree offsets (~111km per deg lat, ~105km per deg lon at 16 deg N)
  const halfWidthDeg = (entranceConfig.widthMeters / 2) / 105000;
  const depthDeg = entranceConfig.depthMeters / 111000;
  const southOffsetDeg = 0.00012; // place in front facing south avenue

  const porticoCoords: [number, number][] = [
    [centerLon - halfWidthDeg, centerLat - southOffsetDeg],
    [centerLon + halfWidthDeg, centerLat - southOffsetDeg],
    [centerLon + halfWidthDeg, centerLat - southOffsetDeg - depthDeg],
    [centerLon - halfWidthDeg, centerLat - southOffsetDeg - depthDeg],
    [centerLon - halfWidthDeg, centerLat - southOffsetDeg],
  ];

  const flat: number[] = [];
  for (const [lon, lat] of porticoCoords) {
    flat.push(lon, lat);
  }

  const positions = Cesium.Cartesian3.fromDegreesArray(flat);

  return {
    id: `${buildingId}-entrance-portico`,
    positions,
    height: 0,
    extrudedHeight: entranceConfig.heightMeters,
    material: Cesium.Color.fromCssColorString(entranceConfig.canopyColor || '#22C55E').withAlpha(0.9),
  };
}
