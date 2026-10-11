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

const SUPER_ADMIN_SESSION = {
  id: 'admin-sec-001',
  name: 'Alex Vance',
  email: 'alex.admin@creatoros.ai',
  role: 'super_admin',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  token: 'admin_jwt_verified_super_admin',
  loginTimestamp: Date.now(),
  expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  twoFactorVerified: true,
};

async function run() {
  console.log('Connecting to browser at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  // Test 1: Dedicated Admin Login Page (/admin/login)
  console.log('\n--- Test 1: Dedicated Admin Login Page (/admin/login) ---');
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.removeItem('creatoros_auth_session_v1');
    localStorage.removeItem('creatoros_admin_session_v1');
  });
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const adminLoginShot = path.join(SCREENSHOTS_DIR, 'admin-login-1280x800.png');
  await page.screenshot({ path: adminLoginShot, fullPage: false });
  console.log('Saved:', adminLoginShot);

  // Test 2: Access Denied (403 Forbidden) for Non-Admin visiting /admin
  console.log('\n--- Test 2: Access Denied (403) for Creator visiting /admin ---');
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
    localStorage.removeItem('creatoros_admin_session_v1');
  }, CREATOR_SESSION);
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const accessDeniedShot = path.join(SCREENSHOTS_DIR, 'admin-access-denied-1280x800.png');
  await page.screenshot({ path: accessDeniedShot, fullPage: false });
  console.log('Saved:', accessDeniedShot);

  // Test 3: Super Admin Command Center Dashboard
  console.log('\n--- Test 3: Super Admin Command Center Dashboard ---');
  await page.evaluate((adminSess) => {
    localStorage.setItem('creatoros_admin_session_v1', JSON.stringify(adminSess));
  }, SUPER_ADMIN_SESSION);
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const adminDashboardShot = path.join(SCREENSHOTS_DIR, 'admin-dashboard-1280x800.png');
  await page.screenshot({ path: adminDashboardShot, fullPage: false });
  console.log('Saved:', adminDashboardShot);

  // Test 4: Super Admin Content Moderation Queue
  console.log('\n--- Test 4: Super Admin Content Moderation Queue ---');
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('aside nav button'));
    const modBtn = navBtns.find(b => b.textContent && b.textContent.includes('Content Moderation'));
    if (modBtn) modBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const adminModShot = path.join(SCREENSHOTS_DIR, 'admin-moderation-1280x800.png');
  await page.screenshot({ path: adminModShot, fullPage: false });
  console.log('Saved:', adminModShot);

  await browser.close();
  console.log('Phase 8 Verification completed successfully!');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
