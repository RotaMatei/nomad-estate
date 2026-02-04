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
