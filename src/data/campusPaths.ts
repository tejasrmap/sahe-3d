import { CampusPathNetwork } from '../types/campus';

export const CAMPUS_PATH_NETWORK: CampusPathNetwork = {
  nodes: [
    // 1. South Sector & Entrance
    {
      id: "node-gate",
      name: "Main Entrance Gate Portal",
      latitude: 16.481820,
      longitude: 80.691194,
      category: "entrance",
      buildingId: "main-entrance-portal"
    },
    {
      id: "node-junc-south",
      name: "South Boulevard Junction",
      latitude: 16.482100,
      longitude: 80.691400,
      category: "junction"
    },
    {
      id: "node-parking",
      name: "Parking Plaza Entry Gate",
      latitude: 16.482600,
      longitude: 80.691700,
      category: "amenity",
      buildingId: "parking-plaza"
    },
    {
      id: "node-junc-south-road",
      name: "South Perimeter Road Junction",
      latitude: 16.482200,
      longitude: 80.692500,
      category: "junction"
    },
    {
      id: "node-atm",
      name: "SBI ATM Kiosk & Banking Hub",
      latitude: 16.482700,
      longitude: 80.693480,
      category: "amenity"
    },
    {
      id: "node-health-center",
      name: "Health Center Clinic Entrance",
      latitude: 16.482809,
      longitude: 80.693480,
      category: "building",
      buildingId: "health-center"
    },

    // 2. West & Sports Sector
    {
      id: "node-athletic-ground",
      name: "Athletic Field Pavilion Entry",
      latitude: 16.483370,
      longitude: 80.691073,
      category: "amenity"
    },
    {
      id: "node-junc-west-track",
      name: "West Athletic Concourse Junction",
      latitude: 16.483700,
      longitude: 80.691500,
      category: "junction"
    },
    {
      id: "node-sports-complex",
      name: "Sports Arena East Entrance",
      latitude: 16.483287,
      longitude: 80.692280,
      category: "building",
      buildingId: "sports-arena"
    },
    {
      id: "node-junc-central-avenue",
      name: "Auditorium-Cafeteria Central Avenue",
      latitude: 16.483800,
      longitude: 80.692950,
      category: "junction"
    },

    // 3. Central Academic Circle Sector
    {
      id: "node-junc-central",
      name: "Central Campus Circle",
      latitude: 16.484400,
      longitude: 80.692300,
      category: "junction"
    },
    {
      id: "node-auditorium",
      name: "Auditorium North Portico",
      latitude: 16.484280,
      longitude: 80.692520,
      category: "building",
      buildingId: "auditorium-complex"
    },
    {
      id: "node-canteen",
      name: "Cafeteria West Entrance Court",
      latitude: 16.484198,
      longitude: 80.693120,
      category: "building",
      buildingId: "cafeteria-complex"
    },
    {
      id: "node-admin-lib",
      name: "Administration & Library West Portico",
      latitude: 16.484796,
      longitude: 80.692580,
      category: "building",
      buildingId: "admin-central-library"
    },

    // 4. North Academic Concourse
    {
      id: "node-junc-north",
      name: "North Academic Concourse",
      latitude: 16.484900,
      longitude: 80.692100,
      category: "junction"
    },
    {
      id: "node-cse",
      name: "CSE Computing Block East Entrance",
      latitude: 16.485190,
      longitude: 80.691850,
      category: "building",
      buildingId: "cse-it-complex"
    },
    {
      id: "node-ece",
      name: "ECE Block South Concourse Entrance",
      latitude: 16.484920,
      longitude: 80.692380,
      category: "building",
      buildingId: "ece-eee-block"
    },
    {
      id: "node-mech",
      name: "Mechanical & Civil Block Entry Porch",
      latitude: 16.484900,
      longitude: 80.693350,
      category: "building",
      buildingId: "mech-civil-block"
    },

    // 5. East Sector & Hostels
    {
      id: "node-junc-east-spine",
      name: "East Academic-Residential Avenue",
      latitude: 16.484800,
      longitude: 80.694200,
      category: "junction"
    },
    {
      id: "node-boys-hostel",
      name: "Boys Hostel Main Access Gate",
      latitude: 16.485100,
      longitude: 80.695713,
      category: "building",
      buildingId: "boys-hostel-complex"
    },
    {
      id: "node-girls-hostel",
      name: "Girls Hostel Security Gate",
      latitude: 16.484003,
      longitude: 80.694950,
      category: "building",
      buildingId: "girls-hostel-complex"
    }
  ],
  edges: [
    // Gateway & South Parking
    {
      from: "node-gate",
      to: "node-junc-south",
      distanceMeters: 38,
      name: "Main Boulevard",
      accessible: true
    },
    {
      from: "node-junc-south",
      to: "node-parking",
      distanceMeters: 64,
      name: "Parking Access Way",
      accessible: true
    },
    {
      from: "node-junc-south",
      to: "node-junc-south-road",
      distanceMeters: 118,
      name: "South Campus Perimeter Road",
      accessible: true
    },
    {
      from: "node-junc-south-road",
      to: "node-atm",
      distanceMeters: 119,
      name: "ATM & Banking Walk",
      accessible: true
    },
    {
      from: "node-atm",
      to: "node-health-center",
      distanceMeters: 12,
      name: "Health Center Clinic Link",
      accessible: true
    },
    {
      from: "node-junc-south-road",
      to: "node-sports-complex",
      distanceMeters: 123,
      name: "Sports Arena South Approach",
      accessible: true
    },

    // Athletic Track & West Concourse
    {
      from: "node-junc-south",
      to: "node-athletic-ground",
      distanceMeters: 146,
      name: "West Sports Track",
      accessible: true
    },
    {
      from: "node-athletic-ground",
      to: "node-junc-west-track",
      distanceMeters: 59,
      name: "Athletic Field Pavilion Path",
      accessible: true
    },
    {
      from: "node-junc-west-track",
      to: "node-junc-central",
      distanceMeters: 116,
      name: "Auditorium West Garden Walk",
      accessible: true
    },

    // Sports Arena to Central Circle via Central Avenue
    {
      from: "node-sports-complex",
      to: "node-junc-central-avenue",
      distanceMeters: 91,
      name: "Gymnasium East Link",
      accessible: true
    },
    {
      from: "node-junc-central-avenue",
      to: "node-canteen",
      distanceMeters: 48,
      name: "Cafeteria South Concourse",
      accessible: true
    },

    // Central Circle Hub
    {
      from: "node-junc-central",
      to: "node-auditorium",
      distanceMeters: 27,
      name: "Auditorium Portico Concourse",
      accessible: true
    },
    {
      from: "node-junc-central",
      to: "node-canteen",
      distanceMeters: 90,
      name: "Cafeteria Concourse",
      accessible: true
    },
    {
      from: "node-junc-central",
      to: "node-admin-lib",
      distanceMeters: 53,
      name: "Administration Avenue",
      accessible: true
    },
    {
      from: "node-junc-central",
      to: "node-junc-north",
      distanceMeters: 60,
      name: "Central Academic Spine",
      accessible: true
    },

    // North Academic Concourse
    {
      from: "node-junc-north",
      to: "node-cse",
      distanceMeters: 42,
      name: "Computing Block Avenue",
      accessible: true
    },
    {
      from: "node-junc-north",
      to: "node-ece",
      distanceMeters: 30,
      name: "Electronics Concourse",
      accessible: true
    },
    {
      from: "node-junc-north",
      to: "node-admin-lib",
      distanceMeters: 53,
      name: "Central Plaza Walk",
      accessible: true
    },
    {
      from: "node-ece",
      to: "node-mech",
      distanceMeters: 103,
      name: "Inter-Department Engineering Link",
      accessible: true
    },

    // East Sector & Hostels
    {
      from: "node-mech",
      to: "node-junc-east-spine",
      distanceMeters: 91,
      name: "Mechanical East Walk",
      accessible: true
    },
    {
      from: "node-junc-east-spine",
      to: "node-boys-hostel",
      distanceMeters: 165,
      name: "Boys Residency North Avenue",
      accessible: true
    },
    {
      from: "node-junc-east-spine",
      to: "node-girls-hostel",
      distanceMeters: 119,
      name: "Aditya Women's Hostel Avenue",
      accessible: true
    },
    {
      from: "node-girls-hostel",
      to: "node-boys-hostel",
      distanceMeters: 148,
      name: "Hostel Perimeter Walkway",
      accessible: true
    }
  ]
};

export const CAMPUS_PATH_GRAPH = CAMPUS_PATH_NETWORK;
