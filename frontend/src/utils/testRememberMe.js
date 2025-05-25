// Script de test pour vérifier le comportement "Remember Me"

/**
 * Test complet du comportement "Remember Me"
 */
export const testRememberMeBehavior = () => {
  console.log("🧪 === TESTING REMEMBER ME BEHAVIOR ===");
  
  // Nettoyer d'abord tout
  localStorage.clear();
  sessionStorage.clear();
  
  console.log("✅ Storage cleared");
  
  // Test 1: Connexion SANS Remember Me
  console.log("\n🧪 TEST 1: Login WITHOUT Remember Me");
  
  const userData1 = {
    id: 1,
    email: "test@example.com",
    role: "Etudiant",
    name: "Test User",
    token: "test_token_1",
    rememberMe: false
  };
  
  // Simuler la logique de LoginPage.js
  console.log("Simulating login without Remember Me...");
  
  // Nettoyer d'abord
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
  localStorage.removeItem("rememberMe");
  localStorage.removeItem("savedEmail");
  
  // Stocker dans sessionStorage (Remember Me = false)
  sessionStorage.setItem("user", JSON.stringify(userData1));
  
  console.log("✅ User stored in sessionStorage");
  console.log("localStorage user:", localStorage.getItem("user") || "None");
  console.log("sessionStorage user:", sessionStorage.getItem("user") ? "Present" : "None");
  console.log("rememberMe flag:", localStorage.getItem("rememberMe") || "None");
  
  // Test 2: Simuler le rechargement de la page (App.js loadUserFromStorage)
  console.log("\n🧪 TEST 2: Page reload simulation (Remember Me = false)");
  
  const rememberMeFlag = localStorage.getItem("rememberMe") === "true";
  console.log("Remember Me flag:", rememberMeFlag);
  
  let userStr = null;
  if (rememberMeFlag) {
    userStr = localStorage.getItem("user");
    console.log("Checking localStorage (Remember Me enabled):", userStr ? "Found" : "Not found");
  } else {
    userStr = sessionStorage.getItem("user");
    console.log("Checking sessionStorage (Remember Me disabled):", userStr ? "Found" : "Not found");
    
    // Nettoyer localStorage si Remember Me n'était pas activé
    const localUser = localStorage.getItem("user");
    if (localUser) {
      console.log("🧹 Cleaning localStorage because Remember Me was not enabled");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("savedEmail");
    }
  }
  
  if (userStr) {
    const user = JSON.parse(userStr);
    console.log("✅ User loaded:", user.email);
  } else {
    console.log("❌ No user found - should be logged out");
  }
  
  // Test 3: Connexion AVEC Remember Me
  console.log("\n🧪 TEST 3: Login WITH Remember Me");
  
  // Nettoyer d'abord
  localStorage.clear();
  sessionStorage.clear();
  
  const userData2 = {
    id: 1,
    email: "test@example.com",
    role: "Etudiant",
    name: "Test User",
    token: "test_token_2",
    rememberMe: true
  };
  
  console.log("Simulating login with Remember Me...");
  
  // Nettoyer d'abord
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
  localStorage.removeItem("rememberMe");
  localStorage.removeItem("savedEmail");
  
  // Stocker dans localStorage (Remember Me = true)
  localStorage.setItem("user", JSON.stringify(userData2));
  localStorage.setItem("rememberMe", "true");
  localStorage.setItem("savedEmail", userData2.email);
  
  console.log("✅ User stored in localStorage with Remember Me");
  console.log("localStorage user:", localStorage.getItem("user") ? "Present" : "None");
  console.log("sessionStorage user:", sessionStorage.getItem("user") || "None");
  console.log("rememberMe flag:", localStorage.getItem("rememberMe"));
  console.log("savedEmail:", localStorage.getItem("savedEmail"));
  
  // Test 4: Simuler le rechargement de la page (App.js loadUserFromStorage)
  console.log("\n🧪 TEST 4: Page reload simulation (Remember Me = true)");
  
  const rememberMeFlag2 = localStorage.getItem("rememberMe") === "true";
  console.log("Remember Me flag:", rememberMeFlag2);
  
  let userStr2 = null;
  if (rememberMeFlag2) {
    userStr2 = localStorage.getItem("user");
    console.log("Checking localStorage (Remember Me enabled):", userStr2 ? "Found" : "Not found");
  } else {
    userStr2 = sessionStorage.getItem("user");
    console.log("Checking sessionStorage (Remember Me disabled):", userStr2 ? "Found" : "Not found");
  }
  
  if (userStr2) {
    const user = JSON.parse(userStr2);
    console.log("✅ User loaded:", user.email);
  } else {
    console.log("❌ No user found - should be logged out");
  }
  
  // Test 5: Simuler la fermeture du navigateur (sessionStorage vidé)
  console.log("\n🧪 TEST 5: Browser close simulation (sessionStorage cleared)");
  
  // Vider sessionStorage (simule la fermeture du navigateur)
  sessionStorage.clear();
  
  console.log("sessionStorage cleared (browser closed)");
  console.log("localStorage user:", localStorage.getItem("user") ? "Present" : "None");
  console.log("sessionStorage user:", sessionStorage.getItem("user") || "None");
  console.log("rememberMe flag:", localStorage.getItem("rememberMe"));
  
  // Simuler le rechargement après fermeture du navigateur
  const rememberMeFlag3 = localStorage.getItem("rememberMe") === "true";
  console.log("Remember Me flag after browser restart:", rememberMeFlag3);
  
  let userStr3 = null;
  if (rememberMeFlag3) {
    userStr3 = localStorage.getItem("user");
    console.log("Checking localStorage (Remember Me enabled):", userStr3 ? "Found" : "Not found");
  } else {
    userStr3 = sessionStorage.getItem("user");
    console.log("Checking sessionStorage (Remember Me disabled):", userStr3 ? "Found" : "Not found");
  }
  
  if (userStr3) {
    const user = JSON.parse(userStr3);
    console.log("✅ User still logged in after browser restart:", user.email);
  } else {
    console.log("❌ User logged out after browser restart");
  }
  
  console.log("\n🧪 === TEST COMPLETED ===");
  
  // Nettoyer après les tests
  localStorage.clear();
  sessionStorage.clear();
  console.log("✅ Storage cleaned after tests");
};

// Exposer la fonction globalement pour les tests dans la console
if (typeof window !== 'undefined') {
  window.testRememberMe = testRememberMeBehavior;
}
