import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const AddSeanceFormateurView = ({ onSeanceCreated }) => {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programData, setProgramData] = useState(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const user = JSON.parse(localStorage.getItem("user")); // 🔐

  useEffect(() => {
    axios
      .get("http://localhost:8000/buildProgram")
      .then((res) => {
        const published = res.data.filter((p) => p.program?.published);
        setPrograms(published.map((p) => p.program));
      })
      .catch((err) => console.error("Erreur chargement programmes:", err));
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      axios
        .get(`http://localhost:8000/buildProgram/program/${selectedProgram}`)
        .then((res) => setProgramData(res.data))
        .catch((err) =>
          console.error("Erreur chargement programme complet:", err)
        );
    } else {
      setProgramData(null);
    }
  }, [selectedProgram]);

  const handleSubmit = async () => {
    if (!programData || !user?.id || !date || !time || !title) {
      alert(t("addSeance.fillAllFields"));
      return;
    }

    const payload = {
      title,
      startTime: new Date(`${date}T${time}`), // ✅ valid date
      formateurId: user.id,
      buildProgramId: programData.id,
    };

    console.log("🟢 Payload ready:", payload);

    try {
      const res = await axios.post("http://localhost:8000/seance-formateur", payload);
      if (onSeanceCreated) onSeanceCreated(res.data);
    } catch (err) {
      console.error("❌ Erreur création séance :", err);
      alert(t("addSeance.creationError"));
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        {t("addSeance.title")}
      </Typography>

      <TextField
        fullWidth
        label={t("addSeance.titleField")}
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

      <FormControl fullWidth margin="normal">
        <InputLabel>{t("addSeance.program")}</InputLabel>
        <Select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          label={t("addSeance.program")}
        >
          {programs.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {programData && (
        <Box component={Paper} variant="outlined" sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t("addSeance.programPreview")}
          </Typography>

          {programData.modules.map((m) => (
            <Box key={m.module.id} mb={2}>
              <Typography fontWeight="bold" color="primary.main">
                📦 {m.module.title}
              </Typography>

              {(m.courses || []).map((c) => (
                <Box key={c.course.id} ml={2} mt={1}>
                  <Typography variant="body2" fontWeight="bold">
                    📘 {c.course.title}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                    {(c.contenus || []).map((ct) => (
                      <Chip
                        key={ct.contenu.id}
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
          {t("addSeance.createButton")}
        </Button>
      </Box>
    </Box>
  );
};

export default AddSeanceFormateurView;
