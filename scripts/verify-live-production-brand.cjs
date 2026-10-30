const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const PROD_URL = 'https://creatoros-fawn-iota.vercel.app';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyLive() {
  console.log('Testing LIVE Vercel production deployment:', PROD_URL);
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(PROD_URL, { waitUntil: 'networkidle0' });

  // Set demo brand session and dark mode
  await page.evaluate(() => {
    localStorage.clear();
    const demoBrand = {
      id: 'demo-brand-01',
      name: 'Aura Streetwear Co.',
      email: 'demo.brand@creatoros.ai',
      role: 'business',
      handle: '@aurastreetwear',
      is_demo: true,
      account_type: 'demo',
      provider: 'demo',
    };
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(demoBrand));
    localStorage.setItem('creatoros_theme_v1', 'dark');
    localStorage.setItem('creatoros_state_v1_campaigns', JSON.stringify([]));
    localStorage.setItem('creatoros_state_v1_outreach', JSON.stringify([]));
    localStorage.setItem('creatoros_state_v1_payments', JSON.stringify([]));
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });

  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(2000);

  const checks = await page.evaluate(() => {
    const text = document.body.innerText;
    const hasGreeting = text.includes('Good morning,') || text.includes('Good afternoon,') || text.includes('Good evening,');
    const hasGettingStarted = text.includes('GETTING STARTED');
    const hasCreateCampaign = text.includes('Create Campaign');
    const hasDiscoverCreators = text.includes('Discover Creators');
    const hasOldKpis = text.includes('ACTIVE CAMPAIGNS') && text.includes('CREATORS IN ROSTER') && text.includes('PENDING APPROVALS');
    const hasOldAttention = text.includes('Needs Your Attention 0 active');

    // Check card surface background
    const cards = Array.from(document.querySelectorAll('div[class*="rounded-2xl"], div[class*="rounded-3xl"]'));
    let whiteCardCount = 0;
    cards.forEach(c => {
      const bg = window.getComputedStyle(c).backgroundColor;
      if (bg === 'rgb(255, 255, 255)' || bg === '#ffffff') {
        if (c.clientWidth > 120 && c.clientHeight > 50) whiteCardCount++;
      }
    });

    return {
      hasGreeting,
      hasGettingStarted,
      hasCreateCampaign,
      hasDiscoverCreators,
      hasOldKpis,
      hasOldAttention,
      whiteCardCount,
      title: document.title,
    };
  });

  console.log('Live production brand checks:', checks);

  const liveProdPath = path.join(ARTIFACT_DIR, 'verify_live_vercel_brand_dark.png');
  await page.screenshot({ path: liveProdPath, fullPage: false });
  console.log('Saved live production screenshot:', liveProdPath);

  await browser.close();

  if (checks.hasGreeting && checks.hasGettingStarted && !checks.hasOldKpis && checks.whiteCardCount === 0) {
    console.log('🎯 LIVE VERCEL PRODUCTION VERIFICATION PASSED 100%!');
    process.exit(0);
  } else {
    console.error('❌ LIVE PRODUCTION FAILED CHECKS!');
    process.exit(1);
  }
}

verifyLive().catch(err => {
  console.error(err);
  process.exit(1);
});
