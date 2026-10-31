const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const BASE_URL = 'https://creatoros-fawn-iota.vercel.app';

async function runLiveAudit() {
  console.log('🚀 Running Live Production Vercel Audit on:', BASE_URL);
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const results = [];

  try {
    // 1. BRAND WORKSPACE - DARK MODE
    console.log('\n--- 1. Testing Live Brand Workspace in Dark Mode ---');
    await page.goto(`${BASE_URL}?role=business&demo=true`, { waitUntil: 'networkidle2', timeout: 35000 });
    
    // Set theme
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    
    const brandDarkScreenshot = path.join(ARTIFACT_DIR, 'verify_live_prod_brand_dark.png');
    await page.screenshot({ path: brandDarkScreenshot, fullPage: false });
    console.log('📸 Captured Live Brand Dark Screenshot:', brandDarkScreenshot);

    // Inspect white cards on live production
    const whiteCardElements = await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div, section, article, main'));
      return allDivs.filter(el => {
        const bg = window.getComputedStyle(el).backgroundColor;
        const rect = el.getBoundingClientRect();
        return (bg === 'rgb(255, 255, 255)' || bg === '#ffffff') && rect.width > 120 && rect.height > 60;
      }).map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.innerText ? el.innerText.slice(0, 40) : ''
      }));
    });
    
    console.log('Live Brand Dark - Detected Solid White Cards (>120x60):', whiteCardElements.length);
    if (whiteCardElements.length > 0) {
      console.log('Details:', JSON.stringify(whiteCardElements.slice(0, 5), null, 2));
    }
    results.push({ check: 'Live Brand Dark Mode - Zero White Cards', pass: whiteCardElements.length === 0, count: whiteCardElements.length });

    // 2. BRAND VIEWING CREATOR PROFILE MODAL & ACTION MATRIX
    console.log('\n--- 2. Testing Live Creator Profile Modal & Role Action Matrix ---');
    // Navigate to Discover or trigger creator view
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const disc = buttons.find(b => b.innerText && b.innerText.toLowerCase().includes('discover'));
      if (disc) disc.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // Try finding creator card to click
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div, article, button'));
      const creatorCard = cards.find(c => c.innerText && (c.innerText.includes('Rohan') || c.innerText.includes('Aanya') || c.innerText.includes('View Profile')));
      if (creatorCard) creatorCard.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    const creatorModalScreenshot = path.join(ARTIFACT_DIR, 'verify_live_prod_brand_creator_profile_modal.png');
    await page.screenshot({ path: creatorModalScreenshot, fullPage: false });
    console.log('📸 Captured Live Creator Profile Modal Screenshot:', creatorModalScreenshot);

    const hasCreateContractBtn = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      return allButtons.some(b => b.innerText && b.innerText.toLowerCase().includes('create contract'));
    });
    console.log('Live Brand viewing Creator - Has Create Contract Button:', hasCreateContractBtn);
    results.push({ check: 'Live Creator Profile - No Create Contract Button (Role Action Matrix)', pass: !hasCreateContractBtn });

    // 3. CREATOR WORKSPACE - DARK & LIGHT MODE
    console.log('\n--- 3. Testing Live Creator Workspace ---');
    await page.goto(`${BASE_URL}?role=creator&demo=true`, { waitUntil: 'networkidle2', timeout: 35000 });
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const creatorDarkScreenshot = path.join(ARTIFACT_DIR, 'verify_live_prod_creator_dark.png');
    await page.screenshot({ path: creatorDarkScreenshot, fullPage: false });
    console.log('📸 Captured Live Creator Dark Screenshot:', creatorDarkScreenshot);

    const creatorDarkWhiteCards = await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div, section, article, main'));
      return allDivs.filter(el => {
        const bg = window.getComputedStyle(el).backgroundColor;
        const rect = el.getBoundingClientRect();
        return (bg === 'rgb(255, 255, 255)' || bg === '#ffffff') && rect.width > 120 && rect.height > 60;
      }).length;
    });
    results.push({ check: 'Live Creator Dark Mode - Zero White Cards', pass: creatorDarkWhiteCards === 0, count: creatorDarkWhiteCards });

    // Switch to Light Mode
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'light');
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const creatorLightScreenshot = path.join(ARTIFACT_DIR, 'verify_live_prod_creator_light.png');
    await page.screenshot({ path: creatorLightScreenshot, fullPage: false });
    console.log('📸 Captured Live Creator Light Screenshot:', creatorLightScreenshot);

    // 4. SUPER ADMIN WORKSPACE - DARK MODE
    console.log('\n--- 4. Testing Live Super Admin Workspace ---');
    await page.goto(`${BASE_URL}?role=admin&demo=true`, { waitUntil: 'networkidle2', timeout: 35000 });
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    const adminDarkScreenshot = path.join(ARTIFACT_DIR, 'verify_live_prod_admin_dark.png');
    await page.screenshot({ path: adminDarkScreenshot, fullPage: false });
    console.log('📸 Captured Live Admin Dark Screenshot:', adminDarkScreenshot);

    const adminWhiteCards = await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div, section, article, main'));
      return allDivs.filter(el => {
        const bg = window.getComputedStyle(el).backgroundColor;
        const rect = el.getBoundingClientRect();
        return (bg === 'rgb(255, 255, 255)' || bg === '#ffffff') && rect.width > 120 && rect.height > 60;
      }).length;
    });
    console.log('Live Admin Dark - Detected Solid White Cards (>120x60):', adminWhiteCards);
    results.push({ check: 'Live Admin Dark Mode - Zero White Cards', pass: adminWhiteCards === 0, count: adminWhiteCards });

    console.log('\n========================================');
    console.log('FINAL LIVE AUDIT VERIFICATION SUMMARY:');
    let allPassed = true;
    results.forEach(r => {
      console.log(`[${r.pass ? 'PASS' : 'FAIL'}] ${r.check}`);
      if (!r.pass) allPassed = false;
    });
    console.log('========================================\n');

    if (!allPassed) {
      process.exit(1);
    }

  } catch (err) {
    console.error('Audit failed with error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runLiveAudit();
