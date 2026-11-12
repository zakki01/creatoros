const fs = require('fs');
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;
const artifactDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';

const LIVE_URL = 'https://creatoros-fawn-iota.vercel.app';

async function run() {
  console.log('Testing LIVE Production URL:', LIVE_URL);

  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
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
    // Test Mobile Viewport
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(LIVE_URL);
    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'live');
      localStorage.setItem('theme', 'dark');
    }, creatorUser);

    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 2000));

    // Capture mobile live studio
    const mobilePath = path.join(artifactDir, 'live_production_mobile_live_heart.png');
    await page.screenshot({ path: mobilePath });
    console.log('Saved production mobile screenshot to', mobilePath);

    // Click heart reaction
    const heartBtn = await page.$('button[aria-label="Send Heart Reaction"]');
    if (heartBtn) {
      console.log('Found Heart Reaction button on production! Clicking...');
      await heartBtn.click();
      await new Promise((r) => setTimeout(r, 100));
      await heartBtn.click();
      await new Promise((r) => setTimeout(r, 350));
      const heartAnimPath = path.join(artifactDir, 'live_production_mobile_floating_hearts.png');
      await page.screenshot({ path: heartAnimPath });
      console.log('Saved production mobile floating hearts screenshot to', heartAnimPath);
    } else {
      console.log('Heart button not found yet — Vercel Git build may still be deploying.');
    }

    // Inspect font family on production
    const fontInfo = await page.evaluate(() => {
      const comp = window.getComputedStyle(document.body);
      return comp.fontFamily;
    });
    console.log('Production body font-family:', fontInfo);

  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
