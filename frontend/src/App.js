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
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";


function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auxUser = localStorage.getItem("user");
    if (auxUser) {
      try {
        const userData = JSON.parse(auxUser);
        console.log("User data from localStorage:", userData);

        // Ensure role is set correctly
        if (!userData.role || userData.role === "user") {
          userData.role = "Etudiant";
        }

        // Specifically for khalil, update role to Admin
        if (userData.email === "khalil@gmail.com" && userData.role !== "Admin") {
          userData.role = "Admin";
          console.log("Updated khalil's role to Admin in App.js");
          // Update localStorage with the corrected role
          localStorage.setItem("user", JSON.stringify(userData));
        }

        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const handleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`${mode === "light" ? "" : "text-white bg-dark position-fixed h-100 w-100"
        }`}

    > <ToastContainer />
      <div className="d-flex justify-content-end">
        <button className="btn btn-light d-flex align-items-center" onClick={handleMode}>
          {mode === "light" ? <FaRegMoon /> : <GoSun />}
        </button>
      </div>

      {loading ? (
        <div>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            {user ? (
              <Route path="/" element={<Main setUser={setUser} user={user} />}>
                <Route index element={<HomePage />} />
                {/* <Route path="/" element={<ProfilePage />} /> */}
                <Route path="users" element={<UsersPages />}>
                  <Route index element={<UserList />} />
                  <Route path="add" element={<AddUserView />} />
                </Route>

                {/* Programs / Modules / Courses */}
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
                {/* Student */}
                <Route path="student" element={<StudentLandingPage />} />
                <Route path="student/program/:programId" element={<StudentProgramPage />} />

                {/* Other */}
                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="/student/program/:programId" element={<StudentProgramPage />} />
                <Route path="/student" element={<StudentLandingPage />} />
                <Route path="/EditProfile/:id" element={<EditProfilePage />} />
                <Route path="/ProfilePage/:id" element={<ProfilePage />} />
                <Route path="/EditProfile" element={<EditProfilePage />} />
                <Route path="/ProfilePage" element={<ProfilePage />} />



              </Route>
            ) : (
              <Route path="/" element={<Auth />}>
                <Route index element={<LoginPage setUser={setUser} />} />
                <Route
                  path="/forgot-password/"
                  element={<ForgetPasswordPage />}
                />
                <Route path="ResetPasswordPage" element={<ResetPasswordPage />} />
                <Route path="/reset-success" element={<ResetSuccessPage />} />

                <Route path="/forgot-password/" element={<ForgetPasswordPage />} />
                <Route path="ResetPasswordPage" element={<ResetPasswordPage />} />
                <Route path="reset-success" element={<ResetSuccessPage />} />
              </Route>
            )}

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
