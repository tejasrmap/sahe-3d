const fs = require('fs');
const features = JSON.parse(fs.readFileSync('scripts/campus_osm_features.json', 'utf8'));

console.log('=== BUILDINGS IN HOSTEL / NORTH-EAST CAMPUS AREA ===');
features
  .filter((f) => f.tags.building && f.center[0] >= 80.6938 && f.center[1] >= 16.4845)
  .forEach((f) => {
    const widthM = ((f.bounds.maxLon - f.bounds.minLon) * 111320 * Math.cos((f.center[1] * Math.PI) / 180)).toFixed(1);
    const heightM = ((f.bounds.maxLat - f.bounds.minLat) * 110574).toFixed(1);
    console.log(`Way ${f.id}: Center [${f.center[1].toFixed(6)}, ${f.center[0].toFixed(6)}] | ${widthM}m x ${heightM}m | Points: ${f.pointsCount}`);
    console.log(`   Tags: ${JSON.stringify(f.tags)}`);
    console.log(`   Bounds: [${f.bounds.minLon.toFixed(6)}, ${f.bounds.minLat.toFixed(6)}] to [${f.bounds.maxLon.toFixed(6)}, ${f.bounds.maxLat.toFixed(6)}]`);
  });
