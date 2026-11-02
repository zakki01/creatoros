const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // 1. Live Welcome Screen (Mobile 390x844)
  console.log('Capturing mobile welcome...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('https://creatoros-fawn-iota.vercel.app/', { waitUntil: 'networkidle2' });
  await sleep(1500);
  const mobileWelcomePath = path.join(artifactDir, 'live_prod_welcome_mobile_390.png');
  await page.screenshot({ path: mobileWelcomePath });

  // 2. Live Welcome Screen (Desktop 1280x800)
  console.log('Capturing desktop welcome...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://creatoros-fawn-iota.vercel.app/', { waitUntil: 'networkidle2' });
  await sleep(1500);
  const desktopWelcomePath = path.join(artifactDir, 'live_prod_welcome_desktop_1280.png');
  await page.screenshot({ path: desktopWelcomePath });

  // 3. Live Register Screen (Desktop 1280x800)
  console.log('Capturing desktop register...');
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const regBtn = buttons.find(b => b.textContent && b.textContent.includes('Register'));
    if (regBtn) {
      regBtn.click();
      return true;
    }
    return false;
  });
  if (clicked) {
    await sleep(1000);
    const registerPath = path.join(artifactDir, 'live_prod_register_desktop_1280.png');
    await page.screenshot({ path: registerPath });
    console.log('Saved register view:', registerPath);
  }

  await browser.close();
  console.log('All live captures complete!');
})();
