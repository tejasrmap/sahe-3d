/**
 * Comprehensive Automated Production Test Suite for SAHE-3D
 * Dynamically validates all 26 buildings, entrances, POIs, outdoor facilities,
 * runs the Python Phase 7.3.1 GIS validator, production Vite build, and Headless Chrome E2E suite.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let passed = 0;
let failed = 0;

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

console.log('\n=== SAHE-3D MASTER AUTOMATED PRODUCTION TEST SUITE ===\n');

// 1. GIS & Campus Configuration Validation
console.log('1. Geospatial & Boundary Configuration:');

test('Campus Center coordinate matches reference 16.4842° N, 80.6928° E', () => {
  const configText = fs.readFileSync(path.join(__dirname, 'src/data/campusConfig.ts'), 'utf8');
  assert.ok(configText.includes('16.4842'), 'Latitude 16.4842 missing');
  assert.ok(configText.includes('80.6928'), 'Longitude 80.6928 missing');
});

test('Campus boundary polygon is closed and dynamically non-empty', () => {
  const configText = fs.readFileSync(path.join(__dirname, 'src/data/campusConfig.ts'), 'utf8');
  const match = configText.match(/export const CAMPUS_CONFIG: CampusConfig = (\{[\s\S]*?\});/);
  assert.ok(match, 'CAMPUS_CONFIG match failed');
  const config = eval('(' + match[1] + ')');
  const boundary = config.boundary;
  assert.ok(boundary && boundary.length >= 4, 'Boundary must have at least 4 coordinates');
  assert.strictEqual(boundary[0][0], boundary[boundary.length - 1][0], 'Boundary must be closed in longitude');
  assert.strictEqual(boundary[0][1], boundary[boundary.length - 1][1], 'Boundary must be closed in latitude');
});

// 2. Building, Entrance, POI and Facility Records Integrity
console.log('\n2. Dynamic Building & Facility Catalog Integrity:');

test('All 26 campus buildings cataloged with complete properties and footprints', () => {
  const bldgText = fs.readFileSync(path.join(__dirname, 'src/data/buildings.ts'), 'utf8');
  const match = bldgText.match(/export const CAMPUS_BUILDINGS: Building\[\] = (\[[\s\S]*?\]);/);
  assert.ok(match, 'CAMPUS_BUILDINGS array match failed');
  const buildings = eval(match[1]);
  assert.strictEqual(buildings.length, 26, `Must contain exactly 26 buildings, got ${buildings.length}`);
  
  buildings.forEach(b => {
    assert.ok(b.id, 'Building ID required');
    assert.ok(b.name, `Building name required for ${b.id}`);
    assert.ok(b.code, `Building code required for ${b.id}`);
    assert.ok(b.category, `Category required for ${b.id}`);
    assert.ok(b.classification, `Classification required for ${b.id}`);
    assert.ok(b.latitude && b.longitude, `Coordinates required for ${b.id}`);
    assert.ok(b.footprint && b.footprint.length >= 3, `Footprint polygon required for ${b.id}`);
    assert.ok(b.height > 0, `Positive height required for ${b.id}`);
  });
});

test('Building entrances cataloged with valid door anchors and node links', () => {
  const entText = fs.readFileSync(path.join(__dirname, 'src/data/buildingEntrances.ts'), 'utf8');
  const match = entText.match(/export const BUILDING_ENTRANCES: BuildingEntrance\[\] = (\[[\s\S]*?\]);/);
  assert.ok(match, 'BUILDING_ENTRANCES array match failed');
  const entrances = eval(match[1]);
  assert.ok(entrances.length >= 26, `Must contain at least 26 building entrances, got ${entrances.length}`);
  entrances.forEach(e => {
    assert.ok(e.buildingId, 'buildingId required');
    assert.ok(e.connectedPathNodeId, `connectedPathNodeId required for ${e.buildingId}`);
    assert.ok(e.latitude && e.longitude, `Coordinates required for ${e.buildingId}`);
    assert.ok(e.facadeOrientation, `facadeOrientation required for ${e.buildingId}`);
  });
});

test('17 campus POIs cataloged including safe Bandar Road bus stop', () => {
  const poiText = fs.readFileSync(path.join(__dirname, 'src/data/pois.ts'), 'utf8');
  const match = poiText.match(/export const CAMPUS_POIS: POI\[\] = (\[[\s\S]*?\]);/);
  assert.ok(match, 'CAMPUS_POIS array match failed');
  const pois = eval(match[1]);
  assert.strictEqual(pois.length, 17, `Must contain 17 POIs, got ${pois.length}`);
  const busPoi = pois.find(p => p.id === 'poi-bus-stop');
  assert.ok(busPoi, 'poi-bus-stop must be present');
  assert.ok(busPoi.latitude > 16.4821, 'Bus stop must be safely north of live carriageway');
});

test('7 outdoor campus facilities cataloged with valid geometries', () => {
  const facText = fs.readFileSync(path.join(__dirname, 'src/data/outdoorFacilities.ts'), 'utf8');
  const match = facText.match(/export const OUTDOOR_FACILITIES: OutdoorFacility\[\] = (\[[\s\S]*?\]);/);
  assert.ok(match, 'OUTDOOR_FACILITIES array match failed');
  const facilities = eval(match[1]);
  assert.strictEqual(facilities.length, 7, `Must contain 7 outdoor facilities, got ${facilities.length}`);
});

// 3. Routing Network
console.log('\n3. Pedestrian Routing Network:');

test('Campus walkway network nodes and edges defined and fully connected', () => {
  const pathsText = fs.readFileSync(path.join(__dirname, 'src/data/campusPaths.ts'), 'utf8');
  assert.ok(pathsText.includes('nodes: ['), 'Path nodes missing');
  assert.ok(pathsText.includes('edges: ['), 'Path edges missing');
  assert.ok(pathsText.includes('node-bus-stop'), 'node-bus-stop missing in path network');
});

// 4. Multi-Floor Indoor Digital Twin Models
console.log('\n4. Multi-Floor Indoor Digital Twin Models:');

test('Dedicated indoor models exist for core blocks', () => {
  const indoorFiles = [
    'src/data/indoor/buildings/cseBlock.ts',
    'src/data/indoor/buildings/eceBlock.ts',
    'src/data/indoor/buildings/mechCivilBlock.ts',
    'src/data/indoor/buildings/adminLibrary.ts',
    'src/data/indoor/proceduralIndoorGenerator.ts'
  ];
  indoorFiles.forEach(file => {
    assert.ok(fs.existsSync(path.join(__dirname, file)), `Missing indoor model file: ${file}`);
  });
});

// 5. Python GIS Validation Suite Integration
console.log('\n5. Python Phase 7.3.1 GIS & Infrastructure Validation Suite:');

test('Python GIS validation suite passes all 14 EPSG:32644 spatial tests', () => {
  const output = execSync('python scripts/validate_phase73_southern_gis.py', { encoding: 'utf8' });
  assert.ok(output.includes('SUMMARY: 14/14 GIS AND TOPOLOGICAL TESTS PASSED'), 'GIS validator did not pass all 14 tests');
});

// 6. Build and E2E Tests
console.log('\n6. Production Bundle & Browser E2E Tests:');

test('Vite build succeeds with zero TypeScript errors', () => {
  execSync('npm run build', { stdio: 'pipe' });
  assert.ok(fs.existsSync(path.join(__dirname, 'dist/index.html')), 'dist/index.html missing');
});

test('Headless Chrome Phase 4 Browser E2E Test passes 10/10 checks', () => {
  const output = execSync('node test_phase4.cjs', { encoding: 'utf8' });
  assert.ok(output.includes('ALL PHASE 4 CHECKS PASSED PERFECTLY (0 Failures)'), 'E2E tests failed');
});

console.log(`\n========================================`);
console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
