import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msgError, setMsgError] = useState("");

  const showErrorToast = (message) => {
    toast.error(message, {
      duration: 5000,
      position: "top-center",
    });
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setMsgError("");

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
            src="/images/login-illustration.svg"
            alt="Login Illustration"
            className="img-fluid"
          />
        </div>
        <div className="col-md-6">
          <form onSubmit={handleRequest}>
            <h2>Connexion</h2>
            {msgError && <div className="alert alert-danger">{msgError}</div>}

            <div className="mb-3">
              <label className="form-label">Adresse email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
