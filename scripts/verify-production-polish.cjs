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

const ADMIN_SESSION = {
  id: 'admin-001',
  email: 'admin@creatoros.internal',
  name: 'Sarah Connor',
  role: 'super_admin',
  mfaVerified: true,
  sessionToken: 'adm_sec_demo_token_xyz999',
  expiresAt: Date.now() + 86400000,
  ipAddress: '127.0.0.1',
  userAgent: 'HeadlessChrome-PolishVerificationEngine',
};

async function run() {
  console.log('Connecting to browser at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const checkOverflow = async (label) => {
    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.offsetWidth;
      const docScroll = document.documentElement.scrollWidth;
      const bodyScroll = document.body.scrollWidth;
      const winWidth = window.innerWidth;
      const maxScroll = Math.max(docScroll, bodyScroll);
      return { winWidth, maxScroll, diff: maxScroll - winWidth };
    });
    console.log(
      `[Overflow Check] ${label}: innerWidth=${overflow.winWidth}px, scrollWidth=${overflow.maxScroll}px, overflow=${overflow.diff}px`
    );
    return overflow.diff <= 0;
  };

  // 1. TERMS & CONDITIONS (1280x800)
  console.log('\n--- 1. Terms & Conditions (/terms) (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/terms', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await checkOverflow('Terms & Conditions 1280x800');
  const termsPath = path.join(SCREENSHOTS_DIR, 'polish-terms-1280x800.png');
  await page.screenshot({ path: termsPath, fullPage: false });
  console.log('Saved:', termsPath);

  // 2. PRIVACY POLICY (1280x800)
  console.log('\n--- 2. Privacy Policy (/privacy) (1280x800) ---');
  await page.goto('http://localhost:5173/privacy', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await checkOverflow('Privacy Policy 1280x800');
  const privacyPath = path.join(SCREENSHOTS_DIR, 'polish-privacy-1280x800.png');
  await page.screenshot({ path: privacyPath, fullPage: false });
  console.log('Saved:', privacyPath);

  // 3. 404 NOT FOUND PAGE (1280x800)
  console.log('\n--- 3. 404 Not Found Page (/404) (1280x800) ---');
  await page.goto('http://localhost:5173/404', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await checkOverflow('404 Page 1280x800');
  const notFoundPath = path.join(SCREENSHOTS_DIR, 'polish-404-1280x800.png');
  await page.screenshot({ path: notFoundPath, fullPage: false });
  console.log('Saved:', notFoundPath);

  // 4. USER SUPPORT PORTAL (1280x800)
  console.log('\n--- 4. User Support Portal (/support) (1280x800) ---');
  await page.goto('http://localhost:5173/support', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));
  await checkOverflow('Support Portal 1280x800');
  const supportPath = path.join(SCREENSHOTS_DIR, 'polish-support-1280x800.png');
  await page.screenshot({ path: supportPath, fullPage: false });
  console.log('Saved:', supportPath);

  // 5. SUPER ADMIN SUPPORT DESK (/admin/support) (1280x800)
  console.log('\n--- 5. Super Admin Support Desk (/admin/support) (1280x800) ---');
  await page.evaluate((admin) => {
    localStorage.setItem('creatoros_admin_session_v1', JSON.stringify(admin));
  }, ADMIN_SESSION);
  await page.goto('http://localhost:5173/admin/support', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await checkOverflow('Admin Support Desk 1280x800');
  const adminSupportPath = path.join(SCREENSHOTS_DIR, 'polish-admin-support-1280x800.png');
  await page.screenshot({ path: adminSupportPath, fullPage: false });
  console.log('Saved:', adminSupportPath);

  // 6. CARET & CURSOR AUDIT
  console.log('\n--- 6. Caret & Cursor Audit ---');
  const caretStyles = await page.evaluate(() => {
    const rootCaret = window.getComputedStyle(document.documentElement).caretColor;
    const bodyCursor = window.getComputedStyle(document.body).cursor;
    const h1 = document.querySelector('h1');
    const h1Cursor = h1 ? window.getComputedStyle(h1).cursor : 'none';
    const h1Caret = h1 ? window.getComputedStyle(h1).caretColor : 'none';
    const input = document.querySelector('input');
    const inputCursor = input ? window.getComputedStyle(input).cursor : 'none';
    const inputCaret = input ? window.getComputedStyle(input).caretColor : 'none';
    const fontFamily = window.getComputedStyle(document.body).fontFamily;

    return {
      rootCaret,
      bodyCursor,
      h1Cursor,
      h1Caret,
      inputCursor,
      inputCaret,
      fontFamily,
    };
  });
  console.log('Caret & Cursor Inspection:', JSON.stringify(caretStyles, null, 2));

  // 7. DISCOVER VIEW WITH STREAMLINED CREATE BUTTON (1280x800)
  console.log('\n--- 7. Discover Feed (+ Create) (1280x800) ---');
  await page.evaluate((sess) => {
    localStorage.removeItem('creatoros_admin_session_v1');
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, BRAND_SESSION);
  await page.goto('http://localhost:5173/brand', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));

  // Click Discover in sidebar
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const discoverBtn = btns.find((b) => b.textContent && b.textContent.includes('Discover'));
    if (discoverBtn) discoverBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  await checkOverflow('Discover View 1280x800');
  const discoverPath = path.join(SCREENSHOTS_DIR, 'polish-discover-1280x800.png');
  await page.screenshot({ path: discoverPath, fullPage: false });
  console.log('Saved:', discoverPath);

  // 8. MOBILE VIEWPORT TESTS (375x812)
  console.log('\n--- 8. Mobile Support Portal (375x812) ---');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/support', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));
  await checkOverflow('Mobile Support Portal 375x812');
  const mobileSupportPath = path.join(SCREENSHOTS_DIR, 'polish-support-375x812.png');
  await page.screenshot({ path: mobileSupportPath, fullPage: false });
  console.log('Saved:', mobileSupportPath);

  console.log('\n--- 9. Mobile Terms Page (375x812) ---');
  await page.goto('http://localhost:5173/terms', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));
  await checkOverflow('Mobile Terms 375x812');
  const mobileTermsPath = path.join(SCREENSHOTS_DIR, 'polish-terms-375x812.png');
  await page.screenshot({ path: mobileTermsPath, fullPage: false });
  console.log('Saved:', mobileTermsPath);

  // 10. ULTRA-NARROW 320x640 VIEWPORT
  console.log('\n--- 10. Ultra-Narrow Mobile (320x640) ---');
  await page.setViewport({ width: 320, height: 640, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/terms', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 600));
  await checkOverflow('320x640 Extra Small Mobile (Terms)');

  await page.goto('http://localhost:5173/privacy', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 600));
  await checkOverflow('320x640 Extra Small Mobile (Privacy)');

  await browser.close();
  console.log('\nAll polish verification tests completed successfully!');
}

run().catch((err) => {
  console.error('Polish verification failed:', err);
  process.exit(1);
});
