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
import api from "../../../api/axiosInstance";
import { toast } from "react-toastify";

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
    if (!title) {
      toast.error(t('content.titleRequired'));
      return;
    }
    if (type !== "Quiz" && !file) {
      toast.error(t('content.fileRequired'));
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);

    if (type !== "Quiz") {
      formData.append("file", file);
      formData.append("fileType", fileType);
    }

    try {
      const res = await api.post("/contenus/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newContenu = res.data;
      toast.success(t('content.addSuccess'));
      if (type === "Quiz") {
        setTimeout(() => navigate(`/quizzes/create/${newContenu.id}`), 500);
      } else {
        setTimeout(() => navigate("/contenus"), 500);
      }
    } catch (err) {
      console.error("❌ Erreur ajout contenu :", err);
      toast.error(t('content.saveError'));
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
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2, borderRadius: 3, background: 'linear-gradient(135deg, #1976d2, #42a5f5)', boxShadow: '0 8px 24px rgba(25,118,210,0.3)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(25,118,210,0.4)' } }}
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
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/contenus")}
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
            boxShadow: '0 8px 24px rgba(211,47,47,0.3)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(211,47,47,0.4)' }
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            boxShadow: '0 8px 24px rgba(25,118,210,0.3)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(25,118,210,0.4)' }
          }}
        >
          {t('common.save')}
        </Button>
      </Box>
    </form>
  </Container>
);

};

export default AddContenusView;