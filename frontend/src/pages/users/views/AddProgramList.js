import { useState } from "react";
import { TextField, Button, Container, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProgramList = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8000/programs", { name });

      // Affiche la réponse dans la console pour vérification
      console.log("Réponse du backend :", res.data);

      // Vérifie que res.data.id est bien défini
      if (res.data && res.data.id) {
        navigate(`/programs/build/${res.data.id}`); // Redirection vers le builder
      } else {
        alert("Erreur : la réponse du serveur ne contient pas d'identifiant.");
      }

    } catch (err) {
      console.error("Erreur lors de la création du programme", err);
      alert("Erreur : échec de l'enregistrement du programme.");
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
