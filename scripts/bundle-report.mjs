// Reports the JavaScript each route downloads on first load (gzip/brotli transfer size as served by `next start`)
// and whether the MapLibre chunk is part of it.   Usage: build against the mock API, then `node scripts/bundle-report.mjs`
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 3211;
const ROUTES = ['/', '/properties', '/details/00000000-0000-4000-8000-000000000004', '/login', '/register', '/dashboard', '/user'];
// chunks that contain MapLibre, found on disk
const chunkDir = path.join(root, process.env.VERCEL ? '.next' : '.next_build', 'static', 'chunks');
const mapChunks = new Set(readdirSync(chunkDir).filter((f) => f.endsWith('.js') && readFileSync(path.join(chunkDir, f), 'utf8').includes('maplibregl')));

const children = [
  spawn(process.execPath, [path.join(root, 'scripts', 'mock-api.mjs')], { cwd: root, stdio: 'ignore' }),
  spawn(process.execPath, [path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', String(PORT)], { cwd: root, stdio: 'ignore' }),
];
const done = (code) => {
  for (const c of children) c.kill();
  setTimeout(() => process.exit(code), 300);
};

try {
  for (let i = 0; i < 60; i++) {
    if (await fetch(`http://localhost:${PORT}/login`).then((r) => r.ok, () => false)) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  console.log('route'.padEnd(52), 'JS files', 'JS kB (compressed)', 'maplibre');
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "load", timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(4000);
    const scripts = (
      await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .filter((e) => e.name.includes("/_next/static/") && e.name.split("?")[0].endsWith(".js"))
          .map((e) => ({ name: e.name.split("/").pop().split("?")[0], size: e.encodedBodySize })),
      )
    ).map((x) => ({ ...x, map: mapChunks.has(x.name) }));
    const kb = scripts.reduce((s, x) => s + x.size, 0) / 1024;
    console.log(route.padEnd(52), String(scripts.length).padEnd(8), kb.toFixed(0).padEnd(16), scripts.some((x) => x.map) ? 'yes' : 'no');
    await Promise.race([page.close(), new Promise((r) => setTimeout(r, 3000))]);
  }
  await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 3000))]);
  done(0);
} catch (e) {
  console.error(e);
  done(1);
}
