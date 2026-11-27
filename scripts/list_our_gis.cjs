const fs = require('fs');

const bldgText = fs.readFileSync('src/data/buildings.ts', 'utf8');
const buildings = [];
const blocks = bldgText.split(/\{\s*"id":/g).slice(1);
for (const b of blocks) {
  const id = b.match(/^\s*"([^"]+)"/)?.[1];
  const name = b.match(/"name":\s*"([^"]+)"/)?.[1];
  const code = b.match(/"code":\s*"([^"]+)"/)?.[1];
  const category = b.match(/"category":\s*"([^"]+)"/)?.[1];
  const lat = parseFloat(b.match(/"latitude":\s*([\d\.]+)/)?.[1]);
  const lng = parseFloat(b.match(/"longitude":\s*([\d\.]+)/)?.[1]);
  const height = parseFloat(b.match(/"height":\s*([\d\.]+)/)?.[1]);
  buildings.push({ id, name, code, category, lat, lng, height });
}
console.log('=== OUR BUILDINGS (' + buildings.length + ') ===');
buildings.forEach(b => console.log(`${b.id.padEnd(24)} | ${(b.name || '').padEnd(45)} | ${b.lat}, ${b.lng}`));

const poiText = fs.readFileSync('src/data/pois.ts', 'utf8');
const pois = [];
const poiBlocks = poiText.split(/\{\s*"id":/g).slice(1);
for (const p of poiBlocks) {
  const id = p.match(/^\s*"([^"]+)"/)?.[1];
  const name = p.match(/"name":\s*"([^"]+)"/)?.[1];
  const category = p.match(/"category":\s*"([^"]+)"/)?.[1];
  const lat = parseFloat(p.match(/"latitude":\s*([\d\.]+)/)?.[1]);
  const lng = parseFloat(p.match(/"longitude":\s*([\d\.]+)/)?.[1]);
  pois.push({ id, name, category, lat, lng });
}
console.log('\n=== OUR POIS (' + pois.length + ') ===');
pois.forEach(p => console.log(`${p.id.padEnd(24)} | ${(p.name || '').padEnd(35)} | ${p.category.padEnd(12)} | ${p.lat}, ${p.lng}`));
