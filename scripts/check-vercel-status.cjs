const https = require('https');

https.get('https://creatoros-fawn-iota.vercel.app/', (res) => {
  console.log('Status:', res.statusCode);
  console.log('x-vercel-id:', res.headers['x-vercel-id']);
  console.log('x-vercel-cache:', res.headers['x-vercel-cache']);
  console.log('last-modified:', res.headers['last-modified']);
  console.log('etag:', res.headers['etag']);
  console.log('age:', res.headers['age']);
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('Body length:', data.length);
    const matches = data.match(/\/assets\/[a-zA-Z0-9_\-\.]+/g);
    console.log('Assets in HTML:', matches);
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});
