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
- **Last heartbeat:** 2026-10-04 15:05 Europe/Bucharest (Claude Code local session — A3 done, starting A4)

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
- [ ] Still to verify by hand: pin → list hover scroll, "Search this area" result, Price/Returns/Home popovers and More filters sheet, mobile sheet drag, save/unsave while signed in
- [ ] Optional MapTiler satellite layer (`NEXT_PUBLIC_MAPTILER_KEY`); remove legacy `propertyDashComponents` + `MagicBento` once nothing imports them
### A3 Home / landing
- [x] Hero with live globe + headline + search entry, stats, value props, "choose path" (investor / agency), CTA, footer
### A4 Property details
- [ ] Gallery (lightbox), key metrics, investment panel (yield, score, price/m²), features, map, agency card, inquiry form, save
### A5 Auth
- [ ] Login, register (investor + agency multi-step), verify, change password, logout
### A6 Dashboards
- [ ] Agency dashboard: metrics, charts (Recharts restyled), listings table, agents manager
- [ ] Create / edit property — multi-step form (react-hook-form + zod)
- [ ] Investor dashboard / saved properties
### A7 User profile, 404/sorry page
### A8 Cleanup & performance
- [ ] Remove MUI, Emotion, styled-components, globe.gl, @openglobus/og, three/R3F (if unused), leaflet, d3, gsap, wave-gradient
- [ ] Lazy-load map chunk, image optimisation (next/image), route-level code splitting, Lighthouse ≥ 90 perf
- [ ] Update README

## Plan — Part B: Backend → Rust (see `nomad-estate-database-api/PROGRESS.md`)

- [ ] B1 Inventory: every endpoint the frontend calls + all Nest controllers
- [ ] B2 Move frontend logic to backend (atomic create/update property, server-side score, single search endpoint with joined city/country names + coordinates, clustering)
- [ ] B3 Rust service skeleton (Axum, SQLx, config, tracing, errors, JWT auth, OpenAPI)
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
