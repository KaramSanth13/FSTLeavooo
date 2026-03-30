import axios from 'axios';

const api = axios.create({
  // Hardcoded production URL for Vercel to override any misconfigured environment variables
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://fstleavooo-production.up.railway.app/api',
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
