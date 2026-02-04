# Nomad Estate Frontend

Next.js frontend for NomadEstate: property search, investor/agency dashboards, analytics, and real estate investment insights. Uses Material-UI, Three.js/globe visualizations, and Leaflet maps.

## Requirements

- Node.js (see `.nvmrc` if using nvm)
- Environment variables (see below)

## Environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | Database API URL (default: `https://api.nomadestatehub.com`) |
| `NEXT_PUBLIC_AI_API_URL` | No | AI API URL (default: `https://ai.nomadestatehub.com`) |

For local development:
- `NEXT_PUBLIC_API_URL=http://localhost:4000` (database-api)
- `NEXT_PUBLIC_AI_API_URL=http://localhost:3000` (ai-api)

## Setup and run

```bash
npm install
cp .env.example .env.local   # then edit .env.local
npm run dev
```

Other scripts:

- `npm run dev` – development server (Turbopack)
- `npm run build` – production build
- `npm run start` – start production server (run `build` first)
- `npm run lint` – ESLint
- `npm run format` – Prettier format
- `npm run format:check` – Prettier check
- `npm run test` – Jest (when configured)

## Project structure

- `app/` – Next.js App Router pages and components
  - `(pages)/` – Route groups (home, dashboard, properties, login, register, etc.)
  - `components/` – React components (home, dashboard, property forms, etc.)
  - `lib/` – API clients, utilities, auth helpers
  - `hooks/` – React hooks (useAuth)
  - `config/` – Environment configuration
- `public/` – Static assets

## Relation to other repos

- **nomad-estate-database-api** – Main NestJS API (users, agencies, properties, analytics); consumed via `NEXT_PUBLIC_API_URL`
- **nomad-estate-ai-api** – AI-derived market data API; consumed via `NEXT_PUBLIC_AI_API_URL`

## Testing

Run tests with:
```bash
npm test
```

Tests use Jest and React Testing Library. See `jest.config.js` for configuration.

## Code Quality

- **Error Boundaries**: Added `ErrorBoundary` component for catching React errors
- **Constants**: Centralized magic strings/numbers in `app/lib/constants.ts`
- **Type Safety**: TypeScript strict mode enabled, shared types in `app/lib/types/`
- **Error Handling**: Standardized API error handling with `app/lib/api/errors.ts`
- **Security**: Input sanitization utilities in `app/lib/utils/sanitize.ts`
- **Accessibility**: Utilities in `app/lib/utils/accessibility.ts` for ARIA labels and keyboard navigation

## Performance

- Token expiration checks before API calls
- Debounce hook for search inputs (`useDebounce`)
- Loading state management hook (`useLoadingState`)
- Error boundaries to prevent full app crashes

## Security Notes

- Tokens stored in localStorage (consider httpOnly cookies for production)
- Input sanitization utilities available
- API responses validated
- CSRF protection should be added if needed (requires backend support)

## License

ISC (private).
