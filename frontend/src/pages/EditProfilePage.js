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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/users/email/${email}`);
        setUser(res.data);
        setForm(res.data);
        if (res.data.skills) {
          setSkills(Array.isArray(res.data.skills) ? res.data.skills : []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const userData = {
        name: form.name || null,
        phone: form.phone || null,
        location: form.location || null,
        about: form.about || null,
        skills: skills,
      };

      await axios.patch(`http://localhost:8000/users/email/${email}`, userData);

      if (selectedFile) {
        const formData = new FormData();
        formData.append("photo", selectedFile);
        await axios.patch(
          `http://localhost:8000/users/id/${user.id}/photo`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      toast.success("Profile updated successfully!");
      setTimeout(() => navigate(`/ProfilePage/${user.id}`), 1500);
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
              src={preview || (user.profilePic ? `http://localhost:8000/uploads/profile-pics/${user.profilePic.split('/').pop()}` : null)}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Email"
                name="email"
                fullWidth
                value={form.email || ""}
                disabled
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={form.phone || ""}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Location"
                name="location"
                fullWidth
                value={form.location || ""}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                }}
              />
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
                value={form.role || ""}
                disabled
                margin="normal"
                helperText="Contact admin to change role"
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
    </Container>
  );
};

export default EditProfilePage;