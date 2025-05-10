import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
  Avatar,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

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
    <div>
      {/* Hero Section */}
      <Box sx={{ backgroundColor: "#f8f9fa", py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome to Master Knowledge Academy LMS
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Learn, Grow, Excel
        </Typography>
        <Box sx={{ maxWidth: 400, mx: "auto", mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for programs..."
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
        </Box>
        <Button variant="contained" color="primary" size="large">
          EXPLORE PROGRAMS
        </Button>
      </Box>

      {/* Programs Section */}
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Popular Programs
        </Typography>

        <Box sx={{ position: "relative", mt: 4 }}>
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              top: "40%",
              left: 0,
              zIndex: 2,
              backgroundColor: "white",
              boxShadow: 1,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              top: "40%",
              right: 0,
              zIndex: 2,
              backgroundColor: "white",
              boxShadow: 1,
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              scrollBehavior: "smooth",
              px: 6,
              py: 2,
            }}
          >
            {programs.length === 0 ? (
              <Typography sx={{ mt: 2 }}>No programs available.</Typography>
            ) : (
              programs.map((program) => (
                <Card
                  key={program.id}
                  sx={{
                    minWidth: 280,
                    flexShrink: 0,
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={program.image || "/uploads/default.jpg"}
                    alt={program.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {program.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {program.description || "No description provided."}
                    </Typography>
                    <Button
                      onClick={() => navigate(`/student/program/${program.id}`)}
                      variant="outlined"
                    >
                      GET STARTED
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Box>
      </Container>

      {/* Testimonials */}
      <Container className="py-5">
        <Typography variant="h5" align="center" gutterBottom>
          What Our Students Say
        </Typography>
        <Grid container justifyContent="center" spacing={4}>
          {[
            {
              name: "aaa",
              text: "This platform made learning so easy!",
              avatar: "/uploads/avatar1.png",
            },
            {
              name: "Majd",
              text: "Amazing content, clean and professional UI!",
              avatar: "/uploads/avatar2.png",
            },
          ].map((feedback, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ p: 2, textAlign: "center" }}>
                <Avatar
                  src={feedback.avatar}
                  sx={{ width: 60, height: 60, margin: "0 auto" }}
                />
                <Typography variant="body1" className="mt-3">
                  "{feedback.text}"
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  className="mt-2"
                >
                  - {feedback.name}
                </Typography>
                <Box mt={1}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} fontSize="small" color="warning" />
                  ))}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box className="bg-dark text-white text-center py-4">
        <Container>
          <Typography variant="body2" gutterBottom>
            © 2025 Master Knowledge Academy. All rights reserved.
          </Typography>
          <Box>
            <FacebookIcon className="mx-2" />
            <InstagramIcon className="mx-2" />
            <LinkedInIcon className="mx-2" />
          </Box>
        </Container>
      </Box>
    </div>
  );
}
