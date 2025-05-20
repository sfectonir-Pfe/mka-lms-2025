import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUserView = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Etudiant");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Fonction pour valider la force du mot de passe
  const checkPasswordStrength = (password) => {
    let strength = "";
    const lengthCriteria = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score =
      (lengthCriteria ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasUpperCase ? 1 : 0) +
      (hasSpecialChar ? 1 : 0);

    if (score === 5) {
      strength = "Forte";
    } else if (score >= 3) {
      strength = "Moyenne";
    } else {
      strength = "Faible";
    }

    setPasswordStrength(strength);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation côté client
    if (!validateEmail(email)) {
      setErrorMessage("Adresse email invalide.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/auth/register", {
        email,
        password,
        role,
      });
      navigate("/users");
 // Revenir à la page précédente après succès
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Ajouter un utilisateur</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Email :</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mot de passe :</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordStrength(e.target.value); // Vérification à chaque modification
            }}
            required
          />
          {password && (
            <div className="mt-2">
              <small>
                <strong>Force du mot de passe : </strong>
                <span
                  className={`badge ${passwordStrength === "Forte"
                    ? "bg-success"
                    : passwordStrength === "Moyenne"
                      ? "bg-warning"
                      : "bg-danger"
                    }`}
                >
                  {passwordStrength || "Évaluation en cours..."}
                </span>
              </small>
            </div>
          )}


          {/* Message pour aider à créer un mot de passe fort */}
          {password && passwordStrength !== "Forte" && (
            <div className="mt-2">
              <small className="text-muted">
                <strong>Comment créer un mot de passe fort :</strong><br />
                - Minimum 8 caractères<br />
                - Inclure au moins un chiffre<br />
                - Utiliser des lettres majuscules et minuscules<br />
                - Ajouter des caractères spéciaux comme @, #, $, %, etc.
              </small>
            </div>
          )}

        </div>

        <div className="mb-3">
          <label className="form-label">Rôle :</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Etudiant">Etudiant</option>
            <option value="Formateur">Formateur</option>
            <option value="CreateurDeFormation">Créateur de formation</option>
            <option value="Etablissement">Responsable d'établissement</option>
          </select>
        </div>

        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Création en cours...
            </>
          ) : (
            "Ajouter l'utilisateur"
          )}
        </button>

        <button
          type="button"
          className="btn btn-danger w-100 mt-2" // Bouton Annuler en rouge
          onClick={() => navigate(-1)}
        >
          Annuler
        </button>
      </form>
    </div>
  );
};

export default AddUserView;
