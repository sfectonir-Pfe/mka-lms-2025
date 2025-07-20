import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Collapse,
  Divider,
} from "@mui/material";

const SeanceFormateurList = ({ seances, onAnimer, onDelete, fetchSeances, setSelectedSeance, setFeedbackOpen }) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});

  const toggleDetails = (seance) => {
    const id = seance.id;
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetch(`http://localhost:8000/seance-formateur/details/${seance.session2.id}`)
        .then((res) => res.json())
        .then((data) => setDetails((prev) => ({ ...prev, [id]: data })))
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
                {t('seances.animateSession')}
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
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete && onDelete(s.id)}
              >
                {t('common.delete')}
              </Button>
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
                    {details[s.id].session2Modules.map((mod) => (
                      <Box key={mod.id} pl={2} mt={2}>
                        <Typography>📗 {t('seances.module')} : {mod.module.name}</Typography>
                        {mod.courses.map((course) => (
                          <Box key={course.id} pl={2} mt={1}>
                            <Typography>📘 {t('seances.course')} : {course.course.title}</Typography>
                            {course.contenus.map((ct) => (
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
