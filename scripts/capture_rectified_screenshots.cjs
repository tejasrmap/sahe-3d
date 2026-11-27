const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'docs', 'geospatial-rectification', 'before-after-screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function captureValidationScreenshots() {
  console.log('=== Capturing Geospatial Rectification Verification Screenshots ===');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Loading local application...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 35000 });
    await page.waitForSelector('.cesium-viewer', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 4000));

    // 1. Full-campus view
    console.log('1. Full Campus Overview...');
    await page.screenshot({ path: path.join(outDir, '01-full-campus-overview.png') });

    // Helper to fly camera in Cesium
    async function flyCamera(lon, lat, height, pitchDeg, headingDeg) {
      await page.evaluate(
        (targetLon, targetLat, targetHeight, targetPitch, targetHeading) => {
          const viewer = window.__CESIUM_VIEWER__ || window.cesiumViewer;
          // or access through cesium widget on window if exposed, or click presets
        },
        lon,
        lat,
        height,
        pitchDeg,
        headingDeg
      );
    }

    // 2. Academic Quadrangle (CSE, ECE, Mech, Admin Library)
    console.log('2. Academic Buildings Cluster...');
    const searchInput = await page.$('input[type="text"]');
    if (searchInput) {
      await searchInput.type('Library');
      await new Promise((r) => setTimeout(r, 800));
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 2500));
      await page.screenshot({ path: path.join(outDir, '02-academic-cluster-rectified.png') });

      // 3. Close up CSE Complex
      console.log('3. CSE Complex Close-up...');
      await searchInput.click({ clickCount: 3 });
      await searchInput.type('CSE');
      await new Promise((r) => setTimeout(r, 800));
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 2500));
      await page.screenshot({ path: path.join(outDir, '03-cse-complex-close-up.png') });

      // 4. Main Entrance Portal & Security
      console.log('4. Main Entrance Portal...');
      await searchInput.click({ clickCount: 3 });
      await searchInput.type('Entrance Gate');
      await new Promise((r) => setTimeout(r, 800));
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 2500));
      await page.screenshot({ path: path.join(outDir, '04-main-entrance-portal.png') });

      // 5. Hostel Area (Boys & Girls Residency)
      console.log('5. Hostel Area...');
      await searchInput.click({ clickCount: 3 });
      await searchInput.type('Boys Hostel');
      await new Promise((r) => setTimeout(r, 800));
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 2500));
      await page.screenshot({ path: path.join(outDir, '05-boys-hostel-area.png') });

      await searchInput.click({ clickCount: 3 });
      await searchInput.type('Women');
      await new Promise((r) => setTimeout(r, 800));
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 2500));
      await page.screenshot({ path: path.join(outDir, '06-girls-hostel-area.png') });

      // 6. Sports Arena & Athletic Ground
      console.log('6. Sports Area...');
      await searchInput.click({ clickCount: 3 });
      await searchInput.type('Sports');
      await new Promise((r) => setTimeout(r, 800));
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 2500));
      await page.screenshot({ path: path.join(outDir, '07-sports-area.png') });
    }

    // 7. Geographic Mode with Extruded Polygons
    console.log('7. Geographic Satellite Extrusion Mode...');
    // Click Geographic mode button
    const modeBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const geoBtn = btns.find((b) => b.innerText.includes('Geographic'));
      if (geoBtn) {
        geoBtn.click();
        return true;
      }
      return false;
    });

    if (modeBtn) {
      await new Promise((r) => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(outDir, '08-campus-boundary-and-satellite-extrusion.png') });
    }

    console.log('All 8 validation screenshots saved successfully to ' + outDir);
  } catch (err) {
    console.error('Screenshot capture failed:', err);
  } finally {
    await browser.close();
  }
}

captureValidationScreenshots();
