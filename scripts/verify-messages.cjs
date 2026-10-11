const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');

const CREATOR_SESSION = {
  id: 'cr-101',
  name: 'Rohan Sharma',
  email: 'rohan.sharma@creatoros.ai',
  role: 'creator',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  handle: '@rohansharma_style',
  provider: 'demo',
  isDemo: true,
};

async function run() {
  console.log('Connecting to browser at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test 1: Desktop Messages (1280x800)
  console.log('\n--- Test 1: Desktop Messages (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, CREATOR_SESSION);
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Navigate to Messages tab on desktop
  console.log('Clicking Messages nav link on desktop...');
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button, aside button'));
    const msgBtn = navBtns.find(b => b.textContent && b.textContent.includes('Messages'));
    if (msgBtn) msgBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const desktopScreenshot = path.join(SCREENSHOTS_DIR, 'messages-desktop-1280x800.png');
  await page.screenshot({ path: desktopScreenshot, fullPage: false });
  console.log('Saved:', desktopScreenshot);

  // Test 2: Mobile Messages Master List (375x812)
  console.log('\n--- Test 2: Mobile Messages Master List (375x812) ---');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 800));

  // If in active chat, click back button to return to master list
  await page.evaluate(() => {
    const backBtn = document.querySelector('button[aria-label="Back to conversations"]');
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const mobileListScreenshot = path.join(SCREENSHOTS_DIR, 'messages-mobile-list-375x812.png');
  await page.screenshot({ path: mobileListScreenshot, fullPage: false });
  console.log('Saved:', mobileListScreenshot);

  // Test 3: Mobile Messages Detail Chat Thread (375x812)
  console.log('\n--- Test 3: Mobile Messages Detail Chat Thread (375x812) ---');
  // Click first conversation item
  await page.evaluate(() => {
    const convButtons = Array.from(document.querySelectorAll('div.overflow-y-auto button'));
    if (convButtons.length > 0) convButtons[0].click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const mobileChatScreenshot = path.join(SCREENSHOTS_DIR, 'messages-mobile-chat-375x812.png');
  await page.screenshot({ path: mobileChatScreenshot, fullPage: false });
  console.log('Saved:', mobileChatScreenshot);

  // Test 4: Open Emoji Picker on Mobile
  console.log('\n--- Test 4: Mobile Emoji Picker Open ---');
  await page.evaluate(() => {
    const emojiBtn = document.querySelector('button[aria-label="Insert emoji"]');
    if (emojiBtn) emojiBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const mobileEmojiScreenshot = path.join(SCREENSHOTS_DIR, 'messages-mobile-emoji-375x812.png');
  await page.screenshot({ path: mobileEmojiScreenshot, fullPage: false });
  console.log('Saved:', mobileEmojiScreenshot);

  await browser.close();
  console.log('Verification completed successfully!');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
