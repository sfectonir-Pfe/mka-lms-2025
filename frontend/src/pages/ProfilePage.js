import React from "react";
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

const dummyUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+216 12 345 678",
  role: "Etudiant",
  profilePic: "/uploads/avatar-placeholder.png",
  location: "Tunis, Tunisia",
  skills: ["React", "Node.js", "SQL"],
  about: "I'm a passionate full-stack developer who loves building LMS platforms and learning tools.",
};

const UserProfilePage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              alt={dummyUser.name}
              src={dummyUser.profilePic}
              sx={{ width: 120, height: 120, margin: "auto" }}
            />
            <Typography variant="h6" mt={2}>
              {dummyUser.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dummyUser.role}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              href="/EditProfilePage"
            >
              Edit Profile
            </Button>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="h6">About Me</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {dummyUser.about}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Contact Info</Typography>
            <Typography>Email: {dummyUser.email}</Typography>
            <Typography>Phone: {dummyUser.phone}</Typography>
            <Typography>Location: {dummyUser.location}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Skills</Typography>
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {dummyUser.skills.map((skill, idx) => (
                <Chip key={idx} label={skill} color="primary" />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;