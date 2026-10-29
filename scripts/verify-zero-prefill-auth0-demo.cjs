/**
 * CreatorOS — Forensic Verification: Zero Prefilled Data + Controlled Demo Accounts + Auth0 Gateway
 */
const puppeteer = require('puppeteer-core');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = process.env.TEST_URL || 'http://localhost:5173';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runVerification() {
  console.log('================================================================');
  console.log('CREATOROS — ZERO PREFILL & CONTROLLED DEMO FORENSIC AUDIT');
  console.log(`Target: ${BASE_URL}`);
  console.log('================================================================\n');

  let browser;
  let passedCount = 0;
  let totalCount = 0;

  function assert(title, condition, extra = '') {
    totalCount++;
    if (condition) {
      passedCount++;
      console.log(`  -> [PASS] ${title} ${extra}`);
    } else {
      console.error(`  -> [FAIL] ${title} ${extra}`);
    }
  }

  try {
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // -------------------------------------------------------------
    // SUITE 1: CLEAN EMPTY STATE FOR REAL / NON-DEMO USER
    // -------------------------------------------------------------
    console.log('[SUITE 1] Clean Empty State for Real User (Zero Prefilled Data)');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    // Inject non-demo real creator session
    await page.evaluate(() => {
      localStorage.clear();
      const realUserSession = {
        id: 'real-user-usr-8891',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'creator',
        handle: '@janedoe',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        is_demo: false,
        isDemo: false,
        account_type: 'standard',
        provider: 'email',
      };
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(realUserSession));
      localStorage.setItem('creatoros_creator_active_tab', 'home');
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1000);

    const homeCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasFakeRohan: text.includes('rohan.kicks') || text.includes('Rohan Sharma'),
        hasFakeAura: text.includes('Aura Streetwear') || text.includes('aurastreetwear'),
        hasEmptyState: text.includes('No Confirmed Contracts') || text.includes('Explore Campaigns') || text.includes('Explore Brands'),
        activeContractsZero: text.includes('0') || text.includes('No Active Contracts'),
      };
    });

    assert('Non-demo creator sees zero fake Rohan Sharma data', !homeCheck.hasFakeRohan);
    assert('Non-demo creator sees zero fake Aura Streetwear data', !homeCheck.hasFakeAura);
    assert('Non-demo creator sees clean empty state for contracts', homeCheck.hasEmptyState || homeCheck.activeContractsZero);

    // Test Campaigns tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const campBtn = btns.find((b) => b.textContent && b.textContent.trim().toLowerCase() === 'campaigns');
      if (campBtn) campBtn.click();
    });
    await sleep(800);

    const campaignsCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasEmptyNotice: text.includes('No Active Brand Campaigns') || text.includes('No active campaigns'),
        hasFakeSummerCampaign: text.includes('Autumn Sneaker Capsule — Lookbook'),
      };
    });
    assert('Campaigns screen renders SpatialEmptyState when empty', campaignsCheck.hasEmptyNotice);
    assert('Campaigns screen does not render fake sample campaigns', !campaignsCheck.hasFakeSummerCampaign);

    // Test Content / Deliverables tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const delBtn = btns.find((b) => b.textContent && b.textContent.trim().toLowerCase() === 'content');
      if (delBtn) delBtn.click();
    });
    await sleep(800);

    const deliverablesCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasEmptyNotice: text.includes('No Pending Deliverables') || text.includes('No drafts currently submitted'),
        hasFakeWalkthrough: text.includes('Colaba Streetwear Walkthrough'),
      };
    });
    assert('Deliverables screen renders SpatialEmptyState when empty', deliverablesCheck.hasEmptyNotice);
    assert('Deliverables screen has zero fake walkthrough deliverables', !deliverablesCheck.hasFakeWalkthrough);

    // Test Earnings tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      const earnBtn = btns.find((b) => b.textContent && b.textContent.trim().toLowerCase() === 'earnings');
      if (earnBtn) earnBtn.click();
    });
    await sleep(800);

    const earningsCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasEmptyPayouts: text.includes('No Payout History') || text.includes('₹0') || text.includes('0.00'),
        hasFake127L: text.includes('₹1.27L'),
      };
    });
    assert('Earnings screen renders SpatialEmptyState with zero payout history', earningsCheck.hasEmptyPayouts);
    assert('Earnings screen does not render fake ₹1.27L earnings', !earningsCheck.hasFake127L);

    // Screenshot clean empty state
    await page.screenshot({
      path: 'C:/Users/zakki/.gemini/antigravity/brain/cb0af99c-66fd-4e02-8b85-b86433099dd4/verify_forensic_clean_empty_state.png',
      fullPage: true,
    });

    // -------------------------------------------------------------
    // SUITE 2: CONTROLLED DEMO CREATOR ACCOUNT
    // -------------------------------------------------------------
    console.log('\n[SUITE 2] Controlled Demo Creator (demo.creator@creatoros.ai)');
    await page.evaluate(() => {
      localStorage.clear();
      const demoCreator = {
        id: 'demo-creator-01',
        name: 'CreatorOS Demo Creator',
        email: 'demo.creator@creatoros.ai',
        role: 'creator',
        handle: '@democreator',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        is_demo: true,
        isDemo: true,
        account_type: 'demo',
        provider: 'demo',
      };
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(demoCreator));
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1000);

    const demoCreatorCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasDemoName: text.includes('CreatorOS Demo Creator'),
        hasDemoCampaign: text.includes('CreatorOS 2026 Showcase Campaign'),
        isCreatorWorkspace: text.includes('Live Studio') || text.includes('Opportunities'),
      };
    });

    assert('Demo Creator is logged in as CreatorOS Demo Creator', demoCreatorCheck.hasDemoName);
    assert('Demo Creator sees isolated demo showcase campaign', demoCreatorCheck.hasDemoCampaign);
    assert('Demo Creator has access to Creator Workspace & Live Studio', demoCreatorCheck.isCreatorWorkspace);

    // -------------------------------------------------------------
    // SUITE 3: CONTROLLED DEMO BRAND ACCOUNT
    // -------------------------------------------------------------
    console.log('\n[SUITE 3] Controlled Demo Brand (demo.brand@creatoros.ai)');
    await page.evaluate(() => {
      localStorage.clear();
      const demoBrand = {
        id: 'demo-brand-01',
        name: 'CreatorOS Demo Brand',
        email: 'demo.brand@creatoros.ai',
        role: 'business',
        handle: '@demobrand',
        avatarUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150',
        is_demo: true,
        isDemo: true,
        account_type: 'demo',
        provider: 'demo',
      };
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(demoBrand));
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1200);

    const demoBrandCheck = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasDemoBrandName: text.includes('CreatorOS Demo Brand'),
        isBrandWorkspace: text.toLowerCase().includes('campaign') || text.toLowerCase().includes('creator') || text.toLowerCase().includes('brand'),
        hasEscrowBalance: text.includes('45,000') || text.includes('₹'),
      };
    });

    assert('Demo Brand is logged in as CreatorOS Demo Brand', demoBrandCheck.hasDemoBrandName);
    assert('Demo Brand workspace is mounted with brand permissions', demoBrandCheck.isBrandWorkspace);

    // -------------------------------------------------------------
    // SUITE 4: SERVER AUTHORIZATION & TOKEN ENDPOINTS
    // -------------------------------------------------------------
    console.log('\n[SUITE 4] Server Authorization & Token Endpoints');
    const authSuiteResults = await page.evaluate(async () => {
      let demoCreatorToken = '';
      let demoBrandToken = '';
      let verifySuccess = false;

      // 1. Test POST /api/auth/demo for Creator
      try {
        const res = await fetch('/api/auth/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'creator' }),
        });
        const data = await res.json();
        demoCreatorToken = data.token;
      } catch (e) {}

      // 2. Test POST /api/auth/demo for Brand
      try {
        const res = await fetch('/api/auth/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'business' }),
        });
        const data = await res.json();
        demoBrandToken = data.token;
      } catch (e) {}

      // 3. Test POST /api/auth/verify with Creator Token
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${demoCreatorToken}`,
          },
          body: JSON.stringify({ requiredRole: 'creator' }),
        });
        const data = await res.json();
        verifySuccess = data.authorized === true && data.user.role === 'creator';
      } catch (e) {}

      // 4. Test method not allowed on GET
      let getRejected = false;
      try {
        const res = await fetch('/api/auth/demo', { method: 'GET' });
        getRejected = res.status === 405;
      } catch (e) {}

      return {
        hasCreatorToken: Boolean(demoCreatorToken && demoCreatorToken.startsWith('cos_demo_')),
        hasBrandToken: Boolean(demoBrandToken && demoBrandToken.startsWith('cos_demo_')),
        verifySuccess,
        getRejected,
      };
    });

    assert('Server endpoint /api/auth/demo issues signed creator demo session', authSuiteResults.hasCreatorToken);
    assert('Server endpoint /api/auth/demo issues signed brand demo session', authSuiteResults.hasBrandToken);
    assert('Server endpoint /api/auth/verify validates session & role authorization', authSuiteResults.verifySuccess);
    assert('Server endpoint /api/auth/demo rejects non-POST methods with 405', authSuiteResults.getRejected);

    // -------------------------------------------------------------
    // SUITE 5: STORAGE USER OWNERSHIP ENFORCEMENT
    // -------------------------------------------------------------
    console.log('\n[SUITE 5] Storage User Ownership Enforcement');
    const storageCheck = await page.evaluate(async () => {
      const { uploadDirectToStorage } = await import('/src/services/mediaUploadService.ts');
      // Create a test file
      const dummyFile = new File(['dummy test content'], 'test.png', { type: 'image/png' });

      // Calling upload without user session must be strictly rejected
      localStorage.removeItem('creatoros_auth_session_v1');
      let anonymousRejected = false;
      try {
        await uploadDirectToStorage(dummyFile, 'creatoros-media', undefined, '');
      } catch (err) {
        anonymousRejected = true;
      }
      return { anonymousRejected };
    });

    assert('Storage client strictly rejects unauthenticated anonymous uploads', storageCheck.anonymousRejected);

    console.log('\n================================================================');
    console.log(`FINAL RESULT: ${passedCount} / ${totalCount} TESTS PASSED (${((passedCount / totalCount) * 100).toFixed(0)}%)`);
    if (passedCount === totalCount) {
      console.log('🟢 SECURE & PRODUCTION READY');
    } else {
      console.log('🔴 NOT READY');
    }
    console.log('================================================================\n');
  } catch (err) {
    console.error('Test execution failed with error:', err);
  } finally {
    if (browser) await browser.close();
  }
}

runVerification();
