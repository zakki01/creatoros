const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');

const BRAND_SESSION = {
  id: 'biz-101',
  name: 'Aura Streetwear Co.',
  email: 'partnerships@aurastreetwear.com',
  role: 'business',
  avatarUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
  provider: 'demo',
  isDemo: true,
};

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Live Brand Workspace (1280x800)
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, BRAND_SESSION);
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));

  // Navigate to Messages
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button, aside button'));
    const msgBtn = navBtns.find((b) => b.textContent && b.textContent.includes('Messages'));
    if (msgBtn) msgBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  const liveMessagesPath = path.join(SCREENSHOTS_DIR, 'live-direct-messages-1280x800.png');
  await page.screenshot({ path: liveMessagesPath, fullPage: false });
  console.log('Saved live messages screenshot:', liveMessagesPath);

  // 2. Live Mobile Messages (375x812)
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 800));

  // Click active conversation on mobile
  await page.evaluate(() => {
    const convButtons = Array.from(document.querySelectorAll('div.overflow-y-auto button'));
    if (convButtons.length > 0) convButtons[0].click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const liveMobilePath = path.join(SCREENSHOTS_DIR, 'live-mobile-chat-375x812.png');
  await page.screenshot({ path: liveMobilePath, fullPage: false });
  console.log('Saved live mobile screenshot:', liveMobilePath);

  await browser.close();
  console.log('Live capture completed!');
}

run().catch((err) => {
  console.error('Live capture error:', err);
  process.exit(1);
});
