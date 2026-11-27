const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scripts/osm_sahe_raw.json', 'utf8'));
const nodes = new Map();
raw.elements.filter((e) => e.type === 'node').forEach((n) => nodes.set(n.id, [n.lon, n.lat]));

console.log('=== CAMPUS BARRIERS, WALLS, AND HIGHWAYS ===');
raw.elements
  .filter((e) => e.type === 'way' && e.tags && (e.tags.barrier || e.tags.highway || e.tags.amenity === 'college'))
  .forEach((w) => {
    const coords = (w.nodes || []).map((id) => nodes.get(id)).filter(Boolean);
    if (coords.length === 0) return;
    const lons = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    if (minLon >= 80.689 && maxLon <= 80.697 && minLat >= 16.481 && maxLat <= 16.487) {
      console.log(`Way ${w.id}: ${JSON.stringify(w.tags)} | ${coords.length} points`);
      console.log(`   Bounds: [${minLon.toFixed(6)}, ${minLat.toFixed(6)}] to [${maxLon.toFixed(6)}, ${maxLat.toFixed(6)}]`);
      console.log(`   Coords: ${JSON.stringify(coords)}`);
      console.log('');
    }
  });
