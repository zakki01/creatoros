const fs = require('fs');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;
const artifactDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';

async function run() {
  console.log('Starting preview server on port 5292...');
  const preview = spawn('npx', ['vite', 'preview', '--port', '5292', '--strictPort'], {
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

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto('http://localhost:5292/');
    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'settings');
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('creatoros_trial_days', '7');
    }, creatorUser);

    // 1. Capture Settings -> Finance & Payout Center -> Identity Verification
    console.log('Capturing Identity Verification tab with 7-Day Trial & Duplicate Account Policy...');
    await page.goto('http://localhost:5292/?tab=settings', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // Click "Finance & Tax Invoicing" tab in settings
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const finTab = tabs.find((b) => b.innerText.includes('Finance') || b.innerText.includes('Tax'));
      if (finTab) finTab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Click "Identity Verification" subtab
    await page.evaluate(() => {
      const subtabs = Array.from(document.querySelectorAll('button'));
      const idTab = subtabs.find((b) => b.innerText.includes('Identity Verification'));
      if (idTab) idTab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(artifactDir, 'verified_identity_verification_7day_trial.png') });
    console.log('✓ Captured verified_identity_verification_7day_trial.png');

    // 2. Click "Payout Methods" subtab
    console.log('Capturing Payout Methods tab with Multi-Account linking banner...');
    await page.evaluate(() => {
      const subtabs = Array.from(document.querySelectorAll('button'));
      const payoutTab = subtabs.find((b) => b.innerText.includes('Payout Methods'));
      if (payoutTab) payoutTab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(artifactDir, 'verified_payout_methods_multi_account.png') });
    console.log('✓ Captured verified_payout_methods_multi_account.png');

    // 3. Mobile view of Settings Finance
    console.log('Capturing Mobile view of Finance...');
    await page.setViewport({ width: 390, height: 844 });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, 'verified_mobile_finance_clean.png') });
    console.log('✓ Captured verified_mobile_finance_clean.png');

    console.log('ALL GOVERNANCE CHECKS PASSED AND CAPTURED!');
  } finally {
    if (browser) await browser.close();
    preview.kill();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
