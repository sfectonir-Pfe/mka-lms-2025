import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { showError } from "../utils/toastError";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";



function LoginPage({ setUser }) {
  const { t } = useTranslation(); // Initialiser la fonction de traduction
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Initialiser rememberMe à FALSE par défaut, pas à partir de localStorage
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [msgError, setMgsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Extraire l'email de l'URL si présent
    const emailFromUrl = params.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [location]);

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }



    setErrors(newErrors);
    return valid;
  };

  // Initialiser remember me à false par défaut
  React.useEffect(() => {
    setRememberMe(false);
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Envoyer rememberMe au backend
      console.log("=== LOGIN REQUEST ===");
      console.log("Email:", email);
      console.log("Remember Me checkbox is:", rememberMe ? "CHECKED" : "NOT CHECKED");

      const loginData = {
        email,
        password,
        rememberMe: rememberMe // Explicitement envoyer le booléen
      };

      console.log("Login request data:", loginData);
      const response = await axios.post("http://localhost:8000/auth/login", loginData);

      console.log("Login response:", response.data);

      // Extraire les données de la réponse
      const responseData = response.data.data || {};
      console.log("Extracted response data:", responseData);

      // Construire l'objet userData avec toutes les données nécessaires
      const userData = {
        id: responseData.id,
        email: email,
        role: responseData.role || "Etudiant",
        name: responseData.name || email.split('@')[0],
        profilePic: responseData.profilePic || null,
        token: responseData.access_token || `temp_token_${Date.now()}`,
        // Stocker explicitement si "Remember Me" était coché lors de la connexion
        rememberMe: rememberMe
      };

      console.log("Created userData object:", userData);

      setUser(userData);

      // Gérer "Remember Me" - Logique simplifiée
      if (rememberMe) {
        // Stocker dans localStorage pour une connexion persistante
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("✅ User stored in localStorage (persistent login)");
      } else {
        // Stocker dans sessionStorage pour une session temporaire
        sessionStorage.setItem("user", JSON.stringify(userData));
        console.log("✅ User stored in sessionStorage (session only)");
      }

      window.location.href = `/`;
    } catch (error) {
      console.error("Login error:", error);
      const message =
        "Login failed. Please check your credentials. " +
        (error.response?.data?.message || "");
      setMgsError(message);
      showError(message);
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
            alt="Sample"
          />
        </div>

        <div className="col-md-6">
          <form onSubmit={handleRequest}>
            {msgError && (
              <div className="alert alert-danger" role="alert">
                {msgError}
              </div>
            )}

            {/* Email input */}
            <div className="form-floating mb-4">
              <input
                type="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email address</label>
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Password input with toggle */}
            <div className="form-floating mb-4 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password && "is-invalid"}`}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 translate-middle-y me-3`}
                style={{ cursor: "pointer", fontSize: "1.2rem", zIndex: 10 }}
                onClick={() => setShowPassword((prev) => !prev)}
              ></i>
            </div>

            {/* Remember me checkbox */}
            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    console.log("Remember Me checkbox changed to:", isChecked ? "CHECKED" : "NOT CHECKED");
                    setRememberMe(isChecked);
                  }}
                />
                <label className="form-check-label" htmlFor="remember">
                  {t('common.rememberMe')}
                </label>
              </div>
              <a href="/forgot-password" className="text-decoration-none">{t('common.forgotPassword')}</a>
            </div>

            {/* Submit button */}
            <div className="text-center text-md-start mt-4 pt-2">
              <button
                type="submit"
                className="btn btn-primary px-5"
                disabled={!email || !password}
              >
                {t('common.login')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
