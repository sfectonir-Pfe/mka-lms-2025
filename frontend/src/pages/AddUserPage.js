import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddUserPage = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [role, setRole] = useState('etudiant');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Mot de passe:', motDePasse);
    console.log('Rôle:', role);

    setEmail('');
    setMotDePasse('');
    setRole('etudiant');
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
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
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
            <option value="etudiant">Étudiant</option>
            <option value="formateur">Formateur</option>
            <option value="createur">Créateur de formation</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Ajouter l'utilisateur
        </button>
      </form>
    </div>
  );
};

export default AddUserPage;
