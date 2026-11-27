const fs = require('fs');

const bldgText = fs.readFileSync('src/data/buildings.ts', 'utf8');

// Parse buildings
const buildings = [];
const bBlocks = bldgText.split(/\{\s*"id":/g).slice(1);
for (const b of bBlocks) {
  const id = b.match(/^\s*"([^"]+)"/)?.[1];
  const name = b.match(/"name":\s*"([^"]+)"/)?.[1];
  const lat = parseFloat(b.match(/"latitude":\s*([\d\.]+)/)?.[1]);
  const lng = parseFloat(b.match(/"longitude":\s*([\d\.]+)/)?.[1]);
  const fpMatches = [...b.matchAll(/\[\s*([\d\.]+),\s*([\d\.]+)\s*\]/g)];
  const footprint = fpMatches.map(m => [parseFloat(m[1]), parseFloat(m[2])]); // [lon, lat]
  buildings.push({ id, name, lat, lng, footprint });
}

// Check point in polygon
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

// Line segment intersection
function lineSegmentsIntersect(p1, p2, p3, p4) {
  function ccw(A, B, C) {
    return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
  }
  return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4));
}

console.log('Testing whether existing path nodes lie INSIDE building footprints:');
const pathsText = fs.readFileSync('src/data/campusPaths.ts', 'utf8');
const nodeBlocks = pathsText.split(/\{\s*"id":\s*"node-/g).slice(1);
for (const nb of nodeBlocks) {
  const id = 'node-' + nb.match(/^([^"]+)"/)?.[1];
  const lat = parseFloat(nb.match(/"latitude":\s*([\d\.]+)/)?.[1]);
  const lng = parseFloat(nb.match(/"longitude":\s*([\d\.]+)/)?.[1]);
  const pt = [lng, lat];
  for (const b of buildings) {
    if (pointInPoly(pt, b.footprint)) {
      console.log(`[WARNING] Node ${id} lies INSIDE building ${b.id}!`);
    }
  }
}
