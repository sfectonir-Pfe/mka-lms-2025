import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import des icônes Bootstrap
import { Link } from "react-router-dom";
import axios from "axios";
import showErrorToast from "../utils/toastError";
import { useTranslation } from "react-i18next";
import SimpleLanguageSelector from "../components/SimpleLanguageSelector";
import ReCAPTCHA from "react-google-recaptcha";

function LoginPage({ setUser }) {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [msgError, setMgsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const recaptchaRef = useRef(null);

  // Vérifier si l'utilisateur a précédemment coché "Remember Me"
  React.useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("savedEmail");

    if (savedRememberMe && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleCaptchaChange = (value) => {
    // value sera null si le captcha expire
    setCaptchaVerified(!!value);
  };

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = t('auth.emailRequired', 'Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('auth.emailInvalid', 'Email is invalid');
      valid = false;
    }

    if (!password) {
      newErrors.password = t('auth.passwordRequired', 'Password is required');
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = t('auth.passwordMinLength', 'Password must be at least 6 characters');
      valid = false;
    }

    if (!captchaVerified) {
      setMgsError(t('auth.captchaRequired', 'Please verify that you are not a robot'));
      valid = false;
    } else {
      setMgsError("");
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRequest = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    // Connexion de l'utilisateur
    const response = await axios.post("http://localhost:8000/auth/login", {
      email,
      password,
    });

    console.log("Login response:", response.data);

    // Création d'un objet utilisateur simplifié
    const userData = {
      id: response.data.id,
      email: email,
      role: response.data.role || "Etudiant", // Utiliser l'une des valeurs de l'énumération Role
      name: response.data.name || email.split('@')[0],
      profilePic: response.data.profilePic || null, // Ajouter la photo de profil
      token: response.data.access_token
    };

    console.log("User data to store:", userData);

    // Stockage des données utilisateur
    setUser(userData);

    // Gestion de l'option "Remember Me"
    if (rememberMe) {
      // Si "Remember Me" est coché, stocker les données dans localStorage (persistant)
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userEmail", email);
      localStorage.setItem("rememberMe", "true");

      // Optionnel : stocker les identifiants de connexion de manière sécurisée
      // Note : ceci est une implémentation simplifiée, pour une application réelle,
      // utilisez une méthode plus sécurisée comme les cookies HttpOnly ou un token de rafraîchissement
      localStorage.setItem("savedEmail", email);
      // Ne jamais stocker le mot de passe en clair, même en développement
    } else {
      // Si "Remember Me" n'est pas coché, stocker les données dans sessionStorage (durée de la session)
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("userEmail", email);

      // Supprimer les données persistantes si elles existent
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("savedEmail");
    }

    // Naviguer vers la page d'accueil après la connexion
    window.location.href = `/`; // Redirection vers la page d'accueil
  } catch (error) {
    console.error("Login error:", error);
    const message =
      t('auth.loginError', 'Login failed. Please check your credentials.') +
      " " + (error.response?.data?.message || "");
    setMgsError(message);
    showErrorToast(message);
    setPassword("");
  }
};
  return (
    <div className="container-fluid p-3 my-5">
      {/* Sélecteur de langue */}
      <SimpleLanguageSelector />

      <div className="row align-items-center">
        <div className="col-md-6 mb-4">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample"
          />
        </div>

        <div className="col-md-6">
          <h2 className="text-center mb-4 fw-bold text-primary">{t('auth.loginTitle')}</h2>
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
              <label htmlFor="email">{t('common.email')}</label>
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Password input avec icône œil */}
            <div className="form-floating mb-4 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password && "is-invalid"}`}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">{t('common.password')}</label>
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}

              {/* Icône œil / œil barré */}
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute top-50 end-0 translate-middle-y me-3`}
                style={{ cursor: "pointer", fontSize: "1.2rem", zIndex: 10 }}
                onClick={() => setShowPassword((prev) => !prev)}
              ></i>
            </div>

            {/* Options supplémentaires */}
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
                  {t('common.rememberMe')}
                </label>
              </div>
              <Link to="/forgot-password">{t('common.forgotPassword')}</Link>
            </div>

            {/* reCAPTCHA */}
            <div className="mb-4 d-flex justify-content-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Clé de test de Google
                onChange={handleCaptchaChange}
                hl={i18n.language} // Langue du reCAPTCHA basée sur la langue actuelle
              />
            </div>

            {/* Submit button */}
            <div className="text-center text-md-start mt-4 pt-2">
              <button
                type="submit"
                className="btn btn-primary px-5"
                disabled={!email || !password || !captchaVerified}
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
