// scripts/prerender.mjs
//
// Build-time prerender for the 88spa customer site.
//
// Problem: the site is a React SPA, so the built index.html ships an empty
// `<div id="root"></div>` and every word of content (H1, treatment menu,
// prices, FAQ, reviews) only appears after the JS bundle runs and the menu
// API answers. Search engines do render JS eventually, but the first-pass
// HTML carries nothing — that is the main reason the new domain ranks far
// behind the old static site (www.88headspaandmassage.com), whose prices
// and headings are all in its HTML.
//
// What this does: after `vite build`, it injects a static, human-readable
// copy of the homepage into dist/index.html, inside #root — H1, intro,
// the full treatment menu with live prices, add-ons, reviews, FAQ, and
// address/hours. React's createRoot clears #root on mount, so visitors
// always see the live app; crawlers see the full content on first load.
//
// Content is never hand-written twice:
//   - menu names/prices/durations come from the live D1 API at build time,
//     mapped to English with the same transformServiceData() the app uses;
//   - FAQ + testimonials are imported from src/data/*.js, the same files
//     the React components render from.
//
// Safety: this script must NEVER fail the build. Every failure path logs a
// warning and exits 0, leaving dist/index.html as `vite build` produced it.
// Menu prices in the static copy refresh on every deploy; if a price changes
// in D1 between deploys, the live site shows the new price immediately while
// the static copy shows the price from the last deploy — redeploy (any push
// to main) to refresh it.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { transformServiceData } from '../src/utils/serviceMapper.js';
import { FAQS } from '../src/data/faqs.js';
import { TESTIMONIALS } from '../src/data/testimonials.js';

const API_URL = 'https://88spa.cycy1357.workers.dev/api/init-data';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST_HTML = path.join(ROOT, 'dist', 'index.html');

// Same tab order as Services.jsx (Combo, Facial, Full Body, Head, Foot).
const CATEGORY_ORDER = ['Combo', 'Facial', 'Full Body', 'Head', 'Foot'];
const CATEGORY_TITLES = {
  Combo: 'Combo Packages',
  Facial: 'Facial Services',
  'Full Body': 'Full Body Massage',
  Head: 'Head Spa',
  Foot: 'Foot Reflexology',
};

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function fetchServices() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(API_URL, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`menu API HTTP ${res.status}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data.services;
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('menu API returned no services');
    return rows;
  } catch (err) {
    console.warn(`[prerender] menu API unavailable (${err.message}); menu section will be skipped.`);
    return null;
  }
}

function menuHtml(services) {
  if (!services) return '';
  // Same filters as Services.jsx: main menu excludes add-ons and
  // salePrice/isSpecial promo items (those live in SpecialPromo).
  const main = services.filter((s) => s.isAddon !== 1 && !s.salePrice && !s.isSpecial);
  const priceOf = (s) => s.salePrice ?? s.price;
  const byDurationThenPrice = (a, b) =>
    Number(a.duration) - Number(b.duration) || priceOf(a) - priceOf(b);

  let out =
    '<section><p>Treatment Menu</p><h2>Our Standard Wellness Services</h2>' +
    '<p>Discover our tailored standard sequences curated for your absolute physical alignment. ' +
    'Traditional head spa, therapeutic body massage, foot reflexology, combo packages, and facials in Redmond, WA.</p>';

  for (const cat of CATEGORY_ORDER) {
    const items = main.filter((s) => s.category === cat).sort(byDurationThenPrice);
    if (items.length === 0) continue;
    out += `<h3>${esc(CATEGORY_TITLES[cat])}</h3><ul>`;
    for (const s of items) {
      const { displayName, displaySubtitle } = transformServiceData(s);
      const isNew = s.isFeatured ? ' <strong>New</strong>' : '';
      out +=
        `<li><h4>${esc(displayName)}${isNew} — $${priceOf(s)} · ${esc(s.duration)} mins</h4>` +
        `<p>${esc(displaySubtitle)}</p></li>`;
    }
    out += '</ul>';
  }

  // Add-ons (excluded from the main menu in the app; shown as enhancements).
  const addons = services.filter((s) => s.isAddon === 1);
  if (addons.length > 0) {
    out += '<h3>Enhancements &amp; Add-ons</h3><ul>';
    for (const s of addons) {
      const price =
        s.salePrice != null && s.salePrice < s.price
          ? `$${s.salePrice} (regularly $${s.price})`
          : `$${s.price}`;
      const label =
        s.name === 'Aromatherapy' && s.salePrice === 0
          ? 'free (regularly $10)'
          : price;
      out += `<li><h4>${esc(s.name)} — ${label}</h4></li>`;
    }
    out += '</ul>';
  }
  out += '</section>';
  return out;
}

function reviewsHtml() {
  let out =
    '<section><p>Guest Experiences</p><h2>Loved by the Eastside</h2>' +
    '<p>Here is what our clients from Redmond and Bellevue say about their wellness journey.</p>';
  for (const t of TESTIMONIALS) {
    out +=
      `<blockquote><p>\u201c${esc(t.text)}\u201d</p>` +
      `<p>\u2605\u2605\u2605\u2605\u2605 ${esc(t.name)}, ${esc(t.location)}</p></blockquote>`;
  }
  out += '</section>';
  return out;
}

function faqHtml() {
  let out =
    '<section><p>Good To Know</p><h2>Frequently Asked Questions</h2>' +
    '<p>Everything you\u2019d want to know before your first visit.</p>';
  for (const f of FAQS) {
    out += `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`;
  }
  out += '</section>';
  return out;
}

function staticHtml(services) {
  return (
    '<!-- Prerendered static copy for search engines; replaced by the React app on load. ' +
    'Content mirrors the live site (menu from the D1 API at build time, FAQ/reviews from src/data). -->' +
    '<div style="max-width:960px;margin:0 auto;padding:24px 16px;font-family:Georgia,\'Times New Roman\',serif;color:#2b2b2b;line-height:1.6">' +
    '<header><p><strong>88 Head Spa &amp; Massage</strong> — Redmond, WA · ' +
    '<a href="tel:4258671867">(425) 867-1867</a></p></header>' +
    '<section><p>Premium Head Spa &amp; Therapeutic Massage</p>' +
    '<h1>Traditional Head Spa &amp; Therapeutic Body Massage in Redmond, WA</h1>' +
    '<p>Recharge your mind. Revitalize your body. Experience Redmond\u2019s premier holistic wellness sanctuary — ' +
    'signature traditional head spa rituals and deep tissue body therapies designed for ultimate restoration.</p>' +
    '<p><a href="#services">Book An Appointment</a> · <a href="tel:4258671867">Call (425) 867-1867</a></p></section>' +
    menuHtml(services) +
    reviewsHtml() +
    faqHtml() +
    '<footer><h2>Visit Us</h2>' +
    '<p>88 Head Spa &amp; Massage, 16720 Redmond Way #C, Redmond, WA 98052</p>' +
    '<p>Serving Redmond, Bellevue, Kirkland, Sammamish &amp; Woodinville</p>' +
    '<p>Hours: Mon – Sun, 10:00 AM – 10:00 PM · Phone: <a href="tel:4258671867">(425) 867-1867</a> · We Accept Walk-Ins</p>' +
    '<p>Book online or call to reserve. Walk-ins welcome at 16720 Redmond Way.</p></footer>' +
    '</div>'
  );
}

try {
  const services = await fetchServices();
  const html = readFileSync(DIST_HTML, 'utf8');
  const placeholder = '<div id="root"></div>';
  if (!html.includes(placeholder)) {
    console.warn('[prerender] dist/index.html has no empty #root div; leaving it unchanged.');
  } else {
    const injected = html.replace(placeholder, `<div id="root">${staticHtml(services)}</div>`);
    writeFileSync(DIST_HTML, injected);
    const menuCount = services
      ? services.filter((s) => s.isAddon !== 1 && !s.salePrice && !s.isSpecial).length
      : 0;
    console.log(
      `[prerender] injected static homepage into dist/index.html ` +
        `(menu items: ${menuCount}, FAQs: ${FAQS.length}, reviews: ${TESTIMONIALS.length}; ` +
        `${html.length} -> ${injected.length} bytes).`,
    );
  }
} catch (err) {
  console.warn(`[prerender] skipped (${err.message}); dist/index.html left unchanged.`);
}
