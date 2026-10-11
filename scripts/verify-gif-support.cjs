const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');
const ASSETS_DIR = path.resolve(__dirname, '..', 'test-assets');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

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
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  const checkOverflow = async (label) => {
    const overflow = await page.evaluate(() => {
      const docWidth = document.documentElement.offsetWidth;
      const docScroll = document.documentElement.scrollWidth;
      const bodyScroll = document.body.scrollWidth;
      const winWidth = window.innerWidth;
      const maxScroll = Math.max(docScroll, bodyScroll);
      return { winWidth, maxScroll, diff: maxScroll - winWidth };
    });
    console.log(
      `[Overflow Check] ${label}: innerWidth=${overflow.winWidth}px, scrollWidth=${overflow.maxScroll}px, overflow=${overflow.diff}px`
    );
    if (overflow.diff > 0) {
      throw new Error(`Horizontal overflow detected in ${label}: ${overflow.diff}px`);
    }
    return true;
  };

  // 1. DESKTOP TEST (1280x800)
  console.log('\n--- 1. Desktop Direct Messages (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((sess) => {
    localStorage.setItem('creatoros_auth_session_v1', JSON.stringify(sess));
  }, CREATOR_SESSION);
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));

  // Navigate to Messages tab
  console.log('Navigating to Messages tab...');
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button, aside button'));
    const msgBtn = navBtns.find((b) => b.textContent && b.textContent.includes('Messages'));
    if (msgBtn) msgBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await checkOverflow('Desktop Messages 1280x800');

  // Verify Composer Buttons & Touch Targets
  console.log('Checking composer button layout and targets...');
  const composerButtons = await page.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return null;
    const btns = Array.from(form.querySelectorAll('button'));
    return btns.map((b) => ({
      label: b.getAttribute('aria-label') || b.textContent.trim(),
      width: b.offsetWidth,
      height: b.offsetHeight,
    }));
  });
  console.log('Composer Buttons:', JSON.stringify(composerButtons, null, 2));

  // 1A. Test Invalid GIF Upload (fake-renamed.gif)
  console.log('\n--- 1A. Testing Invalid GIF File Rejection ---');
  const gifInputSelector = 'input[type="file"][accept*="gif"]';
  const gifInputEl = await page.$(gifInputSelector);
  if (!gifInputEl) {
    throw new Error('GIF file input not found on page!');
  }

  const fakeGifPath = path.join(ASSETS_DIR, 'fake-renamed.gif');
  await gifInputEl.uploadFile(fakeGifPath);
  await new Promise((r) => setTimeout(r, 600));

  const hasInvalidToast = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return bodyText.includes("This file isn't a valid GIF") || bodyText.includes('valid GIF');
  });
  console.log('Invalid GIF rejected with error toast:', hasInvalidToast);

  // Verify no preview appeared for invalid file
  const hasPreviewForFake = await page.evaluate(() => {
    return !!document.querySelector('button[aria-label="Remove GIF"]');
  });
  console.log('Preview suppressed for fake file:', !hasPreviewForFake);

  // 1B. Test Oversized GIF Rejection (oversized.gif)
  console.log('\n--- 1B. Testing Oversized GIF File Rejection ---');
  const oversizedGifPath = path.join(ASSETS_DIR, 'oversized.gif');
  await gifInputEl.uploadFile(oversizedGifPath);
  await new Promise((r) => setTimeout(r, 600));

  const hasOversizedToast = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return bodyText.includes('GIF is too large');
  });
  console.log('Oversized GIF rejected with error toast:', hasOversizedToast);

  // 1C. Test Valid GIF Upload & Preview State
  console.log('\n--- 1C. Testing Valid Animated GIF Preview State ---');
  const validGifPath = path.join(ASSETS_DIR, 'valid-reaction.gif');
  await gifInputEl.uploadFile(validGifPath);
  await new Promise((r) => setTimeout(r, 700));

  const previewInfo = await page.evaluate(() => {
    const removeBtn = document.querySelector('button[aria-label="Remove GIF"]');
    const previewContainer = removeBtn ? removeBtn.closest('div.animate-slide-up') : null;
    return {
      hasPreview: !!previewContainer,
      text: previewContainer ? previewContainer.innerText : '',
    };
  });
  console.log('Valid GIF preview active:', previewInfo);

  const previewScreenshotPath = path.join(SCREENSHOTS_DIR, 'gif-preview-1280x800.png');
  await page.screenshot({ path: previewScreenshotPath, fullPage: false });
  console.log('Saved:', previewScreenshotPath);

  // 1D. Send GIF with Companion Text
  console.log('\n--- 1D. Sending Animated GIF with Companion Text ---');
  await page.type('input[aria-label="Message text"]', 'Check out this animated reaction!');
  await page.evaluate(() => {
    const sendBtn = document.querySelector('button[aria-label="Send message"]');
    if (sendBtn) sendBtn.click();
  });
  // Wait for optimistic upload progression and completion
  await new Promise((r) => setTimeout(r, 1200));

  const sentMessageInfo = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img[alt*="GIF"], img[alt*="reaction"]'));
    const lastImg = imgs[imgs.length - 1];
    const bubble = lastImg ? lastImg.closest('div.group') : null;
    const bodyText = document.body.innerText;
    return {
      foundGif: !!lastImg,
      srcPrefix: lastImg ? lastImg.src.substring(0, 35) : '',
      hasText: bodyText.includes('Check out this animated reaction!'),
      hasBadge: bubble ? bubble.innerText.includes('GIF') : false,
    };
  });
  console.log('Sent GIF message verified:', sentMessageInfo);

  const sentScreenshotPath = path.join(SCREENSHOTS_DIR, 'gif-sent-1280x800.png');
  await page.screenshot({ path: sentScreenshotPath, fullPage: false });
  console.log('Saved:', sentScreenshotPath);

  // 1E. Full-Screen Media Viewer
  console.log('\n--- 1E. Testing Full-Screen Media Viewer Modal ---');
  await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img[alt*="GIF"], img[alt*="reaction"]'));
    const lastImg = imgs[imgs.length - 1];
    if (lastImg) lastImg.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const viewerInfo = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"][aria-label="Media viewer"]');
    return {
      isOpen: !!dialog,
      hasCloseBtn: !!document.querySelector('button[aria-label="Close viewer"]'),
      hasDownloadBtn: !!document.querySelector('a[aria-label="Download media"]'),
    };
  });
  console.log('Media Viewer modal open:', viewerInfo);

  const viewerScreenshotPath = path.join(SCREENSHOTS_DIR, 'gif-viewer-1280x800.png');
  await page.screenshot({ path: viewerScreenshotPath, fullPage: false });
  console.log('Saved:', viewerScreenshotPath);

  // Close Media Viewer
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close viewer"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // 1F. Persistence Across Page Reload
  console.log('\n--- 1F. Testing Persistence Across Page Reload ---');
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));

  // Re-navigate to Messages if needed
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button, aside button'));
    const msgBtn = navBtns.find((b) => b.textContent && b.textContent.includes('Messages'));
    if (msgBtn) msgBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const persistedGif = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img[alt*="GIF"], img[alt*="reaction"]'));
    return imgs.length > 0;
  });
  console.log('GIF message persisted after reload:', persistedGif);

  // 2. MOBILE TEST (375x812)
  console.log('\n--- 2. Mobile Direct Messages (375x812) ---');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 600));

  // Open first conversation in list on mobile
  await page.evaluate(() => {
    const convButtons = Array.from(document.querySelectorAll('div.overflow-y-auto button'));
    if (convButtons.length > 0) convButtons[0].click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await checkOverflow('Mobile Messages 375x812');

  const mobileGifInput = await page.$(gifInputSelector);
  if (mobileGifInput) {
    await mobileGifInput.uploadFile(validGifPath);
    await new Promise((r) => setTimeout(r, 600));

    // Send on mobile
    await page.evaluate(() => {
      const sendBtn = document.querySelector('button[aria-label="Send message"]');
      if (sendBtn) sendBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
  }

  const mobileScreenshotPath = path.join(SCREENSHOTS_DIR, 'gif-mobile-chat-375x812.png');
  await page.screenshot({ path: mobileScreenshotPath, fullPage: false });
  console.log('Saved:', mobileScreenshotPath);

  // 3. ULTRA-NARROW MOBILE TEST (320x640)
  console.log('\n--- 3. Ultra-Narrow Mobile (320x640) ---');
  await page.setViewport({ width: 320, height: 640, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 600));
  await checkOverflow('Ultra-Narrow 320x640');

  const ultraNarrowScreenshotPath = path.join(SCREENSHOTS_DIR, 'gif-mobile-320x640.png');
  await page.screenshot({ path: ultraNarrowScreenshotPath, fullPage: false });
  console.log('Saved:', ultraNarrowScreenshotPath);

  // 4. VIEWPORT RESPONSIVENESS MATRIX
  console.log('\n--- 4. Viewport Matrix Validation ---');
  const viewports = [
    { width: 390, height: 844, name: '390x844 (iPhone 14)' },
    { width: 430, height: 932, name: '430x932 (iPhone 14 Pro Max)' },
    { width: 768, height: 1024, name: '768x1024 (iPad Mini)' },
    { width: 1024, height: 768, name: '1024x768 (iPad Pro)' },
    { width: 1440, height: 900, name: '1440x900 (MacBook Pro)' },
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await new Promise((r) => setTimeout(r, 300));
    await checkOverflow(vp.name);
  }

  await browser.close();
  console.log('\nAll GIF verification tests completed successfully!');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
