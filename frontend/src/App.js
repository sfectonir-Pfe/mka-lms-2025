import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './i18n';
import { useTranslation } from 'react-i18next';

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

// Auth / Main/chatbot containers
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
import AddQuizForm from "./pages/users/views/AddQuizForm";
import PlayQuizPage from "./pages/users/views/PlayQuizPage";

import BuildProgramView from "./pages/users/views/BuildProgramView";
import BuildProgramOverviewPage from "./pages/BuildProgramOverviewPage";
import ModuleList from './pages/users/views/ModuleList';
import EditProgramView from "./pages/users/views/EditProgramView";
import SessionPage from "./pages/SessionPage";
import EditQuizForm from "./pages/users/views/EditQuizForm";
import VerifyAccountPage from './pages/VerifyAccountPage';
import SeanceFormateurPage from "./pages/SeanceFormateurPage";
import AddSeanceFormateurView from "./pages/users/views/AddSeanceFormateurView";
import SeanceFormateurList from "./pages/users/views/SeanceFormateurList";
import AnimerSeanceView from "./pages/users/views/AnimerSeanceView";
import SessionDetail from "./pages/SessionDetail";


import JitsiRoom from './components/JitsiRoom';
import Chatbot from './components/Chatbot';
// import TestChatPage from "./pages/TestChatPage";
import WhiteboardPage from "./pages/WhiteboardPage";
import FeedbackListPage from "./pages/FeedbackListPage";

//Dashboards
import AdminDashboard from "./pages/users/views/AdminDashboard";
import EtablissementDashboard from "./pages/users/views/EtablissementDashboard";
import CreateurDashboard from "./pages/users/views/CreateurDashboard";
import FormateurDashboard from "./pages/users/views/FormateurDashboard";
import EtudiantDashboard from "./pages/users/views/EtudiantDashboard";












// UI
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);



  const loadUserFromStorage = () => {
    console.log("=== LOADING USER FROM STORAGE ===");

    // Logique simplifiée : vérifier localStorage puis sessionStorage
    let userStr = localStorage.getItem("user");
    let storageType = "localStorage";

    if (!userStr) {
      userStr = sessionStorage.getItem("user");
      storageType = "sessionStorage";
    }

    if (!userStr) {
      console.log("❌ No user found in storage");
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      console.log(`✅ User loaded from ${storageType}:`, user.email);

      // Vérifier si l'utilisateur a un rôle, sinon définir "Etudiant" par défaut
      if (!user.role || user.role === "user") {
        user.role = "Etudiant";
      }

      // Cas spécial pour l'utilisateur khalil
      if (user.email === "khalil@gmail.com" && user.role !== "Admin") {
        user.role = "Admin";
        // Mettre à jour les données utilisateur dans le storage approprié
        const updatedUserStr = JSON.stringify(user);
        if (storageType === "localStorage") {
          localStorage.setItem("user", updatedUserStr);
        } else {
          sessionStorage.setItem("user", updatedUserStr);
        }
      }

      return user;
    } catch (err) {
      console.error("❌ Error parsing stored user:", err);
      // En cas d'erreur, nettoyer les storages
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      return null;
    }
  };

  useEffect(() => {
    console.log("=== APP INITIALIZATION ===");

    // Charger l'utilisateur depuis le storage
    const userData = loadUserFromStorage();

    if (userData) {
      console.log("✅ User loaded from storage:", userData.email);
      setUser(userData);
    } else {
      console.log("❌ No user found in storage");
      setUser(null);
    }

    setLoading(false);
    console.log("=== APP INITIALIZATION COMPLETED ===");
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



  return (

    <div className={`${darkMode ? "text-white bg-dark position-fixed h-100 w-100" : ""}`}>
      <ToastContainer />
      <div className="d-flex justify-content-end">
        <button className="btn btn-light d-flex align-items-center" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <GoSun /> : <FaRegMoon />}
        </button>
      </div>
      {user && <Chatbot />}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Route de connexion toujours disponible */}
            <Route path="/login" element={<LoginPage setUser={setUser} />} />

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

                <Route path="/programs/overview" element={<BuildProgramOverviewPage />} />

                <Route path="/quizzes/create/:contenuId" element={<AddQuizForm />} />
                <Route path="/quizzes/play/:contenuId" element={<PlayQuizPage />} />

                <Route path="/programs/build/:programId" element={<BuildProgramView />} />
                <Route path="/programs/overview/:programId" element={<BuildProgramOverviewPage />} />
                <Route path="/modules" element={<ModuleList />} />
                <Route path="/programs/edit/:programId" element={<EditProgramView />} />
                <Route path="/sessions" element={<SessionPage />} />
                <Route path="/quizzes/edit/:contenuId" element={<EditQuizForm />} />
                <Route path="/formateur/seances" element={<SeanceFormateurPage />} />
                <Route path="/seances-formateur/add" element={<AddSeanceFormateurView />} />
                <Route path="/seances-formateur" element={<SeanceFormateurList />} />

                <Route path="/formateur/seances" element={<SeanceFormateurPage />} />
                <Route path="/sessions/:sessionId/seances" element={<SeanceFormateurPage />} />



                <Route path="/formateur/seance/:id" element={<AnimerSeanceView />} />

                <Route path="/jitsi" element={<JitsiRoom roomName="majd-room" />} />
                {/* <Route path="/test-chat" element={<TestChatPage />} /> */}
                <Route path="/whiteboard/:seanceId" element={<WhiteboardPage />} />

                {/* //dashboard */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/etablissement/dashboard" element={<EtablissementDashboard />} />
                <Route path="/createur/dashboard" element={<CreateurDashboard />} />
                <Route path="/formateur/dashboard" element={<FormateurDashboard />} />
                <Route path="/etudiant/dashboard" element={<EtudiantDashboard />} />











                {/* Student */}
                <Route path="student" element={<StudentLandingPage />} />
                <Route path="student/program/:programId" element={<StudentProgramPage />} />
                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="feedback-list" element={<FeedbackListPage />} />
                <Route path="/EditProfile/:id" element={<EditProfilePage />} />
                <Route path="/ProfilePage/:id" element={<ProfilePage />} />
              </Route>
            ) : (
              <Route path="/" element={<Auth />}>
                <Route index element={<LoginPage setUser={setUser} />} />
                <Route path="/forgot-password/" element={<ForgetPasswordPage />} />
                <Route path="ResetPasswordPage" element={<ResetPasswordPage />} />
                <Route path="/reset-success" element={<ResetSuccessPage />} />
                <Route path="/verify-sms" element={<VerifyAccountPage />} />



              </Route>
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )};

    </div>
  );
}

export default App;
