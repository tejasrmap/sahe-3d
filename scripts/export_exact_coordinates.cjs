const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scripts/osm_sahe_raw.json', 'utf8'));
const nodes = new Map();
raw.elements.filter((e) => e.type === 'node').forEach((n) => nodes.set(n.id, [n.lon, n.lat]));

function getWayCoords(wayId) {
  const way = raw.elements.find((e) => e.type === 'way' && e.id === wayId);
  if (!way) return null;
  return (way.nodes || []).map((id) => nodes.get(id)).filter(Boolean);
}

const targetWays = {
  'cse-it-complex': 403282758,
  'ece-eee-block': 1324048133,
  'mech-civil-block': 1324048130,
  'admin-central-library': 1324048132,
  'auditorium-complex': 403282757,
  'cafeteria-complex': 403282859,
  'sports-arena': 403282763,
  'boys-hostel-complex': 1318966334,
  'girls-hostel-complex': 1320182457,
  'health-center': 1320825694,
  'main-entrance-portal': 1320824131,
  'parking-plaza': 403282755,
};

const rectifiedData = {};

for (const [id, wayId] of Object.entries(targetWays)) {
  const coords = getWayCoords(wayId);
  const lons = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const centerLon = Number(((minLon + maxLon) / 2).toFixed(6));
  const centerLat = Number(((minLat + maxLat) / 2).toFixed(6));

  rectifiedData[id] = {
    wayId,
    centerLat,
    centerLon,
    pointsCount: coords.length,
    footprint: coords,
  };
}

fs.writeFileSync('scripts/rectified_12_buildings.json', JSON.stringify(rectifiedData, null, 2));
console.log('Saved scripts/rectified_12_buildings.json');
for (const [id, d] of Object.entries(rectifiedData)) {
  console.log(`- ${id} (Way ${d.wayId}): Center [${d.centerLat}, ${d.centerLon}], ${d.pointsCount} points`);
}
