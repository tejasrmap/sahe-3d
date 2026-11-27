const fs = require('fs');

const content = fs.readFileSync('./src/data/buildings.ts', 'utf8');
const startIndex = content.indexOf('[');
const arrayStart = content.indexOf('[', startIndex + 1); // skip `Building[]`
const jsonText = content.substring(arrayStart, content.lastIndexOf(']') + 1);
const buildings = JSON.parse(jsonText);

console.log('=== CURRENT 12 CAMPUS BUILDINGS GIS INVENTORY ===\n');
buildings.forEach((b, i) => {
  const lons = b.footprint.map((p) => p[0]);
  const lats = b.footprint.map((p) => p[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const widthM = ((maxLon - minLon) * 111320 * Math.cos((b.latitude * Math.PI) / 180)).toFixed(1);
  const heightM = ((maxLat - minLat) * 110574).toFixed(1);
  console.log(`${i + 1}. [${b.id}] (${b.code}) - ${b.name}`);
  console.log(`   Center: Lat ${b.latitude}, Lon ${b.longitude}`);
  console.log(`   Footprint: ${b.footprint.length} vertices, Bounding Box: [${minLon.toFixed(6)}, ${minLat.toFixed(6)}] to [${maxLon.toFixed(6)}, ${maxLat.toFixed(6)}]`);
  console.log(`   Dimensions: ~${widthM}m (E-W) x ~${heightM}m (N-S), Stated Height: ${b.height}m, Floors: ${b.floors}`);
  console.log(`   First 2 vertices: ${JSON.stringify(b.footprint.slice(0, 2))}`);
  console.log('');
});
