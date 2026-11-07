const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const PORT = 5174;
const BASE_URL = `http://localhost:${PORT}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('--- RECONCILIATION VISUAL CAPTURE & AUDIT ---');

  // Start Vite preview
  console.log('Starting vite preview on port', PORT);
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    shell: true,
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
  });

  await sleep(3500);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const realCreator = {
    id: 'usr-zakki-01',
    name: 'Zakki Salim Shaikh',
    email: 'zakki@creatoros.ai',
    role: 'creator',
    handle: '@zakkisalimshaikh',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    is_demo: false,
    isDemo: false,
    account_type: 'standard',
    provider: 'email',
  };

  try {
    // -------------------------------------------------------------
    // 1. PASSPORT MOBILE 320px
    // -------------------------------------------------------------
    console.log('Testing Passport Mobile 320px...');
    await page.setViewport({ width: 320, height: 680 });
    await page.goto(`${BASE_URL}/?tab=passport`, { waitUntil: 'networkidle0' });

    await page.evaluate((user) => {
      localStorage.clear();
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(user));
      localStorage.setItem('creatoros_creator_active_tab', 'passport');
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }, realCreator);

    await page.goto(`${BASE_URL}/?tab=passport`, { waitUntil: 'networkidle0' });
    await sleep(1500);

    const overflow320 = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log('320px horizontal overflow:', overflow320 ? 'FAIL' : 'PASS (Zero Overflow)');

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'passport_mobile_320.png'),
    });

    // -------------------------------------------------------------
    // 2. PASSPORT MOBILE 375px
    // -------------------------------------------------------------
    console.log('Testing Passport Mobile 375px...');
    await page.setViewport({ width: 375, height: 667 });
    await sleep(500);
    const overflow375 = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log('375px horizontal overflow:', overflow375 ? 'FAIL' : 'PASS (Zero Overflow)');

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'passport_mobile_375.png'),
    });

    // -------------------------------------------------------------
    // 3. PASSPORT MOBILE 390px
    // -------------------------------------------------------------
    console.log('Testing Passport Mobile 390px...');
    await page.setViewport({ width: 390, height: 844 });
    await sleep(500);
    const overflow390 = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log('390px horizontal overflow:', overflow390 ? 'FAIL' : 'PASS (Zero Overflow)');

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'passport_mobile_390.png'),
    });

    // -------------------------------------------------------------
    // 4. PASSPORT DESKTOP 1280px
    // -------------------------------------------------------------
    console.log('Testing Passport Desktop 1280px...');
    await page.setViewport({ width: 1280, height: 800 });
    await sleep(500);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'passport_desktop_1280.png'),
    });

    // -------------------------------------------------------------
    // 5. ANALYTICS (DARK & LIGHT)
    // -------------------------------------------------------------
    console.log('Testing Analytics Dark Mode...');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_creator_active_tab', 'analytics');
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.goto(`${BASE_URL}/?tab=analytics`, { waitUntil: 'networkidle0' });
    await sleep(1500);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'analytics_dark.png'),
    });

    console.log('Testing Analytics Light Mode...');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.goto(`${BASE_URL}/?tab=analytics`, { waitUntil: 'networkidle0' });
    await sleep(1500);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'analytics_light.png'),
    });

    // -------------------------------------------------------------
    // 6. PRO UPGRADE MODAL (DARK & LIGHT)
    // -------------------------------------------------------------
    console.log('Testing Pro Modal Dark Mode...');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.goto(`${BASE_URL}/?tab=home`, { waitUntil: 'networkidle0' });
    await sleep(1000);

    // Open User Menu in TopBar and click Upgrade
    await page.evaluate(() => {
      const avatarBtn = document.querySelector('header button[aria-label="User Profile"], header button.cursor-pointer:last-child');
      if (avatarBtn) avatarBtn.click();
    });
    await sleep(500);

    // Click Upgrade to Pro Plan button
    const openedModal = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const upgradeBtn = buttons.find((b) => b.textContent && b.textContent.includes('Upgrade to Pro'));
      if (upgradeBtn) {
        upgradeBtn.click();
        return true;
      }
      return false;
    });
    console.log('Pro modal opened in dark mode:', openedModal);
    await sleep(600);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'pro_modal_dark.png'),
    });

    console.log('Testing Pro Modal Light Mode...');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await sleep(600);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'pro_modal_light.png'),
    });

    console.log('\n✅ All forensic screenshots captured successfully!');
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await browser.close();
    previewProcess.kill();
  }
}

run();
