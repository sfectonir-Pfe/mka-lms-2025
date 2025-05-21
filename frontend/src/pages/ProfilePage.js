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
            Profile Error
          </Typography>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error || "User not found"}
          </Alert>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ px: 4, py: 1 }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ px: 4, py: 1 }}
            >
              Go Home
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
            User Profile
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/EditProfile/${user.email}`)}
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
            Edit Profile
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
            src={user.profilePic ? `http://localhost:8000/uploads/profile-pics/${user.profilePic.split('/').pop()}` : undefined}
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
              label={user.role}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 1,
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            />

            <Typography variant="body1" sx={{
              mt: 2,
              color: 'text.secondary',
              maxWidth: 500
            }}>
              {user.about || "No bio provided"}
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
              <PersonIcon color="primary" /> Personal Info
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon color="action" />
                <Typography>{user.email}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PhoneIcon color="action" />
                <Typography>{user.phone || "Not provided"}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon color="action" />
                <Typography>{user.location || "Location not specified"}</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Skills Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{
              mb: 3,
              fontWeight: 600
            }}>
              Skills & Expertise
            </Typography>

            {user.skills?.length > 0 ? (
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
                No skills added yet.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;