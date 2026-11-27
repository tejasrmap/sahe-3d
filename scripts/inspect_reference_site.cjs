const https = require('https');
const fs = require('fs');
const path = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

(async () => {
  console.log('Fetching https://sahe3dbysahithi.vercel.app/ ...');
  const res = await get('https://sahe3dbysahithi.vercel.app/');
  console.log('Status code:', res.statusCode);
  fs.writeFileSync(path.join(__dirname, 'reference_html.html'), res.data, 'utf8');
  console.log('HTML length:', res.data.length);
  
  // Find all script tags
  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match;
  const scripts = [];
  while ((match = scriptRegex.exec(res.data)) !== null) {
    scripts.push(match[1]);
  }
  console.log('Found scripts:', scripts);

  // Check inline scripts
  const inlineScripts = res.data.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log('Inline script tags count:', inlineScripts.length);
  inlineScripts.forEach((s, idx) => {
    fs.writeFileSync(path.join(__dirname, `reference_inline_${idx}.js`), s, 'utf8');
    console.log(`Saved reference_inline_${idx}.js (${s.length} chars)`);
  });

  // Download linked scripts
  for (const s of scripts) {
    const fullUrl = s.startsWith('http') ? s : `https://sahe3dbysahithi.vercel.app/${s.replace(/^\//, '')}`;
    console.log(`Downloading script: ${fullUrl}`);
    try {
      const scriptRes = await get(fullUrl);
      const filename = path.basename(s.split('?')[0]) || 'bundle.js';
      fs.writeFileSync(path.join(__dirname, `reference_${filename}`), scriptRes.data, 'utf8');
      console.log(`Saved reference_${filename} (${scriptRes.data.length} chars)`);
    } catch (e) {
      console.error(`Failed to download ${fullUrl}:`, e.message);
    }
  }
})();
