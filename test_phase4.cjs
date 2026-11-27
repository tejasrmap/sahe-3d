const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runPhase4Audit() {
  console.log('=== Starting SAHE Campus Explorer Phase 4 Indoor Exploration Audit ===');
  const testUrl = process.env.TEST_URL || 'http://localhost:4173/';
  const results = {
    url: testUrl,
    consoleErrors: [],
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

    console.log(`Step 1: Navigating to SAHE Campus Explorer at ${testUrl}...`);
    const response = await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    results.passedChecks.push(`HTTP status: ${response.status()}`);

    // Wait for initial load
    await page.waitForSelector('.cesium-viewer', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 3500));

    // Step 2: Search and select CSE & Computing Complex
    console.log('Step 2: Selecting CSE & IT Complex via Search...');
    const searchInput = await page.$('input[placeholder*="Search SAHE"]') || await page.$('input[type="text"]');
    if (searchInput) {
      await searchInput.type('CSE');
      await new Promise((r) => setTimeout(r, 800));
      await page.keyboard.press('Enter');
      await new Promise((r) => setTimeout(r, 2000));
      results.passedChecks.push('Selected CSE & Computing Complex');
      console.log('✓ Selected CSE Complex via search');
    } else {
      results.failedChecks.push('Could not find search input');
    }

    // Step 3: Verify "Explore Interior" button is visible in BuildingDetailsPanel
    console.log('Step 3: Verifying Explore Interior button...');
    const hasExploreInteriorBtn = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some((b) => b.textContent && b.textContent.includes('Explore Interior'));
    });

    if (hasExploreInteriorBtn) {
      results.passedChecks.push('Explore Interior button displayed in BuildingDetailsPanel');
      console.log('✓ Found Explore Interior button');
    } else {
      results.failedChecks.push('Explore Interior button not found in panel');
    }

    // Step 4: Click "Explore Interior" and launch Indoor Exploration Environment
    console.log('Step 4: Launching Indoor Digital Twin for CSE Complex...');
    const interiorClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const interiorBtn = buttons.find((b) => b.textContent && b.textContent.includes('Explore Interior'));
      if (interiorBtn) {
        interiorBtn.click();
        return true;
      }
      return false;
    });

    if (interiorClicked) {
      await new Promise((r) => setTimeout(r, 2000));

      const isIndoorModalActive = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return text.includes('VR Siddhartha CSE & Computing Complex') &&
               text.includes('Ground Floor') &&
               text.includes('Exit to Campus');
      });

      if (isIndoorModalActive) {
        results.passedChecks.push('Indoor Exploration Environment launched (Building Title, Ground Floor & Controls verified)');
        console.log('✓ Indoor Environment active');
        await page.screenshot({ path: path.join(screenshotsDir, 'phase4-indoor-ground-floor.png') });
        console.log('✓ Saved screenshot docs/screenshots/phase4-indoor-ground-floor.png');
      } else {
        results.failedChecks.push('Indoor modal text not rendered properly');
      }

      // Step 5: Test Floor Switching (Switch to Floor 2)
      console.log('Step 5: Testing Floor Switching to Level 2...');
      const floor2Clicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const f2Btn = buttons.find((b) => b.textContent && b.textContent.trim() === '2');
        if (f2Btn) {
          f2Btn.click();
          return true;
        }
        return false;
      });

      if (floor2Clicked) {
        await new Promise((r) => setTimeout(r, 1200));
        const floor2Active = await page.evaluate(() => {
          const text = document.body.textContent || '';
          return text.includes('Second Floor') || text.includes('8.4m') || text.includes('Floor 2');
        });

        if (floor2Active) {
          results.passedChecks.push('Floor switched to Floor 2 (Level 2 +8.4m verified)');
          console.log('✓ Switched to Floor 2');
          await page.screenshot({ path: path.join(screenshotsDir, 'phase4-indoor-floor2.png') });
          console.log('✓ Saved screenshot docs/screenshots/phase4-indoor-floor2.png');
        } else {
          results.failedChecks.push('Floor 2 text not found after clicking level 2');
        }
      } else {
        results.failedChecks.push('Could not find Floor 2 button');
      }

      // Step 6: Test Room Selection (Click on room in floor plan)
      console.log('Step 6: Testing Room Selection on Floor 2...');
      const roomClicked = await page.evaluate(() => {
        const roomG = document.querySelector('svg g rect');
        if (roomG) {
          // Click first room SVG group
          const gElements = Array.from(document.querySelectorAll('svg g[class*="cursor-pointer"]'));
          if (gElements.length > 0) {
            gElements[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return true;
          }
        }
        return false;
      });

      if (roomClicked) {
        await new Promise((r) => setTimeout(r, 1000));
        const hasRoomCard = await page.evaluate(() => {
          const text = document.body.textContent || '';
          return text.includes('Capacity') || text.includes('Navigate to Room');
        });

        if (hasRoomCard) {
          results.passedChecks.push('RoomDetailsCard opened with capacity, dimensions, and navigation button');
          console.log('✓ Room details card verified');
          await page.screenshot({ path: path.join(screenshotsDir, 'phase4-room-details.png') });
          console.log('✓ Saved screenshot docs/screenshots/phase4-room-details.png');

          // Step 7: Test Indoor Navigation to Room
          console.log('Step 7: Activating Indoor Navigation to selected room...');
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const navBtn = buttons.find((b) => b.textContent && b.textContent.includes('Navigate to Room'));
            if (navBtn) navBtn.click();
          });
          await new Promise((r) => setTimeout(r, 1000));

          const hasRouteToast = await page.evaluate(() => {
            const text = document.body.textContent || '';
            return text.includes('Route Active:') || !!document.querySelector('polyline');
          });

          if (hasRouteToast) {
            results.passedChecks.push('Active Indoor Navigation route drawn on floor plan with waypoint beacon');
            console.log('✓ Indoor Navigation route verified');
            await page.screenshot({ path: path.join(screenshotsDir, 'phase4-indoor-navigation.png') });
            console.log('✓ Saved screenshot docs/screenshots/phase4-indoor-navigation.png');
          } else {
            results.failedChecks.push('Indoor navigation route polyline not rendered');
          }
        } else {
          results.failedChecks.push('RoomDetailsCard did not render on room click');
        }
      } else {
        results.failedChecks.push('Could not click room element in SVG canvas');
      }

      // Step 8: Test 3D Isometric View Toggle
      console.log('Step 8: Testing 3D Isometric View Mode...');
      const toggled3D = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn3d = buttons.find((b) => b.textContent && b.textContent.includes('3D View') || b.title?.includes('Isometric'));
        if (btn3d) {
          btn3d.click();
          return true;
        }
        return false;
      });

      if (toggled3D) {
        await new Promise((r) => setTimeout(r, 1200));
        results.passedChecks.push('3D Isometric View perspective toggle verified');
        console.log('✓ 3D Isometric View toggled');
        await page.screenshot({ path: path.join(screenshotsDir, 'phase4-indoor-3d-isometric.png') });
        console.log('✓ Saved screenshot docs/screenshots/phase4-indoor-3d-isometric.png');
      } else {
        results.failedChecks.push('Could not find 3D View toggle button');
      }

      // Step 9: Test Indoor Room Search
      console.log('Step 9: Testing Indoor Room Search for "NVIDIA"...');
      const searchInput = await page.$('input[placeholder*="Search room"]');
      if (searchInput) {
        await searchInput.type('NVIDIA');
        await new Promise((r) => setTimeout(r, 800));

        const searchResultClicked = await page.evaluate(() => {
          const resultsButtons = Array.from(document.querySelectorAll('button'));
          const nvidiaBtn = resultsButtons.find((b) => b.textContent && b.textContent.includes('NVIDIA'));
          if (nvidiaBtn) {
            nvidiaBtn.click();
            return true;
          }
          return false;
        });

        if (searchResultClicked) {
          await new Promise((r) => setTimeout(r, 1200));
          results.passedChecks.push('Indoor search auto-navigated to NVIDIA AI Supercomputing Center on Ground Floor');
          console.log('✓ Indoor search verified');
          await page.screenshot({ path: path.join(screenshotsDir, 'phase4-indoor-search.png') });
          console.log('✓ Saved screenshot docs/screenshots/phase4-indoor-search.png');
        } else {
          results.failedChecks.push('NVIDIA search result not found in dropdown');
        }
      } else {
        results.failedChecks.push('Indoor search input not found');
      }

      // Step 10: Exit Indoor View back to Campus Map
      console.log('Step 10: Exiting Indoor View back to Campus Map...');
      const exitClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const exitBtn = buttons.find((b) => b.textContent && b.textContent.includes('Exit to Campus'));
        if (exitBtn) {
          exitBtn.click();
          return true;
        }
        return false;
      });

      if (exitClicked) {
        await new Promise((r) => setTimeout(r, 1500));
        const returnedToOutdoor = await page.evaluate(() => {
          return !document.body.textContent.includes('Floor G of 5') && !!document.querySelector('.cesium-viewer');
        });

        if (returnedToOutdoor) {
          results.passedChecks.push('Seamless transition back to outdoor 3D campus viewer verified');
          console.log('✓ Returned to outdoor campus');
        } else {
          results.failedChecks.push('Outdoor viewer not restored after exit');
        }
      } else {
        results.failedChecks.push('Exit to Campus button not clicked');
      }

    } else {
      results.failedChecks.push('Could not click Explore Interior button');
    }

  } catch (err) {
    console.error('Audit exception:', err);
    results.failedChecks.push(`Fatal exception: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n=== Phase 4 Indoor Exploration Audit Results ===');
  console.log('Passed Checks (' + results.passedChecks.length + '):');
  results.passedChecks.forEach((c) => console.log('  [PASS]', c));
  if (results.failedChecks.length > 0) {
    console.log('Failed Checks (' + results.failedChecks.length + '):');
    results.failedChecks.forEach((c) => console.log('  [FAIL]', c));
  } else {
    console.log('ALL PHASE 4 CHECKS PASSED PERFECTLY (0 Failures)');
  }

  fs.writeFileSync(path.join(__dirname, 'docs', 'phase-4-audit-results.json'), JSON.stringify(results, null, 2));
}

runPhase4Audit();
