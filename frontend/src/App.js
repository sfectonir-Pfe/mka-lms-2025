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

// Program / Module / Course
import ProgramsPage from "./pages/ProgramsPage";
import AddProgramList from "./pages/users/views/AddProgramList";

import ModulePage from "./pages/ModulePage";
import AddModuleView from "./pages/users/views/AddModuleView";

import CoursesPage from "./pages/CoursesPage";
import ContenusPage from "./pages/ContenusPage";

import ConfigureSessionPage from "./pages/ConfigureSessionPage";




// Other
import AllPages from "./pages/AllPages";

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
      setUser(JSON.parse(auxUser));
    }
    setLoading(false);
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
        <div>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            {user ? (
              <Route path="/" element={<Main setUser={setUser} user={user} />}>
                <Route index element={<HomePage />} />

                <Route path="/EditProfilePage" element={<EditProfilePage />} />
                <Route path="/ProfilePage" element={<ProfilePage />} />
              
                {/* Users */}
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



                {/* Student */}
                <Route path="student" element={<StudentLandingPage />} />
                <Route path="student/program/:programId" element={<StudentProgramPage />} />

                {/* Other */}
                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="all" element={<AllPages />} />
              </Route>
            ) : (
              <Route path="/" element={<Auth />}>
                <Route index element={<LoginPage setUser={setUser} />} />

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
