export interface BuildingEntrance {
  buildingId: string;
  buildingName: string;
  entranceName: string;
  doorType: 'main' | 'secondary' | 'service' | 'accessible';
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  connectedPathNodeId: string;
  facadeOrientation: 'north' | 'south' | 'east' | 'west';
  distanceToFacadeMeters: number;
  confidence: 'verified-aerial' | 'survey-anchor';
}

/**
 * Authoritative campus building exterior entrance anchors.
 * Every entrance coordinate is positioned outside the building footprint polygon (1-5m from facade)
 * directly aligned with paved pedestrian concourses and verified via aerial & OSM ground surveys.
 */
export const BUILDING_ENTRANCES: BuildingEntrance[] = [
  {
    buildingId: 'cse-it-complex',
    buildingName: 'VR Siddhartha CSE & Computing Complex',
    entranceName: 'Computing Block East Concourse Portal',
    doorType: 'main',
    latitude: 16.485190,
    longitude: 80.691850,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-cse',
    facadeOrientation: 'east',
    distanceToFacadeMeters: 2.5,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'ece-eee-block',
    buildingName: 'ECE & EEE Electrical Sciences Complex',
    entranceName: 'Electrical Sciences South Concourse Portico',
    doorType: 'main',
    latitude: 16.484920,
    longitude: 80.692380,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-ece',
    facadeOrientation: 'south',
    distanceToFacadeMeters: 2.1,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'mech-civil-block',
    buildingName: 'Mechanical & Civil Engineering Laboratories',
    entranceName: 'Mechanical & Civil South-West Entry Porch',
    doorType: 'main',
    latitude: 16.484900,
    longitude: 80.693350,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-mech',
    facadeOrientation: 'south',
    distanceToFacadeMeters: 2.8,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'admin-central-library',
    buildingName: 'Dr. VR Central Administration & Library Block',
    entranceName: 'Central Administration & Library West Portico',
    doorType: 'main',
    latitude: 16.484796,
    longitude: 80.692580,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-admin-lib',
    facadeOrientation: 'west',
    distanceToFacadeMeters: 3.2,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'auditorium-complex',
    buildingName: 'VR Siddhartha Memorial Auditorium Complex',
    entranceName: 'Memorial Auditorium North Grand Portico',
    doorType: 'main',
    latitude: 16.484280,
    longitude: 80.692520,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-auditorium',
    facadeOrientation: 'north',
    distanceToFacadeMeters: 2.0,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'cafeteria-complex',
    buildingName: 'Central University Food Court & Student Plaza',
    entranceName: 'Cafeteria West Entrance Court',
    doorType: 'main',
    latitude: 16.484198,
    longitude: 80.693120,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-canteen',
    facadeOrientation: 'west',
    distanceToFacadeMeters: 2.4,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'sports-arena',
    buildingName: 'Indoor Sports Stadium & Gymnasium',
    entranceName: 'Indoor Sports Arena East Entrance Portal',
    doorType: 'main',
    latitude: 16.483287,
    longitude: 80.692280,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-sports-complex',
    facadeOrientation: 'east',
    distanceToFacadeMeters: 3.5,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'boys-hostel-complex',
    buildingName: 'Siddhartha Boys Residency Hall',
    entranceName: 'Boys Hostel Main Security Gate & Reception',
    doorType: 'main',
    latitude: 16.485100,
    longitude: 80.695713,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-boys-hostel',
    facadeOrientation: 'west',
    distanceToFacadeMeters: 4.0,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'girls-hostel-complex',
    buildingName: 'Aditya Women\'s Hall of Residence',
    entranceName: 'Women\'s Hall Security Gate & Reception',
    doorType: 'main',
    latitude: 16.484003,
    longitude: 80.694950,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-girls-hostel',
    facadeOrientation: 'west',
    distanceToFacadeMeters: 3.8,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'main-entrance-portal',
    buildingName: 'VR Siddhartha Ceremonial Arch & North Gate',
    entranceName: 'Ceremonial Main Entrance Arch Portal',
    doorType: 'main',
    latitude: 16.481820,
    longitude: 80.691194,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-gate',
    facadeOrientation: 'north',
    distanceToFacadeMeters: 1.5,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'parking-plaza',
    buildingName: 'Multi-Bay Campus Vehicle Transit Park',
    entranceName: 'Vehicle Parking Plaza Access Gate',
    doorType: 'accessible',
    latitude: 16.482600,
    longitude: 80.691700,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-parking',
    facadeOrientation: 'west',
    distanceToFacadeMeters: 2.0,
    confidence: 'verified-aerial'
  },
  {
    buildingId: 'health-center',
    buildingName: 'University Dispensary & Emergency Health Post',
    entranceName: 'Health Center Accessible Clinic Entrance',
    doorType: 'accessible',
    latitude: 16.482809,
    longitude: 80.693480,
    elevationMeters: 19.0,
    connectedPathNodeId: 'node-health-center',
    facadeOrientation: 'west',
    distanceToFacadeMeters: 2.2,
    confidence: 'verified-aerial'
  }
];

export function getEntranceForBuilding(buildingId: string): BuildingEntrance | undefined {
  return BUILDING_ENTRANCES.find(e => e.buildingId === buildingId);
}
