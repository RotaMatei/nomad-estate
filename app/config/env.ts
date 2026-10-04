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
   * Which backend answers at `apiUrl`. `nest` (default) is the current production API; `rust` is the port in
   * `nomad-estate-database-api/rust`, which adds joined search and one-request property saves.
   */
  apiFlavor: process.env.NEXT_PUBLIC_API_FLAVOR === 'rust' ? ('rust' as const) : ('nest' as const),
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
