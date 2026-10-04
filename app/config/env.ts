/**
 * Environment configuration
 * Validates and exports environment variables for the application
 */

// NEXT_PUBLIC_* values are inlined at build time only when read as literal `process.env.NAME`.
// A dynamic lookup (`process.env[key]`) is always undefined in the browser, which silently fell back to production.
export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.nomadestatehub.com',
  aiApiUrl: process.env.NEXT_PUBLIC_AI_API_URL || 'https://ai.nomadestatehub.com',
  /**
   * Which backend answers at `apiUrl`. `rust` (default) is the port in `nomad-estate-database-api/rust`, with joined
   * search, one-request property saves, password reset and Google sign-in. Set `nest` while `apiUrl` still points at
   * the Nest app.
   */
  apiFlavor: process.env.NEXT_PUBLIC_API_FLAVOR === 'nest' ? ('nest' as const) : ('rust' as const),
} as const;

// Helper to get API URL with /api prefix for database-api
function getApiUrlWithPrefix(): string {
  const url = env.apiUrl;
  // Ensure the URL ends with /api prefix
  if (url.endsWith('/api')) {
    return url;
  }
  // Remove trailing slash if present, then add /api
  return url.replace(/\/$/, '') + '/api';
}

export const apiConfig = {
  baseURL: getApiUrlWithPrefix(),
} as const;
