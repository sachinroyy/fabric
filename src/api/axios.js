import axios from "axios";

// Resolve API base URL with sensible dev/prod defaults
function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  // Prefer localhost during local development
  try {
    const host = window?.location?.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8000';
    }
  } catch {}

  // Fallback to production API
  return 'https://fabricadmin.onrender.com';
}

const API_URL = resolveApiBase();

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
