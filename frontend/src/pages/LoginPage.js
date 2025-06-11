import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import showErrorToast from "../utils/toastError";

function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [msgError, setMsgError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

  const handleRequest = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const res = await axios.post("http://localhost:8000/auth/login", {
      email,
      password,
    });

    const user = res.data.data;

    // 🔒 Redirection vers Firebase SMS si besoin
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

    // ✅ Connexion normale
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role || "Etudiant",
      name: user.name || user.email.split("@")[0],
      profilePic: user.profilePic || null,
      token: user.access_token,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userEmail", user.email);

    window.location.href = `/`;
  } catch (error) {
    console.error("Login error:", error);

    const message =
      "Login failed. Please check your credentials. " +
      (error.response?.data?.message || "");

    setMsgError(message);
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

            {/* Password input */}
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

            {/* Options */}
            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            {/* Submit */}
            <div className="text-center text-md-start mt-4 pt-2">
              <button
                type="submit"
                className="btn btn-primary px-5"
                disabled={!email || !password}
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
