import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Collapse,
  Divider,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import axios from "axios";


const SeanceFormateurList = ({ onAnimer, onRefresh }) => {
  const { t } = useTranslation();
  const [seances, setSeances] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")); // 🔐

  useEffect(() => {
    if (user?.id) {
      fetchSeances();
    }
  }, [user?.id]);

  // Exposer la fonction de rafraîchissement
  useEffect(() => {
    if (onRefresh) {
      onRefresh(refreshSeances);
    }
  }, [onRefresh]);

  const fetchSeances = () => {
    console.log('Fetching seances for user:', user.id);
    
    // Debug: Vérifier toutes les séances d'abord
    axios.get('http://localhost:8000/seance-formateur')
      .then(allRes => {
        console.log('ALL seances in database:', allRes.data);
      })
      .catch(err => console.log('Error fetching all seances:', err));
    
    axios
      .get(`http://localhost:8000/seance-formateur/formateur/${user.id}`)
      .then((res) => {
        console.log('Seances received for user', user.id, ':', res.data);
        if (res.data.length === 0) {
          console.log('No seances found for user, trying fallback...');
          // Récupérer les Session2 comme fallback
          axios.get('http://localhost:8000/session2/simple')
            .then(sessionRes => {
              console.log('Session2 fallback data:', sessionRes.data);
              const adaptedSessions = sessionRes.data.map(s => ({
                id: s.id,
                title: s.name,
                startTime: s.createdAt,
                buildProgram: { program: { name: 'Session générale' } }
              }));
              setSeances(adaptedSessions);
            })
            .catch(() => {
              console.log('No Session2 fallback available');
              setSeances([]);
            });
        } else {
          console.log('Setting seances:', res.data);
          setSeances(res.data);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement des séances:", err);
        setSeances([]);
      });
  };

  // Fonction pour rafraîchir les séances (exposée pour être utilisée par d'autres composants)
  const refreshSeances = () => {
    fetchSeances();
  };

  const handleDelete = (id) => {
    if (window.confirm(t('seances.confirmDelete'))) {
      axios
        .delete(`http://localhost:8000/seance-formateur/${id}`)
        .then(() => fetchSeances());
    }
  };

  const toggleDetails = (seance) => {
    const id = seance.id;
    if (expandedId === id) {
      setExpandedId(null); // collapse
    } else {
      setExpandedId(id);
      // simulate fetching details
      axios
        .get(`http://localhost:8000/seance-formateur/details/${seance.buildProgramId}`)
        .then((res) => {
          setDetails((prev) => ({ ...prev, [id]: res.data }));
        })
        .catch((err) => console.error("Erreur chargement détails:", err));
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        📅 {t('seances.mySessions')} (User ID: {user?.id})
      </Typography>
      
      <Button 
        variant="outlined" 
        size="small" 
        onClick={() => {
          console.log('Current user:', user);
          console.log('Current seances:', seances);
          fetchSeances();
        }}
        sx={{ mb: 2 }}
      >
        🔍 Debug & Refresh
      </Button>

      {seances.length === 0 ? (
        <Typography color="text.secondary">{t('seances.noSessions')}</Typography>
      ) : (
        seances.map((s) => (
          <Paper key={s.id} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{s.title}</Typography>
            <Typography variant="body2">
              🕒 {new Date(s.startTime).toLocaleString()}
            </Typography>

            <Stack direction="row" spacing={1} mt={1}>
              <Chip
                label={`${t('seances.program')}: ${s.buildProgram.program.name}`}
                color="info"
              />
            </Stack>

            <Box mt={2} display="flex" gap={1}>
              {onAnimer && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => onAnimer(s)}
                >
                  {t('seances.animateSession')}
                </Button>
              )}
              
              <Button
                variant="outlined"
                onClick={() => window.open(`/formateur/seance/${s.id}`, '_blank')}
              >
                Ouvrir dans un nouvel onglet
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => toggleDetails(s)}
              >
                {expandedId === s.id ? t('common.hide') : t('common.details')}
              </Button>

              <Button
                variant="outlined"
                color="info"
                onClick={fetchSeances}
              >
                🔄 Actualiser
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setSelectedSeance(s);
                  setFeedbackOpen(true);
                }}
              >
                💬 Feedback
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(s.id)}
              >
                {t('common.delete')}
              </Button>
            </Box>

            {/* Collapse zone for details */}
            <Collapse in={expandedId === s.id}>
  <Box mt={2} pl={2}>
    <Typography variant="subtitle1" gutterBottom>
      📘 {t('seances.programDetails')}
    </Typography>
    {details[s.id] ? (
      <>
        <Typography variant="body1" fontWeight="bold">
          {t('seances.program')}: {details[s.id].program.name}
        </Typography>

        {details[s.id].modules.map((mod, modIndex) => (
          <Box key={modIndex} pl={2} mt={2}>
            <Typography>📗 {t('seances.module')}: {mod.module.name}</Typography>

            {mod.courses.map((course, courseIndex) => (
              <Box key={courseIndex} pl={2} mt={1}>
                <Typography>📘 {t('seances.course')}: {course.course.title}</Typography>

                {course.contenus.map((ct, ctIndex) => (
                  <Typography key={ctIndex} pl={4}>
                    📄 {t('seances.content')}: {ct.contenu.title}
                  </Typography>
                ))}
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </>
    ) : (
      <Typography color="text.secondary">{t('common.loading')}</Typography>
    )}
  </Box>
</Collapse>

          </Paper>
        ))
      )}
      

    </Box>
  );
};

export default SeanceFormateurList;
