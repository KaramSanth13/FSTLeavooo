import axios from 'axios';

const api = axios.create({
  // HARDCODED FIX: This overrides EVERYTHING to ensure production works.
  baseURL: window.location.hostname.includes('localhost') 
    ? 'http://localhost:5000/api' 
    : 'https://fstleavooo-production.up.railway.app/api',
});

console.log('🚀 API IS CONNECTED TO:', api.defaults.baseURL);

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
