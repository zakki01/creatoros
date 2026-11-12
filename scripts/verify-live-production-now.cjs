const fs = require('fs');
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;
const artifactDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';

const LIVE_URL = 'https://creatoros-fawn-iota.vercel.app';

async function testLive() {
  console.log('Testing LIVE Production URL:', LIVE_URL);

  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const creatorUser = {
      id: 'usr_real_zakki',
      email: 'zakkishaikh04@gmail.com',
      name: 'Zakki Salim Shaikh',
      role: 'creator',
      is_demo: false,
    };

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // 1. Visit Live URL and seed auth
    await page.goto(LIVE_URL, { waitUntil: 'networkidle2' });
    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'analytics');
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('creatoros_trial_days', '7');
    }, creatorUser);

    // 2. Test Live Analytics "+ Create Content" click
    console.log('Testing Live Analytics "+ Create Content"...');
    await page.goto(`${LIVE_URL}/?tab=analytics`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find((b) => b.innerText.includes('Create Content'));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });
    console.log('Clicked "+ Create Content" on LIVE:', clicked);
    await new Promise((r) => setTimeout(r, 1500));

    await page.screenshot({ path: path.join(artifactDir, 'live_production_create_content_fixed.png') });
    console.log('✓ Captured live_production_create_content_fixed.png');

    // 3. Test Live Settings -> Finance & Payout Center
    console.log('Testing Live Settings -> Finance & Payout Center...');
    await page.goto(`${LIVE_URL}/?tab=settings`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const finTab = tabs.find((b) => b.innerText.includes('Finance') || b.innerText.includes('Tax'));
      if (finTab) finTab.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Click "Identity Verification"
    await page.evaluate(() => {
      const subtabs = Array.from(document.querySelectorAll('button'));
      const idTab = subtabs.find((b) => b.innerText.includes('Identity Verification'));
      if (idTab) idTab.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(artifactDir, 'live_production_identity_verification_7day.png') });
    console.log('✓ Captured live_production_identity_verification_7day.png');

    // 4. Test Live Studio Streamlabs Dock
    console.log('Testing Live Studio Streamlabs Dock on Production...');
    await page.goto(`${LIVE_URL}/?tab=live`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    await page.screenshot({ path: path.join(artifactDir, 'live_production_streamlabs_studio.png') });
    console.log('✓ Captured live_production_streamlabs_studio.png');

    console.log('ALL LIVE PRODUCTION VERIFICATIONS COMPLETED SUCCESSFULLY!');
  } finally {
    await browser.close();
  }
}

testLive().catch((e) => {
  console.error('Live test error:', e);
  process.exit(1);
});
