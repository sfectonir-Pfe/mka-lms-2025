import React from "react";
import { useParams } from "react-router-dom";
import { WhiteboardRefactored as Whiteboard } from "../../features/views/session/whiteboard";

const WhiteboardPage = () => {
  const { seanceId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Validate seanceId
  const validSeanceId = seanceId && !isNaN(Number(seanceId)) ? Number(seanceId) : null;
  
  if (!validSeanceId) {
    return (
      <div style={{ padding: 16 }}>
        <h2>🖍️ Tableau blanc collaboratif</h2>
        <p style={{ color: 'red' }}>Erreur: ID de séance invalide</p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: 16 }}>
      <h2>🖍️ Tableau blanc collaboratif</h2>
      <Whiteboard seanceId={validSeanceId} userId={user?.id} />
    </div>
  );
};

export default WhiteboardPage;
