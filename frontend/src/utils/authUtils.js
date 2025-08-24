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
    // Clear user data
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // Clear tokens
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    
    // Clear email and remember me
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    
    console.log('🧹 All authentication data cleared');
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
  if (user?.email) {
    return user.email;
  }
  
  // Fallback: check both storages for userEmail
  const persistentEmail = localStorage.getItem('userEmail');
  if (persistentEmail) {
    return persistentEmail;
  }
  
  const sessionEmail = sessionStorage.getItem('userEmail');
  if (sessionEmail) {
    return sessionEmail;
  }
  
  return '';
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
  try {
    // Check localStorage first (persistent login)
    const persistentToken = localStorage.getItem('authToken');
    if (persistentToken) {
      return persistentToken;
    }

    // Check sessionStorage (session login)
    const sessionToken = sessionStorage.getItem('authToken');
    if (sessionToken) {
      return sessionToken;
    }

    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const isRememberMeActive = () => {
  return localStorage.getItem('rememberMe') === '1';
};

export const clearRememberMeData = () => {
  console.log('🧹 Nettoyage des données Remember Me...');
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('rememberedEmail');
  localStorage.removeItem('rememberedPassword');
  console.log('✅ Remember me data cleared');
};

export const validateRememberMeData = () => {
  const rememberMe = localStorage.getItem('rememberMe');
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  const rememberedPassword = localStorage.getItem('rememberedPassword');
  
  console.log('🔍 Validation Remember Me:', {
    rememberMe,
    rememberedEmail: rememberedEmail ? 'Présent' : 'Manquant',
    rememberedPassword: rememberedPassword ? 'Présent' : 'Manquant'
  });
  
  // Vérifier si Remember Me est activé et si toutes les données sont présentes
  if (rememberMe === '1' && rememberedEmail && rememberedPassword) {
    console.log('✅ Remember Me valide');
    return true;
  }
  
  // Si Remember Me est activé mais qu'il manque des données, nettoyer
  if (rememberMe === '1' && (!rememberedEmail || !rememberedPassword)) {
    console.warn('⚠️ Remember me data incomplete, clearing...');
    clearRememberMeData();
    return false;
  }
  
  console.log('ℹ️ Remember Me non activé ou données manquantes');
  return false;
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
