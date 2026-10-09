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
- **Last heartbeat:** 2026-10-09 13:07 Europe/Bucharest (visual refresh done; Part C continues with C4 or C5)

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
- [ ] Performance: Lighthouse mobile, measured 2026-10-05: `/` 97 with real throttling (85 simulated), `/properties` 73 (52 to 60 simulated); target 90 **not met on `/properties`** (owner chose to keep the map starting on its own). Accessibility and best practices are 100 on both
- [x] Update README

## Plan — Part B: Backend → Rust (see `nomad-estate-database-api/PROGRESS.md`)

- [x] B1 Inventory: every endpoint the frontend calls + all Nest controllers (`nomad-estate-database-api/rust/ENDPOINTS.md`)
- [x] B2 Move frontend logic to backend: `create-full`, `update-full` (one transaction, server-side score), `search` (joined names, coordinates, cover photo, tags, pagination), `geo` — implemented and tested in Rust; the frontend still calls the Nest routes
- [x] B3 Rust service skeleton (Axum, SQLx, config, tracing, errors, JWT auth, CORS, compression, rate limit, OpenAPI)
- [x] B4 Port modules (auth/tokens/users/agencies/agents → properties → analytics → mail/inquiry/subscription): all 179 Nest routes, Google sign-in included. Stripe subscription is commented out in Nest, nothing to port.
- [x] B5 AI API (`nomad-estate-ai-api`) port to Rust (`rust/` in that repo)
- [x] B6 Schema visualizer: keeps `prisma/schema.prisma` as the schema documentation, served by the Rust API; restyled to the app tokens
- [ ] B7 Parity tests (done, `rust/PARITY.md`), frontend default switched to the Rust flavor (done), deployment prepared (`rust/DEPLOY.md`). Open, owner only: deploy, then approve removing Nest

## Plan — Part C: AI features

Brief: `CLAUDE_CODE_PART_C_AI_PROMPT.md` (owner's hand-off, kept out of git). Architecture and every measured number:
`nomad-estate-ai-api/docs/AI_ARCHITECTURE.md`. Backend-side detail: `nomad-estate-ai-api/PROGRESS.md`.

Rules that bind every step: the Rust AI API is the only AI gateway (`/api/ai/*`); Python only in `nomad-estate-ai-api/ml/`
and only called by Rust; the language model is Qwen3 behind an OpenAI-compatible server (owner, 2026-10-06), named by env vars; pgvector in the existing Postgres; schema changes are additive, in
`prisma/schema.prisma` plus migration SQL, never applied to production without the owner; money maths only in tested Rust
code; AI output is labelled; no personal data goes to a model; every feature has a flag (off in production until reviewed),
a rate limit, usage logging and a daily budget.

Done means, for each step: endpoint(s) with OpenAPI docs; unit tests and an eval passing its threshold where one applies;
flag, rate limit, usage logging; UI in both themes, phone and desktop, keyboard and reduced motion; screenshots looked at;
`AI_ARCHITECTURE.md` updated; box ticked with a session-log line saying what was measured.

### C0 Foundation (`nomad-estate-ai-api/rust/src/ai/`)
- [x] Plan in the PROGRESS files, `docs/AI_ARCHITECTURE.md`
- [x] Provider trait: Anthropic Messages API and OpenAI-compatible clients, timeouts (fast 8s, smart 60s), 2 retries with jitter, SSE streaming
- [x] Versioned prompt files loaded at startup; prompt version logged with every call
- [x] `AiUsage` table, cost per call, daily budget guard per feature (503 when spent)
- [x] Cache (moka), rate limits per IP and per user, feature flags and `GET /api/ai/features`
- [x] `pii.rs` scrubber with unit tests
- [x] Eval runner (`cargo run --bin evals -- <feature>`), recorded fixtures in CI, `--live` by hand
- [x] `docker-compose.ai.yml`: Postgres with pgvector, TEI embeddings (bge-m3) and reranker (bge-reranker-v2-m3) (written; not started here: Docker Desktop is not running)

### C1 Price history
- [x] `PropertyPriceHistory` table; rows written in the same transaction as create-full, update-full, status changes and delete
- [x] Postgres trigger on `Property` as a safety net, without double inserts; backfill one row per existing property
- [x] Details page: price-history sparkline when there are 2 or more points

### C2 Natural-language search
- [x] `POST /api/ai/search/parse`: gazetteer, then model with one `set_filters` tool, then server-side validation, then tag similarity (rules in 7 languages first; the model only for what they leave over)
- [x] "Describe what you're looking for" on `/` and `/properties`, removable chips, "Did you mean" at low confidence (only the filters go in the URL, never the sentence; the globe turns to the results)
- [x] Eval: 150+ queries in EN, RO, ES, PT, DE, FR, IT; per-field accuracy >= 90%, exact match >= 75%, p95 < 1.5s uncached. **Met on rules alone: 163 queries, 97.9% per-field, 93.3% exact, under 1 ms; with embeddings 98.9%, 96.3%, 213 ms. Still open: the same run with Qwen3 (`--live --record`), which the owner asked to hold.**

### C3 Country answers with citations (RAG)
- [x] pgvector, `KnowledgeSource` / `KnowledgeChunk`, HNSW and GIN indexes (schema `ai`, SQL only)
- [x] Python ingestion (`ml/ingest/`), `sources.yaml` for the 10 countries with most listings (owner reviews the URLs before production) **5 countries so far (ES, PT, GR, AE, RO), 19 documents, none reviewed; the other countries have no sources yet**
- [x] Hybrid retrieval, rank fusion, rerank; `POST /api/ai/ask` streaming with citations and refusals
- [x] "Ask about buying in {country}" panel; eval with 60 questions over 5 countries **Retrieval measured (86% / 88% / 90%); answers not measured until Qwen3 runs; latency needs a GPU reranker**

### C4 Listing autopilot
- [ ] `POST /api/ai/listing/analyse` (photos to existing enums, quality warnings, suggested cover), suggestions never auto-saved
- [ ] `POST /api/ai/listing/describe` with a numbers-match-fields check
- [ ] `PropertyTranslation` table, language switcher, machine translations labelled

### C5 Fair value
- [ ] `valuation.rs` (comparables, median price per m² with interquartile band), `GET /api/ai/valuation/:propertyId`
- [ ] Details page delta and "How we estimate"; badge on cards when |delta| >= 5% and comps >= 5
- [ ] Future: LightGBM in `ml/` at 5,000+ listings with history, ONNX in Rust

### C6 Lead scoring
- [ ] `Inquiry.status` and `statusChangedAt`; agencies set the status in the dashboard
- [ ] Heuristic score 0-100 with reasons; inquiries sorted by it
- [ ] Future: trained model at 500+ labelled inquiries, only if clearly better than the heuristic

### C7 Investment copilot: OUT OF SCOPE (owner, 2026-10-06: it needs an agent; the items below are not to be built for now)
- [ ] `finance.rs` with unit tests; tools; tool-use loop in Rust, at most 8 calls and 60s per turn; `POST /api/ai/copilot` streaming
- [ ] Side sheet with typed blocks (cards, comparison, cash-flow table with editable assumptions, citations)
- [ ] `CopilotThread` / `CopilotMessage`; eval with 40 scripted tasks and a numbers-come-from-tools check

### C8 Similar properties, duplicates, explainable score
- [ ] `PropertyEmbedding`, "Similar properties" carousel
- [ ] pHash per picture, admin list of listings sharing 3+ near-identical photos across agencies
- [ ] `score.rs` returns per-factor contributions; "Why this score" popover

### C9 Market forecasts (pipeline now, UI behind a flag)
- [ ] `MarketSeries` / `MarketObservation` / `MarketEvent`; scheduled ingestion in `ml/data/`
- [ ] Baselines, Chronos and TimesFM, rolling-origin backtest, ship per country only when it beats the baseline on MASE
- [ ] `GET /api/ai/forecast/:countryCode`; market page with fan chart and scenarios, flagged off
- [ ] Future: add our own price history as a series once C1 has 12 months

### Waiting on the owner (nothing blocks on these; fakes and fixtures stand in)
- [x] ~~Anthropic API key~~ Not needed: the owner chose Qwen3 (open weights) instead of Claude on 2026-10-06
- [x] Model host for development: Ollama on the owner's laptop. Still open: a GPU host for Qwen3 in production
- [ ] Where the TEI containers run
- [ ] Reviewed official sources per country (C3) and legal review of the disclaimers
- [ ] Approval before any Part C migration is applied to production
- [ ] Translation languages, if not EN, RO, ES, PT, DE, FR, IT

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
- **2026-10-04 18:07 (Claude Code, local):** B4 part 2 done in `nomad-estate-database-api/rust`: locations, listing details / portfolio / delete,
  users, agencies, agents, saved properties and inquiries (22 routes). 27 Rust tests pass. Every route the redesigned frontend calls now exists in
  Rust except Google sign-in. Details in that repo's PROGRESS.md.
  - Next: switch `lib/properties/queries.ts`, `lib/dashboard/queries.ts` and the property form to the new Rust endpoints and run the whole
    frontend against the Rust binary + local Postgres (seed script needed), then the rest of B4.
- **2026-10-04 18:16 (Claude Code, local):** The redesigned frontend now runs end to end on the Rust API.
  - `NEXT_PUBLIC_API_FLAVOR=rust` (default `nest`) switches the data layer: `lib/properties/queries.ts` uses `POST /property/search` (one
    request, no per-city lookups, sorted in SQL) and the property form uses `create-full` / `update-full`. Everything else already used
    paths that exist in both backends. With `nest` nothing changes, so the branch still works against production.
  - `scripts/e2e-rust.mjs`: headless run against the Rust binary + seeded local Postgres (`nomad-estate-database-api/rust/tools/seed-dev.mjs`).
    Passed: search (44 listings), country filter, investor sign-in, save, details with agency card and gallery, inquiry, profile with saved
    list, agency sign-in, dashboard KPIs and agents, publishing a property through the five-step form with the score computed by the server.
  - **Cause of the flaky headless runs found:** headless Chromium spent up to 40 s on proxy auto-detection before its first request.
    `--no-proxy-server` is now passed in `screens.mjs`, `lighthouse.mjs`, `bundle-report.mjs`; first navigation takes ~15 ms.
  - Known limits of the `rust` flavor: one page of 200 results (the list should page on scroll and the pins should come from
    `/property/geo`); Google sign-in and per-listing analytics are not ported; seed photos are remote placeholder images.
  - Next: (1) paged list + `/property/geo` pins in the `rust` flavor, then re-run Lighthouse on `/properties`; (2) rest of B4: view tracking,
    analytics, mail, Google OAuth, pictures, subscription, schema endpoint + socket; (3) B5 AI API, B6 visualizer, B7 parity suite.
- **2026-10-04 18:35 (Claude Code, local):** Paged search and geo pins (rust flavor), image optimisation, performance re-measured.
  - `usePropertySearch` now returns `{ listings, pins, total, hasMore, loadMore, … }` for both backends. Rust: the list is an infinite query
    (40 rows per page, next page requested as the reader nears the end), the pins come from `/property/geo`, "Search this area" is a server
    `bbox`. Nest: unchanged behaviour (one response, filtered and sorted in the browser). New `useListingsByIds` serves the saved list and a
    selected listing that is not on a loaded page. Home uses pins only; "More in <country>" asks for that country sorted by score.
  - Listing photos on known hosts (`lib/image-hosts.mjs`: ImgBB, picsum for the dev seed) go through the Next image optimiser;
    `/properties` total transfer dropped from 2,450 kB to 1,084 kB with the seed photos. Other hosts and data URIs are shown as they are.
  - Home hero globe starts at zoom 0.9 on phones (was 1.5): fewer map tiles to build, total blocking time 2.1 s → 1.0 s.
  - **Lighthouse (mobile, rust flavor, quiet machine): `/` 67, `/properties` 70** (from 45 / 49 at the start; target 90 still not met).
    Accessibility and best practices 100. Later runs on this machine were unusable: an unrelated `python3.13` process was using ~5 CPU cores
    and scores swung between 35 and 70. Re-measure on a quiet machine before drawing conclusions from the last two changes.
    Remaining cost is MapLibre's main-thread work while the first tiles build (6–9 tasks of 150–450 ms under 4x CPU throttling) and first-load JS.
  - Tooling: `scripts/lighthouse.mjs` reports failures instead of exiting silently; in Git Bash pass routes with `MSYS_NO_PATHCONV=1`
    (otherwise `/` is rewritten to a Windows path). Each Lighthouse/Playwright run can leave `chrome-headless-shell.exe` processes behind:
    kill them between runs.
  - `scripts/e2e-rust.mjs` passes again on the paged flavor, including "page 2 is requested on scroll". Nest flavor re-checked with `npm run screens`.
  - Next: rest of B4 (view tracking, analytics, mail, pictures, Google OAuth, subscription, schema endpoint + socket), then B5–B7.
- **2026-10-04 18:43 (Claude Code, local):** B4 part 3 done: the Nest-style property routes (features, tags, pictures, base create/update, score,
  status, old search) exist in Rust with ownership checks; 31 Rust tests pass. `rust/ENDPOINTS.md` tracks what is ported per route.
  Next: analytics, then inquiry/mail, preference, nearby amenities, remaining account routes, Google OAuth, schema endpoint + socket.
- **2026-10-04 18:51 (Claude Code, local):** B4 part 4 done: all 46 analytics routes ported with explicit access rules (visitor events public,
  listing numbers for the owning agency, platform data for ADMIN/MODERATOR users) and listing reads count a view. 34 Rust tests pass.
  Next: inquiry, mail, remaining account routes, preference, nearby amenities, Google OAuth, schema endpoint + socket.
- **2026-10-04 18:58 (Claude Code, local):** B4 part 5 done: inquiries, nearby amenities, preferences, account deletion and profile update, agent
  memberships, token purge and the last reference-data routes. 37 Rust tests pass. Left in B4: mail, Google OAuth, schema endpoint + socket.
- **2026-10-04 21:45 (Claude Code, local):** B4 part 6: `GET /api/schema` and the Socket.IO `schema:updated` broadcast (socketioxide, EIO 3 and 4,
  websocket and polling). Checked with the visualizer's own socket.io-client on all transports. The visualizer needs no code change (B6 compatibility).
  New variable `SCHEMA_PATH`. 39 Rust tests pass. Left in B4: mail, Google OAuth.
- **2026-10-04 22:02 (Claude Code, local):** B4 part 7: mail module (lettre over SMTP, same `SMTP_*` variables). `send-verify` now needs a session
  and mails only the caller's own address; `send-reset` mails only existing accounts with one answer for all; real tokens instead of the Nest
  placeholders; new `POST /auth/reset-password` (single-use, 30 min); contact form with attachment stored in `Email`/`EmailAttachment`; email-log
  deletes limited to the owner or an admin. New variables `MAIL_FROM`, `SUPPORT_EMAIL`, `FRONTEND_URL`. Checked against a local SMTP sink.
  41 Rust tests pass (the earlier "39" was 38). Left in B4: Google OAuth only (needs an owner decision on the flow).
  Frontend: `/forgot-password` and `/reset-password` pages, a "Forgot your password?" link on sign-in and a "send a confirmation link" button on
  the profile (all three only on the Rust flavor, since Nest mails placeholder links). `scripts/e2e-mail.mjs` drives the whole flow in a browser
  against the Rust API and a local SMTP sink: passes.
  **Owner decisions pending:** (1) Google OAuth flow for the Rust API; (2) real `SUPPORT_EMAIL`, `MAIL_FROM` and SMTP credentials for production.
- **2026-10-04 22:11 (Claude Code, local):** B5 done: `nomad-estate-ai-api/rust` (crate `nomad-ai-api`) serves `GET /api` and
  `GET /api/country-market-data/all` with the Nest response shapes, plus `/api/health` and an OpenAPI document. Run side by side with the Nest
  app on one local database: identical except two deliberate fixes (countries without a score come last, not first; ties ordered by id).
  5 tests pass. Dockerfile written but not built (no Docker here). Next: B6 visualizer, then the B7 parity suite.
- **2026-10-04 22:16 (Claude Code, local):** B6 done: the schema visualizer runs unchanged against the Rust API (schema load, socket, live reload
  on file change, checked in a browser) and is restyled to the app tokens with light and dark themes. Decision: `prisma/schema.prisma` stays the
  schema documentation; no SQL introspection. Next: B7 parity suite (Nest vs Rust on one local database), then the switch needs owner approval.
- **2026-10-04 22:28 (Claude Code, local):** B7 part 1, parity suite: `rust/tools/parity.mjs` runs 58 read requests against the Nest app and the
  Rust port on one seeded database and writes `rust/PARITY.md`. It found three real gaps, now fixed: timestamps had no zone (a browser would read
  them as local time; every JSON response now carries `...Z` with milliseconds, `src/dates.rs`), name search ignored `offset`/`limit`, and the
  primary-picture route returned an object where Nest returns a list. `fullName` added to user search. Result: 0 unexplained differences; the
  explained ones are access rules, ACTIVE-only listings, and extra or dropped fields. Tokens work across both apps. 44 Rust tests pass; the
  frontend end-to-end run on the Rust API passes. Left in B7: switching the deployment and removing Nest, both need owner approval.
- **2026-10-04 22:36 (Claude Code, local):** Owner decisions: finish Google sign-in properly; prepare the switch but keep Nest. Done: Google
  sign-in on the Rust API (signed `state`, verified email required, creates or links an investor account, returns the normal token pair, agency
  emails refused), tested against a stand-in for Google. All 179 Nest routes are now ported. Deployment files: `rust/Dockerfile` (not built yet),
  `rust/railway.example.json`, `rust/DEPLOY.md` with the environment checklist, what changes for people, and the order of the switch.
  45 Rust tests pass. Not started, needs approval: removing the Nest source.
  Frontend: Google sign-in keeps the `state` in the tab and refuses an answer it did not ask for; **the Rust flavor is now the default**
  (`NEXT_PUBLIC_API_FLAVOR=nest` keeps the Nest behaviour and is REQUIRED for any deploy whose `NEXT_PUBLIC_API_URL` still points at Nest;
  the mock API and `npm run screens` set it themselves). The browser side of Google sign-in is not exercised end to end: it needs real Google
  credentials.
- **2026-10-05 00:43 (Claude Code, local):** Part A leftover, Lighthouse (mobile). Cause found by profiling: MapLibre compiles 12 WebGL
  programs on the main thread at start (about 430ms on this machine, counted four times over by Lighthouse's CPU throttle); bundle size was not
  the problem. Done:
  - Home: the hero globe starts as a still frame (`public/globe/*.webp`, 12 to 36 KiB, made by `scripts/globe-posters.mjs`) and the live globe
    takes over in the same position when the visitor interacts or the page has been idle for 5s (`hooks/use-when-quiet.ts`). The hero box now
    has a fixed height, because the globe's perspective follows the height of its box. Link prefetching on the home page waits for the same
    moment (`components/site/quiet-link.tsx`).
  - Map style: 3 fewer programs (fills not antialiased, the pin layers share one circle program, no count labels on the backdrop globe).
  - `scripts/lighthouse.mjs`: `LH_THROTTLING=devtools` for real throttling, retries, IPv4 by default, and it now kills its browser.
  Scores, same build, two runs each. Home: 85 with Lighthouse's default simulated throttling (was 61 to 67), 96 with real throttling
  (TBT 1,900ms -> 40 to 140ms; in simulated mode LCP is estimated at 4.3s because on localhost every script arrives before the first paint,
  with real throttling LCP = FCP = 2.0s). `/properties`: 48 to 54 in both modes (TBT about 900ms, LCP 5 to 7s). **The >= 90 target is met on
  the home page only under real throttling and is not met on `/properties`.** There the map is the first screen, so it cannot wait behind a
  still without hiding the product; getting further needs an owner decision (see the summary to the owner). Accessibility and best practices
  stay at 100.
  - Not re-verified after the last two edits beyond one browser check per theme: the still/live alignment comparison (0.00% difference on
    phones, under 1% on desktop when measured). A `<picture>` version of the still was tried and dropped.
  - Tooling lesson: killing GPU headless browsers with `process.exit()` left about 20 processes Windows could not end, and until they cleared
    every browser run hung at load. The scripts now use `launchServer()` + `kill()`.
- **2026-10-05 07:27 (Claude Code, local):** Owner decision on `/properties`: server-render the results, keep the map starting on its own
  (accepting that the page stays below the 90 target). Done: the page is rendered per request and fetches the first page of the search for the
  URL's filters on the server (`lib/properties/prefetch.ts`, Rust flavor only, 1.5s limit, then the browser fetches as before), handing it to
  TanStack Query through `HydrationBoundary`. The filter definitions moved to `lib/properties/search-params.ts` so the server and the hooks share
  them. The HTML carries both layouts until hydration (rail on wide screens, a strip where the sheet will sit on phones). Checked in a browser on
  phone and desktop sizes: no hydration errors, the browser makes no search request of its own on load, filters in the URL are honoured.
  Lighthouse `/properties`, one clean run per mode: 56 simulated (was 48 to 51), 59 with real throttling (was 51 to 54); LCP 5.1s -> 4.0s with
  real throttling, less than hoped. I could not find out which element is the LCP now: headless browser runs became unreliable again.
  TBT (about 800ms, the map's shader compilation plus hydration) is what keeps the score down.
  - `scripts/lighthouse.mjs` and `scripts/globe-posters.mjs` now kill their whole browser process tree and use a fresh debugging port per run.
- **2026-10-05 08:47 (Claude Code, local):** Re-measured on a clean, idle machine (the stuck browser processes were gone and the unrelated CPU
  load had stopped), two or three runs each, identical results between runs:
  | page | simulated (Lighthouse default) | real throttling | before this work |
  |---|---|---|---|
  | `/` | 85 | 97 | 61 to 67 |
  | `/properties` | 52 to 60 | 72 | about 50 |
  Found why the server-rendered results had not moved LCP: the page still wrapped the view in `<Suspense>`, so React sent the fallback shell
  first and revealed the real content about half a second later. The boundary is gone (the page is rendered per request, so nuqs no longer
  needs it), the results are in the first flush, and LCP on `/properties` with real throttling went 5.1s -> 2.0s (= FCP). The first three
  photos in the list load eagerly. What is left on that page is blocking time (about 800ms: hydration and the map's shader compilation) and
  the map itself appearing late (speed index 7s).
  - Redone now that browsers run again: hydration check (no errors, no duplicate search request, phone and desktop), `scripts/e2e-rust.mjs`
    (all flows pass), the still-versus-live globe comparison (0.02 to 0.13% of pixels differ on phones, up to 1.2% on desktop). The stills
    were regenerated at higher quality (19 to 57 KiB).
- **2026-10-05 08:52 (Claude Code, local):** Part A leftovers checked in a browser against the Rust API: the details page no longer overflows
  at 390px (scroll width equals the viewport; only carousel slides sit outside, clipped as intended); hovering a pin highlights its card in the
  rail; saving then unsaving a listing works (DELETE 200, POST 201). CI added for both Rust services (`rust-ci.yml`: format, clippy, tests on a
  Postgres service, Docker image build). The frontend CI is green on GitHub; the API repos are private, so their runs are not visible from
  here. README has a Performance section. Open: MapTiler satellite layer (needs a key), deployment and Nest removal (owner).
- **2026-10-06 14:57 (Claude Code, local):** Part C (AI features) started from the owner's brief. The plan is above ("Plan — Part C"),
  mirrored in `nomad-estate-ai-api/PROGRESS.md`; the design is in `nomad-estate-ai-api/docs/AI_ARCHITECTURE.md`. Part A's open items stay as
  they are: MapTiler layer (needs a key), and Lighthouse on `/properties` at 73 (the brief quotes 59 and 56, which are the numbers from before
  the 2026-10-05 performance work; `/` is 97 now). One thing the brief could not know: the default smart model (`claude-sonnet-5-5`) rejects a
  forced tool choice and a non-default temperature, so the provider client adapts the request per model (table in the architecture doc).
  Local tools: `uv` and Python 3.13 are installed; Docker Desktop is installed but not running, and the portable Postgres has no pgvector,
  so C3 and C8 will need the compose Postgres.
- **2026-10-06 15:16 (Claude Code, local):** C0 (AI foundation) done in `nomad-estate-ai-api/rust/src/ai/`: provider trait with Anthropic
  and OpenAI-compatible clients (request shaped per model, 2 retries with jitter, SSE streaming, refusals as errors), versioned prompts,
  `AiUsage` rows with cost and a daily budget per feature, flags and `GET /api/ai/features`, rate limits per address and per user, cache,
  PII scrubber, eval runner with recorded answers for CI. `AiUsage` is in `prisma/schema.prisma` with its SQL in `prisma/sql/` (applied to the
  local database only). Measured: 32 tests pass in the AI API; the scrubber eval is 10/10. Cost model check: 1,000 search parses at about 900
  input and 120 output tokens on the fast model come to $1.50. No call has reached a real model: there is no API key yet. Next: C1.
- **2026-10-06 15:27 (Claude Code, local):** C1 (price history) done.
  - Database API (Rust): `PropertyPriceHistory` in `prisma/schema.prisma`, SQL with the trigger and backfill in
    `prisma/sql/2026-10-06_c1_price_history.sql`. Every route that creates, changes or deletes a listing writes the row in its own
    transaction; the trigger covers writes from anywhere else. Both insert only when price, yield or status differ from the listing's latest
    row, so a change is recorded once, and the API names the source for the trigger. Tested with and without the trigger (46 Rust tests).
    `GET /api/property/price-history/{id}` for public listings. On a database without the table the API skips the history.
  - Frontend: a step-line sparkline under the asking price on the details page once the price has changed at least once, with a sentence
    and a screen-reader list saying the same thing, and a hover label. Checked in light and dark, 1440 and 390 px: no overflow, no console
    errors, nothing shown for a listing whose price never changed.
  - Choices worth knowing: `currency` is always `USD` (listings have no currency column and the site shows dollars); history rows have no
    foreign key, so they survive a deleted listing; a delete adds a closing `DELETED` row.
  - Applied to the local database only (49 listings backfilled). **Production needs the owner's approval for both SQL files.**
  Next: C2 (natural-language search). It can be built and tested against recorded answers, but its accuracy targets need a real API key.
- **2026-10-06 15:40 (Claude Code, local):** Owner decisions for Part C: **Qwen3 (Hugging Face, open weights) instead of Claude**, run with
  Ollama on the owner's laptop for now; **C7 (copilot) out of scope** because it needs an agent; C3 stays in (one model call, not an agent);
  C4 photo analysis uses a Qwen vision model (`qwen2.5vl:7b`); Docker may be started for pgvector and the embedding containers.
  The AI API now defaults to the OpenAI-compatible provider with `qwen3:8b`; the Anthropic client remains as an unused second provider.
  **Do not run Qwen3 or any GPU work on this machine without asking: the owner is training a model on the same GPU.** Evals that need the
  real model (C2 accuracy, C3 answers) are therefore still unmeasured.
- 2026-10-06 19:03 (Claude Code, local): C2 backend. `POST /api/ai/search/parse` in the AI API (`rust/src/ai/search/`): contact details are cut first; rules in EN, RO, ES, PT, DE, FR, IT read places (gazetteer: countries by CLDR names, cities with a listing, new `PlaceAlias` table), prices, bedrooms as each language counts them, yields, scores, types, sort orders and plainly worded tags; Qwen3 is asked only for what the rules leave over, through one forced tool, and its answer is validated; leftover phrases can become tags by bge-m3 similarity. Eval `evals/search/queries.jsonl`, 163 sentences: rules alone 97.9% per-field and 93.3% exact match (targets 90 and 75), with embeddings 98.9% and 96.3%, p95 213 ms. Cautions recorded in `AI_ARCHITECTURE.md` section 6: I wrote both the rules and the sentences, and Qwen3 itself has still not been run (owner's request), so the model stage is tested with scripted answers only. The planned 0.6 similarity threshold was measured to be far too loose for bge-m3 and is 0.76. Docker is running the pgvector Postgres and the embedding container (it needed a smaller batch size to fit in memory). `PlaceAlias` is applied to the local database only. 60 tests pass in the AI API.
- 2026-10-06 19:23 (Claude Code, local): C2 frontend. With `search` on in `/api/ai/features`, the search box on `/` and in the filter bar of `/properties` takes a sentence ("Describe what you're looking for"). On `/properties` a confident reading replaces the filters (the existing removable chips show them), a note says the filters were set automatically, names what found no filter and says when a non-dollar amount was used as written; a reading under 0.6 confidence is offered as "Did you mean" with "Use these filters" and "Search names instead"; a sentence with no filter in it, or a reader that is down, falls back to the plain name search. The home page reads the sentence before navigating, so the search page opens already filtered; the sentence travels in memory, never in the URL. After a description is applied the globe turns to the results. Files: `lib/ai/search.ts`, `lib/ai/use-ask-search.ts`, `filter-bar.tsx`, `properties-view.tsx` (the rail now sits under the bar by measured height), `home-client.tsx`. Checked in a real browser, light and dark, desktop and phone: four flows, no console errors, no horizontal overflow. Also: cancelled requests are no longer logged as API errors; Jest can load `nuqs` (4 new tests, 35 pass). `typecheck`, `lint`, `build` green. Found on the way and left as a separate task: on phones the results sheet marks the rest of `/properties` `aria-hidden`, so the filter bar is hidden from screen readers (older defect). Not done in C2: running the eval and the UI against Qwen3 itself.
- 2026-10-06 20:07 (Claude Code, local): C3. Tables `ai."KnowledgeSource"` and `ai."KnowledgeChunk"` in their own schema, SQL only (Prisma cannot express pgvector and leaves other schemas alone). Python job `nomad-estate-ai-api/ml/ingest` (uv, ruff, pytest, its own CI) ingested 19 official documents, 453 passages, for ES, PT, GR, AE, RO; every source is unreviewed until the owner checks it. Rust: hybrid retrieval (pgvector + full-text, rank fusion, rerank), `POST /api/ai/ask` as server-sent events with checked citations, "no source" without calling the model when nothing is good enough, passages only when the model is down. Frontend: "Ask about buying in {country}" on the listing page, checked in a real browser in light and dark, desktop and phone. Retrieval eval, 60 questions: right document first 86%, among those sent 88%, unanswerable declined 90%; p95 19.8 s because the reranker runs on CPU here (needs a GPU in production). Answer quality is not measured: Qwen3 has still not been run. Some eval misses are my questions, written from summaries. For local work the AI API's main database is now the Docker pgvector Postgres (port 55433) holding a copy of the dev data; the CI Postgres is the pgvector image. 65 Rust tests, 7 Python tests, 37 frontend tests pass.
- 2026-10-09 13:07 (Claude Code, local): owner-requested visual refresh, outside the Part C list. Palette: pastel coral for agencies and pastel periwinkle for investors (the old Nomad red and blue, softened), orchid between them leading on shared pages, a CSS "liquid" gradient of the three behind heroes (the owner asked for the liquid gradient the old home page had; this one needs no WebGL), ink or white text. Tokens in `app/globals.css`, map colours in `lib/map/style.ts`, globe stills regenerated. `.audience-agency` / `.audience-investor` switch the lead colour (dashboard is coral). New logo (an N inside an orbit with a beacon, `components/site/logo.tsx`, `app/icon.svg`) and a loading screen that draws it once per tab, in CSS only. Home page: places marquee, larger numbers, a 3D "skyline" of listings per country built from CSS transforms, three charts from live listings (yield by country, price bands, price against yield; colours checked with the dataviz validator in both themes, each with a table view), tilt cards, numbered sections, a closing band. New `/about` and `/contact` (the form posts to the API's contact endpoint); every company detail in `lib/company.ts` is a placeholder. Database: `nomad-estate-database-api/prisma/backups/` holds `prod-empty.sql` (schema only) and `dev-mock.sql` (invented rows in all 44 tables, no real account, no tokens), both tested by restoring. Checked in a real browser, light and dark, desktop and phone. `typecheck`, `lint`, `build`, tests green. Lighthouse was not re-run after this change.
