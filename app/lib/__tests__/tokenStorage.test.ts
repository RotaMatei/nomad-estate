import { tokenStorage } from '../auth/tokenStorage';

// Mock window object for SSR safety
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
});

describe('tokenStorage', () => {
  describe('getToken', () => {
    it('should return token from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('test-token');
      expect(tokenStorage.getToken()).toBe('test-token');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('should return null when token does not exist', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      expect(tokenStorage.getToken()).toBeNull();
    });
  });

  describe('setToken', () => {
    it('should set token in localStorage', () => {
      tokenStorage.setToken('new-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      tokenStorage.removeToken();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('clearAll', () => {
    it('should clear all auth-related storage', () => {
      tokenStorage.clearAll();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userId');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });
});
