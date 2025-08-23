import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import RedeemIcon from "@mui/icons-material/Redeem";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import api from "../../api/axiosInstance";

// const API_BASE = "http://localhost:8000";

export default function EtablissementDashboardPage() {
  // Liste des sessions (sessions2) récupérées du backend
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("Tous");

  // Étudiants à afficher (MOCK, à remplacer par requête API filtrée par session)
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Majd Bouhmid",
      sessionId: 6, // ID session2, à matcher
      program: "Informatique",
      sessions: [
        { name: "React Avancé", status: "Terminée", grade: 18 },
        { name: "NestJS", status: "En cours", grade: 15 },
      ],
      moyenne: 16.5,
      rewards: [{ name: "Bon d'achat", reason: "Top 3", date: "2025-06-01" }],
    },
    {
      id: 2,
      name: "Sarah Dridi",
      sessionId: 8,
      program: "Maths",
      sessions: [
        { name: "Statistiques", status: "Terminée", grade: 14 },
        { name: "Analyse", status: "Terminée", grade: 15 },
      ],
      moyenne: 14.5,
      rewards: [],
    },
  ]);

  // Récupérer les sessions2 depuis le backend
  useEffect(() => {
    // TODO: remplace par ton endpoint réel
    api
      .get(`/sessions2`)
      .then((res) => {
        setSessions([{ id: "Tous", name: "Toutes les sessions" }, ...res.data]);
      })
      .catch(() => {
        // fallback mock
        setSessions([
          { id: "Tous", name: "Toutes les sessions" },
          { id: 6, name: "React Avancé" },
          { id: 8, name: "Statistiques" },
        ]);
      });
  }, []);

  // Filtrer étudiants par session sélectionnée
  const filteredStudents =
    selectedSession === "Tous"
      ? students
      : students.filter((s) => s.sessionId === Number(selectedSession));

  // Top 3 par moyenne
  const topStudents = [...filteredStudents]
    .sort((a, b) => b.moyenne - a.moyenne)
    .slice(0, 3);

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={4} color="#3d5afe">
        🏫 Tableau de bord Établissement
      </Typography>

      {/* Filtre par Session */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <TextField
          label="Session"
          select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          {sessions.map((sess) => (
            <MenuItem key={sess.id} value={sess.id}>
              {sess.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Statistiques */}
      <Grid container spacing={4} mb={3} maxWidth={1440} margin="auto">
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#1976d2">
                  {filteredStudents.length}
                </Typography>
                <GroupIcon sx={{ color: "#1976d2", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="#1565c0" fontWeight={500} fontSize={18}>
                Étudiants inscrits
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: "#f3e5f5" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#8e24aa">
                  {filteredStudents.length
                    ? (
                        filteredStudents.reduce((sum, s) => sum + (s.moyenne || 0), 0) /
                        filteredStudents.length
                      ).toFixed(2)
                    : "—"}
                </Typography>
                <StarIcon sx={{ color: "#8e24aa", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="#6a1b9a" fontWeight={500} fontSize={18}>
                Moyenne générale
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: "#fce4ec" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#d81b60">
                  {filteredStudents.reduce((n, s) => n + (s.rewards.length || 0), 0)}
                </Typography>
                <RedeemIcon sx={{ color: "#d81b60", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="#ad1457" fontWeight={500} fontSize={18}>
                Cadeaux/rewards
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, bgcolor: "#fffde7" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#fbc02d">
                  3
                </Typography>
                <EmojiEventsIcon sx={{ color: "#fbc02d", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="#f9a825" fontWeight={500} fontSize={18}>
                Top 3 étudiants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste étudiants */}
      <Card sx={{ borderRadius: 3, mt: 2, maxWidth: 1200, mx: "auto" }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Liste des étudiants ({filteredStudents.length})
          </Typography>
          {filteredStudents.length === 0 ? (
            <Typography color="text.secondary">Aucun étudiant trouvé.</Typography>
          ) : (
            <List dense>
              {filteredStudents.map((student) => (
                <Box key={student.id}>
                  <ListItem alignItems="flex-start" divider>
                    <ListItemText
                      primary={
                        <Typography fontWeight={600}>
                          {student.name} <span style={{ color: "#789262" }}>({student.program})</span>
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography fontSize={14}>
                            <b>Moyenne:</b> {student.moyenne ?? "—"}
                            &nbsp;|&nbsp;
                            <b>Sessions:</b>{" "}
                            {student.sessions.map((s) => (
                              <Chip
                                key={s.name}
                                label={`${s.name} (${s.status})`}
                                color={
                                  s.status === "Terminée"
                                    ? "success"
                                    : s.status === "En cours"
                                    ? "primary"
                                    : "default"
                                }
                                size="small"
                                sx={{ mr: 0.5 }}
                              />
                            ))}
                          </Typography>
                          {student.rewards.length > 0 && (
                            <Typography fontSize={14} color="#c2185b">
                              🎁 Cadeaux:{" "}
                              {student.rewards.map((r) => (
                                <span key={r.name + r.date}>
                                  {r.name} <i>({r.reason})</i> le {r.date}
                                </span>
                              ))}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Top 3 étudiants */}
      <Card sx={{ borderRadius: 3, mt: 4, maxWidth: 700, mx: "auto" }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            <EmojiEventsIcon color="warning" /> Top 3 étudiants (moyenne la plus élevée)
          </Typography>
          {topStudents.map((s, idx) => (
            <Box key={s.id}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography fontWeight={700} fontSize={22}>
                  #{idx + 1}
                </Typography>
                <Typography fontWeight={700} fontSize={18}>
                  {s.name} ({s.program})
                </Typography>
                <Chip label={`Moy: ${s.moyenne}`} color="success" size="small" />
                {s.rewards.length > 0 && (
                  <Chip
                    label={`🎁 ${s.rewards[0].name}`}
                    color="secondary"
                    size="small"
                  />
                )}
              </Stack>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
