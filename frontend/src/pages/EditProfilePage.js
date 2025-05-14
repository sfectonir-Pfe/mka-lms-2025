import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip,
  Box,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const [formData, setFormData] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const { email: paramEmail } = useParams();
  const navigate = useNavigate();

  const email = paramEmail || localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return;
    axios
      .get(`http://localhost:8000/users/me/${email}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error("Erreur chargement utilisateur", err));
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    data.append("name", formData.name || "");
    data.append("phone", formData.phone || "");
    data.append("location", formData.location || "");
    data.append("about", formData.about || "");
    data.append("skills", JSON.stringify(formData.skills || []));

    if (formData.profileFile) {
      data.append("profileFile", formData.profileFile);
    }

    await axios.patch(`http://localhost:8000/users/me/${email}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    navigate("/ProfilePage");
  } catch (err) {
    console.error("Erreur lors de la mise à jour", err);
  }
};


  if (!formData) return <p>Chargement...</p>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Modifier le Profil
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} textAlign="center">
             <Avatar
  src={
    formData.profilePic
      ? `http://localhost:8000${formData.profilePic}`
      : "/avatar-placeholder.png"
  }
  sx={{ width: 100, height: 100, mx: "auto" }}
/>

              <Button component="label" variant="outlined" size="small" sx={{ mt: 2 }}>
                Télécharger une photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profileFile: e.target.files?.[0] || null,
                    }))
                  }
                />
              </Button>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Nom"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    value={formData.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="phone"
                    label="Téléphone"
                    fullWidth
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="role"
                    label="Rôle"
                    fullWidth
                    value={formData.role}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="location"
                    label="Localisation"
                    fullWidth
                    value={formData.location || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="about"
                    label="À propos de moi"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.about || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Compétences</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {formData.skills?.map((skill, i) => (
                      <Chip
                        key={i}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="primary"
                      />
                    ))}
                  </Box>
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <TextField
                      label="Ajouter compétence"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      size="small"
                    />
                    <Button onClick={handleAddSkill} variant="contained">
                      Ajouter
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Enregistrer
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfilePage;
