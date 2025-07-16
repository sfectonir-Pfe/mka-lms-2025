import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Collapse,
  Divider,
} from "@mui/material";

const SeanceFormateurList = ({ seances, onAnimer, onDelete }) => {
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
        📅 Séances de cette session
      </Typography>
      {(!seances || seances.length === 0) ? (
        <Typography color="text.secondary">Aucune séance pour le moment.</Typography>
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
                Animer la séance
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => toggleDetails(s)}
              >
                {expandedId === s.id ? "Masquer" : "Détails"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete && onDelete(s.id)}
              >
                Supprimer
              </Button>
            </Box>
            <Collapse in={expandedId === s.id}>
              <Box mt={2} pl={2}>
                <Typography variant="subtitle1" gutterBottom>
                  📘 Détails du programme
                </Typography>
                {details[s.id] ? (
                  <>
                    <Typography variant="body1" fontWeight="bold">
                      Programme : {details[s.id].program?.name}
                    </Typography>
                    {details[s.id].session2Modules.map((mod) => (
                      <Box key={mod.id} pl={2} mt={2}>
                        <Typography>📗 Module : {mod.module.name}</Typography>
                        {mod.courses.map((course) => (
                          <Box key={course.id} pl={2} mt={1}>
                            <Typography>📘 Cours : {course.course.title}</Typography>
                            {course.contenus.map((ct) => (
                              <Typography key={ct.id} pl={4}>
                                📄 Contenu : {ct.contenu.title}
                              </Typography>
                            ))}
                          </Box>
                        ))}
                        <Divider sx={{ my: 1 }} />
                      </Box>
                    ))}
                  </>
                ) : (
                  <Typography color="text.secondary">Chargement...</Typography>
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
