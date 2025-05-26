import React, { useState } from "react";
import { TextField, Button, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const AddProgramList = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8000/programs", { name });
navigate(`/programs/build/${res.data.id}`); // temporary builder route


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

  <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
    <Button variant="outlined" color="error" onClick={() => navigate("/programs")}>
      Annuler
    </Button>
    <Button variant="contained" onClick={handleSubmit}>
      Enregistrer
    </Button>
  </Box>
</Container>

  );
};

export default AddProgramList;
