const { chromium } = require('C:/Users/Dwij/AppData/Local/npm-cache/_npx/fd3bca3c548369c0/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/Dwij/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(`file:///${path.join(__dirname, 'instagram-story.html').replace(/\\/g, '/')}`);
  await page.screenshot({ path: path.join(__dirname, 'dwij-portfolio-story.png'), fullPage: true });
  await browser.close();
})();
