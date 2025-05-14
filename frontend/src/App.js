import { useEffect, useState } from "react";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import Main from "./apps/Main";
import Auth from "./apps/Auth";
import HomePage from "./pages/HomePage";
import Spinner from "react-bootstrap/Spinner";
import AddUserView from "./pages/users/views/AddUserView";
import UsersPages from "./pages/users/UsersPages";
import UserList from "./pages/users/views/UserList";
import ProgramsPage from "./pages/ProgramsPage";
import ModulePage from "./pages/ModulePage";
import { ToastContainer } from "react-toastify";
import AddModulePage from "./pages/AddModulePage";
import CoursesPage from "./pages/CoursesPage";
import AddProgramList from "./pages/users/views/AddProgramList";
import AllPages from "./pages/AllPages";
import FeedbackPage from "./pages/FeedbackPage";
import StudentProgramPage from "./pages/StudentProgramPage";
import "react-toastify/dist/ReactToastify.css";
import StudentLandingPage from "./pages/StudentLandingPage";

import ResetSuccessPage from "./pages/ResetSuccessPage";





import EditProfilePage from "./pages/EditProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var auxUser = localStorage.getItem("user");
    if (auxUser) {
      setUser(JSON.parse(auxUser));
      setLoading(false);
    }
    setLoading(false);
  }, []);
  const handelMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };
  return (
    <div
      className={`${mode === "light" ? "" : "text-white bg-dark position-fixed h-100 w-100"
        }`}
        
    > <ToastContainer /> 
      <ToastContainer />
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-light d-flex align-items-center"
          onClick={handelMode}
        >
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
                <Route path="/" element={<ProfilePage />} />
                <Route path="users" element={<UsersPages />}>
                  <Route index element={<UserList />} />
                  <Route path="add" element={<AddUserView />} />
                </Route>

                <Route path="module" element={<ModulePage />} />
                <Route path="module/add" element={<AddModulePage />} />
                <Route path="module/cours/:id" element={<CoursesPage />} />

                <Route path="module/program/:programId" element={<ModulePage />} />
                <Route path="module/add/:programId" element={<AddModulePage />} />
                <Route path="programs/:programId/modules" element={<ModulePage />} />
                <Route path="all" element={<AllPages />} />
                <Route path="programs/:programId/modules" element={<ModulePage />} />
                <Route path="module/cours/:id" element={<CoursesPage />} />

                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="programs" element={<ProgramsPage />} />
                <Route path="programs/add" element={<AddProgramList />} />
                <Route path="module/add/:programId" element={<AddModulePage />} />
                <Route path="/student/program/:programId" element={<StudentProgramPage />} />
                <Route path="/student" element={<StudentLandingPage />} />
                <Route path="ProfilePage" element={<ProfilePage />} />
                <Route path="EditProfilePage" element={<EditProfilePage />} />
               
                
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
