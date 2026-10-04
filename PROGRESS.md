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
- **Last heartbeat:** 2026-10-04 13:35 Europe/Bucharest (interactive session, paused — owner moving to Claude Code)

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
- [ ] Install Tailwind v4, shadcn/ui (components.json), `next-themes`, `lucide-react`, Motion, TanStack Query, nuqs
- [ ] Design tokens (light + dark) in `app/globals.css`, fonts via @fontsource (no network at build)
- [ ] App shell: new header (glass, theme toggle, auth menu), footer, mobile nav (shadcn Sheet)
- [ ] Typed API client (`lib/api`) kept; add query hooks in `lib/queries/*`
### A2 Properties search (flagship)
- [ ] `components/globe/PropertyGlobe.tsx` — MapLibre globe, atmosphere, auto-spin (pauses on interaction), light/dark styles
- [ ] GPU pins: GeoJSON source + circle/symbol layers with glow + pulse; clustering
- [ ] Pin ↔ list sync (hover highlights, click flies to property, preview card)
- [ ] Filter bar (shadcn Popover/Slider/Command/ToggleGroup): price, yield, score, beds/baths, area, type, investment-goal tags, location-benefit tags, country/city
- [ ] Results panel: virtualized list/grid, sort, skeletons, empty state; "search as I move the globe"
- [ ] URL state for every filter (shareable searches)
### A3 Home / landing
- [ ] Hero with live globe + headline + search entry, stats, value props, "choose path" (investor / agency), CTA, footer
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
