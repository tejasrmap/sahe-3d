const fs = require('fs');
const path = require('path');

const bldgText = fs.readFileSync('src/data/buildings.ts', 'utf8');
const pathsText = fs.readFileSync('src/data/campusPaths.ts', 'utf8');
const poisText = fs.readFileSync('src/data/pois.ts', 'utf8');

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

// Parse path nodes
const nodes = [];
const nodeBlocks = pathsText.split(/\{\s*"id":\s*"node-/g).slice(1);
for (const nb of nodeBlocks) {
  const id = 'node-' + nb.match(/^([^"]+)"/)?.[1];
  const name = nb.match(/"name":\s*"([^"]+)"/)?.[1];
  const lat = parseFloat(nb.match(/"latitude":\s*([\d\.]+)/)?.[1]);
  const lng = parseFloat(nb.match(/"longitude":\s*([\d\.]+)/)?.[1]);
  const buildingId = nb.match(/"buildingId":\s*"([^"]+)"/)?.[1];
  nodes.push({ id, name, lat, lng, buildingId });
}

console.log('=== BUILDINGS VS CONNECTED PATH NODES ===');
for (const n of nodes) {
  if (n.buildingId) {
    const b = buildings.find(x => x.id === n.buildingId);
    if (b) {
      const dLat = (n.lat - b.lat) * 111320;
      const dLon = (n.lng - b.lng) * 111320 * Math.cos(b.lat * Math.PI / 180);
      const dist = Math.hypot(dLat, dLon);
      console.log(`${n.id.padEnd(20)} -> ${b.id.padEnd(22)} | Node: [${n.lat.toFixed(6)}, ${n.lng.toFixed(6)}] | Bldg Centroid: [${b.lat.toFixed(6)}, ${b.lng.toFixed(6)}] | Dist: ${dist.toFixed(1)}m`);
    }
  }
}
