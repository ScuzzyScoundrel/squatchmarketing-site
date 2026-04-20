#!/usr/bin/env node

/**
 * Preview Site Screenshot Script
 *
 * Opens each client preview site in headless Chromium at 1440x900
 * and saves a 2x-retina viewport screenshot to public/site-previews/.
 *
 * Usage:
 *   node scripts/screenshot-previews.cjs              # All 12 sites
 *   node scripts/screenshot-previews.cjs garcia       # One site by slug
 *   node scripts/screenshot-previews.cjs --list       # List sites
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SITES = [
  { slug: 'garcia-contracting',    url: 'https://garcia-contracting.squatch-previews.pages.dev' },
  { slug: 'coyote-contracting',    url: 'https://coyote-contracting.squatch-previews.pages.dev' },
  { slug: 'cross-general',         url: 'https://cross-general.squatch-previews.pages.dev' },
  { slug: 'jt-burke-and-sons',     url: 'https://jt-burke-and-sons.squatch-previews.pages.dev' },
  { slug: 'yogavega',              url: 'https://yogavega.squatch-previews.pages.dev' },
  { slug: 'millpond-spa',          url: 'https://millpond-spa.squatch-previews.pages.dev' },
  { slug: 'body-balance',          url: 'https://body-balance.squatch-previews.pages.dev' },
  { slug: 'ute-crossfit',          url: 'https://ute-crossfit.squatch-previews.pages.dev' },
  { slug: 'blind-tiger',           url: 'https://blind-tiger.squatch-previews.pages.dev' },
  { slug: 'labelle-vie',           url: 'https://labelle-vie.squatch-previews.pages.dev' },
  { slug: 'formfit-chiro',         url: 'https://formfit-chiro.squatch-previews.pages.dev' },
  { slug: 'vision-re',             url: 'https://vision-re.squatch-previews.pages.dev' },
];

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'site-previews');
const VIEWPORT = { width: 1440, height: 900 };
const DEVICE_SCALE = 1;
const NAV_TIMEOUT = 45000;
const SETTLE_MS = 1500;

async function screenshotSites(filter) {
  if (filter === '--list') {
    console.log('\nSites:\n');
    SITES.forEach(s => console.log(`  ${s.slug.padEnd(22)} ${s.url}`));
    console.log(`\nTotal: ${SITES.length} sites\n`);
    return;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const toShoot = filter
    ? SITES.filter(s => s.slug.includes(filter))
    : SITES;

  if (toShoot.length === 0) {
    console.error(`No sites matched "${filter}"`);
    console.log('Available slugs:', SITES.map(s => s.slug).join(', '));
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log(`\nShooting ${toShoot.length} site(s) at ${VIEWPORT.width}x${VIEWPORT.height} @${DEVICE_SCALE}x...\n`);

  const results = [];
  for (const site of toShoot) {
    const page = await browser.newPage();
    await page.setViewport({ ...VIEWPORT, deviceScaleFactor: DEVICE_SCALE });
    const outputPath = path.join(OUTPUT_DIR, site.slug + '.png');

    try {
      await page.goto(site.url, { waitUntil: 'networkidle0', timeout: NAV_TIMEOUT });
      await page.evaluateHandle('document.fonts.ready');
      await new Promise(r => setTimeout(r, SETTLE_MS));

      await page.screenshot({ path: outputPath, type: 'png', fullPage: false });

      const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);
      console.log(`  ✓ ${site.slug.padEnd(22)} ${sizeKb} KB`);
      results.push({ slug: site.slug, ok: true });
    } catch (err) {
      console.log(`  ✗ ${site.slug.padEnd(22)} FAILED: ${err.message}`);
      results.push({ slug: site.slug, ok: false, error: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  const ok = results.filter(r => r.ok).length;
  const failed = results.length - ok;
  console.log(`\n${ok} succeeded, ${failed} failed. Output: ${OUTPUT_DIR}\n`);
  if (failed > 0) process.exit(1);
}

screenshotSites(process.argv[2]).catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
