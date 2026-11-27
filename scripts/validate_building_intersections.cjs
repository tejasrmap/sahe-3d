const fs = require('fs');

const rectified = JSON.parse(fs.readFileSync('scripts/rectified_12_buildings.json', 'utf8'));

const entries = Object.entries(rectified);
let anyOverlap = false;

console.log('=== CHECKING BUILDING POLYGON OVERLAPS ===\n');

for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const [idA, bA] = entries[i];
    const [idB, bB] = entries[j];

    const lonsA = bA.footprint.map((p) => p[0]);
    const latsA = bA.footprint.map((p) => p[1]);
    const minLonA = Math.min(...lonsA);
    const maxLonA = Math.max(...lonsA);
    const minLatA = Math.min(...latsA);
    const maxLatA = Math.max(...latsA);

    const lonsB = bB.footprint.map((p) => p[0]);
    const latsB = bB.footprint.map((p) => p[1]);
    const minLonB = Math.min(...lonsB);
    const maxLonB = Math.max(...lonsB);
    const minLatB = Math.min(...latsB);
    const maxLatB = Math.max(...latsB);

    // Check AABB overlap
    const noOverlap = maxLonA < minLonB || minLonA > maxLonB || maxLatA < minLatB || minLatA > maxLatB;

    if (!noOverlap) {
      console.log(`[ALERT] Bounding box overlap between ${idA} and ${idB}!`);
      anyOverlap = true;
    }
  }
}

console.log(`\nZero bounding box overlaps across all 12 buildings: ${!anyOverlap}`);
