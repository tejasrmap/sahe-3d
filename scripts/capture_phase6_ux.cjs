const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'docs', 'phase-6', 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching Chrome for Phase 6 UX & Initial Camera Verification...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

  console.log('Navigating to http://localhost:4173 ...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle2', timeout: 45000 });

  // 1. Check Initial Camera Position BEFORE user interaction
  console.log('Checking initial camera position in Cesium...');
  await page.waitForSelector('canvas', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  const cameraState = await page.evaluate(() => {
    const viewer = window.cesiumViewer || window.__CESIUM_VIEWER__;
    if (!viewer) return { error: 'Viewer not on window, checking document' };
    const pos = viewer.camera.positionCartographic;
    return {
      lat: (pos.latitude * 180 / Math.PI).toFixed(4),
      lon: (pos.longitude * 180 / Math.PI).toFixed(4),
      height: pos.height.toFixed(1)
    };
  });
  console.log('Initial Camera State:', cameraState);

  // 2. Capture Welcome Modal
  console.log('Capturing 01_welcome_onboarding_overlay.png ...');
  await page.screenshot({ path: path.join(outDir, '01_welcome_onboarding_overlay.png') });

  // 3. Click "Explore Campus" button inside Welcome Modal
  console.log('Clicking "Explore Campus" button...');
  const exploreBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Explore Campus'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Explore button clicked:', exploreBtn);
  await new Promise(r => setTimeout(r, 2000));

  // 4. Capture Campus Overview without modal
  console.log('Capturing 02_campus_first_initial_camera.png ...');
  await page.screenshot({ path: path.join(outDir, '02_campus_first_initial_camera.png') });

  // 5. Open Sidebar
  console.log('Opening Sidebar directory...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const dirBtn = btns.find(b => b.title && b.title.includes('Directory') || b.textContent.includes('Directory'));
    if (dirBtn) dirBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Capturing 03_sidebar_explore_directory.png ...');
  await page.screenshot({ path: path.join(outDir, '03_sidebar_explore_directory.png') });

  // 6. Switch to Navigation tab
  console.log('Switching to Navigation / Route tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const routeTab = btns.find(b => b.textContent && b.textContent.includes('Route'));
    if (routeTab) routeTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing 04_sidebar_navigation_routes.png ...');
  await page.screenshot({ path: path.join(outDir, '04_sidebar_navigation_routes.png') });

  // 7. Switch to Modes tab
  console.log('Switching to Modes tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const modesTab = btns.find(b => b.textContent && b.textContent.includes('Modes'));
    if (modesTab) modesTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing 05_sidebar_modes_architecture_immersion.png ...');
  await page.screenshot({ path: path.join(outDir, '05_sidebar_modes_architecture_immersion.png') });

  // 8. Switch to Presets tab
  console.log('Switching to Presets tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const presetsTab = btns.find(b => b.textContent && b.textContent.includes('Presets'));
    if (presetsTab) presetsTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing 06_sidebar_quick_presets.png ...');
  await page.screenshot({ path: path.join(outDir, '06_sidebar_quick_presets.png') });

  // 9. Switch to Help tab
  console.log('Switching to Help tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const helpTab = btns.find(b => b.textContent && b.textContent.includes('Help'));
    if (helpTab) helpTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing 07_sidebar_help_shortcuts.png ...');
  await page.screenshot({ path: path.join(outDir, '07_sidebar_help_shortcuts.png') });

  await browser.close();
  console.log('Phase 6 verification completed successfully!');
}

run().catch(err => {
  console.error('Error in Phase 6 verification:', err);
  process.exit(1);
});
