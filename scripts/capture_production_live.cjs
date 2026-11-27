const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://sahe-3d.vercel.app', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  
  const shotPath = path.join(__dirname, '..', 'docs', 'screenshots', 'live-production-sahe-3d.png');
  await page.screenshot({ path: shotPath });
  console.log('Screenshot saved to:', shotPath);
  await browser.close();
})();
