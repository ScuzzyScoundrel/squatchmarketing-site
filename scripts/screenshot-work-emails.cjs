#!/usr/bin/env node

/**
 * Work Page Email Mockup Screenshots
 *
 * Opens /work on the local dev server, scrolls each email mockup into view,
 * and clips each by id to public/work-screenshots/<slug>.png.
 *
 * Prereq: `npm run dev` running (or set WORK_URL env var).
 *
 * Usage:
 *   node scripts/screenshot-work-emails.cjs              # All mockups
 *   node scripts/screenshot-work-emails.cjs chiro        # One by slug substring
 *   node scripts/screenshot-work-emails.cjs --list       # List mockups
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const MOCKUPS = [
  { slug: 'chiropractic-recall',   selector: '#email-mockup-chiropractic-recall' },
  { slug: 'restaurant-flash-event', selector: '#email-mockup-restaurant-flash-event' },
  { slug: 'medspa-welcome',        selector: '#email-mockup-medspa-welcome' },
  { slug: 'gym-challenge',         selector: '#email-mockup-gym-challenge' },
  { slug: 'real-estate-report',    selector: '#email-mockup-real-estate-report' },
  { slug: 'dental-recall',         selector: '#email-mockup-dental-recall' },
  { slug: 'barber-rebook',         selector: '#email-mockup-barber-rebook' },
];

const BASE_URL = process.env.WORK_URL || 'http://localhost:4321/work';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'work-screenshots');
const DEVICE_SCALE = 2;
const NAV_TIMEOUT = 45000;
const SETTLE_MS = 800;

async function main(filter) {
  if (filter === '--list') {
    console.log('\nMockups:\n');
    MOCKUPS.forEach((m) => console.log(`  ${m.slug.padEnd(26)} ${m.selector}`));
    console.log(`\nTotal: ${MOCKUPS.length}\n`);
    return;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const toShoot = filter ? MOCKUPS.filter((m) => m.slug.includes(filter)) : MOCKUPS;
  if (toShoot.length === 0) {
    console.error(`No mockups matched "${filter}"`);
    console.log('Available slugs:', MOCKUPS.map((m) => m.slug).join(', '));
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log(`\nShooting ${toShoot.length} mockup(s) from ${BASE_URL} @${DEVICE_SCALE}x...\n`);

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: DEVICE_SCALE });

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: NAV_TIMEOUT });
    await page.evaluateHandle('document.fonts.ready');
    // Hide the site's fixed nav so it doesn't overlap mockup screenshots.
    await page.addStyleTag({
      content: 'nav, header, [class*="nav-"], [class*="header-"] { display: none !important; }',
    });
  } catch (err) {
    console.error(`\nFailed to load ${BASE_URL}`);
    console.error(`Is \`npm run dev\` running? ${err.message}\n`);
    await browser.close();
    process.exit(1);
  }

  const results = [];
  for (const m of toShoot) {
    const outputPath = path.join(OUTPUT_DIR, m.slug + '.png');
    try {
      const el = await page.$(m.selector);
      if (!el) throw new Error(`selector not found: ${m.selector}`);

      // Scroll into view so `reveal` animations fire, then settle.
      await el.evaluate((node) => {
        node.scrollIntoView({ block: 'center', behavior: 'instant' });
        // Force reveal state in case the IntersectionObserver lags in headless.
        node.classList.add('is-visible', 'revealed');
        node.style.opacity = '1';
        node.style.transform = 'none';
      });
      await new Promise((r) => setTimeout(r, SETTLE_MS));

      await el.screenshot({ path: outputPath, type: 'png', omitBackground: false });
      const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);
      console.log(`  ✓ ${m.slug.padEnd(26)} ${sizeKb} KB`);
      results.push({ slug: m.slug, ok: true });
    } catch (err) {
      console.log(`  ✗ ${m.slug.padEnd(26)} FAILED: ${err.message}`);
      results.push({ slug: m.slug, ok: false, error: err.message });
    }
  }

  await browser.close();

  const ok = results.filter((r) => r.ok).length;
  const failed = results.length - ok;
  console.log(`\n${ok} succeeded, ${failed} failed. Output: ${OUTPUT_DIR}\n`);
  if (failed > 0) process.exit(1);
}

main(process.argv[2]).catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
