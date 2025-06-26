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
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';
import axios from "axios";


const ProfilePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      console.log("ProfilePage: Début de fetchUser avec ID:", id);

      // Commencer par récupérer les données utilisateur depuis le localStorage
      const storedUser = localStorage.getItem("user");
      let localStorageUserData = null;

      if (storedUser) {
        try {
          localStorageUserData = JSON.parse(storedUser);
          console.log("ProfilePage: Utilisateur récupéré depuis localStorage:", localStorageUserData);
        } catch (err) {
          console.error("ProfilePage: Erreur lors de la récupération de l'utilisateur depuis localStorage:", err);
        }
      }

      // Si aucun ID n'est fourni dans l'URL
      if (!id) {
        console.log("ProfilePage: ID utilisateur manquant dans l'URL");

        // Utiliser les données du localStorage si disponibles
        if (localStorageUserData) {
          // Si l'utilisateur a un ID dans le localStorage, rediriger vers la page avec ID
          if (localStorageUserData.id) {
            const userId = typeof localStorageUserData.id === 'string'
              ? parseInt(localStorageUserData.id, 10)
              : localStorageUserData.id;

            if (!isNaN(userId)) {
              console.log("ProfilePage: Redirection vers la page de profil avec ID:", userId);
              navigate(`/ProfilePage/${userId}`, { replace: true });
              return;
            }
          }

          // Si pas d'ID valide mais des données utilisateur, les utiliser directement
          setUser(localStorageUserData);
          setLoading(false);
          return;
        }

        setError(t('profile.missingUserData'));
        setLoading(false);
        return;
      }

      console.log("ProfilePage: Tentative de chargement du profil pour l'ID:", id);
      setLoading(true);

      // Convertir l'ID en nombre
      const userId = typeof id === 'string' ? parseInt(id, 10) : id;

      if (isNaN(userId)) {
        console.error("ProfilePage: ID invalide:", id);
        setError(t('profile.invalidUserId'));
        setLoading(false);
        return;
      }

      // Si l'ID dans l'URL correspond à l'ID dans le localStorage, utiliser les données du localStorage
      if (localStorageUserData && localStorageUserData.id === userId) {
        console.log("ProfilePage: Utilisation des données du localStorage car l'ID correspond");
        setUser(localStorageUserData);
        setLoading(false);

        // Mettre à jour les données en arrière-plan
        try {
          const res = await axios.get(`http://localhost:8000/users/id/${userId}`);
          if (res.data) {
            console.log("ProfilePage: Mise à jour des données utilisateur en arrière-plan:", res.data);

            // Mettre à jour le rôle pour khalil si nécessaire
            if (res.data.email === "khalil@gmail.com" && res.data.role !== "Admin") {
              res.data.role = "Admin";
            }

            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("ProfilePage: Erreur lors de la mise à jour des données en arrière-plan:", err);
        }

        return;
      }

      // Stratégie 1: Essayer directement par ID
      try {
        console.log("ProfilePage: Stratégie 1: Chargement par ID", userId);
        const res = await axios.get(`http://localhost:8000/users/id/${userId}`);

        if (res.data) {
          console.log("ProfilePage: Succès - Données utilisateur chargées par ID:", res.data);

          // Mettre à jour le rôle pour khalil si nécessaire
          if (res.data.email === "khalil@gmail.com" && res.data.role !== "Admin") {
            res.data.role = "Admin";
          }

          setUser(res.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("ProfilePage: Échec de la stratégie 1:", err.response?.data || err.message);
      }

      // Stratégie 2: Utiliser les données du localStorage comme solution de secours
      if (localStorageUserData) {
        console.log("ProfilePage: Stratégie 2: Utilisation des données du localStorage comme solution de secours");
        setUser(localStorageUserData);
        setLoading(false);
        return;
      }

      // Si tout échoue
      setError(t('profile.loadUserError'));
      setLoading(false);
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return (
      <Container sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)'
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            {t('profile.profileError')}
          </Typography>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error || t('profile.userNotFound')}
          </Alert>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ px: 4, py: 1 }}
            >
              {t('common.tryAgain')}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ px: 4, py: 1 }}
            >
              {t('common.goHome')}
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{
        p: 6,
        borderRadius: 6,
        background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)'
      }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('profile.userProfile')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              // Stocker temporairement l'utilisateur à éditer dans sessionStorage
              console.log("Storing user data for editing:", user);
              sessionStorage.setItem("editingUser", JSON.stringify(user));
              navigate(`/EditProfile/${user.email}`);
            }}
            sx={{
              borderRadius: 20,
              px: 3,
              py: 1,
              textTransform: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
              }
            }}
          >
            {t('profile.editProfile')}
          </Button>
        </Box>

        {/* Profile Top Section */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          mb: 6,
          gap: 4
        }}>
          <Avatar
            src={user.profilePic ?
              (user.profilePic.startsWith('/profile-pics/') ?
                `http://localhost:8000/uploads${user.profilePic}` :
                (user.profilePic.startsWith('http') ?
                  user.profilePic :
                  `http://localhost:8000/uploads/profile-pics/${user.profilePic.split('/').pop()}`
                )
              ) :
              undefined
            }
            sx={{
              width: 150,
              height: 150,
              fontSize: 60,
              border: '4px solid #1976d2',
              boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
            }}
          >
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
          </Avatar>

          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" sx={{
              fontWeight: 600,
              mb: 1
            }}>
              {user.name}
            </Typography>

            <Chip
              icon={<WorkIcon />}
              label={user.role || "Etudiant"}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 1,
                fontSize: '0.9rem',
                fontWeight: 500,
                textTransform: 'capitalize'
              }}
            />

            <Typography variant="body1" sx={{
              mt: 2,
              color: 'text.secondary',
              maxWidth: 500
            }}>
              {user.about || t('profile.noBio')}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{
          my: 4,
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1
        }} />

        {/* Details Section */}
        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{
              mb: 3,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <PersonIcon color="primary" /> {t('profile.personalInfo')}
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon color="action" />
                <Typography>{user.email}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon color="action" />
                <Typography>{user.phone || t('profile.notProvided')}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon color="action" />
                <Typography>{user.location || t('profile.locationNotSpecified')}</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Skills Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{
              mb: 3,
              fontWeight: 600
            }}>
              {t('profile.skillsExpertise')}
            </Typography>

            {user.skills && Array.isArray(user.skills) && user.skills.length > 0 ? (
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5
              }}>
                {user.skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    color="primary"
                    sx={{
                      borderRadius: 2,
                      px: 1.5,
                      py: 1,
                      fontSize: '0.9rem',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('profile.noSkillsAdded')}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;