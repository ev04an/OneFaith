// One-shot icon generator. Premium blue-and-white meditation/wellness style —
// soft sky-blue gradient, glowing white cross, abstract waves and light rays.
// Run: `node scripts/generate-icon.mjs`
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = resolve(ROOT, 'assets');

/**
 * Premium icon — 1024x1024. Blue & white only.
 * Layers (back to front):
 *   1. Soft sky-blue vertical gradient background
 *   2. Cloud-like white orbs for depth
 *   3. Abstract wave shapes at the bottom
 *   4. Faint arc curves behind the cross
 *   5. Subtle light rays from the top
 *   6. Soft white halo behind the cross
 *   7. Glass frame edge
 *   8. Soft deep-blue shadow under the cross
 *   9. Wide white cross outer glow
 *  10. Tighter inner glow
 *  11. White cross body (with the faintest pale-blue toe at the bottom)
 *  12. Top glass highlight on the cross
 */
const ICON_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#D6E8FA"/>
      <stop offset="45%" stop-color="#7CB0E4"/>
      <stop offset="100%" stop-color="#3A7AC4"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="48%" r="40%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.55"/>
      <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbSoft" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cross" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="65%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#ECF4FC"/>
    </linearGradient>
    <linearGradient id="highlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="wave" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="frame" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.05"/>
    </linearGradient>
    <filter id="crossGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="34"/>
    </filter>
    <filter id="innerGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="22"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bg)"/>

  <!-- Soft cloud-like orbs (depth) -->
  <circle cx="180" cy="230" r="240" fill="url(#orbSoft)"/>
  <circle cx="860" cy="180" r="180" fill="url(#orbSoft)"/>
  <circle cx="880" cy="820" r="220" fill="url(#orbSoft)"/>

  <!-- Abstract wave shapes near the bottom -->
  <path d="M 0 740 C 220 680 380 800 512 740 C 644 680 820 780 1024 720 L 1024 1024 L 0 1024 Z"
        fill="url(#wave)"/>
  <path d="M 0 830 C 240 790 420 880 600 830 C 800 780 900 870 1024 850 L 1024 1024 L 0 1024 Z"
        fill="#FFFFFF" opacity="0.07"/>
  <path d="M 0 920 C 260 880 460 960 660 920 C 840 880 940 940 1024 930 L 1024 1024 L 0 1024 Z"
        fill="#FFFFFF" opacity="0.05"/>

  <!-- Faint arc curves behind the cross -->
  <path d="M 90 400 Q 512 220 934 400" fill="none"
        stroke="#FFFFFF" stroke-width="3" opacity="0.11" stroke-linecap="round"/>
  <path d="M 50 490 Q 512 290 974 490" fill="none"
        stroke="#FFFFFF" stroke-width="2" opacity="0.07" stroke-linecap="round"/>

  <!-- Subtle light rays from the top -->
  <g opacity="0.10">
    <path d="M 512 280 L 472 60 L 552 60 Z" fill="#FFFFFF"/>
    <path d="M 396 300 L 296 80 L 360 60 Z" fill="#FFFFFF"/>
    <path d="M 628 300 L 728 80 L 664 60 Z" fill="#FFFFFF"/>
    <path d="M 308 340 L 168 180 L 220 140 Z" fill="#FFFFFF"/>
    <path d="M 716 340 L 856 180 L 804 140 Z" fill="#FFFFFF"/>
  </g>

  <!-- White halo behind the cross -->
  <rect width="1024" height="1024" fill="url(#halo)"/>

  <!-- Glassy edge frame -->
  <rect x="44" y="44" width="936" height="936" rx="222" ry="222"
        fill="none" stroke="url(#frame)" stroke-width="2.5"/>

  <!-- Soft shadow under the cross (deep blue tint) -->
  <g filter="url(#softShadow)" opacity="0.22">
    <rect x="488" y="278" width="68" height="580" rx="34" ry="34" fill="#1A4378"/>
    <rect x="332" y="424" width="380" height="68" rx="34" ry="34" fill="#1A4378"/>
  </g>

  <!-- Wide outer cross glow -->
  <g filter="url(#crossGlow)" opacity="0.95">
    <rect x="462" y="232" width="100" height="600" rx="50" ry="50" fill="#FFFFFF"/>
    <rect x="306" y="378" width="412" height="100" rx="50" ry="50" fill="#FFFFFF"/>
  </g>

  <!-- Tighter inner glow -->
  <g filter="url(#innerGlow)" opacity="0.85">
    <rect x="476" y="246" width="72" height="572" rx="36" ry="36" fill="#FFFFFF"/>
    <rect x="320" y="392" width="384" height="72" rx="36" ry="36" fill="#FFFFFF"/>
  </g>

  <!-- Cross body -->
  <g>
    <rect x="481" y="251" width="62" height="562" rx="31" ry="31" fill="url(#cross)"/>
    <rect x="325" y="397" width="374" height="62" rx="31" ry="31" fill="url(#cross)"/>
  </g>

  <!-- Top highlight on the cross (glassy shine) -->
  <g opacity="0.7">
    <rect x="481" y="251" width="62" height="170" rx="31" ry="31" fill="url(#highlight)"/>
    <rect x="325" y="397" width="170" height="32" rx="16" ry="16" fill="url(#highlight)"/>
  </g>

  <!-- Tiny sparkle accents -->
  <circle cx="512" cy="320" r="2.5" fill="#FFFFFF" opacity="0.85"/>
  <circle cx="512" cy="708" r="2.5" fill="#FFFFFF" opacity="0.85"/>
</svg>`;

/**
 * Adaptive-icon foreground — glowing white cross on transparent background.
 * Android composites it onto adaptiveIcon.backgroundColor (set to soft blue in app.json).
 */
const FOREGROUND_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cross" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="65%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#ECF4FC"/>
    </linearGradient>
    <linearGradient id="highlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <filter id="crossGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
  </defs>

  <g filter="url(#crossGlow)" opacity="0.95">
    <rect x="462" y="262" width="100" height="540" rx="50" ry="50" fill="#FFFFFF"/>
    <rect x="320" y="392" width="384" height="100" rx="50" ry="50" fill="#FFFFFF"/>
  </g>

  <g>
    <rect x="481" y="281" width="62" height="502" rx="31" ry="31" fill="url(#cross)"/>
    <rect x="339" y="411" width="346" height="62" rx="31" ry="31" fill="url(#cross)"/>
  </g>

  <g opacity="0.7">
    <rect x="481" y="281" width="62" height="160" rx="31" ry="31" fill="url(#highlight)"/>
    <rect x="339" y="411" width="160" height="32" rx="16" ry="16" fill="url(#highlight)"/>
  </g>
</svg>`;

const SPLASH_SVG = ICON_SVG;

async function render(svg, outName, size = 1024) {
  const out = resolve(ASSETS, outName);
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`  wrote ${outName} (${size}x${size})`);
}

async function main() {
  await mkdir(ASSETS, { recursive: true });
  console.log('Generating OneFaith icon set ->', ASSETS);
  await render(ICON_SVG, 'icon.png');
  await render(FOREGROUND_SVG, 'adaptive-icon.png');
  await render(SPLASH_SVG, 'splash-icon.png');
  await render(ICON_SVG, 'favicon.png', 196);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
