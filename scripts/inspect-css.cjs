const https = require('https');

https.get('https://creatoros-fawn-iota.vercel.app/assets/index-B97q9CVR.css', (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('CSS length:', data.length);
    console.log('CSS contains #02070A:', data.includes('#02070a') || data.includes('#02070A'));
    console.log('CSS contains #105bff:', data.includes('#105bff') || data.includes('#105BFF'));
    console.log('CSS contains #0297de:', data.includes('#0297de') || data.includes('#0297DE'));
    console.log('CSS contains #fc734d:', data.includes('#fc734d') || data.includes('#FC734D'));
    console.log('CSS contains #ff77bc:', data.includes('#ff77bc') || data.includes('#FF77BC'));
  });
});
