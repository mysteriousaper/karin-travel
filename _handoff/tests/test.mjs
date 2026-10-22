import puppeteer from 'puppeteer-core';
const root = 'file:///C:/Users/user/Desktop/karin%20travel%20agency/website-offline/';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] });
const p = await b.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push('PAGEERR ' + e.message.slice(0, 200)));
p.on('requestfailed', (r) => errs.push('FAIL ' + r.url().slice(-80)));
p.on('console', (m) => m.type() === 'error' && errs.push('CONSOLE ' + m.text().slice(0, 160)));
await p.setViewport({ width: 1440, height: 900 });
await p.goto('file:///C:/Users/user/Desktop/karin%20travel%20agency/Open%20Karin%20website%20(offline).html', { waitUntil: 'networkidle0' });
console.log('url', p.url());
const info = await p.evaluate(async () => {
  await document.fonts.ready;
  const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family).slice(0, 6);
  const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length;
  // hydration check: click next slide
  const next = document.querySelectorAll('#top button[aria-label]');
  const counterBefore = document.querySelector('#top .tabular-nums')?.textContent;
  [...next].find((x) => x.className.includes('bg-cream') && x.querySelector('svg'))?.click();
  await new Promise((r) => setTimeout(r, 800));
  const counterAfter = document.querySelector('#top .tabular-nums')?.textContent;
  return { fonts, broken, imgs: document.images.length, counterBefore, counterAfter };
});
console.log(JSON.stringify(info));
await p.screenshot({ path: 'off-home.png' });
// currency switch
await p.evaluate(() => document.querySelector('.cur-menu button').click());
await new Promise((r) => setTimeout(r, 300));
await p.evaluate(() => [...document.querySelectorAll('.cur-menu button[aria-pressed]')][1].click());
await new Promise((r) => setTimeout(r, 300));
console.log('price after USD:', await p.evaluate(() => document.querySelector('#top .tabular-nums ~ *')?.textContent || [...document.querySelectorAll('.tabular-nums')].map(e=>e.textContent).slice(0,4).join(' | ')));
// navigate via link: Tours in nav
await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle0' }), p.evaluate(() => [...document.querySelectorAll('nav.nav-main a')][1].click())]);
console.log('after nav click:', p.url(), await p.title());
// language switch
await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle0' }), p.evaluate(() => [...document.querySelectorAll('.lang-seg a')][2].click())]);
console.log('after lang click:', p.url(), await p.title());
// open a tour
await Promise.all([p.waitForNavigation({ waitUntil: 'networkidle0' }), p.evaluate(() => document.querySelector('article h3 a').click())]);
console.log('tour:', p.url(), await p.title());
// enquiry form submit
await p.evaluate(() => [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Book this trip')).click());
await new Promise((r) => setTimeout(r, 400));
await p.type('dialog[open] input[name=phone]', '+37498000000');
await p.evaluate(() => document.querySelector('dialog[open] form').requestSubmit());
await new Promise((r) => setTimeout(r, 700));
console.log('form:', await p.evaluate(() => (document.querySelector('dialog[open] [role=status]')?.textContent || 'no status').slice(0, 80)), '| toast:', await p.evaluate(() => !!document.getElementById('offline-note')));
await p.screenshot({ path: 'off-tour.png' });
console.log('errors:', errs.length, errs.slice(0, 8));
await b.close();
