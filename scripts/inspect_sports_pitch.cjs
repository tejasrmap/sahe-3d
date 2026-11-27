const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scripts/osm_sahe_raw.json', 'utf8'));
const nodeMap = new Map();
raw.elements.forEach(e => {
  if (e.type === 'node') nodeMap.set(e.id, [e.lon, e.lat]);
});

console.log('Searching for leisure/sport ways...');
raw.elements.forEach(e => {
  if (e.type === 'way') {
    const t = e.tags || {};
    if (t.leisure || t.sport || t.landuse === 'grass' || t.landuse === 'recreation_ground' || e.id === 1418702314) {
      const coords = (e.nodes || []).map(id => nodeMap.get(id)).filter(Boolean);
      console.log(`Way ${e.id}:`, JSON.stringify(t));
      console.log('Coords:', JSON.stringify(coords));
    }
  }
});
