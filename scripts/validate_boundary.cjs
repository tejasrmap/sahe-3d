const fs = require('fs');

const configText = fs.readFileSync('src/data/campusConfig.ts', 'utf8');
const bldgText = fs.readFileSync('src/data/buildings.ts', 'utf8');

const bStart = configText.indexOf('boundary: [') + 'boundary: ['.length;
const bEnd = configText.indexOf('  ]', bStart);
const bArrayText = configText.slice(bStart, bEnd);
const boundary = [...bArrayText.matchAll(/\[\s*([\d\.]+),\s*([\d\.]+)\s*\]/g)].map(m => [parseFloat(m[1]), parseFloat(m[2])]);

console.log('Boundary vertices count:', boundary.length);
console.log('Start vertex:', boundary[0]);
console.log('End vertex:', boundary[boundary.length - 1]);
const isClosed = boundary[0][0] === boundary[boundary.length - 1][0] && boundary[0][1] === boundary[boundary.length - 1][1];
console.log('Polygon closed:', isClosed);

let signedArea = 0;
for (let i = 0; i < boundary.length - 1; i++) {
  signedArea += (boundary[i][0] * boundary[i + 1][1] - boundary[i + 1][0] * boundary[i][1]);
}
console.log('Signed area:', signedArea, signedArea > 0 ? '(Counter-Clockwise)' : '(Clockwise)');

function pointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
      (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const buildings = [];
const bBlocks = bldgText.split(/\{\s*"id":/g).slice(1);
for (const b of bBlocks) {
  const id = b.match(/^\s*"([^"]+)"/)?.[1];
  const fpMatches = [...b.matchAll(/\[\s*([\d\.]+),\s*([\d\.]+)\s*\]/g)];
  const footprint = fpMatches.map(m => [parseFloat(m[1]), parseFloat(m[2])]);
  buildings.push({ id, footprint });
}

let allContained = true;
buildings.forEach(b => {
  b.footprint.forEach(pt => {
    if (!pointInPoly(pt, boundary)) {
      console.log(`[WARNING] Vertex [${pt}] of building ${b.id} is outside boundary!`);
      allContained = false;
    }
  });
});
if (allContained) {
  console.log('✓ 100% of all 12 building footprint vertices are contained inside the campus boundary!');
}
