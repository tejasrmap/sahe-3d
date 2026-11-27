const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('scripts/osm_sahe_raw.json', 'utf8'));

// Build node map
const nodeMap = new Map();
raw.elements.forEach(e => {
  if (e.type === 'node') nodeMap.set(e.id, [e.lon, e.lat]);
});

const campusWays = [];
raw.elements.forEach(e => {
  if (e.type === 'way') {
    const coords = (e.nodes || []).map(id => nodeMap.get(id)).filter(Boolean);
    if (coords.length > 0) {
      // Calculate centroid
      const avgLon = coords.reduce((acc, c) => acc + c[0], 0) / coords.length;
      const avgLat = coords.reduce((acc, c) => acc + c[1], 0) / coords.length;
      if (avgLat >= 16.481 && avgLat <= 16.487 && avgLon >= 80.690 && avgLon <= 80.697) {
        campusWays.push({
          id: e.id,
          tags: e.tags || {},
          centroid: [avgLat, avgLon],
          nodeCount: coords.length
        });
      }
    }
  }
});

console.log('Total campus ways:', campusWays.length);
campusWays.forEach(w => {
  console.log(`Way ${w.id.toString().padEnd(12)} | Nodes: ${String(w.nodeCount).padStart(3)} | Lat: ${w.centroid[0].toFixed(6)}, Lon: ${w.centroid[1].toFixed(6)} | Tags:`, JSON.stringify(w.tags));
});
