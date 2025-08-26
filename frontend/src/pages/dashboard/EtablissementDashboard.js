import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Divider,
  Avatar,
  CircularProgress,
  Paper,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../api/axiosInstance";

export default function EtablissementDashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("Tous");
  const [students, setStudents] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [establishmentName, setEstablishmentName] = useState("");

  // Get establishment name from user context (you might need to adjust this based on your auth system)
  useEffect(() => {
    // For now, we'll use a placeholder. In a real app, you'd get this from the logged-in user
    // You might want to get this from localStorage, context, or an API call
    const userEstablishment = localStorage.getItem('userEstablishment') || 'Default Establishment';
    setEstablishmentName(userEstablishment);
  }, []);

  // Fetch students and sessions data
  useEffect(() => {
    if (!establishmentName) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch students and their sessions
        const studentsResponse = await api.get(`/dashboard-establishment/students/${encodeURIComponent(establishmentName)}`);
        setStudents(studentsResponse.data);

        // Fetch top students by rating
        const topStudentsResponse = await api.get(`/dashboard-establishment/top-students/${encodeURIComponent(establishmentName)}`);
        setTopStudents(topStudentsResponse.data);

        // Extract unique sessions from students data
        const allSessions = studentsResponse.data.flatMap(student => student.sessions);
        const uniqueSessions = allSessions.reduce((acc, session) => {
          if (!acc.find(s => s.id === session.id)) {
            acc.push(session);
          }
          return acc;
        }, []);
        
        setSessions([{ id: "Tous", name: "Toutes les sessions" }, ...uniqueSessions]);
      } catch (error) {
        console.error('Error fetching establishment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [establishmentName]);

  // Filter students by selected session
  const filteredStudents = selectedSession === "Tous"
    ? students
    : students.filter(student => 
        student.sessions.some(session => session.id === Number(selectedSession))
      );

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'primary';
      case 'INACTIVE': return 'default';
      case 'ARCHIVED': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'COMPLETED': return 'Terminée';
      case 'INACTIVE': return 'Inactive';
      case 'ARCHIVED': return 'Archivée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={4} color="#3d5afe">
        🏫 Tableau de bord Établissement
      </Typography>

      {/* Filtre par Session */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <TextField
          label="Session"
          select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          {sessions.map((sess) => (
            <MenuItem key={sess.id} value={sess.id}>
              {sess.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Statistiques */}
      <Grid container spacing={4} mb={3} maxWidth={1440} margin="auto">
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: "#e3f2fd" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#1976d2">
                  {filteredStudents.length}
                </Typography>
                <GroupIcon sx={{ color: "#1976d2", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="#1565c0" fontWeight={500} fontSize={18}>
                Étudiants inscrits
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: "#f3e5f5" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#8e24aa">
                  {sessions.length - 1}
                </Typography>
                <SchoolIcon sx={{ color: "#8e24aa", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="#6a1b9a" fontWeight={500} fontSize={18}>
                Sessions actives
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: "#fffde7" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="#fbc02d">
                  {topStudents.length}
                </Typography>
                <EmojiEventsIcon sx={{ color: "#fbc02d", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="#f9a825" fontWeight={500} fontSize={18}>
                Top étudiants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste étudiants */}
      <Card sx={{ borderRadius: 3, mt: 2, maxWidth: 1200, mx: "auto" }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Liste des étudiants ({filteredStudents.length})
          </Typography>
          {filteredStudents.length === 0 ? (
            <Typography color="text.secondary">Aucun étudiant trouvé.</Typography>
          ) : (
            <List dense>
              {filteredStudents.map((student) => (
                <Box key={student.id}>
                  <ListItem alignItems="flex-start" divider>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar 
                            src={student.profilePic} 
                            alt={student.name}
                            sx={{ width: 40, height: 40 }}
                          >
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {student.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {student.email}
                            </Typography>
                          </Box>
                          {student.averageRating > 0 && (
                            <Chip
                              icon={<StarIcon />}
                              label={`${student.averageRating}⭐`}
                              color="warning"
                              size="small"
                            />
                          )}
                        </Stack>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography fontSize={14} mb={1}>
                            <b>Sessions inscrites:</b>
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {student.sessions.map((session) => (
                              <Chip
                                key={session.id}
                                label={`${session.name} (${getStatusLabel(session.status)})`}
                                color={getStatusColor(session.status)}
                                size="small"
                                sx={{ mb: 0.5 }}
                              />
                            ))}
                            {student.sessions.length === 0 && (
                              <Typography variant="body2" color="text.secondary">
                                Aucune session inscrite
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Top étudiants par note */}
      <Card sx={{ borderRadius: 3, mt: 4, maxWidth: 700, mx: "auto" }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            <EmojiEventsIcon color="warning" /> Top étudiants (par note moyenne)
          </Typography>
          {topStudents.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={2}>
              Aucun étudiant avec des notes disponibles
            </Typography>
          ) : (
            topStudents.map((student, idx) => (
              <Paper key={student.id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : '#cd7f32',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    #{idx + 1}
                  </Avatar>
                  <Avatar 
                    src={student.profilePic} 
                    alt={student.name}
                    sx={{ width: 40, height: 40 }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography fontWeight={700} fontSize={18}>
                      {student.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {student.sessions.length} session(s) inscrite(s)
                    </Typography>
                  </Box>
                  <Chip 
                    icon={<StarIcon />}
                    label={`${student.averageRating}⭐`} 
                    color="warning" 
                    size="medium"
                  />
                </Stack>
              </Paper>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
