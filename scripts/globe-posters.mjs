// Makes the still frames of the home-page globe: public/globe/*.webp and components/globe/poster.css.
// Run it again whenever the hero's `initialView`, the map style or the palette changes:
//   1. build and serve the app:  npm run build && npx next start -p 3210
//   2. node scripts/globe-posters.mjs [http://localhost:3210]
// The edge of each still fades out (a mask in poster.css), so it never shows as a square on the page.
// The live globe is captured without pins, on the page background, in both themes and at both hero sizes.
// The hero box has a fixed height per breakpoint (the globe's perspective follows the height of its box), so the
// still, drawn centred at its natural size, sits exactly where the live globe will appear.
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://localhost:3210';
// the hero switches to its phone zoom when the globe's box is narrower than 640px
const SHOTS = [
  { name: 'desktop', layout: { width: 1440, height: 900 }, width: 1500, scale: 1.5 },
  { name: 'mobile', layout: { width: 390, height: 844 }, width: 600, scale: 2 },
];
const HERO = 'section > div[aria-hidden]:first-child';

// launchServer so the browser can be killed at the end: a headless browser left behind with a GPU context becomes
// a process Windows cannot end
const server = await chromium.launchServer({ args: ['--no-proxy-server', '--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11'] });
const browser = await chromium.connect(server.wsEndpoint());
await mkdir('public/globe', { recursive: true });
const sizes = {};
try {
  for (const shot of SHOTS) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: shot.layout, deviceScaleFactor: shot.scale, reducedMotion: 'reduce', colorScheme: theme });
      const page = await context.newPage();
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      // no listings: the pins switch on when the live globe takes over
      await page.route(/\/api\/property\//, (route) => route.abort());
      await page.goto(base, { waitUntil: 'load' });
      // the box keeps its real height and fills the window, so the whole globe is in the picture
      const boxHeight = Math.round(await page.locator(HERO).evaluate((el) => el.getBoundingClientRect().height));
      await page.setViewportSize({ width: shot.width, height: boxHeight });
      await page.addStyleTag({
        content: `
          body * { visibility: hidden !important; }
          ${HERO}, ${HERO} * { visibility: visible !important; }
          ${HERO} { position: fixed !important; inset: 0 !important; width: auto !important; height: auto !important; transform: none !important; translate: none !important; }
          .globe-poster, .maplibregl-control-container { display: none !important; }`,
      });
      await page.mouse.move(20, 20); // the live globe waits for a quiet page or a first interaction
      await page.waitForSelector(`${HERO} canvas`, { timeout: 30000 });
      await page.waitForTimeout(4000); // style, country shapes and the fade-in
      const png = await page.screenshot();
      await context.close();

      // crop to the globe and its glow, keeping the globe's centre in the centre
      const image = sharp(png);
      const { width, height } = await image.metadata();
      const { data: rgb, info } = await image.clone().removeAlpha().raw().toBuffer({ resolveWithObject: true });
      // anything that is not the page background (the corner pixel) belongs to the globe or its glow
      const differs = (x, y) => [0, 1, 2].some((c) => Math.abs(rgb[(y * width + x) * info.channels + c] - rgb[c]) > 1);
      let [reachX, reachY] = [0, 0];
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
          if (differs(x, y)) {
            reachX = Math.max(reachX, Math.abs(x - width / 2));
            reachY = Math.max(reachY, Math.abs(y - height / 2));
          }
      if (!reachX) throw new Error(`${shot.name}/${theme}: the capture is empty`);
      if (reachX >= width / 2 - 1 || reachY >= height / 2 - 1) console.warn(`${shot.name}/${theme}: the globe touches the edge of the capture, use a larger viewport`);
      const half = { x: Math.min(Math.ceil(reachX) + 2, Math.floor(width / 2)), y: Math.min(Math.ceil(reachY) + 2, Math.floor(height / 2)) };
      const region = { left: Math.floor(width / 2) - half.x, top: Math.floor(height / 2) - half.y, width: half.x * 2, height: half.y * 2 };
      const file = `public/globe/${theme}-${shot.name}.webp`;
      const out = await sharp(png).extract(region).webp({ quality: 90, effort: 6 }).toFile(file);
      sizes[`${theme}-${shot.name}`] = { w: Math.round(region.width / shot.scale), h: Math.round(region.height / shot.scale) };
      console.log(file, `${region.width}x${region.height}px`, `${Math.round(out.size / 1024)} KiB`);
    }
  }
} finally {
  await server.kill();
}

// the mask fades the last part of the glow, so the still never shows as a hard-edged box on the page
const rule = (key) =>
  `background-image: url('/globe/${key}.webp'); background-size: ${sizes[key].w}px ${sizes[key].h}px; mask-image: radial-gradient(circle ${Math.floor(Math.min(sizes[key].w, sizes[key].h) / 2)}px at center, #000 86%, transparent 100%);`;
await writeFile(
  'components/globe/poster.css',
  `/* Generated by scripts/globe-posters.mjs. Do not edit: run the script again. */
.globe-poster { background-repeat: no-repeat; background-position: center; ${rule('light-desktop')} }
.dark .globe-poster { ${rule('dark-desktop')} }
@media (max-width: 639.98px) {
  .globe-poster { ${rule('light-mobile')} }
  .dark .globe-poster { ${rule('dark-mobile')} }
}
`,
);
console.log('components/globe/poster.css written');
