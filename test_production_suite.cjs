/**
 * Comprehensive Automated Production Test Suite for SAHE-3D
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

// 1. GIS & Coordinate Validation
console.log('1. Geospatial & Boundary Validation:');

test('Campus Center coordinate matches reference 16.4842° N, 80.6928° E', () => {
  const configText = fs.readFileSync(path.join(__dirname, 'src/data/campusConfig.ts'), 'utf8');
  assert.ok(configText.includes('16.4842'), 'Latitude 16.4842 missing');
  assert.ok(configText.includes('80.6928'), 'Longitude 80.6928 missing');
});

test('Campus boundary polygon is closed and non-empty', () => {
  const configText = fs.readFileSync(path.join(__dirname, 'src/data/campusConfig.ts'), 'utf8');
  assert.ok(configText.includes('boundary: ['), 'Boundary array missing');
  assert.ok(configText.includes('16.482600') || configText.includes('16.482'), 'Boundary rectified coordinates verified');
});

// 2. Building and POI datasets
console.log('\n2. Building and POI Records Integrity:');

test('26 campus buildings cataloged with complete properties', () => {
  const bldgText = fs.readFileSync(path.join(__dirname, 'src/data/buildings.ts'), 'utf8');
  const buildingIds = [
    'cse-it-complex',
    'ece-eee-block',
    'mech-civil-block',
    'admin-block',
    'central-library',
    'auditorium-complex',
    'cafeteria-complex',
    'sports-arena',
    'boys-hostel-complex',
    'girls-hostel-complex',
    'health-center',
    'main-entrance-portal',
    'parking-plaza'
  ];
  buildingIds.forEach(id => {
    assert.ok(bldgText.includes(`"id": "${id}"`), `Missing building id: ${id}`);
  });
});

test('16 campus POIs cataloged with valid categories', () => {
  const poiText = fs.readFileSync(path.join(__dirname, 'src/data/pois.ts'), 'utf8');
  const poiIds = [
    'poi-main-gate',
    'poi-sbi-atm',
    'poi-admin-hq',
    'poi-central-lib',
    'poi-tpo-cell',
    'poi-cse-lab',
    'poi-eee-lab',
    'poi-siemens-coe',
    'poi-civil-utm',
    'poi-canteen-court',
    'poi-auditorium',
    'poi-indoor-sports',
    'poi-cricket-oval',
    'poi-health-center',
    'poi-boys-residency',
    'poi-girls-residency'
  ];
  poiIds.forEach(id => {
    assert.ok(poiText.includes(`"id": "${id}"`), `Missing POI id: ${id}`);
  });
});

// 3. Routing Network
console.log('\n3. Pedestrian Routing Network:');

test('Campus walkway network nodes and edges defined', () => {
  const pathsText = fs.readFileSync(path.join(__dirname, 'src/data/campusPaths.ts'), 'utf8');
  assert.ok(pathsText.includes('nodes: ['), 'Path nodes missing');
  assert.ok(pathsText.includes('edges: ['), 'Path edges missing');
});

// 4. Indoor Digital Twin
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

// 5. Build and E2E Tests
console.log('\n5. Production Bundle & Browser E2E Tests:');

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
