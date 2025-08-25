// src/api/axiosinstance.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE || 'http://localhost:8000';
console.log("API Base URL:", baseURL);
console.log("Environment variable:", process.env.REACT_APP_API_BASE);

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // only needed if using cookies
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log("Making request to:", config.baseURL + config.url);
  console.log("Request config:", config);
  
  let token = null;

  // Try the clean token key first
  token = localStorage.getItem("authToken");

  // Fallback to sessionStorage when rememberMe is not used
  if (!token) {
    try {
      token = sessionStorage.getItem("authToken");
    } catch (e) {
      console.warn("Unable to access sessionStorage 'authToken'");
    }
  }

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

  // Legacy fallback: some parts may still store currentUser
  if (!token) {
    const legacy = localStorage.getItem("currentUser");
    if (legacy) {
      try {
        token = JSON.parse(legacy)?.token;
      } catch (e) {
        console.warn("Invalid JSON in localStorage 'currentUser'");
      }
    }
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    console.error("Axios error:", error);
    console.error("Error config:", error.config);
    console.error("Error response:", error.response);
    const status = error?.response?.status;
    if (status === 401) {
      try {
        // Clear tokens and user state
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("authToken");

        // Notify app (if listeners exist)
        window.dispatchEvent(new Event("userLogout"));

        // Avoid redirect loop if already on login
        const isLoginRoute = window.location.pathname.startsWith("/login");
        if (!isLoginRoute) {
          const next = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.replace(`/login?next=${next}`);
        }
      } catch (_) {
        // no-op
      }
    }
    return Promise.reject(error);
  }
);

export default api;
