const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'very-small-mobile', width: 320, height: 640, deviceScaleFactor: 2 },
  { name: 'standard-mobile', width: 375, height: 812, deviceScaleFactor: 2 },
  { name: 'modern-iphone', width: 390, height: 844, deviceScaleFactor: 2 },
  { name: 'large-mobile', width: 430, height: 932, deviceScaleFactor: 2 },
  { name: 'tablet-portrait', width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: 'tablet-landscape', width: 1024, height: 768, deviceScaleFactor: 1 },
  { name: 'small-laptop', width: 1280, height: 800, deviceScaleFactor: 1 },
  { name: 'standard-desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'full-hd-desktop', width: 1920, height: 1080, deviceScaleFactor: 1 },
];

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
  const results = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.deviceScaleFactor || 1,
    });

    // Ensure session is set
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await page.evaluate((sess) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
    }, CREATOR_SESSION);

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));

    // Navigate to Discover tab
    await page.evaluate(() => {
      const navBtns = Array.from(document.querySelectorAll('aside nav button, nav button'));
      const discBtn = navBtns.find(b =>
        b.getAttribute('aria-label') === 'Discover' ||
        (b.textContent && b.textContent.includes('Discover'))
      );
      if (discBtn) discBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Audit Horizontal Overflow
    const overflowData = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const bodyWidth = document.body.scrollWidth;
      const winWidth = window.innerWidth;
      const hasOverflow = docWidth > winWidth + 1 || bodyWidth > winWidth + 1;
      return { docWidth, bodyWidth, winWidth, hasOverflow };
    });

    // Audit Touch Target sizes on mobile viewports (<768px)
    let minTargetAudit = { passed: true, underSizedCount: 0 };
    if (vp.width < 768) {
      minTargetAudit = await page.evaluate(() => {
        const interactiveElements = Array.from(document.querySelectorAll('nav button, header button'));
        let underSizedCount = 0;
        interactiveElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            // Check if either dimension is significantly below 40px
            if (rect.width < 38 || rect.height < 38) {
              underSizedCount++;
            }
          }
        });
        return { passed: underSizedCount === 0, underSizedCount };
      });
    }

    // Capture screenshot
    const shotPath = path.join(SCREENSHOTS_DIR, `phase9-discover-${vp.width}x${vp.height}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });

    console.log(`Screenshot saved: ${shotPath}`);
    console.log(`Horizontal Overflow Check: ${overflowData.hasOverflow ? 'FAILED' : 'PASSED'} (Doc: ${overflowData.docWidth}px, Win: ${overflowData.winWidth}px)`);
    if (vp.width < 768) {
      console.log(`Touch Target Audit (<768px): ${minTargetAudit.passed ? 'PASSED' : 'FLAGGED'} (Undersized: ${minTargetAudit.underSizedCount})`);
    }

    results.push({
      viewport: `${vp.width}x${vp.height}`,
      name: vp.name,
      overflowPassed: !overflowData.hasOverflow,
      touchAuditPassed: minTargetAudit.passed,
      screenshot: shotPath,
    });
  }

  await browser.close();
  console.log('\n========================================');
  console.log('PHASE 9 MULTI-BREAKPOINT AUDIT COMPLETED');
  console.log('========================================');
  console.table(results.map(r => ({
    Viewport: r.viewport,
    Name: r.name,
    'No Overflow': r.overflowPassed ? 'YES' : 'NO',
    'Touch Target': r.touchAuditPassed ? 'YES' : 'NO',
  })));
}

run().catch(err => {
  console.error('Phase 9 Verification failed:', err);
  process.exit(1);
});
