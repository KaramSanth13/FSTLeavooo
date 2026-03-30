import axios from 'axios';

const api = axios.create({
  // Point to the Railway production URL by default if no environment variable is provided
  baseURL: import.meta.env.VITE_API_URL || 'https://fstleavooo-production.up.railway.app/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
