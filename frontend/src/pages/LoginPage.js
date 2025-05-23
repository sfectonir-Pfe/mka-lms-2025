import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import axios from "axios";
import showErrorToast from "../utils/toastError";
import ReCAPTCHA from "react-google-recaptcha";

function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // ✅ New state
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [msgError, setMgsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
        captchaToken,
      });

      const userData = {
        id: response.data.id,
        email: email,
        role: response.data.role || "Etudiant",
        name: response.data.name || email.split('@')[0],
        profilePic: response.data.profilePic || null,
        token: response.data.access_token,
      };

      setUser(userData);

      // ✅ Store based on "Remember Me"
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("userEmail", email);
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("userEmail", email);
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

            {/* reCAPTCHA */}
            <div className="mb-3">
              <ReCAPTCHA
                sitekey="6LeSskYrAAAAABcPVjhFszILVMoofTTB8UhMS4S0"
                onChange={handleCaptchaChange}
              />
            </div>

            {/* Remember me checkbox */}
            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)} // ✅ toggle
                />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            {/* Submit button */}
            <div className="text-center text-md-start mt-4 pt-2">
              <button
                type="submit"
                className="btn btn-primary px-5"
                disabled={!email || !password || !captchaToken}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
