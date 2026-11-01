const puppeteer = require('puppeteer-core');
const path = require('path');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 }); // iPhone 12/13/14

  // 1. Live Brand Workspace in Dark Mode
  console.log('Navigating to live Brand Dark...');
  await page.goto('https://creatoros-fawn-iota.vercel.app/', { waitUntil: 'networkidle0' });
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

  const brandPath = path.join(__dirname, '../live_brand_dark_390.png');
  await page.screenshot({ path: brandPath });
  console.log('Brand screenshot saved to', brandPath);

  // 2. Live Creator Workspace in Light Mode
  console.log('Navigating to live Creator Light...');
  await page.evaluate(() => {
    localStorage.clear();
    const demoCreator = {
      id: 'demo-creator-01',
      name: 'Rohan Sharma',
      email: 'demo.creator@creatoros.ai',
      role: 'creator',
      handle: '@rohansharma',
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

  const creatorPath = path.join(__dirname, '../live_creator_light_390.png');
  await page.screenshot({ path: creatorPath });
  console.log('Creator screenshot saved to', creatorPath);

  await browser.close();
  console.log('Finished capturing live production screenshots.');
})();
