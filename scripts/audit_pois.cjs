const fs = require('fs');

const poisText = fs.readFileSync('src/data/pois.ts', 'utf8');
const pois = [];
const pBlocks = poisText.split(/\{\s*"id":/g).slice(1);
for (const pb of pBlocks) {
  const id = pb.match(/^\s*"([^"]+)"/)?.[1];
  const name = pb.match(/"name":\s*"([^"]+)"/)?.[1];
  const category = pb.match(/"category":\s*"([^"]+)"/)?.[1];
  const lat = parseFloat(pb.match(/"latitude":\s*([\d\.]+)/)?.[1]);
  const lng = parseFloat(pb.match(/"longitude":\s*([\d\.]+)/)?.[1]);
  const buildingId = pb.match(/"buildingId":\s*"([^"]+)"/)?.[1] || null;
  pois.push({ id, name, category, lat, lng, buildingId });
}

console.log(`Total POIs: ${pois.length}\n`);

// Check for duplicates
const coordMap = new Map();
pois.forEach(p => {
  const k = `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
  if (!coordMap.has(k)) coordMap.set(k, []);
  coordMap.get(k).push(p);
});

console.log('--- Duplicate Coordinate Analysis ---');
let dupFound = false;
for (const [k, group] of coordMap.entries()) {
  if (group.length > 1) {
    dupFound = true;
    console.log(`Duplicate at [${k}]:`);
    group.forEach(g => console.log(`  - ${g.id} (${g.name}) [buildingId: ${g.buildingId}]`));
  }
}
if (!dupFound) console.log('Zero duplicate coordinates found.');
