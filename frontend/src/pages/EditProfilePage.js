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
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

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
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
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

      if (!userEmail) {
        throw new Error("No email available to update user data");
      }

      console.log("Updating user data for email:", userEmail);

      // Convertir les skills en JSON string pour éviter les problèmes de format
      const userData = {
        name: form.name || null,
        phone: form.phone || null,
        location: form.location || null,
        about: form.about || null,
        skills: skills, // Le backend s'attend à un tableau
      };

      console.log("User data to update:", userData);

      try {
        const updateResponse = await axios.patch(`http://localhost:8000/users/email/${userEmail}`, userData);
        console.log("Update response:", updateResponse.data);

        // Mettre à jour l'utilisateur avec les données de la réponse
        setUser(updateResponse.data);

        // Mettre à jour les données utilisateur dans le localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const storedUserData = JSON.parse(storedUser);
            // Utiliser les données de la réponse pour mettre à jour le localStorage
            const updatedUserData = {
              ...storedUserData,
              name: updateResponse.data.name,
              phone: updateResponse.data.phone,
              location: updateResponse.data.location,
              about: updateResponse.data.about,
              skills: updateResponse.data.skills,
              profilePic: updateResponse.data.profilePic
            };
            localStorage.setItem("user", JSON.stringify(updatedUserData));
            console.log("Updated user data in localStorage:", updatedUserData);
          } catch (err) {
            console.error("Error updating user data in localStorage:", err);
          }
        }

        // Télécharger la photo de profil si sélectionnée
        if (selectedFile) {
          try {
            console.log("Uploading profile picture for user ID:", user.id);
            const formData = new FormData();
            formData.append("photo", selectedFile);
            const photoResponse = await axios.patch(
              `http://localhost:8000/users/id/${user.id}/photo`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log("Photo upload response:", photoResponse.data);

            // Mettre à jour l'utilisateur avec la nouvelle photo
            setUser(prev => ({ ...prev, profilePic: photoResponse.data.profilePic }));

            // Mettre à jour le localStorage avec la nouvelle photo
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              try {
                const storedUserData = JSON.parse(storedUser);
                storedUserData.profilePic = photoResponse.data.profilePic;
                localStorage.setItem("user", JSON.stringify(storedUserData));
                console.log("Updated profile picture in localStorage");
              } catch (err) {
                console.error("Error updating profile picture in localStorage:", err);
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
            component={Link}
            to={`/ProfilePage/${user.id}`}
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