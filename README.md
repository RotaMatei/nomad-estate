# Nomad Estate — frontend

Next.js app for finding investment property worldwide: every listing is a point of light on one MapLibre globe
that zooms from the planet down to street level. Investors search, save and contact agencies; agencies list and
manage their portfolio.

Work in progress on branch `redesign`. The plan, decisions and session log are in [PROGRESS.md](PROGRESS.md).

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 + shadcn/ui (Radix), lucide-react, Motion, next-themes (light and dark, designed equally)
- MapLibre GL JS v5 in globe projection; bundled country shapes when zoomed out, OpenFreeMap vector tiles when zoomed in
- TanStack Query (server state), nuqs (search filters in the URL), TanStack Table and Virtual
- react-hook-form + zod, sonner, vaul, cmdk, embla-carousel, Recharts through shadcn `chart`
- Archivo Variable via `@fontsource-variable/archivo`

## Getting started

Node 20.19.5 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local
npm run dev
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Database API origin. `/api` is appended automatically. Default `https://api.nomadestatehub.com` |
| `NEXT_PUBLIC_AI_API_URL` | AI API origin. Default `https://ai.nomadestatehub.com` |
| `NEXT_PUBLIC_API_FLAVOR` | `rust` (default) or `nest`. Must be `nest` for as long as `NEXT_PUBLIC_API_URL` points at the Nest app. `rust` uses the joined search, one-request property saves, password reset and Google sign-in of the Rust API |
| `NEXT_PUBLIC_IMGBB_KEY` | Optional. Enables photo upload in the property form |

### Working without the backend

`scripts/mock-api.mjs` serves deterministic fixtures (150 properties in 40 countries, demo investor and agency
accounts, agents, inquiries) on port 4010:

```bash
npm run mock-api
```

Then set `NEXT_PUBLIC_API_URL=http://localhost:4010` in `.env.development.local` and run `npm run dev`.
The demo sign-ins are listed under `DEMO_ACCOUNTS` in the script.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config) |
| `npm test` | Jest unit tests |
| `npm run mock-api` | Fixture API on :4010 |
| `npm run screens` | Builds against the fixture API and captures every route in light and dark at 1440 and 390 px into `.screens/`. `-- --no-build` reuses the last build, `-- --only=home,login` limits routes |
| `node scripts/bundle-report.mjs` | First-load JavaScript per route, and whether the map chunk is in it |
| `node scripts/build-countries.mjs` | Regenerates `public/map/countries.json` from the Natural Earth source in `scripts/data/` |

## Layout

```
app/(pages)/          routes: /, /properties, /details/[id], /login, /register, /verify, /dashboard, /user, …
app/lib/              API client (axios + token refresh), auth token storage, property and agent API helpers
components/ui/        shadcn/ui components
components/globe/     PropertyGlobe (MapLibre), loaded lazily and only in the browser
components/{properties,home,details,auth,dashboard,account,site}/   feature UI
components/{magicui,reactbits}/   third-party showcase components, restyled
lib/map/              MapLibre style for both themes
lib/properties/       types, normalisers, URL filter parsers, queries
lib/{auth,dashboard}/ session helpers and dashboard queries
```

Design tokens (colours, radii, type scale) live in `app/globals.css`; the map palette mirrors them in `lib/map/style.ts`.
