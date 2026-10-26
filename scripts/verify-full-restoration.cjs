const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5173';

async function testAllRoutes() {
  console.log('--- Starting CreatorOS Route & Restoration Verification ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  const results = [];

  // Helper to test route
  async function testRoute(name, pathStr, setupFn, verifyFn) {
    try {
      console.log(`Checking [${name}] at ${pathStr}...`);
      await page.goto(`${BASE_URL}${pathStr}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (setupFn) {
        await setupFn(page);
        await page.goto(`${BASE_URL}${pathStr}`, { waitUntil: 'networkidle0', timeout: 15000 });
      } else {
        await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {});
      }
      await new Promise((r) => setTimeout(r, 600));

      const title = await page.title();
      let passed = true;
      let notes = '';

      if (verifyFn) {
        const verifyResult = await verifyFn(page);
        passed = verifyResult.passed;
        notes = verifyResult.notes || '';
      }

      results.push({ name, path: pathStr, passed, notes, title });
      console.log(`  -> ${passed ? 'PASS' : 'FAIL'}: ${notes || 'Rendered successfully'}`);
    } catch (e) {
      console.error(`  -> FAIL [${name}]:`, e.message);
      results.push({ name, path: pathStr, passed: false, notes: e.message });
    }
  }

  // 1. Welcome Page (Unauthenticated)
  await testRoute(
    'Welcome Page',
    '/',
    async (p) => {
      await p.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    },
    async (p) => {
      const hasWelcomeText = await p.evaluate(() => {
        const text = document.body.innerText;
        return (
          text.includes('Verified Creators') &&
          text.includes('Escrow Protected') &&
          text.includes('Sync Latency SLA')
        );
      });
      const hasDuplicateAuth = await p.evaluate(() => {
        // Verify header has NO duplicate sign-in or register buttons
        const header = document.querySelector('header');
        if (!header) return false;
        const text = header.innerText.toLowerCase();
        return text.includes('sign in') || text.includes('register');
      });
      const hasSingleWelcomeAuth = await p.evaluate(() => {
        return Boolean(document.querySelector('.auth-pdf-tab-track'));
      });
      return {
        passed: hasWelcomeText && !hasDuplicateAuth && hasSingleWelcomeAuth,
        notes: `Welcome metrics verified, Header duplicate auth: ${hasDuplicateAuth ? 'FOUND (ERROR)' : 'NONE (CORRECT)'}, WelcomeAuth present: ${hasSingleWelcomeAuth}`,
      };
    }
  );

  // 2. Terms of Service
  await testRoute('Terms Page', '/terms', null, async (p) => {
    const text = await p.evaluate(() => document.body.innerText);
    const passed = text.includes('Terms of Service') || text.includes('Terms and Conditions');
    return { passed, notes: passed ? 'Terms page content verified' : 'Terms text missing' };
  });

  // 3. Privacy Policy
  await testRoute('Privacy Page', '/privacy', null, async (p) => {
    const text = await p.evaluate(() => document.body.innerText);
    const passed = text.includes('Privacy Policy') || text.includes('Privacy');
    return { passed, notes: passed ? 'Privacy page content verified' : 'Privacy text missing' };
  });

  // 4. Support Portal
  await testRoute('Support Portal', '/support', null, async (p) => {
    const text = await p.evaluate(() => document.body.innerText);
    const passed = text.includes('Support') || text.includes('Help') || text.includes('Ticket');
    return { passed, notes: passed ? 'Support portal verified' : 'Support text missing' };
  });

  // 5. Design System Demo
  await testRoute('Design System Demo', '/design-system', null, async (p) => {
    const text = await p.evaluate(() => document.body.innerText);
    const passed = text.includes('Design System') || text.includes('Tokens') || text.includes('Components');
    return { passed, notes: passed ? 'Design system demo verified' : 'Design system content missing' };
  });

  // 6. Creator Workspace Demo Login & Routes
  await testRoute(
    'Creator Workspace',
    '/',
    async (p) => {
      await p.evaluate(() => {
        const creatorSession = {
          user: {
            id: 'demo-creator-01',
            email: 'creator@demo.creatoros.ai',
            name: 'Aarav Sharma',
            role: 'creator',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          },
          token: 'demo_token_creator_verified',
          role: 'creator',
        };
        localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(creatorSession));
      });
    },
    async (p) => {
      const text = await p.evaluate(() => document.body.innerText);
      const isCreatorLayout =
        text.includes('Opportunities') ||
        text.includes('Contracts') ||
        text.includes('Earnings') ||
        text.includes('Live Studio');
      return { passed: isCreatorLayout, notes: 'Creator layout verified' };
    }
  );

  // 7. Brand Workspace Demo Login
  await testRoute(
    'Brand Workspace',
    '/',
    async (p) => {
      await p.evaluate(() => {
        const brandSession = {
          user: {
            id: 'demo-brand-01',
            email: 'brand@demo.creatoros.ai',
            name: 'Apex Brand Studio',
            role: 'business',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
          },
          token: 'demo_token_brand_verified',
          role: 'business',
        };
        localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(brandSession));
      });
    },
    async (p) => {
      const text = await p.evaluate(() => document.body.innerText);
      const isBrandLayout =
        text.includes('Campaigns') ||
        text.includes('Creators') ||
        text.includes('Outreach') ||
        text.includes('Brand');
      return { passed: isBrandLayout, notes: 'Brand workspace layout verified' };
    }
  );

  // 8. Admin Login & Command Center
  await testRoute(
    'Admin Command Center',
    '/admin',
    async (p) => {
      await p.evaluate(() => {
        localStorage.clear();
        const adminSession = {
          id: 'adm-01',
          name: 'Super Admin',
          role: 'super_admin',
          token: 'admin_demo_secret_token_verified',
          expiresAt: Date.now() + 86400000,
        };
        localStorage.setItem('creatoros_admin_session_v1', JSON.stringify(adminSession));
      });
    },
    async (p) => {
      const text = await p.evaluate(() => document.body.innerText);
      const isAdminLayout =
        text.includes('Admin') ||
        text.includes('Governance') ||
        text.includes('Command Center') ||
        text.includes('Super Admin');
      return { passed: isAdminLayout, notes: 'Super Admin Command Center verified' };
    }
  );

  await browser.close();

  console.log('\n--- VERIFICATION SUMMARY ---');
  let allPassed = true;
  for (const r of results) {
    if (!r.passed) allPassed = false;
    console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.name} (${r.path}): ${r.notes}`);
  }

  if (consoleErrors.length > 0) {
    console.log('\nLogged browser errors:');
    consoleErrors.forEach((e) => console.log(' - ' + e));
  } else {
    console.log('\nBrowser console clean (0 errors detected across all tested routes).');
  }

  return allPassed;
}

testAllRoutes()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error('Test runner fatal error:', err);
    process.exit(1);
  });
