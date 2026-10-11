const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureBreakpoint(viewportWidth, viewportHeight, name, url = 'http://localhost:5173/') {
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

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  const outputPath = path.join(screenshotsDir, `${name}-${viewportWidth}x${viewportHeight}.png`);
  await page.screenshot({ path: outputPath, fullPage: false });

  await browser.close();
  return { outputPath, errors };
}

if (require.main === module) {
  const width = parseInt(process.argv[2] || '375');
  const height = parseInt(process.argv[3] || '812');
  const name = process.argv[4] || 'app';
  captureBreakpoint(width, height, name)
    .then(res => {
      console.log(`Screenshot saved to: ${res.outputPath}`);
      if (res.errors.length) {
        console.log(`Console errors (${res.errors.length}):`, res.errors);
      } else {
        console.log('No console errors detected.');
      }
    })
    .catch(err => {
      console.error('Error during capture:', err);
      process.exit(1);
    });
}

module.exports = { captureBreakpoint };
