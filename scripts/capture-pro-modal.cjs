const puppeteer = require('puppeteer-core');
const path = require('path');
const { spawn } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const PORT = 5174;
const BASE_URL = `http://localhost:${PORT}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('--- CAPTURING PRO MODAL SCREENS ---');

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
  await page.setViewport({ width: 1280, height: 800 });

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
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    await page.evaluate((user) => {
      localStorage.clear();
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(user));
      localStorage.setItem('creatoros_creator_active_tab', 'home');
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    }, realCreator);

    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(1500);

    // Click profile menu trigger
    const clickedTrigger = await page.evaluate(() => {
      const trigger = document.querySelector('div[aria-label="Open user profile menu"]');
      if (trigger) {
        trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        return true;
      }
      return false;
    });
    console.log('Clicked user profile popover trigger:', clickedTrigger);
    await sleep(600);

    // Click Upgrade to Pro Plan button
    const clickedUpgrade = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const upgradeBtn = btns.find((b) => b.textContent && b.textContent.includes('Upgrade to Pro'));
      if (upgradeBtn) {
        upgradeBtn.click();
        return true;
      }
      return false;
    });
    console.log('Clicked Upgrade to Pro button:', clickedUpgrade);
    await sleep(800);

    console.log('Taking pro_modal_dark.png...');
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'pro_modal_dark.png'),
    });

    console.log('Switching to light mode...');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await sleep(500);

    console.log('Taking pro_modal_light.png...');
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'pro_modal_light.png'),
    });

    console.log('Done capturing Pro Modal!');
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await browser.close();
    previewProcess.kill();
  }
}

run();
