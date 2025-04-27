import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>HomePage</h1>
      <button 
        className="btn btn-primary" 
        onClick={() => navigate('/add-user')}
      >
        Ajouter un utilisateur
      </button>
    </div>
  );
}
