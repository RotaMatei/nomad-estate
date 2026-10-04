// End-to-end check of the frontend on the Rust API. Needs three things running:
//   1. a local Postgres with the Prisma schema, seeded by nomad-estate-database-api/rust/tools/seed-dev.mjs
//   2. the Rust API on :4187 (`PORT=4187 cargo run` in nomad-estate-database-api/rust)
//   3. this app built with NEXT_PUBLIC_API_URL=http://localhost:4187 NEXT_PUBLIC_API_FLAVOR=rust, served by `next start -p 3210`
// Then: node scripts/e2e-rust.mjs   (the 401 it reports for /auth/user/login is the agency signing in through the shared form)
import { chromium } from '@playwright/test';

const base = 'http://localhost:3210';
const password = process.env.SEED_PASSWORD ?? 'demo-password-123';
const b = await chromium.launch({ args: ['--no-proxy-server', '--enable-gpu', '--use-angle=d3d11', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
const failed = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('response', (r) => {
  if (r.url().includes(':4187') && r.status() >= 400) failed.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^https?:\/\/[^/]+/, '')}`);
});
const log = (k, v) => console.log(k.padEnd(34), v);
const open = async (path) => {
  for (let i = 0; i < 3; i++) {
    try {
      await p.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 15000 });
      return;
    } catch {
      console.log('  (navigation retry)', path);
    }
  }
};
const results = 'section[aria-label="Search results"]';
const signIn = async (email) => {
  await open('/login');
  await p.evaluate(() => localStorage.clear());
  await open('/login');
  await p.fill('input[type=email]', email);
  await p.fill('input[type=password]', password);
  await p.click('button[type=submit]');
};

await open('/properties');
await p.waitForSelector(`${results} li button`, { timeout: 30000 });
log('search results', await p.locator(`${results} h1`).textContent());
log('first card place', await p.locator(`${results} li button p`).first().textContent());
await open('/properties?countries=2&sort=yield');
await p.waitForSelector(`${results} li button`);
await p.waitForTimeout(800);
log('Portugal filter', await p.locator(`${results} h1`).textContent());

await signIn('investor@nomad.test');
await p.waitForURL('**/properties**', { timeout: 20000 });
log('investor signed in ->', new URL(p.url()).pathname);
await p.waitForSelector(`${results} li button`);
await p.locator(`${results} li button`).first().click();
await p.waitForSelector('article[aria-label^="Selected property"]');
await p.click('article button:has-text("Save property")');
await p.waitForTimeout(1500);
log('save pressed', await p.locator('article button[aria-pressed=true]').count());
const href = await p.locator('article a:has-text("View property")').getAttribute('href');
await open(href);
await p.waitForSelector('main h1');
log('details title', (await p.locator('main h1').textContent()).slice(0, 50));
await p.waitForSelector('#agency-title');
log('agency card', await p.locator('#agency-title').textContent());
log('photos in gallery', await p.locator('[aria-label="Property photos"] [role=group]').count());
await p.fill('textarea', 'Could you send the rental history and arrange a viewing next month?');
await p.click('button:has-text("Contact agency")');
await p.waitForSelector('section[aria-labelledby=agency-title] [role=status]', { timeout: 10000 });
log('inquiry', 'sent');
await open('/user');
await p.waitForSelector('#saved-title');
await p.waitForTimeout(2500);
log('saved on profile', await p.locator('section[aria-labelledby=saved-title] > ul > li').count());
log('profile email', await p.locator('aside dd').first().textContent());

await signIn('agency@nomad.test');
await p.waitForURL('**/dashboard**', { timeout: 20000 });
await p.waitForSelector('table tbody tr');
log('dashboard KPI listings', await p.locator('section[aria-label="Portfolio summary"] dd').first().textContent());
log('agents listed', await p.locator('section[aria-labelledby=agents-title] ul.divide-y > li').count());

await open('/dashboard/properties/new');
await p.waitForSelector('input[name=title]');
await p.fill('input[name=title]', 'Bright two-bedroom flat near the river, Porto');
await p.fill('textarea[name=description]', 'Renovated in 2022, let continuously since, five minutes from the metro and the riverside.');
const combos = () => p.locator('button[role=combobox]');
await combos().nth(0).click();
await p.locator('[role=option]:has-text("Apartment")').click();
await combos().nth(2).click();
await p.locator('[role=option]').first().click();
await p.click('button:has-text("Continue")');
await p.waitForSelector('input[name=streetAddress]');
await combos().nth(0).click();
await p.keyboard.type('Portu');
await p.waitForTimeout(400);
await p.locator('[cmdk-item]').first().click();
await p.waitForTimeout(1200);
await combos().nth(1).click();
await p.waitForTimeout(400);
await p.locator('[cmdk-item]:has-text("Porto")').click();
await p.fill('input[name=streetAddress]', '12 Rua das Flores');
await p.fill('input[name=postalCode]', '4050-262');
await p.fill('input[name=latitude]', '41.1435');
await p.fill('input[name=longitude]', '-8.6145');
await p.click('button:has-text("Continue")');
await p.waitForSelector('input[name=price]');
for (const [k, v] of Object.entries({ price: '245000', yield: '6.1', totalArea: '82', rooms: '3', bedrooms: '2', bathrooms: '1', floorLevel: '3' })) await p.fill(`input[name=${k}]`, v);
await p.locator('button[role=combobox]', { hasText: 'Choose' }).click();
await p.locator('[role=option]:has-text("SW")').click();
await p.click('button:has-text("Continue")');
await p.waitForSelector('legend:has-text("Heating")');
await p.click('button:has-text("Central")');
await p.click('button:has-text("High ROI")');
await p.click('button:has-text("Continue")');
await p.waitForSelector('input[aria-label="Image link"]');
await p.fill('input[aria-label="Image link"]', 'https://picsum.photos/seed/e2e/1200/800');
await p.click('button:has-text("Add photo link")');
await p.click('button:has-text("Publish property")');
await p.waitForURL('**/details/**', { timeout: 20000 });
await p.waitForSelector('main h1');
log('published via create-full', (await p.locator('main h1').textContent()).slice(0, 50));
log('server score shown', await p.locator('section[aria-label="Investment summary"] [title^="Investment score"]').textContent());

log('failed API calls', failed.length ? failed.join(' | ') : 'none');
log('page errors', errs.length ? errs.slice(0, 3).join(' | ') : 'none');
await Promise.race([b.close(), new Promise((r) => setTimeout(r, 3000))]);
process.exit(0);
