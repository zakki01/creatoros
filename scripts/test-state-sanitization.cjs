const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const LOCAL_URL = 'http://localhost:5173';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testStateSanitization() {
  console.log('--- TEST: State Sanitization & Default Data Isolation ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(LOCAL_URL, { waitUntil: 'networkidle0' });

  // Simulate a brand new real user (non-demo)
  await page.evaluate(() => {
    localStorage.clear();
    const newRealUser = {
      id: 'usr_real_98765',
      name: 'Priya Verma',
      email: 'priya.verma@example.com',
      role: 'creator',
      handle: '@priyaverma',
      avatarUrl: '',
      is_demo: false,
      isDemo: false,
      account_type: 'standard',
      provider: 'email',
    };
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(newRealUser));
  });

  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);

  const evaluation = await page.evaluate(() => {
    const text = document.body.innerText;
    // Check localStorage items
    const campaigns = JSON.parse(localStorage.getItem('creatoros_state_v1_campaigns') || '[]');
    const payments = JSON.parse(localStorage.getItem('creatoros_state_v1_payments') || '[]');
    const outreach = JSON.parse(localStorage.getItem('creatoros_state_v1_outreach') || '[]');

    // Check for hardcoded identities in text
    const hasKaran = text.includes('Karan Singhania');
    const hasRohan = text.includes('Rohan Sharma');
    const hasAura = text.includes('Aura Streetwear Co.');
    const hasFakeSummerCampaign = text.includes('Summer Collection');
    const hasFake52Creators = text.includes('52+ Creators') || text.includes('52 Creators');

    return {
      campaignsCount: campaigns.length,
      paymentsCount: payments.length,
      outreachCount: outreach.length,
      hasKaran,
      hasRohan,
      hasAura,
      hasFakeSummerCampaign,
      hasFake52Creators,
    };
  });

  console.log('Sanitization Evaluation Results:', evaluation);
  await browser.close();

  const passed =
    evaluation.campaignsCount === 0 &&
    evaluation.paymentsCount === 0 &&
    evaluation.outreachCount === 0 &&
    !evaluation.hasKaran &&
    !evaluation.hasRohan &&
    !evaluation.hasAura &&
    !evaluation.hasFakeSummerCampaign;

  if (passed) {
    console.log('✓ PASS: Production state is cleanly sanitized of default fake data!');
    process.exit(0);
  } else {
    console.error('❌ FAIL: Fake data still detected in production state!');
    process.exit(1);
  }
}

testStateSanitization().catch((err) => {
  console.error(err);
  process.exit(1);
});
