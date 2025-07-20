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
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function EtudiantDashboardPage() {
  // TODO: Replace with your real user id (from auth/localStorage)
 const userId = JSON.parse(localStorage.getItem("user"))?.id || 1;


  const [stats, setStats] = useState({
    total: 0,
    terminee: 0,
    encours: 0,
    avenir: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLoading(true);
  Promise.all([
    axios.get(`${API_BASE}/dashboard-etudiant/joined-sessions?userId=${userId}`),
    axios.get(`${API_BASE}/dashboard-etudiant/joined-sessions/stats?userId=${userId}`),
  ])
    .then(([listRes, statsRes]) => {
      console.log("joined sessions:", listRes.data); // <--- add this!
      console.log("session stats:", statsRes.data);
      setSessions(listRes.data);
      setStats(statsRes.data);
    })
    .catch(() => {
      setSessions([]);
      setStats({ total: 0, terminee: 0, encours: 0, avenir: 0 });
    })
    .finally(() => setLoading(false));
}, [userId]);
;

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={4} color="#2980b9">
        👨‍🎓 Tableau de bord Étudiant
      </Typography>

      {/* Stat Cards */}
      <Box width="100%" display="flex" justifyContent="center" alignItems="center" mb={5}>
        <Grid
          container
          spacing={4}
          sx={{ maxWidth: 1440, margin: "auto" }}
          justifyContent="center"
        >
          {/* Total Sessions */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #e3edfc 60%, #d7e9fa 100%)",
                boxShadow: "0 6px 32px 0 rgba(30,136,229,.10)",
                borderRadius: 3,
                p: 4,
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .18s",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.03)",
                  boxShadow: "0 12px 38px 0 rgba(30,136,229,.13)",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#2196f3">
                  {stats.total}
                </Typography>
                <GroupIcon sx={{ color: "#2196f3", fontSize: 48 }} />
              </Stack>
              <Typography mt={2} color="#3b5998" fontWeight={500} fontSize={18}>
                Sessions rejointes
              </Typography>
            </Box>
          </Grid>
          {/* Terminées */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #fdeaea 60%, #fad5d5 100%)",
                boxShadow: "0 6px 32px 0 rgba(244,67,54,.10)",
                borderRadius: 3,
                p: 4,
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .18s",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.03)",
                  boxShadow: "0 12px 38px 0 rgba(244,67,54,.13)",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#e53935">
                  {stats.terminee}
                </Typography>
                <EventBusyIcon sx={{ color: "#e53935", fontSize: 48 }} />
              </Stack>
              <Typography mt={2} color="#b71c1c" fontWeight={500} fontSize={18}>
                Terminées
              </Typography>
            </Box>
          </Grid>
          {/* En cours */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #e7faed 60%, #d5f5e3 100%)",
                boxShadow: "0 6px 32px 0 rgba(76,175,80,.10)",
                borderRadius: 3,
                p: 4,
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .18s",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.03)",
                  boxShadow: "0 12px 38px 0 rgba(76,175,80,.13)",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#4caf50">
                  {stats.encours}
                </Typography>
                <EventAvailableIcon sx={{ color: "#4caf50", fontSize: 48 }} />
              </Stack>
              <Typography mt={2} color="#388e3c" fontWeight={500} fontSize={18}>
                En cours
              </Typography>
            </Box>
          </Grid>
          {/* À venir */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #f4eafd 60%, #edd5fa 100%)",
                boxShadow: "0 6px 32px 0 rgba(156,39,176,.10)",
                borderRadius: 3,
                p: 4,
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .18s",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.03)",
                  boxShadow: "0 12px 38px 0 rgba(156,39,176,.13)",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#9c27b0">
                  {stats.avenir}
                </Typography>
                <HourglassBottomIcon sx={{ color: "#9c27b0", fontSize: 48 }} />
              </Stack>
              <Typography mt={2} color="#7b1fa2" fontWeight={500} fontSize={18}>
                À venir
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* SESSION LIST */}
      <Card sx={{ borderRadius: 3, mt: 2, maxWidth: 900, mx: "auto" }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            📚 Liste des sessions rejointes
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : !sessions.length ? (
            <Typography color="text.secondary">Aucune session trouvée.</Typography>
          ) : (
            <List dense>
              {sessions.map((session) => (
                <ListItem key={session.sessionId} divider>
                  <ListItemText
                    primary={session.sessionName}
                    secondary={
                      <span>
                        {session.startDate
                          ? `Début : ${new Date(session.startDate).toLocaleDateString()}`
                          : ""}
                        {session.endDate
                          ? `  — Fin : ${new Date(session.endDate).toLocaleDateString()}`
                          : ""}
                        &nbsp;|&nbsp;
                        <b>
                          {session.statut === "terminée" && (
                            <span style={{ color: "#e53935" }}>Terminée</span>
                          )}
                          {session.statut === "en cours" && (
                            <span style={{ color: "#27ae60" }}>En cours</span>
                          )}
                          {session.statut === "à venir" && (
                            <span style={{ color: "#9c27b0" }}>À venir</span>
                          )}
                        </b>
                      </span>
                    }
                  />
                  <Chip
                    label={session.statut}
                    color={
                      session.statut === "terminée"
                        ? "error"
                        : session.statut === "en cours"
                        ? "success"
                        : "secondary"
                    }
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
