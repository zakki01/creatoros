const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeJS' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    }).on('error', reject);
  });
}

async function run() {
  const deployments = await fetchJson('https://api.github.com/repos/zakki01/creatoros/deployments');
  console.log('GitHub Deployments count:', Array.isArray(deployments) ? deployments.length : deployments);
  if (Array.isArray(deployments) && deployments.length > 0) {
    console.log('Latest 3 deployments:', deployments.slice(0, 3));
  }
}

run();
