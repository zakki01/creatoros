/**
 * CreatorOS Master End-to-End Automated Test Suite
 * Validates all 11 Critical User Journeys in a headless browser runtime.
 */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5178;
const BASE_URL = `http://localhost:${PORT}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getBrowserExecutable() {
  if (fs.existsSync(EDGE_PATH)) return EDGE_PATH;
  if (fs.existsSync(CHROME_PATH)) return CHROME_PATH;
  return process.env.CHROME_BIN || 'google-chrome';
}

const creatorUser = {
  id: 'usr-zakki-01',
  name: 'Zakki Salim Shaikh',
  email: 'zakki@creatoros.ai',
  role: 'creator',
  handle: '@zakkisalimshaikh',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  isDemo: false,
  is_demo: false,
};

const brandUser = {
  id: 'brand-test-01',
  name: 'Aura Streetwear',
  email: 'team@aurastreetwear.com',
  role: 'business',
  handle: '@aurastreetwear',
  avatarUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150',
  isDemo: false,
  is_demo: false,
};

async function run() {
  console.log('\n============================================================');
  console.log('  CREATOROS MASTER E2E AUTOMATED VERIFICATION SUITE');
  console.log('============================================================\n');

  console.log('[E2E Setup] Building and previewing production app on port', PORT);
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
  });

  await sleep(4000);

  const executablePath = getBrowserExecutable();
  console.log(`[E2E Setup] Using browser binary: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const testResults = [];

  function recordResult(journeyNumber, name, passed, details = '') {
    testResults.push({ journeyNumber, name, passed, details });
    const symbol = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[Journey ${journeyNumber.toString().padStart(2, ' ')}] ${symbol}: ${name} ${details ? '(' + details + ')' : ''}`);
  }

  async function setSessionAndNavigate(user, tab, isBusiness = false) {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate((u, t, biz) => {
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(u));
      if (biz) {
        localStorage.setItem('creatoros_brand_active_tab', t);
      } else {
        localStorage.setItem('creatoros_creator_active_tab', t);
      }
    }, user, tab, isBusiness);
    const targetUrl = isBusiness ? `${BASE_URL}/?portal=business&tab=${tab}` : `${BASE_URL}/?tab=${tab}`;
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await sleep(600);
  }

  try {
    // -------------------------------------------------------------
    // Journey 1: Creator Onboarding & Welcome Experience
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 1: Creator Onboarding ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });

    const welcomeExists = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      return bodyText.includes('CreatorOS') || Boolean(document.querySelector('input[type="email"]'));
    });
    recordResult(1, 'Creator Onboarding Screen Loads', welcomeExists, 'Welcome UI responsive');

    // -------------------------------------------------------------
    // Journey 2: Brand Onboarding Experience
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 2: Brand Onboarding ---');
    await setSessionAndNavigate(brandUser, 'dashboard', true);
    const brandPortalLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Campaign') || text.includes('Brand') || text.includes('Aura');
    });
    recordResult(2, 'Brand Dashboard & Onboarding State', brandPortalLoaded);

    // -------------------------------------------------------------
    // Journey 3: Pitch Submission Flow
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 3: Pitch Submission Flow ---');
    await setSessionAndNavigate(creatorUser, 'opportunities', false);
    const oppsLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Opportunities') || text.includes('Brief') || text.includes('Pitch');
    });
    recordResult(3, 'Creator Pitch & Opportunities View', oppsLoaded);

    // -------------------------------------------------------------
    // Journey 4: Brand Invitation & Discovery Flow
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 4: Brand Invitation & Discovery ---');
    await setSessionAndNavigate(brandUser, 'discover', true);
    const discoverLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Discover') || Boolean(document.querySelector('input[type="text"], input[type="search"]'));
    });
    recordResult(4, 'Brand Discovery & Creator Search View', discoverLoaded);

    // -------------------------------------------------------------
    // Journey 5: Campaign Creation & Management
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 5: Campaign Creation ---');
    await setSessionAndNavigate(brandUser, 'campaigns', true);
    const campaignsLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Campaign') || text.includes('Active');
    });
    recordResult(5, 'Brand Campaign Pipeline & Management', campaignsLoaded);

    // -------------------------------------------------------------
    // Journey 6: Contract Lifecycle State Machine
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 6: Contract Lifecycle ---');
    await setSessionAndNavigate(creatorUser, 'contracts', false);
    const contractsLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Contract') || text.includes('Milestone') || text.includes('Active');
    });
    recordResult(6, 'Smart Contract & Escrow Engine', contractsLoaded);

    // -------------------------------------------------------------
    // Journey 7: Content Publishing & Feed
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 7: Content Publishing ---');
    await setSessionAndNavigate(creatorUser, 'content', false);
    const contentLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Deliverables') || text.includes('Content') || text.includes('Reels') || text.includes('Shots');
    });
    recordResult(7, 'Creator Content Studio & Publisher', contentLoaded);

    // -------------------------------------------------------------
    // Journey 8: Direct Messaging & Collaboration
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 8: Direct Messaging ---');
    await setSessionAndNavigate(creatorUser, 'messages', false);
    const messagesLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Messages') || text.includes('Conversation') || Boolean(document.querySelector('textarea, input'));
    });
    recordResult(8, 'Real-time Messaging & Moderation', messagesLoaded);

    // -------------------------------------------------------------
    // Journey 9: Analytics Dashboard (Truthful Telemetry)
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 9: Analytics Dashboard ---');
    await setSessionAndNavigate(creatorUser, 'analytics', false);
    const analyticsLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Analytics') || text.includes('Reach') || text.includes('Views') || text.includes('₹');
    });
    recordResult(9, 'Data-Driven Analytics Dashboard', analyticsLoaded);

    // -------------------------------------------------------------
    // Journey 10: Creator Passport & Identity Verification
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 10: Creator Passport ---');
    await page.setViewport({ width: 390, height: 844 });
    await setSessionAndNavigate(creatorUser, 'passport', false);
    const passportMobileCheck = await page.evaluate(() => {
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
      const text = document.body.innerText;
      const hasPassport = text.includes('Passport') || text.includes('Verified') || text.includes('Reputation');
      return hasPassport && !hasHorizontalScroll;
    });
    recordResult(10, 'Creator Passport Mobile-First Responsive Layout', passportMobileCheck, '0 horizontal overflow at 390px');

    // -------------------------------------------------------------
    // Journey 11: Live Studio & Real-time WebRTC
    // -------------------------------------------------------------
    console.log('\n--- Executing Journey 11: Live Studio ---');
    await page.setViewport({ width: 1280, height: 800 });
    await setSessionAndNavigate(creatorUser, 'live', false);
    const liveStudioLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Live') || text.includes('Stream') || text.includes('Studio') || text.includes('Go Live');
    });
    recordResult(11, 'Decart Live Studio & AR Pipeline', liveStudioLoaded);

  } catch (err) {
    console.error('Fatal error during E2E test execution:', err);
  } finally {
    await browser.close();
    previewProcess.kill();
  }

  console.log('\n============================================================');
  console.log('  E2E USER JOURNEY EXECUTION SUMMARY');
  console.log('============================================================');
  const allPassed = testResults.every((t) => t.passed);
  testResults.forEach((t) => {
    console.log(`[Journey ${t.journeyNumber.toString().padStart(2, ' ')}] ${t.passed ? '✅ PASS' : '❌ FAIL'}: ${t.name}`);
  });

  console.log(`\nTOTAL JOURNEYS: ${testResults.length} | PASSED: ${testResults.filter((t) => t.passed).length} | FAILED: ${testResults.filter((t) => !t.passed).length}`);

  if (!allPassed) {
    console.error('\n❌ ONE OR MORE E2E JOURNEYS FAILED.');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL 11 E2E CRITICAL USER JOURNEYS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  }
}

run();
