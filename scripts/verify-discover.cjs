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

  // 1. Mobile Discover Feed (375x812)
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, CREATOR_SESSION);
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Click Discover in Bottom Nav
  await page.evaluate(() => {
    const navButtons = Array.from(document.querySelectorAll('nav[aria-label="Mobile Bottom Navigation"] button'));
    const discoverBtn = navButtons.find(b => b.textContent && b.textContent.includes('Discover'));
    if (discoverBtn) discoverBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const pMobile = path.join(screenshotsDir, 'discover-feed-375x812.png');
  await page.screenshot({ path: pMobile });
  console.log(`Saved: ${pMobile}`);

  // 2. Open "+ Create Post" Modal on Mobile
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const createBtn = buttons.find(b => b.textContent && b.textContent.includes('+ Create Post'));
    if (createBtn) createBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const pModal = path.join(screenshotsDir, 'discover-create-modal-375x812.png');
  await page.screenshot({ path: pModal });
  console.log(`Saved: ${pModal}`);

  // Close modal
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // 3. Desktop Discover Feed (1280x800)
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

  const pDesktop = path.join(screenshotsDir, 'discover-feed-1280x800.png');
  await desktopPage.screenshot({ path: pDesktop });
  console.log(`Saved: ${pDesktop}`);

  // 4. Open Detail View (Click 'more' on first post)
  await desktopPage.evaluate(() => {
    const moreBtns = Array.from(document.querySelectorAll('button'));
    const moreBtn = moreBtns.find(b => b.textContent && b.textContent.trim() === 'more');
    if (moreBtn) moreBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const pDetail = path.join(screenshotsDir, 'discover-detail-modal-1280x800.png');
  await desktopPage.screenshot({ path: pDetail });
  console.log(`Saved: ${pDetail}`);

  await browser.close();
  console.log('Phase 4 verification completed successfully.');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
