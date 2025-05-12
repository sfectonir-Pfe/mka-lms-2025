import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, CircularProgress, Typography, Grid } from "@mui/material";
import axios from "axios";
import ModuleList from "./users/views/ModuleList";

const ModulePage = () => {
  const { programId } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/modules/by-program/${programId}`)

      .then((res) => {
        setModules(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch modules", err);
        setLoading(false);
      });
  }, [programId]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" mt={3}>
        Modules du programme {programId}
      </Typography>

      {loading ? (
        <Grid container justifyContent="center" sx={{ height: 300 }}>
          <CircularProgress />
        </Grid>
      ) : (
        <ModuleList modules={modules} setModules={setModules} programId={programId} />
      )}
    </Container>
  );
};

export default ModulePage;
