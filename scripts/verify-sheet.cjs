const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5173/#design-system', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Click Open BottomSheet
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Open BottomSheet'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 600));
  const outputPath = path.join(__dirname, '..', 'screenshots', 'ds-bottomsheet-mobile-375x812.png');
  await page.screenshot({ path: outputPath });
  await browser.close();
  console.log(`Saved BottomSheet screenshot to: ${outputPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
