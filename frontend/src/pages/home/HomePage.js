import { Link } from "react-router-dom";
import { Button, Box, Typography, Stack } from "@mui/material";

export default function HomePage() {
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
        {/* <Button
          component={Link}
          to="/etablissement/dashboard"
          variant="contained"
          color="info"
          size="large"
        >
          Tableau de bord Établissement
        </Button> */}
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
