import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import api from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AddSessionView = () => {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [structure, setStructure] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [sessionName, setSessionName] = useState("");

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

  // Fetch published programs
  useEffect(() => {
    api
      .get("/programs")
      .then((res) => {
        const published = res.data.filter((p) => p.published);
        setPrograms(published);
      })
      .catch(() => toast.error(t("sessions.loadError")));
  }, []);

  // Fetch program structure (preview)
  const fetchStructure = async (programId) => {
    try {
      const res = await api.get(`/buildProgram/program/${programId}`);
      setStructure(res.data);
    } catch {
      toast.error(t("sessions.loadError"));
    }
  };

  const handleProgramSelect = (e) => {
    const id = e.target.value;
    setSelectedProgramId(id);
    fetchStructure(id);
  };

  // ✅ Correct and working submit function
  const handleSubmit = async () => {
  if (!selectedProgramId || !startDate || !endDate || !sessionName.trim()) {
    toast.error(t("sessions.fillAllFields"));
    return;
  }

  if (new Date(startDate) >= new Date(endDate)) {
    toast.error(t("sessions.startBeforeEnd"));
    return;
  }

  const formData = new FormData();
  formData.append("programId", selectedProgramId);
  formData.append("startDate", startDate);
  formData.append("endDate", endDate);
  formData.append("name", sessionName);

  if (image) {
    formData.append("image", image);
  }

  try {
    await api.post("/session2", formData);
    toast.success(t("sessions.sessionSaved"));
    setSelectedProgramId("");
    setStartDate("");
    setEndDate("");
    setImage(null);
    setStructure(null);
    setSessionName("");
  } catch (error) {
    toast.error(t("sessions.saveError"));
  }
};



  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        ➕ {t("sessions.addSession")}
      </Typography>

      <Stack spacing={2} mt={2}>
        <TextField
          select
          label={t("sessions.publishedProgram")}
          fullWidth
          value={selectedProgramId}
          onChange={handleProgramSelect}
        >
          {programs.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
  label={t("sessions.sessionName")}
  fullWidth
  value={sessionName}
  onChange={(e) => setSessionName(e.target.value)}
/>


        <TextField
          type="date"
          label={t("sessions.startDate")}
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <TextField
          type="date"
          label={t("sessions.endDate")}
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Button variant="contained" sx={styles.info} component="label">
          📷 {t("sessions.uploadImage")}
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>

        {image && (
          <Typography variant="body2" color="text.secondary">
            {t("sessions.selectedImage")} : {image.name}
          </Typography>
        )}

        {structure && (
          <>
            <Divider />
            <Typography variant="subtitle1">🧱 {t("sessions.programPreview")}</Typography>
            {structure.modules.map((mod) => (
              <Box key={mod.id} mt={1}>
                <Typography fontWeight="bold">📦 {mod.module.name}</Typography>
                {(mod.courses || []).map((c) => (
                  <Box key={c.id} ml={2}>
                    <Typography variant="body2">📘 {c.course.title}</Typography>
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                      {(c.contenus || []).map((ct) => (
                        <Typography key={ct.id} variant="caption" color="text.secondary">
                          📄 {ct.contenu.title}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Box>
            ))}
          </>
        )}

        <Button variant="contained" sx={styles.success} onClick={handleSubmit}>
          📤 {t("sessions.saveSession")}
        </Button>
      </Stack>
    </Paper>
  );
};

export default AddSessionView;
