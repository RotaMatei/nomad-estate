/**
 * Token storage utilities
 * SSR-safe wrapper around localStorage for token management
 */

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';
const USER_NAME_KEY = 'user';

/**
 * Check if code is running in browser (not SSR)
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get a value from localStorage (SSR-safe)
 */
function getItem(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Set a value in localStorage (SSR-safe)
 */
function setItem(key: string, value: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore errors (e.g., quota exceeded, private browsing)
  }
}

/**
 * Remove a value from localStorage (SSR-safe)
 */
function removeItem(key: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
}

export const tokenStorage = {
  /**
   * Get access token
   */
  getToken(): string | null {
    return getItem(TOKEN_KEY);
  },

  /**
   * Set access token
   */
  setToken(token: string): void {
    setItem(TOKEN_KEY, token);
  },

  /**
   * Remove access token
   */
  removeToken(): void {
    removeItem(TOKEN_KEY);
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Remove refresh token
   */
  removeRefreshToken(): void {
    removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Get user ID
   */
  getUserId(): string | null {
    return getItem(USER_ID_KEY);
  },

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    setItem(USER_ID_KEY, userId);
  },

  /**
   * Remove user ID
   */
  removeUserId(): void {
    removeItem(USER_ID_KEY);
  },

  /**
   * Get user display name
   */
  getUserName(): string | null {
    return getItem(USER_NAME_KEY);
  },

  /**
   * Set user display name
   */
  setUserName(name: string): void {
    setItem(USER_NAME_KEY, name);
  },

  /**
   * Remove user display name
   */
  removeUserName(): void {
    removeItem(USER_NAME_KEY);
  },

  /**
   * Clear all auth-related storage
   */
  clearAll(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUserId();
    this.removeUserName();
  },
};
