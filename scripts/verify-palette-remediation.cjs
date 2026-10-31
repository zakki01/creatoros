const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const BASE_URL = 'http://localhost:5173';

function rgbToHex(rgb) {
  if (!rgb) return '';
  if (rgb.startsWith('#')) return rgb.toUpperCase();
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

async function runPaletteVerification() {
  console.log('🚀 Running Palette Remediation Verification Suite on:', BASE_URL);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const checks = [];

  try {
    // ------------------------------------------------------------------------
    // TEST 1: LIGHT THEME PALETTE VERIFICATION
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 1: Light Theme Palette ---');
    await page.goto(`${BASE_URL}?role=business&demo=true`, { waitUntil: 'networkidle2', timeout: 30000 });

    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    const lightStyles = await page.evaluate(() => {
      const docEl = document.documentElement;
      const computed = window.getComputedStyle(docEl);
      const bg = computed.getPropertyValue('--background').trim();
      const primary = computed.getPropertyValue('--primary').trim();
      const accent = computed.getPropertyValue('--accent').trim();

      const bodyBg = window.getComputedStyle(document.body).backgroundColor;

      const btn = document.querySelector('.depth-btn-primary, button.bg-\\[var\\(--primary\\)\\]');
      const btnBg = btn ? window.getComputedStyle(btn).backgroundColor : null;

      return { bg, primary, accent, bodyBg, btnBg };
    });

    console.log('Light Theme Computed Tokens:', lightStyles);

    const lightBgHex = rgbToHex(lightStyles.bg || lightStyles.bodyBg);
    const lightPrimaryHex = rgbToHex(lightStyles.primary || lightStyles.btnBg);
    const lightAccentHex = rgbToHex(lightStyles.accent);

    console.log(`Light Canvas Background: ${lightBgHex} (Expected: #F0F0F0)`);
    console.log(`Light Primary: ${lightPrimaryHex} (Expected: #105BFF)`);
    console.log(`Light Accent: ${lightAccentHex} (Expected: #FF77BC)`);

    const lightScreenshot = path.join(ARTIFACT_DIR, 'verify_new_palette_light_brand.png');
    await page.screenshot({ path: lightScreenshot });
    console.log('Saved screenshot:', lightScreenshot);

    checks.push({
      test: 'Light Theme Canvas is #F0F0F0',
      pass: lightBgHex === '#F0F0F0' || rgbToHex(lightStyles.bodyBg) === '#F0F0F0'
    });
    checks.push({
      test: 'Light Theme Primary is #105BFF',
      pass: lightPrimaryHex === '#105BFF'
    });
    checks.push({
      test: 'Light Theme Accent is #FF77BC',
      pass: lightAccentHex === '#FF77BC'
    });

    // ------------------------------------------------------------------------
    // TEST 2: DARK THEME PALETTE VERIFICATION
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 2: Dark Theme Palette ---');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    const darkStyles = await page.evaluate(() => {
      const docEl = document.documentElement;
      const computed = window.getComputedStyle(docEl);
      const bg = computed.getPropertyValue('--background').trim();
      const primary = computed.getPropertyValue('--primary').trim();
      const accent = computed.getPropertyValue('--accent').trim();

      const bodyBg = window.getComputedStyle(document.body).backgroundColor;

      const btn = document.querySelector('.depth-btn-primary, button.bg-\\[var\\(--primary\\)\\]');
      const btnBg = btn ? window.getComputedStyle(btn).backgroundColor : null;

      return { bg, primary, accent, bodyBg, btnBg };
    });

    console.log('Dark Theme Computed Tokens:', darkStyles);

    const darkBgHex = rgbToHex(darkStyles.bg || darkStyles.bodyBg);
    const darkPrimaryHex = rgbToHex(darkStyles.primary || darkStyles.btnBg);
    const darkAccentHex = rgbToHex(darkStyles.accent);

    console.log(`Dark Canvas Background: ${darkBgHex} (Expected: #02070A)`);
    console.log(`Dark Primary: ${darkPrimaryHex} (Expected: #0297DE)`);
    console.log(`Dark Accent: ${darkAccentHex} (Expected: #FC734D)`);

    const darkBrandScreenshot = path.join(ARTIFACT_DIR, 'verify_new_palette_dark_brand.png');
    await page.screenshot({ path: darkBrandScreenshot });
    console.log('Saved screenshot:', darkBrandScreenshot);

    checks.push({
      test: 'Dark Theme Canvas is #02070A',
      pass: darkBgHex === '#02070A' || rgbToHex(darkStyles.bodyBg) === '#02070A'
    });
    checks.push({
      test: 'Dark Theme Primary is #0297DE',
      pass: darkPrimaryHex === '#0297DE'
    });
    checks.push({
      test: 'Dark Theme Accent is #FC734D',
      pass: darkAccentHex === '#FC734D'
    });

    // ------------------------------------------------------------------------
    // TEST 3: CREATOR WORKSPACE IN DARK MODE
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 3: Creator Workspace Dark Mode ---');
    await page.goto(`${BASE_URL}?role=creator&demo=true`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    const creatorDarkScreenshot = path.join(ARTIFACT_DIR, 'verify_new_palette_dark_creator.png');
    await page.screenshot({ path: creatorDarkScreenshot });
    console.log('Saved screenshot:', creatorDarkScreenshot);

    // ------------------------------------------------------------------------
    // TEST 4: CREATOR WORKSPACE IN LIGHT MODE
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 4: Creator Workspace Light Mode ---');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    const creatorLightScreenshot = path.join(ARTIFACT_DIR, 'verify_new_palette_light_creator.png');
    await page.screenshot({ path: creatorLightScreenshot });
    console.log('Saved screenshot:', creatorLightScreenshot);

    console.log('\n=============================================');
    console.log('PALETTE REMEDIATION TEST RESULTS:');
    let allPassed = true;
    for (const c of checks) {
      console.log(`[${c.pass ? 'PASS' : 'FAIL'}] ${c.test}`);
      if (!c.pass) allPassed = false;
    }
    console.log('=============================================\n');

    if (!allPassed) {
      process.exit(1);
    }

  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPaletteVerification();
