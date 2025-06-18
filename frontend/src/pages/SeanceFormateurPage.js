// src/pages/SeanceFormateurPage.js
import React, { useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";

// ✅ Corriger les chemins ici
import AddSeanceFormateurView from "./users/views/AddSeanceFormateurView";
import SeanceFormateurList from "./users/views/SeanceFormateurList";
import AnimerSeanceView from "./users/views/AnimerSeanceView";

const SeanceFormateurPage = () => {
  const [selectedSeance, setSelectedSeance] = useState(null);

  const handleAnimer = (seance) => {
    setSelectedSeance(seance);
  };

  const handleRetour = () => {
    setSelectedSeance(null);
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          🎓 Gérer mes Séances
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
            <AddSeanceFormateurView />
            <Box mt={4}>
              <SeanceFormateurList onAnimer={handleAnimer} />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default SeanceFormateurPage;
