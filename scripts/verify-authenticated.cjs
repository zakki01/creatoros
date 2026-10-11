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

const BRAND_SESSION = {
  id: 'biz-001',
  name: 'Aura Streetwear Co.',
  email: 'partnerships@aurastreetwear.com',
  role: 'business',
  avatarUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
  handle: '@aurastreetwear',
  provider: 'demo',
  isDemo: true,
};

async function captureAuthenticated(viewportWidth, viewportHeight, name, session = CREATOR_SESSION) {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  // Navigate to root first to establish domain context
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  // Set session and refresh
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, session);

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  const outputPath = path.join(screenshotsDir, `${name}-${viewportWidth}x${viewportHeight}.png`);
  await page.screenshot({ path: outputPath, fullPage: false });

  await browser.close();
  return outputPath;
}

async function run() {
  console.log('Capturing Phase 3 Responsive Shell...');
  
  // 1. Mobile Smallest 320x640 (Creator)
  const p1 = await captureAuthenticated(320, 640, 'creator-mobile', CREATOR_SESSION);
  console.log(`Saved: ${p1}`);

  // 2. Mobile Standard 375x812 (Creator)
  const p2 = await captureAuthenticated(375, 812, 'creator-mobile-std', CREATOR_SESSION);
  console.log(`Saved: ${p2}`);

  // 3. Tablet Rail 768x1024 (Creator)
  const p3 = await captureAuthenticated(768, 1024, 'creator-tablet-rail', CREATOR_SESSION);
  console.log(`Saved: ${p3}`);

  // 4. Desktop 1280x800 (Creator)
  const p4 = await captureAuthenticated(1280, 800, 'creator-desktop', CREATOR_SESSION);
  console.log(`Saved: ${p4}`);

  // 5. Mobile Standard 375x812 (Brand)
  const p5 = await captureAuthenticated(375, 812, 'brand-mobile-std', BRAND_SESSION);
  console.log(`Saved: ${p5}`);

  console.log('Phase 3 captures completed successfully.');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
