const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

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
  console.log('Connecting to browser at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test 1: Desktop Welcome & Social Auth (1280x800)
  console.log('\n--- Test 1: Desktop Welcome & Social Auth (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  // Clear any existing session to test public welcome page
  await page.evaluate(() => {
    localStorage.removeItem('creatoros_auth_session_v1');
    localStorage.removeItem('creatoros_admin_session_v1');
  });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const authDesktopShot = path.join(SCREENSHOTS_DIR, 'auth-welcome-1280x800.png');
  await page.screenshot({ path: authDesktopShot, fullPage: false });
  console.log('Saved:', authDesktopShot);

  // Test 2: Mobile Welcome & Social Auth (375x812)
  console.log('\n--- Test 2: Mobile Welcome & Social Auth (375x812) ---');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const authMobileShot = path.join(SCREENSHOTS_DIR, 'auth-welcome-375x812.png');
  await page.screenshot({ path: authMobileShot, fullPage: false });
  console.log('Saved:', authMobileShot);

  // Test 3: Desktop Creator Profile (1280x800)
  console.log('\n--- Test 3: Desktop Creator Profile (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, CREATOR_SESSION);
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Navigate to Profile tab
  console.log('Navigating to Profile tab...');
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button, aside button'));
    const profBtn = navBtns.find(b => b.textContent && b.textContent.includes('Profile'));
    if (profBtn) profBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const profileDesktopShot = path.join(SCREENSHOTS_DIR, 'profile-creator-1280x800.png');
  await page.screenshot({ path: profileDesktopShot, fullPage: false });
  console.log('Saved:', profileDesktopShot);

  // Test 4: Mobile Creator Profile (375x812)
  console.log('\n--- Test 4: Mobile Creator Profile (375x812) ---');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button'));
    const profBtn = navBtns.find(b => b.getAttribute('aria-label') === 'Profile' || (b.textContent && b.textContent.includes('Profile')));
    if (profBtn) profBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const profileMobileShot = path.join(SCREENSHOTS_DIR, 'profile-creator-375x812.png');
  await page.screenshot({ path: profileMobileShot, fullPage: false });
  console.log('Saved:', profileMobileShot);

  // Test 5: Brand Profile Modal (1280x800)
  console.log('\n--- Test 5: Brand Profile Modal (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  // Navigate to Discover and click brand card or trigger modal
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('aside button, nav button'));
    const discBtn = navBtns.find(b => b.textContent && b.textContent.includes('Discover'));
    if (discBtn) discBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Switch to Brands filter and click first brand
  await page.evaluate(() => {
    const filterBtns = Array.from(document.querySelectorAll('button'));
    const brandsFilter = filterBtns.find(b => b.textContent && b.textContent.trim().startsWith('Brands'));
    if (brandsFilter) brandsFilter.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click the View button on the first Brand card
  await page.evaluate(() => {
    const viewBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.trim() === 'View');
    if (viewBtns.length > 0) viewBtns[0].click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const brandModalShot = path.join(SCREENSHOTS_DIR, 'profile-brand-modal-1280x800.png');
  await page.screenshot({ path: brandModalShot, fullPage: false });
  console.log('Saved:', brandModalShot);

  await browser.close();
  console.log('Phase 7 Verification completed successfully!');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
