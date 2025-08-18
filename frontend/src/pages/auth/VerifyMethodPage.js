import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button, Paper } from "@mui/material";

const VerifyMethodPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const phone = location.state?.phone || "";

  const handleEmail = () => {
    navigate("/verify-email", { state: { email } });
  };

  const handleSMS = () => {
    navigate("/verify-account", { state: { email, phone } });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Choisissez votre méthode de vérification
        </Typography>

        <Typography align="center" sx={{ mb: 3 }}>
          Pour continuer, veuillez vérifier votre identité par :
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleEmail}
            disabled={!email}
          >
            📧 Vérification par Email
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleSMS}
            disabled={!phone}
          >
            📱 Vérification par SMS
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyMethodPage;
