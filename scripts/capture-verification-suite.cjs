const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
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

  // 1. Dark Mode Tests
  await page.evaluate(() => {
    localStorage.setItem('creatoros_theme_v1', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });

  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 1000));

  // Capture Creator Home Dark
  await page.screenshot({ path: path.join(outDir, 'verify_final_creator_home_dark.png') });

  // Capture Contracts Dark
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const contractsBtn = btns.find(b => b.textContent && b.textContent.includes('Contracts'));
    if (contractsBtn) contractsBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'verify_final_contracts_dark.png') });

  // Capture Desktop Live Studio Dark
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const homeBtn = btns.find(b => b.textContent && b.textContent.includes('Home'));
    if (homeBtn) homeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => {
    const openStudioBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Open Studio'));
    if (openStudioBtn) openStudioBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Inspect Live Studio hero camera dimensions in Desktop Dark
  const studioMetrics = await page.evaluate(() => {
    const videoViewport = document.querySelector('div[style*="aspect-ratio"]');
    const audienceRail = document.querySelector('aside');
    return {
      viewportRect: videoViewport ? { width: videoViewport.offsetWidth, height: videoViewport.offsetHeight } : null,
      audienceRect: audienceRail ? { width: audienceRail.offsetWidth, height: audienceRail.offsetHeight } : null,
    };
  });
  console.log('Desktop Live Studio Metrics (Dark):', studioMetrics);

  await page.screenshot({ path: path.join(outDir, 'verify_final_desktop_live_studio_dark.png') });

  // 2. Light Mode Tests
  await page.evaluate(() => {
    localStorage.setItem('creatoros_theme_v1', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  });

  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 1000));

  // Capture Creator Home Light
  await page.screenshot({ path: path.join(outDir, 'verify_final_creator_home_light.png') });

  // Capture Contracts Light
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const contractsBtn = btns.find(b => b.textContent && b.textContent.includes('Contracts'));
    if (contractsBtn) contractsBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, 'verify_final_contracts_light.png') });

  // Capture Desktop Live Studio Light
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button'));
    const homeBtn = btns.find(b => b.textContent && b.textContent.includes('Home'));
    if (homeBtn) homeBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => {
    const openStudioBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Open Studio'));
    if (openStudioBtn) openStudioBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'verify_final_desktop_live_studio_light.png') });

  // 3. Mobile Viewport Live Studio Test (100dvh, 390x844)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const openStudioBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Open Studio'));
    if (openStudioBtn) openStudioBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'verify_final_mobile_live_100dvh.png') });

  await browser.close();
  console.log('All verification screenshots captured successfully!');
})();
