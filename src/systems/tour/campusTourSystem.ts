export interface TourStop {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  buildingId?: string;
  camera: {
    longitude: number;
    latitude: number;
    height: number;
    heading: number; // degrees
    pitch: number; // degrees
    duration: number; // seconds
  };
  durationSeconds: number; // time to pause at stop before auto-advancing
}

export const CAMPUS_TOUR_STOPS: TourStop[] = [
  {
    id: 'stop-1-gate',
    title: 'SAHE University Grand Entrance Portal',
    badge: 'STOP 1 OF 10',
    subtitle: 'Ceremonial Campus Gateway • VR Siddhartha College Road',
    description: 'Welcome to SAHE University! The main entrance portal serves as the primary ceremonial gateway off Bandar Road, featuring dual automated security boom barriers, visitor registration kiosks, and bus turnaround concourses.',
    buildingId: 'main-entrance-portal',
    camera: {
      longitude: 80.6912,
      latitude: 16.4813,
      height: 45,
      heading: 0,
      pitch: -18,
      duration: 2.5,
    },
    durationSeconds: 8,
  },
  {
    id: 'stop-2-avenue',
    title: 'Central Academic Boulevard',
    badge: 'STOP 2 OF 10',
    subtitle: 'Pedestrian Spine & Palm Promenade',
    description: 'Moving northward along South Avenue, the tree-lined pedestrian avenue connects the parking plazas, SBI banking kiosk, and student services to the core academic quadrangle.',
    camera: {
      longitude: 80.6919,
      latitude: 16.4828,
      height: 70,
      heading: 25,
      pitch: -28,
      duration: 3.0,
    },
    durationSeconds: 8,
  },
  {
    id: 'stop-3-cse',
    title: 'VR Siddhartha CSE & Computing Complex',
    badge: 'STOP 3 OF 10',
    subtitle: '5-Story Computing Center • AI & Data Science Hub',
    description: 'The flagship computing facility of the university. Houses high-performance NVIDIA GPU clusters for deep learning, cybersecurity testbeds, 12 smart lecture halls, and cloud engineering laboratories.',
    buildingId: 'cse-it-complex',
    camera: {
      longitude: 80.6918,
      latitude: 16.4846,
      height: 110,
      heading: 320,
      pitch: -32,
      duration: 3.0,
    },
    durationSeconds: 9,
  },
  {
    id: 'stop-4-ece',
    title: 'Electronics & Electrical Sciences Block',
    badge: 'STOP 4 OF 10',
    subtitle: 'VLSI Design, Embedded Systems & Microgrid Labs',
    description: 'Equipped with Cadence and Synopsys electronic design automation suites, Texas Instruments IoT prototyping setups, and renewable energy research setups.',
    buildingId: 'ece-eee-block',
    camera: {
      longitude: 80.6928,
      latitude: 16.4846,
      height: 105,
      heading: 345,
      pitch: -30,
      duration: 2.8,
    },
    durationSeconds: 8,
  },
  {
    id: 'stop-5-mech',
    title: 'Mechanical & Civil Engineering Complex',
    badge: 'STOP 5 OF 10',
    subtitle: 'Siemens Industrial Automation CoE & Heavy Workshops',
    description: 'Features world-class industrial robotics, 5-axis CNC machining, concrete characterization presses, hydraulics flumes, and the collaborative Siemens Centre of Excellence.',
    buildingId: 'mech-civil-block',
    camera: {
      longitude: 80.6939,
      latitude: 16.4847,
      height: 115,
      heading: 330,
      pitch: -32,
      duration: 2.8,
    },
    durationSeconds: 8,
  },
  {
    id: 'stop-6-admin-lib',
    title: 'Central Administration & Dr. VR Library',
    badge: 'STOP 6 OF 10',
    subtitle: 'Monumental Headquarters & 120,000 Volume Knowledge Repository',
    description: 'The administrative heart of SAHE, housing the Vice Chancellor’s Secretariat, Examination Directorate, and a 3-tier Central Library with 24/7 digital journal access.',
    buildingId: 'admin-central-library',
    camera: {
      longitude: 80.6934,
      latitude: 16.4842,
      height: 95,
      heading: 310,
      pitch: -26,
      duration: 3.0,
    },
    durationSeconds: 9,
  },
  {
    id: 'stop-7-auditorium',
    title: 'Dr. Zakir Husain Central Auditorium',
    badge: 'STOP 7 OF 10',
    subtitle: '1,500-Seat Acoustic Theater & Open Amphitheatre',
    description: 'Venue for annual convocations, international research symposiums, and cultural festivals, equipped with Dolby acoustics and flanked by an open-air amphitheatre.',
    buildingId: 'auditorium-complex',
    camera: {
      longitude: 80.6929,
      latitude: 16.4836,
      height: 80,
      heading: 315,
      pitch: -28,
      duration: 2.8,
    },
    durationSeconds: 8,
  },
  {
    id: 'stop-8-cafeteria',
    title: 'Central Cafeteria & Student Food Court',
    badge: 'STOP 8 OF 10',
    subtitle: 'Multi-Cuisine Dining & Shaded Pergola Patio',
    description: 'A vibrant campus social hub offering hygienic South/North Indian cuisines, coffee lounges, and open-air tree-canopied patio seating for 800+ students.',
    buildingId: 'cafeteria-complex',
    camera: {
      longitude: 80.6937,
      latitude: 16.4838,
      height: 75,
      heading: 290,
      pitch: -28,
      duration: 2.5,
    },
    durationSeconds: 8,
  },
  {
    id: 'stop-9-sports',
    title: 'Indoor Sports Arena & Athletic Complex',
    badge: 'STOP 9 OF 10',
    subtitle: 'Badminton Stadium, Fitness Gym & Cricket Oval',
    description: 'Features 4 international-spec synthetic badminton courts, Olympic table tennis, strength training gym, and the adjoining cricket oval with a 400m running track.',
    buildingId: 'sports-arena',
    camera: {
      longitude: 80.6917,
      latitude: 16.4827,
      height: 85,
      heading: 25,
      pitch: -30,
      duration: 2.8,
    },
    durationSeconds: 8,
  },
  {
    id: 'stop-10-overview',
    title: 'SAHE Campus Panoramic Horizon',
    badge: 'STOP 10 OF 10',
    subtitle: 'Complete 24.5-Acre University Digital Twin',
    description: 'You have completed the guided tour of SAHE University! Feel free to switch to First-Person Immersive Mode (WASD) to walk the pathways, or use the Search tool to navigate to any department.',
    camera: {
      longitude: 80.6928,
      latitude: 16.4808,
      height: 480,
      heading: 15,
      pitch: -45,
      duration: 3.5,
    },
    durationSeconds: 10,
  },
];
