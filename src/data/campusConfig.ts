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
    [80.690800, 16.481800],
    [80.690300, 16.483500],
    [80.690500, 16.485500],
    [80.691200, 16.486200],
    [80.693800, 16.486400],
    [80.695200, 16.485800],
    [80.695800, 16.483800],
    [80.694800, 16.481800],
    [80.692800, 16.481700],
    [80.691500, 16.481600],
    [80.690800, 16.481800]
  ]
};
