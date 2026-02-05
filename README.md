# Nomad Estate Frontend

A modern, feature-rich Next.js frontend application for the NomadEstate real estate investment platform. Built with React 19, Next.js 16, Material-UI, and advanced 3D visualizations using Three.js and globe.gl. Provides comprehensive property search, investor/agency dashboards, analytics, and real estate investment insights.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Key Features](#key-features)
- [Components](#components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Styling & Theming](#styling--theming)
- [3D Visualizations](#3d-visualizations)
- [Development](#development)
- [Testing](#testing)
- [Performance Optimization](#performance-optimization)
- [Security](#security)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

The Nomad Estate frontend is a comprehensive web application that enables:

- **Property Discovery**: Advanced search and filtering with map/globe visualizations
- **Investor Dashboard**: Portfolio management, analytics, property tracking
- **Agency Dashboard**: Property listing management, agent coordination, performance metrics
- **Market Insights**: AI-powered market data visualization and analysis
- **User Authentication**: Secure login/registration for investors and agencies
- **Responsive Design**: Mobile-first approach with Material-UI components

## Architecture

### Technology Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.1.0
- **UI Library**: Material-UI (MUI) 7.x
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei, globe.gl
- **Maps**: Leaflet, react-leaflet
- **Animations**: Framer Motion, GSAP
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Validation**: class-validator
- **Styling**: Emotion, Styled Components, CSS Modules
- **Fonts**: Montserrat (Google Fonts)
- **Build Tool**: Turbopack (development)

### Key Dependencies

```json
{
  "@mui/material": "^7.3.5",
  "@mui/icons-material": "^7.3.4",
  "next": "^16.1.6",
  "react": "19.1.0",
  "three": "^0.180.0",
  "globe.gl": "^2.44.1",
  "leaflet": "^1.9.4",
  "framer-motion": "^12.23.24",
  "axios": "^1.12.2",
  "recharts": "^3.3.0"
}
```

## Requirements

- **Node.js**: Version specified in `.nvmrc` (recommended: LTS version)
- **npm**: 8+ or yarn/pnpm equivalent
- **Backend Services**: 
  - nomad-estate-database-api (running on port 4000 for local dev)
  - nomad-estate-ai-api (running on port 3000 for local dev)

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd nomad-estate
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables) section).

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Verify Backend Services

Ensure both backend APIs are running:
- Database API: `http://localhost:4000`
- AI API: `http://localhost:3000` (or configured port)

## Environment Variables

### Required Variables

None required (defaults provided), but recommended for local development:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `https://api.nomadestatehub.com` | Database API base URL |
| `NEXT_PUBLIC_AI_API_URL` | No | `https://ai.nomadestatehub.com` | AI API base URL |

### Local Development Configuration

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AI_API_URL=http://localhost:3000
```

**Note**: `NEXT_PUBLIC_` prefix is required for client-side environment variables in Next.js.

## Project Structure

```
nomad-estate/
├── app/                          # Next.js App Router directory
│   ├── (pages)/                  # Route groups
│   │   ├── (home)/               # Home page route group
│   │   │   └── page.tsx          # Home page
│   │   ├── dashboard/            # Investor dashboard
│   │   │   └── page.tsx
│   │   ├── properties/           # Property listing/search page
│   │   │   └── page.tsx
│   │   ├── details/              # Property details
│   │   │   ├── [id]/             # Dynamic route
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   ├── user/                 # User profile pages
│   │   ├── agency/               # Agency pages
│   │   └── verify/                # Email verification
│   ├── components/               # React components
│   │   ├── homeComponents/      # Home page components
│   │   ├── propertyDashComponents/ # Property dashboard components
│   │   ├── investorsDashboardComponents/ # Investor dashboard
│   │   ├── createPropertyComponents/ # Property creation forms
│   │   ├── detailsComponents/    # Property detail views
│   │   ├── loginComponents/      # Login page components
│   │   ├── register/             # Registration components
│   │   └── utils/                # Reusable UI components
│   ├── lib/                      # Core libraries and utilities
│   │   ├── api/                  # API client and error handling
│   │   ├── auth/                 # Authentication utilities
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # TypeScript type definitions
│   │   ├── utils/                # Utility functions
│   │   ├── api.ts                # Main API functions
│   │   ├── propertyApi.ts        # Property API calls
│   │   ├── analyticsApi.ts       # Analytics API calls
│   │   ├── locationApi.ts        # Location API calls
│   │   ├── agentApi.ts           # Agent API calls
│   │   ├── auth.ts               # Auth API calls
│   │   ├── constants.ts          # Application constants
│   │   └── format.ts              # Formatting utilities
│   ├── hooks/                    # Page-level hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useDashboardProfile.ts # Dashboard profile hook
│   │   └── usePortfolio.ts       # Portfolio management hook
│   ├── config/                   # Configuration files
│   │   └── env.ts                # Environment configuration
│   ├── reactDevBits/             # Reusable UI components
│   │   ├── Globe/                # 3D globe component
│   │   ├── MagicBento/           # Bento grid component
│   │   ├── ShinyText/            # Animated text component
│   │   └── StaggeredMenu/         # Animated menu component
│   ├── GradientText/             # Gradient text components
│   ├── layout.tsx                # Root layout component
│   ├── providers.tsx             # Context providers
│   ├── theme.ts                  # MUI theme configuration
│   ├── globals.css               # Global styles
│   └── enums.ts                  # Application enums
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   ├── earth.geojson             # Globe data
│   └── ...
├── three-geojson/                # Three.js GeoJSON utilities (submodule)
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest test configuration
└── package.json                  # Dependencies and scripts
```

## Pages & Routes

### Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero section, features, and CTA |
| `/properties` | Property Search | Property listing with filters, map/globe view |
| `/details/[id]` | Property Details | Detailed property information page |
| `/login` | Login | User/agency login page |
| `/register` | Registration | User/agency registration with multi-step forms |
| `/verify` | Email Verification | Email confirmation page |

### Protected Routes (Require Authentication)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Investor Dashboard | Portfolio overview, analytics, property management |
| `/user` | User Profile | User profile and settings |
| `/user/changePassword` | Change Password | Password change form |
| `/user/logOut` | Logout | Logout confirmation and redirect |
| `/agency/changePassword` | Agency Change Password | Agency password change |
| `/agency/logOut` | Agency Logout | Agency logout |

### Route Groups

Next.js route groups `(pages)` allow logical organization without affecting URL structure.

## Key Features

### 1. Property Search & Discovery

- **Advanced Filtering**: Filter by price, location, property type, features, investment goals
- **Map View**: Interactive Leaflet map with property markers
- **Globe View**: 3D globe visualization using Three.js and globe.gl
- **Search**: Real-time search with debouncing
- **Sorting**: Sort by price, yield, score, date

### 2. Investor Dashboard

- **Portfolio Overview**: Summary of saved properties, inquiries, portfolio value
- **Analytics**: Yield graphs, volume graphs, top cities, top metrics
- **Property Management**: View saved properties, track inquiries
- **Agent Management**: View and manage assigned agents

### 3. Agency Dashboard

- **Property Listing Management**: Create, edit, delete property listings
- **Image Upload**: Multi-image upload with preview
- **Agent Management**: Assign agents to properties
- **Performance Metrics**: View property performance analytics

### 4. 3D Visualizations

- **Interactive Globe**: 3D rotating globe with property markers
- **Map Integration**: Seamless switching between map and globe views
- **Property Markers**: Visual indicators for property locations

### 5. Authentication & Authorization

- **JWT-based Auth**: Secure token-based authentication
- **Role-based Access**: Different views for investors vs agencies
- **Token Management**: Automatic token refresh, expiration handling
- **Protected Routes**: Route guards for authenticated pages

## Components

### Component Organization

Components are organized by feature/domain:

#### Home Components (`app/components/homeComponents/`)

- `heroSection.tsx`: Main hero section with CTA
- `navbar.tsx`: Navigation bar with responsive menu
- `choosePath.tsx`: Investor vs Agency selection
- `globalTrustGrid.tsx`: Trust indicators grid
- `whyChooseNomad.tsx`: Features section
- `investmentStats.tsx`: Statistics display

#### Property Dashboard Components (`app/components/propertyDashComponents/`)

- `properties.tsx`: Property listing grid
- `propertyCard.tsx`: Individual property card
- `filters.tsx`: Filter sidebar
- `MapGlobeSwitcher.tsx`: Toggle between map and globe
- `LeafletMap.tsx`: Leaflet map component
- `GlobeView.tsx`: 3D globe component
- `heroText.tsx`: Hero section text
- `heroBackground.tsx`: Animated background

#### Investor Dashboard Components (`app/components/investorsDashboardComponents/`)

- `TopMetrics.tsx`: Key metrics display
- `YieldGraph.tsx`: Yield trend chart
- `VolumeGraph.tsx`: Investment volume chart
- `topCities.tsx`: Top cities by investment
- `PropertyCard.tsx`: Property card for dashboard
- `ListingCard.tsx`: Listing card component
- `CreatePropertyForm.tsx`: Property creation form (for agencies)
- `EditPropertyForm.tsx`: Property editing form
- `AgentsManager.tsx`: Agent management interface

#### Utility Components (`app/components/utils/`)

- `input.tsx`: Text input component
- `select.tsx`: Select dropdown component
- `textarea.tsx`: Textarea component
- `button.tsx`: Button component
- `multiSelectDropdown.tsx`: Multi-select dropdown
- `TagSearchInput.tsx`: Tag-based search input
- `autocomplete.tsx`: Autocomplete input
- `dateInput.tsx`: Date picker component
- `checkboxGroup.tsx`: Checkbox group component
- `chipSelect.tsx`: Chip-based selection

### Reusable Components (`app/reactDevBits/`)

- `Globe/SpinningGlobe.tsx`: 3D spinning globe
- `MagicBento/MagicBento.tsx`: Bento grid layout
- `ShinyText/ShinyText.tsx`: Animated shiny text effect
- `StaggeredMenu/staggeredMenu.tsx`: Animated menu with stagger effect
- `AnimatedContent/AnimatedContent.tsx`: Content animation wrapper
- `FadeContent/FadeContent.tsx`: Fade animation wrapper
- `Glare/Glare.tsx`: Glare effect component

## State Management

### Authentication State

Managed via custom hooks:

- `useAuth`: Authentication state and methods
- `useDashboardProfile`: Dashboard user profile data
- Token storage: `localStorage` via `tokenStorage.ts`

### API State

- React Query or similar could be added for caching
- Currently uses direct API calls with loading states
- Custom hooks: `useLoadingState`, `useDebounce`

### Component State

- Local component state with `useState`
- Form state management
- Modal/drawer state management

## API Integration

### API Client (`app/lib/api/client.ts`)

Centralized Axios instance with:
- Base URL configuration
- Request interceptors (token injection)
- Response interceptors (error handling, token refresh)
- Error transformation

### API Modules

- `app/lib/api.ts`: Main API functions
- `app/lib/propertyApi.ts`: Property-related API calls
- `app/lib/analyticsApi.ts`: Analytics API calls
- `app/lib/locationApi.ts`: Location/geographic API calls
- `app/lib/agentApi.ts`: Agent API calls
- `app/lib/auth.ts`: Authentication API calls

### Error Handling (`app/lib/api/errors.ts`)

Standardized error handling:
- API error types
- Error message extraction
- User-friendly error messages
- Error logging

### Example API Call

```typescript
import { propertyApi } from '@/app/lib/propertyApi';

// Fetch properties with filters
const properties = await propertyApi.getAll({
  priceMin: 100000,
  priceMax: 500000,
  countryId: 1,
  propertyType: 'APARTMENT',
});
```

## Authentication

### Authentication Flow

1. **Login**: User submits credentials → receives access + refresh tokens
2. **Token Storage**: Tokens stored in `localStorage`
3. **API Requests**: Access token included in `Authorization` header
4. **Token Refresh**: Automatic refresh when access token expires
5. **Logout**: Tokens cleared from storage

### Authentication Hook (`useAuth`)

```typescript
const { user, isAuthenticated, login, logout, refreshToken } = useAuth();
```

### Token Management (`app/lib/auth/`)

- `tokenService.ts`: Token validation, expiration checks
- `tokenStorage.ts`: Token storage abstraction (localStorage)

### Protected Routes

Routes are protected via authentication checks in page components or middleware.

## Styling & Theming

### Material-UI Theme (`app/theme.ts`)

Custom MUI theme configuration:
- Color palette
- Typography (Montserrat font)
- Component overrides
- Breakpoints

### Styling Approaches

1. **Material-UI**: Primary styling system
2. **Emotion**: CSS-in-JS for dynamic styles
3. **Styled Components**: Component-level styling
4. **CSS Modules**: Scoped component styles
5. **Global CSS**: `globals.css` for global styles

### Responsive Design

- Mobile-first approach
- Breakpoints: xs, sm, md, lg, xl
- Responsive components (drawers, grids, etc.)

## 3D Visualizations

### Globe Visualization

Using `globe.gl` and Three.js:

- **Interactive Globe**: Rotatable, zoomable 3D globe
- **Property Markers**: Markers positioned by latitude/longitude
- **Animations**: Smooth transitions and rotations
- **Performance**: Optimized rendering for large datasets

### Map Visualization

Using Leaflet:

- **Interactive Map**: Standard map view with markers
- **Clustering**: Marker clustering for performance
- **Custom Markers**: Custom property markers
- **Popup Information**: Property details on marker click

### Switching Views

`MapGlobeSwitcher` component allows seamless switching between map and globe views.

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server (requires build) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run test` | Run Jest tests |

### Development Workflow

1. Start backend services (database-api, ai-api)
2. Configure `.env.local`
3. Run `npm run dev`
4. Open `http://localhost:3000`

### Code Quality

- **ESLint**: Code linting with Next.js and Prettier configs
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Husky**: Git hooks for pre-commit linting

### Hot Reload

Next.js provides fast refresh for instant updates during development.

## Testing

### Test Setup

- **Jest**: Test runner
- **React Testing Library**: Component testing
- **@testing-library/jest-dom**: DOM matchers

### Running Tests

```bash
npm test
```

### Test Structure

Tests are located alongside source files:
- `*.test.ts` / `*.test.tsx`: Unit and integration tests
- `__tests__/`: Test directories for complex modules

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '@/app/components/propertyDashComponents/propertyCard';

describe('PropertyCard', () => {
  it('renders property information', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Implemented Optimizations

1. **Image Optimization**: Next.js Image component for optimized images
2. **Code Splitting**: Automatic code splitting by Next.js
3. **Debouncing**: Search input debouncing (`useDebounce` hook)
4. **Lazy Loading**: Component lazy loading where appropriate
5. **Memoization**: React.memo for expensive components
6. **Error Boundaries**: Prevent full app crashes

### Performance Best Practices

- Use Next.js Image component for images
- Implement virtual scrolling for long lists
- Optimize 3D rendering (reduce polygon count, use LOD)
- Implement pagination for large datasets
- Use React Query for API caching (consider adding)

## Security

### Implemented Security Measures

1. **Input Sanitization**: `app/lib/utils/sanitize.ts`
2. **XSS Prevention**: React's built-in XSS protection
3. **Token Security**: Secure token storage and handling
4. **HTTPS**: Required in production
5. **CORS**: Handled by backend API

### Security Considerations

- **Token Storage**: Currently uses `localStorage` (consider httpOnly cookies)
- **CSRF Protection**: Consider adding CSRF tokens for state-changing operations
- **Content Security Policy**: Consider adding CSP headers
- **Input Validation**: Client-side validation (backend also validates)

### Recommended Security Enhancements

1. Move tokens to httpOnly cookies
2. Implement CSRF protection
3. Add Content Security Policy headers
4. Implement rate limiting on frontend (backend already has it)
5. Add security headers via Next.js headers API

## Deployment

### Production Build

1. **Install dependencies**:
   ```bash
   npm ci
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Start production server**:
   ```bash
   npm run start
   ```

### Environment Variables

Set production environment variables:
- `NEXT_PUBLIC_API_URL`: Production database API URL
- `NEXT_PUBLIC_AI_API_URL`: Production AI API URL

### Deployment Platforms

#### Vercel (Recommended)

1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

#### Other Platforms

- **Netlify**: Similar to Vercel
- **AWS Amplify**: AWS hosting
- **Docker**: Containerized deployment
- **Self-hosted**: Node.js server with PM2 or similar

### Docker Deployment (Example)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

## Troubleshooting

### Common Issues

#### API Connection Errors

```
Error: Network request failed
```

**Solution**:
- Verify backend APIs are running
- Check `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_AI_API_URL`
- Verify CORS configuration on backend
- Check network connectivity

#### Authentication Issues

```
Error: Unauthorized
```

**Solution**:
- Check token storage in localStorage
- Verify token hasn't expired
- Check token refresh logic
- Verify backend authentication endpoints

#### Build Errors

```
Error: Module not found
```

**Solution**:
- Run `npm install` to ensure dependencies are installed
- Check import paths (use `@/` alias)
- Verify TypeScript configuration
- Clear `.next` directory and rebuild

#### 3D Rendering Performance

**Solution**:
- Reduce number of markers on globe
- Implement marker clustering
- Use lower detail models
- Implement view frustum culling

### Debugging Tips

1. **Browser DevTools**: Use React DevTools and Network tab
2. **Next.js Debug Mode**: Set `NODE_OPTIONS='--inspect'` for debugging
3. **Console Logging**: Use `console.log` strategically (remove in production)
4. **Error Boundaries**: Check ErrorBoundary component logs

### Getting Help

- Check Next.js documentation: https://nextjs.org/docs
- Review Material-UI documentation: https://mui.com
- Check Three.js documentation: https://threejs.org/docs
- Review Leaflet documentation: https://leafletjs.com

## License

ISC (Private)

---

**Part of the NomadEstate Ecosystem**

- **Backend API**: [nomad-estate-database-api](../nomad-estate-database-api/README.md)
- **AI API**: [nomad-estate-ai-api](../nomad-estate-ai-api/README.md)
