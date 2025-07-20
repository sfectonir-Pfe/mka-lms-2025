import React, { useState, useEffect } from "react";
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
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const EditQuizForm = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const { contenuId } = params;

  const [loading, setLoading] = useState(true);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(5);
  const [questions, setQuestions] = useState([]);

  // Charger le quiz existant
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/quizzes/by-contenu/${contenuId}`);
        const quiz = response.data;
        
        if (quiz) {
          setTimeLimitMinutes(Math.floor(quiz.timeLimit / 60));
          setQuestions(quiz.questions || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du quiz:', error);
        alert(t('quiz.loadError'));
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [contenuId, t]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "MCQ",
        score: 1,
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
          { text: t('quiz.true'), isCorrect: false },
          { text: t('quiz.false'), isCorrect: false },
        ];
      } else if (value === "IMAGE_CHOICE") {
        updated[index].choices = [
          { text: "", imageUrl: "", isCorrect: false },
          { text: "", imageUrl: "", isCorrect: false },
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

  const updateChoiceImage = async (qIndex, cIndex) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
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
        alert(t('quiz.imageUploadError'));
      }
    };
    input.click();
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

  const removeChoice = (qIndex, cIndex) => {
    const updated = [...questions];
    updated[qIndex].choices.splice(cIndex, 1);
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleImageUpload = async (qIndex) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
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
        updated[qIndex].imageUrl = res.data.imageUrl;
        setQuestions(updated);
      } catch (err) {
        alert(t('quiz.imageUploadError'));
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    // ✅ Validate first
    for (const [i, q] of questions.entries()) {
      if (!q.text.trim()) {
        alert(`❌ ${t('quiz.questionRequired')} ${i + 1}.`);
        return;
      }

      if (q.type !== "FILL_BLANK" && !q.choices.some((c) => c.isCorrect)) {
        alert(`❌ ${t('quiz.correctAnswerRequired')} ${i + 1}.`);
        return;
      }

      if (q.type !== "FILL_BLANK" && q.choices.some((c) => !c.text.trim() && !c.imageUrl)) {
        alert(`❌ ${t('quiz.choiceTextRequired')} ${i + 1}.`);
        return;
      }

      if (q.type === "FILL_BLANK" && !q.correctText.trim()) {
        alert(`❌ ${t('quiz.fillBlankAnswerRequired')} ${i + 1}.`);
        return;
      }
    }

    // ✅ Submit after validation
    try {
      await axios.patch(`http://localhost:8000/quizzes/by-contenu/${contenuId}`, {
        contenuId: parseInt(contenuId),
        timeLimit: timeLimitMinutes * 60,
        questions,
      });

      alert(t('quiz.quizUpdatedSuccess'));
      navigate("/contenus");
    } catch (err) {
      console.error(t('quiz.submitError'), err);
      alert(t('quiz.submitError'));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ✏️ {t('quiz.editQuiz')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            type="number"
            label={t('quiz.timeLimit')}
            value={timeLimitMinutes}
            onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value) || 0)}
            sx={{ width: 150 }}
          />
          <Typography variant="body2" color="text.secondary">
            {t('quiz.minutes')}
          </Typography>
        </Stack>
      </Paper>

      {questions.map((question, qIndex) => (
        <Paper key={qIndex} sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {t('quiz.question')} {qIndex + 1}
            </Typography>
            <IconButton
              onClick={() => removeQuestion(qIndex)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label={t('quiz.questionText')}
              value={question.text}
              onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
              multiline
              rows={2}
            />

            <FormControl fullWidth>
              <InputLabel>{t('quiz.questionType')}</InputLabel>
              <Select
                value={question.type}
                onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                label={t('quiz.questionType')}
              >
                <MenuItem value="MCQ">{t('quiz.multipleChoice')}</MenuItem>
                <MenuItem value="TRUE_FALSE">{t('quiz.trueFalse')}</MenuItem>
                <MenuItem value="FILL_BLANK">{t('quiz.fillBlank')}</MenuItem>
                <MenuItem value="IMAGE_CHOICE">{t('quiz.imageChoice')}</MenuItem>
              </Select>
            </FormControl>

            {question.type === "FILL_BLANK" ? (
              <TextField
                fullWidth
                label={t('quiz.correctAnswer')}
                value={question.correctText}
                onChange={(e) => updateQuestion(qIndex, "correctText", e.target.value)}
              />
            ) : (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {t('quiz.choices')}:
                </Typography>
                {question.choices.map((choice, cIndex) => (
                  <Stack key={cIndex} direction="row" spacing={1} alignItems="center" mb={1}>
                    <Button
                      variant={choice.isCorrect ? "contained" : "outlined"}
                      onClick={() => updateChoiceCorrect(qIndex, cIndex)}
                      size="small"
                    >
                      {choice.isCorrect ? "✓" : "○"}
                    </Button>
                    <TextField
                      value={choice.text}
                      onChange={(e) => updateChoiceText(qIndex, cIndex, e.target.value)}
                      placeholder={t('quiz.choiceText')}
                      sx={{ flexGrow: 1 }}
                    />
                    {question.type === "IMAGE_CHOICE" && (
                      <Button
                        variant="outlined"
                        onClick={() => updateChoiceImage(qIndex, cIndex)}
                        size="small"
                      >
                        {choice.imageUrl ? t('quiz.changeImage') : t('quiz.addImage')}
                      </Button>
                    )}
                    {question.choices.length > 1 && (
                      <IconButton
                        onClick={() => removeChoice(qIndex, cIndex)}
                        color="error"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </Stack>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addChoice(qIndex)}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  + {t('quiz.addChoice')}
                </Button>
              </Box>
            )}

            {question.type !== "IMAGE_CHOICE" && (
              <Button
                variant="outlined"
                onClick={() => handleImageUpload(qIndex)}
                size="small"
              >
                {question.imageUrl ? t('quiz.changeQuestionImage') : t('quiz.addQuestionImage')}
              </Button>
            )}
          </Stack>
        </Paper>
      ))}

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={addQuestion}>
          + {t('quiz.addQuestion')}
        </Button>
        <Button variant="outlined" onClick={() => navigate("/contenus")}>
          {t('common.cancel')}
        </Button>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={questions.length === 0}
        size="large"
      >
        💾 {t('quiz.updateQuiz')}
      </Button>
    </Box>
  );
};

export default EditQuizForm; 