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
  Paper
} from "@mui/material";
import axios from "axios";

const PlayQuizPage = () => {
  const { contenuId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/quizzes/by-contenu/${contenuId}`)
      .then((res) => setQuestions(res.data))
      .catch((err) => {
        console.error("Erreur chargement quiz", err);
        alert("Erreur lors du chargement du quiz.");
      });
  }, [contenuId]);

  const handleSelect = (questionId, choiceId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      const selectedId = answers[q.id];
      const correctChoice = q.choices.find((c) => c.id === selectedId);
      if (correctChoice?.isCorrect) correct++;
    });
    setScore(correct);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎯 Prendre le Quiz
      </Typography>

      {questions.map((q, index) => (
        <Paper key={q.id} sx={{ p: 3, mb: 3 }}>
          <Typography fontWeight="bold">
            {index + 1}. {q.text}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={answers[q.id] || ""}
              onChange={(e) => handleSelect(q.id, parseInt(e.target.value))}
            >
              {q.choices.map((choice) => (
                <FormControlLabel
                  key={choice.id}
                  value={choice.id}
                  control={<Radio />}
                  label={choice.text}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      ))}

      {questions.length > 0 && (
        <Box textAlign="center" mt={3}>
          <Button variant="contained" onClick={handleSubmit}>
            Soumettre
          </Button>
        </Box>
      )}

      {score !== null && (
        <Typography variant="h5" color="primary" mt={4} textAlign="center">
          ✅ Votre score : {score} / {questions.length}
        </Typography>
      )}
    </Container>
  );
};

export default PlayQuizPage;
