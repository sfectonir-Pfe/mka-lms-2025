import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetSuccessPage from "./pages/ResetSuccessPage";
import NotFound from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import FeedbackPage from "./pages/FeedbackPage";
import StudentLandingPage from "./pages/StudentLandingPage";
import StudentProgramPage from "./pages/StudentProgramPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";

// Auth / Main containers
import Auth from "./apps/Auth";
import Main from "./apps/Main";

// User-related pages
import UsersPages from "./pages/users/UsersPages";
import AddUserView from "./pages/users/views/AddUserView";
import UserList from "./pages/users/views/UserList";

// Program / Module / Course/ quiz / session
import ProgramsPage from "./pages/ProgramsPage";
import AddProgramList from "./pages/users/views/AddProgramList";
import ModulePage from "./pages/ModulePage";
import AddModuleView from "./pages/users/views/AddModuleView";
import CoursesPage from "./pages/CoursesPage";
import ContenusPage from "./pages/ContenusPage";
import ConfigureSessionPage from "./pages/ConfigureSessionPage";
import SessionsOverviewPage from "./pages/SessionsOverviewPage";
import AddQuizForm from "./pages/users/views/AddQuizForm";
import PlayQuizPage from "./pages/users/views/PlayQuizPage";

// UI
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debugStorageState } from "./utils/storageDebug";
import { testRememberMeBehavior } from "./utils/testRememberMe";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("light");
  const [loading, setLoading] = useState(true);

  // Fonction pour nettoyer les données incohérentes au démarrage
  const cleanupInconsistentData = () => {
    console.log("🧹 Checking for inconsistent data...");

    const rememberMeFlag = localStorage.getItem("rememberMe") === "true";
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");

    // Si Remember Me n'est pas activé mais qu'il y a des données dans localStorage
    if (!rememberMeFlag && localUser) {
      console.log("🧹 Cleaning localStorage because Remember Me is not enabled");
      localStorage.removeItem("user");
      localStorage.removeItem("savedEmail");
    }

    // Si Remember Me est activé mais qu'il y a des données dans sessionStorage
    if (rememberMeFlag && sessionUser) {
      console.log("🧹 Cleaning sessionStorage because Remember Me is enabled");
      sessionStorage.removeItem("user");
    }

    // Si les deux storages contiennent des données utilisateur
    if (localUser && sessionUser) {
      console.log("🧹 Both storages contain user data - cleaning sessionStorage");
      sessionStorage.removeItem("user");
    }
  };

  const loadUserFromStorage = () => {
    console.log("=== LOADING USER FROM STORAGE ===");

    // NOUVELLE LOGIQUE : Vérifier d'abord le flag "Remember Me"
    const rememberMeFlag = localStorage.getItem("rememberMe") === "true";
    console.log("Remember Me flag:", rememberMeFlag);

    let userStr = null;
    let storageType = null;

    if (rememberMeFlag) {
      // Si "Remember Me" était activé, chercher dans localStorage
      console.log("Remember Me was enabled - checking localStorage...");
      userStr = localStorage.getItem("user");
      storageType = "localStorage";

      if (userStr) {
        console.log("✅ User found in localStorage (Remember Me enabled)");
      } else {
        console.log("❌ Remember Me was enabled but no user data in localStorage");
        // Nettoyer les données incohérentes
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }
    } else {
      // Si "Remember Me" n'était PAS activé, chercher SEULEMENT dans sessionStorage
      console.log("Remember Me was NOT enabled - checking sessionStorage only...");
      userStr = sessionStorage.getItem("user");
      storageType = "sessionStorage";

      if (userStr) {
        console.log("✅ User found in sessionStorage (Remember Me disabled)");
      } else {
        console.log("❌ No user data in sessionStorage");
      }

      // IMPORTANT : Si Remember Me n'était pas activé, nettoyer localStorage
      const localUser = localStorage.getItem("user");
      if (localUser) {
        console.log("🧹 Cleaning localStorage because Remember Me was not enabled");
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }
    }

    // Si aucun utilisateur n'est trouvé, retourner null
    if (!userStr) {
      console.log("❌ No valid user found - user is not logged in");
      return null;
    }

    try {
      // Parser les données utilisateur
      const user = JSON.parse(userStr);
      console.log(`User data loaded from ${storageType}:`, user);

      // Vérifier si l'utilisateur a un rôle, sinon définir "Etudiant" par défaut
      if (!user.role || user.role === "user") {
        user.role = "Etudiant";
        console.log("Setting default role to Etudiant");
      }

      // Cas spécial pour l'utilisateur khalil
      if (user.email === "khalil@gmail.com" && user.role !== "Admin") {
        user.role = "Admin";
        console.log("Updated khalil's role to Admin");

        // Mettre à jour les données utilisateur dans le storage approprié
        const updatedUserStr = JSON.stringify(user);
        if (storageType === "localStorage") {
          localStorage.setItem("user", updatedUserStr);
        } else {
          sessionStorage.setItem("user", updatedUserStr);
        }
      }

      // Vérifier si l'utilisateur a un token (à implémenter plus tard avec JWT)
      if (!user.token) {
        console.log("User has no token, adding a temporary one");
        user.token = `temp_token_${Date.now()}`;
      }

      console.log("✅ User successfully loaded from storage");
      return user;
    } catch (err) {
      console.error("❌ Error parsing stored user:", err);

      // En cas d'erreur, nettoyer les storages
      console.log("Cleaning corrupted storage data...");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("savedEmail");

      return null;
    }
  };

  useEffect(() => {
    console.log("=== APP INITIALIZATION ===");
    console.log("Checking if user is logged in...");

    // Déboguer l'état du storage AVANT nettoyage
    console.log("Storage state BEFORE cleanup:");
    debugStorageState();

    // Nettoyer les données incohérentes
    cleanupInconsistentData();

    // Déboguer l'état du storage APRÈS nettoyage
    console.log("Storage state AFTER cleanup:");
    debugStorageState();

    // Utiliser la fonction loadUserFromStorage pour charger l'utilisateur
    const userData = loadUserFromStorage();

    if (userData) {
      console.log("✅ User loaded from storage:", userData.email);
      setUser(userData);
    } else {
      console.log("❌ No user found in storage");
      setUser(null); // Explicitement définir à null si aucun utilisateur
    }

    // Indiquer que le chargement est terminé
    setLoading(false);
    console.log("=== APP INITIALIZATION COMPLETED ===");

    // Exposer les fonctions de test globalement
    if (typeof window !== 'undefined') {
      window.testRememberMe = testRememberMeBehavior;
      window.debugStorage = debugStorageState;
    }
  }, []);

  // Écouter les événements de déconnexion
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log("Storage change detected:", e.key, e.newValue);

      // Si les données utilisateur ont été supprimées, mettre à jour l'état
      if (e.key === 'user' && !e.newValue) {
        console.log("User data removed from storage, logging out...");
        setUser(null);
      }
    };

    const handleUserLogout = () => {
      console.log("User logout event received");
      setUser(null);
    };

    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);

    // Écouter l'événement personnalisé de déconnexion
    window.addEventListener('userLogout', handleUserLogout);

    // Nettoyer les écouteurs d'événements
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, []);

  const handleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <div className={`${mode === "light" ? "" : "text-white bg-dark position-fixed h-100 w-100"}`}>
      <ToastContainer />
      <div className="d-flex justify-content-end">
        <button className="btn btn-light d-flex align-items-center" onClick={handleMode}>
          {mode === "light" ? <FaRegMoon /> : <GoSun />}
        </button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            {user ? (
              <Route path="/" element={<Main setUser={setUser} user={user} />}>
                <Route index element={<HomePage />} />
                <Route path="users" element={<UsersPages />}>
                  <Route index element={<UserList />} />
                  <Route path="add" element={<AddUserView />} />
                </Route>

                <Route path="programs" element={<ProgramsPage />} />
                <Route path="programs/add" element={<AddProgramList />} />
                <Route path="module" element={<ModulePage />} />
                <Route path="module/add" element={<AddModuleView />} />
                <Route path="courses/*" element={<CoursesPage />} />
                <Route path="contenus/*" element={<ContenusPage />} />
                <Route path="/sessions/*" element={<ConfigureSessionPage />} />
                <Route path="/sessions/overview" element={<SessionsOverviewPage />} />
                <Route path="/quizzes/create/:contenuId" element={<AddQuizForm />} />
                <Route path="/quizzes/play/:contenuId" element={<PlayQuizPage />} />
                <Route path="student" element={<StudentLandingPage />} />
                <Route path="student/program/:programId" element={<StudentProgramPage />} />
                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="/EditProfile/:id" element={<EditProfilePage />} />
                <Route path="/ProfilePage/:id" element={<ProfilePage />} />
              </Route>
            ) : (
              <Route path="/" element={<Auth />}>
                <Route index element={<LoginPage setUser={setUser} />} />
                <Route path="/forgot-password/" element={<ForgetPasswordPage />} />
                <Route path="ResetPasswordPage" element={<ResetPasswordPage />} />
                <Route path="/reset-success" element={<ResetSuccessPage />} />
              </Route>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
