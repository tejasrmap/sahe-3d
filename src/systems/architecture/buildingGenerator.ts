import * as Cesium from 'cesium';
import { EnrichedBuilding } from '../../data/buildingArchitecture';
import { generateFloorBands, generateEntrancePortico, FloorLevelBand, EntranceStructure } from './facadeGenerator';
import { generateRoofStructures, ProceduralRoofElement } from './roofGenerator';

export type BuildingLOD = 'LOD1' | 'LOD2' | 'LOD3';

export interface ProceduralBuildingModel {
  buildingId: string;
  lod: BuildingLOD;
  basePositions: Cesium.Cartesian3[];
  floorBands: FloorLevelBand[];
  roofElements: ProceduralRoofElement[];
  entrancePortico: EntranceStructure | null;
  baseColor: Cesium.Color;
  outlineColor: Cesium.Color;
  centroidCartesian: Cesium.Cartesian3;
}

// Geometry Cache to guarantee 60fps performance
const modelCache: Map<string, ProceduralBuildingModel> = new Map();

export function getOrGenerateProceduralBuilding(
  building: EnrichedBuilding,
  lod: BuildingLOD = 'LOD3'
): ProceduralBuildingModel {
  const cacheKey = `${building.id}-${lod}`;
  if (modelCache.has(cacheKey)) {
    return modelCache.get(cacheKey)!;
  }

  const profile = building.architecturalProfile;

  // Flatten footprint to Cartesian3 positions
  const flat: number[] = [];
  for (const [lon, lat] of building.footprint) {
    flat.push(lon, lat);
  }
  const basePositions = Cesium.Cartesian3.fromDegreesArray(flat);

  const centroid: [number, number] = [building.longitude, building.latitude];
  const centroidCartesian = Cesium.Cartesian3.fromDegrees(building.longitude, building.latitude, building.height + 4);

  // Generate floor bands (for LOD2 & LOD3)
  const floorBands = lod !== 'LOD1' ? generateFloorBands(building.floors, building.height, profile) : [];

  // Generate roof structures (for LOD2 & LOD3)
  const roofElements = lod !== 'LOD1' ? generateRoofStructures(building.id, building.footprint, building.height, centroid, profile.roof) : [];

  // Generate entrance structures (for LOD3)
  const entrancePortico = lod === 'LOD3' ? generateEntrancePortico(building.id, centroid, profile.entrance) : null;

  const baseColor = Cesium.Color.fromCssColorString(profile.wallColor || '#E2E8F0');
  const outlineColor = Cesium.Color.fromCssColorString(profile.trimColor || '#22C55E').withAlpha(0.7);

  const model: ProceduralBuildingModel = {
    buildingId: building.id,
    lod,
    basePositions,
    floorBands,
    roofElements,
    entrancePortico,
    baseColor,
    outlineColor,
    centroidCartesian,
  };

  modelCache.set(cacheKey, model);
  return model;
}

export function clearBuildingCache(): void {
  modelCache.clear();
}
