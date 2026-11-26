import * as Cesium from 'cesium';
import { RoofDetails } from './architectureProfiles';

export interface ProceduralRoofElement {
  id: string;
  type: 'parapet' | 'penthouse' | 'hvac' | 'solar-array';
  positions: Cesium.Cartesian3[];
  extrudedHeight: number;
  height: number;
  material: Cesium.Color;
  outlineColor: Cesium.Color;
}

export function generateRoofStructures(
  buildingId: string,
  footprint: [number, number][],
  baseHeight: number,
  centroid: [number, number],
  roofConfig: RoofDetails
): ProceduralRoofElement[] {
  const elements: ProceduralRoofElement[] = [];
  const [centerLon, centerLat] = centroid;

  // 1. Perimeter Parapet Wall
  if (roofConfig.parapetHeightMeters > 0) {
    const flat: number[] = [];
    for (const [lon, lat] of footprint) {
      flat.push(lon, lat);
    }
    const positions = Cesium.Cartesian3.fromDegreesArray(flat);

    elements.push({
      id: `${buildingId}-roof-parapet`,
      type: 'parapet',
      positions,
      height: baseHeight,
      extrudedHeight: baseHeight + roofConfig.parapetHeightMeters,
      material: Cesium.Color.fromCssColorString(roofConfig.roofColor || '#64748B').withAlpha(0.95),
      outlineColor: Cesium.Color.WHITE.withAlpha(0.4),
    });
  }

  // 2. Elevator / Stairwell Penthouse Box
  if (roofConfig.hasElevatorPenthouse && roofConfig.penthouseHeightMeters > 0) {
    // Generate a centered rectangular penthouse box (~8m x 6m in degrees)
    const dLon = 0.00007; // ~7 meters
    const dLat = 0.00005; // ~5 meters
    const penthouseCoords: [number, number][] = [
      [centerLon - dLon, centerLat - dLat],
      [centerLon + dLon, centerLat - dLat],
      [centerLon + dLon, centerLat + dLat],
      [centerLon - dLon, centerLat + dLat],
      [centerLon - dLon, centerLat - dLat],
    ];

    const flat: number[] = [];
    for (const [lon, lat] of penthouseCoords) {
      flat.push(lon, lat);
    }

    elements.push({
      id: `${buildingId}-roof-penthouse`,
      type: 'penthouse',
      positions: Cesium.Cartesian3.fromDegreesArray(flat),
      height: baseHeight,
      extrudedHeight: baseHeight + roofConfig.penthouseHeightMeters,
      material: Cesium.Color.fromCssColorString('#475569'),
      outlineColor: Cesium.Color.WHITE.withAlpha(0.5),
    });
  }

  // 3. Rooftop HVAC Chiller Bank
  if (roofConfig.hasHVACUnits) {
    const dLon = 0.00004;
    const dLat = 0.00003;
    const offsetLon = 0.00009;
    const hvacCoords: [number, number][] = [
      [centerLon + offsetLon - dLon, centerLat - dLat],
      [centerLon + offsetLon + dLon, centerLat - dLat],
      [centerLon + offsetLon + dLon, centerLat + dLat],
      [centerLon + offsetLon - dLon, centerLat + dLat],
      [centerLon + offsetLon - dLon, centerLat - dLat],
    ];

    const flat: number[] = [];
    for (const [lon, lat] of hvacCoords) {
      flat.push(lon, lat);
    }

    elements.push({
      id: `${buildingId}-roof-hvac`,
      type: 'hvac',
      positions: Cesium.Cartesian3.fromDegreesArray(flat),
      height: baseHeight + 0.2,
      extrudedHeight: baseHeight + 1.8,
      material: Cesium.Color.fromCssColorString('#94A3B8'),
      outlineColor: Cesium.Color.BLACK.withAlpha(0.4),
    });
  }

  // 4. Rooftop Solar Panel Canopy Array
  if (roofConfig.hasSolarPanels) {
    const dLon = 0.00008;
    const dLat = 0.00004;
    const offsetLon = -0.00008;
    const offsetLat = 0.00004;
    const solarCoords: [number, number][] = [
      [centerLon + offsetLon - dLon, centerLat + offsetLat - dLat],
      [centerLon + offsetLon + dLon, centerLat + offsetLat - dLat],
      [centerLon + offsetLon + dLon, centerLat + offsetLat + dLat],
      [centerLon + offsetLon - dLon, centerLat + offsetLat + dLat],
      [centerLon + offsetLon - dLon, centerLat + offsetLat - dLat],
    ];

    const flat: number[] = [];
    for (const [lon, lat] of solarCoords) {
      flat.push(lon, lat);
    }

    elements.push({
      id: `${buildingId}-roof-solar`,
      type: 'solar-array',
      positions: Cesium.Cartesian3.fromDegreesArray(flat),
      height: baseHeight + 0.4,
      extrudedHeight: baseHeight + 0.8,
      material: Cesium.Color.fromCssColorString('#1E3A8A'), // deep photovoltaic blue
      outlineColor: Cesium.Color.fromCssColorString('#38BDF8').withAlpha(0.6),
    });
  }

  return elements;
}
