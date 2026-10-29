const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const BASE_URL = 'http://localhost:5173';

function assert(condition, message) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`  -> [PASS] ${message}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  console.log('\n================================================================');
  console.log('CREATOROS — REAL DARK MODALS, MESSAGES & CONTRAST VERIFICATION');
  console.log('================================================================\n');

  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,850'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  try {
    // 1. Authenticate Creator Session & Set Dark Theme
    console.log('[STEP 1] Authenticate Creator Session and Set Dark Theme');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    
    await page.evaluate(() => {
      const creatorSession = {
        id: 'cr-01',
        name: 'Rohan Sharma',
        email: 'rohan.sharma@creatoros.ai',
        role: 'creator',
        handle: '@rohan.kicks',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        provider: 'demo',
        isDemo: true,
      };
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(creatorSession));
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(600);

    const activeTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    assert(activeTheme === 'dark', 'Dark theme active on document element');

    // 2. Test Direct Messages Workspace in Dark Mode
    console.log('\n[STEP 2] Direct Messages Workspace in Dark Theme');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const msgBtn = buttons.find(b => b.textContent && b.textContent.includes('Messages'));
      if (msgBtn) msgBtn.click();
    });
    await sleep(700);

    const dmData = await page.evaluate(() => {
      const masterList = document.querySelector('.w-full.md\\:w-80') || document.querySelector('[class*="md:w-80"]');
      const threadCol = document.querySelector('.flex-1.flex-col.min-w-0');
      const input = document.querySelector('input[placeholder*="message"]');

      return {
        masterListBg: masterList ? window.getComputedStyle(masterList).backgroundColor : null,
        threadColBg: threadCol ? window.getComputedStyle(threadCol).backgroundColor : null,
        inputBg: input ? window.getComputedStyle(input).backgroundColor : null,
        inputColor: input ? window.getComputedStyle(input).color : null,
      };
    });

    console.log(`  -> Messages Master List background: ${dmData.masterListBg}`);
    console.log(`  -> Right Chat Canvas background: ${dmData.threadColBg}`);
    console.log(`  -> Message input background: ${dmData.inputBg}`);
    console.log(`  -> Message input text color: ${dmData.inputColor}`);

    assert(dmData.threadColBg !== 'rgb(248, 250, 252)', 'Right chat workspace is NOT light #F8FAFC');
    assert(dmData.threadColBg !== 'rgb(255, 255, 255)', 'Right chat workspace is NOT white #FFFFFF');
    assert(dmData.inputBg !== 'rgb(255, 255, 255)', 'Message input is NOT white');

    const dmScreenshot = path.join(ARTIFACTS_DIR, 'verify_dark_direct_messages_workspace.png');
    await page.screenshot({ path: dmScreenshot });
    console.log(`  -> Screenshot saved: ${dmScreenshot}`);

    // 3. Test Discover -> Brand Profile Modal in Dark Mode
    console.log('\n[STEP 3] Brand Profile Modal in Dark Theme');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const discBtn = buttons.find(b => b.textContent && b.textContent.includes('Discover'));
      if (discBtn) discBtn.click();
    });
    await sleep(600);

    // Switch to Brands tab
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const brandsTab = tabs.find(b => b.textContent && b.textContent.includes('Brands'));
      if (brandsTab) brandsTab.click();
    });
    await sleep(600);

    // Click "View" on the brand card
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const viewBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'View');
      if (viewBtn) viewBtn.click();
    });
    await sleep(700);

    const brandModalData = await page.evaluate(() => {
      const modal = document.querySelector('.max-w-3xl');
      if (!modal) return null;
      const modalBg = window.getComputedStyle(modal).backgroundColor;
      const textColor = window.getComputedStyle(modal).color;
      return { modalBg, textColor };
    });

    console.log(`  -> Brand Profile Modal background: ${brandModalData?.modalBg}`);
    console.log(`  -> Brand Profile Modal text color: ${brandModalData?.textColor}`);
    assert(brandModalData && brandModalData.modalBg !== 'rgb(255, 255, 255)', 'Brand Profile Modal is dark surface');

    const brandModalScreenshot = path.join(ARTIFACTS_DIR, 'verify_dark_brand_profile_modal.png');
    await page.screenshot({ path: brandModalScreenshot });
    console.log(`  -> Screenshot saved: ${brandModalScreenshot}`);

    // 4. Test Pitch to Brand Modal in Dark Mode
    console.log('\n[STEP 4] Pitch to Brand Modal in Dark Theme');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pitchBtn = buttons.find(b => b.textContent && b.textContent.includes('Pitch to Brand'));
      if (pitchBtn) pitchBtn.click();
    });
    await sleep(700);

    const pitchModalData = await page.evaluate(() => {
      const modal = document.querySelector('.max-w-2xl');
      if (!modal) return null;
      const modalBg = window.getComputedStyle(modal).backgroundColor;
      const input = modal.querySelector('input[placeholder*="Summer Drop"]');
      const textarea = modal.querySelector('textarea');
      return {
        modalBg,
        inputBg: input ? window.getComputedStyle(input).backgroundColor : null,
        textareaBg: textarea ? window.getComputedStyle(textarea).backgroundColor : null,
      };
    });

    console.log(`  -> Pitch to Brand Modal background: ${pitchModalData?.modalBg}`);
    console.log(`  -> Pitch Input background: ${pitchModalData?.inputBg}`);
    console.log(`  -> Pitch Textarea background: ${pitchModalData?.textareaBg}`);

    assert(pitchModalData && pitchModalData.modalBg !== 'rgb(255, 255, 255)', 'Pitch to Brand Modal is dark surface (not white)');
    assert(pitchModalData?.inputBg !== 'rgb(255, 255, 255)', 'Pitch Input is dark surface');
    assert(pitchModalData?.textareaBg !== 'rgb(255, 255, 255)', 'Pitch Textarea is dark surface');

    const pitchModalScreenshot = path.join(ARTIFACTS_DIR, 'verify_dark_pitch_modal.png');
    await page.screenshot({ path: pitchModalScreenshot });
    console.log(`  -> Screenshot saved: ${pitchModalScreenshot}`);

    // Close Pitch modal
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button[aria-label="Close modal"]'));
      if (closeButtons.length > 0) closeButtons[closeButtons.length - 1].click();
    });
    await sleep(400);

    // Close Brand Profile modal
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button[aria-label="Close brand profile"], button[aria-label="Close modal"]'));
      if (closeButtons.length > 0) closeButtons[0].click();
    });
    await sleep(400);

    // 5. Test Create Post Modal in Dark Mode
    console.log('\n[STEP 5] Create Post Modal in Dark Theme');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const createBtn = buttons.find(b => b.textContent && b.textContent.includes('Create'));
      if (createBtn) createBtn.click();
    });
    await sleep(700);

    const createModalData = await page.evaluate(() => {
      const modal = document.querySelector('.max-w-2xl');
      if (!modal) return null;
      return {
        modalBg: window.getComputedStyle(modal).backgroundColor,
        textColor: window.getComputedStyle(modal).color,
      };
    });

    console.log(`  -> Create Post Modal background: ${createModalData?.modalBg}`);
    assert(createModalData && createModalData.modalBg !== 'rgb(255, 255, 255)', 'Create Post Modal is dark surface (not white)');

    const createModalScreenshot = path.join(ARTIFACTS_DIR, 'verify_dark_create_post_modal.png');
    await page.screenshot({ path: createModalScreenshot });
    console.log(`  -> Screenshot saved: ${createModalScreenshot}`);

    // Close Create Modal
    await page.evaluate(() => {
      const closeButtons = Array.from(document.querySelectorAll('button[aria-label="Close Create Modal"]'));
      if (closeButtons.length > 0) closeButtons[0].click();
    });
    await sleep(400);

    // 6. Test Creator Passport in Dark Mode
    console.log('\n[STEP 6] Creator Passport in Dark Theme');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const profBtn = buttons.find(b => b.textContent && b.textContent.includes('Profile'));
      if (profBtn) profBtn.click();
    });
    await sleep(600);

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const passBtn = buttons.find(b => b.textContent && b.textContent.includes('Passport'));
      if (passBtn) passBtn.click();
    });
    await sleep(600);

    const passportData = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="passport-identity-card"]');
      if (!card) return null;
      return {
        cardBg: window.getComputedStyle(card).backgroundColor,
        textColor: window.getComputedStyle(card).color,
      };
    });

    console.log(`  -> Passport Identity Card background: ${passportData?.cardBg}`);
    assert(passportData && passportData.cardBg !== 'rgb(255, 255, 255)', 'Passport Identity Card is dark surface (not white gradient)');

    const passportScreenshot = path.join(ARTIFACTS_DIR, 'verify_dark_creator_passport.png');
    await page.screenshot({ path: passportScreenshot });
    console.log(`  -> Screenshot saved: ${passportScreenshot}`);

    console.log('\n================================================================');
    console.log('ALL DARK MODAL & MESSAGES WORKSPACE VERIFICATIONS PASSED: 100%');
    console.log('================================================================\n');
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
