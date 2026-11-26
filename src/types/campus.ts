export type BuildingCategory =
  | 'academic'
  | 'administration'
  | 'library'
  | 'laboratory'
  | 'auditorium'
  | 'sports'
  | 'cafeteria'
  | 'hostel'
  | 'parking'
  | 'medical'
  | 'entrance'
  | 'amenity';

export type POICategory =
  | 'academic'
  | 'administration'
  | 'library'
  | 'laboratory'
  | 'hostel'
  | 'food'
  | 'sports'
  | 'parking'
  | 'medical'
  | 'entrance'
  | 'atm'
  | 'restrooms'
  | 'student_services';

export interface Building {
  id: string;
  name: string;
  code: string;
  category: BuildingCategory;
  latitude: number;
  longitude: number;
  height: number;
  floors: number;
  description: string;
  departments: string[];
  facilities: string[];
  footprint: [number, number][]; // [lon, lat]
  modelUrl?: string | null;
  imageUrl?: string | null;
  operatingHours?: string;
  contact?: string;
  color?: string;
}

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  latitude: number;
  longitude: number;
  description: string;
  icon: string;
  buildingId?: string;
  operatingHours?: string;
  imageUrl?: string;
}

export interface PathNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category?: 'entrance' | 'junction' | 'building' | 'amenity';
  buildingId?: string;
}

export interface PathEdge {
  from: string;
  to: string;
  distanceMeters: number;
  accessible?: boolean;
  name?: string;
}

export interface CampusPathNetwork {
  nodes: PathNode[];
  edges: PathEdge[];
}

export type CampusPathGraph = CampusPathNetwork;

export interface NavigationRoute {
  nodes: PathNode[];
  coordinates: [number, number][]; // [lon, lat]
  distanceMeters: number;
  estimatedMinutes: number;
  steps: string[];
}

export interface MapLayerState {
  satellite: boolean;
  buildings: boolean;
  pois: boolean;
  boundary: boolean;
  labels: boolean;
  terrain3D: boolean;
}

export interface CameraState {
  heading: number;
  pitch: number;
  roll: number;
  height: number;
  latitude: number;
  longitude: number;
}
