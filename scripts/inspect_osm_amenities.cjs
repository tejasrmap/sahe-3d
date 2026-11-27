const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scripts/osm_sahe_raw.json', 'utf8'));

console.log('Total OSM elements:', raw.elements.length);

const nodesWithTags = raw.elements.filter(e => e.type === 'node' && e.tags);
console.log('Nodes with tags count:', nodesWithTags.length);
nodesWithTags.forEach(n => {
  console.log(`Node ${n.id} (${n.lat}, ${n.lon}):`, JSON.stringify(n.tags));
});

const waysWithTags = raw.elements.filter(e => e.type === 'way' && e.tags);
console.log('\nWays with specific amenity/leisure/tourism tags:');
waysWithTags.forEach(w => {
  if (w.tags.amenity || w.tags.leisure || w.tags.tourism || w.tags.historic || w.tags.sport) {
    console.log(`Way ${w.id}:`, JSON.stringify(w.tags));
  }
});
