import { jwtDecode } from 'jwt-decode';
import { tokenStorage } from './tokenStorage';
import { apiConfig } from '@/app/config/env';
import axios from 'axios';

export interface TokenPayload {
  sub?: string;
  id?: string;
  agencyId?: string;
  userId?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Token service for JWT operations
 */
export class TokenService {
  /**
   * Decode JWT token
   */
  static decode(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('[TokenService] Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Get decoded token data from storage
   */
  static getTokenData(): TokenPayload | null {
    const token = tokenStorage.getToken();
    if (!token) return null;
    return this.decode(token);
  }

  /**
   * Check if token is expired
   */
  static isExpired(token: string): boolean {
    const decoded = this.decode(token);
    if (!decoded || !decoded.exp) return true;
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  }

  /**
   * Check if stored token is expired
   */
  static isStoredTokenExpired(): boolean {
    const token = tokenStorage.getToken();
    if (!token) return true;
    return this.isExpired(token);
  }

  /**
   * Get user/agency ID from token
   */
  static getLoggedInId(): string | null {
    const decoded = this.getTokenData();
    if (!decoded) return null;
    return (decoded.sub || decoded.id || decoded.agencyId || decoded.userId) as string | null;
  }

  /**
   * Get role from token
   */
  static getRole(): string | null {
    const decoded = this.getTokenData();
    if (!decoded) return null;
    return decoded.role as string | null;
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      console.warn('[TokenService] No refresh token available');
      return null;
    }

    try {
      // Refresh endpoint is at /api/refresh (controller is @Controller('') with @Post('refresh'))
      const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${apiConfig.baseURL}/refresh`,
        { refreshToken },
        { withCredentials: true },
      );

      tokenStorage.setToken(data.accessToken);
      tokenStorage.setRefreshToken(data.refreshToken);

      return data;
    } catch (error) {
      console.error('[TokenService] Token refresh failed:', error);
      // Clear tokens on refresh failure
      tokenStorage.clearAll();
      return null;
    }
  }

  /**
   * Validate token before API call
   */
  static async ensureValidToken(): Promise<boolean> {
    const token = tokenStorage.getToken();
    if (!token) return false;

    // Check if token is expired
    if (this.isExpired(token)) {
      // Try to refresh
      const refreshed = await this.refreshToken();
      return refreshed !== null;
    }

    return true;
  }
}
