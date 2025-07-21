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
  Chip,
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

// Color palette for charts
const COLORS = ["#1976d2", "#43a047", "#fbc02d", "#8e24aa", "#e53935", "#00bcd4", "#ffa726"];

const statusMap = {
  active:    { color: "#27ae60", label: "Active", icon: <PlayCircleIcon fontSize="small" /> },
  inactive:  { color: "#eb5757", label: "Inactive", icon: <PauseCircleIcon fontSize="small" /> },
  completed: { color: "#9b51e0", label: "Terminée", icon: <CheckCircleIcon fontSize="small" /> },
  archived:  { color: "#616161", label: "Archivée", icon: <ArchiveIcon fontSize="small" /> }
};

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Pie chart formatter
const toPieData = (dataArr, labelMap = {}) => {
  if (!dataArr?.length) return [];
  const keys = ["active", "inactive", "completed", "archived"];
  return keys.map((key, idx) => ({
    name: labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
    value: dataArr.reduce((acc, cur) => acc + (cur[key] || 0), 0),
    color: COLORS[idx % COLORS.length],
  }));
};

export default function CreateurDashboard() {
  const [stats, setStats] = useState(null);
  const [topSessions, setTopSessions] = useState([]);
  const [inactiveSessions, setInactiveSessions] = useState([]);
  const [sessionFeedback, setSessionFeedback] = useState([]);
  const [monthlySessionStatus, setMonthlySessionStatus] = useState([]);
  const [monthlyProgramPublish, setMonthlyProgramPublish] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    ).catch((err) => {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Erreur de connexion au serveur backend."
      );
    }).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size={64} />
      </Box>
    );
  }

  // Pie data for Monthly Program Publish
  const sumMonthly = (key) =>
    monthlyProgramPublish.reduce((acc, cur) => acc + (cur[key] || 0), 0);
  const programPieData = [
    { name: "Publiés", value: sumMonthly("published"), color: "#2f80ed" },
    { name: "Non publiés", value: sumMonthly("unpublished"), color: "#f2994a" }
  ];

  // Status badge
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
          color="#43a047"
          mb={1}
          sx={{ textTransform: "capitalize" }}
        >
          <span role="img" aria-label="dashboard">👨‍💻</span> Tableau de bord Créateur
        </Typography>
        <Typography color="text.secondary" fontSize={17} mb={3}>
          Vue d'ensemble de vos formations, contenus et sessions
        </Typography>

        {/* STAT CARDS */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3} lg={2.4}>
            <StatCard
              icon={<WidgetsIcon sx={{ color: "#2196f3", fontSize: 44 }} />}
              value={stats.totalModules}
              label="Modules"
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.4}>
            <StatCard
              icon={<BookIcon sx={{ color: "#6c63ff", fontSize: 44 }} />}
              value={stats.totalCourses}
              label="Cours"
              color="#6c63ff"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.4}>
            <StatCard
              icon={<CollectionsIcon sx={{ color: "#fb8c00", fontSize: 44 }} />}
              value={stats.totalContenus}
              label="Contenus"
              color="#fb8c00"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.4}>
            <StatCard
              icon={<SchoolIcon sx={{ color: "#4caf50", fontSize: 44 }} />}
              value={stats.totalPrograms}
              label="Programmes"
              color="#4caf50"
              extra={
                <Stack spacing={0.5} mt={2}>
                  <Typography fontSize={15} color="text.secondary">
                    Publiés: <b>{stats.totalProgramsPublished}</b>
                  </Typography>
                  <Typography fontSize={15} color="text.secondary">
                    Non publiés: <b>{stats.totalProgramsUnpublished}</b>
                  </Typography>
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2.4}>
            <StatCard
              icon={<StarIcon sx={{ color: "#e84393", fontSize: 44 }} />}
              value={stats.totalSessions}
              label="Sessions"
              color="#e84393"
              extra={
                <Stack spacing={0.5} mt={2}>
                  <SessionStat label="Actives" value={stats.totalSessionsActive} color={statusMap.active.color} />
                  <SessionStat label="Inactives" value={stats.totalSessionsInactive} color={statusMap.inactive.color} />
                  <SessionStat label="Terminées" value={stats.totalSessionsCompleted} color={statusMap.completed.color} />
                  <SessionStat label="Archivées" value={stats.totalSessionsArchived} color={statusMap.archived.color} />
                </Stack>
              }
            />
          </Grid>
        </Grid>

        {/* CHARTS & SESSION RANKING */}
        <Divider sx={{ my: 4, maxWidth: 500, mx: "auto" }}>
          <EmojiEventsIcon sx={{ color: "#FBC02D" }} fontSize="large" />
        </Divider>
        <Grid container spacing={3} mb={3}>
          {/* Session Status by Month */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: "2rem",
              minHeight: 260,
              boxShadow: "0 4px 24px rgba(39,174,96,0.08)",
              background: "linear-gradient(90deg, #f6faff 70%, #e3fce5 100%)",
              height: "100%",
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
            </Card>
          </Grid>
          {/* Programs Published/Unpublished by Month */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: "2rem",
              minHeight: 260,
              boxShadow: "0 4px 24px rgba(155,81,224,0.07)",
              background: "linear-gradient(90deg, #f7f1fa 70%, #f3e6fa 100%)",
              height: "100%",
            }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography fontWeight={900} variant="subtitle1">
                    <ShowChartIcon color="primary" fontSize="medium" sx={{ mr: .5 }} />
                    Programmes publiés/non publiés
                  </Typography>
                  <ToggleButtonGroup
                    value={chartTypePrograms}
                    exclusive
                    size="small"
                    onChange={(_, value) => value && setChartTypePrograms(value)}
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
                  {chartTypePrograms === "bar" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyProgramPublish}>
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="published" stackId="a" fill="#2f80ed" name="Publiés" />
                        <Bar dataKey="unpublished" stackId="a" fill="#f2994a" name="Non publiés" />
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
            </Card>
          </Grid>
        </Grid>

        {/* TOP SESSIONS & INACTIVE SESSIONS */}
        <Divider sx={{ my: 4, maxWidth: 500, mx: "auto" }}>
          <StarIcon sx={{ color: "#e84393" }} fontSize="large" />
        </Divider>
        <Grid container spacing={3} mb={3}>
          {/* Top 3 Sessions */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: "2rem",
              minHeight: 140,
              boxShadow: "0 4px 20px rgba(251,192,45,0.11)",
              background: "linear-gradient(90deg, #fff8e1 60%, #ffe082 100%)",
            }}>
              <CardContent>
                <Typography fontWeight={800} mb={2}>
                  <EmojiEventsIcon color="warning" sx={{ mb: -.5 }} /> Top 3 Sessions (plus d'inscrits)
                </Typography>
                {topSessions.map((s, idx) => (
                  <Box key={s.sessionId} mb={2} display="flex" alignItems="center">
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
                        fontWeight: 900,
                        fontSize: 22,
                        mr: 2,
                        boxShadow:
                          idx === 0
                            ? "0 0 10px #FBC02D55"
                            : undefined,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                    </Box>
                    <Typography flex={1} fontWeight={600} fontSize={17}>
                      {s.sessionName}
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
                {!topSessions.length && (
                  <Typography color="text.secondary">Aucune donnée.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          {/* Inactive Sessions */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: "2rem",
              minHeight: 140,
              boxShadow: "0 4px 20px rgba(235,87,87,0.09)",
              background: "linear-gradient(90deg, #fff5f5 70%, #ffeaea 100%)",
            }}>
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
            </Card>
          </Grid>
        </Grid>

        {/* FEEDBACKS */}
        <Divider sx={{ my: 4, maxWidth: 500, mx: "auto" }}>
          <StarIcon sx={{ color: "#e84393" }} fontSize="large" />
        </Divider>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12}>
            <Card sx={{
              borderRadius: "2rem",
              boxShadow: "0 4px 24px rgba(106,27,154,0.09)",
              background: "linear-gradient(90deg, #f7f1fa 70%, #f3e6fa 100%)",
            }}>
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
        {icon}
      </Stack>
      <Typography mt={2} color={color} fontWeight={700} fontSize={17}>
        {label}
      </Typography>
      {extra}
    </Box>
  );
}

// --- SessionStat Mini Component ---
function SessionStat({ label, value, color }) {
  return (
    <Typography fontSize={15} fontWeight={600} sx={{ color }}>
      {label}: <b>{value}</b>
    </Typography>
  );
}
