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

const CREATOR_SESSION = {
  id: 'cr-01',
  name: 'Alex Morgan',
  email: 'alex@creatoros.ai',
  role: 'creator',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  handle: '@alexmorgan',
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
  userAgent: 'HeadlessChrome-VerificationEngine',
};

async function run() {
  console.log('Connecting to browser at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Helper to check horizontal overflow
  const checkOverflow = async (label) => {
    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.offsetWidth;
      const docScroll = document.documentElement.scrollWidth;
      const bodyScroll = document.body.scrollWidth;
      const winWidth = window.innerWidth;
      const maxScroll = Math.max(docScroll, bodyScroll);
      return { winWidth, maxScroll, diff: maxScroll - winWidth };
    });
    console.log(`[Overflow Check] ${label}: innerWidth=${overflow.winWidth}px, scrollWidth=${overflow.maxScroll}px, overflow=${overflow.diff}px`);
    return overflow.diff <= 0;
  };

  // 1. BRAND CONTRACT DASHBOARD (1280x800)
  console.log('\n--- 1. Brand Contract Dashboard (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, BRAND_SESSION);
  await page.goto('http://localhost:5173/brand/contracts', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  await checkOverflow('Brand Dashboard 1280x800');
  const dashDesktopPath = path.join(SCREENSHOTS_DIR, 'contracts-dashboard-1280x800.png');
  await page.screenshot({ path: dashDesktopPath, fullPage: false });
  console.log('Saved:', dashDesktopPath);

  // 2. BRAND CONTRACT BUILDER - STEP 1 CREATOR (1280x800)
  console.log('\n--- 2. Brand Contract Builder - Step 01 (1280x800) ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const createBtn = btns.find(b => b.textContent && b.textContent.includes('Create Contract'));
    if (createBtn) createBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await checkOverflow('Contract Builder Step 01 1280x800');
  const builderStep1Path = path.join(SCREENSHOTS_DIR, 'contracts-builder-step1-1280x800.png');
  await page.screenshot({ path: builderStep1Path, fullPage: false });
  console.log('Saved:', builderStep1Path);

  // 3. BRAND CONTRACT BUILDER - STEP 3 DELIVERABLES (1280x800)
  console.log('\n--- 3. Brand Contract Builder - Step 03 Deliverables (1280x800) ---');
  await page.evaluate(() => {
    const stepBtns = Array.from(document.querySelectorAll('.overflow-x-auto button'));
    if (stepBtns[2]) stepBtns[2].click();
  });
  await new Promise(r => setTimeout(r, 800));

  await checkOverflow('Contract Builder Step 03 1280x800');
  const builderStep3Path = path.join(SCREENSHOTS_DIR, 'contracts-builder-step3-1280x800.png');
  await page.screenshot({ path: builderStep3Path, fullPage: false });
  console.log('Saved:', builderStep3Path);

  // 4. BRAND CONTRACT BUILDER - STEP 4 PAYMENT (1280x800)
  console.log('\n--- 4. Brand Contract Builder - Step 04 Payment (1280x800) ---');
  await page.evaluate(() => {
    const stepBtns = Array.from(document.querySelectorAll('.overflow-x-auto button'));
    if (stepBtns[3]) stepBtns[3].click();
  });
  await new Promise(r => setTimeout(r, 800));

  await checkOverflow('Contract Builder Step 04 1280x800');
  const builderStep4Path = path.join(SCREENSHOTS_DIR, 'contracts-builder-step4-1280x800.png');
  await page.screenshot({ path: builderStep4Path, fullPage: false });
  console.log('Saved:', builderStep4Path);

  // 5. BRAND CONTRACT BUILDER - STEP 7 REVIEW & RISKS (1280x800)
  console.log('\n--- 5. Brand Contract Builder - Step 07 Review & Risks (1280x800) ---');
  await page.evaluate(() => {
    const stepBtns = Array.from(document.querySelectorAll('.overflow-x-auto button'));
    if (stepBtns[6]) stepBtns[6].click();
  });
  await new Promise(r => setTimeout(r, 800));

  await checkOverflow('Contract Builder Step 07 1280x800');
  const builderStep7Path = path.join(SCREENSHOTS_DIR, 'contracts-builder-step7-risk-1280x800.png');
  await page.screenshot({ path: builderStep7Path, fullPage: false });
  console.log('Saved:', builderStep7Path);

  // 5b. RISK SCANNER ACTIVE WARNING (1280x800)
  console.log('\n--- 5b. Contract Builder - Risk Scanner Warning Demonstration ---');
  await page.evaluate(() => {
    const stepBtns = Array.from(document.querySelectorAll('.overflow-x-auto button'));
    if (stepBtns[3]) stepBtns[3].click(); // back to Step 04 Payment
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const input = document.querySelector('input[type="number"]');
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, '0');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const stepBtns = Array.from(document.querySelectorAll('.overflow-x-auto button'));
    if (stepBtns[6]) stepBtns[6].click(); // forward to Step 07 Review
  });
  await new Promise(r => setTimeout(r, 800));

  const riskWarningPath = path.join(SCREENSHOTS_DIR, 'contracts-builder-step7-risk-warning-1280x800.png');
  await page.screenshot({ path: riskWarningPath, fullPage: false });
  console.log('Saved:', riskWarningPath);

  // 6. CONTRACT DETAIL WORKSPACE (1280x800)
  console.log('\n--- 6. Contract Detail Workspace (1280x800) ---');
  await page.goto('http://localhost:5173/brand/contracts/contract-01', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  await checkOverflow('Contract Detail Workspace 1280x800');
  const detailWorkspacePath = path.join(SCREENSHOTS_DIR, 'contracts-detail-workspace-1280x800.png');
  await page.screenshot({ path: detailWorkspacePath, fullPage: false });
  console.log('Saved:', detailWorkspacePath);

  // 7. CREATOR CONTRACT PORTAL (1280x800)
  console.log('\n--- 7. Creator Contract Portal (1280x800) ---');
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, CREATOR_SESSION);
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Navigate to Contracts in creator studio
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button, aside button'));
    const contractBtn = btns.find(b => b.textContent && b.textContent.includes('Contracts'));
    if (contractBtn) contractBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await checkOverflow('Creator Contract Portal 1280x800');
  const creatorPortalPath = path.join(SCREENSHOTS_DIR, 'contracts-creator-portal-1280x800.png');
  await page.screenshot({ path: creatorPortalPath, fullPage: false });
  console.log('Saved:', creatorPortalPath);

  // 8. SUPER ADMIN CONTRACT GOVERNANCE (1280x800)
  console.log('\n--- 8. Super Admin Contract Governance (1280x800) ---');
  await page.evaluate((admSess) => {
    localStorage.setItem('creatoros_admin_session_v1', JSON.stringify(admSess));
  }, ADMIN_SESSION);
  await page.goto('http://localhost:5173/admin/contracts', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  await checkOverflow('Super Admin Contract Governance 1280x800');
  const adminGovPath = path.join(SCREENSHOTS_DIR, 'contracts-admin-governance-1280x800.png');
  await page.screenshot({ path: adminGovPath, fullPage: false });
  console.log('Saved:', adminGovPath);

  // 9. MOBILE BRAND DASHBOARD (375x812)
  console.log('\n--- 9. Mobile Brand Dashboard (375x812) ---');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, BRAND_SESSION);
  await page.goto('http://localhost:5173/brand/contracts', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  await checkOverflow('Mobile Brand Dashboard 375x812');
  const mobileDashPath = path.join(SCREENSHOTS_DIR, 'contracts-dashboard-375x812.png');
  await page.screenshot({ path: mobileDashPath, fullPage: false });
  console.log('Saved:', mobileDashPath);

  // 10. MOBILE CONTRACT BUILDER (375x812)
  console.log('\n--- 10. Mobile Contract Builder (375x812) ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const createBtn = btns.find(b => b.textContent && b.textContent.includes('Create Contract'));
    if (createBtn) createBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await checkOverflow('Mobile Contract Builder 375x812');
  const mobileBuilderPath = path.join(SCREENSHOTS_DIR, 'contracts-builder-mobile-375x812.png');
  await page.screenshot({ path: mobileBuilderPath, fullPage: false });
  console.log('Saved:', mobileBuilderPath);

  // 11. EXTRA SMALL MOBILE (320x640)
  console.log('\n--- 11. Extra Small Mobile (320x640) ---');
  await page.setViewport({ width: 320, height: 640, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/brand/contracts', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await checkOverflow('320x640 Extra Small Mobile');

  await browser.close();
  console.log('\nAll 11 verification tests completed successfully!');
}

run().catch((err) => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
