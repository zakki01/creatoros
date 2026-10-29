const baseUrl = 'https://creatoros-fawn-iota.vercel.app';

async function verifyProduction() {
  console.log('Testing live production deployment at:', baseUrl);

  // 1. /api/health
  const healthRes = await fetch(baseUrl + '/api/health');
  console.log('\n[PROBE 1] GET /api/health -> Status:', healthRes.status);
  const healthJson = await healthRes.json();
  console.log('Response:', healthJson);
  if (healthRes.status !== 200 || !healthJson.ok) {
    throw new Error('Health check failed');
  }

  // 2. /api/live/session
  const sessionRes = await fetch(baseUrl + '/api/live/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creatorId: 'cr-smoke-test', role: 'host' })
  });
  console.log('\n[PROBE 2] POST /api/live/session -> Status:', sessionRes.status);
  const sessionJson = await sessionRes.json();
  console.log('LiveKit Session response:', {
    success: sessionJson.success,
    wsUrl: sessionJson.wsUrl,
    roomName: sessionJson.roomName,
    hasToken: Boolean(sessionJson.token)
  });
  if (sessionRes.status !== 200 || !sessionJson.token) {
    throw new Error('LiveKit session token generation failed');
  }

  // 3. SPA Direct Routing (Rewrites)
  const routes = [
    '/',
    '/discover',
    '/live',
    '/messages',
    '/contracts',
    '/earnings',
    '/settings',
    '/creators',
    '/brands'
  ];

  console.log('\n[PROBE 3] Testing Direct URL Access (SPA 404 Prevention):');
  for (const route of routes) {
    const res = await fetch(baseUrl + route);
    const text = await res.text();
    const isHtml = (res.headers.get('content-type') || '').includes('text/html');
    const hasRoot = text.includes('<div id="root">') || text.includes('id="root"');
    console.log(`  Route ${route.padEnd(12)} -> Status: ${res.status} | HTML: ${isHtml} | Mount Root: ${hasRoot}`);
    if (res.status !== 200 || !hasRoot) {
      throw new Error(`Direct route failed on ${route}`);
    }
  }

  console.log('\n================================================================');
  console.log('ALL PRODUCTION LIVE ENDPOINTS & SPA REWRITES VERIFIED: PASS');
  console.log('================================================================\n');
}

verifyProduction().catch(err => {
  console.error('\nFAIL:', err);
  process.exit(1);
});
