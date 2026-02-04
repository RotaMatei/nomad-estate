import { TokenService, TokenPayload } from './auth/tokenService';
import { tokenStorage } from './auth/tokenStorage';

/**
 * @deprecated Use TokenService.decode() instead
 * Decode JWT token to extract user/agency information
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  return TokenService.decode(token);
}

/**
 * Get the logged-in user/agency ID from the token
 */
export function getLoggedInId(): string | null {
  return TokenService.getLoggedInId();
}

/**
 * Get full decoded token data
 */
export function getTokenData(): TokenPayload | null {
  return TokenService.getTokenData();
}

// Re-export for convenience
export { tokenStorage, TokenService };
export type { TokenPayload };
