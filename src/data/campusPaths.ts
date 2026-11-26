import { CampusPathNetwork } from '../types/campus';

export const CAMPUS_PATH_NETWORK: CampusPathNetwork = {
  nodes: [
  {
    "id": "node-gate",
    "name": "Main Entrance Gate",
    "latitude": 16.481751,
    "longitude": 80.691194,
    "category": "entrance",
    "buildingId": "main-entrance-portal"
  },
  {
    "id": "node-junc-south",
    "name": "South Avenue Junction",
    "latitude": 16.4821,
    "longitude": 80.6914,
    "category": "junction"
  },
  {
    "id": "node-parking",
    "name": "Parking Plaza Entry",
    "latitude": 16.482538,
    "longitude": 80.691939,
    "category": "amenity",
    "buildingId": "parking-plaza"
  },
  {
    "id": "node-atm",
    "name": "SBI ATM & Banking Kiosk",
    "latitude": 16.482809,
    "longitude": 80.693648,
    "category": "amenity"
  },
  {
    "id": "node-sports-complex",
    "name": "Sports Complex Entrance",
    "latitude": 16.483287,
    "longitude": 80.692101,
    "category": "building",
    "buildingId": "sports-arena"
  },
  {
    "id": "node-athletic-ground",
    "name": "Athletic Field Entry",
    "latitude": 16.48337,
    "longitude": 80.691073,
    "category": "amenity"
  },
  {
    "id": "node-health-center",
    "name": "Health Center",
    "latitude": 16.482809,
    "longitude": 80.693648,
    "category": "building",
    "buildingId": "health-center"
  },
  {
    "id": "node-junc-central",
    "name": "Central Campus Circle",
    "latitude": 16.4844,
    "longitude": 80.6923,
    "category": "junction"
  },
  {
    "id": "node-auditorium",
    "name": "Auditorium Portico",
    "latitude": 16.48413,
    "longitude": 80.692521,
    "category": "building",
    "buildingId": "auditorium-complex"
  },
  {
    "id": "node-canteen",
    "name": "Cafeteria Court",
    "latitude": 16.484198,
    "longitude": 80.693365,
    "category": "building",
    "buildingId": "cafeteria-complex"
  },
  {
    "id": "node-admin-lib",
    "name": "Administration & Library Portico",
    "latitude": 16.484796,
    "longitude": 80.692981,
    "category": "building",
    "buildingId": "admin-central-library"
  },
  {
    "id": "node-junc-north",
    "name": "North Academic Quadrangle",
    "latitude": 16.4849,
    "longitude": 80.6921,
    "category": "junction"
  },
  {
    "id": "node-cse",
    "name": "CSE Computing Block Entrance",
    "latitude": 16.48519,
    "longitude": 80.691393,
    "category": "building",
    "buildingId": "cse-it-complex"
  },
  {
    "id": "node-ece",
    "name": "ECE Block Entrance",
    "latitude": 16.485267,
    "longitude": 80.692469,
    "category": "building",
    "buildingId": "ece-eee-block"
  },
  {
    "id": "node-mech",
    "name": "Mechanical & Civil Block Entry",
    "latitude": 16.485271,
    "longitude": 80.693554,
    "category": "building",
    "buildingId": "mech-civil-block"
  },
  {
    "id": "node-boys-hostel",
    "name": "Boys Hostel Gate",
    "latitude": 16.485343,
    "longitude": 80.695713,
    "category": "building",
    "buildingId": "boys-hostel-complex"
  },
  {
    "id": "node-girls-hostel",
    "name": "Girls Hostel Gate",
    "latitude": 16.484003,
    "longitude": 80.695196,
    "category": "building",
    "buildingId": "girls-hostel-complex"
  }
],
  edges: [
  {
    "from": "node-gate",
    "to": "node-junc-south",
    "distanceMeters": 74,
    "name": "Main Boulevard",
    "accessible": true
  },
  {
    "from": "node-junc-south",
    "to": "node-parking",
    "distanceMeters": 34,
    "name": "Parking Access Way",
    "accessible": true
  },
  {
    "from": "node-junc-south",
    "to": "node-athletic-ground",
    "distanceMeters": 146,
    "name": "West Sports Track",
    "accessible": true
  },
  {
    "from": "node-parking",
    "to": "node-atm",
    "distanceMeters": 39,
    "name": "Bank Avenue",
    "accessible": true
  },
  {
    "from": "node-atm",
    "to": "node-sports-complex",
    "distanceMeters": 70,
    "name": "Gymnasium Promenade",
    "accessible": true
  },
  {
    "from": "node-sports-complex",
    "to": "node-health-center",
    "distanceMeters": 83,
    "name": "East Wellness Path",
    "accessible": true
  },
  {
    "from": "node-sports-complex",
    "to": "node-junc-central",
    "distanceMeters": 64,
    "name": "Central Boulevard",
    "accessible": true
  },
  {
    "from": "node-athletic-ground",
    "to": "node-junc-central",
    "distanceMeters": 132,
    "name": "Pavilion Way",
    "accessible": true
  },
  {
    "from": "node-junc-central",
    "to": "node-auditorium",
    "distanceMeters": 38,
    "name": "Auditorium Walkway",
    "accessible": true
  },
  {
    "from": "node-junc-central",
    "to": "node-canteen",
    "distanceMeters": 123,
    "name": "Cafeteria Walkway",
    "accessible": true
  },
  {
    "from": "node-auditorium",
    "to": "node-admin-lib",
    "distanceMeters": 89,
    "name": "Scholar's Concourse",
    "accessible": true
  },
  {
    "from": "node-canteen",
    "to": "node-admin-lib",
    "distanceMeters": 73,
    "name": "Library East Way",
    "accessible": true
  },
  {
    "from": "node-canteen",
    "to": "node-girls-hostel",
    "distanceMeters": 197,
    "name": "South Residential Path",
    "accessible": true
  },
  {
    "from": "node-junc-central",
    "to": "node-junc-north",
    "distanceMeters": 112,
    "name": "Academic Spine",
    "accessible": true
  },
  {
    "from": "node-junc-north",
    "to": "node-cse",
    "distanceMeters": 82,
    "name": "Computing Avenue",
    "accessible": true
  },
  {
    "from": "node-junc-north",
    "to": "node-ece",
    "distanceMeters": 57,
    "name": "Electronics Concourse",
    "accessible": true
  },
  {
    "from": "node-junc-north",
    "to": "node-admin-lib",
    "distanceMeters": 88,
    "name": "Central Plaza Walk",
    "accessible": true
  },
  {
    "from": "node-admin-lib",
    "to": "node-mech",
    "distanceMeters": 86,
    "name": "Engineering Way",
    "accessible": true
  },
  {
    "from": "node-ece",
    "to": "node-mech",
    "distanceMeters": 116,
    "name": "Inter-Department Link",
    "accessible": true
  },
  {
    "from": "node-mech",
    "to": "node-boys-hostel",
    "distanceMeters": 116,
    "name": "North Residential Link",
    "accessible": true
  },
  {
    "from": "node-girls-hostel",
    "to": "node-boys-hostel",
    "distanceMeters": 191,
    "name": "Hostel Perimeter Path",
    "accessible": true
  }
]
};

export const CAMPUS_PATH_GRAPH = CAMPUS_PATH_NETWORK;
