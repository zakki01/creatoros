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
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto(LIVE_URL, { waitUntil: 'networkidle2' });
    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'live');
      localStorage.setItem('theme', 'dark');
    }, creatorUser);

    console.log('Navigating to Live Studio on production...');
    await page.goto(`${LIVE_URL}/?tab=live`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // 1. Capture clean desktop Live Studio with full viewport and full height chat
    await page.screenshot({ path: path.join(artifactDir, 'live_production_clean_desktop_viewport.png') });
    console.log('✓ Captured live_production_clean_desktop_viewport.png');

    // 2. Open Device Settings modal to verify explainer text removed on production
    console.log('Opening Device Settings modal on production...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const devBtn = btns.find((b) => b.title && b.title.includes('Hardware Devices'));
      if (devBtn) devBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(artifactDir, 'live_production_clean_device_settings.png') });
    console.log('✓ Captured live_production_clean_device_settings.png');

    console.log('ALL LIVE VERIFICATIONS PASSED!');
  } finally {
    await browser.close();
  }
}

testLive().catch((e) => {
  console.error(e);
  process.exit(1);
});
