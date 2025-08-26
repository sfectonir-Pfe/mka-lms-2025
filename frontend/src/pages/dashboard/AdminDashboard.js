import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Divider,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Paper,
  Container,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReportIcon from "@mui/icons-material/Report";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
 
import api from "../../api/axiosInstance";
import ReclamationStats from "../../components/dashboard/ReclamationStats";
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
  LabelList,
} from "recharts";

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

// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const toPieData = (obj, labelMap = {}) =>
  Object.keys(obj || {})
    .filter((key) => key !== "total")
    .map((key, idx) => ({
      name: labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
      value: obj[key],
      color: ACCENT_COLORS[idx % ACCENT_COLORS.length],
    }));

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topSessions, setTopSessions] = useState([]);
  const [topFormateurs, setTopFormateurs] = useState([]);
  const [monthlyRegs, setMonthlyRegs] = useState([]);
  const [sessionStatusStats, setSessionStatusStats] = useState({});
  const [topRatedSessions, setTopRatedSessions] = useState([]);
  const [reclamationStats, setReclamationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartTypeSessions, setChartTypeSessions] = useState("bar");
  const [chartTypeRegs, setChartTypeRegs] = useState("bar");

  const sessionPieData = toPieData(sessionStatusStats, {
    active: "Active",
    inactive: "Inactive",
    completed: "Terminée",
    archived: "Archivée",
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/dashboard/stats`),
      api.get(`/dashboard/top-sessions`),
      api.get(`/dashboard/top-formateurs`),
      api.get(`/dashboard/monthly-registrations`),
      api.get(`/dashboard/session-status-stats`),
      api.get(`/dashboard/top-rated-sessions`),
      api.get(`/dashboard/reclamation-stats`)
    ]).then(
      ([
        statsRes,
        sessionsRes,
        formateursRes,
        monthlyRegsRes,
        sessionStatusRes,
        topRatedSessionsRes,
        reclamationStatsRes
      ]) => {
        setStats(statsRes.data);
        setTopSessions(sessionsRes.data);
        setTopFormateurs(formateursRes.data);
        setMonthlyRegs(monthlyRegsRes.data);
        setSessionStatusStats(sessionStatusRes.data);
        setTopRatedSessions(topRatedSessionsRes.data);
        setReclamationStats(reclamationStatsRes.data);
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

  const sumMonthly = (key) =>
    monthlyRegs.reduce((acc, cur) => acc + (cur[key] || 0), 0);
  const monthlyPieData = [
    { name: "Étudiants", value: sumMonthly("students"), color: ACCENT_COLORS[0] },
    { name: "Formateurs", value: sumMonthly("formateurs"), color: ACCENT_COLORS[1] },
    { name: "Créateurs", value: sumMonthly("creators"), color: ACCENT_COLORS[2] },
    { name: "Établissements", value: sumMonthly("establishments"), color: ACCENT_COLORS[3] }
  ];

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
        {/* MODERN HEADER */}
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
            Tableau de Bord Admin
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400,
              letterSpacing: 0.5
            }}
          >
            Vue d'ensemble des performances et statistiques de la plateforme
          </Typography>
        </Box>

        {/* MODERN STAT CARDS */}
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<GroupIcon />}
              value={stats.totalUsers}
              label="Utilisateurs"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              extra={
                <Stack direction="row" spacing={1} mt={1}>
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                    {stats.activeUsers || 0} actifs
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                    {stats.inactiveUsers || 0} inactifs
                  </Typography>
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<SchoolIcon />}
              value={stats.totalPrograms}
              label="Programmes"
              gradient="linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)"
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
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<EventAvailableIcon />}
              value={stats.activeSessions || 0}
              label="Sessions actives"
              gradient="linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
              extra={
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                    {stats.inactiveSessions || 0} inactives
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                    {stats.completedSessions || 0} terminées
                  </Typography>
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <ModernStatCard
              icon={<TrendingUpIcon />}
              value={stats.activityRate || "100%"}
              label="Taux d'activité"
              gradient="linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
            />
          </Grid>
        </Grid>

        {/* OVERVIEW SECTION */}
        <Grid container spacing={3} mb={5}>
          {/* User Distribution */}
          <Grid item xs={12} lg={4}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Avatar sx={{ 
                    bgcolor: PRIMARY_BLUE, 
                    width: 48, 
                    height: 48,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}>
                    <GroupIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                    Répartition Utilisateurs
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <UserDistributionItem 
                    label="Étudiants" 
                    color={ACCENT_COLORS[0]} 
                    value={stats.totalStudents} 
                    total={stats.totalUsers}
                  />
                  <UserDistributionItem 
                    label="Formateurs" 
                    color={ACCENT_COLORS[1]} 
                    value={stats.totalFormateurs} 
                    total={stats.totalUsers}
                  />
                  <UserDistributionItem 
                    label="Créateurs" 
                    color={ACCENT_COLORS[2]} 
                    value={stats.totalCreators} 
                    total={stats.totalUsers}
                  />
                  <UserDistributionItem 
                    label="Établissements" 
                    color={ACCENT_COLORS[3]} 
                    value={stats.totalEstablishments} 
                    total={stats.totalUsers}
                  />
                </Stack>
              </CardContent>
            </ModernCard>
          </Grid>

          {/* Top Sessions */}
          <Grid item xs={12} lg={4}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Avatar sx={{ 
                    bgcolor: ACCENT_COLORS[2], 
                    width: 48, 
                    height: 48,
                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
                  }}>
                    <EmojiEventsIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                    Top 3 Sessions
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {topSessions.map((s, idx) => (
                    <TopSessionItem key={s.sessionId} session={s} rank={idx} />
                  ))}
                </Stack>
              </CardContent>
            </ModernCard>
          </Grid>

          {/* Top Formateurs */}
          <Grid item xs={12} lg={4}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Avatar sx={{ 
                    bgcolor: ACCENT_COLORS[1], 
                    width: 48, 
                    height: 48,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
                  }}>
                    <StarIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                    Top 3 Formateurs
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {topFormateurs.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      Bientôt disponible
                    </Typography>
                  ) : (
                    topFormateurs.map((f, idx) => (
                      <TopFormateurItem key={f.formateurId} formateur={f} rank={idx} />
                    ))
                  )}
                </Stack>
              </CardContent>
            </ModernCard>
          </Grid>
        </Grid>

        {/* RÉCLAMATIONS SECTION */}
        <Grid container spacing={3} mb={5}>
          {/* Statistiques des réclamations */}
          <Grid item xs={12} lg={6}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Avatar sx={{ 
                    bgcolor: ACCENT_COLORS[4], 
                    width: 48, 
                    height: 48,
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
                  }}>
                    <ReportIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                    Statistiques Réclamations
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <ReclamationStatItem 
                    icon={<PendingIcon />}
                    label="En attente"
                    value={reclamationStats?.enAttente || 0}
                    color="#f59e0b"
                    total={reclamationStats?.total || 0}
                  />
                  <ReclamationStatItem 
                    icon={<PriorityHighIcon />}
                    label="En cours"
                    value={reclamationStats?.enCours || 0}
                    color="#3b82f6"
                    total={reclamationStats?.total || 0}
                  />
                  <ReclamationStatItem 
                    icon={<CheckCircleIcon />}
                    label="Résolues"
                    value={reclamationStats?.resolu || 0}
                    color="#10b981"
                    total={reclamationStats?.total || 0}
                  />
                </Stack>
              </CardContent>
            </ModernCard>
          </Grid>
        </Grid>

        {/* CHARTS SECTION */}
        <Grid container spacing={3}>
          {/* Sessions Status Chart */}
          <Grid item xs={12} lg={6}>
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
                <Box height={280}>
                  {chartTypeSessions === "bar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sessionPieData}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {sessionPieData.map((entry, idx) => (
                            <Cell key={`cell-sess-bar-${idx}`} fill={entry.color} />
                          ))}
                          <LabelList dataKey="value" position="top" fontWeight={600} fontSize={12} />
                        </Bar>
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
                          paddingAngle={3}
                          dataKey="value"
                          label
                        >
                          {sessionPieData.map((entry, idx) => (
                            <Cell key={`cell-sess-pie-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </CardContent>
            </ModernCard>
          </Grid>

          {/* Monthly Registrations Chart */}
          <Grid item xs={12} lg={6}>
            <ModernCard>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ 
                      bgcolor: ACCENT_COLORS[2], 
                      width: 40, 
                      height: 40,
                      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
                    }}>
                      <ShowChartIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                      Inscriptions (12 derniers mois)
                    </Typography>
                  </Stack>
                  <ToggleButtonGroup
                    value={chartTypeRegs}
                    exclusive
                    size="small"
                    onChange={(_, value) => value && setChartTypeRegs(value)}
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
                <Box height={280}>
                  {chartTypeRegs === "bar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyRegs}>
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="students" stackId="a" fill={ACCENT_COLORS[0]} name="Étudiants" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="formateurs" stackId="a" fill={ACCENT_COLORS[1]} name="Formateurs" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="creators" stackId="a" fill={ACCENT_COLORS[2]} name="Créateurs" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="establishments" stackId="a" fill={ACCENT_COLORS[3]} name="Établissements" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={monthlyPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          label
                        >
                          {monthlyPieData.map((entry, idx) => (
                            <Cell key={`cell-month-pie-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </CardContent>
            </ModernCard>
          </Grid>
        </Grid>

        {/* FEEDBACK SECTION */}
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} lg={6}>
            <ModernCard>
              <CardContent>
                <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE} mb={3}>
                  Top Sessions par Note Moyenne
                </Typography>
                <Stack spacing={2}>
                  {topRatedSessions.length > 0 ? (
                    topRatedSessions.map((session, idx) => (
                      <Box key={session.id}>
                        <Typography variant="subtitle1" fontWeight={600} color={ACCENT_COLORS[0]}>
                          {idx + 1}. {session.name} ({session.averageRating} ⭐)
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {session.programName}
                        </Typography>
                        <Stack spacing={1}>
                          {session.topSeances?.map((seance) => (
                            <Paper key={seance.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'grey.50' }}>
                              <Typography variant="body2" fontWeight={500}>
                                {seance.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Moyenne: {seance.averageRating ?? "N/A"} ⭐
                              </Typography>
                            </Paper>
                          ))}
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Typography variant="body2" color="text.secondary">
                        Aucune donnée de feedback disponible
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Les sessions apparaîtront ici une fois que les étudiants auront soumis leurs évaluations
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </ModernCard>
          </Grid>

          <Grid item xs={12} lg={6}>
            <ModernCard>
              <CardContent>
                <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE} mb={3}>
                  Statistiques des Feedbacks
                </Typography>
                <Stack spacing={3}>
                  {/* Feedback Overview */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} mb={2}>
                      Vue d'ensemble
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: ACCENT_COLORS[0] + '10' }}>
                          <Typography variant="h4" fontWeight={700} color={ACCENT_COLORS[0]}>
                            {stats?.totalSessions || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Sessions Totales
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: ACCENT_COLORS[1] + '10' }}>
                          <Typography variant="h4" fontWeight={700} color={ACCENT_COLORS[1]}>
                            {topRatedSessions.length}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Avec Feedback
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Rating Distribution */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} mb={2}>
                      Distribution des Notes
                    </Typography>
                    <Stack spacing={1}>
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = topRatedSessions.filter(s => 
                          Math.floor(s.averageRating) === rating
                        ).length;
                        const percentage = topRatedSessions.length > 0 
                          ? (count / topRatedSessions.length) * 100 
                          : 0;
                        
                        return (
                          <Box key={rating} display="flex" alignItems="center" gap={2}>
                            <Typography variant="body2" minWidth={20}>
                              {rating}⭐
                            </Typography>
                            <Box 
                              flex={1} 
                              height={8} 
                              bgcolor="grey.200" 
                              borderRadius={1}
                              overflow="hidden"
                            >
                              <Box 
                                height="100%" 
                                bgcolor={ACCENT_COLORS[rating - 1]} 
                                width={`${percentage}%`}
                                transition="width 0.3s ease"
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary" minWidth={40}>
                              {count} ({percentage.toFixed(0)}%)
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>

                 
                      
                        
                       
                   
                </Stack>
              </CardContent>
            </ModernCard>
          </Grid>
        </Grid>

        {/* RECLAMATIONS SECTION */}
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12}>
            <ReclamationStats reclamationStats={reclamationStats} />
          </Grid>
        </Grid>
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

// Modern Stat Card Component
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

// User Distribution Item Component
function UserDistributionItem({ label, color, value, total }) {
  const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
  
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: color, fontSize: 14 }}>
            {label[0]}
          </Avatar>
          <Typography fontWeight={500} color={BLUE_GRAY}>
            {label}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontWeight={700} color={color}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {percentage}%
          </Typography>
        </Stack>
      </Stack>
      <Box 
        sx={{ 
          height: 6, 
          bgcolor: '#f1f5f9', 
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            height: '100%', 
            width: `${percentage}%`, 
            background: `linear-gradient(90deg, ${color}, ${color}90)`,
            borderRadius: 3,
            transition: 'width 1s ease'
          }} 
        />
      </Box>
    </Box>
  );
}

// Top Session Item Component
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

// Top Formateur Item Component
function TopFormateurItem({ formateur, rank }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        src={formateur.profilePic}
        alt={formateur.name}
        sx={{
          width: 40,
          height: 40,
          bgcolor: ACCENT_COLORS[rank],
          border: `2px solid ${ACCENT_COLORS[rank]}20`,
        }}
      >
        {!formateur.profilePic && formateur.name ? formateur.name[0].toUpperCase() : null}
      </Avatar>
      <Box flex={1}>
        <Typography fontWeight={600} color={PRIMARY_BLUE}>
          {formateur.name}
        </Typography>
        {formateur.averageRating && (
          <Typography variant="body2" color={ACCENT_COLORS[2]} fontWeight={500}>
            ⭐ {formateur.averageRating}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

// Reclamation Stat Item Component
function ReclamationStatItem({ icon, label, value, color, total }) {
  const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
  
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: color, fontSize: 14 }}>
            {icon}
          </Avatar>
          <Typography fontWeight={500} color={BLUE_GRAY}>
            {label}
          </Typography>
        </Stack>
        <Stack alignItems="flex-end">
          <Typography fontWeight={700} color={color}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {percentage}%
          </Typography>
        </Stack>
      </Stack>
      <Box 
        sx={{ 
          height: 6, 
          bgcolor: '#f1f5f9', 
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            height: '100%', 
            width: `${percentage}%`, 
            background: `linear-gradient(90deg, ${color}, ${color}90)`,
            borderRadius: 3,
            transition: 'width 1s ease'
          }} 
        />
      </Box>
    </Box>
  );
}

