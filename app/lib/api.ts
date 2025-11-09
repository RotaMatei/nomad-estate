import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.nomadestatehub.com',
  withCredentials: true,
});

// Attach Authorization header automatically if a token exists
api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        const { data } = await axios.post(
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
        error.config.headers = error.config.headers || {};
        error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return axios.request(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
