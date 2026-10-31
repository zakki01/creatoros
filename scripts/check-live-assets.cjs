const https = require('https');

https.get('https://creatoros-fawn-iota.vercel.app/', res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const scripts = body.match(/\/assets\/[^"]+\.js/g);
    const css = body.match(/\/assets\/[^"]+\.css/g);
    console.log('Live Scripts:', scripts);
    console.log('Live CSS:', css);
  });
});
