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
  const [refreshSeancesList, setRefreshSeancesList] = useState(null);

  const handleAnimer = (seance) => {
    setSelectedSeance(seance);
  };

  const handleRetour = () => {
    setSelectedSeance(null);
  };

  const handleSeanceCreated = (newSeance) => {
    console.log('New seance created:', newSeance);
    // Refresh the list
    if (refreshSeancesList) {
      refreshSeancesList();
    }
  };

  const handleRefreshCallback = (refreshFn) => {
    setRefreshSeancesList(() => refreshFn);
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
            <AddSeanceFormateurView onSeanceCreated={handleSeanceCreated} />
            <Box mt={4}>
              <SeanceFormateurList 
                onAnimer={handleAnimer} 
                onRefresh={handleRefreshCallback}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default SeanceFormateurPage;
