import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,  Divider,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";


// Utility component for stat cards
function StatCard({ icon, value, label, color = "#1976d2" }) {
  return (
    <Card sx={{ minHeight: 140, borderRadius: 3, p: 0.5, boxShadow: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box>{icon}</Box>
          <Box>
            <Typography fontSize={32} fontWeight={700} color={color}>
              {value}
            </Typography>
            <Typography fontSize={16} fontWeight={600}>
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

const API_BASE = "http://localhost:8000";

export default function FormateurDashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for placeholders (to be replaced later)
  const [feedbackGlobal, setFeedbackGlobal] = useState(null); // Avg feedback from other formateurs
  const [feedbackEtudiant, setFeedbackEtudiant] = useState([]); // Session by session
  const [topFormateurs, setTopFormateurs] = useState([]); // Top 3
const totalSessions = sessions.length;
const totalActiveSessions = sessions.filter((s) => s.status === "ACTIVE").length;
const totalInactiveSessions = sessions.filter((s) => s.status !== "ACTIVE").length;
const tauxActivite = totalSessions === 0 ? "0%" : `${Math.round((totalActiveSessions / totalSessions) * 100)}%`;

  useEffect(() => {
    axios
      .get(`${API_BASE}/dashboard-formateur/sessions`)
      .then((res) => setSessions(res.data))
      .catch((err) => {
        setSessions([]); // fallback: no data
      })
      .finally(() => setLoading(false));
  }, []);

  // Count of active/inactive sessions
  const totalActive = sessions.filter((s) => s.status === "ACTIVE").length;
  const totalInactive = sessions.filter((s) => s.status !== "ACTIVE").length;

 return (
  <Box p={3}>
    <Typography variant="h4" fontWeight={700} mb={2} color="#e67e22">
      🎓 Tableau de bord Formateur
    </Typography>

    {/* STATS CARDS UI */}
    <Box width="100%" display="flex" justifyContent="center" alignItems="center" mb={5}>
      <Grid
        container
        spacing={4}
        sx={{ maxWidth: 1440, margin: "auto" }}
        justifyContent="center"
      >
        {/* Total Sessions */}
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #e3edfc 60%, #d7e9fa 100%)",
              boxShadow: "0 6px 32px 0 rgba(30,136,229,.10)",
              borderRadius: 3,
              p: 4,
              minHeight: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .18s",
              "&:hover": {
                transform: "translateY(-4px) scale(1.03)",
                boxShadow: "0 12px 38px 0 rgba(30,136,229,.13)",
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h3" fontWeight={700} color="#2196f3">
                {totalSessions}
              </Typography>
              <GroupIcon sx={{ color: "#2196f3", fontSize: 48 }} />
            </Stack>
            <Typography mt={2} color="#3b5998" fontWeight={500} fontSize={18}>
              Sessions créées
            </Typography>
          </Box>
        </Grid>

        {/* Active Sessions */}
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #e7faed 60%, #d5f5e3 100%)",
              boxShadow: "0 6px 32px 0 rgba(76,175,80,.10)",
              borderRadius: 3,
              p: 4,
              minHeight: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .18s",
              "&:hover": {
                transform: "translateY(-4px) scale(1.03)",
                boxShadow: "0 12px 38px 0 rgba(76,175,80,.13)",
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h3" fontWeight={700} color="#4caf50">
                {totalActiveSessions}
              </Typography>
              <EventAvailableIcon sx={{ color: "#4caf50", fontSize: 48 }} />
            </Stack>
            <Typography mt={2} color="#388e3c" fontWeight={500} fontSize={18}>
              Sessions Actives
            </Typography>
          </Box>
        </Grid>

        {/* Inactive Sessions */}
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #fdeaea 60%, #fad5d5 100%)",
              boxShadow: "0 6px 32px 0 rgba(244,67,54,.10)",
              borderRadius: 3,
              p: 4,
              minHeight: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .18s",
              "&:hover": {
                transform: "translateY(-4px) scale(1.03)",
                boxShadow: "0 12px 38px 0 rgba(244,67,54,.13)",
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h3" fontWeight={700} color="#e53935">
                {totalInactiveSessions}
              </Typography>
              <EventBusyIcon sx={{ color: "#e53935", fontSize: 48 }} />
            </Stack>
            <Typography mt={2} color="#b71c1c" fontWeight={500} fontSize={18}>
              Sessions Inactives
            </Typography>
          </Box>
        </Grid>

        {/* Activity Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #f4eafd 60%, #edd5fa 100%)",
              boxShadow: "0 6px 32px 0 rgba(156,39,176,.10)",
              borderRadius: 3,
              p: 4,
              minHeight: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .18s",
              "&:hover": {
                transform: "translateY(-4px) scale(1.03)",
                boxShadow: "0 12px 38px 0 rgba(156,39,176,.13)",
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h3" fontWeight={700} color="#9c27b0">
                {tauxActivite}
              </Typography>
              <ShowChartIcon sx={{ color: "#9c27b0", fontSize: 48 }} />
            </Stack>
            <Typography mt={2} color="#7b1fa2" fontWeight={500} fontSize={18}>
              Taux d'Activité
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>

      {/* SESSION LIST */}
      <Card sx={{ borderRadius: 3, mt: 2, maxWidth: 900, mx: "auto" }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            📚 Liste des sessions créées
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : !sessions.length ? (
            <Typography color="text.secondary">Aucune session trouvée.</Typography>
          ) : (
            <List dense>
              {sessions.map((session) => (
                <ListItem key={session.sessionId} divider>
                  <ListItemText
                    primary={session.sessionName}
                    secondary={
                      <span>
                        {session.totalUsers} participant(s) &nbsp;|&nbsp;
                        {session.status === "ACTIVE" ? (
                          <span style={{ color: "#27ae60" }}>Active</span>
                        ) : (
                          <span style={{ color: "#eb5757" }}>Inactive</span>
                        )}
                      </span>
                    }
                  />
                  <Chip
                    icon={
                      session.status === "ACTIVE" ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <HourglassEmptyIcon color="error" />
                      )
                    }
                    label={session.status}
                    color={session.status === "ACTIVE" ? "success" : "default"}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* FEEDBACK SECTIONS (placeholders) */}
      <Grid container spacing={2} mt={2} maxWidth={1440} sx={{ mx: "auto" }}>
        {/* Feedback globale par formateurs */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, minHeight: 180 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FeedbackIcon color="primary" />
                <Typography variant="h6">Ma feedback globale (collaboration)</Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" color="text.secondary">
                <b>À venir</b> — Feedback des autres formateurs
              </Typography>
              <Typography fontSize={13} mt={1} color="#888">
                (Ajouter modèle feedback formateur plus tard)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Feedback par étudiants */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, minHeight: 180 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarIcon color="warning" />
                <Typography variant="h6">Feedback par étudiants</Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" color="text.secondary">
                <b>À venir</b> — Détail feedback séance par séance
              </Typography>
              <Typography fontSize={13} mt={1} color="#888">
                (Ajouter modèle feedback étudiant plus tard)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Top 3 formateurs */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, minHeight: 180 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmojiEventsIcon color="secondary" />
                <Typography variant="h6">Top 3 formateurs</Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1" color="text.secondary">
                <b>À venir</b> — Classement, feedback, activité, cadeaux reçus…
              </Typography>
              <Typography fontSize={13} mt={1} color="#888">
                (Ajouter logique et modèles plus tard)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
