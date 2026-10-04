# Nomad Estate — Redesign & Rust Migration: PROGRESS

> **This file is the hand-off log.** A scheduled task runs every 3 hours, reads this file
> (and the PROGRESS.md in the other three repos), and continues from the first unchecked step.
> Every working session MUST: (1) update the heartbeat, (2) tick finished steps, (3) add notes
> under "Session log", (4) commit + push to branch `redesign`.

## Coordination

- **Branch:** `redesign` in all four repos (`RotaMatei/nomad-estate`, `nomad-estate-database-api`,
  `nomad-estate-ai-api`, `nomad-estate-database-schema-visualizer`). Never push to `main`/`stable`/`current`.
- **Source of truth:** this file on GitHub branch `redesign`. Copies are mirrored into the local
  folders `D:\Desktop\NomadEstate\<repo>\PROGRESS.md` when the computer is reachable.
- **Heartbeat / lock:** if `Last heartbeat` below is less than 45 minutes old, another session is
  actively working — the scheduled run must exit without changes.
- **Last heartbeat:** 2026-10-04 18:01 Europe/Bucharest (Claude Code local session — B4 in progress)

## Decisions (agreed with owner, 2026-10-04)

| Area | Decision |
|---|---|
| Globe / map | **MapLibre GL JS v5, globe projection** — one engine from spinning planet to street level. Replaces globe.gl, OpenGlobus, R3F globe, Leaflet. Custom glowing/pulsing pins, clustering for scale. |
| Tiles | Bundled `earth-countries.json` vector layer for zoomed-out globe (no network needed) + OpenFreeMap vector tiles (free, no key) on zoom-in. Optional MapTiler satellite via `NEXT_PUBLIC_MAPTILER_KEY`. |
| UI stack | **Tailwind CSS v4 + shadcn/ui (Radix)** + Motion + selective React Bits / Magic UI / Aceternity components. MUI, Emotion, styled-components removed at the end. |
| Theme | **Full light AND dark themes, with toggle** (`next-themes`), designed equally. CSS-variable tokens. |
| Data layer | TanStack Query for server state, URL-synced filters (`nuqs`), no `window` CustomEvents, no sessionStorage caches. |
| Backend | **Rust — Axum + Tokio + SQLx** on the existing Postgres (no data migration). Lives in `nomad-estate-database-api/rust/` until parity, then replaces Nest. |
| Design refs | Awwwards real-estate winners 2026: Realevate, ERA Residence (SOTM), LIKOVA, Hubtown — editorial type, restrained palette, glass over imagery, cinematic motion. |

## Plan — Part A: UI/UX (repo `nomad-estate`)

### A0 Setup
- [x] Create `redesign` branch, import uncommitted local WIP (globe/map country highlighting)
- [x] PROGRESS.md in all four repos + 3-hourly scheduled task
### A1 Foundation
- [x] Install Tailwind v4, shadcn/ui (components.json), `next-themes`, `lucide-react`, Motion, TanStack Query, nuqs
- [x] Design tokens (light + dark) in `app/globals.css`, fonts via @fontsource (no network at build)
- [x] Build green: `npm run typecheck`, `npm run lint` (ESLint CLI, flat config), `npm run build`; CI workflow runs on `redesign`
- [x] `scripts/mock-api.mjs` (fixtures on :4010) + `scripts/screens.mjs` (Playwright, light/dark, 1440 + 390)
- [x] App shell: new header (glass, theme toggle, auth menu), footer, mobile nav (shadcn Sheet)
- [x] Typed API client (`lib/api`) kept; add query hooks in `lib/queries/*`
### A2 Properties search (flagship)
- [x] `components/globe/property-globe.tsx` — MapLibre globe, atmosphere, auto-spin (pauses on interaction), light/dark styles (`lib/map/style.ts`)
- [x] GPU pins: GeoJSON source + circle/symbol layers with glow + pulse; clustering
- [ ] Pin ↔ list sync (hover highlights, click flies to property, preview card)
- [ ] Filter bar (shadcn Popover/Slider/Command/ToggleGroup): price, yield, score, beds/baths, area, type, investment-goal tags, location-benefit tags, country/city
- [ ] Results panel: virtualized list/grid, sort, skeletons, empty state; "search as I move the globe"
- [x] URL state for every filter (shareable searches), plus `selected` and `area`
- [x] Verified in a browser (headless + dev pane): list → pin hover, select → fly-to + URL + preview card, cluster click, country filter popover, live theme switch, stable zoom while auto-rotating
- [x] Verified headless (real GPU): Price/Returns/Home popovers and More filters sheet write to the URL, chips + clear all, "Search this area" filters by map bounds, mobile sheet drag and snap back on select, save while signed in shows on `/user`
- [ ] Still unverified: hovering a pin scrolls its card into view; unsave
- [ ] Optional MapTiler satellite layer (`NEXT_PUBLIC_MAPTILER_KEY`)
- [x] Legacy `propertyDashComponents` + `MagicBento` removed (A8)
### A3 Home / landing
- [x] Hero with live globe + headline + search entry, stats, value props, "choose path" (investor / agency), CTA, footer
### A4 Property details
- [x] Gallery (lightbox), key metrics, investment panel (yield, score, price/m²), features, map, agency card, inquiry form, save
### A5 Auth
- [x] Login, register (investor + agency multi-step), verify, change password, logout
### A6 Dashboards
- [x] Agency dashboard: metrics, charts (Recharts restyled), listings table, agents manager
- [x] Create / edit property — multi-step form (react-hook-form + zod)
- [x] Investor dashboard / saved properties (on `/user`)
### A7 User profile, 404/sorry page
- [x] `/user` profile (investor: saved properties; agency: link to dashboard), `app/not-found.tsx`, `/sorry` as a coming-soon page
### A8 Cleanup & performance
- [x] Remove MUI, Emotion, styled-components, globe.gl, @openglobus/og, three/R3F, leaflet, d3, gsap, wave-gradient, legacy `app/components`, `app/reactDevBits`, `app/hooks`, unused `public/` assets
- [x] Map chunk is lazy and absent from non-map routes (verified with `scripts/bundle-report.mjs`)
- [ ] Performance: Lighthouse mobile is 59 on `/` and 56 on `/properties` (target 90, **not met**); accessibility and best practices are 100 on both. See the session log for what is left
- [x] Update README

## Plan — Part B: Backend → Rust (see `nomad-estate-database-api/PROGRESS.md`)

- [x] B1 Inventory: every endpoint the frontend calls + all Nest controllers (`nomad-estate-database-api/rust/ENDPOINTS.md`)
- [x] B2 Move frontend logic to backend: `create-full`, `update-full` (one transaction, server-side score), `search` (joined names, coordinates, cover photo, tags, pagination), `geo` — implemented and tested in Rust; the frontend still calls the Nest routes
- [x] B3 Rust service skeleton (Axum, SQLx, config, tracing, errors, JWT auth, CORS, compression, rate limit, OpenAPI)
- [ ] B4 Port modules (auth/tokens/users/agencies/agents → properties → analytics → mail/inquiry/subscription)
- [ ] B5 AI API (`nomad-estate-ai-api`) port to Rust
- [ ] B6 Schema visualizer: keep `prisma/schema.prisma` as schema documentation/migrations source, or switch to SQL introspection
- [ ] B7 Parity tests, switch frontend to Rust API, decommission Nest

## Session log

- **2026-10-04 (interactive):** Audited all repos. Decisions recorded above. Created `redesign` branches,
  imported local WIP. Started A1 (NOT yet build-verified — cloud sandbox had no npm registry access):
  - `package.json`: new deps added with version `latest` → run `npm install`, then pin the resolved versions.
  - `postcss.config.mjs`, `components.json`, `app/globals.css` (light/dark tokens), `app/layout.tsx`, `app/providers.tsx`
  - `components/ui/*` (shadcn new-york-v4, copied from shadcn-ui/ui), `components/magicui/*` (theme toggler, number ticker, blur fade, marquee, border beam)
  - `components/site/{logo,theme-toggle,site-header}.tsx`, `hooks/{use-mobile,use-session}.ts`, `lib/utils.ts`
  - `lib/properties/{labels,types,normalize,format,filters,queries}.ts` (nuqs URL filters + TanStack Query search)
  - Next: `npm install`, `npx tsc --noEmit`, `npm run build`, fix errors, then A2 (MapLibre globe).
  - Backend security note for B2/B4: property create/update/delete routes are `@Public()` in Nest — must require agency auth in Rust.
- **2026-10-04 13:50 (Claude Code, local):** All four local repos switched to `redesign` (local WIP stashed; it matched
  commit d83ea43 apart from line endings). CI workflow rewritten (runs on `redesign`: install → typecheck → lint → build),
  `lint` script moved to the ESLint CLI with a native flat config (`eslint-config-next` 16), legacy `.eslintrc.json` removed.
  **None of this is verified yet: the local machine has no Node.js installed** (no node/npm/nvm on PATH or disk), so
  `npm install` has not run and `package.json` still has `latest` versions / a stale lock (CI will fail at `npm ci` until then).
  - Next: get Node 20.19.5 available → `npm install` → pin `latest` versions → `npm run typecheck && npm run lint && npm run build` → fix → A2.
- **2026-10-04 13:47 (Claude Code, local):** A1 build verified. Portable Node 20.19.5 lives in `D:DesktopNomadEstate.tools
ode-v20.19.5-win-x64`
  (not on the system PATH — prepend it per command). `npm install` done, every `latest` pinned to a caret range.
  `maplibre-gl` pinned to `^5.24.0` (npm `latest` is already v6; the decision says v5 — owner to confirm if v6 is wanted).
  `npm run typecheck` = 0 errors, `npm run lint` = 0 errors / 126 warnings, `npm run build` passes (15 routes).
  - Lint: React Compiler rules (`set-state-in-effect`, `use-memo`, `immutability`) and `no-explicit-any` are downgraded to warnings
    for legacy folders only (`app/(pages)`, `app/components`, `app/reactDevBits`, `app/hooks`) — remove that override in A8.
  - New code fixed: `theme-toggle` (useSyncExternalStore for mounted), `queries.ts` (`useQueries` + `combine`).
  - Nothing has been looked at in a browser yet. Next: `scripts/mock-api.mjs` + `scripts/screens.mjs`, review screenshots of the
    header/tokens in both themes, add the footer, then A2 (`components/globe/PropertyGlobe.tsx`).
- **2026-10-04 14:37 (Claude Code, local):** A2 first pass is in and builds (`typecheck`, `lint` 0 errors, `build`).
  - New: `lib/map/style.ts` (light/dark MapLibre style: bundled `public/map/countries.json` below zoom 3.5, OpenFreeMap tiles above,
    graticule, match-country fill, clustered pins, active pulse), `components/globe/{index,property-globe}.tsx` (lazy, `ssr: false`,
    auto-spin with 8 s idle resume, reduced-motion aware, lights-on intro, fly-to, destroyed on unmount),
    `components/properties/{properties-view,filter-bar,results-panel,preview-card,listing-parts}.tsx`, `lib/properties/saved.ts`,
    `app/(pages)/properties/page.tsx` now renders the new view (legacy MUI components are no longer used by this route).
  - `scripts/build-countries.mjs` slims `earth-countries.json` (1.5 MB) to `public/map/countries.json` (180 kB).
  - **Bug fixed:** `app/config/env.ts` read `process.env[key]` dynamically, so `NEXT_PUBLIC_API_URL` was never applied in the browser
    (always fell back to production). Now uses literal `process.env.NEXT_PUBLIC_*`.
  - Screenshots (`npm run screens -- --only=properties`) reviewed in both themes, 1440 and 390: globe, pins, clusters, filters chips,
    selected preview card all render. Flag emoji show as two letters on Windows (no flag glyphs in Segoe UI) — acceptable for now.
  - Not done yet / not verified: the interactive checks listed under A2, the filter popovers/sheet visuals, legacy `/` `/details` etc.
    still MUI. Legacy `/properties`-style WebGL pages hang headless screenshots; the script now times out per page instead of blocking.
  - Local dev: `node scripts/mock-api.mjs` + `.env.development.local` with `NEXT_PUBLIC_API_URL=http://localhost:4010` (git-ignored).
  - Next: browser-verify A2 interactions, then A3 home (hero reuses `PropertyGlobe` with `interactive={false}`).
- **2026-10-04 14:42 (Claude Code, local):** Fixed: pins and country highlights disappeared after a theme switch (`setStyle` diff resets
  GeoJSON sources) — data is now re-applied after every style change. Results rail sits closer to the filter bar when no chips are shown.
  Local preview config lives in `.claude/launch.json` (untracked, machine-specific Node path).
- **2026-10-04 15:05 (Claude Code, local):** A3 home done: `app/(pages)/(home)/page.tsx` (server component), `components/home/home-client.tsx`
  (hero with non-interactive `PropertyGlobe`, search → `/properties?q=`, stats band from `/property/stats-home` with NumberTicker,
  featured markets computed from the catalogue), `components/site/site-footer.tsx`. Screens reviewed light/dark, 1440/390.
  Legacy `app/components/homeComponents/*` is now unused by `/` (delete in A8). Next: A4 `/details/[id]`.
- **2026-10-04 15:25 (Claude Code, local):** A4 details done: `lib/properties/details.ts` (`usePropertyDetails`, `sendInquiry` → `POST /inquiry/create`),
  `components/details/property-details.tsx` (Embla gallery + Dialog lightbox, investment panel, key facts, grouped features, tags,
  mini MapLibre map, agency card + inquiry form with react-hook-form/zod, similar properties), `/details` redirects to `/properties`.
  Not verified: lightbox and inquiry submit while signed in (needs a session; mock API has no auth routes yet). Feature enum values are
  humanised from the API names (e.g. `CCTV` shows as "Cctv"). On a 390 px screen the page was 6 px wider than the viewport; clipped on
  the article for now, the offending element still needs finding. Next: A5 auth.
- **2026-10-04 16:00 (Claude Code, local):** A5 auth done. `lib/auth/session.ts` (persistSession + `notifySessionChange`, signIn tries investor then agency,
  changePassword, confirmEmail, Google URL), `components/auth/{auth-shell,login-form,register-form,location-fields,account-forms}.tsx`,
  `components/reactbits/{stepper,topography}.tsx` (from the React Bits registry; Stepper restyled with tokens + `onBeforeNext` validation gate).
  Routes rewritten: `/login`, `/register` (`?as=agency`), `/verify`, `/{user,agency}/changePassword`, `/{user,agency}/logOut`.
  - Mock API gained auth fixtures (demo accounts are listed in `scripts/mock-api.mjs` under `DEMO_ACCOUNTS`), states/cities-by-country, inquiry.
  - Headless end-to-end check against the mock: wrong password, sign in, header account menu, inquiry validation + send, save property,
    investor registration through all three steps. Agency registration submit, verify, change password and sign-out pages are built but
    were only type-checked and (register) screenshotted, not clicked through.
  - **Backend mismatches found (frontend now follows the backend):** legacy pages called `PATCH /auth/{user,agency}/change-password` without
    the `/:id` the Nest route requires; errors from `app/lib/api.ts` are `ApiError` with `statusCode` (not axios `response.status`).
  - **Assumption to confirm:** Google sign-in calls `GET /oauth/user/google` for the URL and expects Google to return to `/login?code=…`,
    which is exchanged at `/oauth/user/google/callback`. That only works if the backend `redirectUri` points at the frontend `/login`,
    and the Nest callback currently returns the Google profile, not tokens. Needs a decision in B4 (owner).
  - Next: A6 dashboards (`/dashboard` agency KPIs, listings table, agents, create/edit property; investor saved list).
- **2026-10-04 15:33 (Claude Code, local):** A6 agency side done. (Heartbeat times in the three entries above were estimates that ran ahead of the
  clock; from here on they are read from the system clock.)
  - `lib/dashboard/queries.ts`, `components/dashboard/dashboard-view.tsx` (KPI tiles, shadcn `chart` + Recharts bars, TanStack Table v8 with sort,
    filter, pagination, delete confirm via `alert-dialog`, agents manager), `components/dashboard/property-form.tsx` (5-step create/edit on the
    React Bits Stepper; submits through the existing `createProperty` / `updateProperty` in `app/lib/propertyApi.ts`).
    Routes: `/dashboard`, `/dashboard/properties/new`, `/dashboard/properties/[id]/edit`.
  - Headless end-to-end check against the mock: sort, filter, add agent, create a property through all five steps, land on its details page,
    reopen it in the edit form with values prefilled. Not exercised: saving an edit, deleting a property, removing an agent, file upload.
  - **Security finding:** `app/components/createPropertyComponents/ImageUploadSection.tsx` has a hard-coded ImgBB API key in client code (and in git
    history). The new form reads `NEXT_PUBLIC_IMGBB_KEY` instead and falls back to pasted image links when it is not set. Owner: rotate that key;
    move uploads server-side in B4.
  - `@tanstack/react-table` is pinned to v8 (npm `latest` is v9 with a different API). shadcn CLI refreshed `button.tsx` and `card.tsx`.
  - Screenshot tooling: fixture sessions are stored after a first navigation (Playwright init scripts that touched localStorage hung navigation).
  - Per-listing analytics (views, CTR, leads) are not on the dashboard yet: the current API needs one call per property per metric (B2/B4).
  - Next: investor `/user` profile with saved properties, `/sorry` + 404 (A7), then A8 cleanup.
- **2026-10-04 15:35 (Claude Code, local):** A7 done: `components/account/profile-view.tsx` (`/user`), `components/site/notice-page.tsx` used by
  `app/not-found.tsx` and `/sorry`. Screens reviewed. Every route under `app/(pages)` now renders new components; nothing imports MUI except
  `app/providers.tsx` and the legacy folders. Next: A8 (delete legacy code and dependencies, bundle check, README).
- **2026-10-04 15:51 (Claude Code, local):** A8 cleanup. Deleted `app/components`, `app/reactDevBits`, `app/GradientText`, `app/hooks`, `app/theme.ts`,
  unused `app/lib` files and every legacy `public/` asset; removed 25 dependencies (152 packages). `app/lib/property/{types,enums}.ts` keep the
  two type files `propertyApi.ts` needs. New `components/site/error-boundary.tsx`. ESLint legacy override removed: lint is 0 errors / 6 warnings.
  `typecheck`, `lint`, `jest` (31 tests), `build` pass; `npm run screens` captured all 12 routes x 2 themes x 2 widths after the cleanup.
  - `three-geojson/` was a nested git checkout with local modifications: it is untracked from this repo and git-ignored, but **left on disk**
    (owner decides whether to delete the folder). The Natural Earth source moved to `scripts/data/earth-countries.json` (no longer served).
  - **Performance, measured but not yet fixed** (`node scripts/bundle-report.mjs`, compressed JS including Next link prefetches): `/login` 547 kB,
    `/dashboard` 875 kB, `/` and `/properties` 974 kB. Largest chunks: MapLibre 271 kB gz (map routes only), Recharts 119 kB gz, zod 102 kB gz,
    react-dom 68 kB gz. `optimizePackageImports` for `radix-ui`/`recharts` made no measurable difference. Candidates: `zod/mini` or lighter
    validation on auth pages, lazy-load Topography and the lightbox, review which Links prefetch. Lighthouse has not been run.
  - Listing photos use `next/image` with `unoptimized` (the API returns data URIs or arbitrary hosts): real optimisation needs image URLs from B2.
  - Part A status: A1–A8 implemented. Open items are the unchecked boxes above (MapTiler layer, a few manual A2 checks, performance pass).
  - Next: performance pass, then Part B. Part B needs the Rust toolchain on this machine (`cargo` is not installed).
- **2026-10-04 16:56 (Claude Code, local):** Performance pass. Tooling: `node scripts/lighthouse.mjs` (Lighthouse through Playwright's headless
  Chromium on the real GPU; `LH_GL=swiftshader` for machines without one), `scripts/lighthouse-summary.cjs`, reports in `.lighthouse/` (git-ignored).
  - Baseline (mobile, simulated slow 4G + 4x CPU): `/` 45, `/properties` 49. After the changes: **`/` 59, `/properties` 56**; accessibility 100,
    best practices 100, CLS 0. FCP 1.5 s / 1.1 s, LCP 3.7 s / 6.9 s, TBT 2.5 s / 0.76 s.
  - Done: the globe (MapLibre chunk) and the home catalogue request start after first paint (`hooks/use-after-first-paint.ts`); `/properties` has a
    server-rendered shell instead of a blank Suspense fallback; the pins "lights on" moment uses GPU paint transitions instead of per-frame
    data-driven `setPaintProperty`; the mock API serves photos as URLs like the real API (search payload 832 kB → 380 kB).
  - **Why 90 is not reached yet, in order of impact:** (1) `/properties` LCP is the first result row, which waits for the whole catalogue: needs the
    paginated `/property/search` + lightweight `/property/geo` from B2; (2) MapLibre costs 4–5 s of main-thread time under 4x CPU throttling
    (several 250–550 ms tasks on the home hero) — not yet profiled, candidates are a smaller hero canvas on phones and pausing the spin off-screen;
    (3) first-load JS: zod 102 kB gz and Recharts 119 kB gz are on routes that could lazy-load them.
  - Headless Chromium on this machine can use the GPU with `--use-angle=d3d11 --enable-gpu`; the full `chrome.exe` fails to spawn, so Lighthouse
    is driven through Playwright's headless shell. `npm run screens` still uses SwiftShader as specified.
  - Next: B1 endpoint inventory (`nomad-estate-database-api/rust/ENDPOINTS.md`). B3 onwards needs `cargo`, which is not installed here.
- **2026-10-04 17:05 (Claude Code, local):** A2 interaction checks + B1.
  - Two bugs found by the checks and fixed: (1) the Price/Yield/Score sliders remounted after every committed step, so keyboard users lost
    focus after one arrow press; (2) "Search this area" never appeared after a wheel zoom because MapLibre sets no `originalEvent` on that
    `moveend` — the globe now tracks user gestures itself.
  - A previous commit (`edf4ae6`) accidentally included the owner's local `LOCAL_SCHEDULED_TASK_PROMPT.md` (picked up by `git add -A`). It was
    untracked again in `9688c55` and stays on disk; it remains in the branch history (no secrets in it). Personal files are now listed in
    `.git/info/exclude` so this cannot repeat.
  - **B1 done** in `nomad-estate-database-api`: `rust/ENDPOINTS.md` (179 routes, 42 controllers, generated by `rust/tools/gen-endpoints.mjs`).
    **Security findings on the current Nest API (live in production):** there is no global auth guard, so only 8 routes require a token and
    109 mutating routes are open to anyone (property create/update/delete, agent create/delete, analytics writes, …); rate limiting is
    configured but never enforced; CORS allows any origin containing `railway.app`, `railway.dev`, `localhost` or `127.0.0.1`.
    Details and the proposed per-route auth for Rust are in that repo's PROGRESS.md and ENDPOINTS.md.
  - **Blocked on the owner:** B2 onwards needs the Rust toolchain. `cargo`/`rustc` are not installed on this machine, and on Windows the MSVC
    build tools are needed too. Nothing in Part B after B1 has been started.
  - Open in Part A: MapTiler satellite layer (needs a key to verify), Lighthouse 59/56 vs target 90 (see the performance entry), pin → list
    hover scroll and unsave not verified, 6 px overflow source on `/details` at 390 px (clipped, not found).
- **2026-10-04 17:39 (Claude Code, local):** Part B started with the owner's go-ahead: Rust 1.99 (GNU toolchain) and a portable PostgreSQL 17 were
  installed for development (`~/.cargo`, `~/.rustup`, `D:\Desktop\NomadEstate\.tools`). **B2 and B3 are done** in `nomad-estate-database-api/rust`:
  fmt, clippy `-D warnings` and 15 tests pass (9 of them integration tests against Postgres). Details, decisions and next steps are in that repo's
  PROGRESS.md and `rust/README.md`.
  - Frontend follow-up (not started): point `lib/properties/queries.ts` at `/property/search` + `/property/geo` and the property form at
    `create-full` / `update-full` once the Rust API is the one deployed; that removes the per-city lookups and should fix `/properties` LCP.
  - Next: B4 (tokens/auth/users first).
- **2026-10-04 17:48 (Claude Code, local):** B4 part 1 done in `nomad-estate-database-api/rust`: register, login, logout, change-password,
  confirm and refresh for users and agencies; 23 tests pass, including compatibility with password hashes and tokens created by Nest.
  Behaviour changes that the frontend should know about when it switches: a refresh token works once (the axios interceptor already stores
  the new one), sign-up `role` must be INVESTOR or AGENT, repeated wrong passwords return 403 "Account is locked".
  Next in B4: users, agencies/agents, remaining property read routes.
- **2026-10-04 18:01 (Claude Code, local):** Token refresh made safe for rotation. Frontend `app/lib/auth/tokenService.ts`: one refresh at a
  time (parallel 401s share the call), the rotated `RefreshJTI` is stored so logout revokes the right token, and a failed refresh first checks
  whether another tab already stored a new pair before signing out. Rust API: a used refresh token replayed within 10 s is a plain 401; only a
  later replay revokes every session. Jest 31/31, Rust 23/23.
  - Dev note: the local PostgreSQL must be started detached (PowerShell `Start-Process pg_ctl …`); started from a tool shell it dies with it.
