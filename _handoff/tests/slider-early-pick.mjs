import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
for (const [label, url] of [['live', 'http://localhost:3100/hy'], ['offline', 'file:///C:/Users/user/Desktop/karin%20travel%20agency/website-offline/hy/index.html']]) {
  const p = await b.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 600));
  const early = await p.evaluate(async () => {
    const imgs = () => [...document.querySelectorAll('#top > img')];
    const before = imgs().length;
    // pick Prague right away (no pointer movement yet)
    [...document.querySelectorAll('#top button')].find((x) => (x.getAttribute('aria-label') || '').includes('Պրահա')).click();
    const t0 = performance.now();
    let firstVisible = null, sharp = null;
    while (performance.now() - t0 < 6000 && sharp === null) {
      const pr = imgs().find((i) => (i.getAttribute('src') || '').includes('prague-1'));
      if (pr && getComputedStyle(pr).opacity !== '0' && firstVisible === null) firstVisible = Math.round(performance.now() - t0);
      if (pr && pr.complete && pr.naturalWidth > 0 && getComputedStyle(pr).opacity === '1') sharp = Math.round(performance.now() - t0);
      await new Promise((r) => setTimeout(r, 50));
    }
    const pr = imgs().find((i) => (i.getAttribute('src') || '').includes('prague-1'));
    return { mountedBeforeClick: before, praguePreviewShownAfterMs: firstVisible, pragueSharpAfterMs: sharp, hasBlurPreview: !!pr && pr.style.backgroundImage.includes('data:image') };
  });
  await new Promise((r) => setTimeout(r, 4500));
  const later = await p.evaluate(() => [...document.querySelectorAll('#top > img')].map((i) => i.complete && i.naturalWidth > 0));
  console.log(label, JSON.stringify(early), 'after ~5s all loaded:', later.join(','), 'errors:', errs.length);
  await p.close();
}
await b.close();
