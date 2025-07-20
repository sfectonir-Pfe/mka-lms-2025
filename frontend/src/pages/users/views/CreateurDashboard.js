import React, { useEffect, useState } from "react";
import {
  Grid, Box, Typography, CircularProgress, Stack, Divider,
  Card, CardContent, Alert, Chip
} from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import SchoolIcon from "@mui/icons-material/School";
import WidgetsIcon from "@mui/icons-material/Widgets";
import CollectionsIcon from "@mui/icons-material/Collections";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ArchiveIcon from "@mui/icons-material/Archive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// STATUS COLORS AND ICONS MAP
const statusMap = {
  active:    { color: "#27ae60", label: "Active", icon: <PlayCircleIcon fontSize="small" /> },
  inactive:  { color: "#eb5757", label: "Inactive", icon: <PauseCircleIcon fontSize="small" /> },
  completed: { color: "#9b51e0", label: "Completed", icon: <CheckCircleIcon fontSize="small" /> },
  archived:  { color: "#616161", label: "Archived", icon: <ArchiveIcon fontSize="small" /> }
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

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      axios.get(`${API_BASE}/creator-dashboard/stats`),
      axios.get(`${API_BASE}/creator-dashboard/top-sessions`),
      axios.get(`${API_BASE}/creator-dashboard/inactive-sessions`),
      axios.get(`${API_BASE}/creator-dashboard/session-feedback`),
      axios.get(`${API_BASE}/creator-dashboard/monthly-session-status`),
      axios.get(`${API_BASE}/creator-dashboard/monthly-program-publish`),
    ])
      .then(([statsRes, topRes, inactiveRes, feedbackRes, sessionStatusRes, programPublishRes]) => {
        setStats(statsRes.data);
        setTopSessions(topRes.data);
        setInactiveSessions(inactiveRes.data);
        setSessionFeedback(feedbackRes.data);
        setMonthlySessionStatus(sessionStatusRes.data);
        setMonthlyProgramPublish(programPublishRes.data);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Erreur de connexion au serveur backend."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size={64} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Status badge utility
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
          borderRadius: 2,
          fontSize: 13,
        }}
      />
    );
  };

  return (
  <Box sx={{ p: { xs: 1, md: 4 }, background: "#f7fafd", minHeight: "100vh", width: "100%" }}>
  <Typography variant="h4" fontWeight={700} mb={3} color="#27ae60">
    Tableau de bord – Créateur de formation
  </Typography>

  {/* --- STAT CARDS --- */}
  <Grid container spacing={3} mb={2}>
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
            <SessionStat label="Complétées" value={stats.totalSessionsCompleted} color={statusMap.completed.color} />
            <SessionStat label="Archivées" value={stats.totalSessionsArchived} color={statusMap.archived.color} />
          </Stack>
        }
      />
    </Grid>
  </Grid>

  {/* --- CHARTS & SESSIONS --- */}
  <Grid container spacing={3} mb={2}>
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={{ borderRadius: 3, height: "100%" }}>
        <CardContent>
          <Typography fontWeight={700} fontSize={16} mb={1} color="#2d9cdb">
            Statut des Sessions (12 derniers mois)
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySessionStatus}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" stackId="a" fill={statusMap.active.color} name="Actives" />
                <Bar dataKey="inactive" stackId="a" fill={statusMap.inactive.color} name="Inactives" />
                <Bar dataKey="completed" stackId="a" fill={statusMap.completed.color} name="Complétées" />
                <Bar dataKey="archived" stackId="a" fill={statusMap.archived.color} name="Archivées" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={6} lg={4}>
      <Card sx={{ borderRadius: 3, height: "100%" }}>
        <CardContent>
          <Typography fontWeight={700} fontSize={16} mb={1} color="#9b51e0">
            Programmes publiés/non publiés (12 derniers mois)
          </Typography>
          <Box sx={{ height: 220 }}>
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
          </Box>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={12} lg={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={12}>
          {/* Top Sessions */}
          <Card sx={{ borderRadius: 3, mb: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                <EmojiEventsIcon color="warning" /> Top 3 Sessions (plus d'inscrits)
              </Typography>
              {topSessions.map((s, idx) => (
                <Box key={s.sessionId} mb={2} display="flex" alignItems="center">
                  <Typography flex={1}>
                    <b>{idx + 1}.</b> {s.sessionName}
                    {s.programName && (
                      <span style={{ color: "#888" }}> ({s.programName})</span>
                    )}
                  </Typography>
                  <StatusChip status={s.status} />
                  <Typography color="text.secondary" fontSize={14} ml={2}>
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
        <Grid item xs={12} sm={6} lg={12}>
          {/* Inactive Sessions */}
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                <EventBusyIcon color="error" /> Sessions Inactives
              </Typography>
              {inactiveSessions.map((s, idx) => (
                <Box key={s.sessionId} mb={2} display="flex" alignItems="center">
                  <Typography flex={1}>
                    <b>{idx + 1}.</b> {s.sessionName}
                    {s.programName && (
                      <span style={{ color: "#888" }}> ({s.programName})</span>
                    )}
                  </Typography>
                  <StatusChip status={s.status} />
                  <Typography color="text.secondary" fontSize={14} ml={2}>
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
    </Grid>
  </Grid>

  {/* FEEDBACK SECTION – Full Width Row */}
  <Grid container spacing={3} mt={1}>
    <Grid item xs={12}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Feedback sur les Sessions (à venir)
          </Typography>
          {sessionFeedback.map((fb, idx) => (
            <Box key={fb.sessionId} mb={1}>
              <Typography>
                <b>{fb.sessionName}</b>
                {fb.programName && (
                  <span style={{ color: "#888" }}> ({fb.programName})</span>
                )}
              </Typography>
              <Typography color="text.secondary" fontSize={14}>
                Feedback: {fb.feedback ?? "N/A"}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Box>
  );}

// --- StatCard Component ---
function StatCard({ icon, value, label, color, extra }) {
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${color}18 60%, #fff 100%)`,
        boxShadow: `0 6px 32px 0 ${color}18`,
        borderRadius: 3,
        p: 4,
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .18s",
        "&:hover": {
          transform: "translateY(-4px) scale(1.03)",
          boxShadow: `0 12px 38px 0 ${color}20`,
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h3" fontWeight={700} color={color}>
          {value}
        </Typography>
        {icon}
      </Stack>
      <Typography mt={2} color={color} fontWeight={600} fontSize={18}>
        {label}
      </Typography>
      {extra}
    </Box>
  );
}

// --- SessionStat Mini Component ---
function SessionStat({ label, value, color }) {
  return (
    <Typography fontSize={15} fontWeight={500} sx={{ color }}>
      {label}: <b>{value}</b>
    </Typography>
  );
}
