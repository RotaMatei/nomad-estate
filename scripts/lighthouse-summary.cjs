// Prints the headline numbers from a Lighthouse JSON report.  node scripts/lighthouse-summary.cjs <report.json> <label>
const r = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
const c = r.categories;
const a = r.audits;
const pct = (x) => (x && x.score != null ? Math.round(x.score * 100) : 'n/a');
console.log(process.argv[3] || r.finalDisplayedUrl, '| performance', pct(c.performance), '| accessibility', pct(c.accessibility), '| best practices', pct(c['best-practices']));
for (const k of ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index', 'total-byte-weight', 'bootup-time'])
  console.log('  ', k.padEnd(26), a[k] && a[k].displayValue);
for (const cat of ['accessibility', 'best-practices'])
  for (const ref of c[cat]?.auditRefs ?? []) {
    const v = a[ref.id];
    if (v && v.score === 0)
      console.log(`   ${cat} fail: ${ref.id} —`, (v.details?.items ?? []).slice(0, 3).map((i) => (i.node?.snippet ?? i.description ?? '').slice(0, 100)).join(' | '));
  }
