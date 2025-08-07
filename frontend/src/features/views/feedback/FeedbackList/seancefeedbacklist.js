import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { Feedback as FeedbackIcon } from "@mui/icons-material";

const FeedbackList = () => {
  const { t } = useTranslation('seances');
  const { id: seanceId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const reloadFeedbacks = () => {
    if (seanceId) {
      axios.get(`http://localhost:8000/feedback/feedbacklist/${seanceId}`)
        .then(res => {
          console.log("Feedbacks reçus:", res.data);
          const mapped = [];
          const seenEmails = new Set();
          res.data.forEach(fb => {
            if (!seenEmails.has(fb.email)) {
              mapped.push({
                ...fb,
                studentName: fb.nom || '',
                studentEmail: fb.email || '',
                content: fb.feedback || '',
                sessionComments: fb.sessionComments,
                trainerComments: fb.trainerComments,
                teamComments: fb.teamComments,
                suggestions: fb.suggestions,
                answers: fb.answers || [],
              });
              seenEmails.add(fb.email);
            }
          });
          setFeedbacks(mapped);
        })
        .catch(err => console.error("Erreur chargement feedbacklist:", err));
    }
  };

  useEffect(() => {
    reloadFeedbacks();
  }, [seanceId]);

  const feedbackColumns = [
    { field: 'id', headerName: t('id'), width: 70 },
    { field: 'studentName', headerName: t('studentName'), width: 200 },
    { field: 'studentEmail', headerName: t('studentEmail'), width: 250 },
    {
      field: 'fullFeedback',
      headerName: t('fullFeedback'),
      width: 250,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setSelectedFeedback(params.row);
            setFeedbackDialogOpen(true);
          }}
        >
          {t('showMore')}
        </Button>
      ),
    },
    {
      field: 'averageRating',
      headerName: t('averageRating'),
      width: 180,
      renderCell: (params) => {
        const answers = params.row.answers || [];
        const numericAnswers = answers
          .map(qa => Number(qa.answer))
          .filter(val => !isNaN(val) && val >= 1 && val <= 5);
        if (numericAnswers.length === 0) return t('noRating');
        const avg = numericAnswers.reduce((a, b) => a + b, 0) / numericAnswers.length;
        const rounded = Math.round(avg);
        const moodEmojis = ["😞", "😐", "🙂", "😊", "🤩"];
        const moodLabels = [t('veryDissatisfied'), t('dissatisfied'), t('neutral'), t('satisfied'), t('verySatisfied')];
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 22 }}>{moodEmojis[rounded - 1]}</span>
            <span style={{ fontWeight: 'bold', marginLeft: 4 }}>{moodLabels[rounded - 1]}</span>
            <span style={{ color: '#888', marginLeft: 4 }}>({avg.toFixed(2)})</span>
          </span>
        );
      }
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h4" mb={3}>
        <FeedbackIcon fontSize="large" sx={{ verticalAlign: 'middle', mr: 2 }} />
        {t('feedbackList')}
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
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FeedbackIcon color="primary" />
            <Box>
              {t('feedbackFrom')} <b>{selectedFeedback?.studentName}</b>
              <Typography variant="body2" color="text.secondary">
                {selectedFeedback?.studentEmail}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#f8fafc", maxHeight: 500 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('date')}: {selectedFeedback?.createdAt && new Date(selectedFeedback.createdAt).toLocaleString()}
              </Typography>
            </Box>
            {selectedFeedback?.answers?.length > 0 && (() => {
              // Définition des sections thématiques
              const sections = [
                {
                  title: t('sessionSection'),
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
                  title: t('trainerSection'),
                  keywords: ['note du formateur', 'clarté', 'disponibilité', 'pédagogie', 'interaction', 'commentaires sur le formateur']
                },
                {
                  title: t('teamSection'),
                  keywords: ['note de l\'équipe', 'collaboration', 'participation', 'communication', 'commentaires sur l\'équipe']
                },
                {
                  title: t('suggestionsSection'),
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
              const groupedAnswers = selectedFeedback && selectedFeedback.answers ? sections.map(section => ({
                ...section,
                answers: selectedFeedback.answers.filter(qa =>
                  section.keywords.some(keyword =>
                    normalize(qa.question).includes(normalize(keyword))
                  )
                )
              })) : [];
              // Réponses non classées
              const otherAnswers = selectedFeedback && selectedFeedback.answers ? selectedFeedback.answers.filter(qa =>
                !sections.some(section => section.keywords.some(keyword => normalize(qa.question).includes(normalize(keyword))))
              ) : [];
              // Emoji/label pour toutes les réponses numériques (1-5)
              const moodEmojis = ["😞", "😐", "🙂", "😊", "🤩"];
              const moodLabels = [t('veryDissatisfied'), t('dissatisfied'), t('neutral'), t('satisfied'), t('verySatisfied')];
              return (
                <>
                  {groupedAnswers.map((section, idx) =>
                    section.answers.length > 0 && (
                      <Box key={idx} mb={2}>
                        <Divider sx={{ mb: 1 }}>{section.title}</Divider>
                        <Stack spacing={2}>
                          {section.answers.map((qa, qidx) => {
                            let isNumeric = !isNaN(Number(qa.answer)) && Number(qa.answer) >= 1 && Number(qa.answer) <= 5;
                            let value = isNumeric ? Number(qa.answer) : null;
                            return (
                              <Paper key={qidx} elevation={1} sx={{ p: 2, bgcolor: "#fff" }}>
                                <Typography fontWeight="bold" gutterBottom>
                                  {qa.question}
                                </Typography>
                                {isNumeric ? (
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Typography fontSize={32}>{moodEmojis[value - 1]}</Typography>
                                    <Typography fontWeight="bold">{moodLabels[value - 1]}</Typography>
                                    <Typography color="text.secondary">({value})</Typography>
                                  </Box>
                                ) : (
                                  <Typography style={{ whiteSpace: 'pre-line' }}>{qa.answer || t('noAnswer')}</Typography>
                                )}
                              </Paper>
                            );
                          })}
                        </Stack>
                      </Box>
                    )
                  )}
                  {otherAnswers.length > 0 && (
                    <Box mb={2}>
                      <Divider sx={{ mb: 1 }}>{t('otherSection')}</Divider>
                      <Stack spacing={2}>
                        {otherAnswers.map((qa, qidx) => {
                          let isNumeric = !isNaN(Number(qa.answer)) && Number(qa.answer) >= 1 && Number(qa.answer) <= 5;
                          let value = isNumeric ? Number(qa.answer) : null;
                          return (
                            <Paper key={qidx} elevation={1} sx={{ p: 2, bgcolor: "#fff" }}>
                              <Typography fontWeight="bold" gutterBottom>
                                {qa.question}
                              </Typography>
                              {isNumeric ? (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography fontSize={32}>{moodEmojis[value - 1]}</Typography>
                                  <Typography fontWeight="bold">{moodLabels[value - 1]}</Typography>
                                  <Typography color="text.secondary">({value})</Typography>
                                </Box>
                              ) : (
                                <Typography style={{ whiteSpace: 'pre-line' }}>{qa.answer || t('noAnswer')}</Typography>
                              )}
                            </Paper>
                          );
                        })}
                      </Stack>
                    </Box>
                  )}
                </>
              );
            })()}
            {/* Note moyenne de feedback */}
            <Divider>{t('averageRating')}</Divider>
            {(() => {
              // Récupère toutes les réponses numériques (1-5)
              const numericAnswers = selectedFeedback && selectedFeedback.answers ? selectedFeedback.answers
                .map(qa => Number(qa.answer))
                .filter(val => !isNaN(val) && val >= 1 && val <= 5) : [];
              if (numericAnswers.length === 0) {
                return <Typography color="text.secondary">{t('noRating')}</Typography>;
              }
              const avg = numericAnswers.reduce((a, b) => a + b, 0) / numericAnswers.length;
              const rounded = Math.round(avg);
              const moodEmojis = ["😞", "😐", "🙂", "😊", "🤩"];
              const moodLabels = [t('veryDissatisfied'), t('dissatisfied'), t('neutral'), t('satisfied'), t('verySatisfied')];
              return (
                <Box display="flex" alignItems="center" gap={1} mt={1} mb={2}>
                  <Typography fontSize={32}>{moodEmojis[rounded - 1]}</Typography>
                  <Typography fontWeight="bold">{moodLabels[rounded - 1]}</Typography>
                  <Typography color="text.secondary">({avg.toFixed(2)})</Typography>
                </Box>
              );
            })()}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FeedbackList;