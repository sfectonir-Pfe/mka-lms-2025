import React, { useState } from "react";
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

const EditProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+216 12 345 678",
    role: "Etudiant",
    location: "Tunis, Tunisia",
    skills: ["React", "Node.js"],
    about: "I'm a full-stack developer building LMS systems.",
    profilePic: "", // preview URL
    profileFile: null,
    newSkill: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      profileFile: file,
      profilePic: file ? URL.createObjectURL(file) : "",
    }));
  };

  const handleAddSkill = () => {
    if (formData.newSkill.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill],
        newSkill: "",
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // TODO: Send to backend with Axios (and FormData if file exists)
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} textAlign="center">
              <Avatar
                src={formData.profilePic}
                alt="Profile"
                sx={{ width: 100, height: 100, mx: "auto" }}
              />
              <Button component="label" variant="outlined" size="small" sx={{ mt: 2 }}>
                Upload Photo
                <input hidden accept="image/*" type="file" onChange={handleFileChange} />
              </Button>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="About Me"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Skills</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                    {formData.skills.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="primary"
                      />
                    ))}
                  </Box>
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <TextField
                      label="Add Skill"
                      value={formData.newSkill}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          newSkill: e.target.value,
                        }))
                      }
                      size="small"
                    />
                    <Button onClick={handleAddSkill} variant="contained">
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfilePage;