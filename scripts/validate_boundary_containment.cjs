const fs = require('fs');

const rectified = JSON.parse(fs.readFileSync('scripts/rectified_12_buildings.json', 'utf8'));

const campusBoundary = [
  [80.691100, 16.481680],
  [80.690000, 16.482600],
  [80.690150, 16.484400],
  [80.690550, 16.485650],
  [80.691200, 16.486250],
  [80.693950, 16.486450],
  [80.696050, 16.485850],
  [80.696150, 16.484200],
  [80.694850, 16.481750],
  [80.692300, 16.481680],
  [80.691260, 16.481680],
  [80.691100, 16.481680],
];

function pointInPolygon(point, vs) {
  const x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0],
      yi = vs[i][1];
    const xj = vs[j][0],
      yj = vs[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

console.log('=== VALIDATING CAMPUS BOUNDARY CONTAINMENT ===\n');
let allInside = true;

for (const [id, b] of Object.entries(rectified)) {
  const isInside = pointInPolygon([b.centerLon, b.centerLat], campusBoundary);
  console.log(`${id} [${b.centerLat}, ${b.centerLon}]: ${isInside ? 'INSIDE [PASS]' : 'OUTSIDE [FAIL]'}`);
  if (!isInside) allInside = false;

  // Also test all footprint vertices
  for (const pt of b.footprint) {
    if (!pointInPolygon(pt, campusBoundary)) {
      console.log(`  WARNING: Vertex [${pt[0]}, ${pt[1]}] of ${id} is outside boundary!`);
      allInside = false;
    }
  }
}

console.log(`\nAll 12 buildings strictly contained within Campus Boundary: ${allInside}`);
