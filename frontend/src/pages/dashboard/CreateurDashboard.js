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
import axios from "axios";
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
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

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

// ---- Main Component ----
export default function CreateurDashboard() {
  const [stats, setStats] = useState(null);
  const [topSessions, setTopSessions] = useState([]);
  const [inactiveSessions, setInactiveSessions] = useState([]);
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
      axios.get(`${API_BASE}/creator-dashboard/stats`),
      axios.get(`${API_BASE}/creator-dashboard/top-sessions`),
      axios.get(`${API_BASE}/creator-dashboard/inactive-sessions`),
      axios.get(`${API_BASE}/creator-dashboard/session-feedback`),
      axios.get(`${API_BASE}/creator-dashboard/monthly-session-status`),
      axios.get(`${API_BASE}/creator-dashboard/monthly-program-publish`)
    ]).then(
      ([
        statsRes,
        topSessionsRes,
        inactiveSessionsRes,
        feedbackRes,
        monthlySessionStatusRes,
        monthlyProgramPublishRes
      ]) => {
        setStats(statsRes.data);
        setTopSessions(topSessionsRes.data);
        setInactiveSessions(inactiveSessionsRes.data);
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
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={64} sx={{ color: '#fff', mb: 2 }} />
          <Typography color="white" variant="h6">Chargement du tableau de bord...</Typography>
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
          background: info.color + "18",
          color: info.color,
          fontWeight: 600,
          borderRadius: "1rem",
          fontSize: 13,
        }}
      />
    );
  };

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
            Tableau de Bord Créateur
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
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
                      height: 40,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
                      height: 40,
                      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
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

        {/* TOP SESSIONS & INACTIVE SESSIONS */}
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
          {/* Inactive Sessions */}
          <Grid item xs={12} md={6}>
            <ModernCard>
              <CardContent>
                <Typography fontWeight={800} mb={2}>
                  <EventBusyIcon color="error" sx={{ mb: -.5 }} /> Sessions Inactives
                </Typography>
                {inactiveSessions.map((s, idx) => (
                  <Box key={s.sessionId} mb={2} display="flex" alignItems="center">
                    <Typography flex={1} fontWeight={600} fontSize={17}>
                      {idx + 1}. {s.sessionName}
                      {s.programName && (
                        <span style={{ color: "#888", fontSize: 14 }}> ({s.programName})</span>
                      )}
                    </Typography>
                    <StatusChip status={s.status} />
                    <Typography color="text.secondary" fontSize={15} ml={2}>
                      Inscrits: <b>{s.enrolledUsers}</b>
                    </Typography>
                  </Box>
                ))}
                {!inactiveSessions.length && (
                  <Typography color="text.secondary">Aucune donnée.</Typography>
                )}
              </CardContent>
            </ModernCard>
          </Grid>
        </Grid>

        {/* FEEDBACKS */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ModernCard>
              <CardContent>
                <Typography fontWeight={800} mb={2}>
                  Feedback sur les Sessions (à venir)
                </Typography>
                {sessionFeedback.map((fb, idx) => (
                  <Box key={fb.sessionId} mb={2}>
                    <Typography fontWeight={600} fontSize={17}>
                      {fb.sessionName}
                      {fb.programName && (
                        <span style={{ color: "#888", fontSize: 14 }}> ({fb.programName})</span>
                      )}
                    </Typography>
                    <Typography color="text.secondary" fontSize={15}>
                      Feedback: {fb.feedback ?? "N/A"}
                    </Typography>
                  </Box>
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
