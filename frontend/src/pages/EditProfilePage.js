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
  Chip,
  Divider,
  Stack,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  PhotoCamera,
  Email,
  Phone,
  LocationOn,
  Work,
  Person,
  Check,
  Add,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";

const EditProfilePage = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState([]);

  // États pour le changement de mot de passe
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // Fonction pour évaluer la force du mot de passe
  const getPasswordStrength = (password) => {
    if (!password) return "";

    let strength = 0;

    // Critères d'évaluation
    const lengthCriteria = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Calcul du score
    strength += lengthCriteria ? 1 : 0;
    strength += hasUpperCase ? 1 : 0;
    strength += hasLowerCase ? 1 : 0;
    strength += hasDigit ? 1 : 0;
    strength += hasSpecialChar ? 1 : 0;

    // Détermination de la force
    if (strength <= 2) return "faible";
    if (strength <= 4) return "moyenne";
    return "forte";
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        // Vérifier d'abord si nous avons un utilisateur à éditer dans sessionStorage
        // (cela serait défini lorsqu'on clique sur "Edit" dans la liste des utilisateurs)
        const editingUserStr = sessionStorage.getItem("editingUser");
        if (editingUserStr) {
          try {
            const editingUser = JSON.parse(editingUserStr);
            console.log("Found user to edit in sessionStorage:", editingUser);

            if (editingUser && editingUser.email) {
              // Utiliser cet utilisateur comme point de départ
              setUser(editingUser);
              setForm(editingUser);

              // Gérer les skills
              if (editingUser.skills) {
                if (typeof editingUser.skills === 'string') {
                  try {
                    const parsedSkills = JSON.parse(editingUser.skills);
                    setSkills(Array.isArray(parsedSkills) ? parsedSkills : []);
                  } catch (parseErr) {
                    console.error("Error parsing skills:", parseErr);
                    setSkills([]);
                  }
                } else if (Array.isArray(editingUser.skills)) {
                  setSkills(editingUser.skills);
                } else {
                  setSkills([]);
                }
              } else {
                setSkills([]);
              }

              // Récupérer les données complètes depuis le serveur
              try {
                console.log("Fetching complete user data for email:", editingUser.email);
                const res = await axios.get(`http://localhost:8000/users/email/${editingUser.email}`);
                console.log("Complete user data received:", res.data);

                if (res.data) {
                  setUser(res.data);
                  setForm(res.data);

                  // Mettre à jour les skills avec les données du serveur
                  if (res.data.skills) {
                    if (typeof res.data.skills === 'string') {
                      try {
                        const parsedSkills = JSON.parse(res.data.skills);
                        setSkills(Array.isArray(parsedSkills) ? parsedSkills : []);
                      } catch (parseErr) {
                        console.error("Error parsing skills from server:", parseErr);
                      }
                    } else if (Array.isArray(res.data.skills)) {
                      setSkills(res.data.skills);
                    }
                  }
                }
              } catch (serverErr) {
                console.error("Error fetching complete user data:", serverErr);
                // Continuer avec les données de sessionStorage
              }

              // Nettoyer sessionStorage après utilisation
              sessionStorage.removeItem("editingUser");
              setLoading(false);
              return; // Sortir de la fonction car nous avons déjà les données
            }
          } catch (parseErr) {
            console.error("Error parsing editing user from sessionStorage:", parseErr);
          }
        }

        // Si nous n'avons pas trouvé d'utilisateur à éditer dans sessionStorage,
        // continuer avec la logique existante basée sur l'email de l'URL

        // Si l'email n'est pas fourni dans l'URL, essayer de le récupérer depuis le localStorage
        let userEmail = email;
        if (!userEmail) {
          console.log("Email not provided in URL, trying to get it from localStorage");
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              if (userData && userData.email) {
                userEmail = userData.email;
                console.log("Using email from localStorage:", userEmail);
              }
            } catch (err) {
              console.error("Error parsing user data from localStorage:", err);
            }
          }
        }

        if (!userEmail) {
          throw new Error("No email available to fetch user data");
        }

        try {
          console.log("Fetching user data for email:", userEmail);
          const res = await axios.get(`http://localhost:8000/users/email/${userEmail}`);
          console.log("User data received:", res.data);

          if (!res.data) {
            throw new Error("No user data received from server");
          }

          setUser(res.data);
          setForm(res.data);

          // Gérer les skills correctement
          if (res.data.skills) {
            // Si skills est une chaîne de caractères, essayer de la parser
            if (typeof res.data.skills === 'string') {
              try {
                const parsedSkills = JSON.parse(res.data.skills);
                setSkills(Array.isArray(parsedSkills) ? parsedSkills : []);
              } catch (parseErr) {
                console.error("Error parsing skills:", parseErr);
                setSkills([]);
              }
            } else if (Array.isArray(res.data.skills)) {
              setSkills(res.data.skills);
            } else {
              setSkills([]);
            }
          } else {
            setSkills([]);
          }
        } catch (fetchErr) {
          console.error("Error fetching user data:", fetchErr);

          // Si l'utilisateur est dans le localStorage, l'utiliser comme solution de secours
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              console.log("Using user data from localStorage as fallback:", userData);
              setUser(userData);
              setForm(userData);

              if (userData.skills) {
                setSkills(Array.isArray(userData.skills) ? userData.skills : []);
              } else {
                setSkills([]);
              }
            } catch (parseErr) {
              console.error("Error parsing user data from localStorage:", parseErr);
              throw new Error("Failed to load user data");
            }
          } else {
            throw new Error("Failed to fetch user data and no local data available");
          }
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError(`Error loading profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Fonctions pour le changement de mot de passe
  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpen(true);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordError("");
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPasswordError("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });

    // Évaluer la force du mot de passe si c'est le champ newPassword qui est modifié
    if (name === "newPassword") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError("New password is required");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    setChangingPassword(true);
    setPasswordError("");

    try {
      // Appel API pour changer le mot de passe
      await axios.post(`http://localhost:8000/auth/change-password`, {
        email: user.email,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      toast.success("Password changed successfully!");
      handlePasswordDialogClose();
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Utiliser l'email de l'utilisateur chargé plutôt que celui de l'URL
      const userEmail = user.email;
      let userId = user.id;

      // Vérifier si l'ID est une chaîne de caractères et la convertir en nombre si nécessaire
      if (typeof userId === 'string') {
        userId = parseInt(userId, 10);
        if (isNaN(userId)) {
          console.error("Invalid user ID format:", user.id);
          // Essayer de récupérer l'ID depuis la réponse API
          try {
            const userResponse = await axios.get(`http://localhost:8000/users/email/${userEmail}`);
            if (userResponse.data && userResponse.data.id) {
              userId = userResponse.data.id;
              console.log("Retrieved user ID from API:", userId);
            }
          } catch (idErr) {
            console.error("Failed to retrieve user ID from API:", idErr);
          }
        }
      }

      if (!userEmail) {
        throw new Error("No email available to update user data");
      }

      console.log("Updating user data for email:", userEmail, "with ID:", userId);

      // Préparer les données utilisateur à mettre à jour
      // S'assurer que skills est bien un tableau
      let formattedSkills = skills;
      if (!Array.isArray(formattedSkills)) {
        if (typeof formattedSkills === 'string') {
          try {
            // Essayer de parser si c'est une chaîne JSON
            formattedSkills = JSON.parse(formattedSkills);
            if (!Array.isArray(formattedSkills)) {
              formattedSkills = [formattedSkills]; // Convertir en tableau si ce n'est pas déjà un tableau
            }
          } catch (e) {
            // Si ce n'est pas du JSON valide, le traiter comme une chaîne simple
            formattedSkills = [formattedSkills];
          }
        } else if (formattedSkills) {
          // Si c'est une valeur non-null/undefined mais pas un tableau ou une chaîne
          formattedSkills = [String(formattedSkills)];
        } else {
          // Si c'est null ou undefined
          formattedSkills = [];
        }
      }

      // Filtrer les valeurs vides ou nulles
      formattedSkills = formattedSkills.filter(skill => skill && skill.trim());

      console.log("Formatted skills:", formattedSkills);

      const userData = {
        name: form.name || null,
        phone: form.phone || null,
        location: form.location || null,
        about: form.about || null,
        skills: formattedSkills, // Le backend s'attend à un tableau
      };

      console.log("User data to update:", userData);

      try {
        // Mettre à jour les données utilisateur
        const updateResponse = await axios.patch(`http://localhost:8000/users/email/${userEmail}`, userData);
        console.log("Update response:", updateResponse.data);

        if (!updateResponse.data) {
          throw new Error("No data received from server after update");
        }

        // Mettre à jour l'utilisateur avec les données de la réponse
        const updatedUser = updateResponse.data;
        setUser(updatedUser);

        // Mettre à jour les données utilisateur dans le localStorage et sessionStorage
        // seulement si l'utilisateur connecté est celui qui est en train d'être modifié
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const storedUserData = JSON.parse(storedUser);

            // Vérifier si l'utilisateur connecté est celui qui est en train d'être modifié
            if (storedUserData.email === userEmail) {
              // Utiliser les données de la réponse pour mettre à jour le localStorage
              const updatedUserData = {
                ...storedUserData,
                name: updatedUser.name,
                phone: updatedUser.phone,
                location: updatedUser.location,
                about: updatedUser.about,
                skills: updatedUser.skills,
                profilePic: updatedUser.profilePic
              };
              localStorage.setItem("user", JSON.stringify(updatedUserData));
              console.log("Updated user data in localStorage:", updatedUserData);

              // Mettre à jour également dans sessionStorage si présent
              const sessionUser = sessionStorage.getItem("user");
              if (sessionUser) {
                try {
                  const sessionUserData = JSON.parse(sessionUser);
                  if (sessionUserData.email === userEmail) {
                    sessionStorage.setItem("user", JSON.stringify(updatedUserData));
                    console.log("Updated user data in sessionStorage");
                  }
                } catch (err) {
                  console.error("Error updating user data in sessionStorage:", err);
                }
              }
            } else {
              console.log("User being edited is not the logged-in user, not updating localStorage");
            }
          } catch (err) {
            console.error("Error updating user data in localStorage:", err);
          }
        }

        // Télécharger la photo de profil si sélectionnée
        if (selectedFile && userId) {
          try {
            console.log("Uploading profile picture for user ID:", userId);
            const formData = new FormData();
            formData.append("photo", selectedFile);

            // Ajouter un log pour déboguer
            console.log("Sending photo upload request to:", `http://localhost:8000/users/id/${userId}/photo`);
            console.log("With form data:", selectedFile.name);

            const photoResponse = await axios.patch(
              `http://localhost:8000/users/id/${userId}/photo`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );

            console.log("Photo upload response:", photoResponse.data);

            if (photoResponse.data && photoResponse.data.profilePic) {
              // Mettre à jour l'utilisateur avec la nouvelle photo
              setUser(prev => ({ ...prev, profilePic: photoResponse.data.profilePic }));

              // Mettre à jour le localStorage avec la nouvelle photo si c'est l'utilisateur connecté
              const storedUser = localStorage.getItem("user");
              if (storedUser) {
                try {
                  const storedUserData = JSON.parse(storedUser);
                  if (storedUserData.email === userEmail) {
                    storedUserData.profilePic = photoResponse.data.profilePic;
                    localStorage.setItem("user", JSON.stringify(storedUserData));
                    console.log("Updated profile picture in localStorage");

                    // Mettre à jour également dans sessionStorage si présent
                    const sessionUser = sessionStorage.getItem("user");
                    if (sessionUser) {
                      try {
                        const sessionUserData = JSON.parse(sessionUser);
                        if (sessionUserData.email === userEmail) {
                          sessionUserData.profilePic = photoResponse.data.profilePic;
                          sessionStorage.setItem("user", JSON.stringify(sessionUserData));
                          console.log("Updated profile picture in sessionStorage");
                        }
                      } catch (err) {
                        console.error("Error updating profile picture in sessionStorage:", err);
                      }
                    }
                  }
                } catch (err) {
                  console.error("Error updating profile picture in localStorage:", err);
                }
              }
            }
          } catch (photoErr) {
            console.error("Error uploading profile picture:", photoErr);
            toast.error("Profile updated but failed to upload profile picture");
          }
        }

        toast.success("Profile updated successfully!");

        // Naviguer vers la page de profil avec l'ID de l'utilisateur
        setTimeout(() => {
          if (updatedUser && updatedUser.id) {
            navigate(`/ProfilePage/${updatedUser.id}`);
          } else if (userId) {
            navigate(`/ProfilePage/${userId}`);
          } else {
            // Si l'ID n'est pas disponible, essayer de récupérer l'utilisateur depuis le localStorage
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              try {
                const userData = JSON.parse(storedUser);
                if (userData && userData.id) {
                  navigate(`/ProfilePage/${userData.id}`);
                  return;
                }
              } catch (err) {
                console.error("Error parsing user data from localStorage:", err);
              }
            }
            // Si tout échoue, naviguer vers la page d'accueil
            navigate("/");
          }
        }, 1500);
      } catch (updateErr) {
        console.error("Error updating user data:", updateErr);
        setError(`Update failed: ${updateErr.response?.data?.message || updateErr.message}`);
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(`Update failed: ${err.message}`);
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Profile Error
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || "User not found"}
          </Alert>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>
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
            Edit Profile
          </Typography>
          <Button
            onClick={() => {
              // Naviguer vers la page de profil avec l'ID de l'utilisateur
              if (user && user.id) {
                navigate(`/ProfilePage/${user.id}`);
              } else {
                // Si l'ID n'est pas disponible, essayer de récupérer l'utilisateur depuis le localStorage
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                  try {
                    const userData = JSON.parse(storedUser);
                    if (userData && userData.id) {
                      navigate(`/ProfilePage/${userData.id}`);
                      return;
                    }
                  } catch (err) {
                    console.error("Error parsing user data from localStorage:", err);
                  }
                }
                // Si tout échoue, naviguer vers la page d'accueil
                navigate("/");
              }
            }}
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{ borderRadius: 20, px: 3 }}
          >
            Back to Profile
          </Button>
        </Box>

        {/* Profile Picture Section */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={preview || (user.profilePic ?
                (user.profilePic.startsWith('/profile-pics/') ?
                  `http://localhost:8000/uploads${user.profilePic}` :
                  (user.profilePic.startsWith('http') ?
                    user.profilePic :
                    `http://localhost:8000/uploads/profile-pics/${user.profilePic.split('/').pop()}`
                  )
                ) :
                null
              )}
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
            <IconButton
              color="primary"
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <PhotoCamera />
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Click camera icon to change photo
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Personal Info */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                <Person color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Personal Information
              </Typography>

              <TextField
                label="Full Name"
                name="name"
                fullWidth
                value={form.name || ""}
                onChange={handleChange}
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <TextField
                label="Email"
                name="email"
                fullWidth
                value={form.email || ""}
                disabled
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={form.phone || ""}
                onChange={handleChange}
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <TextField
                label="Location"
                name="location"
                fullWidth
                value={form.location || ""}
                onChange={handleChange}
                margin="normal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    )
                  }
                }}
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Lock />}
                  onClick={handlePasswordDialogOpen}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Change Password
                </Button>
              </Box>
            </Grid>

            {/* About & Skills */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                <Work color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Professional Details
              </Typography>

              <TextField
                label="Role"
                name="role"
                fullWidth
                value={form.role || "Etudiant"}
                disabled
                margin="normal"
                helperText="Contact admin to change role"
                InputProps={{
                  sx: {
                    textTransform: 'capitalize'
                  }
                }}
              />

              <TextField
                label="About Me"
                name="about"
                fullWidth
                multiline
                rows={4}
                value={form.about || ""}
                onChange={handleChange}
                margin="normal"
                sx={{ mt: 2 }}
              />

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Skills & Expertise
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {skills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      color="primary"
                      variant="outlined"
                      deleteIcon={<Check fontSize="small" />}
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Add Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    size="small"
                    fullWidth
                  />
                  <Button
                    onClick={handleAddSkill}
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 20,
                    fontSize: '1rem',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                    }
                  }}
                >
                  {submitting ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Dialog pour changer le mot de passe */}
      <Dialog
        open={passwordDialogOpen}
        onClose={handlePasswordDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Change Password
        </DialogTitle>

        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}

          <DialogContentText sx={{ mb: 2 }}>
            Please enter your current password and a new password to update your account security.
          </DialogContentText>

          <TextField
            label="Current Password"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="New Password"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Indicateur de force du mot de passe */}
          {passwordForm.newPassword && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Force du mot de passe:
                <Box component="span"
                  sx={{
                    ml: 1,
                    fontWeight: 'bold',
                    color: passwordStrength === 'forte'
                      ? 'success.main'
                      : passwordStrength === 'moyenne'
                        ? 'warning.main'
                        : 'error.main'
                  }}
                >
                  {passwordStrength.toUpperCase()}
                </Box>
              </Typography>

              {/* Barre de progression */}
              <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                <Box
                  sx={{
                    height: '100%',
                    width: passwordStrength === 'forte'
                      ? '100%'
                      : passwordStrength === 'moyenne'
                        ? '60%'
                        : '30%',
                    bgcolor: passwordStrength === 'forte'
                      ? 'success.main'
                      : passwordStrength === 'moyenne'
                        ? 'warning.main'
                        : 'error.main',
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>

              {/* Conseils pour un mot de passe fort */}
              {passwordStrength !== 'forte' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom color="primary">
                    Pour un mot de passe fort, incluez:
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2"
                        color={passwordForm.newPassword.length >= 8 ? 'success.main' : 'text.secondary'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        {passwordForm.newPassword.length >= 8 ? '✓' : '○'} Au moins 8 caractères
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2"
                        color={/[A-Z]/.test(passwordForm.newPassword) ? 'success.main' : 'text.secondary'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        {/[A-Z]/.test(passwordForm.newPassword) ? '✓' : '○'} Une lettre majuscule
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2"
                        color={/[a-z]/.test(passwordForm.newPassword) ? 'success.main' : 'text.secondary'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        {/[a-z]/.test(passwordForm.newPassword) ? '✓' : '○'} Une lettre minuscule
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2"
                        color={/\d/.test(passwordForm.newPassword) ? 'success.main' : 'text.secondary'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        {/\d/.test(passwordForm.newPassword) ? '✓' : '○'} Un chiffre
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2"
                        color={/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? 'success.main' : 'text.secondary'}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        {/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword) ? '✓' : '○'} Un caractère spécial (!@#$%...)
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handlePasswordDialogClose}
            variant="outlined"
            disabled={changingPassword}
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={changingPassword}
            startIcon={changingPassword ? <CircularProgress size={20} /> : <Lock />}
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditProfilePage;