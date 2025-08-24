
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

 import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useTranslation } from 'react-i18next';
import toastErrorUtils from "../../utils/toastError";
import { toast } from "react-toastify"; 
import api from "../../api/axiosInstance";
import { 
  storeUser, 
  validateRememberMeData, 
  clearRememberMeData,
  isRememberMeActive 
} from "../../utils/authUtils";

const LoginPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/");
      return;
    }

    // Restaurer l'email depuis l'URL si présent
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }

    // Vérifier et restaurer les données "Remember me"
    if (validateRememberMeData()) {
      const rememberedEmail = localStorage.getItem("rememberedEmail");
      const rememberedPassword = localStorage.getItem("rememberedPassword");
      
      if (rememberedEmail && rememberedPassword) {
        setEmail(rememberedEmail);
        setPassword(rememberedPassword);
        setRememberMe(true);
        console.log("✅ Données Remember Me restaurées");
      }
    }

  }, [location, navigate]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setMsgError("");

    try {
      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
          rememberMe,
        },
        {
          withCredentials: true,
        }
      );

      const user = res?.data?.data;
      if (!user) throw new Error("Réponse inattendue du serveur");

      // Not verified → no token, go verify
      if (user.needsVerification) {
        toast.warning("Votre compte n'est pas encore vérifié. Choisissez votre méthode de vérification.");
        navigate("/verify-method", {
          state: {
            email: user.email,
            phone: user.phone || "",
          },
        });
        return;
      }

      // Save token + user
      const token = user.access_token;
      if (!token) throw new Error("Jeton manquant. Essayez avec un compte vérifié.");

      // Utiliser les utilitaires d'authentification pour stocker les données
      const currentUser = {
        id: user.id,
        email: user.email,
        role: user.role || "Etudiant",
        name: user.name || (user.email ? user.email.split("@")[0] : ""),
        profilePic: user.profilePic || null,
        token: token,
      };

      // Stocker l'utilisateur avec rememberMe
      storeUser(currentUser, rememberMe);

      // Stocker le token séparément
      if (rememberMe) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }

      // Gérer les données "Remember me"
      if (rememberMe) {
        localStorage.setItem("rememberMe", "1");
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
        console.log("✅ Données Remember Me sauvegardées");
      } else {
        // Nettoyer les données Remember Me si pas activé
        clearRememberMeData();
      }

      // (Legacy) keep old key if other pages use it
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("userEmail", user.email);

      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      const message =
        t("auth.loginFailed") + " " + (error?.response?.data?.message || error?.message || "");
      setMsgError(message);
      toastErrorUtils.showError(message);
      setPassword("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                  style={{ borderLeft: 'none' }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Se souvenir de moi
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
