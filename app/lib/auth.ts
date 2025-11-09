/**
 * Decode JWT token to extract user/agency information
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Use atob for browser compatibility
    const decoded = JSON.parse(
      atob(parts[1])
    );
    return decoded;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Get the logged-in user/agency ID from the token
 */
export function getLoggedInId(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  // The ID could be in 'sub', 'id', 'agencyId', or 'userId' depending on how it's encoded
  return (decoded.sub || decoded.id || decoded.agencyId || decoded.userId) as string;
}

/**
 * Get full decoded token data
 */
export function getTokenData(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;

  return decodeToken(token);
}
