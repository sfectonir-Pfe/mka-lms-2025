// src/features/views/feedback/feedbackForm/FeedbackEtudiant.js
import React, { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import api from "../../../../api/axiosInstance";

const EMOJIS = [
  { emoji: "🤨", value: "poor", labelKey: "studentPeerFeedback.emojis.poor" },
  { emoji: "😐", value: "average", labelKey: "studentPeerFeedback.emojis.average" },
  { emoji: "🙂", value: "good", labelKey: "studentPeerFeedback.emojis.good" },
  { emoji: "😃", value: "very_good", labelKey: "studentPeerFeedback.emojis.very_good" },
  { emoji: "🤩", value: "excellent", labelKey: "studentPeerFeedback.emojis.excellent" },
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
  }, [seanceId, t]);

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((p) => p + 1);
    } else {
      setShowSummary(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousQuestion = () => {
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentGroup) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          {t("studentPeerFeedback.notInGroup")}
        </Typography>
      </Paper>
    );
  }

  if (!selectedStudent) {
    const feedbackCountFor = (studentId) =>
      completedFeedbacks.filter((f) => f.targetStudentId === studentId).length;

    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          {t("studentPeerFeedback.title")}
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={80}>{t("studentPeerFeedback.id")}</TableCell>
                <TableCell>{t("studentPeerFeedback.studentName")}</TableCell>
                <TableCell>{t("studentPeerFeedback.studentEmail")}</TableCell>
                <TableCell align="right">{t("studentPeerFeedback.givenCount")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentsToEvaluate.map((s) => (
                <TableRow
                  hover
                  key={s.id}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setPreviewStudent(s);
                    setOpenPreview(true);
                  }}
                >
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={feedbackCountFor(s.id)}
                      color={feedbackCountFor(s.id) > 0 ? "primary" : "default"}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {studentsToEvaluate.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t("studentPeerFeedback.none")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {t("studentPeerFeedback.previewTitle", { name: previewStudent?.name || "" })}
          </DialogTitle>
          <DialogContent dividers>
            {questions.map((q) => {
              const fb = completedFeedbacks.find(
                (f) => f.questionId === q.id && f.targetStudentId === previewStudent?.id
              );
              const e = fb ? emojiByValue.get(fb.reaction) : null;
              return (
                <Box key={q.id} mb={2}>
                  <Typography fontWeight="bold" gutterBottom>
                    {q.text}
                  </Typography>
                  {e ? (
                    <Typography variant="h6">
                      {e.emoji} {t(e.labelKey)}
                    </Typography>
                  ) : (
                    <Typography color="text.secondary">{t("studentPeerFeedback.notEvaluated")}</Typography>
                  )}
                  <Divider sx={{ mt: 1 }} />
                </Box>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPreview(false)}>{t("studentPeerFeedback.close")}</Button>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedStudent(previewStudent);
                setOpenPreview(false);
              }}
            >
              {t("studentPeerFeedback.evaluate")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  if (showSummary) {
    return (
      <Box p={3}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {t("studentPeerFeedback.thanks")}
          </Typography>
          <Typography>{t("studentPeerFeedback.youEvaluated", { name: selectedStudent.name })}</Typography>

          <Box mt={3}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t("studentPeerFeedback.summary")}
            </Typography>
            {questions.map((q, i) => {
              const fb = completedFeedbacks.find(
                (f) => f.questionId === q.id && f.targetStudentId === selectedStudent.id
              );
              const e = fb ? emojiByValue.get(fb.reaction) : null;
              return (
                <Box key={q.id} mb={2}>
                  <Typography fontWeight="bold">{q.text}</Typography>
                  <Box mt={1}>
                    {e ? (
                      <Typography variant="h6">
                        {e.emoji} {t(e.labelKey)}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary">{t("studentPeerFeedback.notEvaluated")}</Typography>
                    )}
                  </Box>
                  {i < questions.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              );
            })}
          </Box>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleNextStudent}>
              {studentsToEvaluate.findIndex((s) => s.id === selectedStudent.id) <
              studentsToEvaluate.length - 1
                ? t("studentPeerFeedback.nextStudent")
                : t("studentPeerFeedback.finish")}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Stepper activeStep={currentQuestionIndex} alternativeLabel sx={{ mb: 3 }}>
        {questions.map((q) => (
          <Step key={q.id}>
            <StepLabel>{t("studentPeerFeedback.stepQuestion")}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
            {selectedStudent.name?.charAt(0) || "?"}
          </Avatar>
        </Box>

        <Typography variant="h6" fontWeight="bold" mb={2}>
          {questions[currentQuestionIndex]?.text}
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
          {EMOJIS.map((item) => {
            const isSelected = existingFeedback?.reaction === item.value;
            return (
              <IconButton
                key={item.value}
                onClick={() => handleFeedback(item.value)}
                sx={{
                  fontSize: "3rem",
                  p: 2,
                  backgroundColor: isSelected ? "#1976d2" : "#f5f5f5",
                  color: isSelected ? "white" : "inherit",
                  border: "2px solid #e0e0e0",
                  borderRadius: "50%",
                  "&:hover": {
                    transform: "scale(1.1)",
                    transition: "transform 0.2s",
                    backgroundColor: isSelected ? "#1565c0" : "#eeeeee",
                  },
                }}
              >
                {item.emoji}
              </IconButton>
            );
          })}
        </Stack>

        {existingFeedback && (
          <Typography
            variant="body1"
            align="center"
            mt={2}
            color="primary.main"
            fontWeight="bold"
          >
            {t(emojiByValue.get(existingFeedback.reaction)?.labelKey || "")}
          </Typography>
        )}
      </Paper>

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
    </Box>
  );
}
