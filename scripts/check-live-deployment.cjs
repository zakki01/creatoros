const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function check() {
  const page = await get('https://creatoros-fawn-iota.vercel.app/');
  console.log('Status:', page.status);
  const scripts = page.data.match(/\/assets\/[a-zA-Z0-9_\-\.]+\.js/g);
  console.log('Live scripts:', scripts);

  if (scripts && scripts.length > 0) {
    const mainScript = await get(`https://creatoros-fawn-iota.vercel.app${scripts[0]}`);
    console.log('Main bundle size:', mainScript.data.length, 'bytes');
    console.log('Contains supabaseClient:', mainScript.data.includes('supabase.co') || mainScript.data.includes('supabaseClient') || mainScript.data.includes('fthqnbqqsgfkotsmsjgz'));
    console.log('Contains zero local password storage:', !mainScript.data.includes('creatoros_registered_accounts_v1'));
  }
}

check().catch(console.error);
