const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const CREATOR_SESSION = {
  id: 'cr-101',
  name: 'Rohan Sharma',
  email: 'rohan.sharma@creatoros.ai',
  role: 'creator',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  handle: '@rohansharma_style',
  provider: 'demo',
  isDemo: true,
};

async function run() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  // 1. Mobile Comments Sheet (375x812)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 812 });
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await mobilePage.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, CREATOR_SESSION);
  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Click Discover in Bottom Nav
  await mobilePage.evaluate(() => {
    const navButtons = Array.from(document.querySelectorAll('nav[aria-label="Mobile Bottom Navigation"] button'));
    const discoverBtn = navButtons.find(b => b.textContent && b.textContent.includes('Discover'));
    if (discoverBtn) discoverBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click comment button on first post
  await mobilePage.evaluate(() => {
    const commentBtn = document.querySelector('button[aria-label="View comments"]');
    if (commentBtn) commentBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const pMobile = path.join(screenshotsDir, 'comments-mobile-sheet-375x812.png');
  await mobilePage.screenshot({ path: pMobile });
  console.log(`Saved: ${pMobile}`);

  // 2. Desktop Comments Panel (1280x800)
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1280, height: 800 });
  await desktopPage.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await desktopPage.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, CREATOR_SESSION);
  await desktopPage.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Click Discover in desktop sidebar
  await desktopPage.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    const discoverBtn = buttons.find(b => b.textContent && b.textContent.includes('Discover'));
    if (discoverBtn) discoverBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click comment button on first post
  await desktopPage.evaluate(() => {
    const commentBtn = document.querySelector('button[aria-label="View comments"]');
    if (commentBtn) commentBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const pDesktop = path.join(screenshotsDir, 'comments-desktop-panel-1280x800.png');
  await desktopPage.screenshot({ path: pDesktop });
  console.log(`Saved: ${pDesktop}`);

  await browser.close();
  console.log('Phase 5 comments verification completed successfully.');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
