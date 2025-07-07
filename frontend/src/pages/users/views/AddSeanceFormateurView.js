import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  Collapse,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Eye, EyeOff, PlusCircle } from "lucide-react"; // Or any icons you prefer

const AddSeanceFormateurView = ({ onSeanceCreated }) => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showAddBlock, setShowAddBlock] = useState(false); // Hide by default

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (sessionId) {
      axios
        .get(`http://localhost:8000/seance-formateur/details/${sessionId}`)
        .then((res) => setSessionData(res.data))
        .catch((err) =>
          console.error("Erreur chargement session complète:", err)
        );
    } else {
      setSessionData(null);
    }
  }, [sessionId]);

  const handleSubmit = async () => {
    if (!sessionData || !user?.id || !date || !time || !title) {
      alert("Remplissez tous les champs.");
      return;
    }

    const payload = {
      title,
      startTime: new Date(`${date}T${time}`),
      formateurId: user.id,
      session2Id: Number(sessionId),
    };

    try {
      await axios.post("http://localhost:8000/seance-formateur", payload);
      setTitle("");
      setDate("");
      setTime("");
      if (onSeanceCreated) onSeanceCreated();
      setShowAddBlock(false); // Optionally close form after submit
    } catch (err) {
      console.error("❌ Erreur création séance :", err);
      alert("Erreur lors de la création.");
    }
  };

  return (
    <Box p={2} width="100%">
      <Box display="flex" flexDirection="column" alignItems="center">

      <Button
      
        variant={showAddBlock ? "outlined" : "contained"}
        color="primary"
        startIcon={showAddBlock ? <EyeOff size={18} /> : <PlusCircle size={18} />}
        onClick={() => setShowAddBlock((prev) => !prev)}
        sx={{ mb: 2 }}
      >
        {showAddBlock ? "Masquer le formulaire" : "Créer une nouvelle séance"}
      </Button>

      <Collapse in={showAddBlock}>
        <Box>
          <Typography variant="h5" gutterBottom>
            ➕ Créer une nouvelle séance
          </Typography>

          <TextField
            fullWidth
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Heure"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          {sessionData && (
            <Box component={Paper} variant="outlined" sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🧩 Aperçu de la session sélectionnée
              </Typography>
              {sessionData.session2Modules.map((m) => (
                <Box key={m.id} mb={2}>
                  <Typography fontWeight="bold" color="primary.main">
                    📦 {m.module.name}
                  </Typography>
                  {(m.courses || []).map((c) => (
                    <Box key={c.id} ml={2} mt={1}>
                      <Typography variant="body2" fontWeight="bold">
                        📘 {c.course.title}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {(c.contenus || []).map((ct) => (
                          <Chip
                            key={ct.id}
                            label={`📄 ${ct.contenu.title}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                              window.open(ct.contenu.fileUrl, "_blank")
                            }
                            sx={{ cursor: "pointer" }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </Box>
          )}

          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              CRÉER LA SÉANCE
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
    </Box>
  );
};

export default AddSeanceFormateurView;
