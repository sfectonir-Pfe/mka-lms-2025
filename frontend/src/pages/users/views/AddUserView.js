import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUserView = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Etudiant");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage("");

  if (!validateEmail(email)) {
    setErrorMessage("Adresse email invalide.");
    return;
  }

  setLoading(true);
  try {
    // 1️⃣ Créer l'utilisateur
    await axios.post("http://localhost:8000/users", {
      email,
      phone,
      role,
    });

    // ✅ Just show message — no code sending here
    alert("✅ Utilisateur créé. Le mot de passe temporaire a été envoyé par email.");
    navigate("/users");
  } catch (error) {
  console.error(error);

  if (
    error.response &&
    error.response.status === 409 &&
    error.response.data.message.includes("Email invalide")
  ) {
    setErrorMessage("❌ L'adresse email semble invalide ou non délivrée.");
  } else if (
    error.response &&
    error.response.status === 409 &&
    error.response.data.message.includes("existe déjà")
  ) {
    setErrorMessage("⚠️ Cet utilisateur existe déjà.");
  } else {
    setErrorMessage("Erreur lors de la création de l'utilisateur.");
  }
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
          <label className="form-label">Téléphone :</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+216xxxxxxxx"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rôle :</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Etudiant">Étudiant</option>
            <option value="Formateur">Formateur</option>
            <option value="CreateurDeFormation">Créateur de formation</option>
            <option value="Etablissement">Responsable d'établissement</option>
            <option value="Admin">Admin</option>
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
          {loading ? "Création en cours..." : "Ajouter l'utilisateur"}
        </button>

        <button
          type="button"
          className="btn btn-danger w-100 mt-2"
          onClick={() => navigate(-1)}
        >
          Annuler
        </button>
      </form>
    </div>
  );
};

export default AddUserView;