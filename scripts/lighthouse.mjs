// Lighthouse (mobile) against a running `next start`.   node scripts/lighthouse.mjs [base=http://localhost:3210] [/ /properties ...]
// Chromium comes from Playwright. It renders WebGL on the real GPU (Direct3D 11 on Windows) so scores reflect what a
// device sees; set LH_GL=swiftshader on machines without a GPU (CI), where the globe costs far more CPU than in real use.
import { writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';

const [base = 'http://localhost:3210', ...paths] = process.argv.slice(2);
const routes = paths.length ? paths : ['/', '/properties'];
const PORT = 9333;

const browser = await chromium.launch({
  args: [
    `--remote-debugging-port=${PORT}`,
    '--no-proxy-server', // localhost only; skips Chromium's proxy auto-detection, which can stall the first request for half a minute
    '--ignore-gpu-blocklist',
    ...(process.env.LH_GL === 'swiftshader' ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : ['--enable-gpu', '--use-angle=d3d11']),
  ],
});
await mkdir('.lighthouse', { recursive: true });
try {
  for (const route of routes) {
    const result = await lighthouse(base + route, { port: PORT, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices'] });
    const file = `.lighthouse/${route === '/' ? 'home' : route.replace(/\W+/g, '-').replace(/^-|-$/g, '')}.json`;
    await writeFile(file, result.report);
    process.stdout.write(execFileSync(process.execPath, ['scripts/lighthouse-summary.cjs', file, route]));
  }
} catch (error) {
  console.error('Lighthouse run failed:', error);
  process.exitCode = 1;
} finally {
  await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 4000))]);
  process.exit(process.exitCode ?? 0);
}
