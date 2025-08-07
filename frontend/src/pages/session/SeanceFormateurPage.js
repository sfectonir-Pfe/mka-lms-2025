import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { useParams } from "react-router-dom";

import AddSeanceFormateurView from "../../features/views/session/AddSeanceFormateurView";
import SeanceFormateurList from "../../features/views/session/SeanceFormateurList";
import AnimerSeanceView from "../../features/views/session/AnimerSeanceView";

const SeanceFormateurPage = () => {
  const { t } = useTranslation();
  const [refreshSeancesList, setRefreshSeancesList] = useState(null);
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
          {t('seanceFormateur.manageSessionsOfSession2', { sessionId })}
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
