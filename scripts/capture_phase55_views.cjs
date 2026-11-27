const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'docs', 'phase-5.5', 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching Chrome for Phase 5.5 Visual Audit & Performance Benchmarking...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

  const startT = Date.now();
  console.log('Navigating to http://localhost:4173 ...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle2', timeout: 45000 });
  const loadDurationMs = Date.now() - startT;

  // Wait for Cesium canvas to initialize
  await page.waitForSelector('canvas', { timeout: 30000 });
  console.log('Cesium canvas detected. Waiting 7 seconds for terrain & imagery tiles to stabilize...');
  await new Promise(r => setTimeout(r, 7000));

  // Measure DOM & Performance Metrics
  const metrics = await page.evaluate(() => {
    return {
      domNodes: document.querySelectorAll('*').length,
      jsHeapUsedSizeMB: window.performance && window.performance.memory ? (window.performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) : 'N/A',
      title: document.title,
    };
  });
  metrics.pageLoadDurationMs = loadDurationMs;
  metrics.consoleErrors = consoleLogs.filter(l => l.type === 'error').map(l => l.text);
  metrics.consoleWarnings = consoleLogs.filter(l => l.type === 'warning').map(l => l.text);

  console.log('Performance Metrics:', metrics);

  // 1. Full Campus Aerial Overview
  console.log('Capturing 01_campus_aerial_overview.png ...');
  await page.screenshot({ path: path.join(outDir, '01_campus_aerial_overview.png') });

  // Helper to fly Cesium camera
  async function flyCamera(lon, lat, height, headingDeg, pitchDeg) {
    await page.evaluate(({ lon, lat, height, headingDeg, pitchDeg }) => {
      // Find Cesium viewer
      const viewer = window.cesiumViewer || (window.__CESIUM_VIEWER__);
      if (viewer && viewer.camera) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
          orientation: {
            heading: Cesium.Math.toRadians(headingDeg),
            pitch: Cesium.Math.toRadians(pitchDeg),
            roll: 0.0
          },
          duration: 0.5
        });
      }
    }, { lon, lat, height, headingDeg, pitchDeg });
    await new Promise(r => setTimeout(r, 2000));
  }

  // 2. Sports field / Athletic Oval close up
  console.log('Capturing 02_sports_field_satellite.png ...');
  await flyCamera(80.6910, 16.4834, 450, 0, -45);
  await page.screenshot({ path: path.join(outDir, '02_sports_field_satellite.png') });

  // 3. Main Gate & South Boulevard
  console.log('Capturing 03_main_gate_and_south_boulevard.png ...');
  await flyCamera(80.6914, 16.4820, 250, 340, -35);
  await page.screenshot({ path: path.join(outDir, '03_main_gate_and_south_boulevard.png') });

  // 4. Central Circle & Concourse
  console.log('Capturing 04_central_circle_and_concourse.png ...');
  await flyCamera(80.6925, 16.4842, 300, 350, -40);
  await page.screenshot({ path: path.join(outDir, '04_central_circle_and_concourse.png') });

  // 5. Admin & Library West Portico
  console.log('Capturing 05_admin_library_west_portico.png ...');
  await flyCamera(80.6926, 16.4847, 200, 80, -30);
  await page.screenshot({ path: path.join(outDir, '05_admin_library_west_portico.png') });

  // 6. CSE Computing Block
  console.log('Capturing 06_cse_it_computing_block.png ...');
  await flyCamera(80.6916, 16.4852, 250, 260, -35);
  await page.screenshot({ path: path.join(outDir, '06_cse_it_computing_block.png') });

  // 7. ECE & EEE Sciences Block
  console.log('Capturing 07_ece_eee_sciences_block.png ...');
  await flyCamera(80.6924, 16.4849, 200, 0, -35);
  await page.screenshot({ path: path.join(outDir, '07_ece_eee_sciences_block.png') });

  // 8. Mechanical & Civil Engineering Labs
  console.log('Capturing 08_mechanical_civil_labs.png ...');
  await flyCamera(80.6934, 16.4849, 220, 340, -35);
  await page.screenshot({ path: path.join(outDir, '08_mechanical_civil_labs.png') });

  // 9. Sports Arena & Indoor Gymnasium
  console.log('Capturing 09_sports_arena_and_gym.png ...');
  await flyCamera(80.6923, 16.4833, 200, 270, -35);
  await page.screenshot({ path: path.join(outDir, '09_sports_arena_and_gym.png') });

  // 10. ATM & Dispensary Separated
  console.log('Capturing 10_atm_and_dispensary_separated.png ...');
  await flyCamera(80.6935, 16.4828, 160, 315, -40);
  await page.screenshot({ path: path.join(outDir, '10_atm_and_dispensary_separated.png') });

  // 11. Hostels & Residential Sector
  console.log('Capturing 11_hostels_residential_sector.png ...');
  await flyCamera(80.6953, 16.4846, 350, 280, -40);
  await page.screenshot({ path: path.join(outDir, '11_hostels_residential_sector.png') });

  // 12. Pedestrian Path Network
  console.log('Capturing 12_pedestrian_path_network.png ...');
  await flyCamera(80.6925, 16.4838, 500, 0, -60);
  await page.screenshot({ path: path.join(outDir, '12_pedestrian_path_network.png') });

  await browser.close();

  // Save metrics report
  fs.writeFileSync(path.join(__dirname, '..', 'docs', 'phase-5.5', 'performance-benchmarks.json'), JSON.stringify(metrics, null, 2), 'utf8');
  console.log('All 12 validation screenshots successfully saved to docs/phase-5.5/screenshots/');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
