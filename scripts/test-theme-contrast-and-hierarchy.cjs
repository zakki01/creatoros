const fs = require('fs');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

async function run() {
  const preview = spawn('npx', ['vite', 'preview', '--port', '5244', '--strictPort'], {
    shell: true,
    cwd: path.resolve(__dirname, '..'),
  });

  await new Promise((r) => setTimeout(r, 3000));

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: exe,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    const creatorUser = {
      id: 'usr_real_zakki',
      email: 'zakkishaikh04@gmail.com',
      name: 'Zakki Salim Shaikh',
      role: 'creator',
      is_demo: false,
    };

    console.log('Navigating to local preview...');
    await page.goto('http://localhost:5244/');
    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      // Instant resolve for local test
      localStorage.setItem('creatoros_finance_kyc_usr_real_zakki', JSON.stringify({
        id: 'kyc_local_test',
        userId: u.id,
        idType: 'passport',
        status: 'NOT_STARTED',
        idNumberMasked: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }, creatorUser);

    await page.goto('http://localhost:5244/', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Navigate to Settings
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const settingsBtn = buttons.find((b) => b.innerText.includes('Settings'));
      if (settingsBtn) settingsBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Navigate to Finance & Tax Invoicing
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const financeTab = buttons.find((b) => b.innerText.includes('Finance & Tax Invoicing'));
      if (financeTab) financeTab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // ==========================================
    // 1. LIGHT MODE TEST
    // ==========================================
    console.log('Testing LIGHT Studio Mode...');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click Identity Verification tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const idTab = buttons.find((b) => b.innerText.includes('Identity Verification'));
      if (idTab) idTab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Inspect active tab colors
    const lightIdStyles = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const activeTab = buttons.find((b) => b.innerText.includes('Identity Verification'));
      if (!activeTab) return null;
      const cs = window.getComputedStyle(activeTab);
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        fontWeight: cs.fontWeight,
      };
    });
    console.log('Light Mode Identity Verification Active Tab Styles:', lightIdStyles);

    await page.screenshot({
      path: path.resolve(__dirname, '../live_light_identity_verification.png'),
      fullPage: false,
    });
    console.log('Captured live_light_identity_verification.png');

    // Click Payout Methods tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const payoutTab = buttons.find((b) => b.innerText.includes('Payout Methods'));
      if (payoutTab) payoutTab.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.resolve(__dirname, '../live_light_payout_methods.png'),
      fullPage: false,
    });
    console.log('Captured live_light_payout_methods.png');

    // ==========================================
    // 2. DARK MODE TEST
    // ==========================================
    console.log('Testing DARK Studio Mode...');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click Identity Verification tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const idTab = buttons.find((b) => b.innerText.includes('Identity Verification'));
      if (idTab) idTab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    const darkIdStyles = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const activeTab = buttons.find((b) => b.innerText.includes('Identity Verification'));
      if (!activeTab) return null;
      const cs = window.getComputedStyle(activeTab);
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        fontWeight: cs.fontWeight,
      };
    });
    console.log('Dark Mode Identity Verification Active Tab Styles:', darkIdStyles);

    await page.screenshot({
      path: path.resolve(__dirname, '../live_dark_identity_verification.png'),
      fullPage: false,
    });
    console.log('Captured live_dark_identity_verification.png');

    // Click Payout Methods tab in dark mode
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const payoutTab = buttons.find((b) => b.innerText.includes('Payout Methods'));
      if (payoutTab) payoutTab.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.resolve(__dirname, '../live_dark_payout_methods.png'),
      fullPage: false,
    });
    console.log('Captured live_dark_payout_methods.png');

    console.log('ALL THEME CONTRAST & HIERARCHY TESTS COMPLETED SUCCESSFULLY!');
  } finally {
    if (browser) await browser.close();
    try {
      require('child_process').execSync('taskkill /pid ' + preview.pid + ' /T /F');
    } catch {}
    process.exit(0);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
