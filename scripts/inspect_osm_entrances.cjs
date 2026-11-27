const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scripts/osm_sahe_raw.json', 'utf8'));

console.log('Searching for entrance/door tags in OSM raw data...');
raw.elements.forEach(e => {
  const t = e.tags || {};
  if (t.entrance || t.door || t.barrier === 'gate' || t.barrier === 'entrance') {
    console.log(`${e.type} ${e.id} at (${e.lat || 'n/a'}, ${e.lon || 'n/a'}):`, JSON.stringify(t));
  }
});

// Let's also search for highway=footway or highway=path or highway=steps or service
const pedestrianWays = [];
const nodeMap = new Map();
raw.elements.forEach(e => {
  if (e.type === 'node') nodeMap.set(e.id, [e.lon, e.lat]);
});

raw.elements.forEach(e => {
  if (e.type === 'way') {
    const t = e.tags || {};
    if (t.highway === 'footway' || t.highway === 'path' || t.highway === 'pedestrian' || t.highway === 'service') {
      const coords = (e.nodes || []).map(id => nodeMap.get(id)).filter(Boolean);
      pedestrianWays.push({ id: e.id, tags: t, coords });
    }
  }
});
console.log('\nTotal OSM pedestrian/service ways:', pedestrianWays.length);
pedestrianWays.forEach(pw => {
  console.log(`Way ${pw.id} (${pw.tags.highway}${pw.tags.name ? ' - ' + pw.tags.name : ''}): ${pw.coords.length} nodes`);
});
