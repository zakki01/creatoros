const fs = require('fs');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;
const artifactDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';

async function run() {
  console.log('Starting preview server on port 5294...');
  const preview = spawn('npx', ['vite', 'preview', '--port', '5294', '--strictPort'], {
    shell: true,
    cwd: path.resolve(__dirname, '..'),
  });

  await new Promise((r) => setTimeout(r, 2500));

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: exe,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
    });

    const creatorUser = {
      id: 'usr_real_zakki',
      email: 'zakkishaikh04@gmail.com',
      name: 'Zakki Salim Shaikh',
      role: 'creator',
      is_demo: false,
    };

    const page = await browser.newPage();
    // Mobile viewport: 390 x 844 (iPhone 14 / modern smartphone)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:5294/');
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

    // 1. Initial mobile studio screen
    const path1 = path.join(artifactDir, 'verified_mobile_live_no_preview_badge.png');
    await page.screenshot({ path: path1 });
    console.log('Saved screenshot 1 to', path1);

    // 2. Click the Heart reaction button multiple times
    const heartBtn = await page.$('button[aria-label="Send Heart Reaction"]');
    if (heartBtn) {
      console.log('Found Heart Reaction button! Clicking to trigger hearts...');
      await heartBtn.click();
      await page.waitForTimeout ? page.waitForTimeout(100) : new Promise((r) => setTimeout(r, 100));
      await heartBtn.click();
      await page.waitForTimeout ? page.waitForTimeout(100) : new Promise((r) => setTimeout(r, 100));
      await heartBtn.click();
      await new Promise((r) => setTimeout(r, 350));

      const path2 = path.join(artifactDir, 'verified_mobile_live_floating_hearts.png');
      await page.screenshot({ path: path2 });
      console.log('Saved screenshot 2 with floating hearts to', path2);
    } else {
      console.error('Heart button not found on page!');
    }

    // 3. Also check font computed family
    const fontInfo = await page.evaluate(() => {
      const body = document.body;
      const comp = window.getComputedStyle(body);
      return {
        fontFamily: comp.fontFamily,
      };
    });
    console.log('Computed body font-family:', fontInfo.fontFamily);

  } finally {
    if (browser) await browser.close();
    preview.kill();
    try {
      process.kill(-preview.pid);
    } catch (e) {}
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
