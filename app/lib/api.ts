import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'https://api.nomadestatehub.com',
  withCredentials: true,
});

// Attach Authorization header automatically if a token exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      (config.headers as unknown as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
          'https://api.nomadestatehub.com/refresh',
          {
            refreshToken,
          },
          { withCredentials: true },
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        const cfg = (error.config || {}) as InternalAxiosRequestConfig;
        if (cfg.headers) {
          (cfg.headers as unknown as Record<string, string>)['Authorization'] = `Bearer ${data.accessToken}`;
        }
        return axios.request(cfg);
      } catch (refreshError: unknown) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
