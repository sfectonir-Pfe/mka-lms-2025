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
import { useNavigate } from "react-router-dom";




const SessionList = () => {
  const [showAddUserId, setShowAddUserId] = useState(null);
const [userEmail, setUserEmail] = useState("");
const [addLoading, setAddLoading] = useState(false);

const handleAddUser = async (sessionId) => {
  if (!userEmail) {
    toast.error("Veuillez entrer un email.");
    return;
  }
  setAddLoading(true);
  try {
    await axios.post(`http://localhost:8000/session2/${sessionId}/add-user`, {
      email: userEmail,
    });
    toast.success("Utilisateur ajouté à la session !");
    setShowAddUserId(null);
    setUserEmail("");
  } catch (e) {
    toast.error(
      e.response?.data?.message ||
      "Erreur lors de l'ajout de l'utilisateur"
    );
  } finally {
    setAddLoading(false);
  }
};

  const [sessions, setSessions] = useState([]);

const navigate = useNavigate();
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
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: "#fefefe" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📋 Liste des sessions créées
      </Typography>

      {sessions.length === 0 ? (
        <Typography mt={2} color="text.secondary">
          Aucune session enregistrée.
        </Typography>
      ) : (
        sessions.map((session) => (
          <Paper
            key={session.id}
            elevation={1}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              backgroundColor: "#ffffff",
              border: "1px solid #e0e0e0",
            }}
          >
            {/* 📸 Image */}
            {session.imageUrl && (
              <Box mb={2} display="flex" justifyContent="center">
                <img
                  src={session.imageUrl}
                  alt="Session"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 180,
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}

            {/* 🧾 Session Info */}
            <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  mb={1}
>
  <Typography variant="h6" fontWeight="bold" color="primary">
    🧾 {session.name}
  </Typography>
  <Box>
    <Button
      variant="outlined"
      color="error"
      size="small"
      onClick={() => handleDelete(session.id)}
    >
      🗑️ Supprimer
    </Button>
    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={() => navigate(`/sessions/${session.id}/seances`)}
      sx={{ ml: 2 }}
    >
      🚀 Rejoindre
    </Button>
    <Button
  variant="outlined"
  color="secondary"
  size="small"
  sx={{ ml: 2 }}
  onClick={() => setShowAddUserId(session.id === showAddUserId ? null : session.id)}
>
  ➕ Ajouter un utilisateur
</Button>
{showAddUserId === session.id && (
  <Box mt={2} display="flex" gap={1} alignItems="center">
    <input
      type="email"
      placeholder="Email utilisateur"
      value={userEmail}
      onChange={e => setUserEmail(e.target.value)}
      style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 220 }}
    />
    <Button
      variant="contained"
      size="small"
      color="secondary"
      onClick={() => handleAddUser(session.id)}
      disabled={addLoading}
    >
      {addLoading ? "Ajout..." : "Ajouter"}
    </Button>
    <Button
      variant="text"
      size="small"
      onClick={() => { setShowAddUserId(null); setUserEmail(""); }}
    >
      Annuler
    </Button>
  </Box>
)}

  </Box>
</Stack>


            <Typography variant="body2" mb={0.5}>
              📚 Programme : <strong>{session.program?.name || "Inconnu"}</strong>
            </Typography>
            <Typography variant="body2">
              📅 Du <strong>{session.startDate?.slice(0, 10)}</strong> au{" "}
              <strong>{session.endDate?.slice(0, 10)}</strong>
            </Typography>

            {/* 📦 Modules + Contenus */}
            {session.session2Modules?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  🧱 Modules et Contenus
                </Typography>
                {session.session2Modules.map((mod) => (
                  <Box key={mod.id} mt={1}>
                    <Typography fontWeight="bold" color="secondary.main">
                      📦 {mod.module?.name}
                    </Typography>
                    {mod.courses.map((c) => (
                      <Box key={c.id} ml={2} mt={1}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary">
                          📘 {c.course?.title}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                          {c.contenus.map((ct) => (
                            <Chip
                              key={ct.id}
                              label={`📄 ${ct.contenu?.title}`}
                              size="small"
                              variant="outlined"
                              color="info"
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
          </Paper>
        ))
      )}
    </Paper>
  );
};

export default SessionList;
