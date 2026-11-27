const fs = require('fs');

const content = fs.readFileSync('./src/data/buildings.ts', 'utf8');
const startIndex = content.indexOf('[');
const arrayStart = content.indexOf('[', startIndex + 1);
const currentBuildings = JSON.parse(content.substring(arrayStart, content.lastIndexOf(']') + 1));

const osmFeatures = JSON.parse(fs.readFileSync('scripts/campus_osm_features.json', 'utf8'));

console.log('=== AUDIT OF CURRENT 12 BUILDINGS AGAINST OSM SATELLITE ROOFTOPS ===\n');

currentBuildings.forEach((b) => {
  console.log(`\n--------------------------------------------------`);
  console.log(`BUILDING: [${b.id}] ${b.name}`);
  console.log(`Current Center: Lat ${b.latitude}, Lon ${b.longitude}`);
  console.log(`Current Footprint Points: ${b.footprint.length}`);

  let bestMatch = null;
  let minDistance = Infinity;

  osmFeatures.forEach((f) => {
    const dLat = (f.center[1] - b.latitude) * 110574;
    const dLon = (f.center[0] - b.longitude) * 111320 * Math.cos((b.latitude * Math.PI) / 180);
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = { feature: f, dist };
    }
  });

  if (bestMatch && minDistance < 150) {
    const f = bestMatch.feature;
    console.log(`Closest OSM Rooftop: Way ${f.id} (Distance: ${minDistance.toFixed(1)} meters)`);
    console.log(`OSM Center: Lat ${f.center[1].toFixed(6)}, Lon ${f.center[0].toFixed(6)}`);
    console.log(`OSM Points: ${f.pointsCount}, Tags: ${JSON.stringify(f.tags)}`);
    console.log(`OSM Bounds: [${f.bounds.minLon.toFixed(6)}, ${f.bounds.minLat.toFixed(6)}] to [${f.bounds.maxLon.toFixed(6)}, ${f.bounds.maxLat.toFixed(6)}]`);
  } else {
    console.log(`No direct OSM footprint match within 150m (Closest was ${minDistance.toFixed(1)}m away)`);
  }
});
