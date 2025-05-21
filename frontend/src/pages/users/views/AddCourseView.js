import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCourseView = () => {
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/courses", {
  title
});

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
      <TextField fullWidth label="Titre" margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField
        fullWidth
        label="Module ID (optionnel)"
        type="number"
        margin="normal"
        value={moduleId}
        onChange={(e) => setModuleId(e.target.value)}
      />
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Enregistrer
      </Button>
    </Container>
  );
};

export default AddCourseView;
