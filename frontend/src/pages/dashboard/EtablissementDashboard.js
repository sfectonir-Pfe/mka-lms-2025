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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../../api/axiosInstance";
import { getCurrentRole, getCurrentUserId } from '../auth/token';

export default function EtablissementDashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("Tous");
  const [students, setStudents] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [establishmentName, setEstablishmentName] = useState("");
  
  // Dialog states
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Get establishment name from logged-in user
  useEffect(() => {
    const fetchUserEstablishment = async () => {
      try {
        const currentRole = getCurrentRole();
        const currentUserId = getCurrentUserId();
        
        if (currentRole === 'etablissement') {
          // For etablissement users, get their establishment info
          const etablissementResponse = await api.get(`/etablissement2/user/${currentUserId}`);
          if (etablissementResponse.data && etablissementResponse.data.length > 0) {
            setEstablishmentName(etablissementResponse.data[0].name);
          }
        } else {
          // For other users, try to get from localStorage or use a default
          const userEstablishment = localStorage.getItem('userEstablissement') || 'Default Establishment';
          setEstablishmentName(userEstablishment);
        }
      } catch (error) {
        console.error('Error fetching user establishment:', error);
        // Fallback to localStorage or default
        const userEstablishment = localStorage.getItem('userEstablissement') || 'Default Establishment';
        setEstablishmentName(userEstablishment);
      }
    };

    fetchUserEstablishment();
  }, []);

  // Fetch comprehensive establishment data
  useEffect(() => {
    // Remove dependency on establishmentName since we're using user-specific endpoints
    // if (!establishmentName) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Use new user-specific endpoints that automatically filter by establishment
        console.log('Fetching data for establishment user');

        // Fetch establishment statistics
        const statsResponse = await api.get('/dashboard-establishment/my-stats');
        setStats(statsResponse.data);
        console.log('Stats response:', statsResponse.data);

        // Fetch students and their sessions
        const studentsResponse = await api.get('/dashboard-establishment/my-students');
        setStudents(studentsResponse.data);

        // Fetch top students by rating
        const topStudentsResponse = await api.get('/dashboard-establishment/my-top-students');
        setTopStudents(topStudentsResponse.data);

        // Fetch establishment sessions
        const sessionsResponse = await api.get('/dashboard-establishment/my-sessions');
        setSessions([{ id: "Tous", name: "Toutes les sessions" }, ...sessionsResponse.data]);

        // Fetch student feedbacks
        const feedbacksResponse = await api.get('/dashboard-establishment/my-feedbacks');
        setFeedbacks(feedbacksResponse.data);
      } catch (error) {
        console.error('Error fetching establishment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Remove establishmentName dependency

  // Helper functions
  const handleViewFeedbacks = async (student) => {
    try {
      // Fetch detailed feedbacks for this specific student
      const response = await api.get(`/dashboard-establishment/my-feedbacks?studentId=${student.id}`);
      const studentFeedbackData = {
        ...student,
        detailedFeedbacks: response.data
      };
      setSelectedStudent(studentFeedbackData);
      setFeedbackDialogOpen(true);
    } catch (error) {
      console.error('Error fetching student feedbacks:', error);
      // Fallback to existing data
      setSelectedStudent(student);
      setFeedbackDialogOpen(true);
    }
  };

  const handleViewHistory = async (student) => {
    try {
      const response = await api.get(`/dashboard-establishment/my-student-history/${student.id}`);
      setStudentHistory(response.data);
      setSelectedStudent(student);
      setHistoryDialogOpen(true);
    } catch (error) {
      console.error('Error fetching student history:', error);
    }
  };

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
      <Typography variant="h4" fontWeight={700} mb={4} color="primary.main">
        🏫 Tableau de bord Établissement
        {establishmentName && (
          <Typography variant="h6" color="text.secondary" mt={1}>
            {establishmentName}
          </Typography>
        )}
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
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {stats.totalStudents || 0}
                </Typography>
                <GroupIcon sx={{ color: "primary.main", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="text.primary" fontWeight={500} fontSize={18}>
                Total Étudiants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="secondary.main">
                  {stats.activeSessions || 0}
                </Typography>
                <SchoolIcon sx={{ color: "secondary.main", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="text.primary" fontWeight={500} fontSize={18}>
                Sessions Actives
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="info.main">
                  {stats.totalFeedbacks || 0}
                </Typography>
                <FeedbackIcon sx={{ color: "info.main", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="text.primary" fontWeight={500} fontSize={18}>
                Total Feedbacks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h3" fontWeight={700} color="warning.main">
                  {topStudents.length}
                </Typography>
                <EmojiEventsIcon sx={{ color: "warning.main", fontSize: 44 }} />
              </Stack>
              <Typography mt={2} color="text.primary" fontWeight={500} fontSize={18}>
                Top Étudiants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Liste étudiants */}
      <Card sx={{ borderRadius: 3, mt: 2, maxWidth: 1200, mx: "auto" }}>
        <CardContent>
          <Typography variant="h6" mb={2} color="primary.main" fontWeight={700}>
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
                          <Button
                            size="small"
                            startIcon={<FeedbackIcon />}
                            onClick={() => handleViewFeedbacks(student)}
                            sx={{ ml: 1 }}
                          >
                            Feedbacks
                          </Button>
                          <Button
                            size="small"
                            startIcon={<HistoryIcon />}
                            onClick={() => handleViewHistory(student)}
                            sx={{ ml: 1 }}
                          >
                            Historique
                          </Button>
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
          <Typography variant="h6" mb={2} color="primary.main" fontWeight={700}>
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
                      {student.sessions?.length || 0} session(s) inscrite(s)
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

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              📋 Feedbacks de {selectedStudent?.name}
            </Typography>
            <IconButton onClick={() => setFeedbackDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box>
              <Typography variant="h6" mb={2}>
                Total des feedbacks: {selectedStudent.detailedFeedbacks?.length || 0}
              </Typography>
              <Typography variant="h6" mb={2}>
                Note moyenne: {selectedStudent.averageRating || 0}⭐
              </Typography>
              
              {selectedStudent.detailedFeedbacks && selectedStudent.detailedFeedbacks.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Session</TableCell>
                        <TableCell>Programme</TableCell>
                        <TableCell>Note</TableCell>
                        <TableCell>Commentaires</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedStudent.detailedFeedbacks.map((feedback, index) => (
                        <TableRow key={index}>
                          <TableCell>{feedback.sessionName}</TableCell>
                          <TableCell>{feedback.programName}</TableCell>
                          <TableCell>
                            <Chip
                              icon={<StarIcon />}
                              label={`${feedback.rating || 'N/A'}⭐`}
                              color="warning"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {feedback.comments ? (
                              <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {typeof feedback.comments === 'string' ? feedback.comments : JSON.stringify(feedback.comments)}
                              </Typography>
                            ) : 'Aucun commentaire'}
                          </TableCell>
                          <TableCell>
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={2}>
                  Aucun feedback disponible pour cet étudiant
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              📚 Historique de {selectedStudent?.name}
            </Typography>
            <IconButton onClick={() => setHistoryDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {studentHistory && (
            <Box>
              <Typography variant="h6" mb={2}>
                Sessions rejointes: {studentHistory.length || 0}
              </Typography>
              
              {studentHistory.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Session</TableCell>
                        <TableCell>Programme</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell>Date de début</TableCell>
                        <TableCell>Date de fin</TableCell>
                        <TableCell>Date d'inscription</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentHistory.map((session, index) => (
                        <TableRow key={index}>
                          <TableCell>{session.sessionName}</TableCell>
                          <TableCell>{session.programName}</TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(session.status)}
                              color={getStatusColor(session.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {session.startDate ? new Date(session.startDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {session.endDate ? new Date(session.endDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(session.joinedAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={2}>
                  Aucun historique de session disponible pour cet étudiant
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
