/**
 * Environment configuration
 * Validates and exports environment variables for the application
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(
      `Missing required environment variable: ${key}. Check .env or .env.example.`,
    );
  }
  return value || defaultValue || '';
}

export const env = {
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'https://api.nomadestatehub.com'),
  aiApiUrl: getEnvVar('NEXT_PUBLIC_AI_API_URL', 'https://ai.nomadestatehub.com'),
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
