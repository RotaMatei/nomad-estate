// Makes the still frames of the 3D house: public/models/house-light.webp and house-dark.webp (shown by
// components/three/house-poster.css until the live scene is ready). Run it again whenever the model, its light or the
// frame in components/three/house-runtime.ts changes:
//   1. build and serve the app:  npm run build && npx next start -p 3210
//   2. node scripts/model-posters.mjs [http://localhost:3210]
// The scene is drawn with reduced motion on, which is its still pose (the house at rest, seen from the front right), on a
// transparent background, at twice the pixel density. Each still stays under 60 kB.
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://localhost:3210';
const BOX = { width: 460, height: 400 }; // about 1.15 as wide as tall, like the boxes the page gives the scene
const LIMIT = 60 * 1024;

// launchServer so the browser can be killed at the end: a headless browser left behind with a GPU context becomes
// a process Windows cannot end
const server = await chromium.launchServer({ args: ['--no-proxy-server', '--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11'] });
const browser = await chromium.connect(server.wsEndpoint());
await mkdir('public/models', { recursive: true });
try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width: 800, height: 700 }, deviceScaleFactor: 2, reducedMotion: 'reduce', colorScheme: theme });
    const page = await context.newPage();
    await page.addInitScript((t) => {
      localStorage.setItem('theme', t);
      sessionStorage.setItem('nomad:seen', '1');
    }, theme);
    await page.goto(`${base}/no-such-page`, { waitUntil: 'load' });
    await page.addStyleTag({
      content: `
        html, body { background: transparent !important; }
        body * { visibility: hidden !important; }
        .house-poster, .house-poster * { visibility: visible !important; }
        .house-poster { position: fixed !important; left: 0 !important; top: 0 !important; margin: 0 !important; width: ${BOX.width}px !important; height: ${BOX.height}px !important; background: none !important; }
        body::after { display: none !important; }`,
    });
    // the live scene fades in once it has drawn its first frame
    await page.waitForFunction(() => {
      const canvas = document.querySelector('.house-poster canvas');
      return canvas && getComputedStyle(canvas).opacity === '1';
    }, null, { timeout: 60000 });
    await page.waitForTimeout(1500); // the resize to the capture box, and the transition
    const png = await page.locator('.house-poster canvas').screenshot({ omitBackground: true });
    await context.close();

    let quality = 90;
    let out;
    do {
      out = await sharp(png).webp({ quality, alphaQuality: 90, effort: 6 }).toBuffer();
      quality -= 6;
    } while (out.length > LIMIT && quality > 40);
    await writeFile(`public/models/house-${theme}.webp`, out);
    const { width, height } = await sharp(out).metadata();
    console.log(`public/models/house-${theme}.webp`, `${width}x${height}px`, `${Math.round(out.length / 1024)} KiB`, `(quality ${quality + 6})`);
  }
} finally {
  // the whole process tree: on Windows the GPU and renderer children otherwise outlive the browser
  if (process.platform === 'win32') try { execFileSync('taskkill', ['/F', '/T', '/PID', String(server.process().pid)], { stdio: 'ignore' }); } catch {}
  await server.kill().catch(() => {});
}
