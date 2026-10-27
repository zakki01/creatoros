const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5173';
const ARTIFACTS_DIR = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runBaselineAudit() {
  console.log('--- STARTING BASELINE AUDIT ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Login as creator
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
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
      localStorage.setItem('creatoros_theme_v1', 'light');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(600);

    // Navigate to Earnings
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('button, a'));
      const earningsBtn = links.find((el) => el.textContent && el.textContent.includes('Earnings'));
      if (earningsBtn) earningsBtn.click();
    });
    await sleep(700);

    // Capture Light Mode Earnings
    const lightPath = path.join(ARTIFACTS_DIR, 'baseline_earnings_light.png');
    await page.screenshot({ path: lightPath, fullPage: false });
    console.log('Saved baseline_earnings_light.png');

    // Inspect Computed Styles in Light Mode
    const lightAudit = await page.evaluate(() => {
      const results = {};
      const h1 = document.querySelector('h1');
      if (h1) results.h1 = { text: h1.textContent, color: getComputedStyle(h1).color };

      const totalEarnedSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Total Earned'));
      if (totalEarnedSpan && totalEarnedSpan.nextElementSibling) {
        results.totalEarned = {
          labelColor: getComputedStyle(totalEarnedSpan).color,
          valueColor: getComputedStyle(totalEarnedSpan.nextElementSibling).color,
          valueText: totalEarnedSpan.nextElementSibling.textContent,
          textDecoration: getComputedStyle(totalEarnedSpan.nextElementSibling).textDecoration,
          borderBottom: getComputedStyle(totalEarnedSpan.nextElementSibling).borderBottom,
        };
      }
      return results;
    });
    console.log('Light Audit:', JSON.stringify(lightAudit, null, 2));

    // Switch to Dark Mode
    await page.evaluate(() => {
      const themeToggle = document.querySelector('button[title*="theme" i], button[aria-label*="theme" i]');
      if (themeToggle) {
        themeToggle.click();
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
        localStorage.setItem('creatoros_theme_v1', 'dark');
      }
    });
    await sleep(700);

    // Capture Dark Mode Earnings
    const darkPath = path.join(ARTIFACTS_DIR, 'baseline_earnings_dark.png');
    await page.screenshot({ path: darkPath, fullPage: false });
    console.log('Saved baseline_earnings_dark.png');

    // Inspect Computed Styles in Dark Mode
    const darkAudit = await page.evaluate(() => {
      const results = {};
      const h1 = document.querySelector('h1');
      if (h1) {
        results.h1 = {
          text: h1.textContent,
          color: getComputedStyle(h1).color,
          bg: getComputedStyle(document.body).backgroundColor,
        };
      }

      const totalEarnedSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Total Earned'));
      if (totalEarnedSpan && totalEarnedSpan.nextElementSibling) {
        results.totalEarned = {
          labelColor: getComputedStyle(totalEarnedSpan).color,
          valueColor: getComputedStyle(totalEarnedSpan.nextElementSibling).color,
          valueText: totalEarnedSpan.nextElementSibling.textContent,
          textDecoration: getComputedStyle(totalEarnedSpan.nextElementSibling).textDecoration,
          borderBottom: getComputedStyle(totalEarnedSpan.nextElementSibling).borderBottom,
        };
      }

      // Check remittance rows
      const historyHeading = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Payout History'));
      if (historyHeading) {
        results.historyHeading = {
          color: getComputedStyle(historyHeading).color,
        };
      }

      // Check card text
      const cards = Array.from(document.querySelectorAll('.surface-2'));
      results.cardSampleColors = cards.slice(0, 3).map(c => ({
        bg: getComputedStyle(c).backgroundColor,
        color: getComputedStyle(c).color,
      }));

      return results;
    });
    console.log('Dark Audit:', JSON.stringify(darkAudit, null, 2));

  } finally {
    await browser.close();
  }
}

runBaselineAudit().catch(console.error);
