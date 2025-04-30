import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUserView = () => {
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Etudiant");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await axios.post("http://localhost:8000/auth/register", {
        email,
        password,
        role,
      });
      navigate(-1)

    } catch (error) {
      console.log(error);
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
            onChange={(e) => setPassword(e.target.value)}
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
            <option value="Etudiant">Etudiant</option>
            <option value="Formateur">Formateur</option>
            <option value="CreateurDeFormation">Créateur de formation</option>
            <option value="Etablissement">
              Responsable  d'etablissement
            </option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onSubmit={handleSubmit}
        >
          Ajouter l'utilisateur
        </button>
      </form>
    </div>
  );
};

export default AddUserView;
