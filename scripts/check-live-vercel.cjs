const https = require('https');

https.get('https://creatoros-fawn-iota.vercel.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    const scripts = data.match(/src="[^"]+"/g) || [];
    const css = data.match(/href="[^"]+\.css"/g) || [];
    console.log('Scripts on Vercel:', scripts);
    console.log('CSS on Vercel:', css);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
