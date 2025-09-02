import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Avatar,
  Divider,
  Paper,
  Container,
  Rating,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import StarIcon from "@mui/icons-material/Star";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import api from "../../api/axiosInstance";

// Modern Blue Gradient Color Palette
const PRIMARY_BLUE = "#1e40af";
const SECONDARY_BLUE = "#3b82f6";
const LIGHT_BLUE = "#60a5fa";
const BLUE_GRAY = "#475569";
const ACCENT_COLORS = [
  "#1e40af", // Deep Blue
  "#3b82f6", // Blue
  "#60a5fa", // Light Blue
  "#475569", // Blue Gray
  "#0ea5e9", // Sky Blue
  "#06b6d4"  // Cyan
];


export default function EtudiantDashboardPage() {
  const userId = JSON.parse(localStorage.getItem("user"))?.id || 1;

  const [sessionStats, setSessionStats] = useState({
    total: 0,
    terminee: 0,
    encours: 0,
    avenir: 0
  });
  const [sessions, setSessions] = useState([]);
  const [feedbackReceived, setFeedbackReceived] = useState({
    fromStudents: [],
    fromFormateurs: [],
    averageRating: 0,
    totalCount: 0
  });
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all available endpoints
        const [sessionsRes, statsRes, feedbackRes, topStudentsRes] = await Promise.all([
          api.get(`/dashboard-etudiant/joined-sessions?userId=${userId}`),
          api.get(`/dashboard-etudiant/joined-sessions/stats?userId=${userId}`),
          api.get(`/dashboard-etudiant/feedback-received?userId=${userId}`),
          api.get(`/dashboard-etudiant/top-students`)
        ]);
        
        console.log("joined sessions:", sessionsRes.data);
        console.log("session stats:", statsRes.data);
        console.log("feedback received:", feedbackRes.data);
        console.log("top students:", topStudentsRes.data);
        
        setSessions(sessionsRes.data);
        setSessionStats(statsRes.data);
        setFeedbackReceived(feedbackRes.data);
        setTopStudents(topStudentsRes.data);
        
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setSessions([]);
        setSessionStats({ total: 0, terminee: 0, encours: 0, avenir: 0 });
        setFeedbackReceived({ fromStudents: [], fromFormateurs: [], averageRating: 0, totalCount: 0 });
        setTopStudents([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  if (loading) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
      >
        <Box textAlign="center">
          <CircularProgress size={64} sx={{ color: 'primary.main', mb: 2 }} />
          <Typography color="text.primary" variant="h6">Chargement du tableau de bord...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* MODERN HEADER */}
        <Box 
          sx={{ 
            textAlign: 'center',
            mb: 6,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Typography 
            variant="h3" 
            fontWeight={700} 
            color="primary.main" 
            mb={1}
          >
            👨‍🎓 Tableau de Bord Étudiant
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              letterSpacing: 0.5
            }}
          >
            Suivez votre progression et vos performances académiques
          </Typography>
        </Box>

        {/* MODERN STAT CARD */}
        <Grid container spacing={3} mb={5} justifyContent="center">
          <Grid item xs={12} sm={6} lg={4}>
            <ModernStatCard
              icon={<GroupIcon />}
              value={sessionStats.total}
              label="Sessions rejointes"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Grid>
        </Grid>

        {/* FEEDBACK RECEIVED SECTION - FULL WIDTH */}
        <ModernCard sx={{ mb: 5 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar sx={{ 
                bgcolor: ACCENT_COLORS[4], 
                width: 48, 
                height: 48,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
              }}>
                <FeedbackIcon />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                Feedback Reçu
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Évaluations et commentaires reçus
            </Typography>

            {/* Average Rating Display */}
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight={700} color={PRIMARY_BLUE} mb={1}>
                {feedbackReceived.averageRating}/5
              </Typography>
              <Rating 
                value={feedbackReceived.averageRating} 
                readOnly 
                precision={0.1}
                size="large"
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Basé sur {feedbackReceived.totalCount} évaluations
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* From Students */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" fontWeight={600} mb={3} color={ACCENT_COLORS[0]}>
                    👥 Par les autres étudiants ({feedbackReceived.fromStudents.length})
                  </Typography>
                  {feedbackReceived.fromStudents.length > 0 ? (
                    <Stack spacing={2}>
                      {feedbackReceived.fromStudents.map((feedback, idx) => (
                        <Paper 
                          key={idx}
                          elevation={1} 
                          sx={{ 
                            p: 3, 
                            borderLeft: `4px solid ${ACCENT_COLORS[0]}`,
                            backgroundColor: 'rgba(59, 130, 246, 0.02)',
                            borderRadius: 2
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Typography variant="body1" fontWeight={600}>
                              👥 Étudiant
                            </Typography>
                            <Rating value={feedback.rating || 0} readOnly size="small" />
                          </Stack>
                          {feedback.comment && feedback.comment.trim() !== '' && feedback.comment !== 'null' && (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                              "{feedback.comment}"
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {new Date(feedback.createdAt).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                      Aucun feedback d'étudiants pour le moment
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* From Formateurs */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" fontWeight={600} mb={3} color={ACCENT_COLORS[2]}>
                    🎓 Par les formateurs ({feedbackReceived.fromFormateurs.length})
                  </Typography>
                  {feedbackReceived.fromFormateurs.length > 0 ? (
                    <Stack spacing={2}>
                      {feedbackReceived.fromFormateurs.map((feedback, idx) => (
                        <Paper 
                          key={idx}
                          elevation={1} 
                          sx={{ 
                            p: 3, 
                            borderLeft: `4px solid ${ACCENT_COLORS[2]}`,
                            backgroundColor: 'rgba(96, 165, 250, 0.02)',
                            borderRadius: 2
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Typography variant="body1" fontWeight={600}>
                              🎓 Formateur
                            </Typography>
                            <Rating value={feedback.rating || 0} readOnly size="small" />
                          </Stack>
                          {feedback.comment && feedback.comment.trim() !== '' && feedback.comment !== 'null' && (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                              "{feedback.comment}"
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {new Date(feedback.createdAt).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                      Aucun feedback de formateurs pour le moment
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </ModernCard>

        {/* TOP 3 STUDENTS SECTION - FULL WIDTH */}
        <ModernCard sx={{ mb: 5 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar sx={{ 
                bgcolor: ACCENT_COLORS[5], 
                width: 48, 
                height: 48,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
              }}>
                <EmojiEventsIcon />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                Top 3 Étudiants
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Classement basé sur les évaluations reçues
            </Typography>
            {topStudents.length > 0 ? (
              <Grid container spacing={3}>
                {topStudents.map((student, idx) => (
                  <Grid item xs={12} md={4} key={student.id}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        background: idx === 0 ? 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)' 
                                  : idx === 1 ? 'linear-gradient(135deg, #f3f4f6 0%, #9ca3af 100%)'
                                  : 'linear-gradient(135deg, #fef2f2 0%, #f87171 100%)',
                        border: `2px solid ${idx === 0 ? '#fbbf24' : idx === 1 ? '#9ca3af' : '#f87171'}`,
                        borderRadius: 3,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} mb={1}>
                        {student.name}
                      </Typography>
                      <Rating value={student.averageRating} readOnly precision={0.1} sx={{ mb: 1 }} />
                      <Typography variant="h5" fontWeight={600} color="primary" mb={1}>
                        {student.averageRating}/5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.feedbackCount} évaluation(s)
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Aucun classement disponible pour le moment
              </Typography>
            )}
          </CardContent>
        </ModernCard>

        {/* SESSION LIST */}
        <ModernCard>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar sx={{ 
                bgcolor: ACCENT_COLORS[3], 
                width: 48, 
                height: 48,
                background: 'linear-gradient(135deg, #475569 0%, #334155 100%)'
              }}>
                <SchoolIcon />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                📚 Sessions Rejointes
              </Typography>
            </Stack>
            {!sessions.length ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                Aucune session trouvée.
              </Typography>
            ) : (
              <List dense>
                {sessions.map((session) => (
                  <ListItem key={session.sessionId} divider>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={600} color={PRIMARY_BLUE}>
                          {session.sessionName}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            {session.startDate
                              ? `Début : ${new Date(session.startDate).toLocaleDateString()}`
                              : ""}
                            {session.endDate
                              ? `  — Fin : ${new Date(session.endDate).toLocaleDateString()}`
                              : ""}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </ModernCard>

      </Container>
    </Box>
  );
}

// Modern Card Component
function ModernCard({ children, ...props }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
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
    </Card>
  );
}

// Modern Stat Card Component
function ModernStatCard({ icon, value, label, gradient }) {
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
            >
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </ModernCard>
  );
}

// Top Student Item Component
function TopStudentItem({ student, rank }) {
  const medals = ["🥇", "🥈", "🥉"];
  const gradients = [
    'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    'linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)',
    'linear-gradient(135deg, #cd7f32 0%, #daa520 100%)'
  ];
  
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        background: rank === 0 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#f8fafc',
        border: rank === 0 ? '2px solid #fbbf24' : '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(4px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: gradients[rank] || ACCENT_COLORS[rank],
            fontSize: 20,
            fontWeight: 700
          }}
        >
          {medals[rank] || rank + 1}
        </Avatar>
        <Box flex={1}>
          <Typography fontWeight={600} color={PRIMARY_BLUE} mb={0.5}>
            {student.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Rating value={student.averageRating} readOnly size="small" precision={0.1} />
            <Typography variant="body2" fontWeight={600} color={ACCENT_COLORS[1]}>
              {student.averageRating.toFixed(1)} ⭐
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {student.feedbackCount} évaluations
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
