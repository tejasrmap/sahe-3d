const fs = require('fs');

const rectified = JSON.parse(fs.readFileSync('scripts/rectified_12_buildings.json', 'utf8'));

// 1. UPDATE src/data/campusConfig.ts
const campusConfigPath = 'src/data/campusConfig.ts';
let configContent = fs.readFileSync(campusConfigPath, 'utf8');

const updatedBoundary = `  boundary: [
    [80.691100, 16.481680], // Main Entrance Gate South
    [80.690000, 16.482600], // South-West Wall corner (Cricket Ground West)
    [80.690150, 16.484400], // West boundary along sports ground
    [80.690550, 16.485650], // West boundary along CSE block
    [80.691200, 16.486250], // North-West corner
    [80.693950, 16.486450], // North boundary road (TIFAC / Civil north)
    [80.696050, 16.485850], // North-East corner (Boys Hostel East)
    [80.696150, 16.484200], // East boundary (Girls Hostel East)
    [80.694850, 16.481750], // South-East compound corner
    [80.692300, 16.481680], // South boundary approach road
    [80.691260, 16.481680], // South Gate approach east
    [80.691100, 16.481680]  // Closing back to Main Entrance Gate
  ]`;

configContent = configContent.replace(/boundary:\s*\[[\s\S]*?\]\s*};/, `${updatedBoundary}\n};`);
fs.writeFileSync(campusConfigPath, configContent);
console.log('Updated src/data/campusConfig.ts with rectified boundary');

// 2. UPDATE src/data/buildings.ts
const buildingsPath = 'src/data/buildings.ts';
let buildingsFile = fs.readFileSync(buildingsPath, 'utf8');
const startIndex = buildingsFile.indexOf('[');
const arrayStart = buildingsFile.indexOf('[', startIndex + 1);
const buildings = JSON.parse(buildingsFile.substring(arrayStart, buildingsFile.lastIndexOf(']') + 1));

buildings.forEach((b) => {
  const r = rectified[b.id];
  if (r) {
    b.latitude = r.centerLat;
    b.longitude = r.centerLon;
    b.footprint = r.footprint;
    if (b.id === 'main-entrance-portal') {
      b.height = 7;
      b.floors = 1;
    } else if (b.id === 'health-center') {
      b.height = 8;
      b.floors = 2;
    }
  }
});

const newBuildingsFile =
  buildingsFile.substring(0, arrayStart) + JSON.stringify(buildings, null, 2) + ';\n';
fs.writeFileSync(buildingsPath, newBuildingsFile);
console.log('Updated src/data/buildings.ts with rectified building footprints and centers');
