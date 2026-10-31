const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const PROD_URL = 'https://creatoros-fawn-iota.vercel.app';

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

async function verifyLiveProduction() {
  console.log('🚀 Running Live Vercel Production Verification Suite on:', PROD_URL);

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
    // TEST 1: LIVE PROD BRAND IN DARK MODE
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 1: Live Prod Brand Workspace in Dark Mode ---');
    await page.goto(`${PROD_URL}?role=business&demo=true`, { waitUntil: 'networkidle2', timeout: 35000 });

    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const darkData = await page.evaluate(() => {
      const docEl = document.documentElement;
      const computed = window.getComputedStyle(docEl);
      const bg = computed.getPropertyValue('--background').trim();
      const primary = computed.getPropertyValue('--primary').trim();
      const accent = computed.getPropertyValue('--accent').trim();
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;

      // Check cards background
      const metricCards = Array.from(document.querySelectorAll('.spatial-card, [class*="rounded-"], div')).filter(el => {
        const text = el.innerText || '';
        return text.includes('ACTIVE CAMPAIGNS') || text.includes('CREATORS IN ROSTER') || text.includes('BUDGET / SPEND');
      });

      const cardBgs = metricCards.map(c => window.getComputedStyle(c).backgroundColor);

      // Check primary button background
      const primaryBtn = document.querySelector('.depth-btn-primary, button.bg-\\[var\\(--primary\\)\\]');
      const primaryBtnBg = primaryBtn ? window.getComputedStyle(primaryBtn).backgroundColor : null;

      return { bg, primary, accent, bodyBg, cardBgs, primaryBtnBg };
    });

    console.log('Dark Mode Tokens & Computed Styles:', darkData);

    const darkBgHex = rgbToHex(darkData.bg || darkData.bodyBg);
    const darkPrimaryHex = rgbToHex(darkData.primary || darkData.primaryBtnBg);
    const darkAccentHex = rgbToHex(darkData.accent);

    console.log(`Live Dark Canvas: ${darkBgHex} (Expected: #02070A)`);
    console.log(`Live Dark Primary: ${darkPrimaryHex} (Expected: #0297DE)`);
    console.log(`Live Dark Accent: ${darkAccentHex} (Expected: #FC734D)`);

    const hasWhiteCards = darkData.cardBgs.some(bg => bg === 'rgb(255, 255, 255)' || bg === '#FFFFFF');
    console.log('Any stark white card detected in Dark Mode:', hasWhiteCards);

    const brandDarkScreenshot = path.join(ARTIFACT_DIR, 'live_prod_brand_dark.png');
    await page.screenshot({ path: brandDarkScreenshot });
    console.log('Saved screenshot:', brandDarkScreenshot);

    checks.push({
      test: 'Live Dark Canvas Background is #02070A',
      pass: darkBgHex === '#02070A' || rgbToHex(darkData.bodyBg) === '#02070A'
    });
    checks.push({
      test: 'Live Dark Primary is #0297DE',
      pass: darkPrimaryHex === '#0297DE'
    });
    checks.push({
      test: 'Live Dark Accent is #FC734D',
      pass: darkAccentHex === '#FC734D'
    });
    checks.push({
      test: 'No stark white cards in Dark Mode',
      pass: !hasWhiteCards
    });

    // ------------------------------------------------------------------------
    // TEST 2: LIVE PROD BRAND IN LIGHT MODE
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 2: Live Prod Brand Workspace in Light Mode ---');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const lightData = await page.evaluate(() => {
      const docEl = document.documentElement;
      const computed = window.getComputedStyle(docEl);
      const bg = computed.getPropertyValue('--background').trim();
      const primary = computed.getPropertyValue('--primary').trim();
      const accent = computed.getPropertyValue('--accent').trim();
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;

      const primaryBtn = document.querySelector('.depth-btn-primary, button.bg-\\[var\\(--primary\\)\\]');
      const primaryBtnBg = primaryBtn ? window.getComputedStyle(primaryBtn).backgroundColor : null;

      return { bg, primary, accent, bodyBg, primaryBtnBg };
    });

    const lightBgHex = rgbToHex(lightData.bg || lightData.bodyBg);
    const lightPrimaryHex = rgbToHex(lightData.primary || lightData.primaryBtnBg);
    const lightAccentHex = rgbToHex(lightData.accent);

    console.log(`Live Light Canvas: ${lightBgHex} (Expected: #F0F0F0)`);
    console.log(`Live Light Primary: ${lightPrimaryHex} (Expected: #105BFF)`);
    console.log(`Live Light Accent: ${lightAccentHex} (Expected: #FF77BC)`);

    const brandLightScreenshot = path.join(ARTIFACT_DIR, 'live_prod_brand_light.png');
    await page.screenshot({ path: brandLightScreenshot });
    console.log('Saved screenshot:', brandLightScreenshot);

    checks.push({
      test: 'Live Light Canvas Background is #F0F0F0',
      pass: lightBgHex === '#F0F0F0' || rgbToHex(lightData.bodyBg) === '#F0F0F0'
    });
    checks.push({
      test: 'Live Light Primary is #105BFF',
      pass: lightPrimaryHex === '#105BFF'
    });
    checks.push({
      test: 'Live Light Accent is #FF77BC',
      pass: lightAccentHex === '#FF77BC'
    });

    // ------------------------------------------------------------------------
    // TEST 3: LIVE PROD CREATOR STUDIO IN LIGHT MODE (Check Submit Work, Open Studio)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 3: Live Prod Creator Studio in Light Mode ---');
    await page.goto(`${PROD_URL}?role=creator&demo=true`, { waitUntil: 'networkidle2', timeout: 35000 });
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const creatorLightData = await page.evaluate(() => {
      // Find "Open Studio", "Submit Work", "Review" buttons
      const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.innerText.trim(),
        bg: window.getComputedStyle(b).backgroundColor,
        color: window.getComputedStyle(b).color
      }));
      return buttons;
    });

    const submitWorkBtn = creatorLightData.find(b => b.text.includes('Submit Work'));
    const openStudioBtn = creatorLightData.find(b => b.text.includes('Open Studio'));

    console.log('Submit Work button:', submitWorkBtn);
    console.log('Open Studio button:', openStudioBtn);

    const submitWorkBgHex = submitWorkBtn ? rgbToHex(submitWorkBtn.bg) : '';
    const openStudioBgHex = openStudioBtn ? rgbToHex(openStudioBtn.bg) : '';

    console.log(`Submit Work Bg: ${submitWorkBgHex}`);
    console.log(`Open Studio Bg: ${openStudioBgHex}`);

    const creatorLightScreenshot = path.join(ARTIFACT_DIR, 'live_prod_creator_light.png');
    await page.screenshot({ path: creatorLightScreenshot });
    console.log('Saved screenshot:', creatorLightScreenshot);

    checks.push({
      test: 'Creator Studio Buttons do not use legacy cyan #00869B or #007E93',
      pass: submitWorkBgHex !== '#00869B' && submitWorkBgHex !== '#007E93' && openStudioBgHex !== '#00869B' && openStudioBgHex !== '#007E93'
    });

    // ------------------------------------------------------------------------
    // TEST 4: LIVE PROD CREATOR STUDIO IN DARK MODE
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 4: Live Prod Creator Studio in Dark Mode ---');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const creatorDarkScreenshot = path.join(ARTIFACT_DIR, 'live_prod_creator_dark.png');
    await page.screenshot({ path: creatorDarkScreenshot });
    console.log('Saved screenshot:', creatorDarkScreenshot);

    // Summary
    console.log('\n=============================================');
    console.log('LIVE VERCEL PRODUCTION VERIFICATION RESULTS:');
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

verifyLiveProduction();
