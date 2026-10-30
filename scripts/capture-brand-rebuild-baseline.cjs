const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const BASE_URL = 'http://localhost:5173';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // 1. Brand Demo Desktop Dark
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.clear();
    const demoBrand = {
      id: 'demo-brand-01',
      name: 'CreatorOS Demo Brand',
      email: 'demo.brand@creatoros.ai',
      role: 'business',
      handle: '@demobrand',
      is_demo: true,
      account_type: 'demo',
      provider: 'demo',
    };
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(demoBrand));
    localStorage.setItem('creatoros_theme_v1', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'baseline_brand_desktop_dark.png') });
  console.log('Saved baseline_brand_desktop_dark.png');

  // 2. Brand Demo Desktop Light
  await page.evaluate(() => {
    localStorage.setItem('creatoros_theme_v1', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'baseline_brand_desktop_light.png') });
  console.log('Saved baseline_brand_desktop_light.png');

  // 3. Brand Demo Mobile Dark (390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluate(() => {
    localStorage.setItem('creatoros_theme_v1', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'baseline_brand_mobile_dark.png') });
  console.log('Saved baseline_brand_mobile_dark.png');

  // 4. First-time Brand User (Empty State) Desktop Dark
  await page.setViewport({ width: 1280, height: 800 });
  await page.evaluate(() => {
    localStorage.clear();
    const newBrand = {
      id: 'brand-new-991',
      name: 'Acme Studio Co.',
      email: 'founder@acmestudio.com',
      role: 'business',
      handle: '@acmestudio',
      is_demo: false,
      account_type: 'standard',
      provider: 'email',
    };
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(newBrand));
    localStorage.setItem('creatoros_theme_v1', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'baseline_brand_first_time_dark.png') });
  console.log('Saved baseline_brand_first_time_dark.png');

  await browser.close();
  console.log('Baseline captures complete.');
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
