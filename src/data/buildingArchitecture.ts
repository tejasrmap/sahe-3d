import { ARCHITECTURAL_PROFILES, ArchitecturalProfile } from '../systems/architecture/architectureProfiles';
import { CAMPUS_BUILDINGS } from './buildings';
import { Building } from '../types/campus';

export interface EnrichedBuilding extends Building {
  architecturalProfile: ArchitecturalProfile;
}

export function getEnrichedBuilding(buildingId: string): EnrichedBuilding | undefined {
  const building = CAMPUS_BUILDINGS.find((b) => b.id === buildingId);
  if (!building) return undefined;

  const profile = ARCHITECTURAL_PROFILES[buildingId] || ARCHITECTURAL_PROFILES['cse-it-complex'];

  return {
    ...building,
    architecturalProfile: profile,
  };
}

export function getAllEnrichedBuildings(): EnrichedBuilding[] {
  return CAMPUS_BUILDINGS.map((b) => {
    const profile = ARCHITECTURAL_PROFILES[b.id] || ARCHITECTURAL_PROFILES['cse-it-complex'];
    return {
      ...b,
      architecturalProfile: profile,
    };
  });
}
