import { useState } from "react";
import { TextField, Button, Container, Box } from "@mui/material";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProgramList = () => {
  const { t } = useTranslation();
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
        alert(t('programs.serverError'));
      }

    } catch (err) {
      console.error("Erreur lors de la création du programme", err);
      alert(t('programs.saveError'));
    }
  };

  return (
    <Container maxWidth="sm">
      <h3>{t('programs.addProgram')}</h3>

      <TextField
        label={t('programs.programName')}
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" color="error" onClick={() => navigate("/programs")}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {t('common.save')}
        </Button>
      </Box>
    </Container>
  );
};

export default AddProgramList;
