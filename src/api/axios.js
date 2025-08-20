import axios from "axios";

  const API_URL = import.meta.env.VITE_API_URL || "https://fabricadmin.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,     // send/receive cookies
});

export default api;
