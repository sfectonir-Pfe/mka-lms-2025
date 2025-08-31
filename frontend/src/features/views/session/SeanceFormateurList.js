import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { getCurrentRole } from '../../../pages/auth/token';
import RoleGate from '../../../pages/auth/RoleGate';

import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Collapse,
  Divider,
  Rating,
  Chip,
} from "@mui/material";
import api from "../../../api/axiosInstance";
const SeanceFormateurList = ({ seances, onAnimer, onDelete, fetchSeances, setSelectedSeance, setFeedbackOpen }) => {
  const { t } = useTranslation();
  const currentRole = getCurrentRole()?.toLowerCase();
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});
  const [feedbackAverages, setFeedbackAverages] = useState({});

  useEffect(() => {
    if (!seances || seances.length === 0) {
      setFeedbackAverages({});
      return;
    }
    
    const fetchAverages = async () => {
      const avgObj = {};
      
      for (const seance of seances) {
        try {
          const res = await api.get(`/feedback/seance/${seance.id}`);
          const feedbacks = res.data;
          console.log(`Feedbacks pour séance ${seance.id}:`, feedbacks);
          
          if (Array.isArray(feedbacks) && feedbacks.length > 0) {
            const validRatings = feedbacks
              .map(f => f.averageRating)
              .filter(rating => rating !== null && rating !== undefined && rating > 0);
            
            if (validRatings.length > 0) {
              const average = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
              avgObj[seance.id] = average;
            }
          }
        } catch (error) {
          console.error(`Erreur feedback pour séance ${seance.id}:`, error);
        }
      }
      
      console.log('Feedback averages calculées:', avgObj);
      setFeedbackAverages(avgObj);
    };
    
    fetchAverages();
  }, [seances]);

  const toggleDetails = (seance) => {
    const id = seance.id;
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      api.get(`/seance-formateur/details/${seance.session2.id}`)
        .then((res) => setDetails((prev) => ({ ...prev, [id]: res.data })))
        .catch((err) => console.error("Erreur chargement détails:", err));
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        📅 {t('seances.sessionsList')}
      </Typography>
      {(!seances || seances.length === 0) ? (
        <Typography color="text.secondary">{t('seances.noSessions')}</Typography>
      ) : (
        seances.map((s) => (
          <Paper key={s.id} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{s.title}</Typography>
            {/* Affichage de la moyenne des feedbacks */}
            {feedbackAverages[s.id] && (
              <Typography variant="body2" color="secondary">
                ⭐ {t('seances.averageRating')}: {feedbackAverages[s.id].toFixed(1)} / 5
              </Typography>
            )}
            <Typography variant="body2">
              🕒 {new Date(s.startTime).toLocaleString()}
            </Typography>
            <Box mt={2} display="flex" gap={1}>
              
              
              <Button
                variant="outlined"
                onClick={() =>
                  (window.location.href = `/formateur/seance/${s.id}`)
                }
              >
                {currentRole === 'formateur' ? 'Animer la séance' : 'Rejoindre la séance'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => toggleDetails(s)}
              >
                {expandedId === s.id ? t('common.hide') : t('common.details')}
              </Button>

              {fetchSeances && (
                <Button
                  variant="outlined"
                  color="info"
                  onClick={fetchSeances}
                >
                  🔄 {t('seances.refresh')}
                </Button>
              )}

              {setSelectedSeance && setFeedbackOpen && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setSelectedSeance(s);
                    setFeedbackOpen(true);
                  }}
                >
                  💬 {t('seances.feedback')}
                </Button>
              )}
              <RoleGate roles={['admin', 'formateur']}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete && onDelete(s.id)}
              >
                {t('common.delete')}
              </Button>
              </RoleGate>
            </Box>
            <Collapse in={expandedId === s.id}>
              <Box mt={2} pl={2}>
                <Typography variant="subtitle1" gutterBottom>
                  📘 {t('seances.programDetails')}
                </Typography>
                {details[s.id] ? (
                  <>
                    <Typography variant="body1" fontWeight="bold">
                      {t('seances.program')} : {details[s.id].program?.name}
                    </Typography>
                    {(Array.isArray(details[s.id].session2Modules) ? details[s.id].session2Modules : []).map((mod) => (
                      <Box key={mod.id} pl={2} mt={2}>
                        <Typography>📗 {t('seances.module')} : {mod.module.name}</Typography>
                        {(Array.isArray(mod.courses) ? mod.courses : []).map((course) => (
                          <Box key={course.id} pl={2} mt={1}>
                            <Typography>📘 {t('seances.course')} : {course.course.title}</Typography>
                            {(Array.isArray(course.contenus) ? course.contenus : []).map((ct) => (
                              <Typography key={ct.id} pl={4}>
                                📄 {t('seances.content')} : {ct.contenu.title}
                              </Typography>
                            ))}
                          </Box>
                        ))}
                        <Divider sx={{ my: 1 }} />
                      </Box>
                    ))}
                  </>
                ) : (
                  <Typography color="text.secondary">{t('seances.loading')}</Typography>
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
