#!/usr/bin/env node

/**
 * Social Mockup Screenshot Script
 *
 * Opens /social-mockups on the local dev server, clips each mockup
 * element by selector, and saves to public/social/<slug>.png.
 *
 * Prereq: `npm run dev` running (or set SOCIAL_URL env var).
 *
 * Usage:
 *   node scripts/screenshot-social.cjs              # All mockups
 *   node scripts/screenshot-social.cjs whats-new    # One by slug
 *   node scripts/screenshot-social.cjs --list       # List mockups
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const MOCKUPS = [
  { slug: 'whats-new', selector: '#whats-new' },
];

const BASE_URL = process.env.SOCIAL_URL || 'http://localhost:4321/social-mockups';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'social');
const DEVICE_SCALE = 2; // retina
const NAV_TIMEOUT = 30000;
const SETTLE_MS = 1200;

async function main(filter) {
  if (filter === '--list') {
    console.log('\nMockups:\n');
    MOCKUPS.forEach((m) => console.log(`  ${m.slug.padEnd(20)} ${m.selector}`));
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
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: DEVICE_SCALE });

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: NAV_TIMEOUT });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, SETTLE_MS));
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
      await el.screenshot({ path: outputPath, type: 'png', omitBackground: false });
      const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);
      console.log(`  ✓ ${m.slug.padEnd(20)} ${m.selector.padEnd(20)} ${sizeKb} KB`);
      results.push({ slug: m.slug, ok: true });
    } catch (err) {
      console.log(`  ✗ ${m.slug.padEnd(20)} FAILED: ${err.message}`);
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
