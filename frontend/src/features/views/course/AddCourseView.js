import React, { useState } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddCourseView = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post(`/courses`, { title });
      navigate("/courses");
    } catch (err) {
      console.error("Erreur création cours", err);
      alert(t('courses.createError'));
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
        <Button variant="outlined" color="error" onClick={() => navigate("/courses")}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {t('common.save')}
        </Button>
      </Box>
    </Container>
  );
};

export default AddCourseView;
