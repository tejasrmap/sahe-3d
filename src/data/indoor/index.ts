import { Building } from '../../types/campus';
import { IndoorBuildingData } from './types';
import { CSE_BLOCK_INDOOR } from './buildings/cseBlock';
import { ECE_BLOCK_INDOOR } from './buildings/eceBlock';
import { MECH_CIVIL_BLOCK_INDOOR } from './buildings/mechCivilBlock';
import { ADMIN_LIBRARY_INDOOR } from './buildings/adminLibrary';
import { generateProceduralIndoorBuilding } from './proceduralIndoorGenerator';

export * from './types';
export { CSE_BLOCK_INDOOR } from './buildings/cseBlock';
export { ECE_BLOCK_INDOOR } from './buildings/eceBlock';
export { MECH_CIVIL_BLOCK_INDOOR } from './buildings/mechCivilBlock';
export { ADMIN_LIBRARY_INDOOR } from './buildings/adminLibrary';
export { generateProceduralIndoorBuilding } from './proceduralIndoorGenerator';

export const INDOOR_BLUEPRINTS_MAP: Record<string, IndoorBuildingData> = {
  'cse-it-complex': CSE_BLOCK_INDOOR,
  'ece-electronics-block': ECE_BLOCK_INDOOR,
  'mech-civil-block': MECH_CIVIL_BLOCK_INDOOR,
  'admin-central-library': ADMIN_LIBRARY_INDOOR,
};

/**
 * Returns custom blueprint if available, or procedurally generates complete indoor digital twin.
 */
export function getIndoorBuildingData(building: Building): IndoorBuildingData {
  if (INDOOR_BLUEPRINTS_MAP[building.id]) {
    return INDOOR_BLUEPRINTS_MAP[building.id];
  }
  return generateProceduralIndoorBuilding(building);
}
