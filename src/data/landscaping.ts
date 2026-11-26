export type VegetationType =
  | 'neem-tree'
  | 'gulmohar-tree'
  | 'ashoka-columnar'
  | 'royal-palm'
  | 'bougainvillea-hedge';

export type LandscapeFeatureCategory =
  | 'tree'
  | 'plaza'
  | 'lawn'
  | 'streetlight'
  | 'pathway-walk';

export interface LandscapingItem {
  id: string;
  category: LandscapeFeatureCategory;
  name: string;
  latitude: number;
  longitude: number;
  type?: VegetationType;
  scale?: number; // visual scale in meters (e.g. tree crown diameter 4-8m)
  heightMeters?: number;
  color?: string;
  confidence: 'verified-aerial' | 'procedurally-placed';
}

export interface LandscapePolygon {
  id: string;
  name: string;
  category: 'lawn' | 'plaza' | 'athletic-turf';
  coordinates: [number, number][]; // [lon, lat]
  color: string;
  roughness?: number;
}

// 1. Campus Plazas & Paved Gathering Spaces
export const CAMPUS_PLAZAS: LandscapePolygon[] = [
  {
    id: 'plaza-knowledge',
    name: "Dr. VR Central Knowledge Plaza",
    category: 'plaza',
    color: '#334155', // granite paving
    coordinates: [
      [80.6923, 16.4844],
      [80.6929, 16.4844],
      [80.6929, 16.4849],
      [80.6923, 16.4849],
      [80.6923, 16.4844]
    ]
  },
  {
    id: 'plaza-auditorium-forecourt',
    name: "Auditorium Amphitheatre Forecourt",
    category: 'plaza',
    color: '#475569',
    coordinates: [
      [80.6921, 16.4839],
      [80.6927, 16.4839],
      [80.6927, 16.4841],
      [80.6921, 16.4841],
      [80.6921, 16.4839]
    ]
  },
  {
    id: 'plaza-academic-spine',
    name: "North Academic Pedestrian Concourse",
    category: 'plaza',
    color: '#1E293B',
    coordinates: [
      [80.6917, 16.4849],
      [80.6934, 16.4849],
      [80.6934, 16.4851],
      [80.6917, 16.4851],
      [80.6917, 16.4849]
    ]
  }
];

// 2. Campus Lawns & Green Turf Zones
export const CAMPUS_LAWNS: LandscapePolygon[] = [
  {
    id: 'lawn-central-quad',
    name: "Central Academic Quadrangle Lawn",
    category: 'lawn',
    color: '#15803D', // vibrant grass green
    coordinates: [
      [80.6924, 16.4845],
      [80.6928, 16.4845],
      [80.6928, 16.4848],
      [80.6924, 16.4848],
      [80.6924, 16.4845]
    ]
  },
  {
    id: 'lawn-auditorium-green',
    name: "Auditorium Front Lawn & Palms",
    category: 'lawn',
    color: '#16A34A',
    coordinates: [
      [80.6918, 16.4837],
      [80.6924, 16.4837],
      [80.6924, 16.4839],
      [80.6918, 16.4839],
      [80.6918, 16.4837]
    ]
  },
  {
    id: 'lawn-cricket-oval',
    name: "Main Athletic Turf & Cricket Ground",
    category: 'athletic-turf',
    color: '#15803D',
    coordinates: [
      [80.6904, 16.4832],
      [80.6915, 16.4832],
      [80.6915, 16.4841],
      [80.6904, 16.4841],
      [80.6904, 16.4832]
    ]
  }
];

// 3. Spatially Distributed Trees & Streetlights along Avenues
export const CAMPUS_TREES: LandscapingItem[] = [
  // Avenue Trees - Main Entrance Boulevard (Gate to South Junction)
  { id: 'tree-gate-01', category: 'tree', name: 'Royal Palm', latitude: 16.4819, longitude: 80.6911, type: 'royal-palm', scale: 4.5, heightMeters: 9.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-gate-02', category: 'tree', name: 'Royal Palm', latitude: 16.4819, longitude: 80.6913, type: 'royal-palm', scale: 4.5, heightMeters: 9.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-gate-03', category: 'tree', name: 'Royal Palm', latitude: 16.4821, longitude: 80.6912, type: 'royal-palm', scale: 4.5, heightMeters: 9.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-gate-04', category: 'tree', name: 'Royal Palm', latitude: 16.4821, longitude: 80.6914, type: 'royal-palm', scale: 4.5, heightMeters: 9.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-gate-05', category: 'tree', name: 'Royal Palm', latitude: 16.4823, longitude: 80.6913, type: 'royal-palm', scale: 4.5, heightMeters: 9.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-gate-06', category: 'tree', name: 'Royal Palm', latitude: 16.4823, longitude: 80.6915, type: 'royal-palm', scale: 4.5, heightMeters: 9.0, color: '#166534', confidence: 'verified-aerial' },

  // Shady Neem Trees along Parking Plaza & ATM avenue
  { id: 'tree-park-01', category: 'tree', name: 'Neem Tree', latitude: 16.4824, longitude: 80.6917, type: 'neem-tree', scale: 7.0, heightMeters: 7.5, color: '#15803D', confidence: 'verified-aerial' },
  { id: 'tree-park-02', category: 'tree', name: 'Neem Tree', latitude: 16.4824, longitude: 80.6919, type: 'neem-tree', scale: 7.0, heightMeters: 7.5, color: '#15803D', confidence: 'verified-aerial' },
  { id: 'tree-park-03', category: 'tree', name: 'Neem Tree', latitude: 16.4826, longitude: 80.6920, type: 'neem-tree', scale: 7.0, heightMeters: 7.5, color: '#15803D', confidence: 'verified-aerial' },
  { id: 'tree-park-04', category: 'tree', name: 'Neem Tree', latitude: 16.4828, longitude: 80.6922, type: 'neem-tree', scale: 7.0, heightMeters: 7.5, color: '#15803D', confidence: 'verified-aerial' },

  // Gulmohar Trees flanking Central Circle & Auditorium Quad
  { id: 'tree-quad-01', category: 'tree', name: 'Gulmohar Tree', latitude: 16.4838, longitude: 80.6920, type: 'gulmohar-tree', scale: 8.0, heightMeters: 8.0, color: '#DC2626', confidence: 'verified-aerial' },
  { id: 'tree-quad-02', category: 'tree', name: 'Gulmohar Tree', latitude: 16.4838, longitude: 80.6924, type: 'gulmohar-tree', scale: 8.0, heightMeters: 8.0, color: '#DC2626', confidence: 'verified-aerial' },
  { id: 'tree-quad-03', category: 'tree', name: 'Gulmohar Tree', latitude: 16.4840, longitude: 80.6920, type: 'gulmohar-tree', scale: 8.0, heightMeters: 8.0, color: '#DC2626', confidence: 'verified-aerial' },
  { id: 'tree-quad-04', category: 'tree', name: 'Gulmohar Tree', latitude: 16.4843, longitude: 80.6923, type: 'gulmohar-tree', scale: 8.0, heightMeters: 8.0, color: '#DC2626', confidence: 'verified-aerial' },
  { id: 'tree-quad-05', category: 'tree', name: 'Gulmohar Tree', latitude: 16.4843, longitude: 80.6926, type: 'gulmohar-tree', scale: 8.0, heightMeters: 8.0, color: '#DC2626', confidence: 'verified-aerial' },

  // Ashoka Columnar trees along North Academic Spine
  { id: 'tree-acad-01', category: 'tree', name: 'Columnar Ashoka', latitude: 16.4848, longitude: 80.6915, type: 'ashoka-columnar', scale: 3.5, heightMeters: 10.0, color: '#14532D', confidence: 'verified-aerial' },
  { id: 'tree-acad-02', category: 'tree', name: 'Columnar Ashoka', latitude: 16.4848, longitude: 80.6918, type: 'ashoka-columnar', scale: 3.5, heightMeters: 10.0, color: '#14532D', confidence: 'verified-aerial' },
  { id: 'tree-acad-03', category: 'tree', name: 'Columnar Ashoka', latitude: 16.4848, longitude: 80.6921, type: 'ashoka-columnar', scale: 3.5, heightMeters: 10.0, color: '#14532D', confidence: 'verified-aerial' },
  { id: 'tree-acad-04', category: 'tree', name: 'Columnar Ashoka', latitude: 16.4848, longitude: 80.6925, type: 'ashoka-columnar', scale: 3.5, heightMeters: 10.0, color: '#14532D', confidence: 'verified-aerial' },
  { id: 'tree-acad-05', category: 'tree', name: 'Columnar Ashoka', latitude: 16.4848, longitude: 80.6928, type: 'ashoka-columnar', scale: 3.5, heightMeters: 10.0, color: '#14532D', confidence: 'verified-aerial' },
  { id: 'tree-acad-06', category: 'tree', name: 'Columnar Ashoka', latitude: 16.4848, longitude: 80.6932, type: 'ashoka-columnar', scale: 3.5, heightMeters: 10.0, color: '#14532D', confidence: 'verified-aerial' },
  { id: 'tree-acad-07', category: 'tree', name: 'Columnar Ashoka', latitude: 16.4848, longitude: 80.6936, type: 'ashoka-columnar', scale: 3.5, heightMeters: 10.0, color: '#14532D', confidence: 'verified-aerial' },

  // Perimeter Trees along Canal Road (West)
  { id: 'tree-west-01', category: 'tree', name: 'Neem Tree', latitude: 16.4820, longitude: 80.6905, type: 'neem-tree', scale: 7.5, heightMeters: 8.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-west-02', category: 'tree', name: 'Neem Tree', latitude: 16.4826, longitude: 80.6904, type: 'neem-tree', scale: 7.5, heightMeters: 8.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-west-03', category: 'tree', name: 'Neem Tree', latitude: 16.4832, longitude: 80.6903, type: 'neem-tree', scale: 7.5, heightMeters: 8.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-west-04', category: 'tree', name: 'Neem Tree', latitude: 16.4838, longitude: 80.6904, type: 'neem-tree', scale: 7.5, heightMeters: 8.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-west-05', category: 'tree', name: 'Neem Tree', latitude: 16.4845, longitude: 80.6905, type: 'neem-tree', scale: 7.5, heightMeters: 8.0, color: '#166534', confidence: 'verified-aerial' },
  { id: 'tree-west-06', category: 'tree', name: 'Neem Tree', latitude: 16.4852, longitude: 80.6907, type: 'neem-tree', scale: 7.5, heightMeters: 8.0, color: '#166534', confidence: 'verified-aerial' }
];

// 4. Streetlights & Pathway Luminaires
export const CAMPUS_STREETLIGHTS: LandscapingItem[] = [
  { id: 'light-01', category: 'streetlight', name: 'LED Solar Streetlight', latitude: 16.4820, longitude: 80.6913, heightMeters: 6.0, color: '#FDE047', confidence: 'procedurally-placed' },
  { id: 'light-02', category: 'streetlight', name: 'LED Solar Streetlight', latitude: 16.4824, longitude: 80.6916, heightMeters: 6.0, color: '#FDE047', confidence: 'procedurally-placed' },
  { id: 'light-03', category: 'streetlight', name: 'LED Solar Streetlight', latitude: 16.4828, longitude: 80.6919, heightMeters: 6.0, color: '#FDE047', confidence: 'procedurally-placed' },
  { id: 'light-04', category: 'streetlight', name: 'LED Solar Streetlight', latitude: 16.4833, longitude: 80.6920, heightMeters: 6.0, color: '#FDE047', confidence: 'procedurally-placed' },
  { id: 'light-05', category: 'streetlight', name: 'LED Solar Streetlight', latitude: 16.4839, longitude: 80.6922, heightMeters: 6.0, color: '#FDE047', confidence: 'procedurally-placed' },
  { id: 'light-06', category: 'streetlight', name: 'LED Solar Streetlight', latitude: 16.4844, longitude: 80.6925, heightMeters: 6.0, color: '#FDE047', confidence: 'procedurally-placed' },
  { id: 'light-07', category: 'streetlight', name: 'LED Solar Streetlight', latitude: 16.4849, longitude: 80.6922, heightMeters: 6.0, color: '#FDE047', confidence: 'procedurally-placed' }
];
