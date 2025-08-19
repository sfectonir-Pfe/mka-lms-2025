import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Divider,
  Stack,
  InputAdornment,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Email,
  Phone,
  LocationOn,
  Work,
  Person,
  Lock,
} from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { toast } from "react-toastify";

// Composants réutilisables
import ProfileFormField from "./ProfileFormField";
import CountrySelector from "./CountrySelector";
import SkillsManager from "./SkillsManager";
import PasswordChangeDialog from "./PasswordChangeDialog";
import ProfilePictureUpload from "./ProfilePictureUpload";

const EditProfilePage = () => {
  const { t } = useTranslation();
  const { email } = useParams();
  const navigate = useNavigate();

  // États principaux
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [skills, setSkills] = useState([]);
  
  // États pour le téléphone
  const [countryCode, setCountryCode] = useState("+216");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // États pour le changement de mot de passe
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Fonction pour traduire le rôle
  const translateRole = (role) => {
    if (!role) return t('role.etudiant');
    const roleKey = role.toLowerCase();
    return t(`role.${roleKey}`);
  };

  // Fonction pour extraire le code pays et le numéro du téléphone
  const extractPhoneParts = (phone) => {
    const countries = [
      "+33", "+1", "+44", "+49", "+34", "+39", "+212", "+213", "+216", "+20",
      "+966", "+971", "+7", "+86", "+81", "+82", "+91", "+55", "+52", "+54",
      "+61", "+64", "+27", "+234", "+254", "+90", "+98", "+92", "+880", "+84",
      "+66", "+65", "+60", "+62", "+63", "+32", "+31", "+41", "+43", "+46",
      "+47", "+45", "+358", "+48", "+420", "+36", "+30", "+351", "+353"
    ];
    
    for (const code of countries) {
      if (phone && phone.startsWith(code)) {
        return { countryCode: code, phoneNumber: phone.substring(code.length) };
      }
    }
    return { countryCode: "+216", phoneNumber: phone || "" };
  };

  // Charger les données utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        // Vérifier sessionStorage pour l'édition
        const editingUserStr = sessionStorage.getItem("editingUser");
        if (editingUserStr) {
          const editingUser = JSON.parse(editingUserStr);
          if (editingUser?.email) {
            setUser(editingUser);
            setForm(editingUser);
            setSkills(Array.isArray(editingUser.skills) ? editingUser.skills : []);
            
            // Récupérer les données complètes
            try {
              const res = await api.get(`/users/email/${editingUser.email}`);
              if (res.data) {
                setUser(res.data);
                setForm(res.data);
                setSkills(Array.isArray(res.data.skills) ? res.data.skills : []);
              }
            } catch (serverErr) {
              console.error("Error fetching complete user data:", serverErr);
            }
            
            sessionStorage.removeItem("editingUser");
            setLoading(false);
            return;
          }
        }

        // Logique existante pour récupérer l'utilisateur
        let userEmail = email || JSON.parse(localStorage.getItem("user"))?.email;
        if (!userEmail) throw new Error("No email available");

        const res = await api.get(`/users/email/${userEmail}`);
        if (!res.data) throw new Error("No user data received");

        setUser(res.data);
        setForm(res.data);
        setSkills(Array.isArray(res.data.skills) ? res.data.skills : []);

        // Extraire les parties du téléphone
        if (res.data.phone) {
          const { countryCode: code, phoneNumber: number } = extractPhoneParts(res.data.phone);
          setCountryCode(code);
          setPhoneNumber(number);
        }

      } catch (err) {
        console.error("Error loading user:", err);
        setError(`Error loading profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  // Gestionnaires d'événements
  const handleChange = (e) => {
    if (e.target.name === 'phone') {
      setPhoneNumber(e.target.value);
      setForm({ ...form, phone: countryCode + e.target.value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleCountryChange = (newCountryCode) => {
    setCountryCode(newCountryCode);
    setForm({ ...form, phone: newCountryCode + phoneNumber });
  };

  const handleSkillsChange = (newSkills) => {
    setSkills(newSkills);
  };

  const handleImageChange = (file) => {
    setSelectedFile(file);
  };

  // Gestion du changement de mot de passe
  const handlePasswordChange = async (passwordData) => {
    if (!passwordData.currentPassword || !passwordData.newPassword || 
        passwordData.newPassword !== passwordData.confirmPassword || 
        passwordData.newPassword.length < 6) {
      setPasswordError(t('profile.passwordValidationError'));
      return;
    }

    setChangingPassword(true);
    setPasswordError("");

    try {
      await api.post(`/auth/change-password`, {
        email: user.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        sendNotification: true
      });

      toast.success(t('profile.passwordChangedSuccess'));
      toast.info(t('profile.passwordChangeEmailSent'));
      setPasswordDialogOpen(false);
    } catch (error) {
      setPasswordError(error.response?.data?.message || t('profile.passwordChangeError'));
    } finally {
      setChangingPassword(false);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const userEmail = user.email;
      let userId = user.id;

      if (typeof userId === 'string') {
        userId = parseInt(userId, 10);
        if (isNaN(userId)) {
          const userResponse = await api.get(`/users/email/${userEmail}`);
          if (userResponse.data?.id) {
            userId = userResponse.data.id;
          }
        }
      }

      if (!userEmail) throw new Error("No email available");

      // Mettre à jour les données utilisateur
      const userData = {
        name: form.name || null,
        phone: form.phone || null,
        location: form.location || null,
        about: form.about || null,
        skills: skills.filter(skill => skill && skill.trim()),
      };

      const updateResponse = await api.patch(`/users/email/${userEmail}`, userData);
      const updatedUser = updateResponse.data;
      setUser(updatedUser);

      // Mettre à jour le localStorage si c'est l'utilisateur connecté
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const storedUserData = JSON.parse(storedUser);
          if (storedUserData.email === userEmail) {
            const updatedUserData = { ...storedUserData, ...userData };
            localStorage.setItem("user", JSON.stringify(updatedUserData));
          }
        } catch (err) {
          console.error("Error updating localStorage:", err);
        }
      }

      // Upload de la photo si sélectionnée
      if (selectedFile && userId) {
        try {
          const formData = new FormData();
          formData.append("photo", selectedFile);
          
          const photoResponse = await api.patch(
            `/users/id/${userId}/photo`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          if (photoResponse.data?.profilePic) {
            setUser(prev => ({ ...prev, profilePic: photoResponse.data.profilePic }));
          }
        } catch (photoErr) {
          console.error("Error uploading photo:", photoErr);
          toast.error(t('profile.profileUpdatePartialError'));
        }
      }

      toast.success(t('profile.profileUpdatedSuccess'));

      // Navigation et rafraîchissement
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('userProfileUpdated', {
          detail: { updatedUser: updatedUser || user }
        }));

        if (updatedUser?.id) {
          navigate(`/ProfilePage/${updatedUser.id}`);
          setTimeout(() => window.location.reload(), 100);
        } else if (userId) {
          navigate(`/ProfilePage/${userId}`);
          setTimeout(() => window.location.reload(), 100);
        } else {
          navigate("/");
          window.location.reload();
        }
      }, 1500);

    } catch (err) {
      console.error("Update error:", err);
      setError(`Update failed: ${err.message}`);
      toast.error(t('profile.profileUpdateError'));
    } finally {
      setSubmitting(false);
    }
  };

  // Navigation de retour
  const handleBackToProfile = () => {
    if (user?.id) {
      navigate(`/ProfilePage/${user.id}`);
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.id) {
        navigate(`/ProfilePage/${storedUser.id}`);
      } else {
        navigate("/");
      }
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
            {t('profile.profileError')}
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || t('profile.userNotFound')}
          </Alert>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => window.location.reload()}>
              {t('common.tryAgain')}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/')}>
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
        {/* Header */}
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
            {t('profile.editProfile')}
          </Typography>
          <Button
            onClick={handleBackToProfile}
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{ borderRadius: 20, px: 3 }}
          >
            {t('profile.backToProfile')}
          </Button>
        </Box>

        {/* Photo de profil */}
        <ProfilePictureUpload
          currentImage={user.profilePic}
          onImageChange={handleImageChange}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Informations personnelles */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                <Person color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {t('profile.personalInfo')}
              </Typography>

              <ProfileFormField
                label={t('profile.fullName')}
                name="name"
                value={form.name}
                onChange={handleChange}
                startIcon={<Person color="action" />}
              />

              <ProfileFormField
                label={t('profile.email')}
                name="email"
                value={form.email}
                disabled
                startIcon={<Email color="action" />}
              />

              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  {t('profile.phone')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CountrySelector
                    countryCode={countryCode}
                    onCountryChange={handleCountryChange}
                  />
                  <ProfileFormField
                    name="phone"
                    value={phoneNumber}
                    onChange={handleChange}
                    placeholder={t('users.phonePlaceholder')}
                    startIcon={<Phone color="action" />}
                  />
                </Box>
              </Box>

              <ProfileFormField
                label={t('profile.location')}
                name="location"
                value={form.location}
                onChange={handleChange}
                startIcon={<LocationOn color="action" />}
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Lock />}
                  onClick={() => setPasswordDialogOpen(true)}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  {t('profile.changePassword')}
                </Button>
              </Box>
            </Grid>

            {/* Détails professionnels */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                <Work color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {t('profile.professionalDetails')}
              </Typography>

              <ProfileFormField
                label={t('profile.role')}
                name="role"
                value={translateRole(form.role || "Etudiant")}
                disabled
                helperText={t('profile.contactAdminRole')}
                InputProps={{ sx: { textTransform: 'capitalize' } }}
              />

              <ProfileFormField
                label={t('profile.aboutMe')}
                name="about"
                value={form.about}
                onChange={handleChange}
                multiline
                rows={4}
              />

              <Box sx={{ mt: 3 }}>
                <SkillsManager
                  skills={skills}
                  onSkillsChange={handleSkillsChange}
                />
              </Box>
            </Grid>

            {/* Bouton de soumission */}
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
                      {t('common.saving')}
                    </>
                  ) : (
                    t('common.saveChanges')
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Dialogue de changement de mot de passe */}
      <PasswordChangeDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        onSubmit={handlePasswordChange}
        loading={changingPassword}
        error={passwordError}
      />
    </Container>
  );
};

export default EditProfilePage; 