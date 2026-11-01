const https = require('https');

const options = {
  hostname: 'api.github.com',
  path: '/repos/zakki01/creatoros/commits/main',
  headers: {
    'User-Agent': 'NodeJS-Client'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Latest commit on GitHub:', json.sha, json.commit?.message);
    } catch(e) {
      console.log('Error parsing response:', data);
    }
  });
});
