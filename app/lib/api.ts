import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.nomadestatehub.com',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        console.log('Refreshing Token...');
        const { data } = await axios.post(
          'https://api.nomadestatehub.com/refresh',
          {
            refreshToken: localStorage.getItem('refreshToken'),
          },
          { withCredentials: true },
        );
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        console.log(data.accessToken, data.refreshToken);
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
