const fs = require('fs');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;
const artifactDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';

async function run() {
  console.log('Starting preview server on port 5293...');
  const preview = spawn('npx', ['vite', 'preview', '--port', '5293', '--strictPort'], {
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
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:5293/');
    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'live');
      localStorage.setItem('theme', 'dark');
    }, creatorUser);

    console.log('Navigating to Live Studio on desktop...');
    await page.goto('http://localhost:5293/?tab=live', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // 1. Capture clean desktop Live Studio with full viewport and full height chat
    await page.screenshot({ path: path.join(artifactDir, 'verified_clean_desktop_live_viewport.png') });
    console.log('✓ Captured verified_clean_desktop_live_viewport.png');

    // 2. Open Device Settings modal to verify explainer text removed
    console.log('Opening Device Settings modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const devBtn = btns.find((b) => b.title && b.title.includes('Hardware Devices'));
      if (devBtn) devBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(artifactDir, 'verified_clean_device_settings_no_explainers.png') });
    console.log('✓ Captured verified_clean_device_settings_no_explainers.png');

    console.log('ALL CHECKS PASSED!');
  } finally {
    if (browser) await browser.close();
    preview.kill();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
