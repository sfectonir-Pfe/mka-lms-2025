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
  useTheme
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ArchiveIcon from "@mui/icons-material/Archive";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
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
  LabelList,
} from "recharts";

// === Custom Palette for Pie/Bar Slices ===
const COLORS = ["#1976d2", "#43a047", "#fbc02d", "#8e24aa", "#e53935", "#00bcd4", "#ffa726"];

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// === Format data for Pie charts ===
const toPieData = (obj, labelMap = {}) =>
  Object.keys(obj || {})
    .filter((key) => key !== "total")
    .map((key, idx) => ({
      name: labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
      value: obj[key],
      color: COLORS[idx % COLORS.length],
    }));

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topSessions, setTopSessions] = useState([]);
  const [topFormateurs, setTopFormateurs] = useState([]);
  const [monthlyRegs, setMonthlyRegs] = useState([]);
  const [sessionStatusStats, setSessionStatusStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Toggle for session and user charts (bar/pie)
  const [chartTypeSessions, setChartTypeSessions] = useState("bar");
  const [chartTypeRegs, setChartTypeRegs] = useState("bar");

  // Pie/Bar data
  const sessionPieData = toPieData(sessionStatusStats, {
    active: "Active",
    inactive: "Inactive",
    completed: "Terminée",
    archived: "Archivée",
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_BASE}/dashboard/stats`),
      axios.get(`${API_BASE}/dashboard/top-sessions`),
      axios.get(`${API_BASE}/dashboard/top-formateurs`),
      axios.get(`${API_BASE}/dashboard/monthly-registrations`),
      axios.get(`${API_BASE}/dashboard/session-status-stats`)
    ]).then(
      ([
        statsRes,
        sessionsRes,
        formateursRes,
        monthlyRegsRes,
        sessionStatusRes
      ]) => {
        setStats(statsRes.data);
        setTopSessions(sessionsRes.data);
        setTopFormateurs(formateursRes.data);
        setMonthlyRegs(monthlyRegsRes.data);
        setSessionStatusStats(sessionStatusRes.data);
      }
    ).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size={64} />
      </Box>
    );
  }

  // --- Pie data for Monthly Regs ---
  const sumMonthly = (key) =>
    monthlyRegs.reduce((acc, cur) => acc + (cur[key] || 0), 0);
  const monthlyPieData = [
    { name: "Étudiants", value: sumMonthly("students"), color: COLORS[0] },
    { name: "Formateurs", value: sumMonthly("formateurs"), color: COLORS[1] },
    { name: "Créateurs", value: sumMonthly("creators"), color: COLORS[2] },
    { name: "Établissements", value: sumMonthly("establishments"), color: COLORS[3] }
  ];

 return (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      width: "100%",
      minHeight: "100vh",
      bgcolor: "#fafbfc",
      py: { xs: 2, md: 5 },
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,  // adjust as you want for your design!
        mx: "auto",
        px: { xs: 1.5, md: 3, lg: 5 },
      }}
    >
      <Typography variant="h4" fontWeight={800} mb={1} letterSpacing={0.5}>
        <span role="img" aria-label="dashboard">🧑‍💻</span> Tableau de bord Admin
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Vue d'ensemble des performances et statistiques de la plateforme
      </Typography>

      {/* ==== STAT CARDS ROW ==== */}
      <Grid container spacing={3} mb={1}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-sm" sx={{ borderRadius: 3, background: "#f6faff", height: 140 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#1976d2" }}>
                  <GroupIcon />
                </Avatar>
                <Box>
                  <Typography fontWeight={700} fontSize={24}>{stats.totalUsers}</Typography>
                  <Typography fontWeight={500} color="#1976d2">Total Utilisateurs</Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" spacing={2} mt={1}>
                <Typography variant="caption" color="success.main">Actifs <b>{stats.activeUsers || 0}</b></Typography>
                <Typography variant="caption" color="error.main">Inactifs <b>{stats.inactiveUsers || 0}</b></Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-sm" sx={{ borderRadius: 3, background: "#f7f1fa", height: 140 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#7c43bd" }}>
                  <SchoolIcon />
                </Avatar>
                <Box>
                  <Typography fontWeight={700} fontSize={24}>{stats.totalPrograms}</Typography>
                  <Typography fontWeight={500} color="#7c43bd">Programmes</Typography>
                </Box>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" spacing={2} mt={1}>
                <Typography variant="caption" color="#7c43bd">Publiés <b>{stats.totalProgramsPublished}</b></Typography>
                <Typography variant="caption" color="text.secondary">Brouillons <b>{stats.totalProgramsUnpublished}</b></Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-sm" sx={{ borderRadius: 3, background: "#f2faf6", height: 140 }}>
            <Grid item xs={12} sm={6} md={3}>
  <Card className="shadow-sm"
    sx={{
      borderRadius: 3,
      background: "#f2faf6",
      height: 140,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}
  >
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: "#2e7d32", width: 44, height: 44 }}>
          <EventAvailableIcon fontSize="medium" />
        </Avatar>
        <Box>
          <Typography fontWeight={800} fontSize={28} color="#2e7d32">
            {stats.activeSessions || 0}
          </Typography>
          <Typography fontWeight={600} color="#2e7d32">
            Sessions Actives
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 1.2 }} />
      <Stack direction="row" spacing={2} mt={1} alignItems="center">
        <Typography variant="body2" fontWeight={500} sx={{ color: "#e53935" }}>
          🔴 Inactives: <b>{stats.inactiveSessions || 0}</b>
        </Typography>
        <Typography variant="body2" fontWeight={500} sx={{ color: "#8e24aa" }}>
          ✅ Terminées: <b>{stats.completedSessions || 0}</b>
        </Typography>
        <Typography variant="body2" fontWeight={500} sx={{ color: "#757575" }}>
          📦 Arch.: <b>{stats.archivedSessions || 0}</b>
        </Typography>
      </Stack>
    </CardContent>
  </Card>
</Grid>

          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-sm" sx={{ borderRadius: 3, background: "#fff5f3", height: 140 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "#fa5a33" }}>
                  <ShowChartIcon />
                </Avatar>
                <Box>
                  <Typography fontWeight={700} fontSize={24} color="#fa5a33">{stats.activityRate || "100%"}</Typography>
                  <Typography fontWeight={500} color="#fa5a33">Taux d'Activité</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ==== SECONDARY CARDS (user repartition, top sessions, etc) ==== */}
      <Grid container spacing={3} mb={1}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, minHeight: 180 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                <GroupIcon sx={{ mr: .5, color: "#1976d2" }} fontSize="small" /> Répartition Utilisateurs
              </Typography>
              <Stack spacing={1} mt={1}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: "#1976d2", fontSize: 18 }}>E</Avatar>
                  <Typography flex={1}>Étudiants</Typography>
                  <Typography fontWeight={700} color="#1976d2">{stats.totalStudents}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: "#43a047", fontSize: 18 }}>F</Avatar>
                  <Typography flex={1}>Formateurs</Typography>
                  <Typography fontWeight={700} color="#43a047">{stats.totalFormateurs}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: "#fbc02d", fontSize: 18 }}>C</Avatar>
                  <Typography flex={1}>Créateurs</Typography>
                  <Typography fontWeight={700} color="#fbc02d">{stats.totalCreators}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: "#8e24aa", fontSize: 18 }}>É</Avatar>
                  <Typography flex={1}>Établissements</Typography>
                  <Typography fontWeight={700} color="#8e24aa">{stats.totalEstablishments}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, minHeight: 180 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                <EmojiEventsIcon color="warning" fontSize="small" sx={{ mr: .5 }} /> Top 3 Sessions
              </Typography>
              <Stack spacing={1} mt={2}>
                {topSessions.map((s, idx) => (
                  <Paper key={s.sessionId} sx={{
                    p: 2, display: "flex", alignItems: "center", borderRadius: 2,
                    background: idx === 0 ? "#fff8e1" : "#f5f5f5"
                  }}>
                    <Box sx={{
                      width: 32, height: 32, borderRadius: "50%",
                      backgroundColor: "#fbc02d", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, mr: 2, fontSize: 18
                    }}>
                      #{idx + 1}
                    </Box>
                    <Box flex={1}>
                      <Typography fontWeight={700}>{s.sessionName}</Typography>
                      <Typography variant="caption" color="text.secondary">{s.programName}</Typography>
                      <Typography variant="body2" color="text.secondary">{s.enrolledUsers} inscrits</Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, minHeight: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                <StarIcon color="primary" fontSize="small" sx={{ mr: .5 }} /> Top 3 Formateurs
              </Typography>
              <Stack spacing={2} mt={2}>
                {topFormateurs.length === 0 ? (
                  <Typography color="text.secondary">Bientôt disponible</Typography>
                ) : (
                  topFormateurs.map((f, idx) => (
                    <Stack direction="row" alignItems="center" spacing={2} key={f.formateurId}>
                      <Avatar src={f.profilePic} alt={f.name} sx={{ width: 32, height: 32, mr: 1, bgcolor: "#2196f3" }}>
                        {!f.profilePic && f.name ? f.name[0].toUpperCase() : null}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>{f.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{f.averageRating ? `⭐ ${f.averageRating}` : ""}</Typography>
                      </Box>
                    </Stack>
                  ))
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ==== MAIN CHARTS ==== */}
      <Grid container spacing={3} sx={{ my: 1 }}>
        {/* -- Sessions Status Chart -- */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography fontWeight={700} variant="subtitle1">
                  <ShowChartIcon color="primary" fontSize="small" sx={{ mr: .5 }} />
                  Statut des Sessions
                </Typography>
                <ToggleButtonGroup
                  value={chartTypeSessions}
                  exclusive
                  size="small"
                  onChange={(_, value) => value && setChartTypeSessions(value)}
                  sx={{ background: "#f3f6fb", borderRadius: 2 }}
                >
                  <ToggleButton value="bar" aria-label="Bar">
                    <BarChartIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="pie" aria-label="Pie">
                    <PieChartOutlineIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Box height={260}>
                {chartTypeSessions === "bar" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionPieData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={8}>
                        {sessionPieData.map((entry, idx) => (
                          <Cell key={`cell-sess-bar-${idx}`} fill={entry.color} />
                        ))}
                        <LabelList dataKey="value" position="top" fontWeight={700} />
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
          </Card>
        </Grid>
        {/* -- Monthly Registrations Chart -- */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography fontWeight={700} variant="subtitle1">
                  <ShowChartIcon color="primary" fontSize="small" sx={{ mr: .5 }} />
                  Inscriptions (12 derniers mois)
                </Typography>
                <ToggleButtonGroup
                  value={chartTypeRegs}
                  exclusive
                  size="small"
                  onChange={(_, value) => value && setChartTypeRegs(value)}
                  sx={{ background: "#f3f6fb", borderRadius: 2 }}
                >
                  <ToggleButton value="bar" aria-label="Bar">
                    <BarChartIcon fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value="pie" aria-label="Pie">
                    <PieChartOutlineIcon fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Box height={260}>
                {chartTypeRegs === "bar" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRegs}>
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" stackId="a" fill={COLORS[0]} name="Étudiants" />
                      <Bar dataKey="formateurs" stackId="a" fill={COLORS[1]} name="Formateurs" />
                      <Bar dataKey="creators" stackId="a" fill={COLORS[2]} name="Créateurs" />
                      <Bar dataKey="establishments" stackId="a" fill={COLORS[3]} name="Établissements" />
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
                        fill="#8884d8"
                        paddingAngle={3}
                        dataKey="value"
                        label
                      >
                        {monthlyPieData.map((entry, idx) => (
                          <Cell key={`cell-month-pie-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  </Box>
);
}