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
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api/axiosInstance";


const ConfigureSessionList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const styles = {
    primary: {
      borderRadius: 3,
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(25,118,210,0.4)'
      }
    },
    danger: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
      boxShadow: '0 6px 18px rgba(211,47,47,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(211,47,47,0.35)' }
    },
    success: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
      boxShadow: '0 6px 18px rgba(46,125,50,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(46,125,50,0.35)' }
    },
    info: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
      boxShadow: '0 6px 18px rgba(2,136,209,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(2,136,209,0.35)' }
    },
    secondary: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #7b1fa2, #ab47bc)',
      boxShadow: '0 6px 18px rgba(123,31,162,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(123,31,162,0.35)' }
    },
    rounded: { borderRadius: 2 }
  };

  const fetchSessions = () => {
    api.get("/sessions")
      .then(res => setSessions(res.data))
      .catch(err => {
        console.error("Erreur chargement sessions", err);
        toast.error(t('sessions.loadError'));
      });
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('sessions.confirmDelete'))) return;
    try {
      await api.delete(`/sessions/${id}`);
      fetchSessions();
      toast.success(t('sessions.deleteSuccess'));
    } catch (err) {
      console.error("Erreur suppression session", err);
      toast.error(t('sessions.deleteError'));
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
        📅 {t('sessions.configuredSessions')}
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
  src={s.imageUrl ?? "/uploads/sessions/default.png"}
  alt="Session"
  style={{ width: '100%', height: '180px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/uploads/sessions/default.png";
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
        sx={styles.info}
      >
        {t('sessions.detail')}
      </Button>
      <IconButton onClick={() => handleDelete(s.id)} sx={styles.danger}>
        <DeleteIcon sx={{ color: 'white' }} />
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
          size="large"
          onClick={() => navigate("/sessions/add")}
          sx={styles.primary}
        >
          ➕ {t('sessions.newSession')}
        </Button>
      </Box>

      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle>{t('sessions.sessionDetails')}</DialogTitle>
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
          <Button onClick={handleCloseDetail} sx={styles.secondary}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfigureSessionList;
