import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddModuleView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    periodUnit: "Day",
    duration: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/modules", formData);
      toast.success(t('modules.addSuccess'));
      setTimeout(() => navigate("/module"), 800);
    } catch (err) {
      console.error("❌ Erreur lors de l'ajout du module:", err);
      toast.error(t('modules.addError'));
    }
  };

  return (
   <Container maxWidth="sm" sx={{ mt: 4 }}>
  <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
    <Typography variant="h5" gutterBottom>
      {t('modules.addModule')}
    </Typography>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="name"
            label={t('modules.moduleName')}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            name="periodUnit"
            label={t('modules.periodUnit')}
            value={formData.periodUnit}
            onChange={handleChange}
          >
            <MenuItem value="Day">{t('modules.day')}</MenuItem>
            <MenuItem value="Week">{t('modules.week')}</MenuItem>
            <MenuItem value="Month">{t('modules.month')}</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            name="duration"
            label={t('modules.duration')}
            value={formData.duration}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
          />
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/modules")}
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #d32f2f, #ef5350)",
              boxShadow: "0 8px 24px rgba(211, 47, 47, 0.3)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(211, 47, 47, 0.4)",
              },
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" color="primary"
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            {t('common.save')}
          </Button>
        </Grid>
      </Grid>
    </form>
  </Paper>

</Container>

  );
};

export default AddModuleView;
