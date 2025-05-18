import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Box,
  Button,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        console.error("ID utilisateur manquant");
        setError("ID utilisateur manquant");
        setLoading(false);
        return;
      }

      console.log("Tentative de chargement du profil pour l'ID:", id);
      setLoading(true);

      // Stratégie 1: Essayer directement par ID
      try {
        console.log("Stratégie 1: Chargement par ID");
        const res = await axios.get(`http://localhost:8000/users/id/${id}`);
        console.log("Succès - Données utilisateur chargées par ID:", res.data);
        setUser(res.data);
        setLoading(false);
        return;
      } catch (err) {
        console.error("Échec de la stratégie 1:", err.response?.data || err.message);
      }

      // Stratégie 2: Récupérer tous les utilisateurs et filtrer
      try {
        console.log("Stratégie 2: Chargement via liste complète");
        const allUsersRes = await axios.get(`http://localhost:8000/users`);
        console.log("Liste des utilisateurs récupérée:", allUsersRes.data);

        const foundUser = allUsersRes.data.find(user => user.id === parseInt(id));

        if (foundUser) {
          console.log("Utilisateur trouvé dans la liste:", foundUser);

          // Récupérer les détails complets par email
          const detailRes = await axios.get(`http://localhost:8000/users/email/${foundUser.email}`);
          console.log("Succès - Données utilisateur chargées via email:", detailRes.data);
          setUser(detailRes.data);
          setLoading(false);
          return;
        } else {
          console.error("Utilisateur non trouvé dans la liste");
          throw new Error("Utilisateur non trouvé");
        }
      } catch (secondErr) {
        console.error("Échec de la stratégie 2:", secondErr.response?.data || secondErr.message);
        setError("Impossible de charger les informations de l'utilisateur.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Erreur de chargement du profil
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || "Utilisateur non trouvé."}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ID utilisateur demandé: {id}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mr: 1 }}
          >
            Réessayer
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5">Profil utilisateur</Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/EditProfile/${user.email}`)}
          >
            Modifier
          </Button>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            src={user.profilePic ? `http://localhost:8000/uploads${user.profilePic}` : null}
            sx={{ width: 100, height: 100, mb: 2 }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Typography variant="h6">{user.name}</Typography>
          <Typography color="text.secondary">{user.email}</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Rôle</Typography>
            <Typography>{user.role}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Contact</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Téléphone: {user.phone || "Non renseigné"}</Typography>
            <Typography>Localisation: {user.location || "Non précisée"}</Typography>
          </Grid>

          <Grid item xs={12}>
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

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">À propos</Typography>
            <Typography>{user.about || "Non renseigné"}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
