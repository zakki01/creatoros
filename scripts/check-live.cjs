const https = require('https');

https.get('https://creatoros-fawn-iota.vercel.app/', (res) => {
  console.log('Status:', res.statusCode);
  console.log('x-vercel-id:', res.headers['x-vercel-id']);
  console.log('age:', res.headers['age']);
  console.log('cache-control:', res.headers['cache-control']);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Body length:', data.length);
    const scriptMatches = data.match(/src="[^"]+"/g);
    console.log('Scripts:', scriptMatches);
    const cssMatches = data.match(/href="[^"]+\.css"/g);
    console.log('CSS:', cssMatches);
  });
});
