const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5173';
const ARTIFACTS_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function capturePreviews() {
  console.log('--- CAPTURING VISUAL PREVIEWS FOR CORRECTIVE PASS ---');
  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // -------------------------------------------------------------
    // 1. Welcome Page (Light Theme, Single Auth Component)
    // -------------------------------------------------------------
    console.log('Capturing Welcome Page...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'preview_welcome.png') });

    // -------------------------------------------------------------
    // 2. Creator Workspace Dashboard (cr-01 canonical identity)
    // -------------------------------------------------------------
    console.log('Capturing Creator Workspace...');
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
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(700);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'preview_creator_dashboard.png') });

    // -------------------------------------------------------------
    // 3. Creator Profile with Availability & Minimum Rate Editor
    // -------------------------------------------------------------
    console.log('Capturing Creator Profile & Availability Editor...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const profileBtn = buttons.find((b) => b.textContent && b.textContent.includes('Profile'));
      if (profileBtn) profileBtn.click();
    });
    await sleep(700);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'preview_creator_profile_availability.png') });

    // -------------------------------------------------------------
    // 4. Pitch to Brand Modal (Opened from Brand Profile)
    // -------------------------------------------------------------
    console.log('Capturing Pitch to Brand Modal...');
    await page.evaluate(() => {
      // Switch to opportunities or discover tab
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const oppBtn = buttons.find((b) => b.textContent && b.textContent.includes('Opportunities'));
      if (oppBtn) oppBtn.click();
    });
    await sleep(500);

    // Open Pitch modal via evaluation
    await page.evaluate(() => {
      // Trigger pitch modal
      const brandCard = document.querySelector('.cursor-pointer');
      if (brandCard) brandCard.click();
    });
    await sleep(500);

    // Click "Pitch to Brand"
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pitchBtn = buttons.find((b) => b.textContent && b.textContent.includes('Pitch to Brand'));
      if (pitchBtn) pitchBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'preview_pitch_to_brand_modal.png') });

    // -------------------------------------------------------------
    // 5. Brand Workspace & Creator Discovery with Availability Filters
    // -------------------------------------------------------------
    console.log('Capturing Brand Creator Discovery with Availability Filters...');
    await page.evaluate(() => {
      const brandSession = {
        id: 'brand-aura',
        name: 'Aura Streetwear Co.',
        email: 'partnerships@aurastreetwear.com',
        role: 'business',
        handle: '@aurastreetwear',
        avatarUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
        provider: 'demo',
        isDemo: true,
      };
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(brandSession));
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(700);

    // Navigate to Creator Discovery
    await page.evaluate(() => {
      const navItems = Array.from(document.querySelectorAll('button, a'));
      const discoverBtn = navItems.find((b) => b.textContent && (b.textContent.includes('Creators') || b.textContent.includes('Discovery')));
      if (discoverBtn) discoverBtn.click();
    });
    await sleep(700);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'preview_brand_creator_discovery.png') });

    // -------------------------------------------------------------
    // 6. Approach Creator Modal (Structured Brief, Budget & Terms)
    // -------------------------------------------------------------
    console.log('Capturing Approach Creator Modal...');
    // Click View on first creator
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const viewBtn = buttons.find((b) => b.textContent && b.textContent.trim() === 'View');
      if (viewBtn) viewBtn.click();
    });
    await sleep(600);

    // Click Approach Creator
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const approachBtn = buttons.find((b) => b.textContent && b.textContent.includes('Approach Creator'));
      if (approachBtn) approachBtn.click();
    });
    await sleep(600);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'preview_approach_creator_modal.png') });

    // -------------------------------------------------------------
    // 7. Mobile Camera-First 9:16 Live Studio (TikTok LIVE Model)
    // -------------------------------------------------------------
    console.log('Capturing Mobile Camera-First Live Studio (9:16)...');
    await page.setViewport({ width: 390, height: 844 });
    // Set Creator session
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
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(600);

    // Open Live Studio
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const liveBtn = buttons.find((b) => b.textContent && b.textContent.includes('Live Studio'));
      if (liveBtn) liveBtn.click();
    });
    await sleep(1000);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'preview_mobile_live_studio_9_16.png') });

    // -------------------------------------------------------------
    // 8. Global Dark Theme Mode
    // -------------------------------------------------------------
    console.log('Capturing Global Dark Theme Workspace...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(500);

    // Toggle dark theme via ThemeToggle button
    await page.evaluate(() => {
      const themeBtn = document.querySelector('button[title*="theme"]');
      if (themeBtn) themeBtn.click();
    });
    await sleep(500);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'preview_dark_theme_workspace.png') });

    console.log('ALL PREVIEWS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Preview capture error:', err);
  } finally {
    if (browser) await browser.close();
  }
}

capturePreviews();
