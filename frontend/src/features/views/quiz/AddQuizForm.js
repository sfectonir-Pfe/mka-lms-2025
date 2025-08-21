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
  Divider,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import api from "../../../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AddQuizForm = ({
  contenuId: propContenuId,
  initialTimeLimit = 5,
  initialQuestions = [],
  editMode = false,
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const contenuId = propContenuId || params.contenuId;
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(initialTimeLimit);
  const [questions, setQuestions] = useState(initialQuestions);


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
        const res = await api.post(
          "/quizzes/upload-question-image",
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
        const res = await api.post(
          "/quizzes/upload-question-image",
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
    const endpoint = editMode
      ? `/quizzes/by-contenu/${contenuId}`
      : `/quizzes`;

    const method = editMode ? api.patch : api.post;

    await method(endpoint, {
      contenuId: parseInt(contenuId),
      timeLimit: timeLimitMinutes * 60,
      questions,
    });

    alert(editMode ? t('quiz.quizUpdatedSuccess') : t('quiz.quizCreatedSuccess'));
    navigate("/contenus");
  } catch (err) {
    console.error(t('quiz.submitError'), err);
    alert(t('quiz.submitError'));
  }
};

  return (
    <Box maxWidth="900px" mx="auto" mt={4} pb={8}>
      <Typography variant="h4" gutterBottom>
        🧠 {t('quiz.createQuiz')}
      </Typography>

      {questions.map((q, qIndex) => (
        <Paper key={qIndex} sx={{ p: 3, mt: 3, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{t('quiz.question')} {qIndex + 1}</Typography>
            <IconButton color="error" onClick={() => removeQuestion(qIndex)}>
              <DeleteIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label={t('quiz.questionText')}
            value={q.text}
            onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
            sx={{ my: 2 }}
          />

          <Stack direction="row" spacing={2} mt={2}>
            <FormControl fullWidth>
              <InputLabel>{t('quiz.type')}</InputLabel>
              <Select
                value={q.type}
                label="Type"
                onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
              >
                <MenuItem value="MCQ">{t('quiz.mcq')}</MenuItem>
                <MenuItem value="TRUE_FALSE">{t('quiz.trueFalse')}</MenuItem>
                <MenuItem value="FILL_BLANK">{t('quiz.fillBlank')}</MenuItem>
                <MenuItem value="IMAGE_CHOICE">{t('quiz.imageChoice')}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={t('quiz.score')}
              type="number"
              value={q.score}
              onChange={(e) => updateQuestion(qIndex, "score", parseInt(e.target.value))}
            />

            <Button onClick={() => handleImageUpload(qIndex)}>
              📤 {t('quiz.addImage')}
            </Button>
          </Stack>

          {q.imageUrl && (
            <Box mt={2}>
              <img
                src={q.imageUrl}
                alt="Question"
                style={{ maxWidth: "100%", borderRadius: 6 }}
              />
            </Box>
          )}

          {q.type === "FILL_BLANK" && (
            <TextField
              fullWidth
              label={t('quiz.correctAnswer')}
              value={q.correctText}
              onChange={(e) => updateQuestion(qIndex, "correctText", e.target.value)}
              sx={{ mt: 2 }}
            />
          )}

          {q.type !== "FILL_BLANK" && (
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                {t('quiz.answerChoices')} :
              </Typography>
              <Stack spacing={1}>
                {q.choices.map((choice, cIndex) => (
                  <Box
                    key={cIndex}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    flexWrap="wrap"
                  >
                    <TextField
                      label={`${t('quiz.choice')} ${cIndex + 1}`}
                      value={choice.text || ""}
                      onChange={(e) => updateChoiceText(qIndex, cIndex, e.target.value)}
                      fullWidth
                    />

                    {q.type === "IMAGE_CHOICE" && (
                      <Button
                        size="small"
                        onClick={() => updateChoiceImage(qIndex, cIndex)}
                      >
📸 {t('quiz.addChoiceImage')}
                      </Button>
                    )}

                    {choice.imageUrl && (
                      <img
                        src={choice.imageUrl}
                        alt="Choix"
                        style={{ width: "100px", height: "auto", borderRadius: 4 }}
                      />
                    )}

                    <Button
                      variant={choice.isCorrect ? "contained" : "outlined"}
                      color="success"
                      onClick={() => updateChoiceCorrect(qIndex, cIndex)}
                    >
                      {choice.isCorrect ? `✅ ${t('quiz.correctChoice')}` : t('quiz.markCorrect')}
                    </Button>

                    <Tooltip title={t('quiz.deleteChoice')}>
                      <IconButton color="error" onClick={() => removeChoice(qIndex, cIndex)}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Stack>
              {q.type !== "TRUE_FALSE" && (
                <Button onClick={() => addChoice(qIndex)} size="small" sx={{ mt: 1 }}>
➕ {t('quiz.addChoice')}
                </Button>
              )}
            </Box>
          )}
        </Paper>
      ))}

      <Divider sx={{ my: 4 }} />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="sticky"
        bottom={0}
        bgcolor="white"
        py={2}
        px={1}
        borderTop={"1px solid #ccc"}
      >
        <TextField
          label={`⏱️ ${t('quiz.duration')}`}
          type="number"
          value={timeLimitMinutes}
          onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value))}
          inputProps={{ min: 1 }}
        />

        <Box display="flex" gap={2}>
          <Button variant="outlined" color="secondary" onClick={addQuestion}>
            ➕ {t('quiz.addQuestion')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            💾 {t('quiz.saveQuiz')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddQuizForm;
