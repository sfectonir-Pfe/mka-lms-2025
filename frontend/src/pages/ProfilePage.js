import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Grid,
  Paper,
  Divider,
  Box,
  Chip,
  Button,
} from "@mui/material";
import axios from "axios";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) {
      setError("Aucun email trouvé. Veuillez vous connecter.");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/users/me/${encodeURIComponent(email)}`);
        setUser(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err);
        setError("Impossible de charger le profil utilisateur.");
      }
    };

    fetchUser();
  }, [email]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Chargement du profil...</p>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
  alt={user.name || "User"}
  src={
    user.profilePic
      ? `http://localhost:8000${user.profilePic}`
      : "/uploads/avatar-placeholder.png"
  }
  sx={{ width: 120, height: 120, margin: "auto" }}
/>
            <Typography variant="h6" mt={2}>
              {user.name || "Nom Inconnu"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.role}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              href="/EditProfilePage"
            >
              Modifier le profil
            </Button>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="h6">À propos</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {user.about || "Aucune description disponible."}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Contact</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Téléphone: {user.phone || "Non renseigné"}</Typography>
            <Typography>Localisation: {user.location || "Non précisée"}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Compétences</Typography>
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {user.skills?.length > 0 ? (
                user.skills.map((skill, idx) => (
                  <Chip key={idx} label={skill} color="primary" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucune compétence ajoutée.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;
