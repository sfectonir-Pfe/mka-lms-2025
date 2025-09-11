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
import { getCurrentUserId } from '../auth/token';

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
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}

// --- ModernStatCard ---
function ModernStatCard({ icon, value, label, extra }) {
  return (
    <ModernCard>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: 'primary.main'
              }}
            >
              {icon}
            </Avatar>
            <Stack alignItems="flex-end">
              <Typography 
                variant="h4" 
                fontWeight={700} 
                color="primary.main"
              >
                {value}
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              color="primary.main"
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
  const [feedbacks, setFeedbacks] = useState(null);
  const [loading, setLoading] = useState(true);

  const totalSessions = sessions.length;
  const totalActiveSessions = sessions.filter((s) => s.status === "ACTIVE").length;
  const totalInactiveSessions = sessions.filter((s) => s.status !== "ACTIVE").length;
  const tauxActivite = totalSessions === 0 ? "0%" : `${Math.round((totalActiveSessions / totalSessions) * 100)}%`;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSessions(),
      fetchFeedbacks()
    ]).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  function fetchSessions() {
    return fetch(`${API_BASE}/dashboard-formateur/sessions`)
      .then((res) => res.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .catch(() => setSessions([]));
  }

  function fetchFeedbacks() {
    const currentUserId = getCurrentUserId();
    const url = currentUserId 
      ? `${API_BASE}/dashboard-formateur/feedbacks?formateurId=${currentUserId}`
      : `${API_BASE}/dashboard-formateur/feedbacks`;
    
    return fetch(url)
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch(() => setFeedbacks(null));
  }


  return (
    <Box
      sx={{
        minHeight: "100vh"
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* HEADER */}
        <Box 
          sx={{ 
            textAlign: 'center',
            mb: 6,
            borderRadius: 4,
            p: 4
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight={700} 
            color="primary.main" 
            mb={1}
          >
            Tableau de Bord Formateur
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              letterSpacing: 0.5
            }}
          >
            Vue d'ensemble de vos sessions et activité d'enseignement
          </Typography>
        </Box>

        {/* MODERN STAT CARDS */}
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<GroupIcon />}
              value={totalSessions}
              label="Sessions créées"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<EventAvailableIcon />}
              value={totalActiveSessions}
              label="Sessions actives"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<StarIcon />}
              value={feedbacks?.totalFeedbacks || 0}
              label="Feedbacks reçus"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<ShowChartIcon />}
              value={feedbacks?.generalAverage ? `${feedbacks.generalAverage}/5` : "N/A"}
              label="Note moyenne générale"
              extra={
                feedbacks?.generalAverage && (
                  <Typography variant="caption" color="text.secondary">
                    ⭐ Moyenne de toutes les séances
                  </Typography>
                )
              }
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
            <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
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
                        <Box>
                          <Box sx={{ mb: 1 }}>
                            <PeopleAltIcon sx={{ fontSize: 18, mb: "-3px", color: "#90caf9" }} /> {session.totalUsers} participant(s) &nbsp;|&nbsp;
                            {session.status === "ACTIVE" ? (
                              <span style={{ color: "#27ae60" }}>Active</span>
                            ) : (
                              <span style={{ color: "#eb5757" }}>Inactive</span>
                            )}
                            &nbsp;|&nbsp; {session.seances?.length || 0} séances
                          </Box>
                          {session.seances && session.seances.length > 0 && (
                            <Box sx={{ ml: 2 }}>
                              {session.seances.map((seance, seanceIndex) => (
                                <Typography key={seanceIndex} variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  📚 {seance.title} - {new Date(seance.startTime).toLocaleDateString()}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
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

        {/* FEEDBACK SECTIONS */}
        <Grid container spacing={3} mb={4}>
          {/* Student Feedback Details */}
          <Grid item xs={12} md={8}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <StarIcon color="warning" />
                  <Typography fontWeight={700} fontSize={18}>
                    Mes feedbacks par les étudiants
                  </Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                {loading ? (
                  <Box textAlign="center" py={3}>
                    <CircularProgress size={40} />
                  </Box>
                ) : feedbacks?.feedbacksBySeance?.length > 0 ? (
                  <Box>
                    <Typography variant="h6" mb={2} color="primary.main">
                      📊 Détail par séance
                    </Typography>
                    <List dense>
                      {feedbacks.feedbacksBySeance.map((seance, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            bgcolor: '#f8f9ff',
                            border: '1px solid #e3f2fd'
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography fontWeight={600} color="primary.main">
                                {seance.seanceTitle}
                              </Typography>
                            }
                            secondary={
                              <Stack direction="row" spacing={2} mt={0.5}>
                                <Chip
                                  size="small"
                                  label={`${seance.totalFeedbacks} feedback(s)`}
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip
                                  size="small"
                                  label={`${seance.averageRating}/5 ⭐`}
                                  color="warning"
                                  variant="filled"
                                />
                              </Stack>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ) : (
                  <Typography color="text.secondary" textAlign="center" py={3}>
                    Aucun feedback reçu pour le moment
                  </Typography>
                )}
              </CardContent>
            </ModernCard>
          </Grid>
          
          {/* Mes Feedbacks Formateur */}
          <Grid item xs={12} md={4}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <FeedbackIcon color="primary" />
                  <Typography fontWeight={700} fontSize={18}>
                    👨‍🏫 Mes Feedbacks
                  </Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                {loading ? (
                  <Box textAlign="center" py={3}>
                    <CircularProgress size={30} />
                  </Box>
                ) : feedbacks?.recentFeedbacks?.length > 0 ? (
                  <List dense>
                    {feedbacks.recentFeedbacks.map((feedback, index) => {
                      const emojiMap = {
                        1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '🤩'
                      };
                      const ratingLabels = {
                        1: 'Très mauvais', 2: 'Mauvais', 3: 'Moyen', 4: 'Bon', 5: 'Excellent'
                      };
                      
                      // Calculate average trainer rating for display
                      const trainerRatings = [
                        feedback.trainerRating,
                        feedback.trainerClarity,
                        feedback.trainerAvailability,
                        feedback.trainerPedagogy,
                        feedback.trainerInteraction
                      ].filter(r => r > 0);
                      
                      const avgRating = trainerRatings.length > 0 
                        ? Math.round(trainerRatings.reduce((a, b) => a + b, 0) / trainerRatings.length)
                        : 3;
                      
                      return (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <ListItemText
                            primary={
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="h6">{emojiMap[avgRating]}</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {feedback.user?.name || 'Étudiant'}
                                </Typography>
                              </Stack>
                            }
                            secondary={
                              <Stack spacing={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                  {ratingLabels[avgRating]} • {new Date(feedback.createdAt).toLocaleDateString()}
                                </Typography>
                                {feedback.trainerComments && (
                                  <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.primary' }}>
                                    "{feedback.trainerComments}"
                                  </Typography>
                                )}
                              </Stack>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  <Typography color="text.secondary" variant="body2" textAlign="center">
                    Aucun feedback reçu
                  </Typography>
                )}
              </CardContent>
            </ModernCard>
          </Grid>
        </Grid>

        {/* TOP 3 SEANCES */}
        <ModernCard sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <EmojiEventsIcon color="secondary" />
              <Typography fontWeight={700} fontSize={20}>
                🏆 Top 3 Séances les mieux notées
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            {loading ? (
              <Box textAlign="center" py={4}>
                <CircularProgress />
              </Box>
            ) : feedbacks?.topSeances?.length > 0 ? (
              <Grid container spacing={3}>
                {feedbacks.topSeances.map((seance, index) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  const colors = ['#ffd700', '#c0c0c0', '#cd7f32'];
                  return (
                    <Grid item xs={12} md={4} key={seance.seanceId}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          background: `linear-gradient(135deg, ${colors[index]}20 0%, ${colors[index]}10 100%)`,
                          border: `2px solid ${colors[index]}40`,
                          borderRadius: 3
                        }}
                      >
                        <Typography variant="h3" mb={1}>
                          {medals[index]}
                        </Typography>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: colors[index],
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}
                        >
                          📚
                        </Avatar>
                        <Typography variant="h6" fontWeight={700} mb={1}>
                          {seance.seanceTitle}
                        </Typography>
                        <Stack spacing={1} alignItems="center">
                          <Chip
                            label={`${seance.averageRating}/5 ⭐`}
                            color="warning"
                            size="small"
                            variant="filled"
                          />
                          <Chip
                            label={`${seance.totalFeedbacks} feedback(s)`}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                          {seance.startTime && (
                            <Typography variant="caption" color="text.secondary">
                              📅 {new Date(seance.startTime).toLocaleDateString()}
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography color="text.secondary" textAlign="center" py={4}>
                Aucune séance avec feedback disponible pour le moment
              </Typography>
            )}
          </CardContent>
        </ModernCard>

      </Container>
    </Box>
  );
}
