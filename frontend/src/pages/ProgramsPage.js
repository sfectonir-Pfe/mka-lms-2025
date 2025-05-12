import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, CircularProgress, Grid, Typography } from "@mui/material";
import ProgramList from "./users/views/ProgramList";

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/programs") // ✅ Fetch programs
      .then((res) => {
        setPrograms(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" mt={3} mb={2}>
        Programs Section
      </Typography>
      {loading ? (
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "300px" }}>
          <CircularProgress color="primary" />
        </Grid>
      ) : (
        <ProgramList programs={programs} />
      )}
    </Container>
  );
};

export default ProgramsPage;
