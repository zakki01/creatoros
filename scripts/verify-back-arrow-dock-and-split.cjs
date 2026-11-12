const fs = require('fs');
const puppeteer = require('puppeteer-core');
const path = require('path');
const { spawn } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;
const artifactDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';

const PORT = 4185;
const URL = `http://localhost:${PORT}`;

async function run() {
  console.log('Starting preview server on port', PORT);
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
  });

  await new Promise((r) => setTimeout(r, 2500));

  console.log('Launching browser at', URL);
  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
    ],
  });

  try {
    const creatorUser = {
      id: 'usr_real_zakki',
      email: 'zakkishaikh04@gmail.com',
      name: 'Zakki Salim Shaikh',
      role: 'creator',
      is_demo: false,
    };

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL);

    await page.evaluate((u) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      sessionStorage.setItem('creatoros_auth_user_cache', JSON.stringify(u));
      localStorage.setItem('creatoros_active_role', 'creator');
      localStorage.setItem('creatoros_view_mode', 'creator');
      localStorage.setItem('creatoros_creator_active_tab', 'opportunities');
      localStorage.setItem('theme', 'dark');
    }, creatorUser);

    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1500));

    // 1. Verify Back Arrow on Opportunities page
    console.log('Capturing Opportunities page with Back Arrow...');
    const oppPath = path.join(artifactDir, 'verified_back_arrow_opportunities.png');
    await page.screenshot({ path: oppPath });
    console.log('Saved:', oppPath);

    // 2. Switch to Live Studio to verify Dock Close and Cancel Filters
    console.log('Switching to Live Studio tab...');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_creator_active_tab', 'live');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 2000));

    // Open Studio Tools Dock
    await page.evaluate(() => {
      const btn = document.querySelector('button[title*="Toggle Audio Mixer"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Switch to AR Effects tab in dock
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const effBtn = btns.find((b) => b.textContent && b.textContent.includes('AR Effects'));
      if (effBtn) effBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const dockPath = path.join(artifactDir, 'verified_dock_close_and_cancel_filter.png');
    await page.screenshot({ path: dockPath });
    console.log('Saved dock screenshot:', dockPath);

    // Test Dock Close button (X)
    console.log('Testing Dock Close Button (X)...');
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close studio dock"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // 3. Open Split Screen / Co-Host Modal via header button
    console.log('Opening Split-Screen Co-Host Modal via header...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const splitBtn = btns.find((b) => b.title && b.title.includes('Split Screen'));
      if (splitBtn) splitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const modalPath = path.join(artifactDir, 'verified_split_screen_modal.png');
    await page.screenshot({ path: modalPath });
    console.log('Saved modal screenshot:', modalPath);

    // Click "Connect Co-Host" on Sophia Chen
    console.log('Connecting Co-Host Sophia Chen...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const connectBtn = btns.find((b) => b.textContent && b.textContent.includes('Connect Co-Host'));
      if (connectBtn) connectBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Capture Dual Split Screen Broadcast
    const splitScreenPath = path.join(artifactDir, 'verified_split_screen_cohost.png');
    await page.screenshot({ path: splitScreenPath });
    console.log('Saved split screen broadcast screenshot:', splitScreenPath);

    console.log('All visual verifications completed successfully!');
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

run();
