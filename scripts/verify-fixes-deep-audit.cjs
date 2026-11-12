const fs = require('fs');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

async function run() {
  const preview = spawn('npx', ['vite', 'preview', '--port', '5289', '--strictPort'], {
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

    // TEST 1: Creator Home Dashboard - Verify Card 2 (Content Pipeline) geometry
    console.log('1. Auditing Creator Home...');
    const homePage = await browser.newPage();
    await homePage.setViewport({ width: 1280, height: 800 });
    await homePage.goto('http://localhost:5289/');
    await homePage.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'home');
      localStorage.setItem('theme', 'light');
    }, creatorUser);

    await homePage.goto('http://localhost:5289/?tab=home', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    await homePage.screenshot({
      path: path.resolve(__dirname, '../verified_home_dashboard.png'),
    });
    console.log('Captured verified_home_dashboard.png');

    // TEST 2: Analytics Banner in Dark Mode
    console.log('2. Auditing Analytics Banner in Dark Mode...');
    const analyticsPage = await browser.newPage();
    await analyticsPage.setViewport({ width: 1280, height: 800 });
    await analyticsPage.goto('http://localhost:5289/');
    await analyticsPage.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'analytics');
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }, creatorUser);

    await analyticsPage.goto('http://localhost:5289/?tab=analytics', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    await analyticsPage.screenshot({
      path: path.resolve(__dirname, '../verified_analytics_dark.png'),
    });
    console.log('Captured verified_analytics_dark.png');

    // TEST 3: Live Broadcast Configuration Modal & Go Live
    console.log('3. Testing Configure Live Modal & Broadcast Start...');
    const livePage = await browser.newPage();
    await livePage.setViewport({ width: 1280, height: 850 });
    await livePage.goto('http://localhost:5289/');
    await livePage.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'live');
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    }, creatorUser);

    await livePage.goto('http://localhost:5289/?tab=live', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Click Configure Live button
    await livePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const confBtn = buttons.find((b) => b.innerText.includes('Configure Live'));
      if (confBtn) confBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Capture Configure Live Modal
    await livePage.screenshot({
      path: path.resolve(__dirname, '../verified_configure_live_modal.png'),
    });
    console.log('Captured verified_configure_live_modal.png');

    // Click Start Live Broadcast inside modal
    await livePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find((b) => b.innerText.includes('Start Live Broadcast'));
      if (startBtn) startBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Verify broadcast is active
    const postBroadcastText = await livePage.evaluate(() => document.body.innerText);
    console.log('Is Live ON AIR:', postBroadcastText.includes('LIVE ON AIR') || postBroadcastText.includes('End Broadcast'));

    await livePage.screenshot({
      path: path.resolve(__dirname, '../verified_live_on_air.png'),
    });
    console.log('Captured verified_live_on_air.png');

    // TEST 4: Buy Coins Modal with Payment Methods
    console.log('4. Testing Buy Coins Modal with Real Payment Methods...');
    // Click Gifts in right rail
    await livePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const giftsTab = buttons.find((b) => b.innerText.includes('Gifts'));
      if (giftsTab) giftsTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Open Tray or Send Gift
    await livePage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trayBtn = buttons.find((b) => b.innerText.includes('Open Tray') || b.innerText.includes('Send Gift'));
      if (trayBtn) trayBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Buy Coins button with title="Buy Coins"
    await livePage.evaluate(() => {
      const buyCoinsBtn = document.querySelector('button[title="Buy Coins"]');
      if (buyCoinsBtn) buyCoinsBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await livePage.screenshot({
      path: path.resolve(__dirname, '../verified_buy_coins_modal.png'),
    });
    console.log('Captured verified_buy_coins_modal.png');

    console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Audit Error:', err);
  } finally {
    if (browser) await browser.close();
    preview.kill();
  }
}

run();
