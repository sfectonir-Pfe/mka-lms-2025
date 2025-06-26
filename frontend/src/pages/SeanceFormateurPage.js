// src/pages/SeanceFormateurPage.js
import React, { useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useTranslation } from 'react-i18next';

// ✅ Corriger les chemins ici
import AddSeanceFormateurView from "./users/views/AddSeanceFormateurView";
import SeanceFormateurList from "./users/views/SeanceFormateurList";
import AnimerSeanceView from "./users/views/AnimerSeanceView";

const SeanceFormateurPage = () => {
  const { t } = useTranslation();
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
          🎓 {t('seanceFormateur.title')}
        </Typography>

        {selectedSeance ? (
          <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button onClick={handleRetour} variant="outlined">
                ⬅️ {t('common.back')}
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
