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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddModuleView = () => {
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
      await axios.post("http://localhost:8000/modules", formData);
      alert("✅ Module ajouté avec succès !");
      navigate("/module");
    } catch (err) {
      console.error("❌ Erreur lors de l'ajout du module:", err);
      alert("Erreur lors de l'ajout du module.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Ajouter un module
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Nom du module"
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
                label="Période"
                value={formData.periodUnit}
                onChange={handleChange}
              >
                <MenuItem value="Day">Jour</MenuItem>
                <MenuItem value="Week">Semaine</MenuItem>
                <MenuItem value="Month">Mois</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                name="duration"
                label="Durée"
                value={formData.duration}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                ENREGISTRER
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddModuleView;
