// Utilitaires de débogage pour le storage

/**
 * Affiche l'état complet du storage dans la console
 */
export const debugStorageState = () => {
  console.log("=== STORAGE DEBUG STATE ===");
  
  // localStorage
  console.log("📦 localStorage:");
  const localUser = localStorage.getItem("user");
  const localRememberMe = localStorage.getItem("rememberMe");
  const localSavedEmail = localStorage.getItem("savedEmail");
  
  console.log("  - user:", localUser ? "Present" : "None");
  console.log("  - rememberMe:", localRememberMe || "None");
  console.log("  - savedEmail:", localSavedEmail || "None");
  
  if (localUser) {
    try {
      const userData = JSON.parse(localUser);
      console.log("  - user data:", userData);
    } catch (error) {
      console.log("  - user data: CORRUPTED");
    }
  }
  
  // sessionStorage
  console.log("📦 sessionStorage:");
  const sessionUser = sessionStorage.getItem("user");
  console.log("  - user:", sessionUser ? "Present" : "None");
  
  if (sessionUser) {
    try {
      const userData = JSON.parse(sessionUser);
      console.log("  - user data:", userData);
    } catch (error) {
      console.log("  - user data: CORRUPTED");
    }
  }
  
  // Analyse de cohérence
  console.log("🔍 Coherence Analysis:");
  const hasLocalUser = !!localUser;
  const hasSessionUser = !!sessionUser;
  const rememberMeEnabled = localRememberMe === "true";
  
  if (hasLocalUser && hasSessionUser) {
    console.log("  ⚠️ WARNING: User data found in BOTH storages!");
  }
  
  if (hasLocalUser && !rememberMeEnabled) {
    console.log("  ⚠️ WARNING: User in localStorage but Remember Me is false!");
  }
  
  if (hasSessionUser && rememberMeEnabled) {
    console.log("  ⚠️ WARNING: User in sessionStorage but Remember Me is true!");
  }
  
  if (!hasLocalUser && !hasSessionUser) {
    console.log("  ✅ No user data found - user is not logged in");
  } else if (hasLocalUser && rememberMeEnabled) {
    console.log("  ✅ User in localStorage with Remember Me enabled - correct");
  } else if (hasSessionUser && !rememberMeEnabled) {
    console.log("  ✅ User in sessionStorage with Remember Me disabled - correct");
  }
  
  console.log("=== END STORAGE DEBUG ===");
};

/**
 * Nettoie complètement le storage
 */
export const clearAllStorage = () => {
  console.log("🧹 Clearing all storage data...");
  
  localStorage.removeItem("user");
  localStorage.removeItem("rememberMe");
  localStorage.removeItem("savedEmail");
  sessionStorage.removeItem("user");
  
  console.log("✅ All storage data cleared");
  debugStorageState();
};

/**
 * Simule une connexion avec Remember Me
 */
export const simulateLoginWithRememberMe = (email = "test@example.com") => {
  console.log("🔐 Simulating login with Remember Me...");
  
  const userData = {
    id: 1,
    email: email,
    role: "Etudiant",
    name: email.split('@')[0],
    token: `temp_token_${Date.now()}`,
    rememberMe: true
  };
  
  // Nettoyer d'abord
  clearAllStorage();
  
  // Stocker avec Remember Me
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("rememberMe", "true");
  localStorage.setItem("savedEmail", email);
  
  console.log("✅ Login with Remember Me simulated");
  debugStorageState();
};

/**
 * Simule une connexion sans Remember Me
 */
export const simulateLoginWithoutRememberMe = (email = "test@example.com") => {
  console.log("🔐 Simulating login without Remember Me...");
  
  const userData = {
    id: 1,
    email: email,
    role: "Etudiant",
    name: email.split('@')[0],
    token: `temp_token_${Date.now()}`,
    rememberMe: false
  };
  
  // Nettoyer d'abord
  clearAllStorage();
  
  // Stocker sans Remember Me
  sessionStorage.setItem("user", JSON.stringify(userData));
  
  console.log("✅ Login without Remember Me simulated");
  debugStorageState();
};

// Exposer les fonctions globalement pour le débogage dans la console
if (typeof window !== 'undefined') {
  window.debugStorage = debugStorageState;
  window.clearStorage = clearAllStorage;
  window.simulateLoginWithRememberMe = simulateLoginWithRememberMe;
  window.simulateLoginWithoutRememberMe = simulateLoginWithoutRememberMe;
}
