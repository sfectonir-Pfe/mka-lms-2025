// src/features/views/feedback/feedbackForm/FeedbackEtudiant.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
} from "@mui/material";
import { NavigateBefore, NavigateNext, School, Person, EmojiEmotions } from "@mui/icons-material";
import { DataGrid } from '@mui/x-data-grid';
import api from "../../../../api/axiosInstance";

const EMOJIS = [
  { emoji: "🤨", value: "poor", labelKey: "studentPeerFeedback.emojis.poor", points: 1 },
  { emoji: "😐", value: "average", labelKey: "studentPeerFeedback.emojis.average", points: 2 },
  { emoji: "🙂", value: "good", labelKey: "studentPeerFeedback.emojis.good", points: 3 },
  { emoji: "😃", value: "very_good", labelKey: "studentPeerFeedback.emojis.very_good", points: 4 },
  { emoji: "🤩", value: "excellent", labelKey: "studentPeerFeedback.emojis.excellent", points: 5 },
];

export default function FeedbackEtudiant() {
  const { t } = useTranslation();
  const { id: seanceId } = useParams();

  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [studentsToEvaluate, setStudentsToEvaluate] = useState([]);

  const [completedFeedbacks, setCompletedFeedbacks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [previewStudent, setPreviewStudent] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const emojiByValue = useMemo(() => {
    const m = new Map();
    EMOJIS.forEach((e) => m.set(e.value, e));
    return m;
  }, []);

  // Helper functions for data mapping
  const mapCategoryToQuestionId = useCallback((category) => {
    // Since we only have one general question now, always return 1
    return 1;
  }, []);

  const mapRatingToReaction = useCallback((rating) => {
    const mapping = {
      5: 'excellent',
      4: 'very_good',
      3: 'good',
      2: 'average',
      1: 'poor'
    };
    return mapping[rating] || 'good';
  }, []);

  // Calculate student rating based on received feedbacks
  const calculateStudentRating = useCallback((studentId) => {
    const studentFeedbacks = completedFeedbacks.filter(f => f.targetStudentId === studentId);
    console.log(`📊 Calculating rating for student ${studentId}:`, studentFeedbacks);
    
    if (studentFeedbacks.length === 0) return { rating: 0, totalPoints: 0, maxPoints: 0 };
    
    // With single feedback per student pair, just take the latest feedback
    const latestFeedback = studentFeedbacks[studentFeedbacks.length - 1];
    console.log(`  📋 Latest feedback:`, latestFeedback);
    
    const emoji = EMOJIS.find(e => e.value === latestFeedback.reaction);
    const points = emoji ? emoji.points : 0;
    const maxPoints = 5; // Max 5 points per feedback
    const rating = points;
    
    console.log(`  📈 Final calculation: ${points}/${maxPoints} = ${rating}/5`);
    return { rating: parseFloat(rating), totalPoints: points, maxPoints };
  }, [completedFeedbacks]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const user =
          JSON.parse(localStorage.getItem("user")) ||
          JSON.parse(sessionStorage.getItem("user")) || { id: 3 };
        const currentUserId = user.id;

        setCurrentStudent({
          id: currentUserId,
          name: user.name || t("role.etudiant"),
          email: user.email || "etudiant@test.com",
        });

        const groupRes = await api.get(
          `/feedback-etudiant/groups/student/${currentUserId}/seance/${seanceId}`
        );
        if (!groupRes.data) {
          setCurrentGroup(null);
          return;
        }
        const group = groupRes.data;
        setCurrentGroup(group);

        const questionsRes = await api.get(
          `/feedback-etudiant/questions/group/${group.id}`,
          { headers: { "user-id": currentUserId } }
        );
        const qs = Array.isArray(questionsRes.data) ? questionsRes.data : [];
        setQuestions(qs);

        if (qs.length > 0 && Array.isArray(qs[0].groupStudents)) {
          const others = qs[0].groupStudents.filter((s) => s.id !== currentUserId);
          setStudentsToEvaluate(others);
        } else {
          setStudentsToEvaluate([]);
        }

        const givenRes = await api.get(
          `/feedback-etudiant/feedbacks/group/${group.id}/student/${currentUserId}`
        );
        console.log('🔍 Feedbacks received from backend:', givenRes.data);
        const given = Array.isArray(givenRes.data) ? givenRes.data : [];
        const categoryToQuestionId = {
          collaboration: 1,
          communication: 2,
          participation: 3,
          qualite_travail: 4,
        };
        const ratingToReaction = { 5: "excellent", 4: "very_good", 3: "good", 2: "average", 1: "poor" };
        setCompletedFeedbacks(
          given.map((f) => ({
            questionId: f.questionId || categoryToQuestionId[f.category] || f.category,
            targetStudentId: f.targetStudentId || f.toStudentId || f.toStudent?.id,
            reaction: f.reaction || ratingToReaction[f.rating],
            toStudent: f.toStudent || (f.toStudentId ? { id: f.toStudentId } : undefined),
          }))
        );
      } catch (err) {
        console.error("Erreur chargement données:", err);
      } finally {
        setLoading(false);
      }
    };

    if (seanceId) fetchAll();
  }, [seanceId, t, mapCategoryToQuestionId, mapRatingToReaction]);

  const handleFeedback = async (reaction) => {
    try {
      if (!selectedStudent) return;
      const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user")) || { id: 3 };
      const currentUserId = user.id;
      const q = questions[currentQuestionIndex];
      if (!q) return;

              await api.post(`/feedback-etudiant/feedbacks`, {
          questionId: q.id,
          studentId: currentUserId,
          targetStudentId: selectedStudent.id,
          reaction,
          groupId: currentGroup.id,
          seanceId,
        });

        // L'email sera envoyé à la fin de l'évaluation complète

      setCompletedFeedbacks((prev) => {
        const idx = prev.findIndex(
          (f) => f.questionId === q.id && f.targetStudentId === selectedStudent.id
        );
        if (idx >= 0) {
          const cp = [...prev];
          cp[idx] = { ...cp[idx], reaction };
          return cp;
        }
        return [
          ...prev,
          {
            questionId: q.id,
            targetStudentId: selectedStudent.id,
            reaction,
            toStudent: selectedStudent,
          },
        ];
      });
    } catch (err) {
      console.error("Erreur envoi feedback:", err);
    }
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNextQuestion = () => {
    // Since we only have one question now, go directly to summary
    setShowSummary(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousQuestion = () => {
    // Not needed with single question, but keep for consistency
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((p) => p - 1);
  };

  const handleNextStudent = async () => {
    if (!selectedStudent) return;
    
    // Envoyer l'email récapitulatif avec tous les feedbacks
    try {
      const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user")) || { id: 3 };
      const currentUserId = user.id;
      
      console.log('🔍 handleNextStudent appelé avec:', {
        currentUserId,
        selectedStudentId: selectedStudent.id,
        groupId: currentGroup.id,
        completedFeedbacksCount: completedFeedbacks.length
      });
      
      // Récupérer tous les feedbacks donnés à cet étudiant
      const allFeedbacksForStudent = completedFeedbacks.filter(
        f => f.targetStudentId === selectedStudent.id
      );
      
      console.log('📊 Feedbacks trouvés pour cet étudiant:', allFeedbacksForStudent);
      
      if (allFeedbacksForStudent.length > 0) {
        console.log('📧 Envoi de l\'email récapitulatif...');
        
        const response = await api.post('/feedback-etudiant/send-feedback-summary-email', {
          fromStudentId: currentUserId,
          toStudentId: selectedStudent.id,
          groupId: currentGroup.id
        });
        
        console.log('✅ Email récapitulatif envoyé avec succès:', response);
      } else {
        console.log('⚠️ Aucun feedback trouvé pour cet étudiant');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email récapitulatif:', error);
      // Ne pas bloquer la navigation si l'email ne peut pas être envoyé
    }
    
    const idx = studentsToEvaluate.findIndex((s) => s.id === selectedStudent.id);
    setShowSummary(false);
    setCurrentQuestionIndex(0);
    if (idx >= 0 && idx < studentsToEvaluate.length - 1) {
      setSelectedStudent(studentsToEvaluate[idx + 1]);
    } else {
      setSelectedStudent(null);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const existingFeedback =
    selectedStudent &&
    completedFeedbacks.find(
      (f) =>
        f.questionId === currentQuestion?.id &&
        f.targetStudentId === selectedStudent.id
    );

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", maxWidth: 600, margin: 'auto' }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          {t("studentPeerFeedback.loading")}
        </Typography>
      </Paper>
    );
  }

  if (!currentGroup) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", maxWidth: 600, margin: 'auto' }}>
        <School sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
        <Typography variant="h5" color="text.primary" gutterBottom>
          {t("studentPeerFeedback.notInGroup")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("studentPeerFeedback.contactInstructor")}
        </Typography>
      </Paper>
    );
  }

  if (!selectedStudent) {
    const feedbackCountFor = (studentId) =>
      completedFeedbacks.filter((f) => f.targetStudentId === studentId).length;

    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <School sx={{ fontSize: 50, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            {t("studentPeerFeedback.title")}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t("studentPeerFeedback.selectStudentSubtitle")}
          </Typography>
        </Box>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {studentsToEvaluate.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
              {t("studentPeerFeedback.none")}
            </Typography>
          ) : (
            studentsToEvaluate.map((student) => {
              const feedbackCount = feedbackCountFor(student.id);
              const isCompleted = feedbackCount > 0; // Only one feedback per student now
              const ratingData = calculateStudentRating(student.id);
              
              return (
                <React.Fragment key={student.id}>
                  <ListItem alignItems="flex-start" disablePadding>
                    <ListItemButton
                      onClick={() => {
                        setPreviewStudent(student);
                        setOpenPreview(true);
                      }}
                      sx={{ 
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        opacity: isCompleted ? 0.7 : 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: isCompleted ? 'success.main' : 'primary.main'
                        }}>
                          {(student.name || '').split(' ').map((n) => n[0]).join('').toUpperCase() || '?'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body1">{student.name}</Typography>
                            <Chip
                              size="small"
                              label={isCompleted ? "Évalué" : "Non évalué"}
                              color={isCompleted ? "success" : "default"}
                              variant={isCompleted ? "filled" : "outlined"}
                            />
                            {ratingData.totalPoints > 0 && (
                              <Chip
                                size="small"
                                label={`${ratingData.rating}/5`}
                                color="warning"
                                variant="filled"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            )}
                          </Box>
                        }
                        secondary={student.email}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              );
            })
          )}
        </List>

        <Box sx={{ height: 350, width: '100%', my: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Étudiants ayant déjà reçu un feedback
          </Typography>
          <DataGrid
            rows={Array.isArray(completedFeedbacks) ? completedFeedbacks.map((f, idx) => {
              const student = studentsToEvaluate.find(s => s.id === f.targetStudentId);
              const emoji = EMOJIS.find(e => e.value === f.reaction);
              
              return {
                id: f && typeof f === 'object' && 'targetStudentId' in f && 'questionId' in f ? `${f.targetStudentId}-${f.questionId}` : idx,
                name: student ? student.name : f.toStudent?.name || '',
                email: student ? student.email : f.toStudent?.email || '',
                emoji: emoji ? emoji.emoji : '',
                emojiLabel: emoji ? t(emoji.labelKey) : '',
                points: emoji ? emoji.points : 0,
              };
            }) : []}
            columns={[
              { field: 'name', headerName: t('studentPeerFeedback.gridName'), flex: 1 },
              { field: 'email', headerName: t('studentPeerFeedback.gridEmail'), flex: 1 },
              { field: 'emoji', headerName: t('studentPeerFeedback.gridEmoji'), width: 80 },
              { field: 'points', headerName: 'Points', width: 80, align: 'center' },
              { field: 'emojiLabel', headerName: t('studentPeerFeedback.gridLabel'), flex: 1 },
            ]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            autoHeight
          />
        </Box>

        <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {(previewStudent?.name || '').split(' ').map((n) => n[0]).join('').toUpperCase() || '?'}
              </Avatar>
              <Box>
                <Typography variant="h6">{previewStudent?.name || ""}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("studentPeerFeedback.previewTitle")}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {questions.map((q, index) => {
                const fb = completedFeedbacks.find(
                  (f) => f.questionId === q.id && f.targetStudentId === previewStudent?.id
                );
                const e = fb ? emojiByValue.get(fb.reaction) : null;
                return (
                  <Grid item xs={12} key={q.id}>
                    <Paper sx={{ p: 2, bgcolor: e ? 'success.light' : 'grey.100' }}>
                      <Typography fontWeight="bold" gutterBottom sx={{ fontSize: '0.9rem' }}>
                        {index + 1}. {q.text}
                      </Typography>
                      {e ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h5">{e.emoji}</Typography>
                          <Typography variant="body2" color="success.dark">
                            {t(e.labelKey)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          {t("studentPeerFeedback.notEvaluated")}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPreview(false)}>
              {t("studentPeerFeedback.close")}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedStudent(previewStudent);
                setOpenPreview(false);
              }}
              startIcon={<EmojiEmotions />}
            >
              {t("studentPeerFeedback.evaluate")}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }

  if (showSummary) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <EmojiEmotions sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" color="success.main" gutterBottom>
            {t("studentPeerFeedback.thanks")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t("studentPeerFeedback.youEvaluated", { name: selectedStudent.name })}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            {t("studentPeerFeedback.summary")}
          </Typography>
          <Grid container spacing={2}>
            {questions.map((q, i) => {
              const fb = completedFeedbacks.find(
                (f) => f.questionId === q.id && f.targetStudentId === selectedStudent.id
              );
              const e = fb ? emojiByValue.get(fb.reaction) : null;
              return (
                <Grid item xs={12} key={q.id}>
                  <Paper sx={{ p: 2, bgcolor: e ? 'success.light' : 'grey.100' }}>
                    <Typography fontWeight="bold" gutterBottom sx={{ fontSize: '0.9rem' }}>
                      {i + 1}. {q.text}
                    </Typography>
                    {e ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5">{e.emoji}</Typography>
                        <Typography variant="body2" color="success.dark">
                          {t(e.labelKey)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {t("studentPeerFeedback.notEvaluated")}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleNextStudent}
            startIcon={<EmojiEmotions />}
          >
            {studentsToEvaluate.findIndex((s) => s.id === selectedStudent.id) <
            studentsToEvaluate.length - 1
              ? t("studentPeerFeedback.nextStudent")
              : t("studentPeerFeedback.finish")}
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 56, height: 56 }}>
            {selectedStudent?.name
              ? selectedStudent.name.split(' ').map((n) => n[0]).join('').toUpperCase()
              : '?'}
          </Avatar>
          <Box textAlign="left">
            <Typography variant="h6">{selectedStudent?.name || ''}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t("studentPeerFeedback.evaluating")}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setSelectedStudent(null)}
          startIcon={<Person />}
          sx={{ mb: 2 }}
        >
          {t("studentPeerFeedback.changeStudent")}
        </Button>
      </Box>

      <Stepper activeStep={currentQuestionIndex} alternativeLabel sx={{ mb: 3 }}>
        {questions.map((q, index) => (
          <Step key={q.id}>
            <StepLabel>{t("studentPeerFeedback.stepQuestion")} {index + 1}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
          {questions[currentQuestionIndex]?.text}
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 600, margin: '0 auto' }}>
          {EMOJIS.map((item) => {
            const isSelected = existingFeedback?.reaction === item.value;
            return (
              <Grid item xs={6} sm={4} md={2.4} key={item.value}>
                <Button
                  fullWidth
                  variant={isSelected ? 'contained' : 'outlined'}
                  color={isSelected ? 'primary' : 'inherit'}
                  onClick={() => handleFeedback(item.value)}
                  sx={{ 
                    fontSize: '2rem', 
                    height: '80px', 
                    mb: 1,
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  {item.emoji}
                </Button>
                <Typography variant="caption" display="block" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {t(item.labelKey)} ({item.points} pts)
                </Typography>
              </Grid>
            );
          })}
        </Grid>

        {existingFeedback && (
          <Box sx={{ textAlign: 'center', mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body1" color="success.dark" fontWeight="bold">
              ✓ {t(emojiByValue.get(existingFeedback.reaction)?.labelKey || "")}
            </Typography>
          </Box>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          {t("studentPeerFeedback.previous")}
        </Button>
        <Button
          variant="contained"
          endIcon={<NavigateNext />}
          onClick={handleNextQuestion}
          disabled={!existingFeedback}
        >
          {currentQuestionIndex === questions.length - 1
            ? t("studentPeerFeedback.finishEvaluation")
            : t("studentPeerFeedback.next")}
        </Button>
      </Box>
    </Paper>
  );
}
