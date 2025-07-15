import React from "react";
import { useParams } from "react-router-dom";
import Whiteboard from "../components/Whiteboard";

const WhiteboardPage = () => {
  const { seanceId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div style={{ padding: 16 }}>
      <h2>🖍️ Tableau blanc collaboratif</h2>
      <Whiteboard seanceId={Number(seanceId)} userId={user?.id} />
    </div>
  );
};

export default WhiteboardPage;
