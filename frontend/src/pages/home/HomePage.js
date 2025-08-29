import { Link, Navigate } from "react-router-dom";
import { Button, Box, Typography, Stack } from "@mui/material";
import { getCurrentRole } from "../auth/token";

export default function HomePage() {
  const currentRole = getCurrentRole();
  
  // Redirect users directly to their respective dashboards
  if (currentRole) {
    const normalizedRole = currentRole.toLowerCase();
    
    if (normalizedRole === 'student' || normalizedRole === 'etudiant' || normalizedRole === 'apprenant') {
      return <Navigate to="/etudiant/dashboard" replace />;
    }
    
    if (normalizedRole === 'createurdeformation') {
      return <Navigate to="/createur/dashboard" replace />;
    }
    
    if (normalizedRole === 'formateur') {
      return <Navigate to="/formateur/dashboard" replace />;
    }
    
    if (normalizedRole === 'etablissement' || normalizedRole === 'institution') {
      return <Navigate to="/etablissement/dashboard" replace />;
    }
    
    // You can add other role redirects here if needed
    // if (normalizedRole === 'admin') {
    //   return <Navigate to="/admin/dashboard" replace />;
    // }
  }

  return (
    <Box p={4}>
      <Typography variant="h3" mb={4} fontWeight={700} color="#2196f3">
        Bienvenue sur le TP LMS
      </Typography>
      <Typography variant="subtitle1" mb={4}>
        tableaux de bord par rôle :
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          component={Link}
          to="/admin/dashboard"
          variant="contained"
          color="primary"
          size="large"
        >
          Tableau de bord Admin
        </Button>
        <Button
          component={Link}
          to="/etablissement/dashboard"
          variant="contained"
          color="info"
          size="large"
        >
          Tableau de bord Établissement
        </Button>
        <Button
          component={Link}
          to="/createur/dashboard"
          variant="contained"
          color="success"
          size="large"
        >
          Tableau de bord Créateur de Formation
        </Button>
        <Button
          component={Link}
          to="/formateur/dashboard"
          variant="contained"
          color="secondary"
          size="large"
        >
          Tableau de bord Formateur
        </Button>
        <Button
          component={Link}
          to="/etudiant/dashboard"
          variant="contained"
          color="warning"
          size="large"
        >
          Tableau de bord Étudiant
        </Button>
      </Stack>
    </Box>
  );
}
