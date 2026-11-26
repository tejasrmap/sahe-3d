const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const viewports = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080, isMobile: false },
  { name: 'laptop-1366x768', width: 1366, height: 768, isMobile: false },
  { name: 'tablet-768x1024', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'mobile-390x844', width: 390, height: 844, isMobile: true, hasTouch: true },
];

const screenshotsDir = path.join(__dirname, 'docs', 'screenshots', 'phase5');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

async function runVisualAudit() {
  console.log('=== Starting SAHE-3D Phase 5 Multi-Viewport Visual Audit ===');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist'],
  });

  const auditResults = {
    viewports: {},
    consoleErrors: [],
    performanceMetrics: {},
  };

  try {
    for (const vp of viewports) {
      console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      const page = await browser.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch,
      });

      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('Cesium ion')) {
          auditResults.consoleErrors.push(`[${vp.name}] ${msg.text()}`);
          console.error(`Console Error [${vp.name}]:`, msg.text());
        }
      });

      const startTime = Date.now();
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 35000 });
      await page.waitForSelector('.cesium-viewer', { timeout: 12000 });
      await new Promise((r) => setTimeout(r, 3000));
      const loadDuration = Date.now() - startTime;

      // Capture default campus overview
      const overviewScreenshot = path.join(screenshotsDir, `${vp.name}-campus-overview.png`);
      await page.screenshot({ path: overviewScreenshot });
      console.log(`Saved screenshot: ${overviewScreenshot}`);

      // Check overflow / horizontal scrollbar defect
      const layoutIssues = await page.evaluate(() => {
        const docWidth = document.documentElement.offsetWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const hasHorizontalScroll = bodyScrollWidth > docWidth;
        return {
          hasHorizontalScroll,
          docWidth,
          bodyScrollWidth,
        };
      });

      // Test Search
      const searchInput = await page.$('input[type="text"]');
      if (searchInput) {
        await searchInput.type('CSE');
        await new Promise((r) => setTimeout(r, 600));
        const searchScreenshot = path.join(screenshotsDir, `${vp.name}-search-active.png`);
        await page.screenshot({ path: searchScreenshot });
        await page.keyboard.press('Enter');
        await new Promise((r) => setTimeout(r, 1500));
      }

      // Check if Explore Interior button is present
      const exploreBtn = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find((b) => b.innerText.includes('Explore Interior'));
        if (target) {
          target.click();
          return true;
        }
        return false;
      });

      if (exploreBtn) {
        await new Promise((r) => setTimeout(r, 1500));
        const indoorScreenshot = path.join(screenshotsDir, `${vp.name}-indoor-modal.png`);
        await page.screenshot({ path: indoorScreenshot });
        console.log(`Saved screenshot: ${indoorScreenshot}`);

        // Close indoor modal
        await page.keyboard.press('Escape');
        await new Promise((r) => setTimeout(r, 800));
      }

      // Metrics
      const perfTiming = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: perf ? perf.domContentLoadedEventEnd : 0,
          loadComplete: perf ? perf.loadEventEnd : 0,
        };
      });

      auditResults.viewports[vp.name] = {
        layoutIssues,
        loadDurationMs: loadDuration,
        perfTiming,
      };

      await page.close();
    }

    fs.writeFileSync(
      path.join(__dirname, 'docs', 'phase-5', 'raw-audit-results.json'),
      JSON.stringify(auditResults, null, 2)
    );
    console.log('\n=== Multi-Viewport Visual Audit Finished Successfully ===');
  } catch (err) {
    console.error('Audit failed with error:', err);
  } finally {
    await browser.close();
  }
}

runVisualAudit();
