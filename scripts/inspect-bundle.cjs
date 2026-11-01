const https = require('https');

https.get('https://creatoros-fawn-iota.vercel.app/assets/index-D6FGjs_r.js', (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('JS length:', data.length);
    console.log('Contains #00869B (old teal):', data.includes('#00869B'));
    console.log('Contains #105BFF (new light primary):', data.includes('#105BFF'));
    console.log('Contains #02070A (new dark bg):', data.includes('#02070A'));
    console.log('Contains #0297DE (new dark primary):', data.includes('#0297DE'));
    console.log('Contains MobileAppsDrawer:', data.includes('MobileAppsDrawer'));
  });
});
