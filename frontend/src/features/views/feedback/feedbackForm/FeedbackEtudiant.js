// src/features/views/feedback/feedbackForm/FeedbackEtudiant.js
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
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
import axios from "axios";

const API_BASE = "http://localhost:8000/feedback-etudiant";

const EMOJIS = [
  { emoji: "🤨", value: "poor", label: "Peu participatif" },
  { emoji: "😐", value: "average", label: "Participait parfois" },
  { emoji: "🙂", value: "good", label: "Bonne participation" },
  { emoji: "😃", value: "very_good", label: "Très participatif" },
  { emoji: "🤩", value: "excellent", label: "Exceptionnel" },
];

export default function FeedbackEtudiant() {
  const { id: seanceId } = useParams();

  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [studentsToEvaluate, setStudentsToEvaluate] = useState([]);

  // feedbacks GIVEN BY the current user (for this group)
  // {questionId, targetStudentId, reaction, toStudent?}
  const [completedFeedbacks, setCompletedFeedbacks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // dialog to preview a student's feedback before evaluating
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
          name: user.name || "Étudiant",
          email: user.email || "etudiant@test.com",
        });

        const groupRes = await axios.get(
          `${API_BASE}/groups/student/${currentUserId}/seance/${seanceId}`
        );
        if (!groupRes.data) {
          setCurrentGroup(null);
          return;
        }
        const group = groupRes.data;
        setCurrentGroup(group);

        const questionsRes = await axios.get(
          `${API_BASE}/questions/group/${group.id}`,
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

        // load existing feedbacks GIVEN BY current user in this group
        const givenRes = await axios.get(
          `${API_BASE}/feedbacks/group/${group.id}/student/${currentUserId}`
        );
        const given = Array.isArray(givenRes.data) ? givenRes.data : [];
        setCompletedFeedbacks(
          given.map((f) => ({
            questionId: f.questionId,
            targetStudentId: f.targetStudentId,
            reaction: f.reaction,
            toStudent: f.toStudent,
          }))
        );
      } catch (err) {
        console.error("Erreur chargement données:", err);
      } finally {
        setLoading(false);
      }
    };

    if (seanceId) fetchAll();
  }, [seanceId]);

  const handleFeedback = async (reaction) => {
    try {
      if (!selectedStudent) return;
      const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user")) || { id: 3 };
      const currentUserId = user.id;
      const q = questions[currentQuestionIndex];
      if (!q) return;

      await axios.post(`${API_BASE}/feedbacks`, {
        questionId: q.id,
        studentId: currentUserId,
        targetStudentId: selectedStudent.id,
        reaction,
        groupId: currentGroup.id,
        seanceId,
      });
// put this above handleFeedback
const refreshGivenFeedbacks = async (groupId, currentUserId) => {
  const givenRes = await axios.get(
    `${API_BASE}/feedbacks/group/${groupId}/student/${currentUserId}`
  );
  const given = Array.isArray(givenRes.data) ? givenRes.data : [];
  setCompletedFeedbacks(
    given.map((f) => ({
      questionId: f.questionId,
      targetStudentId: f.targetStudentId,
      reaction: f.reaction,
      toStudent: f.toStudent,
    }))
  );
};

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

  const handleNextStudent = () => {
    if (!selectedStudent) return;
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
          Vous n'êtes pas dans un groupe pour cette séance.
        </Typography>
      </Paper>
    );
  }

  // ========== TABLE SCREEN ==========
  if (!selectedStudent) {
    const feedbackCountFor = (studentId) =>
      completedFeedbacks.filter((f) => f.targetStudentId === studentId).length;

    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Étudiants à évaluer
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={80}>id</TableCell>
                <TableCell>studentName</TableCell>
                <TableCell>studentEmail</TableCell>
                <TableCell align="right">Feedbacks donnés</TableCell>
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
                    Aucun étudiant
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Preview dialog */}
        <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Feedback de {previewStudent?.name}
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
                      {e.emoji} {e.label}
                    </Typography>
                  ) : (
                    <Typography color="text.secondary">Non évalué</Typography>
                  )}
                  <Divider sx={{ mt: 1 }} />
                </Box>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPreview(false)}>Fermer</Button>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedStudent(previewStudent);
                setOpenPreview(false);
              }}
            >
              Évaluer / Continuer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // ========== SUMMARY ==========
  if (showSummary) {
    return (
      <Box p={3}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Merci pour vos feedbacks !
          </Typography>
          <Typography>Vous avez évalué {selectedStudent.name}.</Typography>

          <Box mt={3}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Récapitulatif
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
                        {e.emoji} {e.label}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary">Non évalué</Typography>
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
                ? "Évaluer le prochain étudiant"
                : "Terminer"}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // ========== QUESTION FLOW ==========
  return (
    <Box p={3}>
      <Stepper activeStep={currentQuestionIndex} alternativeLabel sx={{ mb: 3 }}>
        {questions.map((q) => (
          <Step key={q.id}>
            <StepLabel>Question</StepLabel>
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
            {emojiByValue.get(existingFeedback.reaction)?.label}
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
          Précédent
        </Button>
        <Button
          variant="contained"
          endIcon={<NavigateNext />}
          onClick={handleNextQuestion}
          disabled={!existingFeedback}
        >
          {currentQuestionIndex === questions.length - 1
            ? "Terminer l'évaluation"
            : "Suivant"}
        </Button>
      </Box>
    </Box>
  );
}
