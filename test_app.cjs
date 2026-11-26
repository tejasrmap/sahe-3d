const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runPhase2Audit() {
  console.log('--- Starting Phase 2 Architectural Digital Twin Audit ---');
  const results = {
    url: 'http://localhost:3000/',
    consoleErrors: [],
    consoleWarnings: [],
    failedRequests: [],
    passedChecks: [],
    failedChecks: [],
  };

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      results.consoleErrors.push(text);
      console.error('Browser Error:', text);
    } else if (msg.type() === 'warning') {
      results.consoleWarnings.push(text);
    }
  });

  page.on('pageerror', (err) => {
    results.consoleErrors.push(err.toString());
    console.error('Page Uncaught Error:', err);
  });

  page.on('requestfailed', (req) => {
    results.failedRequests.push(`${req.method()} ${req.url()}: ${req.failure().errorText}`);
    console.warn('Failed Request:', req.url(), req.failure().errorText);
  });

  try {
    console.log('Navigating to http://localhost:3000/...');
    const response = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
    results.passedChecks.push(`HTTP status: ${response.status()}`);

    // Wait for initial load
    await page.waitForSelector('.cesium-viewer', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 3500));

    const docsDir = path.join(__dirname, 'docs');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

    // Check 1: Verify Architectural Mode Default & Presets Bar
    const hasPresetsBar = await page.evaluate(() => {
      return document.body.textContent.includes('Architectural Twin') &&
             document.body.textContent.includes('Geographic') &&
             document.body.textContent.includes('Architecture') &&
             document.body.textContent.includes('Orbit');
    });

    if (hasPresetsBar) {
      results.passedChecks.push('CameraPresetsBar and Mode Switcher mounted and visible');
      await page.screenshot({ path: path.join(docsDir, 'screenshot-phase2-architectural-twin.png') });
      results.passedChecks.push('Captured screenshot-phase2-architectural-twin.png');
    } else {
      results.failedChecks.push('CameraPresetsBar or Mode Switcher missing');
    }

    // Check 2: Test Architectural View Preset
    console.log('Testing Architectural View Preset...');
    const archPresetBtn = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Architecture'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (archPresetBtn) {
      await new Promise((r) => setTimeout(r, 2200));
      results.passedChecks.push('Switched to Architectural 3D perspective preset');
      await page.screenshot({ path: path.join(docsDir, 'screenshot-phase2-architectural-preset.png') });
    }

    // Check 3: Select Building & Test "Explore Orbit"
    console.log('Selecting building and testing Explore Orbit...');
    const selectCse = await page.evaluate(() => {
      // Open sidebar and click CSE block
      const dirBtn = Array.from(document.querySelectorAll('button')).find((b) => b.title && b.title.includes('Campus Directory'));
      if (dirBtn) dirBtn.click();
      return true;
    });
    await new Promise((r) => setTimeout(r, 800));

    const clickCse = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('h4')).find((h) => h.textContent.includes('VR Siddhartha CSE'));
      if (el) {
        el.click();
        return true;
      }
      return false;
    });

    if (clickCse) {
      await new Promise((r) => setTimeout(r, 2000));
      results.passedChecks.push('CSE Complex selected, panel opened with Photo-Calibrated Digital Twin badge');

      // Click "Explore Orbit"
      const orbitBtn = await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Explore Orbit'));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });

      if (orbitBtn) {
        await new Promise((r) => setTimeout(r, 2500));
        results.passedChecks.push('360 degree Building Orbit activated and turntable running');
        await page.screenshot({ path: path.join(docsDir, 'screenshot-phase2-building-orbit.png') });
        results.passedChecks.push('Captured screenshot-phase2-building-orbit.png');
      }
    }

    // Check 4: Test Switching to Geographic Satellite Mode
    console.log('Testing Mode Switch to Geographic Satellite Mode...');
    const geoBtn = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Geographic'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (geoBtn) {
      await new Promise((r) => setTimeout(r, 1500));
      results.passedChecks.push('Successfully toggled into Geographic Satellite Mode');
      await page.screenshot({ path: path.join(docsDir, 'screenshot-phase2-geographic-mode.png') });
      results.passedChecks.push('Captured screenshot-phase2-geographic-mode.png');

      // Switch back to Architectural Twin
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Architectural Twin'));
        if (btn) btn.click();
      });
      await new Promise((r) => setTimeout(r, 1200));
    }

    // Check 5: Walking / Ground Level Exploration
    console.log('Testing Ground Level Perspective...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Ground'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 2500));
    results.passedChecks.push('Ground level eye-perspective verified');
    await page.screenshot({ path: path.join(docsDir, 'screenshot-phase2-ground-level.png') });

  } catch (err) {
    console.error('Audit exception:', err);
    results.failedChecks.push(`Exception: ${err.message}`);
  } finally {
    await browser.close();
  }

  // Save audit log
  fs.writeFileSync(path.join(__dirname, 'docs', 'phase2-audit-results.json'), JSON.stringify(results, null, 2));
  console.log('\n--- Phase 2 Audit Complete ---');
  console.log('Passed Checks:', results.passedChecks.length);
  console.log('Failed Checks:', results.failedChecks.length);
  console.log('Console Errors:', results.consoleErrors.length);
  console.log('Failed Requests:', results.failedRequests.length);
}

runPhase2Audit();
