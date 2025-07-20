import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import toastErrorUtils from "../utils/toastError";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css"; // Import des icônes Bootstrap
import { toast } from "react-toastify"; 

const LoginPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msgError, setMsgError] = useState("");
  
const [rememberMe, setRememberMe] = useState(false);
// const [errors, setErrors] = useState({ email: "", password: "" });





  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [location]);

  // const validate = () => {
  //   let valid = true;
  //   const newErrors = { email: "", password: "" };

  //   if (!email) {
  //     newErrors.email = "Email is required";
  //     valid = false;
  //   } else if (!/\S+@\S+\.\S+/.test(email)) {
  //     newErrors.email = "Email is invalid";
  //     valid = false;
  //   }

  //   if (!password) {
  //     newErrors.password = "Password is required";
  //     valid = false;
  //   } else if (password.length < 6) {
  //     newErrors.password = "Password must be at least 6 characters";
  //     valid = false;
  //   }

  //   setErrors(newErrors);
  //   return valid;
  // };

  const handleRequest = async (e) => {
    e.preventDefault();
    setMsgError("");
  // if (!validate()) return;
    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      const user = res.data.data;

      if (user.needsVerification) {
        toast.warning("Votre compte n’est pas encore vérifié. Veuillez vérifier par SMS.");
        navigate("/verify-sms", {
          state: {
            email: user.email,
            phone: user.phone || "",
          },
        });
        return;
      }

      const userData = {
        id: user.id,
        email: user.email,
        role: user.role || "Etudiant",
        name: user.name || user.email.split("@")[0],
        profilePic: user.profilePic || null,
        token: user.access_token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userEmail", user.email);

      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      const message = t('auth.loginFailed') + " " + (error.response?.data?.message || "");
      setMsgError(message);
      toastErrorUtils.showError(message);

      setPassword("");
    }
  };

  return (
    <div className="container-fluid p-3 my-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Login Illustration"
          />

        </div>
        <div className="col-md-6">
          <form onSubmit={handleRequest}>
            <h2>{t('auth.login')}</h2>
            {msgError && <div className="alert alert-danger">{msgError}</div>}

            <div className="mb-3 position-relative">
  <label className="form-label">Adresse email</label>
  <div className="input-group">
    <span className="input-group-text">
      <i className="bi bi-envelope"></i>
    </span>
    <input
      type="email"
      className="form-control"
      placeholder="Entrez votre email"
      value={email}
      required
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>
</div>

<div className="mb-4 position-relative">
  <label className="form-label">Mot de passe</label>
  <div className="input-group">
    <span className="input-group-text">
      <i className="bi bi-lock"></i>
    </span>
    <input
      type="password"
      className="form-control"
      placeholder="Entrez votre mot de passe"
      value={password}
      required
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
</div>


            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="remember">
                  {t("common.rememberMe")}
                </label>
              </div>
              <a href="/forgot-password" className="text-decoration-none">
                {t("common.forgotPassword")}
              </a>
            </div>

            <div className="text-center text-md-start mt-4 pt-2">
              <button
                type="submit"
                className="btn btn-primary px-5"
                disabled={!email || !password}
              >
                {t("common.login")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
