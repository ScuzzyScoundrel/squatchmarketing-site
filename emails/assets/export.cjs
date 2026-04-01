#!/usr/bin/env node

/**
 * Email Asset Export Script
 *
 * Opens components.html in headless Chromium and screenshots every
 * element with a [data-export] attribute. Saves PNGs to public/emails/
 * with automatic @2x retina scaling.
 *
 * Usage:
 *   node emails/assets/export.js              # Export all components
 *   node emails/assets/export.js icon-web     # Export single component
 *   node emails/assets/export.js --list       # List available components
 *
 * Output:
 *   public/emails/icons/icon-*.png    (72x72 icons)
 *   public/emails/mockup-*.png        (552px wide mockups)
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const COMPONENTS_HTML = path.join(__dirname, 'components.html');
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'public', 'emails');
const ICONS_DIR = path.join(OUTPUT_DIR, 'icons');
const DEVICE_SCALE = 2; // 2x retina

async function exportAssets(filterName) {
    // Ensure output dirs exist
    fs.mkdirSync(ICONS_DIR, { recursive: true });

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: DEVICE_SCALE });

    // Load the components page
    const fileUrl = 'file://' + COMPONENTS_HTML;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Find all exportable elements
    const exports = await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-export]');
        return Array.from(elements).map(el => {
            const rect = el.getBoundingClientRect();
            return {
                name: el.dataset.export,
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            };
        });
    });

    if (filterName === '--list') {
        console.log('\nAvailable components:\n');
        exports.forEach(e => {
            const type = e.name.startsWith('icon-') ? 'icon' : 'mockup';
            console.log(`  ${e.name}  (${Math.round(e.width)}x${Math.round(e.height)}, ${type})`);
        });
        console.log(`\nTotal: ${exports.length} components\n`);
        await browser.close();
        return;
    }

    const toExport = filterName
        ? exports.filter(e => e.name === filterName)
        : exports;

    if (toExport.length === 0) {
        console.error(`No component found with name "${filterName}"`);
        console.log('Available:', exports.map(e => e.name).join(', '));
        await browser.close();
        process.exit(1);
    }

    console.log(`\nExporting ${toExport.length} component(s)...\n`);

    for (const comp of toExport) {
        const isIcon = comp.name.startsWith('icon-');
        const outputPath = isIcon
            ? path.join(ICONS_DIR, comp.name + '.png')
            : path.join(OUTPUT_DIR, comp.name + '.png');

        await page.screenshot({
            path: outputPath,
            clip: {
                x: comp.x,
                y: comp.y,
                width: comp.width,
                height: comp.height
            },
            omitBackground: true // Transparent background
        });

        const stats = fs.statSync(outputPath);
        const sizeKb = (stats.size / 1024).toFixed(1);
        const displaySize = `${Math.round(comp.width)}x${Math.round(comp.height)}`;
        const retinaSize = `${Math.round(comp.width * DEVICE_SCALE)}x${Math.round(comp.height * DEVICE_SCALE)}`;

        console.log(`  ✓ ${comp.name}`);
        console.log(`    ${outputPath}`);
        console.log(`    Display: ${displaySize}  |  File: ${retinaSize} @${DEVICE_SCALE}x  |  ${sizeKb}KB`);
        console.log('');
    }

    await browser.close();
    console.log('Done! Assets saved to public/emails/\n');
    console.log('Push to deploy: git add public/emails && git commit -m "Update email assets" && git push\n');
}

// CLI
const arg = process.argv[2];
exportAssets(arg).catch(err => {
    console.error('Export failed:', err.message);
    process.exit(1);
});
