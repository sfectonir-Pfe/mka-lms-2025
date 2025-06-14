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
import axios from "axios";

const SeanceFormateurList = () => {
  const [seances, setSeances] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});
  const user = JSON.parse(localStorage.getItem("user")); // 🔐

  useEffect(() => {
    if (user?.id) {
      fetchSeances();
    }
  }, [user?.id]);

  const fetchSeances = () => {
    axios
      .get(`http://localhost:8000/seance-formateur/formateur/${user.id}`)
      .then((res) => setSeances(res.data))
      .catch((err) => console.error("Erreur chargement des séances:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Confirmer la suppression de cette séance ?")) {
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
        📅 Mes séances
      </Typography>

      {seances.length === 0 ? (
        <Typography color="text.secondary">Aucune séance pour le moment.</Typography>
      ) : (
        seances.map((s) => (
          <Paper key={s.id} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{s.title}</Typography>
            <Typography variant="body2">
              🕒 {new Date(s.startTime).toLocaleString()}
            </Typography>

            <Stack direction="row" spacing={1} mt={1}>
              <Chip
                label={`Programme : ${s.buildProgram.program.name}`}
                color="info"
              />
            </Stack>

            <Box mt={2} display="flex" gap={1}>
              <Button
                variant="outlined"
                onClick={() => (window.location.href = `/formateur/seance/${s.id}`)}
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
                onClick={() => handleDelete(s.id)}
              >
                Supprimer
              </Button>
            </Box>

            {/* Collapse zone for details */}
            <Collapse in={expandedId === s.id}>
  <Box mt={2} pl={2}>
    <Typography variant="subtitle1" gutterBottom>
      📘 Détails du programme
    </Typography>
    {details[s.id] ? (
      <>
        <Typography variant="body1" fontWeight="bold">
          Programme : {details[s.id].program.name}
        </Typography>

        {details[s.id].modules.map((mod, modIndex) => (
          <Box key={modIndex} pl={2} mt={2}>
            <Typography>📗 Module : {mod.module.name}</Typography>

            {mod.courses.map((course, courseIndex) => (
              <Box key={courseIndex} pl={2} mt={1}>
                <Typography>📘 Cours : {course.course.title}</Typography>

                {course.contenus.map((ct, ctIndex) => (
                  <Typography key={ctIndex} pl={4}>
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
