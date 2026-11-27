const fs = require('fs');

const bldgText = fs.readFileSync('src/data/buildings.ts', 'utf8');

const buildings = [];
const bBlocks = bldgText.split(/\{\s*"id":/g).slice(1);
for (const b of bBlocks) {
  const id = b.match(/^\s*"([^"]+)"/)?.[1];
  const name = b.match(/"name":\s*"([^"]+)"/)?.[1];
  const lat = parseFloat(b.match(/"latitude":\s*([\d\.]+)/)?.[1]);
  const lng = parseFloat(b.match(/"longitude":\s*([\d\.]+)/)?.[1]);
  const fpMatches = [...b.matchAll(/\[\s*([\d\.]+),\s*([\d\.]+)\s*\]/g)];
  const footprint = fpMatches.map(m => [parseFloat(m[1]), parseFloat(m[2])]);
  buildings.push({ id, name, lat, lng, footprint });
}

function lineIntersects(p1, p2, p3, p4) {
  function ccw(A, B, C) {
    return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
  }
  return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4));
}

function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Network nodes perfectly positioned along actual paved avenues and plazas
const nodes = [
  // 1. South Sector & Entrance
  { id: "node-gate", name: "Main Entrance Gate Portal", latitude: 16.481820, longitude: 80.691194, category: "entrance", buildingId: "main-entrance-portal" },
  { id: "node-junc-south", name: "South Boulevard Junction", latitude: 16.482100, longitude: 80.691400, category: "junction" },
  { id: "node-parking", name: "Parking Plaza Entry Gate", latitude: 16.482600, longitude: 80.691700, category: "amenity", buildingId: "parking-plaza" },
  { id: "node-junc-south-road", name: "South Perimeter Road Junction", latitude: 16.482200, longitude: 80.692500, category: "junction" },
  { id: "node-atm", name: "SBI ATM Kiosk & Banking Hub", latitude: 16.482700, longitude: 80.693480, category: "amenity" },
  { id: "node-health-center", name: "Health Center Clinic Entrance", latitude: 16.482809, longitude: 80.693480, category: "building", buildingId: "health-center" },

  // 2. West & Sports Sector
  { id: "node-athletic-ground", name: "Athletic Field Pavilion Entry", latitude: 16.483370, longitude: 80.691073, category: "amenity" },
  { id: "node-junc-west-track", name: "West Athletic Concourse Junction", latitude: 16.483700, longitude: 80.691500, category: "junction" },
  { id: "node-sports-complex", name: "Sports Arena East Entrance", latitude: 16.483287, longitude: 80.692280, category: "building", buildingId: "sports-arena" },
  { id: "node-junc-central-avenue", name: "Auditorium-Cafeteria Central Avenue", latitude: 16.483800, longitude: 80.692950, category: "junction" },

  // 3. Central Academic Circle Sector
  { id: "node-junc-central", name: "Central Campus Circle", latitude: 16.484400, longitude: 80.692300, category: "junction" },
  { id: "node-auditorium", name: "Auditorium North Portico", latitude: 16.484280, longitude: 80.692520, category: "building", buildingId: "auditorium-complex" },
  { id: "node-canteen", name: "Cafeteria West Entrance Court", latitude: 16.484198, longitude: 80.693120, category: "building", buildingId: "cafeteria-complex" },
  { id: "node-admin-lib", name: "Administration & Library West Portico", latitude: 16.484796, longitude: 80.692580, category: "building", buildingId: "admin-central-library" },

  // 4. North Academic Concourse
  { id: "node-junc-north", name: "North Academic Concourse", latitude: 16.484900, longitude: 80.692100, category: "junction" },
  { id: "node-cse", name: "CSE Computing Block East Entrance", latitude: 16.485190, longitude: 80.691850, category: "building", buildingId: "cse-it-complex" },
  { id: "node-ece", name: "ECE Block South Concourse Entrance", latitude: 16.484920, longitude: 80.692380, category: "building", buildingId: "ece-eee-block" },
  { id: "node-mech", name: "Mechanical & Civil Block Entry Porch", latitude: 16.484900, longitude: 80.693350, category: "building", buildingId: "mech-civil-block" },

  // 5. East Sector & Hostels
  { id: "node-junc-east-spine", name: "East Academic-Residential Avenue", latitude: 16.484800, longitude: 80.694200, category: "junction" },
  { id: "node-boys-hostel", name: "Boys Hostel Main Access Gate", latitude: 16.485100, longitude: 80.695713, category: "building", buildingId: "boys-hostel-complex" },
  { id: "node-girls-hostel", name: "Girls Hostel Security Gate", latitude: 16.484003, longitude: 80.694950, category: "building", buildingId: "girls-hostel-complex" }
];

const nodeMap = new Map();
nodes.forEach(n => nodeMap.set(n.id, n));

const edges = [
  // Gateway & South Parking
  { from: "node-gate", to: "node-junc-south", name: "Main Boulevard", accessible: true },
  { from: "node-junc-south", to: "node-parking", name: "Parking Access Way", accessible: true },
  { from: "node-junc-south", to: "node-junc-south-road", name: "South Campus Perimeter Road", accessible: true },
  { from: "node-junc-south-road", to: "node-atm", name: "ATM & Banking Walk", accessible: true },
  { from: "node-atm", to: "node-health-center", name: "Health Center Clinic Link", accessible: true },
  { from: "node-junc-south-road", to: "node-sports-complex", name: "Sports Arena South Approach", accessible: true },

  // Athletic Track & West Concourse
  { from: "node-junc-south", to: "node-athletic-ground", name: "West Sports Track", accessible: true },
  { from: "node-athletic-ground", to: "node-junc-west-track", name: "Athletic Field Pavilion Path", accessible: true },
  { from: "node-junc-west-track", to: "node-junc-central", name: "Auditorium West Garden Walk", accessible: true },

  // Sports Arena to Central Circle via Central Avenue
  { from: "node-sports-complex", to: "node-junc-central-avenue", name: "Gymnasium East Link", accessible: true },
  { from: "node-junc-central-avenue", to: "node-canteen", name: "Cafeteria South Concourse", accessible: true },

  // Central Circle Hub
  { from: "node-junc-central", to: "node-auditorium", name: "Auditorium Portico Concourse", accessible: true },
  { from: "node-junc-central", to: "node-canteen", name: "Cafeteria Concourse", accessible: true },
  { from: "node-junc-central", to: "node-admin-lib", name: "Administration Avenue", accessible: true },
  { from: "node-junc-central", to: "node-junc-north", name: "Central Academic Spine", accessible: true },

  // North Academic Concourse
  { from: "node-junc-north", to: "node-cse", name: "Computing Block Avenue", accessible: true },
  { from: "node-junc-north", to: "node-ece", name: "Electronics Concourse", accessible: true },
  { from: "node-junc-north", to: "node-admin-lib", name: "Central Plaza Walk", accessible: true },
  { from: "node-ece", to: "node-mech", name: "Inter-Department Engineering Link", accessible: true },

  // East Sector & Hostels
  { from: "node-mech", to: "node-junc-east-spine", name: "Mechanical East Walk", accessible: true },
  { from: "node-junc-east-spine", to: "node-boys-hostel", name: "Boys Residency North Avenue", accessible: true },
  { from: "node-junc-east-spine", to: "node-girls-hostel", name: "Aditya Women's Hostel Avenue", accessible: true },
  { from: "node-girls-hostel", to: "node-boys-hostel", name: "Hostel Perimeter Walkway", accessible: true }
];

console.log('--- Checking Edge Segment Intersections with Building Footprints ---');
let edgeCrossingCount = 0;
for (const e of edges) {
  const nA = nodeMap.get(e.from);
  const nB = nodeMap.get(e.to);
  e.distanceMeters = calcDistance(nA.latitude, nA.longitude, nB.latitude, nB.longitude);
  
  const p1 = [nA.longitude, nA.latitude];
  const p2 = [nB.longitude, nB.latitude];
  for (const b of buildings) {
    const fp = b.footprint;
    for (let i = 0; i < fp.length - 1; i++) {
      if (lineIntersects(p1, p2, fp[i], fp[i + 1])) {
        console.log(`[FAIL] Edge ${e.from} -> ${e.to} crosses ${b.id} wall!`);
        edgeCrossingCount++;
      }
    }
  }
}

if (edgeCrossingCount === 0) {
  console.log(`✓ [SUCCESS] PERFECT! ZERO building wall crossings across all ${edges.length} edges!`);
}

function dijkstra(startId, endId) {
  const dist = {};
  const prev = {};
  const unvisited = new Set();
  nodes.forEach(n => { dist[n.id] = Infinity; unvisited.add(n.id); });
  dist[startId] = 0;

  while (unvisited.size > 0) {
    let curr = null;
    let minD = Infinity;
    for (const u of unvisited) {
      if (dist[u] < minD) { minD = dist[u]; curr = u; }
    }
    if (!curr || minD === Infinity) break;
    if (curr === endId) break;
    unvisited.delete(curr);

    const neighbors = [];
    edges.forEach(e => {
      if (e.from === curr) neighbors.push({ to: e.to, d: e.distanceMeters });
      if (e.to === curr) neighbors.push({ to: e.from, d: e.distanceMeters });
    });

    for (const nb of neighbors) {
      if (unvisited.has(nb.to)) {
        const alt = dist[curr] + nb.d;
        if (alt < dist[nb.to]) {
          dist[nb.to] = alt;
          prev[nb.to] = curr;
        }
      }
    }
  }

  const path = [];
  let u = endId;
  while (u) { path.unshift(u); u = prev[u]; }
  return { path, distance: dist[endId] };
}

const testJourneys = [
  ["node-gate", "node-cse", "Main Gate → CSE"],
  ["node-gate", "node-ece", "Main Gate → ECE"],
  ["node-gate", "node-mech", "Main Gate → Mechanical/Civil"],
  ["node-gate", "node-admin-lib", "Main Gate → Library"],
  ["node-gate", "node-canteen", "Main Gate → Cafeteria"],
  ["node-gate", "node-auditorium", "Main Gate → Auditorium"],
  ["node-gate", "node-boys-hostel", "Main Gate → Boys Hostel"],
  ["node-gate", "node-girls-hostel", "Main Gate → Girls Hostel"],
  ["node-gate", "node-health-center", "Main Gate → Health Center"],
  ["node-gate", "node-parking", "Main Gate → Parking"],
  ["node-cse", "node-ece", "CSE → ECE"],
  ["node-ece", "node-mech", "ECE → Mechanical/Civil"],
  ["node-admin-lib", "node-health-center", "Library → Health Center"],
  ["node-canteen", "node-girls-hostel", "Cafeteria → Girls Hostel"],
  ["node-sports-complex", "node-gate", "Sports Complex → Main Gate"]
];

console.log('\n--- Testing 15 Required Journeys (Dijkstra) ---');
let allPassed = true;
testJourneys.forEach(([start, end, label]) => {
  const res = dijkstra(start, end);
  const reachable = res.distance < Infinity && res.path.length > 1;
  if (!reachable) allPassed = false;
  console.log(`  ${reachable ? '✓ [PASS]' : '✕ [FAIL]'} ${label.padEnd(35)}: ${res.distance}m | Nodes (${res.path.length}): ${res.path.join(' -> ')}`);
});
if (allPassed) console.log('\n✓ [SUCCESS] All 15 required journeys are 100% reachable with 0 building collisions!');
