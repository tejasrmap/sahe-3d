/**
 * SAHE-3D production regression gate.
 * Loads the application's real TypeScript exports through the TypeScript compiler,
 * validates every inventory record, runs the GIS validator, builds, and runs browser E2E.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Module = require('module');
const { execFileSync } = require('child_process');
const ts = require('typescript');

let passed = 0;
let failed = 0;
const warnings = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ [FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

function loadTsExport(relativePath, exportName) {
  const filename = path.resolve(__dirname, relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true
    }
  }).outputText;

  const compiled = new Module(filename, module);
  compiled.filename = filename;
  compiled.paths = Module._nodeModulePaths(path.dirname(filename));
  compiled._compile(transpiled, filename);

  assert.ok(
    Object.prototype.hasOwnProperty.call(compiled.exports, exportName),
    `Missing export ${exportName} in ${relativePath}`
  );
  return compiled.exports[exportName];
}

function haversineMeters(a, b) {
  const radius = 6371008.8;
  const toRad = (value) => value * Math.PI / 180;
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

function uniqueBy(items, getKey, label) {
  const seen = new Set();
  for (const item of items) {
    const key = getKey(item);
    assert.ok(key, `${label} has an empty ID`);
    assert.ok(!seen.has(key), `Duplicate ${label} ID: ${key}`);
    seen.add(key);
  }
  return seen;
}

console.log('\n=== SAHE-3D MASTER AUTOMATED PRODUCTION TEST SUITE ===\n');

let buildings;
let entrances;
let pois;
let facilities;
let paths;
let campusConfig;

test('Canonical TypeScript GIS datasets load from application exports', () => {
  buildings = loadTsExport('src/data/buildings.ts', 'CAMPUS_BUILDINGS');
  entrances = loadTsExport('src/data/buildingEntrances.ts', 'BUILDING_ENTRANCES');
  pois = loadTsExport('src/data/pois.ts', 'CAMPUS_POIS');
  facilities = loadTsExport('src/data/outdoorFacilities.ts', 'OUTDOOR_FACILITIES');
  paths = loadTsExport('src/data/campusPaths.ts', 'CAMPUS_PATH_NETWORK');
  campusConfig = loadTsExport('src/data/campusConfig.ts', 'CAMPUS_CONFIG');

  assert.ok(buildings.length >= 26, `Expected at least 26 building records, got ${buildings.length}`);
  assert.ok(entrances.length >= buildings.length, 'Every building must have an entrance record');
  assert.ok(paths.nodes.length > 0, 'Navigation graph has no nodes');
  assert.ok(paths.edges.length > 0, 'Navigation graph has no edges');

  console.log(`    Loaded ${buildings.length} buildings, ${entrances.length} entrances, ${pois.length} POIs, ${facilities.length} outdoor facilities and ${paths.nodes.length} path nodes.`);
});

test('Campus center and live application boundary are valid', () => {
  assert.ok(Math.abs(campusConfig.latitude - 16.4842) < 0.00001, 'Campus latitude differs from configured center');
  assert.ok(Math.abs(campusConfig.longitude - 80.6928) < 0.00001, 'Campus longitude differs from configured center');

  const boundary = campusConfig.boundary;
  assert.ok(Array.isArray(boundary) && boundary.length >= 4, 'Campus boundary is missing or too short');
  assert.deepStrictEqual(boundary[0], boundary[boundary.length - 1], 'Campus boundary ring is not closed');

  for (const point of boundary) {
    assert.ok(Array.isArray(point) && point.length === 2, 'Boundary coordinate must be [longitude, latitude]');
    assert.ok(Number.isFinite(point[0]) && point[0] >= -180 && point[0] <= 180, 'Invalid boundary longitude');
    assert.ok(Number.isFinite(point[1]) && point[1] >= -90 && point[1] <= 90, 'Invalid boundary latitude');
  }
});

test('All building records have unique IDs and valid closed footprints', () => {
  uniqueBy(buildings, (item) => item.id, 'building');

  for (const building of buildings) {
    assert.ok(building.name, `Missing name for ${building.id}`);
    assert.ok(building.code, `Missing code for ${building.id}`);
    assert.ok(building.category, `Missing category for ${building.id}`);
    assert.ok(building.classification, `Missing physical classification for ${building.id}`);
    assert.ok(Number.isFinite(building.latitude) && Number.isFinite(building.longitude), `Invalid center for ${building.id}`);
    assert.ok(Number.isFinite(building.height) && building.height > 0, `Invalid height for ${building.id}`);
    assert.ok(Array.isArray(building.footprint) && building.footprint.length >= 4, `Missing footprint for ${building.id}`);
    assert.deepStrictEqual(building.footprint[0], building.footprint[building.footprint.length - 1], `Footprint ring is not closed for ${building.id}`);
    for (const point of building.footprint) {
      assert.ok(Array.isArray(point) && point.length === 2, `Invalid footprint coordinate for ${building.id}`);
      assert.ok(Number.isFinite(point[0]) && Number.isFinite(point[1]), `Non-finite footprint coordinate for ${building.id}`);
    }
  }
});

test('Every entrance references an existing building and graph node', () => {
  const buildingIds = new Set(buildings.map((item) => item.id));
  const nodesById = new Map(paths.nodes.map((node) => [node.id, node]));
  const entranceKeys = entrances.map((item) => item.buildingId);
  uniqueBy(entranceKeys.map((buildingId) => ({ id: buildingId })), (item) => item.id, 'building entrance');

  for (const entrance of entrances) {
    assert.ok(buildingIds.has(entrance.buildingId), `Unknown building: ${entrance.buildingId}`);
    assert.ok(entrance.entranceName, `Missing entrance name for ${entrance.buildingId}`);
    assert.ok(entrance.facadeOrientation, `Missing facade orientation for ${entrance.buildingId}`);
    assert.ok(Number.isFinite(entrance.latitude) && Number.isFinite(entrance.longitude), `Invalid entrance coordinate for ${entrance.buildingId}`);
    const node = nodesById.get(entrance.connectedPathNodeId);
    assert.ok(node, `Missing graph node ${entrance.connectedPathNodeId} for ${entrance.buildingId}`);

    const approach = entrance.approachPoint || [entrance.longitude, entrance.latitude];
    const nodeDistance = haversineMeters(approach, [node.longitude, node.latitude]);
    if (nodeDistance > 15) {
      warnings.push(`${entrance.buildingId}: linked route node is ${nodeDistance.toFixed(1)}m from the entrance approach; verify the intervening walkway and do not treat the two anchors as coincident.`);
    }
  }

  console.log(`    Audited all ${entrances.length} entrance-to-building and entrance-to-node references.`);
});

test('POIs have unique IDs and bus-stop marker matches its safe waiting anchor', () => {
  uniqueBy(pois, (item) => item.id, 'POI');
  const busPoi = pois.find((item) => item.id === 'poi-bus-stop');
  const busNode = paths.nodes.find((item) => item.id === 'node-bus-stop');
  assert.ok(busPoi, 'poi-bus-stop is missing');
  assert.ok(busNode, 'node-bus-stop is missing');

  const separation = haversineMeters(
    [busPoi.longitude, busPoi.latitude],
    [busNode.longitude, busNode.latitude]
  );
  assert.ok(separation <= 1.0, `Bus-stop POI and graph node differ by ${separation.toFixed(2)}m`);
  assert.ok(busPoi.latitude > 16.4821, 'Bus-stop marker is not north of the mapped highway junction');
});

test('Outdoor facility records have unique IDs and valid polygon rings', () => {
  uniqueBy(facilities, (item) => item.id, 'outdoor facility');
  for (const facility of facilities) {
    assert.ok(Array.isArray(facility.coordinates) && facility.coordinates.length >= 4, `Missing polygon coordinates for ${facility.id}`);
    assert.deepStrictEqual(facility.coordinates[0], facility.coordinates[facility.coordinates.length - 1], `Unclosed facility polygon: ${facility.id}`);
  }
});

test('Pedestrian graph has valid endpoints, positive weights and full connectivity', () => {
  const nodeIds = uniqueBy(paths.nodes, (item) => item.id, 'path node');
  const adjacency = new Map(paths.nodes.map((node) => [node.id, new Set()]));

  for (const edge of paths.edges) {
    assert.ok(nodeIds.has(edge.from), `Unknown edge source node: ${edge.from}`);
    assert.ok(nodeIds.has(edge.to), `Unknown edge destination node: ${edge.to}`);
    assert.ok(Number.isFinite(edge.distanceMeters) && edge.distanceMeters > 0, `Invalid edge distance: ${edge.from} -> ${edge.to}`);
    adjacency.get(edge.from).add(edge.to);
    adjacency.get(edge.to).add(edge.from);
  }

  const startId = 'node-gate';
  assert.ok(nodeIds.has(startId), 'Main gate graph node is missing');
  const visited = new Set([startId]);
  const queue = [startId];
  while (queue.length) {
    const current = queue.shift();
    for (const next of adjacency.get(current)) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  assert.strictEqual(visited.size, paths.nodes.length, `Only ${visited.size}/${paths.nodes.length} nodes are reachable from the main gate`);
});

test('Handcrafted and procedural indoor model source files exist', () => {
  const indoorFiles = [
    'src/data/indoor/buildings/cseBlock.ts',
    'src/data/indoor/buildings/eceBlock.ts',
    'src/data/indoor/buildings/mechCivilBlock.ts',
    'src/data/indoor/buildings/adminLibrary.ts',
    'src/data/indoor/proceduralIndoorGenerator.ts'
  ];
  indoorFiles.forEach((file) => assert.ok(fs.existsSync(path.join(__dirname, file)), `Missing indoor model file: ${file}`));
});

test('EPSG:32644 GIS validator completes without failed checks', () => {
  const python = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
  const output = execFileSync(python, ['scripts/validate_phase73_southern_gis.py'], { encoding: 'utf8' });
  assert.ok(output.includes('GIS_VALIDATION_STATUS: NO_FAILURES'), 'GIS validator reported failures');
  const summary = output.match(/SUMMARY: ([^\r\n]+)/);
  if (summary && !summary[1].includes('0 WARNING')) {
    warnings.push(`GIS validator reports: ${summary[1]}`);
  }
  console.log(output.split('\n').filter((line) => line.startsWith('SUMMARY:') || line.startsWith('GIS_VALIDATION_STATUS:')).join('\n'));
});

test('Production TypeScript and Vite build succeeds', () => {
  execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { stdio: 'pipe' });
  assert.ok(fs.existsSync(path.join(__dirname, 'dist', 'index.html')), 'dist/index.html was not generated');
});

test('Headless Chrome indoor/outdoor regression suite succeeds', () => {
  const output = execFileSync(process.execPath, ['test_phase4.cjs'], { encoding: 'utf8' });
  assert.ok(output.includes('ALL PHASE 4 CHECKS PASSED PERFECTLY (0 Failures)'), 'Browser E2E suite did not report success');
});

console.log('\n========================================');
console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
console.log(`Warnings: ${warnings.length}`);
warnings.forEach((warning) => console.warn(`  [WARN] ${warning}`));
console.log('========================================\n');

if (failed > 0) process.exit(1);
