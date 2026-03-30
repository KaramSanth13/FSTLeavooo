import axios from 'axios';

const api = axios.create({
  // Tries VITE_API_URL, then VITE_API_BASE_URL, then falls back to production railway URL
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://fstleavooo-production.up.railway.app/api',
});

console.log('📡 Leavooo API configured at:', api.defaults.baseURL);

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
