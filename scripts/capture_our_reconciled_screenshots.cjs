const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const screenshotsDir = path.join(__dirname, '..', 'docs', 'reference-reconciliation', 'before-after-screenshots');
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to our local digital twin: http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.cesium-viewer', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 4500));

  // 1. Full campus overview
  console.log('1. Full campus overview');
  await page.screenshot({ path: path.join(screenshotsDir, 'our-01-full-campus-overview.png') });

  // 2. Northern campus
  console.log('2. Northern campus');
  await page.evaluate(() => {
    const viewer = window.cesiumViewer;
    if (viewer && window.Cesium) {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(80.6935, 16.4880, 450),
        orientation: { heading: 0, pitch: -0.75, roll: 0 },
        duration: 0
      });
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'our-02-northern-campus.png') });

  // 3. Central academic cluster
  console.log('3. Central academic cluster');
  await page.evaluate(() => {
    const viewer = window.cesiumViewer;
    if (viewer && window.Cesium) {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(80.6922, 16.4845, 300),
        orientation: { heading: 0, pitch: -0.65, roll: 0 },
        duration: 0
      });
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'our-03-central-academic-cluster.png') });

  // 4. Eastern buildings
  console.log('4. Eastern buildings');
  await page.evaluate(() => {
    const viewer = window.cesiumViewer;
    if (viewer && window.Cesium) {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(80.6940, 16.4848, 300),
        orientation: { heading: 0, pitch: -0.65, roll: 0 },
        duration: 0
      });
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'our-04-eastern-buildings.png') });

  // 5. Southern campus
  console.log('5. Southern campus');
  await page.evaluate(() => {
    const viewer = window.cesiumViewer;
    if (viewer && window.Cesium) {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(80.6920, 16.4820, 320),
        orientation: { heading: 0, pitch: -0.65, roll: 0 },
        duration: 0
      });
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'our-05-southern-campus.png') });

  // 6. Hostels
  console.log('6. Hostels');
  await page.evaluate(() => {
    const viewer = window.cesiumViewer;
    if (viewer && window.Cesium) {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(80.6957, 16.4850, 280),
        orientation: { heading: 0, pitch: -0.65, roll: 0 },
        duration: 0
      });
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'our-06-hostels.png') });

  // 7. Sports facilities
  console.log('7. Sports facilities');
  await page.evaluate(() => {
    const viewer = window.cesiumViewer;
    if (viewer && window.Cesium) {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(80.6912, 16.4830, 280),
        orientation: { heading: 0, pitch: -0.65, roll: 0 },
        duration: 0
      });
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'our-07-sports-facilities.png') });

  // 8. Main entrance
  console.log('8. Main entrance');
  await page.evaluate(() => {
    const viewer = window.cesiumViewer;
    if (viewer && window.Cesium) {
      viewer.camera.flyTo({
        destination: window.Cesium.Cartesian3.fromDegrees(80.6912, 16.4815, 200),
        orientation: { heading: 0, pitch: -0.55, roll: 0 },
        duration: 0
      });
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'our-08-main-entrance.png') });

  console.log('All 8 of our reconciled screenshots captured successfully!');
  await browser.close();
})();
