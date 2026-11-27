const fs = require('fs');

async function fetchOSM() {
  const query = `[out:json][timeout:30];
  (
    way["building"](16.480,80.689,16.488,80.697);
    relation["building"](16.480,80.689,16.488,80.697);
    way["amenity"](16.480,80.689,16.488,80.697);
    way["leisure"](16.480,80.689,16.488,80.697);
    way["highway"](16.480,80.689,16.488,80.697);
    node["amenity"](16.480,80.689,16.488,80.697);
  );
  out body;
  >;
  out skel qt;`;

  const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
  console.log('Querying Overpass API for SAHE Kanuru campus features...');

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SAHE-CampusExplorer-Audit/1.0 (tejag@github.com)'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Received ${data.elements.length} elements from OpenStreetMap.`);

    fs.writeFileSync('scripts/osm_sahe_raw.json', JSON.stringify(data, null, 2));

    const nodes = new Map();
    data.elements.filter((e) => e.type === 'node').forEach((n) => nodes.set(n.id, [n.lon, n.lat]));

    const ways = data.elements.filter((e) => e.type === 'way');
    console.log(`Found ${ways.length} ways in OSM.`);

    const buildings = [];
    ways.forEach((w) => {
      const coords = (w.nodes || []).map((id) => nodes.get(id)).filter(Boolean);
      const tags = w.tags || {};
      if (tags.building || tags.amenity || tags.leisure) {
        buildings.push({
          id: w.id,
          tags,
          name: tags.name || tags['name:en'] || tags.description || 'unnamed',
          coordsCount: coords.length,
          coordinates: coords,
        });
      }
    });

    console.log(`Extracted ${buildings.length} building/amenity footprints.`);
    buildings.forEach((b, i) => {
      const lons = b.coordinates.map((c) => c[0]);
      const lats = b.coordinates.map((c) => c[1]);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;
      console.log(`${i + 1}. [Way ${b.id}] ${b.name}`);
      console.log(`   Center: Lat ${centerLat.toFixed(6)}, Lon ${centerLon.toFixed(6)}`);
      console.log(`   Bounds: [${minLon.toFixed(6)}, ${minLat.toFixed(6)}] to [${maxLon.toFixed(6)}, ${maxLat.toFixed(6)}] | Points: ${b.coordsCount}`);
      console.log(`   Tags: ${JSON.stringify(b.tags)}`);
    });

    fs.writeFileSync('scripts/osm_buildings_extracted.json', JSON.stringify(buildings, null, 2));
  } catch (err) {
    console.error('Failed to fetch from Overpass:', err.message);
  }
}

fetchOSM();
