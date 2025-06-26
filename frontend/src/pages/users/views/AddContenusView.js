import React, { useState } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";

const AddContenusView = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Cours");
  const [fileType, setFileType] = useState("PDF");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert(t('content.titleRequired'));
    if (type !== "Quiz" && !file) return alert(t('content.fileRequired'));

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);

    if (type !== "Quiz") {
      formData.append("file", file);
      formData.append("fileType", fileType);
    }

    try {
      const res = await axios.post("http://localhost:8000/contenus/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newContenu = res.data;
      if (type === "Quiz") {
        navigate(`/quizzes/create/${newContenu.id}`);
      } else {
        navigate("/contenus");
      }
    } catch (err) {
      console.error("❌ Erreur ajout contenu :", err);
      alert(t('content.saveError'));
    }
  };

  return (
  <Container maxWidth="sm">
    <Typography variant="h5" mt={4} mb={2}>
      {t('content.addContent')}
    </Typography>

    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label={t('common.title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        select
        fullWidth
        label={t('content.contentType')}
        value={type}
        onChange={(e) => setType(e.target.value)}
        margin="normal"
      >
        <MenuItem value="Cours">{t('content.course')}</MenuItem>
        <MenuItem value="Exercice">{t('content.exercise')}</MenuItem>
        <MenuItem value="Quiz">{t('content.quiz')}</MenuItem>
      </TextField>

      {type !== "Quiz" && (
        <>
          <TextField
            select
            fullWidth
            label={t('content.fileType')}
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            margin="normal"
          >
            <MenuItem value="PDF">PDF</MenuItem>
            <MenuItem value="IMAGE">{t('content.image')}</MenuItem>
            <MenuItem value="VIDEO">{t('content.video')}</MenuItem>
            <MenuItem value="WORD">Word (.docx)</MenuItem>
            <MenuItem value="EXCEL">Excel (.xlsx)</MenuItem>
            <MenuItem value="PPT">PowerPoint (.pptx)</MenuItem>
          </TextField>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            📎 {t('content.chooseFile')} {fileType && `(${fileType})`}
            <input
              hidden
              type="file"
              accept={
                fileType === "PDF"
                  ? ".pdf"
                  : fileType === "IMAGE"
                  ? "image/*"
                  : fileType === "VIDEO"
                  ? "video/*"
                  : fileType === "WORD"
                  ? ".doc,.docx"
                  : fileType === "EXCEL"
                  ? ".xls,.xlsx"
                  : fileType === "PPT"
                  ? ".ppt,.pptx"
                  : "*"
              }
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Typography variant="caption" color="text.secondary" mt={1}>
              {t('content.selectedFile')}: {file.name}
            </Typography>
          )}
        </>
      )}

      {type === "Quiz" && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('content.quizNote')}
        </Typography>
      )}

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button variant="outlined" color="error" onClick={() => navigate("/contenus")}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="contained">
          {t('common.save')}
        </Button>
      </Box>
    </form>
  </Container>
);

};

export default AddContenusView;
