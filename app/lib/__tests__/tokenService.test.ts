import { TokenService } from '../auth/tokenService';
import { tokenStorage } from '../auth/tokenStorage';

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

// Mock tokenStorage
jest.mock('../auth/tokenStorage', () => ({
  tokenStorage: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setRefreshToken: jest.fn(),
    clearAll: jest.fn(),
  },
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}));

import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

describe('TokenService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('decode', () => {
    it('should decode valid token', () => {
      const mockPayload = { sub: 'user-123', exp: Math.floor(Date.now() / 1000) + 3600 };
      (jwtDecode as jest.Mock).mockReturnValue(mockPayload);

      const result = TokenService.decode('valid-token');
      expect(result).toEqual(mockPayload);
      expect(jwtDecode).toHaveBeenCalledWith('valid-token');
    });

    it('should return null for invalid token', () => {
      (jwtDecode as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = TokenService.decode('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('isExpired', () => {
    it('should return false for non-expired token', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      (jwtDecode as jest.Mock).mockReturnValue({ exp: futureExp });

      expect(TokenService.isExpired('token')).toBe(false);
    });

    it('should return true for expired token', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      (jwtDecode as jest.Mock).mockReturnValue({ exp: pastExp });

      expect(TokenService.isExpired('token')).toBe(true);
    });

    it('should return true for token without exp', () => {
      (jwtDecode as jest.Mock).mockReturnValue({});

      expect(TokenService.isExpired('token')).toBe(true);
    });
  });

  describe('getLoggedInId', () => {
    it('should extract ID from token', () => {
      (tokenStorage.getToken as jest.Mock).mockReturnValue('token');
      (jwtDecode as jest.Mock).mockReturnValue({ sub: 'user-123' });

      expect(TokenService.getLoggedInId()).toBe('user-123');
    });

    it('should return null when no token', () => {
      (tokenStorage.getToken as jest.Mock).mockReturnValue(null);

      expect(TokenService.getLoggedInId()).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      (tokenStorage.getRefreshToken as jest.Mock).mockReturnValue('refresh-token');
      (axios.post as jest.Mock).mockResolvedValue({
        data: { accessToken: 'new-access', refreshToken: 'new-refresh' },
      });

      const result = await TokenService.refreshToken();

      expect(result).toEqual({ accessToken: 'new-access', refreshToken: 'new-refresh' });
      expect(tokenStorage.setToken).toHaveBeenCalledWith('new-access');
      expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith('new-refresh');
    });

    it('should return null when refresh fails', async () => {
      (tokenStorage.getRefreshToken as jest.Mock).mockReturnValue('refresh-token');
      (axios.post as jest.Mock).mockRejectedValue(new Error('Refresh failed'));

      const result = await TokenService.refreshToken();

      expect(result).toBeNull();
      expect(tokenStorage.clearAll).toHaveBeenCalled();
    });
  });
});
