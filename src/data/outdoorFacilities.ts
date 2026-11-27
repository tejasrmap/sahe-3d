export type OutdoorVerificationStatus = 'verified-survey' | 'verified-aerial' | 'approximate-inferred';

export interface OutdoorFacility {
  id: string;
  name: string;
  code: string;
  category: 'athletic' | 'court' | 'amenity' | 'research' | 'utility' | 'parking';
  latitude: number;
  longitude: number;
  areaSqm: number;
  description: string;
  facilities: string[];
  coordinates: [number, number][]; // [lon, lat]
  color: string;
  verificationStatus: OutdoorVerificationStatus;
  optionalOverlay: boolean;
}

export const OUTDOOR_FACILITIES: OutdoorFacility[] = [
  {
    "id": "cricket-athletic-oval",
    "name": "Main University Athletic Field & Cricket Oval",
    "code": "FIELD-CRICKET",
    "category": "athletic",
    "latitude": 16.483462,
    "longitude": 80.691021,
    "areaSqm": 18500,
    "description": "Championship 400m 6-lane athletic running track, natural clay cricket pitch, regulation football ground, and grass spectator embankment.",
    "facilities": [
      "Natural Turf Cricket Pitch",
      "400m 6-Lane Athletic Running Track",
      "Full-Size Football Field",
      "Spectator Grass Embankment",
      "High-Intensity Solar Floodlights"
    ],
    "coordinates": [
      [
        80.69067,
        16.4842784
      ],
      [
        80.6902094,
        16.4828948
      ],
      [
        80.691269,
        16.4824624
      ],
      [
        80.6919357,
        16.4842135
      ],
      [
        80.69067,
        16.4842784
      ]
    ],
    "color": "#16A34A",
    "verificationStatus": "verified-survey",
    "optionalOverlay": false
  },
  {
    "id": "basketball-court-complex",
    "name": "University Floodlit Basketball Courts",
    "code": "COURT-BB",
    "category": "court",
    "latitude": 16.483275,
    "longitude": 80.692525,
    "areaSqm": 980,
    "description": "Dual regulation outdoor synthetic acrylic basketball courts with LED floodlighting, chainlink fencing, and team bench shelters, located adjacent to the Indoor Sports Arena.",
    "facilities": [
      "2 Synthetic Acrylic Competition Courts",
      "Shatterproof Glass Backboards",
      "Four-Corner LED Floodlighting Towers",
      "Player Bench Shelters"
    ],
    "coordinates": [
      [
        80.69235,
        16.48315
      ],
      [
        80.6927,
        16.48315
      ],
      [
        80.6927,
        16.4834
      ],
      [
        80.69235,
        16.4834
      ],
      [
        80.69235,
        16.48315
      ]
    ],
    "color": "#2563EB",
    "verificationStatus": "verified-aerial",
    "optionalOverlay": false
  },
  {
    "id": "volleyball-courts",
    "name": "Campus Volleyball & Throwball Arena",
    "code": "COURT-VB",
    "category": "court",
    "latitude": 16.483275,
    "longitude": 80.692925,
    "areaSqm": 980,
    "description": "Dual sand and red clay volleyball courts designed for inter-collegiate tournaments and sports training.",
    "facilities": [
      "2 Tournament Clay Courts",
      "Heavy-Duty Net Rigging",
      "Perimeter Boundary Enclosure"
    ],
    "coordinates": [
      [
        80.69275,
        16.48315
      ],
      [
        80.6931,
        16.48315
      ],
      [
        80.6931,
        16.4834
      ],
      [
        80.69275,
        16.4834
      ],
      [
        80.69275,
        16.48315
      ]
    ],
    "color": "#D97706",
    "verificationStatus": "verified-aerial",
    "optionalOverlay": false
  },
  {
    "id": "open-air-auditorium",
    "name": "Open-Air Amphitheatre & Cultural Stage",
    "code": "OPEN-AUD",
    "category": "amenity",
    "latitude": 16.484135,
    "longitude": 80.69296,
    "areaSqm": 700,
    "description": "Stepped open amphitheatre with covered acoustic proscenium stage in the central quadrangle between Administrative block and Central Library.",
    "facilities": [
      "Raised Performance Stage",
      "Tiered Stone Spectator Steps",
      "Acoustic Reflective Shell",
      "Outdoor Lighting Trusses"
    ],
    "coordinates": [
      [
        80.69282,
        16.48402
      ],
      [
        80.6931,
        16.48402
      ],
      [
        80.6931,
        16.48425
      ],
      [
        80.69282,
        16.48425
      ],
      [
        80.69282,
        16.48402
      ]
    ],
    "color": "#9333EA",
    "verificationStatus": "verified-aerial",
    "optionalOverlay": false
  },
  {
    "id": "bus-terminal-parking",
    "name": "University Bus Terminal & Transit Bay",
    "code": "BUS-TERM",
    "category": "parking",
    "latitude": 16.48228,
    "longitude": 80.69218,
    "areaSqm": 1260,
    "description": "Spacious paved bus depot accommodating Siddhartha Academy college transit buses with covered pedestrian walkways and direct access to the campus loop road.",
    "facilities": [
      "Heavy Vehicle Bus Bays",
      "Covered Passenger Boarding Concourse",
      "Transit Security Dispatch Post",
      "Vehicle Wash & Maintenance Pit"
    ],
    "coordinates": [
      [
        80.6919402,
        16.4822181
      ],
      [
        80.6923435,
        16.4820997
      ],
      [
        80.6924198,
        16.4823419
      ],
      [
        80.6920165,
        16.4824603
      ],
      [
        80.6919402,
        16.4822181
      ]
    ],
    "color": "#0284C7",
    "verificationStatus": "verified-aerial",
    "optionalOverlay": false
  },
  {
    "id": "greenhouse-polyhouse",
    "name": "Agricultural Greenhouse & Botanical Polyhouse",
    "code": "POLYHOUSE",
    "category": "research",
    "latitude": 16.4862,
    "longitude": 80.6945,
    "areaSqm": 800,
    "description": "Climate-controlled research greenhouse and polyhouse structure for botany, plant tissue culture, and university environmental initiatives.",
    "facilities": [
      "Misting & Drip Irrigation Control",
      "Polycarbonate Thermal Envelope",
      "Hydroponic Growing Tables",
      "Medicinal Flora Nursery"
    ],
    "coordinates": [
      [
        80.6943,
        16.4861
      ],
      [
        80.6947,
        16.4861
      ],
      [
        80.6947,
        16.4863
      ],
      [
        80.6943,
        16.4863
      ],
      [
        80.6943,
        16.4861
      ]
    ],
    "color": "#15803D",
    "verificationStatus": "approximate-inferred",
    "optionalOverlay": true
  },
  {
    "id": "vermicompost-plant",
    "name": "Solid Waste Management & Vermicompost Plant",
    "code": "COMPOST",
    "category": "utility",
    "latitude": 16.4862,
    "longitude": 80.69495,
    "areaSqm": 800,
    "description": "Campus sustainability unit processing biodegradable dining waste and landscaping cuttings into certified organic compost.",
    "facilities": [
      "Aerobic Composting Bays (8)",
      "Earthworm Vermicompost Beds",
      "Organic Sifting & Bagging Unit",
      "Campus Zero-Waste Processing"
    ],
    "coordinates": [
      [
        80.69475,
        16.4861
      ],
      [
        80.69515,
        16.4861
      ],
      [
        80.69515,
        16.4863
      ],
      [
        80.69475,
        16.4863
      ],
      [
        80.69475,
        16.4861
      ]
    ],
    "color": "#78350F",
    "verificationStatus": "approximate-inferred",
    "optionalOverlay": true
  }
];
