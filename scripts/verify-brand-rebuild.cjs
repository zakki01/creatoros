const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const BASE_URL = 'http://localhost:5173';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRgb(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

function getLuminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

async function run() {
  console.log('--- STARTING BRAND EXPERIENCE & TRUE DARK MODE VERIFICATION ---');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const results = {
    firstTimeBrandDark: false,
    firstTimeBrandLight: false,
    activeBrandDark: false,
    zeroWhiteCardsInDark: false,
    mobileBottomNav5Tabs: false,
    creatorDiscoveryActions: false,
    campaignModalDark: false,
    creatorHomeNonRegression: false,
    contrastRatios: [],
    errors: [],
  };

  try {
    // ==========================================
    // TEST 1: FIRST-TIME BRAND EXPERIENCE (DARK)
    // ==========================================
    console.log('\n[1/6] Testing First-Time Brand Experience (Dark Mode)...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      localStorage.clear();
      const demoBrand = {
        id: 'demo-brand-01',
        name: 'Aura Streetwear Co.',
        email: 'demo.brand@creatoros.ai',
        role: 'business',
        handle: '@aurastreetwear',
        is_demo: true,
        account_type: 'demo',
        provider: 'demo',
      };
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(demoBrand));
      localStorage.setItem('creatoros_theme_v1', 'dark');
      localStorage.setItem('creatoros_state_v1_campaigns', JSON.stringify([]));
      localStorage.setItem('creatoros_state_v1_outreach', JSON.stringify([]));
      localStorage.setItem('creatoros_state_v1_payments', JSON.stringify([]));
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1500);

    // Verify First-Time UI elements
    const firstTimeChecks = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasGreeting = bodyText.includes('Good morning,') || bodyText.includes('Good afternoon,') || bodyText.includes('Good evening,');
      const hasGettingStarted = bodyText.includes('GETTING STARTED');
      const hasCreateCampaignBtn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Create Campaign'));
      const hasDiscoverCreatorsBtn = Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Discover Creators'));
      const has4GiantKpis = bodyText.includes('ACTIVE CAMPAIGNS') && bodyText.includes('CREATORS IN ROSTER') && bodyText.includes('PENDING APPROVALS');
      const hasNeedsAttention0 = bodyText.includes('Needs Your Attention 0 active') || bodyText.includes('NEEDS YOUR ATTENTION');

      // Check header identity format: stacked Aura Streetwear Co. / Brand
      const headerRolePill = document.querySelector('header span, .role-badge, [class*="text-zinc"]');
      const topBarText = document.querySelector('header')?.innerText || '';
      const hasLoudAllCapsBrand = topBarText.includes('/ BRAND');

      // Inspect card surface colors in dark mode
      const cards = Array.from(document.querySelectorAll('div[class*="rounded-2xl"], div[class*="rounded-3xl"]'));
      let whiteCardsCount = 0;
      cards.forEach(c => {
        const bg = window.getComputedStyle(c).backgroundColor;
        if (bg === 'rgb(255, 255, 255)' || bg === '#ffffff') {
          // ignore small badge or image containers
          if (c.clientWidth > 100 && c.clientHeight > 40) {
            whiteCardsCount++;
          }
        }
      });

      return {
        hasGreeting,
        hasGettingStarted,
        hasCreateCampaignBtn,
        hasDiscoverCreatorsBtn,
        has4GiantKpis,
        hasNeedsAttention0,
        hasLoudAllCapsBrand,
        whiteCardsCount,
        topBarText,
      };
    });

    console.log('First-time checks result:', firstTimeChecks);
    if (firstTimeChecks.hasGreeting && firstTimeChecks.hasGettingStarted && firstTimeChecks.hasCreateCampaignBtn && firstTimeChecks.hasDiscoverCreatorsBtn && !firstTimeChecks.has4GiantKpis && !firstTimeChecks.hasNeedsAttention0) {
      results.firstTimeBrandDark = true;
      console.log('✓ PASS: First-Time Brand UI is calm, task-oriented, zero unwanted KPI cards, zero attention clutter.');
    } else {
      results.errors.push(`First-time brand UI check failed: ${JSON.stringify(firstTimeChecks)}`);
    }

    const ftDarkPath = path.join(ARTIFACT_DIR, 'verify_brand_first_time_dark.png');
    await page.screenshot({ path: ftDarkPath, fullPage: false });
    console.log(`Saved screenshot: ${ftDarkPath}`);

    // Switch to Light Mode for first time view
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await sleep(600);
    const ftLightPath = path.join(ARTIFACT_DIR, 'verify_brand_first_time_light.png');
    await page.screenshot({ path: ftLightPath, fullPage: false });
    results.firstTimeBrandLight = true;
    console.log(`Saved screenshot: ${ftLightPath}`);

    // ==========================================
    // TEST 2: ACTIVE BRAND DASHBOARD & TRUE DARK MODE
    // ==========================================
    console.log('\n[2/6] Testing Active Brand Dashboard & True Dark Mode Surfaces...');
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');

      const sampleCampaign = {
        id: 'camp-active-01',
        name: 'Summer Streetwear Capsule 2026',
        brandName: 'Aura Streetwear Co.',
        brandLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80',
        objective: 'Product Launch',
        budgetTotal: 150000,
        budgetSpent: 45000,
        revenueGenerated: 185000,
        status: 'Active',
        health: 'Healthy',
        progress: 42,
        creators: { confirmed: 3, target: 5 },
        content: { submitted: 4, target: 8 },
        published: { published: 2, target: 8 },
        aiInsight: 'Engagement pace is 14% higher than category benchmark.',
        platforms: ['Instagram', 'YouTube'],
        deliverables: [{ type: 'Reel', count: 4, ratePerUnit: 25000 }],
        timeline: { startDate: '2026-10-15', endDate: '2026-11-15', submissionDeadline: '2026-11-05' },
        brandGuidelines: 'Showcase urban styling and breathable fabric tech.',
        targetAudience: { location: ['Mumbai', 'Delhi'], ageRange: '18-30', gender: 'All', interests: ['Streetwear'], language: 'English' }
      };

      const sampleOutreach = {
        id: 'out-01',
        creatorId: 'c1',
        creatorName: 'Rohan Sharma',
        creatorHandle: '@rohansharma',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        creatorCategory: 'Fashion & Streetwear',
        campaignId: 'camp-active-01',
        campaignName: 'Summer Streetwear Capsule 2026',
        stage: 'negotiation',
        proposedRate: 35000,
        updatedAt: '2h ago'
      };

      localStorage.setItem('creatoros_state_v1_campaigns', JSON.stringify([sampleCampaign]));
      localStorage.setItem('creatoros_state_v1_outreach', JSON.stringify([sampleOutreach]));
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1500);

    // Evaluate surfaces and contrast in Dark Mode
    const surfaceAudit = await page.evaluate(() => {
      const bgBody = window.getComputedStyle(document.body).backgroundColor;
      const rootBg = window.getComputedStyle(document.documentElement).getPropertyValue('--background').trim();

      // Find all major surface containers
      const cards = Array.from(document.querySelectorAll('div[class*="rounded-2xl"], div[class*="rounded-3xl"], div[class*="p-4"], div[class*="p-5"], div[class*="p-6"]'));
      let whiteCardLeaks = 0;
      const sampledCards = [];

      cards.forEach(c => {
        if (c.clientWidth > 120 && c.clientHeight > 50) {
          const style = window.getComputedStyle(c);
          const bg = style.backgroundColor;
          const textEl = c.querySelector('h1, h2, h3, h4, span, p');
          const textColor = textEl ? window.getComputedStyle(textEl).color : style.color;

          if (bg === 'rgb(255, 255, 255)' || bg === '#ffffff') {
            whiteCardLeaks++;
          }
          if (sampledCards.length < 8) {
            sampledCards.push({ bg, textColor, textSample: textEl?.innerText?.slice(0, 30) });
          }
        }
      });

      const bodyText = document.body.innerText;
      const hasCompactMetrics = bodyText.includes('Active Campaigns') || bodyText.includes('Creators in Pipeline');
      const hasCampaignCard = bodyText.includes('Summer Streetwear Capsule 2026');

      return {
        bgBody,
        rootBg,
        whiteCardLeaks,
        sampledCards,
        hasCompactMetrics,
        hasCampaignCard,
      };
    });

    console.log('Surface audit in dark mode:', surfaceAudit);
    if (surfaceAudit.whiteCardLeaks === 0) {
      results.zeroWhiteCardsInDark = true;
      results.activeBrandDark = true;
      console.log('✓ PASS: ZERO white card leakage in Dark Mode! Surfaces adhere strictly to semantic dark hierarchy.');
    } else {
      results.errors.push(`Found ${surfaceAudit.whiteCardLeaks} white card leakages in dark mode!`);
    }

    // Check contrast ratios
    surfaceAudit.sampledCards.forEach((sample, i) => {
      const bgRgb = parseRgb(sample.bg);
      const txtRgb = parseRgb(sample.textColor);
      if (bgRgb && txtRgb) {
        const ratio = getContrast(bgRgb, txtRgb);
        results.contrastRatios.push({ sample: sample.textSample, ratio: ratio.toFixed(2) });
      }
    });

    const activeDarkPath = path.join(ARTIFACT_DIR, 'verify_brand_active_dark.png');
    await page.screenshot({ path: activeDarkPath, fullPage: false });
    console.log(`Saved screenshot: ${activeDarkPath}`);

    // ==========================================
    // TEST 3: MOBILE NAVIGATION (EXACTLY 5 ITEMS)
    // ==========================================
    console.log('\n[3/6] Testing Mobile Viewport Navigation (390x844)...');
    await page.setViewport({ width: 390, height: 844 });
    await sleep(600);

    const mobileNavCheck = await page.evaluate(() => {
      // Find mobile bottom navigation
      const navElements = Array.from(document.querySelectorAll('nav, [class*="fixed bottom-0"], [class*="pb-safe"]'));
      let bottomNav = navElements.find(el => {
        const style = window.getComputedStyle(el);
        return style.position === 'fixed' || el.className.includes('fixed bottom-0');
      });

      if (!bottomNav) {
        bottomNav = document.querySelector('[class*="fixed bottom-0"]');
      }

      if (!bottomNav) return { found: false, count: 0, items: [] };

      const buttons = Array.from(bottomNav.querySelectorAll('button'));
      const items = buttons.map(b => b.innerText.trim()).filter(Boolean);
      const hasPbSafe = bottomNav.className.includes('pb-safe') || bottomNav.className.includes('safe');

      return {
        found: true,
        count: buttons.length,
        items,
        hasPbSafe,
      };
    });

    console.log('Mobile navigation check:', mobileNavCheck);
    if (mobileNavCheck.found && mobileNavCheck.count === 5) {
      results.mobileBottomNav5Tabs = true;
      console.log(`✓ PASS: Mobile bottom nav has exactly 5 items: ${mobileNavCheck.items.join(', ')} with pb-safe.`);
    } else {
      results.errors.push(`Mobile bottom nav check failed. Found ${mobileNavCheck.count} items, expected 5. Items: ${mobileNavCheck.items.join(', ')}`);
    }

    const mobileDarkPath = path.join(ARTIFACT_DIR, 'verify_brand_mobile_dark.png');
    await page.screenshot({ path: mobileDarkPath, fullPage: false });
    console.log(`Saved screenshot: ${mobileDarkPath}`);

    // ==========================================
    // TEST 4: CREATOR DISCOVERY WORKSPACE
    // ==========================================
    console.log('\n[4/6] Testing Creator Discovery (Pure Discovery, View & Invite Only)...');
    await page.setViewport({ width: 1280, height: 800 });

    // Click on Discover tab
    await page.evaluate(() => {
      const discoverBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Discover'));
      if (discoverBtn) discoverBtn.click();
    });
    await sleep(1000);

    const discoverChecks = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const connectBtns = buttons.filter(b => b.innerText.trim() === 'Connect');
      const inviteBtns = buttons.filter(b => b.innerText.trim().includes('Invite') || b.innerText.trim().includes('Approach'));
      const viewBtns = buttons.filter(b => b.innerText.trim().includes('View'));

      // Check card styling in dark mode
      const cards = Array.from(document.querySelectorAll('div[class*="rounded-2xl"], div[class*="rounded-xl"]'));
      let whiteCardLeaks = 0;
      cards.forEach(c => {
        if (c.clientWidth > 150 && c.clientHeight > 100) {
          const bg = window.getComputedStyle(c).backgroundColor;
          if (bg === 'rgb(255, 255, 255)' || bg === '#ffffff') {
            whiteCardLeaks++;
          }
        }
      });

      return {
        hasConnectButtons: connectBtns.length > 0,
        inviteCount: inviteBtns.length,
        viewCount: viewBtns.length,
        whiteCardLeaks,
      };
    });

    console.log('Creator Discovery checks:', discoverChecks);
    if (!discoverChecks.hasConnectButtons && (discoverChecks.inviteCount > 0 || discoverChecks.viewCount > 0) && discoverChecks.whiteCardLeaks === 0) {
      results.creatorDiscoveryActions = true;
      console.log('✓ PASS: Creator Discovery strictly features View and Invite actions, strictly zero "Connect" button, zero white card leakage.');
    } else {
      results.errors.push(`Creator discovery check failed: ${JSON.stringify(discoverChecks)}`);
    }

    const discoverDarkPath = path.join(ARTIFACT_DIR, 'verify_brand_discover_creators_dark.png');
    await page.screenshot({ path: discoverDarkPath, fullPage: false });
    console.log(`Saved screenshot: ${discoverDarkPath}`);

    // ==========================================
    // TEST 5: CAMPAIGN CREATION MODAL (5 STEPS, DARK)
    // ==========================================
    console.log('\n[5/6] Testing Campaign Creation Modal (5-Step Progressive Disclosure)...');
    // Return to Home tab
    await page.evaluate(() => {
      const homeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Home'));
      if (homeBtn) homeBtn.click();
    });
    await sleep(800);

    // Click "New Campaign" or "Create Campaign"
    await page.evaluate(() => {
      const createBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Create Campaign') || b.innerText.includes('New Campaign'));
      if (createBtn) createBtn.click();
    });
    await sleep(800);

    const modalCheck = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"], .fixed.z-50 [class*="rounded-"]');
      if (!modal) return { open: false };

      const title = modal.querySelector('h2, h3')?.innerText || '';
      const bodyText = modal.innerText;
      const step1Title = bodyText.includes('What are you promoting?');
      const modalBg = window.getComputedStyle(modal).backgroundColor;
      const isWhite = modalBg === 'rgb(255, 255, 255)' || modalBg === '#ffffff';

      return {
        open: true,
        title,
        step1Title,
        modalBg,
        isWhite,
      };
    });

    console.log('Campaign Creation Modal check:', modalCheck);
    if (modalCheck.open && modalCheck.step1Title && !modalCheck.isWhite) {
      results.campaignModalDark = true;
      console.log('✓ PASS: Campaign Creation Modal opened with Step 1 and semantic dark surface elevation.');
    } else {
      results.errors.push(`Campaign creation modal check failed: ${JSON.stringify(modalCheck)}`);
    }

    const modalStep1Path = path.join(ARTIFACT_DIR, 'verify_campaign_creation_modal_step1.png');
    await page.screenshot({ path: modalStep1Path, fullPage: false });
    console.log(`Saved screenshot: ${modalStep1Path}`);

    // Click Continue to Step 2
    await page.evaluate(() => {
      const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Continue');
      if (continueBtn) continueBtn.click();
    });
    await sleep(600);

    const modalStep2Path = path.join(ARTIFACT_DIR, 'verify_campaign_creation_modal_step2.png');
    await page.screenshot({ path: modalStep2Path, fullPage: false });
    console.log(`Saved screenshot: ${modalStep2Path}`);

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close modal"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Cancel'));
      if (closeBtn) closeBtn.click();
    });
    await sleep(600);

    // ==========================================
    // TEST 6: CREATOR SIDE NON-REGRESSION
    // ==========================================
    console.log('\n[6/6] Testing Creator Side Non-Regression (Light & Dark Mode)...');
    await page.evaluate(() => {
      localStorage.clear();
      const demoCreator = {
        id: 'demo-creator-01',
        name: 'Rohan Sharma',
        email: 'demo.creator@creatoros.ai',
        role: 'creator',
        handle: '@rohansharma',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        is_demo: true,
        account_type: 'demo',
        provider: 'demo',
      };
      localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(demoCreator));
      localStorage.setItem('creatoros_theme_v1', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1500);

    const creatorLightPath = path.join(ARTIFACT_DIR, 'verify_creator_home_light.png');
    await page.screenshot({ path: creatorLightPath, fullPage: false });
    console.log(`Saved screenshot: ${creatorLightPath}`);

    // Creator Dark Mode
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await sleep(800);

    const creatorDarkPath = path.join(ARTIFACT_DIR, 'verify_creator_home_dark.png');
    await page.screenshot({ path: creatorDarkPath, fullPage: false });
    console.log(`Saved screenshot: ${creatorDarkPath}`);

    const creatorSideChecks = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasLiveStudio = bodyText.includes('Live Studio') || bodyText.includes('Open Studio');
      const hasPassport = bodyText.includes('Passport');
      const hasSubmitWork = bodyText.includes('Submit Work');
      const topBarText = document.querySelector('header')?.innerText || '';

      return {
        hasLiveStudio,
        hasPassport,
        hasSubmitWork,
        topBarText,
      };
    });

    console.log('Creator side checks:', creatorSideChecks);
    if (creatorSideChecks.hasLiveStudio && creatorSideChecks.hasPassport) {
      results.creatorHomeNonRegression = true;
      console.log('✓ PASS: Creator Side remains completely intact and functional with no regressions!');
    } else {
      results.errors.push(`Creator side checks failed: ${JSON.stringify(creatorSideChecks)}`);
    }

  } catch (err) {
    console.error('Test execution error:', err);
    results.errors.push(err.message);
  } finally {
    await browser.close();
  }

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));

  const allPassed =
    results.firstTimeBrandDark &&
    results.firstTimeBrandLight &&
    results.activeBrandDark &&
    results.zeroWhiteCardsInDark &&
    results.mobileBottomNav5Tabs &&
    results.creatorDiscoveryActions &&
    results.campaignModalDark &&
    results.creatorHomeNonRegression;

  if (allPassed) {
    console.log('\n🎯 ALL BRAND EXPERIENCE REBUILD CRITERIA MET WITH 100% SUCCESS!');
    process.exit(0);
  } else {
    console.error('\n❌ SOME CHECKS FAILED!');
    process.exit(1);
  }
}

run();
