import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AddQuizForm = () => {
  const { contenuId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", choices: [{ text: "", isCorrect: false }] }]);
  };

  const updateQuestionText = (index, text) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  };

  const updateChoiceText = (qIndex, cIndex, text) => {
    const updated = [...questions];
    updated[qIndex].choices[cIndex].text = text;
    setQuestions(updated);
  };

  const updateChoiceCorrect = (qIndex, cIndex) => {
    const updated = [...questions];
    updated[qIndex].choices = updated[qIndex].choices.map((c, i) => ({
      ...c,
      isCorrect: i === cIndex,
    }));
    setQuestions(updated);
  };

  const addChoice = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].choices.push({ text: "", isCorrect: false });
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/quizzes", {
        contenuId: parseInt(contenuId),
        questions,
      });
      alert("✅ Quiz créé avec succès !");
      navigate("/contenus");
    } catch (err) {
      console.error("Erreur création quiz", err);
      alert("❌ Échec de création du quiz.");
    }
  };

  return (
    <Box maxWidth="800px" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        🧠 Créer un quiz
      </Typography>
      <Button variant="contained" onClick={addQuestion}>
        ➕ Ajouter une question
      </Button>

      {questions.map((q, qIndex) => (
        <Paper key={qIndex} sx={{ p: 2, mt: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              fullWidth
              label={`Question ${qIndex + 1}`}
              value={q.text}
              onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              sx={{ mr: 2 }}
            />
            <IconButton color="error" onClick={() => removeQuestion(qIndex)}>
              <DeleteIcon />
            </IconButton>
          </Box>

          <Stack spacing={1} mt={2}>
            {q.choices.map((choice, cIndex) => (
              <Box key={cIndex} display="flex" alignItems="center" gap={2}>
                <TextField
                  label={`Choix ${cIndex + 1}`}
                  value={choice.text}
                  onChange={(e) => updateChoiceText(qIndex, cIndex, e.target.value)}
                  fullWidth
                />
                <Button
                  variant={choice.isCorrect ? "contained" : "outlined"}
                  color="success"
                  onClick={() => updateChoiceCorrect(qIndex, cIndex)}
                >
                  {choice.isCorrect ? "✅ Bonne réponse" : "Marquer correcte"}
                </Button>
              </Box>
            ))}
          </Stack>

          <Box mt={2}>
            <Button onClick={() => addChoice(qIndex)} size="small">
              ➕ Ajouter un choix
            </Button>
          </Box>
        </Paper>
      ))}

      <Box textAlign="right" mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          💾 Enregistrer le quiz
        </Button>
      </Box>
    </Box>
  );
};

export default AddQuizForm;
