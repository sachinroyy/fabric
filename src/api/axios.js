import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://fabricadmin.onrender.com" || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,     // send/receive cookies
});

// Attach Bearer token from localStorage if available (works alongside cookies)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
