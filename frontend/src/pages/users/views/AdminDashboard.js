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

const COLORS = ["#1976d2", "#43a047", "#fbc02d", "#8e24aa", "#e53935", "#00bcd4", "#ffa726"];
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

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
          color="#1976d2"
          mb={1}
          sx={{ textTransform: "capitalize" }}
        >
          <span role="img" aria-label="dashboard">🧑‍💻</span> Tableau de bord Admin
        </Typography>
        <Typography color="text.secondary" fontSize={17} mb={3}>
          Vue d'ensemble des performances et statistiques de la plateforme
        </Typography>

        {/* STAT CARDS */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<GroupIcon fontSize="large" />}
              value={stats.totalUsers}
              label="Total Utilisateurs"
              color="#1976d2"
              extra={
                <Stack direction="row" spacing={3} mt={1}>
                  <Typography variant="caption" color="success.main">
                    <b>{stats.activeUsers || 0}</b> actifs
                  </Typography>
                  <Typography variant="caption" color="error.main">
                    <b>{stats.inactiveUsers || 0}</b> inactifs
                  </Typography>
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<SchoolIcon fontSize="large" />}
              value={stats.totalPrograms}
              label="Programmes"
              color="#7c43bd"
              extra={
                <Stack direction="row" spacing={3} mt={1}>
                  <Typography variant="caption" color="#7c43bd">
                    <b>{stats.totalProgramsPublished}</b> publiés
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <b>{stats.totalProgramsUnpublished}</b> brouillons
                  </Typography>
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<EventAvailableIcon fontSize="large" />}
              value={stats.activeSessions || 0}
              label="Sessions Actives"
              color="#2e7d32"
              extra={
                <Stack direction="row" spacing={1.5} mt={1} alignItems="center">
                  <Typography variant="caption" sx={{ color: "#e53935", fontWeight: 700 }}>
                    🔴 {stats.inactiveSessions || 0} inactives
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#8e24aa", fontWeight: 700 }}>
                    ✅ {stats.completedSessions || 0} terminées
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#757575", fontWeight: 700 }}>
                    📦 {stats.archivedSessions || 0} arch.
                  </Typography>
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ShowChartIcon fontSize="large" />}
              value={stats.activityRate || "100%"}
              label="Taux d'Activité"
              color="#fa5a33"
            />
          </Grid>
        </Grid>

        {/* ELITE / TOP 3 */}
        <Divider sx={{ my: 4, maxWidth: 500, mx: "auto" }}>
          <EmojiEventsIcon sx={{ color: "#FBC02D" }} fontSize="large" />
        </Divider>
        <Grid container spacing={3} mb={3}>
          {/* User repartition */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              borderRadius: "2rem",
              minHeight: 200,
              boxShadow: "0 4px 20px rgba(25,118,210,0.07)",
              background: "linear-gradient(90deg, #f6faff 70%, #e3eefe 100%)"
            }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={800} mb={1.5}>
                  <GroupIcon sx={{ mr: .5, color: "#1976d2" }} fontSize="medium" />
                  Répartition Utilisateurs
                </Typography>
                <Stack spacing={2}>
                  <UserMini label="Étudiants" color="#1976d2" value={stats.totalStudents} />
                  <UserMini label="Formateurs" color="#43a047" value={stats.totalFormateurs} />
                  <UserMini label="Créateurs" color="#fbc02d" value={stats.totalCreators} />
                  <UserMini label="Établissements" color="#8e24aa" value={stats.totalEstablishments} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          {/* Top 3 Sessions */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              borderRadius: "2rem",
              minHeight: 200,
              boxShadow: "0 4px 20px rgba(251,192,45,0.11)",
              background: "linear-gradient(90deg, #fff8e1 60%, #ffe082 100%)"
            }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={800} mb={1.5}>
                  <EmojiEventsIcon color="warning" fontSize="medium" sx={{ mr: .5 }} />
                  Top 3 Sessions
                </Typography>
                <Stack spacing={2} mt={2}>
                  {topSessions.map((s, idx) => (
                    <Paper
                      key={s.sessionId}
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 2,
                        background: idx === 0
                          ? "linear-gradient(90deg, #fff8e1 60%, #ffe082 100%)"
                          : "#f5f5f5",
                        borderLeft: idx === 0
                          ? "6px solid #FBC02D"
                          : idx === 1
                            ? "6px solid #B0BEC5"
                            : "6px solid #FF7043"
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          bgcolor:
                            idx === 0
                              ? "#FBC02D"
                              : idx === 1
                                ? "#B0BEC5"
                                : "#FF7043",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 900,
                          fontSize: 18,
                          mr: 2,
                          boxShadow:
                            idx === 0
                              ? "0 0 12px #FBC02D77"
                              : undefined,
                        }}
                      >
                        {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                      </Box>
                      <Box flex={1}>
                        <Typography fontWeight={800}>{s.sessionName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {s.programName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {s.enrolledUsers} inscrits
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          {/* Top 3 Formateurs */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              borderRadius: "2rem",
              minHeight: 200,
              boxShadow: "0 4px 20px rgba(33,150,243,0.09)",
              background: "linear-gradient(90deg, #f7f1fa 70%, #ede6f8 100%)"
            }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={800} mb={1.5}>
                  <StarIcon color="primary" fontSize="medium" sx={{ mr: .5 }} />
                  Top 3 Formateurs
                </Typography>
                <Stack spacing={2} mt={2}>
                  {topFormateurs.length === 0 ? (
                    <Typography color="text.secondary">Bientôt disponible</Typography>
                  ) : (
                    topFormateurs.map((f, idx) => (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        key={f.formateurId}
                      >
                        <Avatar
                          src={f.profilePic}
                          alt={f.name}
                          sx={{
                            width: 36,
                            height: 36,
                            mr: 1,
                            bgcolor:
                              idx === 0
                                ? "#FBC02D"
                                : idx === 1
                                  ? "#B0BEC5"
                                  : "#FF7043",
                            border:
                              idx === 0
                                ? "2px solid #FBC02D"
                                : idx === 1
                                  ? "2px solid #B0BEC5"
                                  : "2px solid #FF7043",
                            boxShadow:
                              idx === 0
                                ? "0 0 10px #FBC02D88"
                                : undefined,
                          }}
                        >
                          {!f.profilePic && f.name ? f.name[0].toUpperCase() : null}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={800}>{f.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {f.averageRating ? `⭐ ${f.averageRating}` : ""}
                          </Typography>
                        </Box>
                      </Stack>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CHARTS / GRAPHS */}
        <Divider sx={{ my: 4, maxWidth: 500, mx: "auto" }}>
          <PieChartOutlineIcon sx={{ color: "#1976D2" }} fontSize="large" />
        </Divider>
        <Grid container spacing={3}>
          {/* Sessions Status Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: "2rem",
              p: 2,
              boxShadow: "0 6px 32px rgba(25,118,210,0.09)"
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography fontWeight={900} variant="subtitle1">
                    <ShowChartIcon color="primary" fontSize="medium" sx={{ mr: .5 }} />
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
                <Box height={230}>
                  {chartTypeSessions === "bar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sessionPieData}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={12}>
                          {sessionPieData.map((entry, idx) => (
                            <Cell key={`cell-sess-bar-${idx}`} fill={entry.color} />
                          ))}
                          <LabelList dataKey="value" position="top" fontWeight={900} />
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
          {/* Monthly Registrations Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: "2rem",
              p: 2,
              boxShadow: "0 6px 32px rgba(33,150,243,0.09)"
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography fontWeight={900} variant="subtitle1">
                    <ShowChartIcon color="primary" fontSize="medium" sx={{ mr: .5 }} />
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
                <Box height={230}>
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

// --- StatCard Component ---
function StatCard({ icon, value, label, color, extra }) {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${color}18 60%, #fff 100%)`,
        boxShadow: `0 6px 32px 0 ${color}18`,
        borderRadius: "2rem",
        p: 3,
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .18s",
        "&:hover": {
          transform: "translateY(-4px) scale(1.03)",
          boxShadow: `0 12px 38px 0 ${color}30`,
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h3" fontWeight={800} color={color}>
          {value}
        </Typography>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Stack>
      <Typography mt={2} color={color} fontWeight={700} fontSize={17}>
        {label}
      </Typography>
      {extra}
    </Box>
  );
}

// --- UserMini Stat for repartition ---
function UserMini({ label, color, value }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar sx={{ width: 32, height: 32, bgcolor: color }}>{label[0]}</Avatar>
      <Typography flex={1} fontWeight={600}>{label}</Typography>
      <Typography fontWeight={900} color={color}>{value}</Typography>
    </Stack>
  );
}