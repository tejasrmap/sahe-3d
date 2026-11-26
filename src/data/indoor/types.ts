export type RoomCategory =
  | 'classroom'
  | 'laboratory'
  | 'faculty_office'
  | 'department_office'
  | 'meeting_room'
  | 'library'
  | 'seminar_hall'
  | 'washroom'
  | 'storage'
  | 'corridor'
  | 'staircase'
  | 'elevator'
  | 'reception'
  | 'server_room'
  | 'student_lounge'
  | 'cafeteria';

export type IndoorConfidence =
  | 'verified-blueprint'
  | 'field-surveyed'
  | 'procedurally-estimated';

export interface DoorOpening {
  wall: 'north' | 'south' | 'east' | 'west';
  offset: number; // offset from wall start in meters
  width: number;
}

export interface WindowOpening {
  wall: 'north' | 'south' | 'east' | 'west';
  offset: number;
  width: number;
}

export interface IndoorRoom {
  id: string;
  name: string;
  number: string;
  floor: number;
  category: RoomCategory;
  // Position and bounds relative to the building's floor origin (0,0 is top-left in meters)
  position: {
    x: number; // meters from left
    y: number; // meters from top
  };
  dimensions: {
    width: number; // meters along X
    length: number; // meters along Y
    height?: number; // meters ceiling height (default ~3.8m)
  };
  department?: string;
  description?: string;
  confidence: IndoorConfidence;
  capacity?: number;
  equipment?: string[];
  doors?: DoorOpening[];
  windows?: WindowOpening[];
  color?: string;
}

export interface IndoorStaircase {
  id: string;
  name: string;
  position: { x: number; y: number };
  dimensions: { width: number; length: number };
  connectsFloors: number[];
  type: 'dog-leg' | 'straight' | 'spiral';
}

export interface IndoorElevator {
  id: string;
  name: string;
  position: { x: number; y: number };
  dimensions: { width: number; length: number };
  servesFloors: number[];
  capacity: number;
}

export interface IndoorExit {
  id: string;
  name: string;
  position: { x: number; y: number };
  leadsTo: 'campus-ground' | 'skybridge' | 'balcony' | 'quadrangle';
}

export interface CorridorSegment {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number; // corridor passage width in meters
}

export interface IndoorFloor {
  floorNumber: number; // 0 = Ground, 1 = First, etc., -1 = Basement
  name: string; // e.g. "Ground Floor - Computing Centers"
  levelLabel: string; // "G", "1", "2", "3", "4"
  elevationMeters: number; // relative elevation from ground
  planWidth: number; // overall width in meters
  planLength: number; // overall length in meters
  corridors: CorridorSegment[];
  rooms: IndoorRoom[];
  staircases: IndoorStaircase[];
  elevators: IndoorElevator[];
  exits?: IndoorExit[];
}

export interface IndoorBuildingData {
  buildingId: string;
  buildingName: string;
  buildingCode: string;
  totalFloors: number;
  groundElevationMeters: number;
  floors: IndoorFloor[];
  description: string;
  confidence: IndoorConfidence;
}
