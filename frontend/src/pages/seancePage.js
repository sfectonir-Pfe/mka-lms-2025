import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';

const SeancePage = () => {
  const navigate = useNavigate();

  const handleJoinMeeting = () => {
    // remplace par ton lien de meeting ou logique de redirection
    window.open('https://ton-lien-de-meeting.com', '_blank');
  };

  const handleViewRecordings = () => {
    navigate('/seance/recordings');
  };

  const handleViewProgram = () => {
    navigate('/programsPage'); // ou '/seance/programme' selon ta route
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestion de la Séance
      </Typography>

      <Stack direction="row" spacing={2} mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<VideoCallIcon />}
          onClick={handleJoinMeeting}
        >
          Rejoindre le Meeting
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<PlayCircleOutlineIcon />}
          onClick={handleViewRecordings}
        >
          Voir les Enregistrements
        </Button>

        <Button
          variant="outlined"
          startIcon={<MenuBookIcon />}
          onClick={handleViewProgram}
        >
          Voir le Programme
        </Button>
      </Stack>
    </Box>
  );
};

export default SeancePage;
