const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const BASE_URL = 'http://localhost:5173';

async function runAudit() {
  console.log('🚀 Starting Full-System Forensic Audit Verification Suite...');
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  const results = {
    brandDarkModeWhiteCards: 0,
    creatorProfileCreateContractPresent: false,
    creatorDarkModeWhiteCards: 0,
    modalsWhiteSurfaces: 0,
    adminDarkModeWhiteCards: 0,
    checksPassed: 0,
    checksTotal: 0
  };

  try {
    // -------------------------------------------------------------
    // TEST 1: BRAND WORKSPACE IN DARK MODE (ACTIVE & FIRST-TIME)
    // -------------------------------------------------------------
    console.log('\n--- TEST 1: Brand Workspace in Dark Mode ---');
    await page.goto(`${BASE_URL}?role=business&demo=true`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Ensure dark theme is active
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('creatoros_theme', 'dark');
    });
    await new Promise(r => setTimeout(r, 1000));

    // Check for any cards or elements with background rgb(255, 255, 255)
    const whiteCardsBrand = await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div, section, article, main'));
      const offending = allDivs.filter(el => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        // Check for noticeable card-sized elements (> 100px width/height)
        if (rect.width > 120 && rect.height > 60) {
          const bg = style.backgroundColor;
          return bg === 'rgb(255, 255, 255)' || bg === 'rgba(255, 255, 255, 1)';
        }
        return false;
      });
      return offending.length;
    });

    results.brandDarkModeWhiteCards = whiteCardsBrand;
    results.checksTotal++;
    if (whiteCardsBrand === 0) results.checksPassed++;
    console.log(`Brand Dark Mode White Cards (>120x60px): ${whiteCardsBrand} (Expected: 0)`);

    const brandDarkScreenshot = path.join(ARTIFACT_DIR, 'verify_audit_brand_dark.png');
    await page.screenshot({ path: brandDarkScreenshot });
    console.log(`Saved screenshot: ${brandDarkScreenshot}`);

    // -------------------------------------------------------------
    // TEST 2: ROLE ACTION MATRIX (BRAND VIEWING CREATOR PROFILE)
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: Role Action Matrix on Creator Profile ---');
    // Click on Discover tab
    const discoverBtn = await page.$('button[data-tab="discover"], a[href*="discover"]');
    if (discoverBtn) {
      await discoverBtn.click();
    } else {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const d = btns.find(b => b.textContent && b.textContent.includes('Discover'));
        if (d) d.click();
      });
    }
    await new Promise(r => setTimeout(r, 1500));

    // Click on a creator card to open CreatorProfile modal
    const creatorCardClicked = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-creator-id], .creator-card, .group'));
      const target = cards.find(c => c.textContent && (c.textContent.includes('Rohan') || c.textContent.includes('Aanya') || c.textContent.includes('Followers')));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    await new Promise(r => setTimeout(r, 1500));

    // Verify modal has opened and check for "Create Contract" button
    const hasCreateContract = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.some(b => b.textContent && b.textContent.toLowerCase().includes('create contract'));
    });

    results.creatorProfileCreateContractPresent = hasCreateContract;
    results.checksTotal++;
    if (!hasCreateContract) results.checksPassed++;
    console.log(`Role Matrix: Brand viewing creator has "Create Contract" button: ${hasCreateContract} (Expected: false)`);

    const modalWhiteBg = await page.evaluate(() => {
      const modalBodies = Array.from(document.querySelectorAll('.fixed [role="dialog"], .fixed .rounded-2xl, .fixed .rounded-3xl'));
      return modalBodies.filter(el => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.width > 200 && rect.height > 200) {
          const bg = style.backgroundColor;
          return bg === 'rgb(255, 255, 255)' || bg === 'rgba(255, 255, 255, 1)';
        }
        return false;
      }).length;
    });

    results.checksTotal++;
    if (modalWhiteBg === 0) results.checksPassed++;
    console.log(`Creator Profile Modal has white background in dark mode: ${modalWhiteBg} (Expected: 0)`);

    const creatorModalScreenshot = path.join(ARTIFACT_DIR, 'verify_audit_brand_creator_profile_modal.png');
    await page.screenshot({ path: creatorModalScreenshot });
    console.log(`Saved screenshot: ${creatorModalScreenshot}`);

    // Close any open modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));

    // -------------------------------------------------------------
    // TEST 3: CREATOR WORKSPACE IN DARK MODE & LIGHT MODE
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: Creator Workspace in Dark Mode & Light Mode ---');
    await page.goto(`${BASE_URL}?role=creator&demo=true`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Ensure dark theme is active
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('creatoros_theme', 'dark');
    });
    await new Promise(r => setTimeout(r, 1000));

    const whiteCardsCreatorDark = await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div, section, article, main'));
      const offending = allDivs.filter(el => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.width > 120 && rect.height > 60) {
          const bg = style.backgroundColor;
          return bg === 'rgb(255, 255, 255)' || bg === 'rgba(255, 255, 255, 1)';
        }
        return false;
      });
      return offending.length;
    });

    results.creatorDarkModeWhiteCards = whiteCardsCreatorDark;
    results.checksTotal++;
    if (whiteCardsCreatorDark === 0) results.checksPassed++;
    console.log(`Creator Home Dark Mode White Cards: ${whiteCardsCreatorDark} (Expected: 0)`);

    const creatorDarkScreenshot = path.join(ARTIFACT_DIR, 'verify_audit_creator_home_dark.png');
    await page.screenshot({ path: creatorDarkScreenshot });
    console.log(`Saved screenshot: ${creatorDarkScreenshot}`);

    // Switch to Light Mode
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      localStorage.setItem('creatoros_theme', 'light');
    });
    await new Promise(r => setTimeout(r, 1000));

    const creatorLightScreenshot = path.join(ARTIFACT_DIR, 'verify_audit_creator_home_light.png');
    await page.screenshot({ path: creatorLightScreenshot });
    console.log(`Saved screenshot: ${creatorLightScreenshot}`);

    // -------------------------------------------------------------
    // TEST 4: MODALS AUDIT IN DARK MODE (Showcase / My Posts / Comments)
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Modals Audit in Dark Mode ---');
    // Switch back to Dark Mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });
    await new Promise(r => setTimeout(r, 500));

    // Open Command Palette via Ctrl+K or button
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyK');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 1000));

    const commandPaletteBg = await page.evaluate(() => {
      const palette = document.querySelector('[role="combobox"], [placeholder*="Search"], input[placeholder*="Type a command"]');
      if (palette) {
        const modalContainer = palette.closest('.fixed');
        if (modalContainer) {
          const inner = modalContainer.querySelector('.rounded-2xl, .rounded-xl');
          if (inner) {
            return window.getComputedStyle(inner).backgroundColor;
          }
        }
      }
      return 'not_found';
    });
    console.log(`Command Palette container background in Dark Mode: ${commandPaletteBg}`);

    const modalsScreenshot = path.join(ARTIFACT_DIR, 'verify_audit_modals_dark.png');
    await page.screenshot({ path: modalsScreenshot });
    console.log(`Saved screenshot: ${modalsScreenshot}`);

    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));

    // -------------------------------------------------------------
    // TEST 5: ADMIN WORKSPACE AUDIT IN DARK MODE
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Super Admin Workspace in Dark Mode ---');
    await page.goto(`${BASE_URL}?role=admin&demo=true`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });
    await new Promise(r => setTimeout(r, 1000));

    const whiteCardsAdmin = await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div, section, article, main'));
      const offending = allDivs.filter(el => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.width > 120 && rect.height > 60) {
          const bg = style.backgroundColor;
          return bg === 'rgb(255, 255, 255)' || bg === 'rgba(255, 255, 255, 1)';
        }
        return false;
      });
      return offending.length;
    });

    results.adminDarkModeWhiteCards = whiteCardsAdmin;
    results.checksTotal++;
    if (whiteCardsAdmin === 0) results.checksPassed++;
    console.log(`Admin Overview Dark Mode White Cards: ${whiteCardsAdmin} (Expected: 0)`);

    const adminScreenshot = path.join(ARTIFACT_DIR, 'verify_audit_admin_dark.png');
    await page.screenshot({ path: adminScreenshot });
    console.log(`Saved screenshot: ${adminScreenshot}`);

    console.log('\n======================================================');
    console.log(`AUDIT SCORE: ${results.checksPassed} / ${results.checksTotal} CHECKS PASSED`);
    console.log('======================================================\n');

  } catch (err) {
    console.error('Audit run encountered an error:', err);
  } finally {
    await browser.close();
  }
}

runAudit();
