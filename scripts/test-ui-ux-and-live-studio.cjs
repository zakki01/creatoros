const fs = require('fs');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

async function run() {
  const preview = spawn('npx', ['vite', 'preview', '--port', '5288', '--strictPort'], {
    shell: true,
    cwd: path.resolve(__dirname, '..'),
  });

  await new Promise((r) => setTimeout(r, 2500));

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: exe,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const creatorUser = {
      id: 'usr_real_zakki',
      email: 'zakkishaikh04@gmail.com',
      name: 'Zakki Salim Shaikh',
      role: 'creator',
      is_demo: false,
    };

    // TEST 1: Mobile Viewport (390 x 844 iPhone 14)
    console.log('Testing Mobile Viewport (390x844)...');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    await mobilePage.goto('http://localhost:5288/');
    await mobilePage.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
    }, creatorUser);

    await mobilePage.goto('http://localhost:5288/', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Open Apps Drawer
    console.log('Mobile: Opening Apps Drawer...');
    await mobilePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const appsBtn = buttons.find((b) => b.innerText.includes('Apps'));
      if (appsBtn) appsBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Settings inside Apps Drawer
    await mobilePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const settingsBtn = buttons.find((b) => b.innerText.includes('Settings'));
      if (settingsBtn) settingsBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Click on Finance & Tax Invoicing tab in Settings
    await mobilePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const finBtn = buttons.find((b) => b.innerText.includes('Finance & Tax Invoicing'));
      if (finBtn) finBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await mobilePage.screenshot({
      path: path.resolve(__dirname, '../live_mobile_settings_finance_verified.png'),
      fullPage: false,
    });
    console.log('Captured live_mobile_settings_finance_verified.png');

    // TEST 2: Desktop Live Studio (1280 x 850 Desktop)
    console.log('Testing Desktop Live Studio (1280x850)...');
    const livePage = await browser.newPage();
    await livePage.setViewport({ width: 1280, height: 850 });

    await livePage.goto('http://localhost:5288/');
    await livePage.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'live');
    }, creatorUser);

    await livePage.goto('http://localhost:5288/?tab=live', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2500));

    // Check Live Studio text
    const liveText = await livePage.evaluate(() => document.body.innerText);
    console.log('Live Studio text includes "LIVE TRANSPORT UNAVAILABLE":', liveText.includes('LIVE TRANSPORT UNAVAILABLE'));
    console.log('Live Studio text includes "Camera Error":', liveText.includes('Camera Error'));
    console.log('Live Studio text includes "Virtual Studio Feed":', liveText.includes('Virtual Studio Feed'));
    console.log('Live Studio text includes "STUDIO PREVIEW":', liveText.includes('STUDIO PREVIEW'));

    await livePage.screenshot({
      path: path.resolve(__dirname, '../live_studio_verified.png'),
      fullPage: false,
    });
    console.log('Captured live_studio_verified.png');
  } finally {
    if (browser) await browser.close();
    preview.kill();
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
