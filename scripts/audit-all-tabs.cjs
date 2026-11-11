const fs = require('fs');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

async function run() {
  const preview = spawn('npx', ['vite', 'preview', '--port', '5255', '--strictPort'], {
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

    console.log('Navigating to local preview for Full Tab Audit...');
    await page.goto('http://localhost:5255/');
    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
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

    await page.goto('http://localhost:5255/', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture Home in Light & Dark
    console.log('Testing Home tab...');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.resolve(__dirname, '../tab_home_light.png') });

    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.resolve(__dirname, '../tab_home_dark.png') });

    const mainTabs = [
      { id: 'opportunities', label: 'Opportunities' },
      { id: 'contracts', label: 'Contracts' },
      { id: 'campaigns', label: 'Campaigns' },
      { id: 'content', label: 'Content' },
      { id: 'discover', label: 'Discover' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'messages', label: 'Messages' },
      { id: 'profile', label: 'Profile' },
    ];

    for (const t of mainTabs) {
      console.log(`Testing Main Tab: ${t.label}...`);
      await page.evaluate((tabLabel) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const targetBtn = buttons.find((b) => b.innerText.trim().startsWith(tabLabel));
        if (targetBtn) targetBtn.click();
      }, t.label);
      await new Promise((r) => setTimeout(r, 800));

      // Light mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
      });
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({ path: path.resolve(__dirname, `../tab_${t.id}_light.png`) });

      // Dark mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
      });
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({ path: path.resolve(__dirname, `../tab_${t.id}_dark.png`) });
    }

    // Now test Settings and its sub-tabs
    console.log('Testing Settings sub-tabs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const settingsBtn = buttons.find((b) => b.innerText.trim().includes('Settings'));
      if (settingsBtn) settingsBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const settingsSubtabs = [
      { id: 'team', label: 'Team & Collaborators' },
      { id: 'governance', label: 'Content Governance' },
      { id: 'campaigns', label: 'Deal Filters & Terms' },
      { id: 'security', label: 'Security & Audit Logs' },
    ];

    for (const s of settingsSubtabs) {
      console.log(`Testing Settings Subtab: ${s.label}...`);
      await page.evaluate((subLabel) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const targetBtn = buttons.find((b) => b.innerText.includes(subLabel));
        if (targetBtn) targetBtn.click();
      }, s.label);
      await new Promise((r) => setTimeout(r, 500));

      // Light mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
      });
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({ path: path.resolve(__dirname, `../settings_${s.id}_light.png`) });

      // Dark mode
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
      });
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({ path: path.resolve(__dirname, `../settings_${s.id}_dark.png`) });
    }

    console.log('ALL TABS AUDITED AND SCREENSHOTS CAPTURED SUCCESSFULLY!');
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
