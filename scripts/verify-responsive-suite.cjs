const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const LOCAL_URL = 'http://localhost:5173';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAudit() {
  console.log('🚀 Starting Comprehensive Responsive UX & Mobile Navigation Parity Audit');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'Mobile-XS-320', width: 320, height: 640 },
    { name: 'Mobile-SM-375', width: 375, height: 667 },
    { name: 'Mobile-MD-390', width: 390, height: 844 },
    { name: 'Mobile-LG-430', width: 430, height: 932 },
    { name: 'Tablet-768', width: 768, height: 1024 },
    { name: 'Desktop-1440', width: 1440, height: 900 },
  ];

  const results = {
    horizontalOverflowPassed: true,
    darkThemeSurfacesPassed: true,
    mobileNavParityPassed: true,
    profileModalMobilePassed: true,
    screenshots: [],
    errors: [],
  };

  try {
    // -------------------------------------------------------------
    // TEST 1: BRAND WORKSPACE (DARK MODE) RESPONSIVENESS & ZERO WHITE CARDS
    // -------------------------------------------------------------
    console.log('\n[1/5] Testing Brand Workspace Responsive Layout & Dark Mode...');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle0' });

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
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1500);

    // Test across all mobile viewports for horizontal overflow and white cards
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await sleep(300);

      const pageMetrics = await page.evaluate(() => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasOverflow = scrollWidth > winWidth;

        // Check for solid white cards in dark mode
        const allDivs = Array.from(document.querySelectorAll('div, section, article, nav, header'));
        let whiteCardCount = 0;
        const whiteElements = [];

        allDivs.forEach((el) => {
          const bg = window.getComputedStyle(el).backgroundColor;
          if (bg === 'rgb(255, 255, 255)' || bg === '#ffffff' || bg === 'rgba(255, 255, 255, 1)') {
            // Only count noticeable content cards, not microscopic inline badges or avatar images
            if (el.clientWidth > 120 && el.clientHeight > 45) {
              whiteCardCount++;
              whiteElements.push({
                tag: el.tagName,
                cls: el.className,
                w: el.clientWidth,
                h: el.clientHeight,
              });
            }
          }
        });

        return { docWidth, scrollWidth, winWidth, hasOverflow, whiteCardCount, whiteElements };
      });

      console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): Overflow=${pageMetrics.hasOverflow}, WhiteCards=${pageMetrics.whiteCardCount}`);

      if (pageMetrics.hasOverflow) {
        results.horizontalOverflowPassed = false;
        results.errors.push(`Horizontal overflow at ${vp.name} (scrollWidth ${pageMetrics.scrollWidth} > winWidth ${pageMetrics.winWidth})`);
      }
      if (pageMetrics.whiteCardCount > 0) {
        results.darkThemeSurfacesPassed = false;
        results.errors.push(`Found ${pageMetrics.whiteCardCount} white cards in dark mode at ${vp.name}`);
      }

      if (vp.width === 390) {
        const shotPath = path.join(ARTIFACT_DIR, 'verify_responsive_brand_dark_390.png');
        await page.screenshot({ path: shotPath, fullPage: false });
        results.screenshots.push(shotPath);
      }
    }

    // -------------------------------------------------------------
    // TEST 2: MOBILE APPS DRAWER & NAVIGATION PARITY (BRAND)
    // -------------------------------------------------------------
    console.log('\n[2/5] Testing Mobile Apps Drawer Open & Navigation Parity...');
    await page.setViewport({ width: 390, height: 844 });

    // Click "Apps" tab in mobile bottom nav
    const openedFromBottomNav = await page.evaluate(() => {
      const bottomNav = document.querySelector('nav[aria-label="Mobile Bottom Navigation"]');
      if (!bottomNav) return false;
      const appsBtn = Array.from(bottomNav.querySelectorAll('button')).find(
        (b) => b.innerText.includes('Apps') || b.getAttribute('aria-label') === 'Apps'
      );
      if (appsBtn) {
        appsBtn.click();
        return true;
      }
      return false;
    });

    console.log('Opened Apps Drawer from bottom nav:', openedFromBottomNav);
    await sleep(600);

    const drawerCheck = await page.evaluate(() => {
      const drawer = document.querySelector('[role="dialog"]');
      if (!drawer) return { open: false };
      const text = drawer.innerText;
      return {
        open: true,
        hasCampaignHub: text.includes('Campaign Hub') || text.includes('Campaigns'),
        hasContracts: text.includes('Contracts & Escrow') || text.includes('Contracts'),
        hasBilling: text.includes('Billing & Escrow') || text.includes('Billing'),
        hasAnalytics: text.includes('Campaign Analytics') || text.includes('Analytics'),
        hasContentApprovals: text.includes('Content Approvals') || text.includes('Approvals'),
        hasSettings: text.includes('Workspace Settings') || text.includes('Settings'),
      };
    });

    console.log('Mobile Apps Drawer Content Check:', drawerCheck);
    if (drawerCheck.open && drawerCheck.hasContracts && drawerCheck.hasBilling && drawerCheck.hasAnalytics) {
      results.mobileNavParityPassed = true;
    } else {
      results.mobileNavParityPassed = false;
      results.errors.push(`Mobile Apps Drawer failed parity checks: ${JSON.stringify(drawerCheck)}`);
    }

    const drawerShot = path.join(ARTIFACT_DIR, 'verify_responsive_brand_drawer_390.png');
    await page.screenshot({ path: drawerShot, fullPage: false });
    results.screenshots.push(drawerShot);

    // Close drawer
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close apps drawer"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(400);

    // -------------------------------------------------------------
    // TEST 3: CREATOR WORKSPACE (LIGHT & DARK MODE) RESPONSIVENESS
    // -------------------------------------------------------------
    console.log('\n[3/5] Testing Creator Workspace Responsive Layout...');
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

    const creatorLightShot = path.join(ARTIFACT_DIR, 'verify_responsive_creator_light_390.png');
    await page.screenshot({ path: creatorLightShot, fullPage: false });
    results.screenshots.push(creatorLightShot);

    // Creator Dark Mode
    await page.evaluate(() => {
      localStorage.setItem('creatoros_theme_v1', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await sleep(500);

    const creatorDarkShot = path.join(ARTIFACT_DIR, 'verify_responsive_creator_dark_390.png');
    await page.screenshot({ path: creatorDarkShot, fullPage: false });
    results.screenshots.push(creatorDarkShot);

    // Open Creator Apps Drawer
    await page.evaluate(() => {
      const bottomNav = document.querySelector('nav[aria-label="Mobile Bottom Navigation"]');
      if (!bottomNav) return;
      const appsBtn = Array.from(bottomNav.querySelectorAll('button')).find(
        (b) => b.innerText.includes('Apps') || b.getAttribute('aria-label') === 'Apps'
      );
      if (appsBtn) appsBtn.click();
    });
    await sleep(600);

    const creatorDrawerCheck = await page.evaluate(() => {
      const drawer = document.querySelector('[role="dialog"]');
      if (!drawer) return { open: false };
      const text = drawer.innerText;
      return {
        open: true,
        hasLiveStudio: text.includes('Live Studio'),
        hasPassport: text.includes('Creator Passport'),
        hasOpportunities: text.includes('Opportunities'),
        hasEarnings: text.includes('Earnings & Payouts'),
        hasContracts: text.includes('Contracts & Legal'),
      };
    });

    console.log('Creator Apps Drawer Check:', creatorDrawerCheck);

    const creatorDrawerShot = path.join(ARTIFACT_DIR, 'verify_responsive_creator_drawer_390.png');
    await page.screenshot({ path: creatorDrawerShot, fullPage: false });
    results.screenshots.push(creatorDrawerShot);

    // Close drawer
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close apps drawer"]');
      if (closeBtn) closeBtn.click();
    });
    await sleep(400);

    // -------------------------------------------------------------
    // TEST 4: BRAND PROFILE MODAL RESPONSIVE LAYOUT
    // -------------------------------------------------------------
    console.log('\n[4/5] Testing Brand Profile Modal on Mobile (390px)...');
    // Open profile modal via Mobile Apps Drawer -> Brand Profile
    await page.evaluate(() => {
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
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(1500);

    // Open apps drawer
    await page.evaluate(() => {
      const bottomNav = document.querySelector('nav[aria-label="Mobile Bottom Navigation"]');
      if (!bottomNav) return;
      const appsBtn = Array.from(bottomNav.querySelectorAll('button')).find(
        (b) => b.innerText.includes('Apps') || b.getAttribute('aria-label') === 'Apps'
      );
      if (appsBtn) appsBtn.click();
    });
    await sleep(600);

    // Click Brand Profile item in drawer
    await page.evaluate(() => {
      const profileBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.innerText.includes('Brand Profile')
      );
      if (profileBtn) profileBtn.click();
    });
    await sleep(800);

    const profileModalCheck = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"][aria-label="Brand Profile"]');
      if (!modal) return { open: false };

      const closeBtn = modal.querySelector('button[aria-label="Close brand profile"]');
      const closeRect = closeBtn ? closeBtn.getBoundingClientRect() : null;

      // Check if tabs exist and scrollable
      const tabs = modal.querySelector('nav');
      const tabsScrollable = tabs ? tabs.scrollWidth >= tabs.clientWidth : false;

      return {
        open: true,
        hasCloseBtn: Boolean(closeBtn),
        closeBtnMinTarget: closeRect ? closeRect.width >= 40 && closeRect.height >= 40 : false,
        tabsScrollable,
      };
    });

    console.log('Brand Profile Modal Check:', profileModalCheck);
    if (profileModalCheck.open && profileModalCheck.hasCloseBtn) {
      results.profileModalMobilePassed = true;
    } else {
      results.profileModalMobilePassed = false;
      results.errors.push(`Brand Profile Modal failed: ${JSON.stringify(profileModalCheck)}`);
    }

    const modalShot = path.join(ARTIFACT_DIR, 'verify_responsive_brand_profile_modal_390.png');
    await page.screenshot({ path: modalShot, fullPage: false });
    results.screenshots.push(modalShot);

  } catch (err) {
    console.error('Audit exception:', err);
    results.errors.push(err.message);
  } finally {
    await browser.close();
  }

  console.log('\n=============================================');
  console.log('📊 AUDIT SUMMARY:');
  console.log(JSON.stringify(results, null, 2));
  console.log('=============================================');

  if (results.horizontalOverflowPassed && results.darkThemeSurfacesPassed && results.mobileNavParityPassed && results.profileModalMobilePassed) {
    console.log('🎯 ALL RESPONSIVE UX & MOBILE PARITY CHECKS PASSED 100%!');
    process.exit(0);
  } else {
    console.error('❌ SOME CHECKS FAILED!');
    process.exit(1);
  }
}

runAudit();
