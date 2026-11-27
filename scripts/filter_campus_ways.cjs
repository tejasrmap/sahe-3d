const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scripts/osm_sahe_raw.json', 'utf8'));
const nodes = new Map();
raw.elements.filter((e) => e.type === 'node').forEach((n) => nodes.set(n.id, [n.lon, n.lat]));

const ways = raw.elements.filter((e) => e.type === 'way');

// Filter for ways within campus area: Lon 80.690 to 80.696, Lat 16.481 to 16.4865
const campusWays = [];
ways.forEach((w) => {
  const coords = (w.nodes || []).map((id) => nodes.get(id)).filter(Boolean);
  if (coords.length === 0) return;
  const lons = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const centerLon = (minLon + maxLon) / 2;
  const centerLat = (minLat + maxLat) / 2;

  if (centerLon >= 80.690 && centerLon <= 80.696 && centerLat >= 16.4815 && centerLat <= 16.4868) {
    campusWays.push({
      id: w.id,
      tags: w.tags || {},
      center: [centerLon, centerLat],
      bounds: { minLon, maxLon, minLat, maxLat },
      pointsCount: coords.length,
      coordinates: coords,
    });
  }
});

console.log(`Found ${campusWays.length} features within the SAHE campus footprint:\n`);
campusWays.forEach((w, i) => {
  const t = w.tags;
  const desc = t.name || t.amenity || t.building || t.leisure || t.highway || t.barrier || 'feature';
  console.log(`${i + 1}. [Way ${w.id}] (${desc})`);
  console.log(`   Center: Lat ${w.center[1].toFixed(6)}, Lon ${w.center[0].toFixed(6)}`);
  console.log(`   Points: ${w.pointsCount}, Tags: ${JSON.stringify(t)}`);
  console.log(`   Bounds: [${w.bounds.minLon.toFixed(6)}, ${w.bounds.minLat.toFixed(6)}] to [${w.bounds.maxLon.toFixed(6)}, ${w.bounds.maxLat.toFixed(6)}]`);
});

fs.writeFileSync('scripts/campus_osm_features.json', JSON.stringify(campusWays, null, 2));
