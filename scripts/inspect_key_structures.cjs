const fs = require('fs');

const features = JSON.parse(fs.readFileSync('scripts/campus_osm_features.json', 'utf8'));

// Filter only buildings and amenities with area
const buildings = features.filter((f) => {
  const t = f.tags;
  return t.building || t.amenity === 'college' || t.barrier === 'wall' || t.leisure === 'pitch' || f.pointsCount > 8;
});

console.log(`Filtered ${buildings.length} key campus structures:\n`);
buildings.forEach((b) => {
  const widthM = ((b.bounds.maxLon - b.bounds.minLon) * 111320 * Math.cos((b.center[1] * Math.PI) / 180)).toFixed(1);
  const heightM = ((b.bounds.maxLat - b.bounds.minLat) * 110574).toFixed(1);
  console.log(`- Way ${b.id}: Tags=${JSON.stringify(b.tags)}`);
  console.log(`  Center: [${b.center[1].toFixed(6)}, ${b.center[0].toFixed(6)}] | Points: ${b.pointsCount}`);
  console.log(`  Dimensions: ${widthM}m (E-W) x ${heightM}m (N-S)`);
  console.log(`  Bounds: [${b.bounds.minLon.toFixed(6)}, ${b.bounds.minLat.toFixed(6)}] to [${b.bounds.maxLon.toFixed(6)}, ${b.bounds.maxLat.toFixed(6)}]`);
  console.log('');
});
