import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentLandingPage = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get("http://localhost:8000/programs");
        setPrograms(res.data);
      } catch (err) {
        console.error("❌ Failed to load programs:", err.message);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🎓 Choose a Program
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        👋 Welcome! Select a program below to start learning.
      </Typography>

      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program.id}>
            <Card sx={{ transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
              <CardMedia
                component="img"
                height="160"
                image={program.image || "/uploads/default.jpg"}
                alt={program.name}
              />
              <CardContent>
                <Typography variant="h6">{program.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {program.description || "No description provided."}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => navigate(`/student/program/${program.id}`)}
                >
                  View Program
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentLandingPage;
