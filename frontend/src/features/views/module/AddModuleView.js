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
      alert(t('modules.addSuccess'));
      navigate("/module");
    } catch (err) {
      console.error("❌ Erreur lors de l'ajout du module:", err);
      alert(t('modules.addError'));
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
          <Button variant="outlined" color="error" onClick={() => navigate("/modules")}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" color="primary">
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
