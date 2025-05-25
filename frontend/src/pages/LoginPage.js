import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import showErrorToast from "../utils/toastError";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { getRecaptchaSiteKey, validateRecaptchaToken, isRecaptchaConfigured } from "../config/recaptcha";

function LoginPage({ setUser }) {
  const { t } = useTranslation(); // Initialiser la fonction de traduction

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Initialiser rememberMe à FALSE par défaut, pas à partir de localStorage
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", captcha: "" });
  const [msgError, setMgsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isRecaptchaEnabled] = useState(isRecaptchaConfigured());

  // Fonction pour gérer le changement de reCAPTCHA
  const handleCaptchaChange = (value) => {
    console.log("reCAPTCHA token received:", value ? "Valid token" : "No token");
    setCaptchaToken(value);

    // Effacer l'erreur de captcha si un token est reçu
    if (value && errors.captcha) {
      setErrors(prev => ({ ...prev, captcha: "" }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "", captcha: "" };

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

    // Validation reCAPTCHA (seulement si activé)
    if (isRecaptchaEnabled) {
      const captchaValidation = validateRecaptchaToken(captchaToken);
      if (!captchaValidation.isValid) {
        newErrors.captcha = captchaValidation.error || "Please complete the reCAPTCHA";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  // Charger l'email sauvegardé au chargement de la page SEULEMENT si "Remember me" était activé lors de la dernière connexion
  React.useEffect(() => {
    console.log("LoginPage: Checking for saved login data...");

    // Vérifier si "Remember me" était activé lors de la dernière connexion
    const wasRememberMeEnabled = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("savedEmail");

    console.log("Was Remember Me enabled:", wasRememberMeEnabled);
    console.log("Saved email:", savedEmail);

    if (wasRememberMeEnabled && savedEmail) {
      console.log("Pre-filling email and checking Remember Me checkbox");
      setEmail(savedEmail);
      setRememberMe(true); // Cocher la case "Remember me" si elle était activée
    } else {
      console.log("No saved login data or Remember Me was disabled");
      setRememberMe(false); // S'assurer que la case n'est pas cochée
    }
  }, []); // Exécuter seulement au montage du composant

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
        rememberMe: rememberMe, // Explicitement envoyer le booléen
        captcha: captchaToken // Ajouter le token reCAPTCHA
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

      // Gérer "Remember Me" - LOGIQUE CORRIGÉE
      try {
        console.log("=== STORAGE LOGIC ===");
        console.log("Remember Me is:", rememberMe ? "CHECKED" : "NOT CHECKED");

        // TOUJOURS nettoyer d'abord toutes les données existantes pour éviter les conflits
        console.log("Cleaning existing storage data...");
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");

        // Si "Remember Me" est coché, l'utilisateur reste connecté même après avoir fermé le navigateur
        if (rememberMe) {
          console.log("Remember Me is CHECKED - storing data in localStorage");

          // Stocker les données utilisateur dans localStorage (persistant)
          localStorage.setItem("user", JSON.stringify(userData));

          // Sauvegarder l'état de "Remember Me" et l'email pour la prochaine connexion
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", email);

          console.log("✅ User data saved to localStorage (Remember Me enabled)");
        } else {
          console.log("Remember Me is NOT CHECKED - storing data in sessionStorage");

          // Si "Remember Me" n'est pas coché, l'utilisateur est déconnecté lorsqu'il ferme le navigateur
          // Stocker les données utilisateur dans sessionStorage (temporaire)
          sessionStorage.setItem("user", JSON.stringify(userData));

          // S'assurer que localStorage reste vide (déjà nettoyé ci-dessus)
          console.log("✅ User data saved to sessionStorage (Remember Me disabled)");
        }

        // Vérifier que les données ont été correctement stockées
        const storedInLocalStorage = localStorage.getItem("user");
        const storedInSessionStorage = sessionStorage.getItem("user");
        const rememberMeStored = localStorage.getItem("rememberMe");

        console.log("=== STORAGE VERIFICATION ===");
        console.log("Data in localStorage:", storedInLocalStorage ? "Present" : "None");
        console.log("Data in sessionStorage:", storedInSessionStorage ? "Present" : "None");
        console.log("RememberMe flag in localStorage:", rememberMeStored || "None");

        // Vérification de cohérence
        if (rememberMe && !storedInLocalStorage) {
          console.error("❌ ERROR: Remember Me was checked but data not in localStorage!");
        }
        if (!rememberMe && !storedInSessionStorage) {
          console.error("❌ ERROR: Remember Me was not checked but data not in sessionStorage!");
        }
        if (rememberMe && storedInSessionStorage) {
          console.error("❌ ERROR: Remember Me was checked but data is in sessionStorage!");
        }
        if (!rememberMe && storedInLocalStorage) {
          console.error("❌ ERROR: Remember Me was not checked but data is in localStorage!");
        }

      } catch (storageError) {
        console.error("Error storing user data:", storageError);
        // En cas d'erreur, essayer de stocker dans sessionStorage comme solution de secours
        try {
          sessionStorage.setItem("user", JSON.stringify(userData));
          console.log("Fallback: User data saved to sessionStorage");
        } catch (fallbackError) {
          console.error("Error in fallback storage:", fallbackError);
        }
      }

      window.location.href = `/`;
    } catch (error) {
      console.error("Login error:", error);
      const message =
        "Login failed. Please check your credentials. " +
        (error.response?.data?.message || "");
      setMgsError(message);
      showErrorToast(message);
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
            {/* reCAPTCHA */}
            {isRecaptchaEnabled && (
              <div className="mb-3">
                <ReCAPTCHA
                  sitekey="6LeSskYrAAAAABcPVjhFszILVMoofTTB8UhMS4S0"
                  onChange={handleCaptchaChange}
                  theme="light"
                  size="normal"
                />
                {errors.captcha && (
                  <div className="text-danger mt-1">
                    <small>{errors.captcha}</small>
                  </div>
                )}
              </div>
            )}
            {/* Submit button */}
            <div className="text-center text-md-start mt-4 pt-2">
              <button
                type="submit"
                className="btn btn-primary px-5"
                disabled={!email || !password || (isRecaptchaEnabled && !captchaToken)}
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

