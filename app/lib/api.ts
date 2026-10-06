import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { apiConfig } from '../config/env';
import { tokenStorage } from './auth/tokenStorage';
import { TokenService } from './auth/tokenService';
import { UnauthorizedError, handleApiError, logError } from './api/errors';

const api = axios.create({
  baseURL: apiConfig.baseURL,
  withCredentials: true,
});

// Request interceptor: attach token and log requests in dev
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = tokenStorage.getToken();
      if (token && config.headers) {
        // Check if token is expired before attaching
        if (!TokenService.isExpired(token)) {
          (config.headers as unknown as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        } else {
          // Token expired, try to refresh
          TokenService.refreshToken().then((refreshed) => {
            if (refreshed && config.headers) {
              (config.headers as unknown as Record<string, string>)['Authorization'] = `Bearer ${refreshed.accessToken}`;
            }
          });
        }
      }

      // Log requests in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
      }
    } catch {
      // Ignore token retrieval errors
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: handle token refresh, error standardization, and logging
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    // A request dropped because a newer one replaced it (typing in a search box, changing a filter) is not a failure
    if (axios.isCancel(error)) return Promise.reject(error);

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized with token refresh
    if (error.response?.status === 401) {
      const refreshToken = tokenStorage.getRefreshToken();
      
      // If there is no refresh token, clear storage and reject with standardized error
      if (!refreshToken) {
        tokenStorage.clearAll();
        const apiError = new UnauthorizedError('Session expired. Please log in again.', error.response?.data);
        logError(apiError, 'API Interceptor');
        return Promise.reject(apiError);
      }

      // Attempt to refresh the token using TokenService
      const refreshed = await TokenService.refreshToken();
      
      if (refreshed) {
        // Retry the original request with new token
        const cfg = (error.config || {}) as InternalAxiosRequestConfig;
        if (cfg.headers) {
          (cfg.headers as unknown as Record<string, string>)['Authorization'] = `Bearer ${refreshed.accessToken}`;
        }
        return axios.request(cfg);
      } else {
        // Refresh failed - clear tokens and reject
        tokenStorage.clearAll();
        const apiError = new UnauthorizedError('Token refresh failed. Please log in again.', error.response?.data);
        logError(apiError, 'API Interceptor');
        return Promise.reject(apiError);
      }
    }

    // For all other errors, convert to standardized ApiError
    const apiError = handleApiError(error);
    logError(apiError, 'API Interceptor');
    return Promise.reject(apiError);
  },
);

export default api;
