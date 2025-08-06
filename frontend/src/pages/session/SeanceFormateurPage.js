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
  const [sessionName, setSessionName] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [loadingRating, setLoadingRating] = useState(true);

  const fetchSeances = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/seance-formateur/session/${sessionId}`);
      setSeances(res.data);
    } catch (err) {
      console.error('Error fetching seances:', err);
      alert('Erreur lors du chargement des séances. Veuillez réessayer.');
    }
  };

  const fetchSessionName = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/session2/${sessionId}`);
      setSessionName(res.data.name);
    } catch (err) {
      // handle error
    }
  };

  const fetchAverageRating = async () => {
    try {
      setLoadingRating(true);
      const res = await axios.get(`http://localhost:8000/session2/session/${sessionId}/with-feedback`);
      const seancesWithFeedback = res.data;
      
      // Calculate overall average rating across all seances
      const allRatings = seancesWithFeedback
        .map(seance => seance.averageFeedbackScore)
        .filter(rating => rating !== null && rating !== undefined);
      
      if (allRatings.length > 0) {
        const sum = allRatings.reduce((a, b) => a + b, 0);
        const avg = sum / allRatings.length;
        setAverageRating(avg.toFixed(1));
      } else {
        setAverageRating(null);
      }
    } catch (err) {
      console.error('Error fetching average rating:', err);
      setAverageRating(null);
    } finally {
      setLoadingRating(false);
    }
  };

  useEffect(() => {
    fetchSeances();
    fetchSessionName();
    fetchAverageRating();
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
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
          <Typography variant="h4" gutterBottom>
            {`🎓 ${sessionName} 🎓`}
          </Typography>
          
          {averageRating !== null && (
            <Box 
              sx={{ 
                backgroundColor: '#f5f5f5', 
                borderRadius: 2, 
                p: 2, 
                mb: 2,
                minWidth: 200,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Note Moyenne Globale
              </Typography>
              <Typography variant="h4" color="secondary" fontWeight="bold">
                {averageRating} / 5
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Basée sur toutes les séances
              </Typography>
            </Box>
          )}
          
          {averageRating === null && !loadingRating && (
            <Box 
              sx={{ 
                backgroundColor: '#f5f5f5', 
                borderRadius: 2, 
                p: 2, 
                mb: 2,
                minWidth: 200,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Pas encore de notes
              </Typography>
            </Box>
          )}
        </Box>

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
