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
  Stack,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

const API_BASE = "http://localhost:8000";

export default function FormateurDashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalSessions = sessions.length;
  const totalActiveSessions = sessions.filter((s) => s.status === "ACTIVE").length;
  const totalInactiveSessions = sessions.filter((s) => s.status !== "ACTIVE").length;
  const tauxActivite = totalSessions === 0 ? "0%" : `${Math.round((totalActiveSessions / totalSessions) * 100)}%`;

  useEffect(() => {
    setLoading(true);
    fetchSessions();
  }, []);

  function fetchSessions() {
    setLoading(true);
    fetch(`${API_BASE}/dashboard-formateur/sessions`)
      .then((res) => res.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#fafbfc",
        py: { xs: 3, md: 6 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1280,
          mx: "auto",
          px: { xs: 1.5, md: 4 },
        }}
      >
        {/* HEADER */}
        <Typography
          variant="h4"
          fontWeight={800}
          letterSpacing={1}
          color="#222"
          mb={1}
          sx={{ textTransform: "capitalize" }}
        >
          <span role="img" aria-label="dashboard">🧑‍🏫</span> Formateur Dashboard
        </Typography>
        <Typography color="text.secondary" fontSize={17} mb={3}>
          Overview of your sessions and teaching activity
        </Typography>

        {/* STATS CARDS */}
        <Grid container spacing={3} mb={3}>
          {/* Total Sessions */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "2rem",
                minHeight: 150,
                px: 2,
                boxShadow: "0 4px 24px 0 rgba(30,136,229,.06)",
                background: "linear-gradient(90deg, #e3edfc 60%, #d7e9fa 100%)",
                display: "flex",
                alignItems: "center",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 8px 40px 0 rgba(30,136,229,.15)" }
              }}
            >
              <Avatar sx={{ bgcolor: "#2196f3", width: 60, height: 60, mr: 2 }}>
                <GroupIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography fontWeight={900} fontSize={28} color="#2196f3">
                  {totalSessions}
                </Typography>
                <Typography fontWeight={600} color="#2196f3" fontSize={15}>
                  Sessions créées
                </Typography>
              </Box>
            </Card>
          </Grid>
          {/* Active Sessions */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "2rem",
                minHeight: 150,
                px: 2,
                boxShadow: "0 4px 24px 0 rgba(76,175,80,.07)",
                background: "linear-gradient(90deg, #e7faed 60%, #d5f5e3 100%)",
                display: "flex",
                alignItems: "center",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 8px 40px 0 rgba(76,175,80,.15)" }
              }}
            >
              <Avatar sx={{ bgcolor: "#4caf50", width: 60, height: 60, mr: 2 }}>
                <EventAvailableIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography fontWeight={900} fontSize={28} color="#4caf50">
                  {totalActiveSessions}
                </Typography>
                <Typography fontWeight={600} color="#4caf50" fontSize={15}>
                  Sessions actives
                </Typography>
              </Box>
            </Card>
          </Grid>
          {/* Inactive Sessions */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "2rem",
                minHeight: 150,
                px: 2,
                boxShadow: "0 4px 24px 0 rgba(244,67,54,.08)",
                background: "linear-gradient(90deg, #fdeaea 60%, #fad5d5 100%)",
                display: "flex",
                alignItems: "center",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 8px 40px 0 rgba(244,67,54,.17)" }
              }}
            >
              <Avatar sx={{ bgcolor: "#e53935", width: 60, height: 60, mr: 2 }}>
                <EventBusyIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography fontWeight={900} fontSize={28} color="#e53935">
                  {totalInactiveSessions}
                </Typography>
                <Typography fontWeight={600} color="#e53935" fontSize={15}>
                  Sessions inactives
                </Typography>
              </Box>
            </Card>
          </Grid>
          {/* Activity Rate */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "2rem",
                minHeight: 150,
                px: 2,
                boxShadow: "0 4px 24px 0 rgba(156,39,176,.08)",
                background: "linear-gradient(90deg, #f4eafd 60%, #edd5fa 100%)",
                display: "flex",
                alignItems: "center",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 8px 40px 0 rgba(156,39,176,.16)" }
              }}
            >
              <Avatar sx={{ bgcolor: "#9c27b0", width: 60, height: 60, mr: 2 }}>
                <ShowChartIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography fontWeight={900} fontSize={28} color="#9c27b0">
                  {tauxActivite}
                </Typography>
                <Typography fontWeight={600} color="#9c27b0" fontSize={15}>
                  Taux d'activité
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* SESSION LIST */}
        <Card
          sx={{
            borderRadius: "2rem",
            mt: 2,
            maxWidth: 950,
            mx: "auto",
            mb: 4,
            boxShadow: "0 4px 32px 0 rgba(33,150,243,.08)",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color="#222">
              📚 Sessions créées
            </Typography>
            {loading ? (
              <Box textAlign="center" py={5}>
                <CircularProgress />
              </Box>
            ) : !sessions.length ? (
              <Typography color="text.secondary">Aucune session trouvée.</Typography>
            ) : (
              <List dense>
                {sessions.map((session) => (
                  <ListItem
                    key={session.sessionId}
                    divider
                    sx={{
                      borderRadius: "1rem",
                      mb: 1,
                      py: 1,
                      px: 2,
                      bgcolor: "#f7fafd",
                      "&:hover": { bgcolor: "#eef7fc" },
                      transition: "background 0.2s"
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography fontWeight={700} fontSize={17} color="#34495e">
                          {session.sessionName}
                        </Typography>
                      }
                      secondary={
                        <span>
                          <PeopleAltIcon sx={{ fontSize: 18, mb: "-3px", color: "#90caf9" }} /> {session.totalUsers} participant(s) &nbsp;|&nbsp;
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
                      sx={{
                        fontWeight: 600,
                        borderRadius: "1rem",
                        px: 2
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* FEEDBACK + TOP 3 FORMATEURS (Placeholders) */}
        <Divider sx={{ my: 5, maxWidth: 500, mx: "auto" }}>
          <StarIcon sx={{ color: "#e84393" }} fontSize="large" />
        </Divider>
        <Grid container spacing={3}>
          {/* Global Feedback */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "2rem",
                minHeight: 170,
                background: "linear-gradient(90deg, #e3edfc 70%, #d7e9fa 100%)",
                px: 2,
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FeedbackIcon color="primary" />
                  <Typography fontWeight={700} fontSize={18}>
                    Ma feedback globale
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography fontSize={16} color="text.secondary">
                  <b>Bientôt</b> — Feedback des autres formateurs
                </Typography>
                <Typography fontSize={13} mt={1} color="#888">
                  (Ajouter feedback collaboratif plus tard)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Student Feedback */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "2rem",
                minHeight: 170,
                background: "linear-gradient(90deg, #fff7e6 70%, #ffeccf 100%)",
                px: 2,
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <StarIcon color="warning" />
                  <Typography fontWeight={700} fontSize={18}>
                    Feedback étudiants
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography fontSize={16} color="text.secondary">
                  <b>Bientôt</b> — Feedback séance par séance
                </Typography>
                <Typography fontSize={13} mt={1} color="#888">
                  (Ajouter feedback étudiant plus tard)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Top 3 Formateurs */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "2rem",
                minHeight: 170,
                background: "linear-gradient(90deg, #f4eafd 70%, #edd5fa 100%)",
                px: 2,
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EmojiEventsIcon color="secondary" />
                  <Typography fontWeight={700} fontSize={18}>
                    Top 3 formateurs
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography fontSize={16} color="text.secondary">
                  <b>Bientôt</b> — Classement, feedback, cadeaux reçus…
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                  <CardGiftcardIcon color="action" />
                  <Typography fontSize={13} color="#888">
                    (Classement à venir)
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
