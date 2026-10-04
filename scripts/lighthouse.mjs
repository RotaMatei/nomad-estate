// Lighthouse (mobile) against a running `next start`.   node scripts/lighthouse.mjs [base=http://127.0.0.1:3210] [/ /properties ...]
//
// Two ways to slow the page down, and they answer different questions:
//   default            "simulate": the page loads at full speed and Lighthouse estimates a slow phone from the trace.
//                      On localhost every script arrives before the first paint, and the estimate then charges all of
//                      them to LCP. This is the mode DevTools and PageSpeed Insights use.
//   LH_THROTTLING=devtools   the browser really is slowed down (slow 4G, CPU x4). Closer to what a phone does.
// Use the IPv4 address: with `localhost` the throttled browser can spend 5s falling back from IPv6.
// Chromium comes from Playwright. It renders WebGL on the real GPU (Direct3D 11 on Windows) so scores reflect what a
// device sees; set LH_GL=swiftshader on machines without a GPU (CI), where the globe costs far more CPU than in real use.
import { writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';

const [base = 'http://127.0.0.1:3210', ...paths] = process.argv.slice(2);
const routes = paths.length ? paths : ['/', '/properties'];
const PORT = 9333;

// launchServer, not launch: it can kill the browser. A headless browser left behind with a GPU context becomes a
// process Windows cannot end, and enough of those make every later run hang.
const browser = await chromium.launchServer({
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
    let result;
    // a run that reports no paint at all is a hiccup of the headless browser: try again
    for (let attempt = 1; attempt <= 3; attempt++) {
      result = await lighthouse(base + route, { port: PORT, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices'], ...(process.env.LH_THROTTLING ? { throttlingMethod: process.env.LH_THROTTLING } : {}) });
      if (!result.lhr.runtimeError) break;
      console.error(`  ${route}: ${result.lhr.runtimeError.code}, attempt ${attempt} of 3`);
    }
    const file = `.lighthouse/${route === '/' ? 'home' : route.replace(/\W+/g, '-').replace(/^-|-$/g, '')}.json`;
    await writeFile(file, result.report);
    process.stdout.write(execFileSync(process.execPath, ['scripts/lighthouse-summary.cjs', file, route]));
  }
} catch (error) {
  console.error('Lighthouse run failed:', error);
  process.exitCode = 1;
} finally {
  await browser.kill();
  process.exit(process.exitCode ?? 0);
}
