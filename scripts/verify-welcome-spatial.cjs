const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');

const VIEWPORTS = [
  { name: '320x640', width: 320, height: 640 },
  { name: '375x812', width: 375, height: 812 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

async function run() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    
    // Clear any previous session so we test public Welcome page
    await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 600));

    // Verify no horizontal overflow
    const overflowX = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    console.log(`  [${vp.name}] Horizontal overflow: ${overflowX ? 'FAIL' : 'PASS'}`);

    // Capture above-the-fold
    const foldPath = path.join(SCREENSHOTS_DIR, `welcome-spatial-${vp.name}-fold.png`);
    await page.screenshot({ path: foldPath, fullPage: false });

    // Test subtle scroll-driven motion (scroll by 300px)
    await page.evaluate(() => window.scrollTo(0, 300));
    await new Promise((r) => setTimeout(r, 400));
    const scrolledPath = path.join(SCREENSHOTS_DIR, `welcome-spatial-${vp.name}-scrolled.png`);
    await page.screenshot({ path: scrolledPath, fullPage: false });

    // Scroll to bottom and capture full page for key desktop/mobile breakpoints
    if (['375x812', '1440x900'].includes(vp.name)) {
      const fullPath = path.join(SCREENSHOTS_DIR, `welcome-spatial-${vp.name}-full.png`);
      await page.screenshot({ path: fullPath, fullPage: true });
    }
  }

  await browser.close();
  console.log('All responsive viewport tests completed successfully!');
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
