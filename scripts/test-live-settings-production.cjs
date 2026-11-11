const fs = require('fs');
const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

async function run() {
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

    console.log('Navigating to https://creatoros-fawn-iota.vercel.app ...');
    await page.goto('https://creatoros-fawn-iota.vercel.app/');
    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
    }, creatorUser);

    await page.goto('https://creatoros-fawn-iota.vercel.app/', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // Click on Settings in the left sidebar
    console.log('Clicking on Settings in sidebar...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const settingsBtn = buttons.find((b) => b.innerText.includes('Settings'));
      if (settingsBtn) settingsBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Check Team & Collaborators text
    const teamText = await page.evaluate(() => document.body.innerText);
    console.log('LIVE Production - Contains Karan Varma:', teamText.includes('Karan Varma'));
    console.log('LIVE Production - Contains Tanvi Shah:', teamText.includes('Tanvi Shah'));
    console.log('LIVE Production - Contains Zakki Salim Shaikh:', teamText.includes('Zakki Salim Shaikh'));

    // Capture screenshot of Team tab
    await page.screenshot({ path: path.resolve(__dirname, '../live_prod_settings_team.png'), fullPage: true });
    console.log('Captured live_prod_settings_team.png');

    // Click on Finance & Tax Invoicing tab
    console.log('Clicking on Finance & Tax Invoicing tab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const finBtn = buttons.find((b) => b.innerText.includes('Finance & Tax Invoicing'));
      if (finBtn) finBtn.click();
    });
    await new Promise((r) => setTimeout(r, 2000));

    const financeText = await page.evaluate(() => document.body.innerText);
    console.log('LIVE Production - Contains HDFC Bank ••••• 4921 fake card:', financeText.includes('HDFC Bank ••••• 4921'));
    console.log('LIVE Production - Contains rohan@okhdfcbank:', financeText.includes('rohan@okhdfcbank'));
    console.log('LIVE Production - Contains Finance & Payout Center:', financeText.includes('Finance & Payout Center') || financeText.includes('Legal Payout Identity'));
    console.log('LIVE Production - Contains Add Payout Method:', financeText.includes('Add Payout Method') || financeText.includes('Legal Payout Identity'));

    // Capture screenshot of Finance tab
    await page.screenshot({ path: path.resolve(__dirname, '../live_prod_settings_finance.png'), fullPage: true });
    console.log('Captured live_prod_settings_finance.png');
  } finally {
    if (browser) await browser.close();
  }
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
