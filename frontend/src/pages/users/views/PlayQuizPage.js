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
import axios from "axios";
import ScoreReveal from "../../../components/ScoreReveal"; 

const PlayQuizPage = () => {
  const { contenuId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [timerExpired, setTimerExpired] = useState(false);
  const [showTimer, setShowTimer] = useState(true);

  // Load questions and quiz time
  useEffect(() => {
    axios
  .get(`http://localhost:8000/quizzes/by-contenu/${contenuId}`)
  .then((res) => {
    const quiz = res.data;
    setQuestions(quiz.questions); // ✅ THIS is the array
    if (quiz.timeLimit) setTimeLeft(quiz.timeLimit);
  });

  }, [contenuId]);

  // Timer countdown
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

  // Select answer
  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit and calculate score
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

    setScore(Math.max(0, earned)); // never negative
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎯 Prendre le Quiz
      </Typography>

      {/* Timer */}
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
  ⏱️ Temps restant :
  {showTimer ? (
    <span style={{ fontWeight: 600 }}>
      {" "}
      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
    </span>
  ) : (
    <span style={{ fontStyle: "italic", fontWeight: 400, opacity: 0.5 }}>
      (masqué)
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
      {showTimer ? "Cacher le timer" : "Afficher le timer"}
    </Button>
  </Box>
)}

    

      {/* Questions */}
      {!timerExpired && questions.map((q, index) => (
        <Paper key={q.id} sx={{ p: 3, mb: 3 }}>
          <Typography fontWeight="bold">
            {index + 1}. {q.text}
          </Typography>

          {q.imageUrl && (
            <img src={q.imageUrl} alt="question" style={{ maxWidth: "100%", marginTop: 10 }} />
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
                          alt={`Choix ${choice.id}`}
                          style={{
                            width: "180px",
                            height: "auto",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            padding: "4px",
                          }}
                        />
                      ) : (
                        choice.text
                      )
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}

          {q.type === "FILL_BLANK" && (
            <TextField
              fullWidth
              label="Votre réponse"
              value={answers[q.id] || ""}
              onChange={(e) => handleSelect(q.id, e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </Paper>
      ))}

      {/* Time expired message */}
      {timerExpired && (
        <Typography color="error" textAlign="center" mt={4}>
          ⛔ Temps écoulé ! Le quiz a été soumis automatiquement.
        </Typography>
      )}

      {/* Submit Button */}
      {questions.length > 0 && score === null && !timerExpired && (
        <Box textAlign="center" mt={3}>
          <Button variant="contained" onClick={handleSubmit}>
            ✅ Soumettre le Quiz
          </Button>
        </Box>
      )}

      {/* Final Score */}
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
