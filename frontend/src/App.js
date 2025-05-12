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
import { ToastContainer } from "react-toastify";
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
      className={`${
        mode === "light" ? "" : "text-white bg-dark position-fixed h-100 w-100"
      }`}
    >
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
