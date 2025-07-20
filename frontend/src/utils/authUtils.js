// Authentication Utilities
// Provides helper functions for authentication and user management

export const getStoredUser = () => {
  try {
    // Check localStorage first (persistent login)
    const persistentUser = localStorage.getItem('user');
    if (persistentUser) {
      return JSON.parse(persistentUser);
    }

    // Check sessionStorage (session login)
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      return JSON.parse(sessionUser);
    }

    return null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

export const storeUser = (userData, rememberMe = false) => {
  try {
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('👤 User stored in localStorage (persistent)');
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
      console.log('👤 User stored in sessionStorage (session only)');
    }
    return userData;
  } catch (error) {
    console.error('Error storing user:', error);
    return null;
  }
};

export const clearStoredUser = () => {
  try {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Error clearing stored user:', error);
    return false;
  }
};

export const isUserLoggedIn = () => {
  const user = getStoredUser();
  return user !== null && user.id;
};

export const getUserRole = () => {
  const user = getStoredUser();
  return user?.role || 'Etudiant';
};

export const getUserEmail = () => {
  const user = getStoredUser();
  return user?.email || '';
};

export const getUserName = () => {
  const user = getStoredUser();
  return user?.name || '';
};

export const isAdmin = () => {
  const role = getUserRole();
  return role === 'Admin' || role === 'admin';
};

export const isTeacher = () => {
  const role = getUserRole();
  return role === 'Enseignant' || role === 'teacher';
};

export const isStudent = () => {
  const role = getUserRole();
  return role === 'Etudiant' || role === 'student';
};

export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

export const getAuthToken = () => {
  const user = getStoredUser();
  return user?.token || null;
};

export const isTokenValid = () => {
  const token = getAuthToken();
  if (!token) return false;

  // Basic token validation (you can enhance this)
  try {
    // If token is JWT, you could decode and check expiration
    // For now, just check if it exists and is not empty
    return token.length > 0;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};



export const secureLogout = async (setUser, navigate) => {
  console.log('🚪 Performing secure logout...');

  try {
    const axios = (await import('axios')).default;

    // Call backend logout API
    try {
      const response = await axios.post('http://localhost:8000/auth/logout', {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Backend logout successful:', response.data);
    } catch (apiError) {
      console.warn('⚠️ Backend logout failed, continuing with local logout:', apiError.message);
    }

    // Clear local storage
    const success = clearStoredUser();

    if (success) {
      console.log('✅ Local storage cleared');

      // Update user state if setUser function is provided
      if (setUser) {
        setUser(null);
      }

      // Dispatch custom logout event
      window.dispatchEvent(new CustomEvent('userLogout'));

      // Navigate to home if navigate function is provided
      if (navigate) {
        navigate('/');
      }

      console.log('✅ Secure logout completed');
      return true;
    } else {
      console.error('❌ Secure logout failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error during secure logout:', error);

    // Fallback: clear storage anyway
    const success = clearStoredUser();
    if (setUser) setUser(null);
    if (navigate) navigate('/');

    return success;
  }
};

const authUtils = {
  getStoredUser,
  storeUser,
  clearStoredUser,
  isUserLoggedIn,
  getUserRole,
  getUserEmail,
  getUserName,
  isAdmin,
  isTeacher,
  isStudent,
  hasRole,
  getAuthToken,
  isTokenValid,
  secureLogout
};

export default authUtils;
