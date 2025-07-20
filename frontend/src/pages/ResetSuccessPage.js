import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <h2 className="text-success fw-bold mb-3">🎉 Mot de passe réinitialisé avec succès !</h2>
        <p className="text-muted">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Aller à la page de connexion
        </button>
      </div>
    </div>
  );
}
