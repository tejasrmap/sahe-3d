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

  console.log('Navigating to reference: https://sahe3dbysahithi.vercel.app/ ...');
  await page.goto('https://sahe3dbysahithi.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Full campus overview
  console.log('1. Full campus overview');
  await page.screenshot({ path: path.join(screenshotsDir, 'ref-01-full-campus-overview.png') });

  // Preset places indices in reference:
  // 6: Main Gate
  // 12: SAHE Cricket Ground
  // 0: CSE, AI, ECE, EIE Departments
  // 2: Civil Block
  // 15: Mech Block
  // 4: VRSEC Library
  // 9: SAHE Boys Hostel
  // 7: PVP Siddhartha Institute of Technology (Northern)
  // 19: Saraswathi Statue (Central)

  // 2. Northern campus buildings (PVP Siddhartha, index 7)
  console.log('2. Northern campus buildings');
  await page.evaluate(() => { if (typeof go === 'function') go(7); });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'ref-02-northern-campus.png') });

  // 3. Central building cluster (CSE / Saraswathi, index 0 & 19)
  console.log('3. Central building cluster');
  await page.evaluate(() => { if (typeof go === 'function') go(0); });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'ref-03-central-academic-cluster.png') });

  // 4. Eastern buildings (Civil Block / S&H, index 2)
  console.log('4. Eastern buildings');
  await page.evaluate(() => { if (typeof go === 'function') go(2); });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'ref-04-eastern-buildings.png') });

  // 5. Southern campus (SMT Velagapudi / Entrance rd, index 22)
  console.log('5. Southern campus');
  await page.evaluate(() => { if (typeof go === 'function') go(22); });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'ref-05-southern-campus.png') });

  // 6. Hostels (Boys Hostel, index 9)
  console.log('6. Hostels');
  await page.evaluate(() => { if (typeof go === 'function') go(9); });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'ref-06-hostels.png') });

  // 7. Sports facilities (Cricket Ground, index 12)
  console.log('7. Sports facilities');
  await page.evaluate(() => { if (typeof go === 'function') go(12); });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'ref-07-sports-facilities.png') });

  // 8. Main entrance (Main Gate, index 6)
  console.log('8. Main entrance');
  await page.evaluate(() => { if (typeof go === 'function') go(6); });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'ref-08-main-entrance.png') });

  console.log('All 8 reference screenshots captured successfully!');
  await browser.close();
})();
