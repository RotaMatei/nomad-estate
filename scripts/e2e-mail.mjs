// End-to-end check of the email flows on the Rust API: forgot password, reset, and email confirmation.
// Needs what scripts/e2e-rust.mjs needs, plus an SMTP sink that writes the last message to a file:
//   Rust API started with SMTP_HOST=127.0.0.1 SMTP_PORT=2525 SMTP_SECURE=none FRONTEND_URL=http://localhost:3210
// Then: MAIL_FILE=<file the sink writes> node scripts/e2e-mail.mjs
// It changes the demo investor's password and changes it back at the end.
import { readFileSync, rmSync } from 'node:fs';
import { chromium } from '@playwright/test';

const base = 'http://localhost:3210';
const mailFile = process.env.MAIL_FILE;
const email = 'investor@nomad.test';
const password = process.env.SEED_PASSWORD ?? 'demo-password-123';
const temporary = 'a-temporary-password-456';
const shots = process.env.SHOTS_DIR;

const b = await chromium.launch({ args: ['--no-proxy-server'] });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
const log = (k, v) => console.log(k.padEnd(38), v);
const shot = async (name) => shots && (await p.screenshot({ path: `${shots}/${name}.png` }));

/** Waits for the sink to write a message and returns the first link to `page` in its plain-text part. */
const linkFromMail = async (page) => {
  for (let i = 0; i < 40; i++) {
    try {
      // quoted-printable: soft line breaks and =3D
      const text = readFileSync(mailFile, 'latin1').replace(/=\r?\n/g, '').replace(/=3D/g, '=');
      const match = text.match(new RegExp(`${base}/${page}\\?token=[\\w.-]+`));
      if (match) {
        rmSync(mailFile);
        return match[0];
      }
    } catch {}
    await p.waitForTimeout(250);
  }
  throw new Error(`no ${page} email arrived`);
};
const signIn = async (pass) => {
  await p.goto(base + '/login');
  await p.fill('input[type=email]', email);
  await p.fill('input[type=password]', pass);
  await p.click('button[type=submit]');
  await p.waitForURL('**/properties**', { timeout: 20000 });
};
const reset = async (to) => {
  await p.goto(base + '/forgot-password');
  await p.fill('input[type=email]', email);
  await p.click('button[type=submit]');
  await p.getByText('Check your inbox').waitFor();
  const link = await linkFromMail('reset-password');
  await p.goto(link);
  const fields = p.locator('input[type=password]');
  await fields.nth(0).fill(to);
  await fields.nth(1).fill(to);
  return link;
};

try {
  rmSync(mailFile, { force: true });
  await p.goto(base + '/login');
  await p.evaluate(() => localStorage.clear());

  // the profile offers a confirmation link while the address is unconfirmed
  await signIn(password);
  await p.goto(base + '/user');
  await p.getByRole('button', { name: /Send a confirmation link/ }).click();
  await p.getByText('Confirmation link sent').waitFor();
  await shot('profile-confirmation-sent');
  await p.goto(await linkFromMail('verify'));
  await p.getByText('Your email is confirmed').waitFor();
  log('email confirmed from the link', true);
  await p.evaluate(() => localStorage.clear());

  await p.goto(base + '/login');
  await p.getByRole('link', { name: 'Forgot your password?' }).click();
  await p.waitForURL('**/forgot-password');
  await shot('forgot-password');
  await p.fill('input[type=email]', 'not-an-email');
  await p.click('button[type=submit]');
  log('bad address is refused in the form', await p.getByText('Enter a valid email address.').isVisible());

  const link = await reset(temporary);
  await shot('reset-password');
  await p.click('button[type=submit]');
  await p.waitForURL('**/login', { timeout: 15000 });
  log('reset finished ->', new URL(p.url()).pathname);

  await p.goto(link);
  const fields = p.locator('input[type=password]');
  await fields.nth(0).fill('one-more-password-789');
  await fields.nth(1).fill('one-more-password-789');
  await p.click('button[type=submit]');
  await p.getByText('This link did not work').waitFor();
  await shot('reset-password-used');
  log('used link is refused', true);

  await signIn(temporary);
  log('signed in with the new password ->', new URL(p.url()).pathname);

  await p.goto(base + '/user');
  await p.getByText('confirmed', { exact: true }).waitFor({ state: 'attached' });
  log('confirm button once confirmed', await p.getByRole('button', { name: /Send a confirmation link/ }).count());
} catch (e) {
  console.log('FAILED:', e.message);
  await shot('failure');
  process.exitCode = 1;
} finally {
  // put the demo password back (the throttle allows one reset email a minute per address)
  if (process.env.RESTORE !== '0') {
    try {
      console.log('waiting a minute for the reset throttle, then restoring the demo password');
      await p.waitForTimeout(61_000);
      await p.evaluate(() => localStorage.clear());
      await reset(password);
      await p.click('button[type=submit]');
      await p.waitForURL('**/login', { timeout: 15000 });
      log('demo password restored', true);
    } catch (e) {
      console.log('could not restore the demo password:', e.message);
      process.exitCode = 1;
    }
  }
  log('page errors', errs.length ? errs : 'none');
  await b.close();
}
