// Captures every key route in light and dark, desktop and mobile, against the fixture API.
//   npm run screens                 build with the mock API URL, then capture
//   npm run screens -- --no-build   reuse the existing build (must have been built against :4010)
//   npm run screens -- --only=properties,home
// Output: .screens/<name>.<viewport>.<theme>.png
import { spawn } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];

const API_PORT = 4010;
const WEB_PORT = Number(option('port') || 3210);
const OUT = path.join(root, '.screens');
const SAMPLE_ID = '00000000-0000-4000-8000-000000000004'; // Lisbon fixture

const ROUTES = [
  ['home', '/'],
  ['properties', '/properties'],
  ['properties-filtered', '/properties?countries=2,3&minYield=5&sort=yield'],
  ['properties-selected', `/properties?selected=${SAMPLE_ID}`],
  ['details', `/details/${SAMPLE_ID}`],
  ['login', '/login'],
  ['register', '/register'],
  ['dashboard', '/dashboard'],
];
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];
const THEMES = ['light', 'dark'];

const env = { ...process.env, NEXT_PUBLIC_API_URL: `http://localhost:${API_PORT}`, NEXT_TELEMETRY_DISABLED: '1' };
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const children = [];

function run(file, argv, { wait = false } = {}) {
  const child = spawn(process.execPath, [file, ...argv], { cwd: root, env, stdio: wait ? 'inherit' : ['ignore', 'pipe', 'pipe'] });
  if (!wait) {
    children.push(child);
    child.stderr.on('data', (d) => process.stderr.write(d));
    return child;
  }
  return new Promise((resolve, reject) => {
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${path.basename(file)} ${argv.join(' ')} exited with ${code}`))));
  });
}

async function waitFor(url, label) {
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`${label} did not start at ${url}`);
}

async function main() {
  const only = option('only')?.split(',');
  const routes = only ? ROUTES.filter(([name]) => only.some((o) => name.startsWith(o))) : ROUTES;

  if (!flag('no-build')) await run(nextBin, ['build'], { wait: true });

  run(path.join(root, 'scripts', 'mock-api.mjs'), []);
  run(nextBin, ['start', '-p', String(WEB_PORT)]);
  await waitFor(`http://localhost:${API_PORT}/api/health`, 'mock API');
  await waitFor(`http://localhost:${WEB_PORT}/`, 'next start');

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // SwiftShader gives headless Chromium a software WebGL context, which MapLibre needs.
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const problems = [];

  // First WebGL page under SwiftShader compiles shaders for several seconds: do that once, off the record.
  const warm = await browser.newPage();
  await warm.goto(`http://localhost:${WEB_PORT}/properties`, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
  await warm.waitForTimeout(3000);
  await warm.close();

  for (const [viewportName, viewport] of VIEWPORTS) {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        viewport,
        colorScheme: theme,
        deviceScaleFactor: 1,
        isMobile: viewportName === 'mobile',
        hasTouch: viewportName === 'mobile',
        reducedMotion: 'reduce', // stable frames: no auto-spin, no entrance animation mid-flight
      });
      await context.addInitScript((t) => {
        try {
          localStorage.setItem('theme', t);
        } catch {}
      }, theme);

      for (const [name, route] of routes) {
        const page = await context.newPage();
        const tag = `${name}.${viewportName}.${theme}`;
        page.on('pageerror', (e) => problems.push(`${tag}: ${e.message}`));
        page.on('console', (m) => {
          if (m.type() === 'error') problems.push(`${tag}: console: ${m.text().slice(0, 200)}`);
        });
        try {
          await page.goto(`http://localhost:${WEB_PORT}${route}`, { waitUntil: 'networkidle', timeout: 20000 });
        } catch (e) {
          problems.push(`${tag}: ${e.message.split('\n')[0]}`);
        }
        try {
          await page.waitForTimeout(1500); // map tiles, fonts, images
          await page.screenshot({ path: path.join(OUT, `${tag}.png`), timeout: 20000 });
          console.log(`captured ${tag}`);
        } catch (e) {
          problems.push(`${tag}: screenshot failed: ${e.message.split('\n')[0]}`);
          console.log(`FAILED ${tag}`);
        }
        // a page whose renderer is stuck (heavy WebGL under SwiftShader) must not block the run
        await Promise.race([page.close({ runBeforeUnload: false }), new Promise((r) => setTimeout(r, 5000))]);
      }
      await Promise.race([context.close(), new Promise((r) => setTimeout(r, 5000))]);
    }
  }
  await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 5000))]);

  if (problems.length) {
    console.log(`\n${problems.length} page problem(s):`);
    for (const p of [...new Set(problems)]) console.log(`  ${p}`);
  }
  console.log(`\nScreenshots in ${path.relative(root, OUT)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => {
    for (const c of children) c.kill();
    // a stuck headless renderer must not keep the script alive
    setTimeout(() => process.exit(process.exitCode ?? 0), 500);
  });
