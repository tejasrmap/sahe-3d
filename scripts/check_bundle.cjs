const https = require('https');
https.get('https://sahe-3d.vercel.app', res => {
  console.log('Status:', res.statusCode);
  console.log('Vercel ID:', res.headers['x-vercel-id']);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    console.log('Deployed JS Bundle:', match ? match[1] : 'not found');
  });
});
