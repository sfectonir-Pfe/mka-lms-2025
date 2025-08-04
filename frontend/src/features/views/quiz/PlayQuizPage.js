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
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import ScoreReveal from "../../../features/views/quiz/ScoreReveal"; 

const PlayQuizPage = () => {
  const { t } = useTranslation();
  const { contenuId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [showTimer, setShowTimer] = useState(true);


  useEffect(() => {
    axios
  .get(`http://localhost:8000/quizzes/by-contenu/${contenuId}`)
  .then((res) => {
    const quiz = res.data;
    setQuestions(quiz.questions);
    if (quiz.timeLimit) setTimeLeft(quiz.timeLimit);
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


  const handleSubmit = () => {
    let total = 0;
    let earned = 0;

    questions.forEach((q) => {
      const ans = answers[q.id];
      total += q.score;

      if (q.type === "FILL_BLANK") {
        if (ans && ans.trim().toLowerCase() === q.correctText?.trim().toLowerCase()) {
          earned += q.score;
        } else {
          earned -= q.negativeMark || 0;
        }
      } else {
        const correct = q.choices.find((c) => c.isCorrect);
        if (parseInt(ans) === correct?.id) {
          earned += q.score;
        } else {
          earned -= q.negativeMark || 0;
        }
      }
    });

    setScore(Math.max(0, earned));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎯 {t('quiz.takeQuiz')}
      </Typography>


      {timeLeft !== null && (
  <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} mb={2}>
   <Typography
  variant="subtitle1"
  sx={{
    backgroundColor: timeLeft <= 30 ? "#ffe6e6" : "#e3f2fd",
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
    backgroundColor: "#fafafa",
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
              backgroundColor:
                answers[q.id] === choice.id.toString() ? "#e3f2fd" : "transparent",
              borderRadius: 2,
              px: 2,
              my: 1,
              transition: "0.2s",
              "&:hover": {
                backgroundColor: "#f0f7ff",
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
          <Button variant="contained" onClick={handleSubmit}>
            ✅ {t('quiz.submitQuiz')}
          </Button>
        </Box>
      )}


     {score !== null && (
  <ScoreReveal
    score={score}
    total={questions.reduce((sum, q) => sum + q.score, 0)}
  />
)}

    </Container>
  );
};

export default PlayQuizPage;
