import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Box,
  Paper,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import ScoreReveal from "../../../features/views/quiz/ScoreReveal";
import { getStoredUser } from "../../../utils/authUtils"; 

const PlayQuizPage = () => {
  const { t } = useTranslation();
  const { contenuId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [totalPossible, setTotalPossible] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    // Get current user
    const currentUser = getStoredUser();
    if (!currentUser) {
      setError("Please log in to take the quiz");
      return;
    }
    setUser(currentUser);

    // Load quiz data
    api
      .get(`/quizzes/by-contenu/${contenuId}`)
      .then((res) => {
        const quizData = res.data;
        setQuiz(quizData);
        setQuestions(quizData.questions);
        
        // Calculate total possible score
        const total = quizData.questions.reduce((sum, q) => sum + (q.score || 1), 0);
        setTotalPossible(total);
        
        if (quizData.timeLimit) setTimeLeft(quizData.timeLimit);
      })
      .catch((err) => {
        console.error("Failed to load quiz:", err);
        setError("Failed to load quiz. Please try again.");
      });
  }, [contenuId]);


  useEffect(() => {
    if (timeLeft === null || score !== null) return;

    if (timeLeft <= 0) {
      setTimerExpired(true);
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score]);


  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };


  const handleSubmit = async () => {
    if (!user || !quiz) {
      setError("Missing user or quiz data");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare answers in the format expected by the backend
      const formattedAnswers = questions.map((q) => {
        const userAnswer = answers[q.id];
        
        if (q.type === "FILL_BLANK") {
          return {
            questionId: q.id,
            textAnswer: userAnswer || ""
          };
        } else {
          return {
            questionId: q.id,
            selectedId: userAnswer ? parseInt(userAnswer) : null
          };
        }
      });

      // Submit to backend
      const response = await api.post(`/quizzes/by-contenu/${contenuId}/submit`, {
        userId: user.id,
        answers: formattedAnswers
      });

      // Set score from backend response
      setScore(response.data.score);
      setTotalPossible(response.data.totalPossible);
      
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎯 {t('quiz.takeQuiz')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}


      {timeLeft !== null && (
  <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} mb={2}>
   <Typography
  variant="subtitle1"
  sx={{
    // backgroundColor: timeLeft <= 30 ? "#ffe6e6" : "#e3f2fd",
    color: timeLeft <= 30 ? "#d32f2f" : "#1976d2",
    px: 2,
    py: 1,
    borderRadius: "12px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "6px"
  }}
>
  ⏱️ {t('quiz.timeRemaining')}:
  {showTimer ? (
    <span style={{ fontWeight: 600 }}>
      {" "}
      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
    </span>
  ) : (
    <span style={{ fontStyle: "italic", fontWeight: 400, opacity: 0.5 }}>
      ({t('quiz.hidden')})
    </span>
  )}
</Typography>


    <Button
      variant="text"
      size="small"
      onClick={() => setShowTimer((prev) => !prev)}
      sx={{
        color: "#1976d2",
        textTransform: "none",
        fontWeight: 500,
        fontSize: "14px"
      }}
      startIcon={<span>{showTimer ? "🐵" : "🙈"}</span>}
    >
      {showTimer ? t('quiz.hideTimer') : t('quiz.showTimer')}
    </Button>
  </Box>
)}

    


      {!timerExpired && questions.map((q, index) => (
       <Paper
  key={q.id}
  elevation={3}
  sx={{
    p: 4,
    mb: 4,
    borderRadius: 3,
    // backgroundColor: "#fafafa",
    borderLeft: "5px solid #1976d2",
  }}
>
  <Typography variant="h6" fontWeight="bold" mb={1}>
    🧠 {t('quiz.question')} {index + 1}
  </Typography>

  <Typography variant="subtitle1" mb={2}>
    {q.text}
  </Typography>

  {q.imageUrl && (
    <Box textAlign="center" mb={2}>
      <img
        src={q.imageUrl}
        alt={t('quiz.questionImage')}
        style={{ maxWidth: "100%", borderRadius: 8 }}
      />
    </Box>
  )}

  {["MCQ", "TRUE_FALSE", "IMAGE_CHOICE"].includes(q.type) && (
    <FormControl component="fieldset">
      <RadioGroup
        value={answers[q.id] || ""}
        onChange={(e) => handleSelect(q.id, e.target.value)}
      >
        {q.choices.map((choice) => (
          <FormControlLabel
            key={choice.id}
            value={choice.id.toString()}
            control={<Radio />}
            label={
              q.type === "IMAGE_CHOICE" ? (
                <img
                  src={choice.imageUrl}
                  alt={`${t('quiz.choice')} ${choice.id}`}
                  style={{
                    width: "180px",
                    borderRadius: 8,
                    border: "2px solid #ccc",
                    padding: "4px",
                  }}
                />
              ) : (
                choice.text
              )
            }
            sx={{
              // backgroundColor:
                // answers[q.id] === choice.id.toString() ? "#e3f2fd" : "transparent",
              borderRadius: 2,
              px: 2,
              my: 1,
              transition: "0.2s",
              "&:hover": {
                // backgroundColor: "#f0f7ff",
              },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )}

  {q.type === "FILL_BLANK" && (
    <TextField
      fullWidth
      label={t('quiz.yourAnswer')}
      value={answers[q.id] || ""}
      onChange={(e) => handleSelect(q.id, e.target.value)}
      sx={{ mt: 2 }}
    />
  )}
</Paper>

      ))}


      {timerExpired && (
        <Typography color="error" textAlign="center" mt={4}>
          ⛔ {t('quiz.timeExpired')}
        </Typography>
      )}


      {questions.length > 0 && score === null && !timerExpired && (
        <Box textAlign="center" mt={3}>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? t('quiz.submitting') || 'Submitting...' : `✅ ${t('quiz.submitQuiz')}`}
          </Button>
        </Box>
      )}


     {score !== null && (
  <ScoreReveal
    score={score}
    total={totalPossible}
    quizId={quiz?.id}
    contenuId={contenuId}
  />
)}

    </Container>
  );
};

export default PlayQuizPage;
