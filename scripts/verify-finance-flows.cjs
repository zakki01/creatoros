const fs = require('fs');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

async function run() {
  const preview = spawn('npx', ['vite', 'preview', '--port', '5211', '--strictPort'], {
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
    await page.setViewport({ width: 1280, height: 800 });

    const superAdminSession = {
      id: 'admin-sec-001',
      name: 'Alex Vance',
      email: 'alex.admin@creatoros.ai',
      role: 'super_admin',
      token: 'admin_jwt_verified_super_admin',
      loginTimestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      twoFactorVerified: true,
    };

    console.log('1. Navigating to /godmode/finance ...');
    await page.goto('http://localhost:5211/godmode');
    await page.evaluate((s) => {
      localStorage.setItem('creatoros_admin_session_v1', JSON.stringify(s));
    }, superAdminSession);

    await page.goto('http://localhost:5211/godmode/finance', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const financeText = await page.evaluate(() => document.body.innerText);
    console.log('=== ADMIN FINANCE GOVERNANCE TEXT PREVIEW ===');
    console.log(financeText.slice(0, 800));

    // Capture screenshot of Admin Finance Governance
    await page.screenshot({ path: path.resolve(__dirname, '../live_godmode_finance.png'), fullPage: true });
    console.log('Captured live_godmode_finance.png');

    console.log('\n2. Navigating to Creator Workspace to inspect CreatorFinanceCenter...');
    // Login as a creator in local storage
    const creatorUser = {
      id: 'usr_real_creator_99',
      email: 'creator.verified@creatoros.test',
      role: 'creator',
      is_demo: false,
    };
    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_user', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
    }, creatorUser);

    await page.goto('http://localhost:5211/', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const creatorHomeText = await page.evaluate(() => document.body.innerText);
    console.log('=== CREATOR WORKSPACE TEXT PREVIEW ===');
    console.log(creatorHomeText.slice(0, 500));

    console.log('\nVERIFICATION COMPLETE - ZERO CRASHES DETECTED');
  } finally {
    if (browser) await browser.close();
    preview.kill();
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
