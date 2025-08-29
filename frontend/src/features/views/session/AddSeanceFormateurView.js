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
import api from "../../../api/axiosInstance";
import { useTranslation } from "react-i18next";


import { useParams } from "react-router-dom";
import { Eye, EyeOff, PlusCircle } from "lucide-react";
import RoleGate from "../../../pages/auth/RoleGate";
 // Or any icons you prefer

const AddSeanceFormateurView = ({ onSeanceCreated }) => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showAddBlock, setShowAddBlock] = useState(false); // Hide by default

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (sessionId) {
      api
        .get(`/seance-formateur/details/${sessionId}`)
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
      alert(t("addSeance.fillAllFieldsAlert"));
      return;
    }

    const payload = {
      title,
      startTime: new Date(`${date}T${time}`),
      formateurId: user.id,
      session2Id: Number(sessionId),
    };

    try {
      await api.post("/seance-formateur", payload);
      setTitle("");
      setDate("");
      setTime("");
      if (onSeanceCreated) onSeanceCreated();
      setShowAddBlock(false); // Optionally close form after submit
    } catch (err) {
      console.error("❌ Erreur création séance :", err);
      console.error("❌ Response data:", err.response?.data);
      console.error("❌ Response status:", err.response?.status);
      
      const errorMessage = err.response?.data?.message || err.message || t("addSeance.creationErrorAlert");
      alert(`${t("addSeance.creationErrorAlert")}: ${errorMessage}`);
    }
  };

  return (
    <Box p={2} width="100%">
      <Box display="flex" flexDirection="column" alignItems="center">
      <RoleGate roles={['CreateurDeFormation','Admin']}>
      <Button
      
        variant={showAddBlock ? "outlined" : "contained"}
        color="primary"
        startIcon={showAddBlock ? <EyeOff size={18} /> : <PlusCircle size={18} />}
        onClick={() => setShowAddBlock((prev) => !prev)}
        sx={{ mb: 2 }}
      >
        {showAddBlock ? t("addSeance.hideForm") : t("addSeance.createNewSession")}
      </Button>
      </RoleGate>
      <Collapse in={showAddBlock}>
        <Box>
          <Typography variant="h5" gutterBottom>
            ➕ {t("addSeance.createNewSessionTitle")}
          </Typography>

          <TextField
            fullWidth
            label={t("addSeance.title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label={t("addSeance.date")}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label={t("addSeance.time")}
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          {sessionData && (
            <Box component={Paper} variant="outlined" sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                🧩 {t("addSeance.sessionPreview")}
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
              {t("addSeance.createSessionButton")}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
    </Box>
  );
};

export default AddSeanceFormateurView;
