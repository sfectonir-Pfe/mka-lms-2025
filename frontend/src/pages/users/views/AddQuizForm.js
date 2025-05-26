import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AddQuizForm = () => {
  const { contenuId } = useParams();
  const navigate = useNavigate();
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(5);
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "MCQ",
        score: 1,
        negativeMark: 0,
        imageUrl: "",
        correctText: "",
        choices: [{ text: "", isCorrect: false }],
      },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;

    if (field === "type") {
      if (value === "TRUE_FALSE") {
        updated[index].choices = [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: false },
        ];
      } else if (value === "IMAGE_CHOICE") {
        updated[index].choices = [
          { imageUrl: "", isCorrect: false },
          { imageUrl: "", isCorrect: false },
        ];
      } else {
        updated[index].choices = [{ text: "", isCorrect: false }];
      }
    }

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
        timeLimit: timeLimitMinutes * 60,
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
    <Box maxWidth="900px" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        🧠 Créer un quiz
      </Typography>

      {/* Time Limit Field */}
      <TextField
        label="⏱️ Durée totale du quiz (minutes)"
        type="number"
        value={timeLimitMinutes}
        onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value))}
        inputProps={{ min: 1 }}
        sx={{ my: 2 }}
      />

      <Button variant="contained" onClick={addQuestion}>
        ➕ Ajouter une question
      </Button>

      {questions.map((q, qIndex) => (
        <Paper key={qIndex} sx={{ p: 3, mt: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              fullWidth
              label={`Question ${qIndex + 1}`}
              value={q.text}
              onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
              sx={{ mr: 2 }}
            />
            <IconButton color="error" onClick={() => removeQuestion(qIndex)}>
              <DeleteIcon />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={2} mt={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={q.type}
                label="Type"
                onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
              >
                <MenuItem value="MCQ">MCQ</MenuItem>
                <MenuItem value="TRUE_FALSE">True/False</MenuItem>
                <MenuItem value="FILL_BLANK">Fill in the Blank</MenuItem>
                <MenuItem value="IMAGE_CHOICE">Image Choice</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Score"
              type="number"
              value={q.score}
              onChange={(e) => updateQuestion(qIndex, "score", parseInt(e.target.value))}
            />
            <TextField
              label="Negative Mark"
              type="number"
              value={q.negativeMark}
              onChange={(e) => updateQuestion(qIndex, "negativeMark", parseInt(e.target.value))}
            />
          </Stack>

          {/* Question image upload */}
          <Box mt={1}>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const res = await axios.post(
                    "http://localhost:8000/quizzes/upload-question-image",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                  );
                  updateQuestion(qIndex, "imageUrl", res.data.imageUrl);
                } catch (err) {
                  alert("❌ Erreur de téléchargement.");
                }
              }}
            />
          </Box>

          {q.imageUrl && (
            <img
              src={q.imageUrl}
              alt="Preview"
              style={{ maxWidth: "200px", marginTop: "10px", borderRadius: "4px" }}
            />
          )}

          {q.type === "FILL_BLANK" && (
            <TextField
              fullWidth
              label="Bonne réponse attendue"
              value={q.correctText}
              onChange={(e) => updateQuestion(qIndex, "correctText", e.target.value)}
              sx={{ mt: 2 }}
            />
          )}

          {["MCQ", "IMAGE_CHOICE", "TRUE_FALSE"].includes(q.type) && (
            <Stack spacing={1} mt={2}>
              {q.choices.map((choice, cIndex) => (
                <Box key={cIndex} display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  {/* For IMAGE_CHOICE type: upload image */}
                  {q.type === "IMAGE_CHOICE" && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append("file", file);
                          try {
                            const res = await axios.post(
                              "http://localhost:8000/quizzes/upload-question-image",
                              formData,
                              { headers: { "Content-Type": "multipart/form-data" } }
                            );
                            const updated = [...questions];
                            updated[qIndex].choices[cIndex].imageUrl = res.data.imageUrl;
                            setQuestions(updated);
                          } catch (err) {
                            alert("❌ Erreur de téléchargement.");
                          }
                        }}
                      />
                      {choice.imageUrl && (
                        <img
                          src={choice.imageUrl}
                          alt="Choix"
                          style={{ width: "100px", height: "auto", borderRadius: 4 }}
                        />
                      )}
                    </>
                  )}

                  {/* For MCQ or IMAGE_CHOICE: show text input */}
                  {q.type !== "TRUE_FALSE" && (
                    <TextField
                      label={`Choix ${cIndex + 1}`}
                      value={choice.text || ""}
                      onChange={(e) => updateChoiceText(qIndex, cIndex, e.target.value)}
                      fullWidth
                    />
                  )}

                  {/* For TRUE_FALSE: show fixed label instead of editable input */}
                  {q.type === "TRUE_FALSE" && (
                    <Typography sx={{ minWidth: "60px" }}>
                      {choice.text}
                    </Typography>
                  )}

                  {/* Button to mark as correct */}
                  <Button
                    variant={choice.isCorrect ? "contained" : "outlined"}
                    color="success"
                    onClick={() => updateChoiceCorrect(qIndex, cIndex)}
                  >
                    {choice.isCorrect ? "✅ Bonne réponse" : "Marquer correcte"}
                  </Button>
                </Box>
              ))}

              {/* Allow adding more choices (only for non-TF) */}
              {q.type !== "TRUE_FALSE" && (
                <Button onClick={() => addChoice(qIndex)} size="small">
                  ➕ Ajouter un choix
                </Button>
              )}
            </Stack>

          )}
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
