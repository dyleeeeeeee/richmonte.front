const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem("invbank_mock_mode", "true");
    localStorage.setItem("auth_token", "mock-token-abc");
    localStorage.setItem("invbank_user", JSON.stringify({id: "1", full_name: "Test User", email: "test@test.com", role: "admin"}));
  });
  await page.goto('http://localhost:3000/dashboard/cards', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/tmp/cards_fixed.png' });
  await page.goto('http://localhost:3000/dashboard/transfers', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/tmp/transfers_fixed.png' });
  await page.goto('http://localhost:3000/dashboard/accounts', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/tmp/accounts_fixed.png' });
  await browser.close();
})();
