const fs = require('fs');

// 1. UPDATE src/data/pois.ts
const poisPath = 'src/data/pois.ts';
let poisContent = fs.readFileSync(poisPath, 'utf8');
const startIndex = poisContent.indexOf('[');
const arrayStart = poisContent.indexOf('[', startIndex + 1);
const pois = JSON.parse(poisContent.substring(arrayStart, poisContent.lastIndexOf(']') + 1));

const poiUpdates = {
  'poi-main-gate': { lat: 16.481751, lon: 80.691194 },
  'poi-central-lib': { lat: 16.484796, lon: 80.692981 },
  'poi-cse-lab': { lat: 16.485196, lon: 80.691326 },
  'poi-canteen-court': { lat: 16.484198, lon: 80.693365 },
  'poi-auditorium': { lat: 16.48413, lon: 80.692521 },
  'poi-siemens-coe': { lat: 16.48525, lon: 80.693635 },
  'poi-sports-ground': { lat: 16.48337, lon: 80.691073 },
  'poi-indoor-gym': { lat: 16.483287, lon: 80.692101 },
  'poi-sbi-atm': { lat: 16.482809, lon: 80.693648 },
  'poi-medical-dispensary': { lat: 16.482809, lon: 80.693648 },
  'poi-boys-hostel': { lat: 16.485343, lon: 80.695713 },
  'poi-girls-hostel': { lat: 16.484003, lon: 80.695196 },
  'poi-parking': { lat: 16.482538, lon: 80.691939 },
  'poi-placement-cell': { lat: 16.484796, lon: 80.692981 },
  'poi-restroom-hub': { lat: 16.48425, lon: 80.6928 },
};

pois.forEach((p) => {
  if (poiUpdates[p.id]) {
    p.latitude = poiUpdates[p.id].lat;
    p.longitude = poiUpdates[p.id].lon;
  }
});

const newPoisContent = poisContent.substring(0, arrayStart) + JSON.stringify(pois, null, 2) + ';\n';
fs.writeFileSync(poisPath, newPoisContent);
console.log('Updated src/data/pois.ts with rectified coordinates');

// 2. UPDATE src/data/campusPaths.ts
const pathsFile = 'src/data/campusPaths.ts';
let pathsContent = fs.readFileSync(pathsFile, 'utf8');

const nodeUpdates = {
  'node-gate': { lat: 16.481751, lon: 80.691194 },
  'node-junc-south': { lat: 16.4821, lon: 80.6914 },
  'node-parking': { lat: 16.482538, lon: 80.691939 },
  'node-atm': { lat: 16.482809, lon: 80.693648 },
  'node-sports-complex': { lat: 16.483287, lon: 80.692101 },
  'node-athletic-ground': { lat: 16.48337, lon: 80.691073 },
  'node-health-center': { lat: 16.482809, lon: 80.693648 },
  'node-junc-central': { lat: 16.4844, lon: 80.6923 },
  'node-auditorium': { lat: 16.48413, lon: 80.692521 },
  'node-canteen': { lat: 16.484198, lon: 80.693365 },
  'node-admin-lib': { lat: 16.484796, lon: 80.692981 },
  'node-cse-block': { lat: 16.485196, lon: 80.691326 },
  'node-ece-block': { lat: 16.485292, lon: 80.69238 },
  'node-mech-block': { lat: 16.48525, lon: 80.693635 },
  'node-boys-hostel': { lat: 16.485343, lon: 80.695713 },
  'node-girls-hostel': { lat: 16.484003, lon: 80.695196 },
};

// Replace node coordinates in campusPaths.ts using regex
for (const [nodeId, coords] of Object.entries(nodeUpdates)) {
  const nodeRegex = new RegExp(
    `("id":\\s*"${nodeId}"[\\s\\S]*?"latitude":\\s*)[\\d.]+([\\s\\S]*?"longitude":\\s*)[\\d.]+`
  );
  pathsContent = pathsContent.replace(nodeRegex, `$1${coords.lat}$2${coords.lon}`);
}

fs.writeFileSync(pathsFile, pathsContent);
console.log('Updated src/data/campusPaths.ts with rectified node coordinates');
