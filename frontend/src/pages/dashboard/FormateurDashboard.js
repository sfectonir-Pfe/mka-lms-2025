import React, { useEffect, useState } from "react";
import {
  Grid,
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
  Container,
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

const PRIMARY_BLUE = "#1e40af";
const GREEN = "#4caf50";
const RED = "#e53935";
const PURPLE = "#9c27b0";
const ACCENT_COLORS = [
  "#1e40af", "#3b82f6", "#60a5fa", "#475569", "#0ea5e9", "#06b6d4"
];

const API_BASE = "http://localhost:8000";

// --- ModernCard ---
function ModernCard({ children, ...props }) {
  return (
    <Paper
      sx={{
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}

// --- ModernStatCard ---
function ModernStatCard({ icon, value, label, gradient, extra }) {
  return (
    <ModernCard>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                background: gradient,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              {icon}
            </Avatar>
            <Stack alignItems="flex-end">
              <Typography 
                variant="h4" 
                fontWeight={700} 
                sx={{ 
                  background: gradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {value}
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              color={PRIMARY_BLUE}
              mb={1}
            >
              {label}
            </Typography>
            {extra}
          </Box>
        </Stack>
      </CardContent>
    </ModernCard>
  );
}

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
    // eslint-disable-next-line
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
        minHeight: "100vh",
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.02" fill-rule="evenodd"%3E%3Cpath d="m0 40l40-40h-40z"/%3E%3C/g%3E%3C/svg%3E")',
        }
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* HEADER */}
        <Box 
          sx={{ 
            textAlign: 'center',
            mb: 6,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            p: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight={700} 
            color="white" 
            mb={1}
            sx={{
              background: 'linear-gradient(45deg, #fff, #e0e7ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Tableau de Bord Formateur
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400,
              letterSpacing: 0.5
            }}
          >
            Vue d'ensemble de vos sessions et activité d’enseignement
          </Typography>
        </Box>

        {/* MODERN STAT CARDS */}
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<GroupIcon />}
              value={totalSessions}
              label="Sessions créées"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<EventAvailableIcon />}
              value={totalActiveSessions}
              label="Sessions actives"
              gradient="linear-gradient(135deg, #43a047 0%, #60a5fa 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<EventBusyIcon />}
              value={totalInactiveSessions}
              label="Sessions inactives"
              gradient="linear-gradient(135deg, #e53935 0%, #fad5d5 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<ShowChartIcon />}
              value={tauxActivite}
              label="Taux d'activité"
              gradient="linear-gradient(135deg, #9c27b0 0%, #e1bee7 100%)"
            />
          </Grid>
        </Grid>

        {/* SESSION LIST */}
        <ModernCard sx={{
          mt: 2,
          maxWidth: 950,
          mx: "auto",
          mb: 4,
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color={PRIMARY_BLUE}>
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
        </ModernCard>

        {/* FEEDBACK + TOP 3 FORMATEURS (Placeholders) */}
        <Grid container spacing={3}>
          {/* Global Feedback */}
          <Grid item xs={12} md={4}>
            <ModernCard>
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
            </ModernCard>
          </Grid>
          {/* Student Feedback */}
          <Grid item xs={12} md={4}>
            <ModernCard>
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
            </ModernCard>
          </Grid>
          {/* Top 3 Formateurs */}
          <Grid item xs={12} md={4}>
            <ModernCard>
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
            </ModernCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
