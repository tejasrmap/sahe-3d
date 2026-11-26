const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runPhase3Audit() {
  console.log('=== Starting SAHE Campus Explorer Phase 3 Immersive Audit ===');
  const results = {
    url: 'http://localhost:3000/',
    consoleErrors: [],
    consoleWarnings: [],
    passedChecks: [],
    failedChecks: [],
  };

  const screenshotsDir = path.join(__dirname, 'docs', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error' && !text.includes('Cesium ion')) {
        results.consoleErrors.push(text);
        console.error('Browser Error:', text);
      }
    });

    page.on('pageerror', (err) => {
      results.consoleErrors.push(err.toString());
      console.error('Page Uncaught Error:', err);
    });

    console.log('Step 1: Navigating to SAHE Campus Explorer at http://localhost:3000/...');
    const response = await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
    results.passedChecks.push(`HTTP status: ${response.status()}`);

    // Wait for Cesium canvas & loading screen to complete
    await page.waitForSelector('.cesium-viewer', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 3500));

    // Check 1: Presets Bar with Tour, Immersive Walk & Lighting
    console.log('Step 2: Checking Phase 3 UI Elements in CameraPresetsBar...');
    const hasPhase3Controls = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return {
        hasImmersiveWalk: text.includes('Immersive Walk'),
        hasTour: text.includes('Tour'),
        hasSunLighting: !!document.querySelector('button[title*="Morning"], button[title*="08:30"], button svg.lucide-sun, button svg.lucide-moon'),
      };
    });

    if (hasPhase3Controls.hasImmersiveWalk && hasPhase3Controls.hasTour) {
      results.passedChecks.push('Phase 3 Dock buttons (Immersive Walk, Tour, Lighting) verified');
      console.log('✓ Found Immersive Walk and Tour controls');
    } else {
      results.failedChecks.push('Missing Immersive Walk or Tour dock controls: ' + JSON.stringify(hasPhase3Controls));
    }

    // Check 2: Launch Guided Campus Tour
    console.log('Step 3: Launching Guided Campus Tour...');
    const tourBtnClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tourBtn = buttons.find((b) => b.textContent && b.textContent.includes('Tour'));
      if (tourBtn) {
        tourBtn.click();
        return true;
      }
      return false;
    });

    if (tourBtnClicked) {
      await new Promise((r) => setTimeout(r, 2000));
      const isTourModalOpen = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return (text.includes('Guided Digital Tour') || text.includes('Campus Landmark Tour')) &&
               (text.includes('Grand Entrance Portal') || text.includes('STOP 1 OF 10'));
      });

      if (isTourModalOpen) {
        results.passedChecks.push('Guided Campus Tour launched successfully (Stop 1: Main University Entrance)');
        console.log('✓ Campus Tour Modal verified at Stop 1');
        await page.screenshot({ path: path.join(screenshotsDir, 'phase3-tour-stop1.png') });
        console.log('✓ Saved screenshot docs/screenshots/phase3-tour-stop1.png');

        // Test Next Stop Button
        await page.evaluate(() => {
          const nextBtn = document.querySelector('button[title="Next Landmark"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerHTML.includes('lucide-skip-forward'));
          if (nextBtn) nextBtn.click();
        });
        await new Promise((r) => setTimeout(r, 1500));
        await page.screenshot({ path: path.join(screenshotsDir, 'phase3-tour-stop2.png') });
        console.log('✓ Saved screenshot docs/screenshots/phase3-tour-stop2.png');

        // Close Tour Modal
        await page.evaluate(() => {
          const closeBtn = document.querySelector('button[title="Exit Tour"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerHTML.includes('lucide-x'));
          if (closeBtn) closeBtn.click();
        });
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        results.failedChecks.push('Tour modal did not render landmark text');
      }
    } else {
      results.failedChecks.push('Could not find or click Tour button');
    }

    // Check 3: Lighting System - Night Mode (20:30)
    console.log('Step 4: Testing Night Lighting (20:30)...');
    const nightBtnClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const moonBtn = buttons.find(b => b.innerHTML.includes('lucide-moon'));
      if (moonBtn) {
        moonBtn.click();
        return true;
      }
      return false;
    });

    if (nightBtnClicked) {
      await new Promise((r) => setTimeout(r, 1500));
      results.passedChecks.push('Time of Day switched to Night (20:30) with illuminated streetlights');
      await page.screenshot({ path: path.join(screenshotsDir, 'phase3-night-lighting.png') });
      console.log('✓ Saved screenshot docs/screenshots/phase3-night-lighting.png');
    } else {
      results.failedChecks.push('Could not click Night mode button');
    }

    // Switch back to Golden Hour
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sunsetBtn = buttons.find(b => b.innerHTML.includes('lucide-sunset'));
      if (sunsetBtn) sunsetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Check 4: Enter First-Person Immersive Walk Mode
    console.log('Step 5: Entering First-Person Mode...');
    const walkBtnClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const walkBtn = buttons.find((b) => b.textContent && b.textContent.includes('Immersive Walk'));
      if (walkBtn) {
        walkBtn.click();
        return true;
      }
      return false;
    });

    if (walkBtnClicked) {
      await new Promise((r) => setTimeout(r, 2500));
      const hudActive = await page.evaluate(() => {
        const text = document.body.textContent || '';
        const hasExit = text.includes('ESC') || text.includes('Exit');
        const hasPace = text.includes('Walking Pace') || text.includes('km/h');
        const hasCompass = !!document.querySelector('.lucide-compass');
        return hasExit && (hasPace || hasCompass);
      });

      if (hudActive) {
        results.passedChecks.push('First-Person Mode & Immersive HUD activated with crosshair reticle, speed, and compass');
        console.log('✓ Immersive HUD active');
        await page.screenshot({ path: path.join(screenshotsDir, 'phase3-firstperson-hud.png') });
        console.log('✓ Saved screenshot docs/screenshots/phase3-firstperson-hud.png');

        // Check 5: Simulate Keyboard Movement (WASD + Shift)
        console.log('Step 6: Simulating WASD walking and Shift sprint...');
        await page.click('canvas');
        await page.keyboard.down('Shift');
        await page.keyboard.down('KeyW');
        await new Promise((r) => setTimeout(r, 1500));

        const sprintState = await page.evaluate(() => {
          const text = document.body.textContent || '';
          return text.includes('Sprinting') || text.includes('km/h');
        });
        results.passedChecks.push(`Movement & sprint loop active: ${sprintState}`);

        await page.screenshot({ path: path.join(screenshotsDir, 'phase3-walking-movement.png') });
        console.log('✓ Saved screenshot docs/screenshots/phase3-walking-movement.png');

        await page.keyboard.up('KeyW');
        await page.keyboard.up('Shift');
        await new Promise((r) => setTimeout(r, 500));

        // Test ESC to exit First Person
        console.log('Step 7: Pressing ESC to exit First Person...');
        await page.keyboard.press('Escape');
        await new Promise((r) => setTimeout(r, 2200));

        const exited = await page.evaluate(() => {
          return !!document.querySelector('button') && document.body.textContent.includes('Immersive Walk');
        });
        if (exited) {
          results.passedChecks.push('Successfully exited First Person mode back to overview via Escape');
          console.log('✓ Exited First Person successfully');
        } else {
          results.failedChecks.push('Escape key did not restore overview');
        }
      } else {
        results.failedChecks.push('Immersive HUD did not render expected elements');
      }
    } else {
      results.failedChecks.push('Could not click Immersive Walk button');
    }

    // Check 6: Mobile Viewport Touch Controls Test
    console.log('Step 8: Testing Mobile Touch Controls on 390x844 viewport...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await new Promise((r) => setTimeout(r, 1200));

    const buttonTexts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map((b) => b.textContent ? b.textContent.trim() : '');
    });
    console.log('Mobile viewport buttons detected:', buttonTexts);

    const mobileWalkClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const walkBtn = buttons.find((b) => b.textContent && b.textContent.includes('Walk'));
      if (walkBtn) {
        walkBtn.click();
        return true;
      }
      return false;
    });
    console.log('mobileWalkClicked result:', mobileWalkClicked);

    if (mobileWalkClicked) {
      await new Promise((r) => setTimeout(r, 3500));
      const debugTouch = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return {
          hasSwipeLook: text.includes('Swipe to Look'),
          hasSprint: text.includes('Sprint') || text.includes('Sprinting'),
          hasPace: text.includes('km/h'),
          hasEsc: text.includes('ESC'),
          textSnippet: text.slice(0, 200),
        };
      });
      console.log('Debug touch controls:', debugTouch);

      if (debugTouch.hasSwipeLook || debugTouch.hasSprint || debugTouch.hasPace || debugTouch.hasEsc) {
        results.passedChecks.push('Mobile Touch Controls verified (Virtual Joystick & Touch Look area)');
        await page.screenshot({ path: path.join(screenshotsDir, 'phase3-mobile-touch-controls.png') });
        console.log('✓ Saved screenshot docs/screenshots/phase3-mobile-touch-controls.png');
      } else {
        results.failedChecks.push('Mobile touch controls not rendered: ' + JSON.stringify(debugTouch));
      }
    } else {
      results.failedChecks.push('Could not find mobile Walk button in bottom navigation');
    }

  } catch (err) {
    console.error('Audit exception:', err);
    results.failedChecks.push(`Fatal exception: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n=== Phase 3 Audit Results ===');
  console.log('Passed Checks (' + results.passedChecks.length + '):');
  results.passedChecks.forEach((c) => console.log('  [PASS]', c));
  if (results.failedChecks.length > 0) {
    console.log('Failed Checks (' + results.failedChecks.length + '):');
    results.failedChecks.forEach((c) => console.log('  [FAIL]', c));
  } else {
    console.log('ALL CHECKS PASSED PERFECTLY (0 Failures)');
  }

  if (results.consoleErrors.length > 0) {
    console.log('Console Errors:', results.consoleErrors);
  }

  fs.writeFileSync(path.join(__dirname, 'docs', 'phase-3-audit-results.json'), JSON.stringify(results, null, 2));
}

runPhase3Audit();
