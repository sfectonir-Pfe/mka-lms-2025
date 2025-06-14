// ✅ Redesigned ConfigureSessionList.jsx with modern card layout and full image support

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Chip,
  List,
  ListItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ConfigureSessionList = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchSessions = () => {
    axios.get("http://localhost:8000/sessions")
      .then(res => setSessions(res.data))
      .catch(err => {
        console.error("Erreur chargement sessions", err);
        alert("Erreur chargement sessions.");
      });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette session ?")) return;
    try {
      await axios.delete(`http://localhost:8000/sessions/${id}`);
      fetchSessions();
    } catch (err) {
      console.error("Erreur suppression session", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedSession(null);
  };

  return (
    <Box mt={4} p={3} maxWidth="1200px" mx="auto">
      <Typography variant="h4" align="center" gutterBottom>
        📅 Sessions configurées
      </Typography>

      <Grid container spacing={4}>
        {sessions.map((s) => (
          <Grid item xs={12} md={6} lg={4} key={s.id}>
           <Paper
  elevation={3}
  sx={{
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    transition: '0.3s',
    '&:hover': {
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
      transform: 'translateY(-4px)',
    },
  }}
>
  <Box sx={{ position: 'relative' }}>
    <img
  src={s.imageUrl ?? "http://localhost:8000/uploads/sessions/default.png"}
  alt="Session"
  style={{ width: '100%', height: '180px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "http://localhost:8000/uploads/sessions/default.png";
  }}
/>

    <Chip
      label={s.program.name}
      color="primary"
      size="small"
      sx={{
        position: 'absolute',
        top: 10,
        left: 10,
        bgcolor: '#1976d2',
        color: 'white',
        fontWeight: 'bold',
        boxShadow: 1,
      }}
    />
  </Box>

  <Box p={2}>
    <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
      Session: {s.program.name}
    </Typography>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      📆 {new Date(s.startDate).toLocaleDateString()} ➜ {new Date(s.endDate).toLocaleDateString()}
    </Typography>

    <Typography variant="subtitle2" mt={2}>Modules & Cours:</Typography>
    <List dense>
      {s.modules.map((m) => (
        <ListItem key={m.id} sx={{ display: 'block', py: 0.5 }}>
          <Typography fontWeight="bold">📦 {m.module.name}</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mt={0.5}>
            {(m.courses || []).map(c => (
              <Chip key={c.id} label={`📘 ${c.course.title}`} size="small" />
            ))}
          </Stack>
        </ListItem>
      ))}
    </List>

    <Box mt={2} display="flex" justifyContent="space-between">
      <Button
        variant="outlined"
        size="small"
        startIcon={<VisibilityIcon />}
        onClick={() => handleViewDetails(s)}
      >
        Détail
      </Button>
      <IconButton color="error" onClick={() => handleDelete(s.id)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  </Box>
</Paper>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/sessions/add")}
        >
          ➕ Nouvelle session
        </Button>
      </Box>

      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle>Détails de la session</DialogTitle>
        <DialogContent dividers>
          {selectedSession && (
            <Box>
              <Typography variant="h6">{selectedSession.program.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Du {new Date(selectedSession.startDate).toLocaleDateString()} au {new Date(selectedSession.endDate).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {selectedSession.modules.map((m) => (
                <Box key={m.id} mb={2}>
                  <Typography fontWeight="bold">📦 {m.module.name}</Typography>
                  {(m.courses || []).map((c) => (
                    <Box key={c.id} ml={2} mt={1}>
                      <Typography>📘 {c.course.title}</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                        {(c.contenus || []).map((ct) => (
                          <a
                            key={ct.id}
                            href={ct.contenu.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Chip
                              label={`📄 ${ct.contenu.title}`}
                              size="small"
                              clickable
                              sx={{ cursor: "pointer" }}
                            />
                          </a>
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfigureSessionList;
