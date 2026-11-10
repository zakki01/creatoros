const puppeteer = require('puppeteer-core');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const execPath = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

(async () => {
  const browser = await puppeteer.launch({ executablePath: execPath, headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to https://creatoros-fawn-iota.vercel.app/godmode ...');
  await page.goto('https://creatoros-fawn-iota.vercel.app/godmode', { waitUntil: 'networkidle2' });
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log('--- Page text on /godmode ---');
  console.log(text.substring(0, 300));
  
  const hasLoginElements = text.includes('Super Admin Access') || text.includes('CreatorOS Command Center');
  const has404 = text.includes('404') || text.includes('Page not found');
  console.log('Has Login Elements:', hasLoginElements);
  console.log('Has 404:', has404);
  
  await page.screenshot({ path: 'C:/Users/zakki/.gemini/antigravity/brain/cb0af99c-66fd-4e02-8b85-b86433099dd4/live_godmode_fixed.png' });
  
  // Test autofill & login
  console.log('Autofilling credentials...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Autofill'));
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 500));
  
  console.log('Clicking Authorize & Sign In...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.textContent && b.textContent.includes('Authorize & Sign In'));
    if (submitBtn) submitBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2500));
  
  const postLoginText = await page.evaluate(() => document.body.innerText);
  console.log('--- Post-Login text ---');
  console.log(postLoginText.substring(0, 400));
  const inCommandCenter = postLoginText.includes('God Mode') || postLoginText.includes('Chat Inspector') || postLoginText.includes('Contracts') || postLoginText.includes('Beta Access');
  console.log('In Command Center:', inCommandCenter);
  
  await page.screenshot({ path: 'C:/Users/zakki/.gemini/antigravity/brain/cb0af99c-66fd-4e02-8b85-b86433099dd4/live_godmode_authenticated.png' });
  
  await browser.close();
})();
