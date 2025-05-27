import React, { useState } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCourseView = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/courses", { title });
      navigate("/courses");
    } catch (err) {
      console.error("Erreur création cours", err);
      alert("Erreur !");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" mt={3} mb={2}>
        Ajouter un cours
      </Typography>

      <TextField
        fullWidth
        label="Titre"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="outlined" color="error" onClick={() => navigate("/courses")}>
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </Box>
    </Container>
  );
};

export default AddCourseView;
