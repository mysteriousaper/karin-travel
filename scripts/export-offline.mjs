// Builds an offline copy of the website that opens straight from disk
// (double-click index.html — no Node, no server).
//
//   1. npm run build
//   2. npx next start -p 3100        (in another terminal)
//   3. node scripts/export-offline.mjs
//
// Output: ./website-offline/  — every page in HY/RU/EN, photos, fonts and the
// site's JavaScript (slider, menus, language/currency/font switches). Forms
// can't reach the server offline; they show a note instead of sending.
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = process.env.EXPORT_ORIGIN || 'http://localhost:3100';
const ROOT = process.cwd();
const OUT = path.join(ROOT, 'website-offline');

// ---------------------------------------------------------------- pages
const sitemap = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
const pages = new Set(
  [...sitemap.matchAll(/(?:<loc>|href=")(https?:\/\/[^<"]+)/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/hy')
);
console.log(`${pages.size} pages`);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

// Static assets: the whole Next build output and the public folder.
await cp(path.join(ROOT, '.next', 'static'), path.join(OUT, '_next', 'static'), { recursive: true });
for (const entry of await readdir(path.join(ROOT, 'public'))) {
  await cp(path.join(ROOT, 'public', entry), path.join(OUT, entry), { recursive: true });
}

// ---------------------------------------------------------------- shim
// Runs before Next.js on every page. It (1) loads chunks relative to the page,
// (2) turns site links like "/ru/tours" into ".../ru/tours/index.html",
// (3) points optimised-image URLs at the original photos, (4) keeps Next's
// router from rewriting the address bar and (5) answers the form APIs locally.
const shim = (base) => `<script data-base="${base}">(function(){
var B=document.currentScript.dataset.base;self.__KARIN_BASE=B;
function page(u){var h='',i=u.indexOf('#');if(i>=0){h=u.slice(i);u=u.slice(0,i)}i=u.indexOf('?');if(i>=0)u=u.slice(0,i);var p=u.replace(/^\\/+|\\/+$/g,'');return B+(p||'hy')+'/index.html'+h}
function img(u){if(!u||u.charAt(0)!=='/'||u.charAt(1)==='/')return u;var m=u.match(/^\\/_next\\/image\\?url=([^&\\s]+)/);if(m)return B+decodeURIComponent(m[1]).replace(/^(\\.\\.\\/)+|^\\.?\\//,'');if(/^\\/(images|fonts|_next|icon|apple-icon)/.test(u))return B+u.slice(1);return u}
function fixImg(el){var s=el.getAttribute('src');if(s&&s.charAt(0)==='/'){var n=img(s);if(n!==s)el.setAttribute('src',n)}var ss=el.getAttribute('srcset');if(ss&&ss.indexOf('/_next/image')>=0)el.removeAttribute('srcset')}
new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes'){if(m.target.tagName==='IMG')fixImg(m.target)}else m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.tagName==='IMG')fixImg(n);n.querySelectorAll&&n.querySelectorAll('img').forEach(fixImg)})})}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','srcset']});
['pushState','replaceState'].forEach(function(k){var o=history[k];history[k]=function(s,t){try{return o.call(history,s,t)}catch(e){}}});
addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey)return;var h=a.getAttribute('href');if(/^(https?:|mailto:|tel:|#)/.test(h))return;e.stopImmediatePropagation();if(h.charAt(0)==='/'&&h.charAt(1)!=='/'){e.preventDefault();location.href=page(h)}},true);
function toast(){if(document.getElementById('offline-note'))return;var d=document.createElement('div');d.id='offline-note';d.setAttribute('role','status');d.style.cssText='position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:99999;max-width:min(92vw,520px);padding:12px 18px;border-radius:999px;background:#E8A33D;color:#0F0F0E;font:600 13px/1.4 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.35);text-align:center';d.textContent='Offline preview: this form is not sent. On the live site it goes to the admin inbox and Telegram.';(document.querySelector('dialog[open]')||document.body).appendChild(d);setTimeout(function(){d.remove()},6000)}
var f=self.fetch;self.fetch=function(u,o){var s=typeof u==='string'?u:u instanceof URL?u.href:(u&&u.url)||'';if(s.indexOf('_rsc=')>=0)return new Promise(function(){});if(/^\\/api\\/(enquiries|subscribe)/.test(s)){toast();return Promise.resolve(new Response('{"ok":true}',{status:200,headers:{'Content-Type':'application/json'}}))}if(s.charAt(0)==='/'&&s.charAt(1)!=='/')return Promise.reject(new TypeError('offline'));return f.apply(this,arguments)};
})();</script>`;

// ---------------------------------------------------------------- html
function rewrite(html, depth) {
  const base = depth ? '../'.repeat(depth) : './';
  return (
    html
      // optimised images → the original photo
      .replace(/\/_next\/image\?url=([^&"\s]+)(?:&amp;|&)w=\d+(?:&amp;|&)q=\d+/g, (_, u) => base + decodeURIComponent(u).replace(/^\//, ''))
      // assets
      .replace(/(["'(\s,])\/(_next\/static|images|fonts|icon\.svg|apple-icon\.png)/g, `$1${base}$2`)
      // internal page links
      .replace(/href="\/(hy|ru|en)((?:\/[\w-]+)*)\/?(#[\w-]*)?"/g, (_, l, p, h) => `href="${base}${l}${p}/index.html${h ?? ''}"`)
      // alternates/canonical are for search engines; keep them pointing at the real site
      .replace('<head>', `<head>${shim(base)}`)
  );
}

let n = 0;
for (const p of pages) {
  const res = await fetch(ORIGIN + p);
  if (!res.ok) throw new Error(`${p} → ${res.status}`);
  const depth = p.split('/').filter(Boolean).length;
  const file = path.join(OUT, ...p.split('/').filter(Boolean), 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, rewrite(await res.text(), depth));
  n++;
}

// Root: open the Armenian home page.
await writeFile(
  path.join(OUT, 'index.html'),
  `<!doctype html><html lang="hy"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=hy/index.html"><title>Karin Travel</title></head><body style="background:#0F0F0E;color:#F2EEE7;font-family:system-ui;padding:24px"><a href="hy/index.html" style="color:#F6D7A8">Karin Travel — Հայերեն</a> · <a href="ru/index.html" style="color:#F6D7A8">Русский</a> · <a href="en/index.html" style="color:#F6D7A8">English</a></body></html>`
);

// ---------------------------------------------------------------- css + js
const cssDir = path.join(OUT, '_next', 'static', 'css');
for (const f of await readdir(cssDir)) {
  const p = path.join(cssDir, f);
  const css = (await readFile(p, 'utf8')).replace(/url\(\/_next\/static\/media\//g, 'url(../media/').replace(/url\(\/fonts\//g, 'url(../../../fonts/');
  await writeFile(p, css);
}
// JS: load chunks relative to the page, and let next/image use the photo
// files directly (there is no image optimiser offline).
const chunkDir = path.join(OUT, '_next', 'static', 'chunks');
for (const f of await readdir(chunkDir, { recursive: true })) {
  if (!f.endsWith('.js')) continue;
  const p = path.join(chunkDir, f);
  const js = await readFile(p, 'utf8');
  const out = js
    .replace('.p="/_next/"', '.p=(self.__KARIN_BASE||"/")+"_next/"')
    .replace(/(path:"\/_next\/image"[^}]*?unoptimized:)!1/g, '$1!0');
  if (out !== js) await writeFile(p, out);
}

console.log(`Wrote ${n} pages to ${path.relative(ROOT, OUT)}${path.sep}index.html`);
