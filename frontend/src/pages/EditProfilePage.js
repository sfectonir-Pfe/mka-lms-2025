import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { toast } from "react-toastify";

const EditProfilePage = () => {
  const { email } = useParams(); // Récupère l'email depuis l'URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!email) {
        console.error("Email utilisateur manquant");
        setError("Email utilisateur manquant");
        setLoading(false);
        return;
      }

      console.log("Tentative de chargement du profil pour l'email:", email);

      try {
        // Utiliser la route correcte avec email
        console.log("URL de l'API:", `http://localhost:8000/users/email/${email}`);
        const res = await axios.get(`http://localhost:8000/users/email/${email}`);
        console.log("Réponse de l'API:", res);
        console.log("Données utilisateur chargées:", res.data);

        if (res.data) {
          setUser(res.data);
          setForm(res.data);
        } else {
          throw new Error("Données utilisateur vides");
        }
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur:", err);
        console.error("Message d'erreur:", err.message);
        console.error("Réponse d'erreur:", err.response?.data);
        setError(`Erreur de chargement: ${err.message}. Vérifiez la console pour plus de détails.`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Fichier sélectionné:", file);

    setSelectedFile(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      console.log("URL de prévisualisation créée:", previewUrl);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    if (!email) {
      const errorMsg = "Impossible de mettre à jour le profil : email utilisateur manquant.";
      console.error(errorMsg);
      setError(errorMsg);
      setSubmitting(false);
      return;
    }

    if (!user?.id) {
      const errorMsg = "Impossible de mettre à jour le profil : ID utilisateur manquant.";
      console.error(errorMsg);
      setError(errorMsg);
      setSubmitting(false);
      return;
    }

    try {
      console.log("Tentative de mise à jour du profil pour l'email:", email);

      // Préparer les données à envoyer (sans le champ role pour éviter les erreurs de type)
      const userData = {
        name: form.name || null,
        phone: form.phone || null,
        location: form.location || null,
        about: form.about || null,
      };

      console.log("Données à mettre à jour:", userData);
      console.log("URL de l'API:", `http://localhost:8000/users/email/${email}`);

      // Utiliser la route correcte avec email
      const updateRes = await axios.patch(`http://localhost:8000/users/email/${email}`, userData);
      console.log("Réponse de l'API:", updateRes);
      console.log("Profil mis à jour avec succès:", updateRes.data);

      // Gestion du téléchargement de photo (si cette fonctionnalité est disponible)
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append("photo", selectedFile);

          console.log("Tentative de mise à jour de la photo pour l'ID:", user.id);
          console.log("URL de l'API pour la photo:", `http://localhost:8000/users/id/${user.id}/photo`);
          console.log("FormData créé:", formData);

          // Utiliser la route correcte pour télécharger la photo
          const photoRes = await axios.patch(
            `http://localhost:8000/users/id/${user.id}/photo`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            }
          );

          console.log("Réponse complète de l'API pour la photo:", photoRes);
          console.log("Photo mise à jour avec succès:", photoRes.data);

          // Mettre à jour l'utilisateur avec la nouvelle photo
          if (photoRes.data && photoRes.data.profilePic) {
            console.log("Nouveau chemin de photo:", photoRes.data.profilePic);

            // Mettre à jour l'état de l'utilisateur
            setUser({
              ...user,
              profilePic: photoRes.data.profilePic
            });

            // Forcer un rafraîchissement de l'image
            const timestamp = new Date().getTime();
            const photoUrl = `http://localhost:8000/uploads${photoRes.data.profilePic}?t=${timestamp}`;
            console.log("URL de la photo avec timestamp:", photoUrl);

            // Mettre à jour la prévisualisation
            setPreview(photoUrl);

            // Afficher un message de succès
            toast.success("Photo de profil mise à jour avec succès!");
          }
        } catch (photoErr) {
          console.error("Erreur lors de la mise à jour de la photo:", photoErr);
          console.error("Message d'erreur:", photoErr.message);
          console.error("Réponse d'erreur:", photoErr.response?.data);
          // Ne pas bloquer la mise à jour du profil si la photo échoue
          toast.error("Erreur lors de la mise à jour de la photo. Les autres informations ont été enregistrées.");
        }
      }

      setSuccess(true);
      toast.success("Profil mis à jour avec succès!");

      // Rediriger vers la page de profil après un délai plus long pour permettre au serveur de traiter la photo
      setTimeout(() => {
        // Forcer un rafraîchissement complet de la page pour s'assurer que la nouvelle photo est chargée
        window.location.href = `/ProfilePage/${user.id}`;
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      console.error("Message d'erreur:", err.message);
      console.error("Réponse d'erreur:", err.response?.data);
      setError(`Erreur de mise à jour: ${err.message}. Vérifiez la console pour plus de détails.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
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
            Email utilisateur demandé: {email}
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
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">Modifier le profil</Typography>
          <Button
            component={Link}
            to={`/ProfilePage/${user.id}`}
            startIcon={<ArrowBackIcon />}
            size="small"
          >
            Retour
          </Button>
        </Box>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          ID: {user.id} | Email: {user.email}
        </Typography>

        <Box display="flex" justifyContent="center" mb={2} position="relative">
          <Avatar
            src={preview || (user.profilePic ? `http://localhost:8000/uploads${user.profilePic}` : null)}
            sx={{ width: 100, height: 100 }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <IconButton
            color="primary"
            component="label"
            sx={{ position: "absolute", bottom: 0, right: "calc(50% - 50px)", bgcolor: "#fff" }}
          >
            <PhotoCamera />
            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
          </IconButton>
        </Box>

        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ my: 2 }}>Profil mis à jour avec succès !</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nom"
                name="name"
                fullWidth
                value={form.name || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={form.email || ""}
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Téléphone"
                name="phone"
                fullWidth
                value={form.phone || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Localisation"
                name="location"
                fullWidth
                value={form.location || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="À propos"
                name="about"
                fullWidth
                multiline
                rows={4}
                value={form.about || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Rôle"
                name="role"
                fullWidth
                value={form.role || ""}
                disabled
                helperText="Le rôle ne peut pas être modifié"
              />
            </Grid>

            <Grid item xs={12} textAlign="right">
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfilePage;
