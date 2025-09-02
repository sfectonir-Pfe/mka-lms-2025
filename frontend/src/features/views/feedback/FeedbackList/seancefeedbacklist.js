import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Grid,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import api from "../../../../api/axiosInstance";
import { DataGrid } from '@mui/x-data-grid';
import { Feedback as FeedbackIcon, Close } from "@mui/icons-material";

// Fonction pour obtenir l'emoji selon la note (commentaires traduits à l'affichage)
const getEmojiAndComment = (rating) => {
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return { emoji: '', comment: '' };
  }

  const emojiData = [
    { emoji: '😞', comment: '' },
    { emoji: '😐', comment: '' },
    { emoji: '🙂', comment: '' },
    { emoji: '😊', comment: '' },
    { emoji: '🤩', comment: '' }
  ];

  return emojiData[ratingNum - 1] || { emoji: '', comment: '' };
};

// Helper: createAnswersFromFeedback - Extrait toutes les parties de réponse
function createAnswersFromFeedback(feedback) {
  if (!feedback) return [];

  const answers = [];

  // Section Session
  if (feedback.sessionRating) {
    const { emoji, comment } = getEmojiAndComment(feedback.sessionRating);
    answers.push({
      question: '📚 Note de la session',
      key: 'sessionRating',
      answer: feedback.sessionRating,
      emoji,
      comment
    });
  }
  if (feedback.contentQuality) {
    const { emoji, comment } = getEmojiAndComment(feedback.contentQuality);
    answers.push({
      question: '📖 Qualité du contenu',
      key: 'contentQuality',
      answer: feedback.contentQuality,
      emoji,
      comment
    });
  }
  if (feedback.sessionOrganization) {
    const { emoji, comment } = getEmojiAndComment(feedback.sessionOrganization);
    answers.push({
      question: '🗂️ Organisation de la session',
      key: 'sessionOrganization',
      answer: feedback.sessionOrganization,
      emoji,
      comment
    });
  }
  if (feedback.objectivesAchieved) {
    const { emoji, comment } = getEmojiAndComment(feedback.objectivesAchieved);
    answers.push({
      question: '🎯 Objectifs atteints',
      key: 'objectivesAchieved',
      answer: feedback.objectivesAchieved,
      emoji,
      comment
    });
  }
  if (feedback.sessionDuration) {
    const { emoji, comment } = getEmojiAndComment(feedback.sessionDuration);
    answers.push({
      question: '⏰ Durée de la séance',
      key: 'sessionDuration',
      answer: feedback.sessionDuration,
      emoji,
      comment
    });
  }

  // Section Formateur
  if (feedback.trainerRating) {
    const { emoji, comment } = getEmojiAndComment(feedback.trainerRating);
    answers.push({
      question: '👨‍🏫 Note du formateur',
      key: 'trainerRating',
      answer: feedback.trainerRating,
      emoji,
      comment
    });
  }
  if (feedback.trainerClarity) {
    const { emoji, comment } = getEmojiAndComment(feedback.trainerClarity);
    answers.push({
      question: '🔍 Clarté du formateur',
      key: 'trainerClarity',
      answer: feedback.trainerClarity,
      emoji,
      comment
    });
  }
  if (feedback.trainerAvailability) {
    const { emoji, comment } = getEmojiAndComment(feedback.trainerAvailability);
    answers.push({
      question: '🤝 Disponibilité du formateur',
      key: 'trainerAvailability',
      answer: feedback.trainerAvailability,
      emoji,
      comment
    });
  }
  if (feedback.trainerPedagogy) {
    const { emoji, comment } = getEmojiAndComment(feedback.trainerPedagogy);
    answers.push({
      question: '🎓 Pédagogie du formateur',
      key: 'trainerPedagogy',
      answer: feedback.trainerPedagogy,
      emoji,
      comment
    });
  }
  if (feedback.trainerInteraction) {
    const { emoji, comment } = getEmojiAndComment(feedback.trainerInteraction);
    answers.push({
      question: '💬 Interaction du formateur',
      key: 'trainerInteraction',
      answer: feedback.trainerInteraction,
      emoji,
      comment
    });
  }

  // Section Équipe
  if (feedback.teamRating) {
    const { emoji, comment } = getEmojiAndComment(feedback.teamRating);
    answers.push({
      question: '👥 Note de l\'équipe',
      key: 'teamRating',
      answer: feedback.teamRating,
      emoji,
      comment
    });
  }
  if (feedback.teamCollaboration) {
    const { emoji, comment } = getEmojiAndComment(feedback.teamCollaboration);
    answers.push({
      question: '🤝 Collaboration de l\'équipe',
      key: 'teamCollaboration',
      answer: feedback.teamCollaboration,
      emoji,
      comment
    });
  }
  if (feedback.teamParticipation) {
    const { emoji, comment } = getEmojiAndComment(feedback.teamParticipation);
    answers.push({
      question: '🙋‍♂️ Participation de l\'équipe',
      key: 'teamParticipation',
      answer: feedback.teamParticipation,
      emoji,
      comment
    });
  }
  if (feedback.teamCommunication) {
    const { emoji, comment } = getEmojiAndComment(feedback.teamCommunication);
    answers.push({
      question: '📢 Communication de l\'équipe',
      key: 'teamCommunication',
      answer: feedback.teamCommunication,
      emoji,
      comment
    });
  }

  // Commentaires et suggestions
  if (feedback.sessionComments) answers.push({ question: '💭 Commentaires sur la session', key: 'sessionComments', answer: feedback.sessionComments });
  if (feedback.trainerComments) answers.push({ question: '💭 Commentaires sur le formateur', key: 'trainerComments', answer: feedback.trainerComments });
  if (feedback.teamComments) answers.push({ question: '💭 Commentaires sur l\'équipe', key: 'teamComments', answer: feedback.teamComments });
  if (feedback.suggestions) answers.push({ question: '💡 Suggestions d\'amélioration', key: 'suggestions', answer: feedback.suggestions });
  if (feedback.wouldRecommend) answers.push({ question: '👍 Recommanderiez-vous cette formation ?', key: 'wouldRecommend', answer: feedback.wouldRecommend });

  // Fallback: si aucune donnée structurée, utiliser fullFeedback
  if (answers.length === 0 && feedback.fullFeedback) {
    answers.push({ question: '💭 Feedback général', key: 'generalFeedback', answer: feedback.fullFeedback });
  }

  return answers;
}

// Helper: renderStars
function renderStars(rating) {
  const rounded = Math.round(rating);
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: '2rem',
            color: i < rounded ? '#ffc107' : '#e0e0e0'
          }}
        >
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </>
  );
}

const FeedbackList = () => {
  const { t } = useTranslation();
  const { id: seanceId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const reloadFeedbacks = useCallback(() => {
    if (seanceId) {
      api.get(`/feedback/seance/feedbacklist/${seanceId}`)
        .then(res => {
          console.log("Feedbacks reçus:", res.data);
          // Map the data according to backend response structure
          const mapped = res.data.map((fb, idx) => ({
            ...fb,
            id: fb.id || idx,
            studentName: fb.studentName || '',
            studentEmail: fb.studentEmail || '',
            fullFeedback: fb.fullFeedback || '',
            averageRating: fb.averageRating,
            userId: fb.userId
          }));
          console.log("Feedbacks mappés:", mapped); // Debug output
          setFeedbacks(mapped);
        })
        .catch(err => console.error("Erreur chargement feedbacklist:", err));
    }
  }, [seanceId]);

  useEffect(() => {
    reloadFeedbacks();
  }, [reloadFeedbacks]);

  const feedbackColumns = [
    { field: 'id', headerName: t('seances.id'), width: 70 },
    { field: 'studentName', headerName: t('seances.studentName'), width: 200 },
    { field: 'studentEmail', headerName: t('seances.studentEmail'), width: 250 },
    {
      field: 'fullFeedback',
      headerName: t('seances.fullFeedback'),
      width: 250,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={async () => {
            try {
              // Récupérer les détails complets du feedback
              const response = await api.get(`/feedback/seance/details/${seanceId}/${params.row.userId || params.row.id}`);
              setSelectedFeedback(response.data);
              setFeedbackDialogOpen(true);
            } catch (error) {
              console.error('Erreur lors de la récupération des détails:', error);
              // Fallback: utiliser les données de base
              setSelectedFeedback(params.row);
              setFeedbackDialogOpen(true);
            }
          }}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
            boxShadow: '0 6px 18px rgba(2,136,209,0.25)',
            transition: 'transform 0.15s ease',
            '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(2,136,209,0.35)' }
          }}
        >
          {t('sessions.fullFeedback')}
        </Button>
      ),
    },
    {
      field: 'averageRating',
      headerName: t('seances.averageRating'),
      width: 190,
      renderCell: (params) => {
        // Utiliser la même logique de calcul que dans le dialog
        let avg = params.row.averageRating;
        
        // Si averageRating n'est pas disponible ou invalide, calculer avec la même logique
        if (!avg || avg <= 0) {
          // Créer les réponses à partir du feedback pour calculer la moyenne pondérée
          const answers = createAnswersFromFeedback(params.row);
          const numericAnswers = answers
            .map(qa => Number(qa.answer))
            .filter(val => !isNaN(val) && val >= 1 && val <= 5);
          
          if (numericAnswers.length > 0) {
            // Calcul pondéré basé sur les types de questions
            const sessionQuestions = ['note de la session', 'qualité du contenu', 'organisation', 'objectifs', 'durée'];
            const trainerQuestions = ['note du formateur', 'clarté', 'disponibilité', 'pédagogie', 'interaction'];
            const teamQuestions = ['note de l\'équipe', 'collaboration', 'participation', 'communication'];
            
            let sessionScore = 0, sessionCount = 0;
            let trainerScore = 0, trainerCount = 0;
            let teamScore = 0, teamCount = 0;
            let otherScore = 0, otherCount = 0;
            
            answers.forEach(qa => {
              const question = qa.question.toLowerCase();
              const answer = Number(qa.answer);
              
              if (!isNaN(answer) && answer >= 1 && answer <= 5) {
                if (sessionQuestions.some(keyword => question.includes(keyword))) {
                  sessionScore += answer;
                  sessionCount++;
                } else if (trainerQuestions.some(keyword => question.includes(keyword))) {
                  trainerScore += answer;
                  trainerCount++;
                } else if (teamQuestions.some(keyword => question.includes(keyword))) {
                  teamScore += answer;
                  teamCount++;
                } else {
                  // Autres questions numériques
                  otherScore += answer;
                  otherCount++;
                }
              }
            });
            
            // Calcul pondéré : Session (35%), Formateur (35%), Équipe (20%), Autres (10%)
            let totalWeightedScore = 0;
            let totalWeight = 0;
            
            if (sessionCount > 0) {
              totalWeightedScore += (sessionScore / sessionCount) * 0.35;
              totalWeight += 0.35;
            }
            if (trainerCount > 0) {
              totalWeightedScore += (trainerScore / trainerCount) * 0.35;
              totalWeight += 0.35;
            }
            if (teamCount > 0) {
              totalWeightedScore += (teamScore / teamCount) * 0.20;
              totalWeight += 0.20;
            }
            if (otherCount > 0) {
              totalWeightedScore += (otherScore / otherCount) * 0.10;
              totalWeight += 0.10;
            }
            
            if (totalWeight > 0) {
              avg = Math.round((totalWeightedScore / totalWeight) * 10) / 10;
            } else {
              // Fallback: moyenne simple
              avg = Math.round((numericAnswers.reduce((a, b) => a + b, 0) / numericAnswers.length) * 10) / 10;
            }
          }
        }
        
        if (avg === null || avg === undefined || avg <= 0) return t('seances.noRating');
        const rounded = Math.round(avg);
        const moodLabels = [t('seances.veryDissatisfied'), t('seances.dissatisfied'), t('seances.neutral'), t('seances.satisfied'), t('seances.verySatisfied')];
        const moodEmoji = ["😞", "😐", "🙂", "😊", "🤩"][rounded - 1] || "❓";
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 22 }}>{moodEmoji}</span>
            <span style={{ fontWeight: 'bold', marginLeft: 4 }}>{moodLabels[rounded - 1]}</span>
            <span style={{ color: '#888', marginLeft: 4 }}>({avg.toFixed(1)})</span>
          </span>
        );
      }
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h4" mb={3}>
        <FeedbackIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 2 }} />
        {t('seances.feedbackList')}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={feedbacks}
            columns={feedbackColumns}
            pageSize={7}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      </Paper>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 1,
          }}
        >
          <Box>
            <Typography variant="h5" component="h1" fontWeight="bold">
              📋 {t('seances.feedbackFrom')} {selectedFeedback?.studentName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {selectedFeedback?.studentEmail}
            </Typography>
          </Box>
          <IconButton onClick={() => setFeedbackDialogOpen(false)} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
            {selectedFeedback ? (() => {
              const answers = createAnswersFromFeedback(selectedFeedback);

              if (answers.length === 0) {
                return (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    {t('seances.noFeedbackData')}
                  </Typography>
                );
              }

              // Calculer la note moyenne
              const numericAnswers = answers
                .map(qa => Number(qa.answer))
                .filter(val => !isNaN(val) && val >= 1 && val <= 5);
              
              // Utiliser la même logique que dans le datagrid
              let averageRating = 0;
              if (selectedFeedback?.averageRating && selectedFeedback.averageRating > 0) {
                averageRating = selectedFeedback.averageRating;
              } else if (numericAnswers.length > 0) {
                // Calcul pondéré basé sur les types de questions
                const sessionQuestions = ['note de la session', 'qualité du contenu', 'organisation', 'objectifs', 'durée'];
                const trainerQuestions = ['note du formateur', 'clarté', 'disponibilité', 'pédagogie', 'interaction'];
                const teamQuestions = ['note de l\'équipe', 'collaboration', 'participation', 'communication'];
                
                let sessionScore = 0, sessionCount = 0;
                let trainerScore = 0, trainerCount = 0;
                let teamScore = 0, teamCount = 0;
                let otherScore = 0, otherCount = 0;
                
                answers.forEach(qa => {
                  const question = qa.question.toLowerCase();
                  const answer = Number(qa.answer);
                  
                  if (!isNaN(answer) && answer >= 1 && answer <= 5) {
                    if (sessionQuestions.some(keyword => question.includes(keyword))) {
                      sessionScore += answer;
                      sessionCount++;
                    } else if (trainerQuestions.some(keyword => question.includes(keyword))) {
                      trainerScore += answer;
                      trainerCount++;
                    } else if (teamQuestions.some(keyword => question.includes(keyword))) {
                      teamScore += answer;
                      teamCount++;
                    } else {
                      // Autres questions numériques
                      otherScore += answer;
                      otherCount++;
                    }
                  }
                });
                
                // Calcul pondéré : Session (35%), Formateur (35%), Équipe (20%), Autres (10%)
                let totalWeightedScore = 0;
                let totalWeight = 0;
                
                if (sessionCount > 0) {
                  totalWeightedScore += (sessionScore / sessionCount) * 0.35;
                  totalWeight += 0.35;
                }
                if (trainerCount > 0) {
                  totalWeightedScore += (trainerScore / trainerCount) * 0.35;
                  totalWeight += 0.35;
                }
                if (teamCount > 0) {
                  totalWeightedScore += (teamScore / teamCount) * 0.20;
                  totalWeight += 0.20;
                }
                if (otherCount > 0) {
                  totalWeightedScore += (otherScore / otherCount) * 0.10;
                  totalWeight += 0.10;
                }
                
                if (totalWeight > 0) {
                  averageRating = Math.round((totalWeightedScore / totalWeight) * 10) / 10;
                } else {
                  // Fallback: moyenne simple
                  averageRating = Math.round((numericAnswers.reduce((a, b) => a + b, 0) / numericAnswers.length) * 10) / 10;
                }
              }

              const moodLabels = [t('seances.veryDissatisfied'), t('seances.dissatisfied'), t('seances.neutral'), t('seances.satisfied'), t('seances.verySatisfied')];

              return (
                <>
                  {/* Évaluation moyenne */}
                  {averageRating > 0 && (
                    <Card sx={{ mb: 3, color: 'primary.main' }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                          📊 {t('seances.averageEvaluation')}
                        </Typography>
                        <Typography variant="h2" fontWeight="bold">
                          {averageRating.toFixed(1)}/5
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                          {renderStars(averageRating)}
                        </Box>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                          {moodLabels[Math.round(averageRating) - 1]}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}



                  {(() => {
                    // Définition des sections thématiques avec emojis et couleurs
                    const sections = [
                      {
                        title: t('seances.sessionSection'),
                        emoji: '📚',
                        color: 'primary.light',
                        keywords: [
                          'note de la session',
                          'organisation',
                          'objectifs',
                          'durée',
                          'durée de la séance',
                          'qualité du contenu',
                          'commentaires sur la session'
                        ]
                      },
                      {
                        title: t('seances.trainerSection'),
                        emoji: '👨‍🏫',
                        color: 'success.light',
                        keywords: ['note du formateur', 'clarté', 'disponibilité', 'pédagogie', 'interaction', 'commentaires sur le formateur']
                      },
                      {
                        title: t('seances.teamSection'),
                        emoji: '👥',
                        color: 'info.light',
                        keywords: ['note de l\'équipe', 'collaboration', 'participation', 'communication', 'commentaires sur l\'équipe']
                      },
                      {
                        title: t('seances.suggestionsSection'),
                        emoji: '💡',
                        color: 'warning.light',
                        keywords: ['suggestions', 'amélioration', 'recommanderait']
                      }
                    ];

                    // Grouper les réponses par section avec un matching robuste
                    function normalize(str) {
                      return str
                        .toLowerCase()
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
                        .replace(/[^a-z0-9]/g, ''); // retire tout sauf lettres/chiffres
                    }

                    const groupedAnswers = answers.length > 0 ? sections.map(section => ({
                      ...section,
                      answers: answers.filter(qa =>
                        section.keywords.some(keyword =>
                          normalize(qa.question).includes(normalize(keyword))
                        )
                      )
                    })) : [];

                    // Réponses non classées
                    const otherAnswers = answers.length > 0 ? answers.filter(qa =>
                      !sections.some(section => section.keywords.some(keyword => normalize(qa.question).includes(normalize(keyword))))
                    ) : [];

                    return (
                <>
                  {groupedAnswers.map((section, idx) =>
                    section.answers.length > 0 && (
                      <Card key={idx} sx={{ mb: 3 }}>
                        <CardHeader
                          sx={{ color: section.color }}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography sx={{ fontSize: '1.2rem' }}>{section.emoji}</Typography>
                              <Typography variant="h6">{section.title}</Typography>
                            </Box>
                          }
                        />
                        <CardContent>
                          <Grid container spacing={2}>
                            {section.answers.map((qa, qidx) => {
                              let isNumeric = !isNaN(Number(qa.answer)) && Number(qa.answer) >= 1 && Number(qa.answer) <= 5;
                              let value = isNumeric ? Number(qa.answer) : null;
                              return (
                                <Grid item xs={12} sm={isNumeric ? 6 : 12} key={qidx}>
                                  <Box sx={{ p: 2, borderRadius: 1 }}>
                                    <Typography variant="body2" fontWeight="600" gutterBottom>
                                      {qa.key ? t(`seances.feedbackQuestions.${qa.key}`) : qa.question}
                                    </Typography>
                                    {isNumeric ? (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          {qa.emoji && (
                                            <Typography sx={{ fontSize: '1.5rem' }}>
                                              {qa.emoji}
                                            </Typography>
                                          )}
                                          <Typography variant="body2" fontWeight="600">
                                            {qa.comment || moodLabels[value - 1]}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                            ({value}/5)
                                          </Typography>
                                        </Box>
                                      </Box>
                                    ) : (
                                      <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                                        {qa.answer || t('seances.noAnswer')}
                                      </Typography>
                                    )}
                                  </Box>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </CardContent>
                      </Card>
                    )
                  )}
                  {otherAnswers.length > 0 && (
                    <Card sx={{ mb: 3 }}>
                      <CardHeader
                        sx={{ color: 'grey.600' }}
                        title={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontSize: '1.2rem' }}>📝</Typography>
                            <Typography variant="h6">{t('seances.otherSection')}</Typography>
                          </Box>
                        }
                      />
                      <CardContent>
                        <Grid container spacing={2}>
                          {otherAnswers.map((qa, qidx) => {
                            let isNumeric = !isNaN(Number(qa.answer)) && Number(qa.answer) >= 1 && Number(qa.answer) <= 5;
                            let value = isNumeric ? Number(qa.answer) : null;
                            return (
                              <Grid item xs={12} sm={isNumeric ? 6 : 12} key={qidx}>
                                <Box sx={{ p: 2, borderRadius: 1 }}>
                                  <Typography variant="body2" fontWeight="600" gutterBottom>
                                    {qa.key ? t(`seances.feedbackQuestions.${qa.key}`) : qa.question}
                                  </Typography>
                                  {isNumeric ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {qa.emoji && (
                                          <Typography sx={{ fontSize: '1.5rem' }}>
                                            {qa.emoji}
                                          </Typography>
                                        )}
                                        <Typography variant="body2" fontWeight="600">
                                          {qa.comment || moodLabels[value - 1]}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                          ({value}/5)
                                        </Typography>
                                      </Box>
                                    </Box>
                                  ) : (
                                    <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                                      {qa.answer || t('seances.noAnswer')}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </CardContent>
                    </Card>
                  )}
                    </>
                    );
                  })()}
                </>
              );
            })() : (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                {t('seances.noFeedbackData')}
              </Typography>
            )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FeedbackList;