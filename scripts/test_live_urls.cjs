const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const urls = ['https://sahe3dbysahithi.vercel.app', 'https://sahe-3d.vercel.app'];

  for (const url of urls) {
    console.log(`\n=== Testing ${url} ===`);
    const page = await browser.newPage();
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => consoleLogs.push(`[pageerror] ${err.toString()}`));

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
      await new Promise(r => setTimeout(r, 4000));
      const hasCesium = (await page.$('.cesium-viewer')) !== null;
      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300));
      console.log('Cesium viewer element present:', hasCesium);
      console.log('Body text snippet:', bodyText.replace(/\n+/g, ' '));
      console.log('Errors captured:', consoleLogs.filter(l => l.includes('error') || l.includes('Error') || l.includes('Failed')));
    } catch (e) {
      console.log(`Error testing ${url}:`, e.message);
    }
    await page.close();
  }
  await browser.close();
})();
