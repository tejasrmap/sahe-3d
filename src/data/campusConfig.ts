export interface CampusConfig {
  campusName: string;
  campusFullName: string;
  campusLocation: string;
  tagline: string;
  established: number;
  accreditation: string;
  areaAcres: number;
  latitude: number;
  longitude: number;
  defaultZoom: number;
  defaultPitch: number;
  defaultHeading: number;
  defaultRoll: number;
  initialHeight: number;
  verified: boolean;
  boundary: [number, number][]; // [lon, lat]
  center: [number, number]; // [lon, lat]
}

export const CAMPUS_CONFIG: CampusConfig = {
  campusName: "SAHE",
  campusFullName: "Siddhartha Academy of Higher Education (Deemed to be University)",
  campusLocation: "Chalasani Nagar, Kanuru, Vijayawada, Andhra Pradesh 520007, India",
  tagline: "Explore. Discover. Navigate.",
  established: 1977,
  accreditation: "NAAC A+ Grade | NIRF Top Ranked | AICTE Approved",
  areaAcres: 24.5,
  latitude: 16.484200,
  longitude: 80.692800,
  defaultZoom: 17,
  defaultPitch: -45,
  defaultHeading: 15,
  defaultRoll: 0,
  initialHeight: 450,
  verified: true,
  center: [80.692800, 16.484200],
  boundary: [
    [80.690850, 16.481650], // South-West entrance corner past SBI Bank
    [80.690000, 16.482600], // South-West Wall corner (Cricket Ground West)
    [80.690150, 16.484400], // West boundary along sports ground
    [80.690550, 16.485650], // West boundary along CSE block
    [80.691200, 16.486250], // North-West corner
    [80.692500, 16.486650], // North boundary road (Power substation north)
    [80.693950, 16.486650], // North boundary road (TIFAC / Civil north)
    [80.696050, 16.485850], // North-East corner (Boys Hostel East)
    [80.696150, 16.484200], // East boundary (Girls Hostel East)
    [80.694850, 16.481750], // South-East compound corner
    [80.692300, 16.481650], // South boundary approach road
    [80.691260, 16.481650], // South Gate approach east
    [80.690850, 16.481650]  // Closing back
  ]
};
