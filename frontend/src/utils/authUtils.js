// Utilitaires d'authentification

/**
 * Fonction de déconnexion d'urgence qui peut être appelée depuis n'importe où
 * Cette fonction nettoie complètement l'état d'authentification
 */
export const emergencyLogout = () => {
  console.log("=== EMERGENCY LOGOUT INITIATED ===");
  
  try {
    // Sauvegarder les paramètres "Remember Me" si nécessaire
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("savedEmail");
    
    console.log("Saving Remember Me settings:", { rememberMe, savedEmail });
    
    // Nettoyer complètement les storages
    console.log("Clearing all storage data...");
    localStorage.clear();
    sessionStorage.clear();
    
    // Restaurer les paramètres "Remember Me" si nécessaire
    if (rememberMe && savedEmail) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("savedEmail", savedEmail);
      console.log("Restored Remember Me settings");
    }
    
    // Déclencher l'événement de déconnexion
    console.log("Dispatching logout event...");
    window.dispatchEvent(new CustomEvent('userLogout'));
    
    // Rediriger vers la page de connexion
    console.log("Redirecting to login page...");
    window.location.href = "/";
    
  } catch (error) {
    console.error("Error during emergency logout:", error);
    
    // En cas d'erreur, forcer un rechargement complet
    console.log("Forcing complete page reload as fallback...");
    window.location.reload();
  }
};

/**
 * Vérifie si l'utilisateur est connecté en examinant les storages
 */
export const isUserLoggedIn = () => {
  try {
    const userInLocalStorage = localStorage.getItem("user");
    const userInSessionStorage = sessionStorage.getItem("user");
    
    return !!(userInLocalStorage || userInSessionStorage);
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
};

/**
 * Récupère les données utilisateur depuis le storage
 */
export const getUserFromStorage = () => {
  try {
    // Vérifier d'abord dans localStorage
    let userStr = localStorage.getItem("user");
    
    // Si pas trouvé, vérifier dans sessionStorage
    if (!userStr) {
      userStr = sessionStorage.getItem("user");
    }
    
    if (!userStr) {
      return null;
    }
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error getting user from storage:", error);
    return null;
  }
};

/**
 * Nettoie les données utilisateur expirées ou corrompues
 */
export const cleanupUserData = () => {
  try {
    console.log("Cleaning up user data...");
    
    // Vérifier et nettoyer localStorage
    const localUser = localStorage.getItem("user");
    if (localUser) {
      try {
        JSON.parse(localUser);
      } catch (error) {
        console.log("Corrupted user data in localStorage, removing...");
        localStorage.removeItem("user");
      }
    }
    
    // Vérifier et nettoyer sessionStorage
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      try {
        JSON.parse(sessionUser);
      } catch (error) {
        console.log("Corrupted user data in sessionStorage, removing...");
        sessionStorage.removeItem("user");
      }
    }
    
    console.log("User data cleanup completed");
  } catch (error) {
    console.error("Error during user data cleanup:", error);
  }
};

/**
 * Fonction de déconnexion sécurisée avec gestion d'erreurs
 */
export const secureLogout = async (setUser = null, navigate = null) => {
  console.log("=== SECURE LOGOUT INITIATED ===");
  
  try {
    // Sauvegarder les paramètres "Remember Me"
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("savedEmail");
    
    // Nettoyer les données utilisateur
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    
    // Restaurer les paramètres "Remember Me" si nécessaire
    if (rememberMe && savedEmail) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("savedEmail", savedEmail);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("savedEmail");
    }
    
    // Déclencher l'événement de déconnexion
    window.dispatchEvent(new CustomEvent('userLogout'));
    
    // Mettre à jour l'état si la fonction setUser est fournie
    if (setUser) {
      setUser(null);
    }
    
    // Attendre un court délai pour s'assurer que l'état est mis à jour
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Naviguer si la fonction navigate est fournie
    if (navigate) {
      navigate("/", { replace: true });
    } else {
      // Sinon, rediriger directement
      window.location.href = "/";
    }
    
    console.log("=== SECURE LOGOUT COMPLETED ===");
    
  } catch (error) {
    console.error("Error during secure logout:", error);
    
    // En cas d'erreur, utiliser la déconnexion d'urgence
    emergencyLogout();
  }
};
