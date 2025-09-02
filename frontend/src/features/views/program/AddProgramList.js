import { useState } from "react";
import { TextField, Button, Container, Box } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddProgramList = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const styles = {
    primary: {
      borderRadius: 3,
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(25,118,210,0.4)'
      }
    },
    danger: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
      boxShadow: '0 6px 18px rgba(211,47,47,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(211,47,47,0.35)' }
    },
    success: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
      boxShadow: '0 6px 18px rgba(46,125,50,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(46,125,50,0.35)' }
    },
    info: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
      boxShadow: '0 6px 18px rgba(2,136,209,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(2,136,209,0.35)' }
    },
    secondary: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #7b1fa2, #ab47bc)',
      boxShadow: '0 6px 18px rgba(123,31,162,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(123,31,162,0.35)' }
    },
    rounded: { borderRadius: 2 }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error(t('programs.nameRequired'));
      return;
    }

    try {
      const res = await api.post("/programs", { name });

      // Affiche la réponse dans la console pour vérification
      console.log("Réponse du backend :", res.data);

      // Vérifie que res.data.id est bien défini
      if (res.data && res.data.id) {
        toast.success(t('programs.createSuccess'));
        navigate(`/programs/build/${res.data.id}`); // Redirection vers le builder
      } else {
        toast.error(t('programs.serverError'));
      }

    } catch (err) {
      console.error("Erreur lors de la création du programme", err);
      toast.error(t('programs.saveError'));
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
        <Button variant="contained" sx={styles.danger} onClick={() => navigate("/programs")}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" sx={styles.success} onClick={handleSubmit}>
          {t('common.save')}
        </Button>
      </Box>
    </Container>
  );
};

export default AddProgramList;
