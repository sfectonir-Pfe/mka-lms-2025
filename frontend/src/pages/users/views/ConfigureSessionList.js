import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
    <Box mt={4} p={3} maxWidth="1000px" mx="auto">
      <Typography variant="h4" gutterBottom align="center">
        📆 Sessions configurées
      </Typography>

      {sessions.length === 0 ? (
        <Typography color="text.secondary" align="center">
          Aucune session configurée.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {sessions.map((s) => (
            <Grid item xs={12} md={6} key={s.id}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: 'relative' }}>
                <Typography variant="h6" gutterBottom>{s.program.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  🗓️ Du <strong>{new Date(s.startDate).toLocaleDateString()}</strong> au <strong>{new Date(s.endDate).toLocaleDateString()}</strong>
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>Modules & Cours:</Typography>
                <List dense>
                  {s.modules.map((m) => (
                    <ListItem key={m.id} alignItems="flex-start">
                      <ListItemText
                        primary={<Typography fontWeight="bold">📦 {m.module.name}</Typography>}
                        secondary={
                          <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                            {(m.courses || []).map(c => (
                              <Chip key={c.id} label={`📘 ${c.course.title}`} size="small" />
                            ))}
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

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
                      style={{ textDecoration: "none" }}
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
