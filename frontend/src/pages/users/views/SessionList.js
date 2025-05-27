import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Divider,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const SessionList = () => {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/session2");
      setSessions(res.data);
    } catch {
      toast.error("Erreur lors du chargement des sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/session2/${id}`);
      toast.success("Session supprimée avec succès !");
      fetchSessions();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        📋 Liste des sessions créées
      </Typography>

      {sessions.length === 0 ? (
        <Typography mt={2} color="text.secondary">
          Aucune session enregistrée.
        </Typography>
      ) : (
        sessions.map((session) => (
          <Box key={session.id} mt={4} p={2} border="1px solid #ddd" borderRadius={2}>
            
            {/* ✅ Image at the top */}
            {session.imageUrl && (
              <Box mb={2} display="flex" justifyContent="center">
                <img
                  src={session.imageUrl}
                  alt="Session"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 160,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                🧾 Session : {session.name}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(session.id)}
              >
                🗑️ Supprimer
              </Button>
            </Stack>

            <Typography variant="body2" mt={1}>
              📚 Programme : <strong>{session.program?.name || "Inconnu"}</strong>
            </Typography>

            <Typography variant="body2">
              📅 Du <strong>{session.startDate?.slice(0, 10)}</strong> au{" "}
              <strong>{session.endDate?.slice(0, 10)}</strong>
            </Typography>

            {/* ✅ Modules + contenus */}
            {session.session2Modules?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">📦 Modules et contenus</Typography>
                {session.session2Modules.map((mod) => (
                  <Box key={mod.id} mt={1}>
                    <Typography fontWeight="bold" color="primary.main">
                      📦 {mod.module?.name}
                    </Typography>
                    {mod.courses.map((c) => (
                      <Box key={c.id} ml={2} mt={1}>
                        <Typography variant="body2" fontWeight="bold">
                          📘 {c.course?.title}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                          {c.contenus.map((ct) => (
                            <Chip
                              key={ct.id}
                              label={`📄 ${ct.contenu?.title}`}
                              size="small"
                              variant="outlined"
                              color="secondary"
                              onClick={() =>
                                ct.contenu?.fileUrl &&
                                window.open(ct.contenu.fileUrl, "_blank")
                              }
                              sx={{
                                cursor: ct.contenu?.fileUrl ? "pointer" : "default",
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                ))}
              </>
            )}

            <Divider sx={{ my: 2 }} />
          </Box>
        ))
      )}
    </Paper>
  );
};

export default SessionList;
