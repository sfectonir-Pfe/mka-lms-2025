import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Divider,
  Stack,
  Button,
  Avatar,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Eye, EyeOff ,} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { Chip, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const SessionList = () => {
  const [showAddUserId, setShowAddUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [assignedUsersMap, setAssignedUsersMap] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState({});
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/session2");
      setSessions(res.data);
      const usersMap = {};
      await Promise.all(
        res.data.map(async (session) => {
          try {
            const resp = await axios.get(`http://localhost:8000/session2/${session.id}/users`);
            usersMap[session.id] = resp.data || [];
          } catch {
            usersMap[session.id] = [];
          }
        })
      );
      setAssignedUsersMap(usersMap);
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
const handleStatusChange = async (sessionId, newStatus) => {
  try {
    await axios.patch(`http://localhost:8000/session2/${sessionId}/status`, {
      status: newStatus,
    });
    toast.success("Statut de la session mis à jour !");
    fetchSessions();
  } catch {
    toast.error("Erreur lors de la mise à jour du statut");
  }
};

  const handleRemoveUser = async (sessionId, userId) => {
    try {
      await axios.delete(`http://localhost:8000/session2/${sessionId}/remove-user/${userId}`);
      toast.success("Utilisateur retiré de la session !");
      await fetchSessions();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
        "Erreur lors du retrait de l'utilisateur"
      );
    }
  };

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
      await fetchSessions();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
        "Erreur lors de l'ajout de l'utilisateur"
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleToggleSidebar = (sessionId) => {
    setSidebarOpen(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
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
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 3
            }}
          >
            {/* --- Main Content (left) --- */}
            <Box flex={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6" fontWeight="bold" color="primary">
                  🧾 {session.name}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
  <Chip
    label={session.status}
    color={
      session.status === "ACTIVE"
        ? "success"
        : session.status === "INACTIVE"
        ? "default"
        : session.status === "COMPLETED"
        ? "primary"
        : "secondary"
    }
    sx={{ fontWeight: 700, textTransform: "capitalize" }}
  />
  <FormControl size="small" sx={{ minWidth: 120 }}>
    <InputLabel id={`status-label-${session.id}`}>Statut</InputLabel>
    <Select
      labelId={`status-label-${session.id}`}
      value={session.status}
      label="Statut"
      onChange={e => handleStatusChange(session.id, e.target.value)}
    >
      <MenuItem value="ACTIVE">Active</MenuItem>
      <MenuItem value="INACTIVE">Inactive</MenuItem>
      <MenuItem value="COMPLETED">Terminée</MenuItem>
      <MenuItem value="ARCHIVED">Archivée</MenuItem>
    </Select>
  </FormControl>
</Stack>

                {!sidebarOpen[session.id] && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(session.id)}
                    >
                      Supprimer
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<RocketLaunchIcon />}
                      onClick={() => navigate(`/sessions/${session.id}/seances`)}
                    >
                      Rejoindre
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<PersonAddAlt1Icon />}
                      onClick={() => handleToggleSidebar(session.id)}
                    >
                      Ajouter utilisateur
                    </Button>
                  </Stack>
                )}
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
                              <Button
                                key={ct.id}
                                variant="outlined"
                                color="info"
                                size="small"
                                sx={{ mr: 1, mb: 1, borderRadius: 2 }}
                                onClick={() =>
                                  ct.contenu?.fileUrl &&
                                  window.open(ct.contenu.fileUrl, "_blank")
                                }
                              >
                                📄 {ct.contenu?.title}
                              </Button>
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </>
              )}
            </Box>

            {sidebarOpen[session.id] ? (
              <Paper
                elevation={4}
                sx={{
                  minWidth: 650,
                  maxWidth: 700,
                  bgcolor: "#f8fbff",
                  borderRadius: 4,
                  px: 15,
                  py: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  boxShadow: "0 12px 36px 0 rgba(25, 118, 210, 0.09)",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography fontWeight={700} color="primary" fontSize={22} letterSpacing={0.5}>
                    Membres
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => handleToggleSidebar(session.id)}
                    sx={{ fontWeight: 600, fontSize: 15, textTransform: "none", px: 2, py: 0 }}
                  >
                    Masquer
                  </Button>
                </Box>

                {/* --- Add User input at top --- */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={3}
                  bgcolor="#eaf0f9"
                  borderRadius={2}
                  px={2}
                  py={1.5}
                >
                  <TextField
                    size="small"
                    type="email"
                    placeholder="Ajouter par email"
                    value={showAddUserId === session.id ? userEmail : ""}
                    onFocus={() => setShowAddUserId(session.id)}
                    onChange={(e) => setUserEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      '& input': { fontSize: 16 },
                      bgcolor: "#fff",
                      borderRadius: 2,
                    }}
                  />
                  <IconButton
                    color="primary"
                    disabled={addLoading}
                    onClick={() => handleAddUser(session.id)}
                    sx={{ bgcolor: "#1976d2", color: "#fff", "&:hover": { bgcolor: "#1565c0" } }}
                  >
                    <PersonAddAlt1Icon />
                  </IconButton>
                </Box>

                {/* --- User list --- */}
                <Stack spacing={2}>
                  {(assignedUsersMap[session.id] || []).length === 0 ? (
                    <Typography color="text.secondary" fontSize={15}>
                      Aucun utilisateur
                    </Typography>
                  ) : (
                    assignedUsersMap[session.id].map((user) => (
                      <Box
                        key={user.id}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        px={2}
                        py={1}
                        bgcolor="#fff"
                        borderRadius={2}
                        sx={{
                          boxShadow: "0 2px 8px rgba(25,118,210,.04)",
                          cursor: "pointer",
                          transition: "background .15s",
                          "&:hover": { background: "#f0f6ff" }
                        }}
                        onClick={() => navigate(`/ProfilePage/${user.id}`)}
                      >
                        <Avatar
                          src={user.profilePic || undefined}
                          sx={{
                            width: 38, height: 38, fontWeight: 700, fontSize: 18,
                            bgcolor: user.profilePic ? "transparent" : "#B5C7D3",
                          }}
                        >
                          {!user.profilePic && user.name ? user.name[0].toUpperCase() : null}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={600} fontSize={17} color="#222">
                            {user.name}
                          </Typography>
                          <Typography fontSize={13} color="#999">
                            {user.role}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveUser(session.id, user.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))
                  )}
                </Stack>
              </Paper>
            ) : (
              <Box
                minWidth={40}
                display="flex"
                alignItems="flex-start"
                justifyContent="center"
                height="100%"
                pt={1}
              >
                {/* Button is now integrated in the header section */}
              </Box>
            )}
          </Paper>
        ))
      )}
    </Paper>
  );
};

export default SessionList;
