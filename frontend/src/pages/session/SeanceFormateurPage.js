import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useTranslation } from 'react-i18next';
import api from "../../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

import AddSeanceFormateurView from "../../features/views/session/AddSeanceFormateurView";
import SeanceFormateurList from "../../features/views/session/SeanceFormateurList";
import AnimerSeanceView from "../../features/views/session/AnimerSeanceView";

const SeanceFormateurPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [refreshSeancesList, setRefreshSeancesList] = useState(null);
  const { sessionId } = useParams();
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [seances, setSeances] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [loadingRating, setLoadingRating] = useState(true);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  const fetchSeances = async () => {
    try {
      const res = await api.get(`/seance-formateur/session/${sessionId}`);
      setSeances(res.data);
    } catch (err) {
      console.error('Error fetching seances:', err);
      alert(t('seances.loadError', 'Erreur lors du chargement des séances. Veuillez réessayer.'));
    }
  };

  const fetchSessionName = async () => {
    try {
      const res = await api.get(`/session2/${sessionId}`);
      setSessionName(res.data.name);
    } catch (err) {
      // handle error
    }
  };

  const fetchAverageRating = async () => {
    try {
      setLoadingRating(true);
      const res = await api.get(`/session2/session/${sessionId}/with-feedback`);
      const seancesWithFeedback = res.data;
      
      // Weighted average across all seances by their feedback counts
      const items = seancesWithFeedback.filter(
        (s) => s.averageFeedbackScore !== null && s.averageFeedbackScore !== undefined && Number.isFinite(s.averageFeedbackScore)
      );
      const totalResponses = items.reduce((acc, s) => acc + (s.feedbackCount || 0), 0);
      if (items.length > 0 && totalResponses > 0) {
        const weightedSum = items.reduce(
          (acc, s) => acc + s.averageFeedbackScore * (s.feedbackCount || 0),
          0
        );
        const avg = weightedSum / totalResponses;
        setAverageRating(avg.toFixed(1));
        setTotalFeedbacks(totalResponses);
      } else if (items.length > 0) {
        // fallback to simple mean if counts missing
        const sum = items.reduce((acc, s) => acc + s.averageFeedbackScore, 0);
        const avg = sum / items.length;
        setAverageRating(avg.toFixed(1));
        setTotalFeedbacks(items.length);
      } else {
        setAverageRating(null);
        setTotalFeedbacks(0);
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
    try {
      await api.delete(`/seance-formateur/${id}`);
      fetchSeances();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
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
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={2}>
          <Typography variant="h4" gutterBottom>
            {`🎓 ${sessionName} 🎓`}
          </Typography>
          
          <Button
            variant="contained"
            onClick={() => navigate('/sessions')}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #7b1fa2, #ab47bc)',
              boxShadow: '0 6px 18px rgba(123,31,162,0.25)',
              transition: 'transform 0.15s ease',
              '&:hover': { 
                transform: 'translateY(-1px)', 
                boxShadow: '0 10px 24px rgba(123,31,162,0.35)' 
              }
            }}
          >
            📋 {t('sessions.backToList')}
          </Button>
        </Box>
        
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
          
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
                {t('seances.averageRating')}
              </Typography>
              <Typography variant="h4" color="secondary" fontWeight="bold">
                {averageRating} / 5
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('seances.basedOnReviews', { count: totalFeedbacks })}
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
                {t('seances.noRating')}
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
