import React, { useEffect, useState } from "react";
import {
  Grid,
  CardContent,
  Typography,
  Stack,
  Box,
  Divider,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Chip,
  Container,
  Paper,Card,
} from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import BookIcon from "@mui/icons-material/Book";
import CollectionsIcon from "@mui/icons-material/Collections";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ArchiveIcon from "@mui/icons-material/Archive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import api from "../../api/axiosInstance";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ---- Color Palette & Status Map ----
const PRIMARY_BLUE = "#1e40af";
const SECONDARY_BLUE = "#3b82f6";
const LIGHT_BLUE = "#60a5fa";
const BLUE_GRAY = "#475569";
const ACCENT_COLORS = [
  "#1e40af", "#3b82f6", "#60a5fa", "#475569", "#0ea5e9", "#06b6d4"
];
const statusMap = {
  active:    { color: "#27ae60", label: "Active", icon: <PlayCircleIcon fontSize="small" /> },
  inactive:  { color: "#eb5757", label: "Inactive", icon: <PauseCircleIcon fontSize="small" /> },
  completed: { color: "#9b51e0", label: "Terminée", icon: <CheckCircleIcon fontSize="small" /> },
  archived:  { color: "#616161", label: "Archivée", icon: <ArchiveIcon fontSize="small" /> }
};
// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Pie chart formatter (reuse logic from Admin)
const toPieData = (dataArr, labelMap = {}) => {
  if (!dataArr?.length) return [];
  const keys = ["active", "inactive", "completed", "archived"];
  return keys.map((key, idx) => ({
    name: labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
    value: dataArr.reduce((acc, cur) => acc + (cur[key] || 0), 0),
    color: ACCENT_COLORS[idx % ACCENT_COLORS.length],
  }));
};

// --- Status badge (reused) ---
const StatusChip = ({ status }) => {
  const info = statusMap[status] || { color: "#bdbdbd", label: status };
  return (
    <Chip
      size="small"
      icon={info.icon}
      label={info.label}
      sx={{
        ml: 1,
        color: info.color,
        fontWeight: 600,
        borderRadius: "1rem",
        fontSize: 13,
      }}
    />
  );
};

// ---- Main Component ----
export default function CreateurDashboard() {
  const [stats, setStats] = useState(null);
  const [topSessions, setTopSessions] = useState([]);
  const [topPrograms, setTopPrograms] = useState([]);
  const [sessionFeedback, setSessionFeedback] = useState([]);
  const [monthlySessionStatus, setMonthlySessionStatus] = useState([]);
  const [monthlyProgramPublish, setMonthlyProgramPublish] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartTypeSessions, setChartTypeSessions] = useState("bar");
  const [chartTypePrograms, setChartTypePrograms] = useState("bar");

  const sessionPieData = toPieData(monthlySessionStatus, {
    active: "Active",
    inactive: "Inactive",
    completed: "Terminée",
    archived: "Archivée",
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/creator-dashboard/stats`),
      api.get(`/creator-dashboard/top-sessions`),
      api.get(`/creator-dashboard/top-programs`),
      api.get(`/creator-dashboard/session-feedback`),
      api.get(`/creator-dashboard/monthly-session-status`),
      api.get(`/creator-dashboard/monthly-program-publish`)
    ]).then(
      ([
        statsRes,
        topSessionsRes,
        topProgramsRes,
        feedbackRes,
        monthlySessionStatusRes,
        monthlyProgramPublishRes
      ]) => {
        setStats(statsRes.data);
        setTopSessions(topSessionsRes.data);
        setTopPrograms(topProgramsRes.data);
        setSessionFeedback(feedbackRes.data);
        setMonthlySessionStatus(monthlySessionStatusRes.data);
        setMonthlyProgramPublish(monthlyProgramPublishRes.data);
      }
    ).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
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

  // Pie data for Monthly Program Publish
  const sumMonthly = (key) =>
    monthlyProgramPublish.reduce((acc, cur) => acc + (cur[key] || 0), 0);
  const programPieData = [
    { name: "Publiés", value: sumMonthly("published"), color: ACCENT_COLORS[1] },
    { name: "Non publiés", value: sumMonthly("unpublished"), color: ACCENT_COLORS[2] }
  ];


  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* HEADER */}
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
            Tableau de Bord Créateur
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              letterSpacing: 0.5
            }}
          >
            Vue d'ensemble de vos formations, contenus et sessions
          </Typography>
        </Box>

        {/* STAT CARDS */}
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} sm={6} lg={2.4}>
            <ModernStatCard
              icon={<WidgetsIcon />}
              value={stats.totalModules}
              label="Modules"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2.4}>
            <ModernStatCard
              icon={<BookIcon />}
              value={stats.totalCourses}
              label="Cours"
              gradient="linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2.4}>
            <ModernStatCard
              icon={<CollectionsIcon />}
              value={stats.totalContenus}
              label="Contenus"
              gradient="linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2.4}>
            <ModernStatCard
              icon={<SchoolIcon />}
              value={stats.totalPrograms}
              label="Programmes"
              gradient="linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
              extra={
                <Stack direction="row" spacing={1} mt={1}>
                  <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 600 }}>
                    {stats.totalProgramsPublished} publiés
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                    {stats.totalProgramsUnpublished} brouillons
                  </Typography>
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2.4}>
            <ModernStatCard
              icon={<StarIcon />}
              value={stats.totalSessions}
              label="Sessions"
              gradient="linear-gradient(135deg, #f43f5e 0%, #e84393 100%)"
              extra={
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  <Typography variant="caption" sx={{ color: '#27ae60', fontWeight: 600 }}>
                    {stats.totalSessionsActive} actives
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#eb5757', fontWeight: 600 }}>
                    {stats.totalSessionsInactive} inactives
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9b51e0', fontWeight: 600 }}>
                    {stats.totalSessionsCompleted} terminées
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#616161', fontWeight: 600 }}>
                    {stats.totalSessionsArchived} archivées
                  </Typography>
                </Stack>
              }
            />
          </Grid>
        </Grid>

        {/* CHARTS */}
        <Grid container spacing={3} mb={5}>
          {/* Session Status by Month */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ 
                      bgcolor: PRIMARY_BLUE, 
                      width: 40, 
                      height: 40
                    }}>
                      <ShowChartIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                      Statut des Sessions
                    </Typography>
                  </Stack>
                  <ToggleButtonGroup
                    value={chartTypeSessions}
                    exclusive
                    size="small"
                    onChange={(_, value) => value && setChartTypeSessions(value)}
                    sx={{ 
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      borderRadius: 2,
                      '& .MuiToggleButton-root': {
                        border: 'none',
                        color: PRIMARY_BLUE,
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                          color: 'white',
                        }
                      }
                    }}
                  >
                    <ToggleButton value="bar">
                      <BarChartIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="pie">
                      <PieChartOutlineIcon fontSize="small" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Box height={230}>
                  {chartTypeSessions === "bar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlySessionStatus}>
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="active" stackId="a" fill={statusMap.active.color} name="Actives" />
                        <Bar dataKey="inactive" stackId="a" fill={statusMap.inactive.color} name="Inactives" />
                        <Bar dataKey="completed" stackId="a" fill={statusMap.completed.color} name="Terminées" />
                        <Bar dataKey="archived" stackId="a" fill={statusMap.archived.color} name="Archivées" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sessionPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                          label
                        >
                          {sessionPieData.map((entry, idx) => (
                            <Cell key={`cell-sess-pie-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </CardContent>
            </ModernCard>
          </Grid>
          {/* Programs Published/Unpublished by Month */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ 
                      bgcolor: ACCENT_COLORS[1], 
                      width: 40, 
                      height: 40
                    }}>
                      <ShowChartIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                      Programmes publiés/non publiés
                    </Typography>
                  </Stack>
                  <ToggleButtonGroup
                    value={chartTypePrograms}
                    exclusive
                    size="small"
                    onChange={(_, value) => value && setChartTypePrograms(value)}
                    sx={{ 
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      borderRadius: 2,
                      '& .MuiToggleButton-root': {
                        border: 'none',
                        color: PRIMARY_BLUE,
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                          color: 'white',
                        }
                      }
                    }}
                  >
                    <ToggleButton value="bar">
                      <BarChartIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="pie">
                      <PieChartOutlineIcon fontSize="small" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                <Box height={230}>
                  {chartTypePrograms === "bar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyProgramPublish}>
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="published" stackId="a" fill={ACCENT_COLORS[1]} name="Publiés" />
                        <Bar dataKey="unpublished" stackId="a" fill={ACCENT_COLORS[2]} name="Non publiés" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={programPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                          label
                        >
                          {programPieData.map((entry, idx) => (
                            <Cell key={`cell-prog-pie-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </CardContent>
            </ModernCard>
          </Grid>
        </Grid>

        {/* TOP SESSIONS & PROGRAMS */}
        <Grid container spacing={3} mb={5}>
          {/* Top 3 Sessions */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <CardContent>
                <Typography fontWeight={800} mb={2}>
                  <EmojiEventsIcon color="warning" sx={{ mb: -.5 }} /> Top 3 Sessions (plus d'inscrits)
                </Typography>
                {topSessions.map((s, idx) => (
                  <TopSessionItem key={s.sessionId} session={s} rank={idx} />
                ))}
                {!topSessions.length && (
                  <Typography color="text.secondary">Aucune donnée.</Typography>
                )}
              </CardContent>
            </ModernCard>
          </Grid>
          {/* Top 3 Programs */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <CardContent>
                <Typography fontWeight={800} mb={2}>
                  <StarIcon color="warning" sx={{ mb: -.5 }} /> Top 3 Programmes (mieux notés)
                </Typography>
                {topPrograms.map((p, idx) => (
                  <TopProgramItem key={p.programId} program={p} rank={idx} />
                ))}
                {!topPrograms.length && (
                  <Typography color="text.secondary">Aucune donnée.</Typography>
                )}
              </CardContent>
            </ModernCard>
          </Grid>
        </Grid>

        {/* SESSION FEEDBACK WITH RATINGS */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Avatar sx={{ 
                    bgcolor: '#f59e0b', 
                    width: 40, 
                    height: 40
                  }}>
                    <StarIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                    Feedback sur les Sessions
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 3 }} />
                {sessionFeedback.map((fb, idx) => (
                  <SessionFeedbackItem key={fb.sessionId} feedback={fb} />
                ))}
                {!sessionFeedback.length && (
                  <Typography color="text.secondary">Aucune donnée.</Typography>
                )}
              </CardContent>
            </ModernCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// -------- Modern Card Components ---------
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

// --------- Top Session Item ---------
function TopSessionItem({ session, rank }) {
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
            {session.sessionName}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            {session.programName}
          </Typography>
          <Typography variant="body2" fontWeight={600} color={ACCENT_COLORS[1]}>
            {session.enrolledUsers} inscrits
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

// --------- Top Program Item ---------
function TopProgramItem({ program, rank }) {
  const medals = ["🥇", "🥈", "🥉"];
  const gradients = [
    'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    'linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)',
    'linear-gradient(135deg, #cd7f32 0%, #daa520 100%)'
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} sx={{ color: '#fbbf24', fontSize: 16 }} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" sx={{ color: '#fbbf24', fontSize: 16, opacity: 0.5 }} />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} sx={{ color: '#e5e7eb', fontSize: 16 }} />);
    }
    
    return stars;
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
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
            {program.programName}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            {renderStars(program.rating)}
            <Typography fontWeight={700} color={ACCENT_COLORS[1]}>
              {program.rating}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

// --------- Session Feedback Item ---------
function SessionFeedbackItem({ feedback }) {
  const getRatingColor = (rating) => {
    if (rating >= 4) return '#22c55e'; // Green
    if (rating >= 3) return '#f59e0b'; // Orange
    if (rating >= 2) return '#ef4444'; // Red
    return '#6b7280'; // Gray
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} sx={{ color: '#fbbf24', fontSize: 16 }} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" sx={{ color: '#fbbf24', fontSize: 16, opacity: 0.5 }} />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} sx={{ color: '#e5e7eb', fontSize: 16 }} />);
    }
    
    return stars;
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box flex={1}>
          <Typography fontWeight={600} color={PRIMARY_BLUE} mb={0.5}>
            {feedback.sessionName}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {feedback.programName}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <StatusChip status={feedback.status} />
            <Typography variant="body2" color="text.secondary">
              {feedback.enrolledUsers} inscrits
            </Typography>
          </Stack>
        </Box>
        <Box textAlign="right">
          {feedback.averageRating ? (
            <>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                {renderStars(feedback.averageRating)}
                <Typography 
                  fontWeight={700} 
                  sx={{ 
                    color: getRatingColor(feedback.averageRating),
                    fontSize: 16 
                  }}
                >
                  {feedback.averageRating}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {feedback.feedbackCount} évaluation{feedback.feedbackCount > 1 ? 's' : ''}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              Aucune évaluation
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
