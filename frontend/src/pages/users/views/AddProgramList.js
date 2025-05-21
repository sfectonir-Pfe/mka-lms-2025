import React, { useState } from "react";
import { TextField, Button, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProgramList = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/programs", { name });
      navigate("/programs");
    } catch (err) {
      console.error("Erreur lors de la création du programme", err);
      alert("Erreur : échec de l'enregistrement");
    }
  };

  return (
    <Container maxWidth="sm">
      <h3>Ajouter un programme</h3>
      <TextField
        label="Nom du programme"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Enregistrer
      </Button>
    </Container>
  );
};

export default AddProgramList;
