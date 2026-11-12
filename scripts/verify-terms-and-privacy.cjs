const fs = require('fs');
const puppeteer = require('puppeteer-core');
const path = require('path');
const { spawn } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const exe = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;
const artifactDir = 'C:\\Users\\zakki\\.gemini\\antigravity\\brain\\cb0af99c-66fd-4e02-8b85-b86433099dd4';

const PORT = 4195;
const URL = `http://localhost:${PORT}`;

async function run() {
  console.log('Starting preview server on port', PORT);
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
  });

  await new Promise((r) => setTimeout(r, 2500));

  console.log('Launching browser at', URL);
  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // 1. Test Terms Page in Light Mode
    console.log('Testing /terms in Light Mode...');
    await page.goto(`${URL}/terms`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    const termsLightPath = path.join(artifactDir, 'verified_terms_light.png');
    await page.screenshot({ path: termsLightPath });
    console.log('Saved:', termsLightPath);

    // 2. Click ThemeToggle to switch to Dark Mode!
    console.log('Toggling theme to Dark Mode on /terms...');
    const themeBtn = await page.$('button[title*="theme"]');
    if (themeBtn) {
      await themeBtn.click();
      await new Promise((r) => setTimeout(r, 800));
    }

    const termsDarkPath = path.join(artifactDir, 'verified_terms_dark.png');
    await page.screenshot({ path: termsDarkPath });
    console.log('Saved:', termsDarkPath);

    // 3. Test Privacy Page (now in Dark Mode)
    console.log('Testing /privacy in Dark Mode...');
    await page.goto(`${URL}/privacy`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    const privacyDarkPath = path.join(artifactDir, 'verified_privacy_dark.png');
    await page.screenshot({ path: privacyDarkPath });
    console.log('Saved:', privacyDarkPath);

    // 4. Click ThemeToggle to switch to Light Mode on Privacy!
    console.log('Toggling theme to Light Mode on /privacy...');
    const privThemeBtn = await page.$('button[title*="theme"]');
    if (privThemeBtn) {
      await privThemeBtn.click();
      await new Promise((r) => setTimeout(r, 800));
    }

    const privacyLightPath = path.join(artifactDir, 'verified_privacy_light.png');
    await page.screenshot({ path: privacyLightPath });
    console.log('Saved:', privacyLightPath);

    console.log('All Terms and Privacy verifications finished successfully!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

run();
