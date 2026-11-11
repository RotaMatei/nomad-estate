// Close-up screenshots of chosen sections, for judging visual detail (scripts/screens.mjs captures whole pages, which
// are too tall to judge texture, edges or shadows from).
//   node scripts/shots.mjs <spec.json> [--port=3271] [--out=.screens/shots]
// The spec is a list of shots:
//   { "name": "home-cta",              file name, without .png
//     "route": "/",
//     "size": [1440, 900],             viewport, default 1440x900
//     "dpr": 2,                        device pixel ratio, default 1 (use 2 to judge hairlines, grain and 4K sharpness)
//     "theme": "dark",                 default "light"
//     "mobile": true,                  phone emulation (touch, mobile viewport)
//     "to": "[aria-labelledby=cta-title]",   scroll this element to the top of the screen (minus "offset", default 90)
//     "el": ".house",                  capture only this element instead of the screen
//     "hover": "a[href^='/details/']", hover this element first
//     "wait": 1600,                    milliseconds to wait before the capture
//     "timeout": 20000 }               milliseconds the screenshot may take (the live globe needs more under SwiftShader)
// Needs a build made against the fixture API, because NEXT_PUBLIC_* values are fixed at build time:
//   NEXT_PUBLIC_API_URL=http://localhost:4010 NEXT_PUBLIC_API_FLAVOR=nest npm run build
// Starts the fixture API (unless one already answers on :4010) and `next start`, and stops what it started.
import { spawn, execFileSync } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const specFile = args.find((a) => !a.startsWith('--'));
if (!specFile) throw new Error('usage: node scripts/shots.mjs <spec.json> [--port=3271] [--out=.screens/shots]');

const API = 'http://localhost:4010';
const WEB_PORT = option('port', '3271');
const OUT = path.resolve(root, option('out', '.screens/shots'));
const base = `http://localhost:${WEB_PORT}`;
const env = { ...process.env, NEXT_PUBLIC_API_URL: API, NEXT_PUBLIC_API_FLAVOR: 'nest', NEXT_TELEMETRY_DISABLED: '1' };

const started = [];
const start = (file, argv) => started.push(spawn(process.execPath, [file, ...argv], { cwd: root, env, stdio: 'ignore' }).pid);
async function waitFor(url) {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch(url)).status < 500) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`nothing answers at ${url}`);
}

let failed = 0;
try {
  const spec = JSON.parse(await readFile(specFile, 'utf8'));
  await mkdir(OUT, { recursive: true });
  const apiUp = await fetch(`${API}/api/health`).then(
    () => true,
    () => false,
  );
  if (!apiUp) start(path.join(root, 'scripts', 'mock-api.mjs'), []);
  start(path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), ['start', '-p', WEB_PORT]);
  await waitFor(`${API}/api/health`);
  await waitFor(`${base}/`);

  // launchServer, not launch: its process tree can be killed. SwiftShader gives headless Chromium a software WebGL
  // context (the globe, the 3D scenes): right for looks, far too slow to say anything about speed.
  const server = await chromium.launchServer({ args: ['--no-proxy-server', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  started.push(server.process().pid);
  const browser = await chromium.connect(server.wsEndpoint());

  const contexts = new Map();
  for (const shot of spec) {
    const [width, height] = shot.size ?? [1440, 900];
    const theme = shot.theme ?? 'light';
    const key = [width, height, theme, !!shot.mobile, shot.dpr ?? 1].join('|');
    if (!contexts.has(key)) {
      const context = await browser.newContext({
        viewport: { width, height },
        colorScheme: theme,
        deviceScaleFactor: shot.dpr ?? 1,
        isMobile: !!shot.mobile,
        hasTouch: !!shot.mobile,
      });
      // the chosen theme, and no first-visit loading screen
      await context.addInitScript((t) => {
        try {
          localStorage.setItem('theme', t);
          sessionStorage.setItem('nomad:seen', '1');
        } catch {}
      }, theme);
      contexts.set(key, { context, pages: new Map() });
    }
    const { context, pages } = contexts.get(key);
    try {
      let page = pages.get(shot.route);
      if (!page) {
        page = await context.newPage();
        page.on('pageerror', (e) => console.log(`  page error on ${shot.route}: ${e.message.slice(0, 200)}`));
        await page.goto(base + shot.route, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
        await page.waitForTimeout(2500); // map tiles, fonts, images
        pages.set(shot.route, page);
      }
      await page.evaluate(
        ([selector, offset]) => {
          const element = selector && document.querySelector(selector);
          window.scrollTo({ top: element ? element.getBoundingClientRect().top + window.scrollY - offset : 0, behavior: 'instant' });
        },
        [shot.to ?? null, shot.offset ?? 90],
      );
      if (shot.hover) await page.locator(shot.hover).first().hover();
      await page.waitForTimeout(shot.wait ?? 1600);
      const file = path.join(OUT, `${shot.name}.png`);
      if (shot.el) await page.locator(shot.el).first().screenshot({ path: file, timeout: shot.timeout ?? 20000 });
      else await page.screenshot({ path: file, timeout: shot.timeout ?? 20000 });
      console.log(`captured ${shot.name}`);
    } catch (e) {
      failed += 1;
      console.log(`FAILED ${shot.name}: ${e.message.split('\n')[0]}`);
    }
  }
  await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 5000))]);
  console.log(`\nScreenshots in ${path.relative(root, OUT)}`);
} finally {
  // never process.exit() while a headless browser is open: kill what was started, then let the script end
  for (const pid of started.reverse()) {
    try {
      execFileSync('taskkill', ['/F', '/T', '/PID', String(pid)], { stdio: 'ignore' });
    } catch {
      /* already gone, or not Windows */
    }
  }
}
process.exitCode = failed ? 1 : 0;
