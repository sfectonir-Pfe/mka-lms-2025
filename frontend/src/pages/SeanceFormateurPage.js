import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

import AddSeanceFormateurView from "./users/views/AddSeanceFormateurView";
import SeanceFormateurList from "./users/views/SeanceFormateurList";
import AnimerSeanceView from "./users/views/AnimerSeanceView";

const SeanceFormateurPage = () => {
  const { sessionId } = useParams();
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [seances, setSeances] = useState([]);

  const fetchSeances = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/seance-formateur/session/${sessionId}`);
      setSeances(res.data);
    } catch (err) {
      // handle error
    }
  };

  useEffect(() => {
    fetchSeances();
  }, [sessionId]);

  const handleAnimer = (seance) => setSelectedSeance(seance);
  const handleRetour = () => setSelectedSeance(null);

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression de cette séance ?")) {
      await axios.delete(`http://localhost:8000/seance-formateur/${id}`);
      fetchSeances();
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          🎓 Gérer mes Séances de la session {sessionId}
        </Typography>

        {selectedSeance ? (
          <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button onClick={handleRetour} variant="outlined">
                ⬅️ Retour
              </Button>
            </Box>
            <AnimerSeanceView seance={selectedSeance} />
          </>
        ) : (
          <>
            <AddSeanceFormateurView onSeanceCreated={fetchSeances} />

            <Box mt={4}>
              <SeanceFormateurList
                seances={seances}
                onAnimer={handleAnimer}
                onDelete={handleDelete}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default SeanceFormateurPage;
