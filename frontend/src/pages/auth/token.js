// Lightweight JWT/token helpers used across the app

// Get token from localStorage (rememberMe) or sessionStorage (default)
export function getToken() {
    try {
      return (
        localStorage.getItem('authToken') ||
        sessionStorage.getItem('authToken') ||
        null
      );
    } catch {
      return null;
    }
  }
  
  // Base64url → JSON
  function base64UrlDecode(str) {
    try {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '==='.slice((base64.length + 3) % 4);
      const decoded =
        typeof window !== 'undefined' && window.atob
          ? window.atob(padded)
          : Buffer.from(padded, 'base64').toString('binary');
      // handle UTF-8
      const json = decodeURIComponent(
        decoded
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
  
  export function parseJwt(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return base64UrlDecode(parts[1]);
  }
  
  export function getPayload() {
    const token = getToken();
    return token ? parseJwt(token) : null;
  }
  
  export function getCurrentRole() {
    const payload = getPayload();
    // backend signs { sub, email, role }
    return payload?.role ?? null;
  }
  
  export function isAuthenticated() {
    const token = getToken();
    if (!token) return false;
    const payload = parseJwt(token);
    if (!payload?.exp) return true; // if no exp, treat as valid
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }
  
  export function setToken(token, remember = false) {
    try {
      if (remember) {
        localStorage.setItem('authToken', token);
        sessionStorage.removeItem('authToken');
      } else {
        sessionStorage.setItem('authToken', token);
        localStorage.removeItem('authToken');
      }
      window.dispatchEvent(new Event('userLogin'));
    } catch {
      // storage might be unavailable
    }
  }
  
  export function clearAuth() {
    try {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new Event('userLogout'));
    } catch {
      // noop
    }
  }
  