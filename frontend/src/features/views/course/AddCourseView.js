import React, { useState } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCourseView = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post(`/courses`, { title });
      toast.success(t('courses.createSuccess'));
      setTimeout(() => navigate("/courses"), 600);
    } catch (err) {
      console.error("Erreur création cours", err);
      toast.error(t('courses.createError'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mt={3} mb={2}>
        {t('courses.addCourse')}
      </Typography>

      <TextField
        fullWidth
        label={t('common.title')}
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate("/courses")}
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #d32f2f, #ef5350)",
            boxShadow: "0 8px 24px rgba(211, 47, 47, 0.3)",
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(211, 47, 47, 0.4)',
            },
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
            },
          }}
        >
          {t('common.save')}
        </Button>
      </Box>
    </Container>
  );
};

export default AddCourseView;
