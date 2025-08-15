// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // only needed if using cookies
});

api.interceptors.request.use((config) => {
  let token = null;

  // Try the clean token key first
  token = localStorage.getItem("authToken");

  // Fallback to old user.token
  if (!token) {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        token = JSON.parse(user)?.token;
      } catch (e) {
        console.warn("Invalid JSON in localStorage 'user'");
      }
    }
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
