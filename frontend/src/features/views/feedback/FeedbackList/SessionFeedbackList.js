import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Card,
  CardHeader,
  CardContent,
  Grid,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { DataGrid } from '@mui/x-data-grid';
import { Feedback as FeedbackIcon } from "@mui/icons-material";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";

const SessionFeedbackList = () => {
  const { sessionId } = useParams();
  const { t } = useTranslation('sessions');
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedStudentFeedbacks, setSelectedStudentFeedbacks] = useState([]);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const reloadFeedbacks = React.useCallback(() => {
    if (sessionId) {
      console.log("🔄 Rechargement des feedbacks pour la session:", sessionId);
      axios.get(`http://localhost:8000/feedback/session/list/${sessionId}`)
        .then(res => {
          console.log("✅ Feedbacks reçus:", res.data);
          setFeedbacks(res.data);
        })
        .catch(err => console.error("❌ Error loading session feedback list:", err));
    }
  }, [sessionId]);

  React.useEffect(() => {
    reloadFeedbacks();
    
    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(reloadFeedbacks, 30000);
    
    return () => clearInterval(interval);
  }, [reloadFeedbacks]);

  const handleShowMore = (userId) => {
    if (sessionId && userId) {
      axios.get(`http://localhost:8000/feedback/session/${sessionId}/student/${userId}`)
        .then(res => {
          setSelectedStudentFeedbacks(res.data);
          setFeedbackDialogOpen(true);
        })
        .catch(err => console.error("Error loading all feedback for student:", err));
    }
  };

    const feedbackColumns = [
      { field: 'id', headerName: t('id'), width: 70 },
      { field: 'studentName', headerName: t('studentName'), width: 180 },
      { field: 'studentEmail', headerName: t('studentEmail'), width: 220 },
{ field: 'fullFeedback', headerName: t('fullFeedback'), width: 150, renderCell: (params) => {
        return (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleShowMore(params.row.userId)}
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 1,
              fontSize: '0.8rem'
            }}
          >
            {t('showMore')}
          </Button>
        );
      }},
{
      field: 'averageRating',
      headerName: t('averageRating'),
      width: 200,
      renderCell: (params) => {
        // Use the averageRating from the backend directly as the primary source
        let finalRating = 0;
        if (params.row.averageRating && params.row.averageRating > 0) {
          finalRating = params.row.averageRating;
        } else if (params.row.ratings) {
          // Fallback: Calculate weighted score only if backend didn't provide it
          try {
            const ratingsData = typeof params.row.ratings === 'string'
              ? JSON.parse(params.row.ratings)
              : params.row.ratings;

            if (ratingsData && typeof ratingsData === 'object') {
              // Définir les poids pour chaque critère
              const criteriaWeights = {
                overallRating: 0.25,
                contentRelevance: 0.20,
                learningObjectives: 0.15,
                skillImprovement: 0.15,
                satisfactionLevel: 0.10,
                sessionStructure: 0.10,
                knowledgeGain: 0.05
              };

              let totalWeightedScore = 0;
              let totalWeight = 0;

              Object.entries(criteriaWeights).forEach(([criterion, weight]) => {
                const rating = ratingsData[criterion];
                if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
                  totalWeightedScore += rating * weight;
                  totalWeight += weight;
                }
              });

              if (totalWeight >= 0.5) {
                finalRating = Math.round((totalWeightedScore / totalWeight) * 10) / 10;
              }
            }
          } catch (error) {
            console.warn('Erreur parsing ratings:', error);
          }
        }

        let comment = '';

        // Si pas de rating valide
        if (finalRating === 0) {
          return (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              Pas d'évaluation
            </Typography>
          );
        }

        // Formater la note (toujours afficher avec une décimale)
        const formatRating = (rating) => {
          const rounded = Math.round(rating * 10) / 10; // Arrondir à 1 décimale
          return rounded.toFixed(1).replace('.', ','); // Toujours afficher avec une décimale
        };

        // Simplified display like seance feedback list
        const moodLabels = [t('veryDissatisfied'), t('dissatisfied'), t('neutral'), t('satisfied'), t('verySatisfied')];
        const moodEmojis = ["😞", "😐", "🙂", "😊", "🤩"];
        const moodComments = ['Très insatisfait', 'Insatisfait', 'Neutre', 'Satisfait', 'Très satisfait'];

        // Get simple label and comment based on rating
        let simpleLabel = '';
        if (finalRating >= 4.5) {
          simpleLabel = moodLabels[4]; // Très satisfait
          comment = moodComments[4];
        } else if (finalRating >= 3.5) {
          simpleLabel = moodLabels[3]; // Satisfait
          comment = moodComments[3];
        } else if (finalRating >= 2.5) {
          simpleLabel = moodLabels[2]; // Neutre
          comment = moodComments[2];
        } else if (finalRating >= 1.5) {
          simpleLabel = moodLabels[1]; // Insatisfait
          comment = moodComments[1];
        } else {
          simpleLabel = moodLabels[0]; // Très insatisfait
          comment = moodComments[0];
        }

        // Get emoji based on rating
        let simpleEmoji = '';
        const roundedRating = Math.round(finalRating);
        if (roundedRating >= 1 && roundedRating <= 5) {
          simpleEmoji = moodEmojis[roundedRating - 1];
        } else {
          simpleEmoji = '❓';
        }

        return (
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 22 }}>{simpleEmoji}</span>
              <span style={{ fontWeight: 'bold', marginLeft: 4 }}>{simpleLabel}</span>
              <span style={{ color: '#888', marginLeft: 4 }}>({formatRating(finalRating)})</span>
            </span>
            <span style={{ fontSize: '0.9rem', color: '#555', marginLeft: 26 }}>
              {comment}
            </span>
          </span>
        );
      }
    },
    ];

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: "#fefefe" }}>
      <Typography variant="h4" mb={3} fontWeight="bold" display="flex" alignItems="center" gap={1}>
        <FeedbackIcon fontSize="large" />
        {t('sessionFeedbackList')}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={feedbacks}
            columns={feedbackColumns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      </Paper>

      {/* Detailed Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FeedbackIcon fontSize="large" />
            <Box>
              <Typography variant="h5" fontWeight="bold">{t('feedbackDetails')}</Typography>
              {selectedStudentFeedbacks.length > 0 && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {selectedStudentFeedbacks[0]?.studentName || selectedStudentFeedbacks[0]?.studentEmail}
                  {selectedStudentFeedbacks[0]?.studentName && selectedStudentFeedbacks[0]?.studentEmail &&
                    ` (${selectedStudentFeedbacks[0]?.studentEmail})`
                  }
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton
            onClick={() => setFeedbackDialogOpen(false)}
            sx={{ color: 'white' }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedStudentFeedbacks.length > 0 ? (
            <Stack spacing={3}>
              {selectedStudentFeedbacks.map((fb, index) => {
                // Fonctions utilitaires pour les emojis
                const getEmojiForRating = (rating) => {
                  const emojis = ["😞", "😐", "🙂", "😊", "🤩"];
                  return rating > 0 && rating <= 5 ? emojis[rating - 1] : "❓";
                };

                const getRatingLabel = (rating) => {
                  const labels = ["Très mauvais", "Mauvais", "Moyen", "Bon", "Excellent"];
                  return rating > 0 && rating <= 5 ? labels[rating - 1] : "Non évalué";
                };

                const getRadioEmoji = (value, field) => {
                  const emojiMap = {
                    sessionDuration: {
                      "trop-courte": "⏱️",
                      "parfaite": "✅",
                      "trop-longue": "⏳"
                    },
                    wouldRecommend: {
                      "absolument": "🌟",
                      "probablement": "👍",
                      "peut-etre": "🤷",
                      "non": "👎"
                    },
                    wouldAttendAgain: {
                      "oui": "😊",
                      "selon-sujet": "📚",
                      "non": "❌"
                    }
                  };
                  return emojiMap[field]?.[value] || "❓";
                };

                const getRadioLabel = (value, field) => {
                  const labelMap = {
                    sessionDuration: {
                      "trop-courte": "Trop courte",
                      "parfaite": "Parfaite",
                      "trop-longue": "Trop longue"
                    },
                    wouldRecommend: {
                      "absolument": "Absolument",
                      "probablement": "Probablement",
                      "peut-etre": "Peut-être",
                      "non": "Non"
                    },
                    wouldAttendAgain: {
                      "oui": "Oui, avec plaisir",
                      "selon-sujet": "Selon le sujet",
                      "non": "Non"
                    }
                  };
                  return labelMap[field]?.[value] || "Non renseigné";
                };

                // Parse les données du formulaire
                let formData = {};
                let ratings = {};
                try {
                  if (fb.formData) {
                    formData = typeof fb.formData === 'string' ? JSON.parse(fb.formData) : fb.formData;
                  }
                  if (fb.ratings) {
                    ratings = typeof fb.ratings === 'string' ? JSON.parse(fb.ratings) : fb.ratings;
                  }
                } catch (e) {
                  console.error('Error parsing feedback data:', e);
                }

                // Nouvelle fonction de calcul du score pondéré
                const calculateWeightedScore = () => {
                  // Définir les poids pour chaque critère
                  const criteriaWeights = {
                    overallRating: 0.25,
                    contentRelevance: 0.20,
                    learningObjectives: 0.15,
                    skillImprovement: 0.15,
                    satisfactionLevel: 0.10,
                    sessionStructure: 0.10,
                    knowledgeGain: 0.05
                  };

                  let totalWeightedScore = 0;
                  let totalWeight = 0;

                  Object.entries(criteriaWeights).forEach(([criterion, weight]) => {
                    const rating = ratings[criterion];
                    if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
                      totalWeightedScore += rating * weight;
                      totalWeight += weight;
                    }
                  });

                  if (totalWeight >= 0.5) {
                    return Math.round((totalWeightedScore / totalWeight) * 10) / 10;
                  }

                  return fb.rating || 0;
                };

                // Fonction pour obtenir le label du score
                const getScoreLabel = (score) => {
                  if (score >= 4.5) return 'Exceptionnel';
                  if (score >= 4.0) return 'Excellent';
                  if (score >= 3.5) return 'Très bien';
                  if (score >= 3.0) return 'Bien';
                  if (score >= 2.5) return 'Moyen';
                  if (score >= 2.0) return 'Insuffisant';
                  if (score > 0) return 'Très insuffisant';
                  return 'Non évalué';
                };

                return (
                  <Box key={fb.id}>
                    {/* En-tête avec date et note moyenne */}
                    <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                          📊 Score Global Pondéré
                        </Typography>
                        <Typography variant="h2" fontWeight="bold">
                          {calculateWeightedScore()}/5
                        </Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                          {getScoreLabel(calculateWeightedScore())}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '2.5rem',
                                color: i < Math.round(calculateWeightedScore()) ? '#ffc107' : '#e0e0e0'
                              }}
                            >
                              {i < calculateWeightedScore() ? '★' : '☆'}
                            </span>
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Basé sur {Object.values(ratings).filter(r => typeof r === 'number' && r >= 1 && r <= 5).length} critères pondérés
                        </Typography>
                      </CardContent>
                    </Card>

                    {/* Section 1: Évaluation Globale */}
                    {ratings && (ratings.overallRating || ratings.contentRelevance || ratings.learningObjectives || ratings.sessionStructure) && (
                      <Card sx={{ mb: 3 }}>
                        <CardHeader
                          sx={{ bgcolor: 'primary.light', color: 'white' }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>⭐</Typography>
                              <Typography variant="h6">Évaluation Globale</Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          <Grid container spacing={2}>
                            {[
                              { key: 'overallRating', label: 'Note globale de la session' },
                              { key: 'contentRelevance', label: 'Pertinence du contenu' },
                              { key: 'learningObjectives', label: 'Atteinte des objectifs' },
                              { key: 'sessionStructure', label: 'Structure de la session' }
                            ].filter(({ key }) => ratings[key]).map(({ key, label }) => (
                              <Grid item xs={12} sm={6} key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Typography sx={{ fontSize: '1.5rem' }}>
                                    {getEmojiForRating(ratings[key])}
                                  </Typography>
                                  <Box>
                                    <Typography variant="body2" fontWeight="600">
                                      {label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {getRatingLabel(ratings[key])}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    )}

                    {/* Section 2: Progression et Apprentissage */}
                    {ratings && (ratings.skillImprovement || ratings.knowledgeGain || ratings.practicalApplication || ratings.confidenceLevel) && (
                      <Card sx={{ mb: 3 }}>
                        <CardHeader
                          sx={{ bgcolor: 'success.light', color: 'white' }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>📈</Typography>
                              <Typography variant="h6">Progression et Apprentissage</Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          <Grid container spacing={2}>
                            {[
                              { key: 'skillImprovement', label: 'Amélioration des compétences' },
                              { key: 'knowledgeGain', label: 'Acquisition de connaissances' },
                              { key: 'practicalApplication', label: 'Application pratique' },
                              { key: 'confidenceLevel', label: 'Niveau de confiance' }
                            ].filter(({ key }) => ratings[key]).map(({ key, label }) => (
                              <Grid item xs={12} sm={6} key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Typography sx={{ fontSize: '1.5rem' }}>
                                    {getEmojiForRating(ratings[key])}
                                  </Typography>
                                  <Box>
                                    <Typography variant="body2" fontWeight="600">
                                      {label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {getRatingLabel(ratings[key])}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    )}

                    {/* Section 3: Organisation et Logistique */}
                    {((ratings && (ratings.pacing || ratings.environment)) || formData.sessionDuration) && (
                      <Card sx={{ mb: 3 }}>
                        <CardHeader
                          sx={{ bgcolor: 'info.light', color: 'white' }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>📅</Typography>
                              <Typography variant="h6">Organisation et Logistique</Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          {/* Durée de la session */}
                          {formData.sessionDuration && (
                            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography sx={{ fontSize: '1.2rem' }}>⏰</Typography>
                                <Typography variant="body1" fontWeight="600">
                                  Durée de la session
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: '1.5rem' }}>
                                  {getRadioEmoji(formData.sessionDuration, 'sessionDuration')}
                                </Typography>
                                <Typography variant="body2">
                                  {getRadioLabel(formData.sessionDuration, 'sessionDuration')}
                                </Typography>
                              </Box>
                            </Box>
                          )}

                          {/* Autres évaluations */}
                          <Grid container spacing={2}>
                            {[
                              { key: 'pacing', label: 'Rythme de la formation' },
                              { key: 'environment', label: 'Environnement de formation' }
                            ].filter(({ key }) => ratings[key]).map(({ key, label }) => (
                              <Grid item xs={12} sm={6} key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Typography sx={{ fontSize: '1.5rem' }}>
                                    {getEmojiForRating(ratings[key])}
                                  </Typography>
                                  <Box>
                                    <Typography variant="body2" fontWeight="600">
                                      {label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {getRatingLabel(ratings[key])}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    )}

                    {/* Section 4: Impact et Valeur */}
                    {ratings && (ratings.careerImpact || ratings.applicability || ratings.valueForTime || ratings.expectationsMet) && (
                      <Card sx={{ mb: 3 }}>
                        <CardHeader
                          sx={{ bgcolor: 'warning.light', color: 'white' }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>💼</Typography>
                              <Typography variant="h6">Impact et Valeur</Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          <Grid container spacing={2}>
                            {[
                              { key: 'careerImpact', label: 'Impact sur votre carrière' },
                              { key: 'applicability', label: 'Applicabilité immédiate' },
                              { key: 'valueForTime', label: 'Rapport qualité/temps' },
                              { key: 'expectationsMet', label: 'Attentes satisfaites' }
                            ].filter(({ key }) => ratings[key]).map(({ key, label }) => (
                              <Grid item xs={12} sm={6} key={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Typography sx={{ fontSize: '1.5rem' }}>
                                    {getEmojiForRating(ratings[key])}
                                  </Typography>
                                  <Box>
                                    <Typography variant="body2" fontWeight="600">
                                      {label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {getRatingLabel(ratings[key])}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    )}

                    {/* Section 5: Satisfaction et Recommandations */}
                    {((ratings && ratings.satisfactionLevel) || formData.wouldRecommend || formData.wouldAttendAgain) && (
                      <Card sx={{ mb: 3 }}>
                        <CardHeader
                          sx={{ bgcolor: 'grey.700', color: 'white' }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>👍</Typography>
                              <Typography variant="h6">Satisfaction et Recommandations</Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          {/* Satisfaction globale */}
                          {ratings.satisfactionLevel && (
                            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography sx={{ fontSize: '1.2rem' }}>😊</Typography>
                                <Typography variant="body1" fontWeight="600">
                                  Niveau de satisfaction global
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: '1.5rem' }}>
                                  {getEmojiForRating(ratings.satisfactionLevel)}
                                </Typography>
                                <Typography variant="body2">
                                  {getRatingLabel(ratings.satisfactionLevel)}
                                </Typography>
                              </Box>
                            </Box>
                          )}

                          {/* Recommandations */}
                          <Grid container spacing={2}>
                            {formData.wouldRecommend && (
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>🤔</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                      Recommanderiez-vous cette formation ?
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontSize: '1.5rem' }}>
                                      {getRadioEmoji(formData.wouldRecommend, 'wouldRecommend')}
                                    </Typography>
                                    <Typography variant="body2">
                                      {getRadioLabel(formData.wouldRecommend, 'wouldRecommend')}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                            {formData.wouldAttendAgain && (
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>🔄</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                      Participeriez-vous à une session similaire ?
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontSize: '1.5rem' }}>
                                      {getRadioEmoji(formData.wouldAttendAgain, 'wouldAttendAgain')}
                                    </Typography>
                                    <Typography variant="body2">
                                      {getRadioLabel(formData.wouldAttendAgain, 'wouldAttendAgain')}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    )}



                    {/* Section 2: Choix multiples */}
                    {(formData.sessionDuration || formData.wouldRecommend || formData.wouldAttendAgain) && (
                      <Card sx={{ mb: 3 }}>
                        <CardHeader
                          sx={{ bgcolor: 'info.light', color: 'white' }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>📅</Typography>
                              <Typography variant="h6">Choix et Recommandations</Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          <Grid container spacing={2}>
                            {formData.sessionDuration && (
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>⏰</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                      Durée de la session
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontSize: '1.5rem' }}>
                                      {getRadioEmoji(formData.sessionDuration, 'sessionDuration')}
                                    </Typography>
                                    <Typography variant="body2">
                                      {getRadioLabel(formData.sessionDuration, 'sessionDuration')}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                            {formData.wouldRecommend && (
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>🤔</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                      Recommanderiez-vous cette formation ?
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontSize: '1.5rem' }}>
                                      {getRadioEmoji(formData.wouldRecommend, 'wouldRecommend')}
                                    </Typography>
                                    <Typography variant="body2">
                                      {getRadioLabel(formData.wouldRecommend, 'wouldRecommend')}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                            {formData.wouldAttendAgain && (
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>🔄</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                      Participeriez-vous à une session similaire ?
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography sx={{ fontSize: '1.5rem' }}>
                                      {getRadioEmoji(formData.wouldAttendAgain, 'wouldAttendAgain')}
                                    </Typography>
                                    <Typography variant="body2">
                                      {getRadioLabel(formData.wouldAttendAgain, 'wouldAttendAgain')}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    )}
                    {/* Section 3: Points forts et améliorations */}
                    {(formData.strongestAspects?.length > 0 || formData.improvementAreas?.length > 0) && (
                      <Card sx={{ mb: 3 }}>
                        <CardHeader
                          sx={{ bgcolor: 'secondary.light', color: 'white' }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>💡</Typography>
                              <Typography variant="h6">Points Forts et Améliorations</Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          <Grid container spacing={3}>
                            {formData.strongestAspects?.length > 0 && (
                              <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, color: 'white' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>✨</Typography>
                                    <Typography variant="h6" fontWeight="600">
                                      Points forts
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.strongestAspects.map((aspect, index) => (
                                      <Chip
                                        key={index}
                                        label={aspect}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                            {formData.improvementAreas?.length > 0 && (
                              <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, color: 'black', border: '2px solid #e0e0e0' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>🔧</Typography>
                                    <Typography variant="h6" fontWeight="600">
                                      Domaines à améliorer
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.improvementAreas.map((area, index) => (
                                      <Chip
                                        key={index}
                                        label={area}
                                        size="small"
                                        sx={{ bgcolor: '#f5f5f5', color: 'black', border: '1px solid #ddd' }}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    )}

                    {/* Section 4: Commentaires */}
                    {(formData.overallComments || formData.bestAspects || formData.suggestions || formData.additionalTopics) && (
                      <Card sx={{ mb: 3 }}>
                        <CardHeader
                          sx={{ bgcolor: 'primary.dark', color: 'white' }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>💬</Typography>
                              <Typography variant="h6">Commentaires Détaillés</Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          <Grid container spacing={2}>
                            {[
                              { key: 'overallComments', label: '💭 Commentaire général', emoji: '💭' },
                              { key: 'bestAspects', label: '⭐ Ce que vous avez le plus apprécié', emoji: '⭐' },
                              { key: 'suggestions', label: '💡 Suggestions d\'amélioration', emoji: '💡' },
                              { key: 'additionalTopics', label: '📚 Sujets supplémentaires souhaités', emoji: '📚' }
                            ].filter(({ key }) => formData[key]).map(({ key, label, emoji }) => (
                              <Grid item xs={12} key={key}>
                                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>{emoji}</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                      {label}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {formData[key]}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                {t('noFeedbackSelected')}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Button
            onClick={() => setFeedbackDialogOpen(false)}
            variant="outlined"
            color="primary"
          >
            {t('close')}
          </Button>
          <Button
            onClick={() => {
              // Fonctionnalité future : exporter ou imprimer
              console.log('Export feedback:', selectedStudentFeedbacks);
            }}
            variant="contained"
            color="primary"
            disabled
          >
            {t('export')} (à venir)
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SessionFeedbackList;
