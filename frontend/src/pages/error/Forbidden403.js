// export default function Forbidden403() {
//     return (
//       <div style={{ padding: 32 }}>
//         <h1>403 - Accès refusé</h1>
//         <p>Vous n’avez pas les permissions nécessaires pour voir cette page.</p>
//       </div>
//     );
//   }
  
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Forbidden403() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 32, maxWidth: 720, margin: '40px auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: 8 }}>403 — Accès refusé</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Vous n’avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Button variant="contained" onClick={() => navigate(-1)}>Retour</Button>
        <Button variant="outlined" onClick={() => navigate('/')}>Accueil</Button>
      </div>
    </div>
  );
}
