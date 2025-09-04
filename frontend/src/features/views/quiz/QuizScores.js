import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Chip, Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import api from '../../../api/axiosInstance';
import { getStoredUser } from '../../../utils/authUtils';

const QuizScores = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [userScores, setUserScores] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);

    const fetchQuizScores = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz info
        const quizResponse = await api.get(`/quizzes/${quizId}`);
        setQuizInfo(quizResponse.data);
        
        // Fetch user scores
        const scoresResponse = await api.get(`/quizzes/${quizId}/user-answers`);
        
        // Sort by score (highest first), then by submission date (most recent first)
        const sorted = [...scoresResponse.data].sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        });
        
        setUserScores(sorted);
      } catch (err) {
        console.error('Error fetching quiz scores:', err);
        setUserScores([]);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizScores();
    }
  }, [quizId]);

  const getScoreColor = (score, total) => {
    if (!total) return "#757575";
    const percentage = (score / total) * 100;
    if (percentage >= 70) return "#4caf50";
    if (percentage >= 50) return "#ff9800";
    return "#f44336";
  };

  const getPerformanceLabel = (score, total) => {
    if (!total) return "N/A";
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Very Good";
    if (percentage >= 70) return "Good";
    if (percentage >= 60) return "Fair";
    if (percentage >= 50) return "Pass";
    return "Needs Improvement";
  };

  const isCurrentUser = (userId) => {
    return currentUser && currentUser.id === userId;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/quizzes')}
          sx={{ mr: 2 }}
        >
          Retour aux Quizz
        </Button>
        <Typography variant="h4">
          📊 Scores - {quizInfo?.title || 'Quiz'}
        </Typography>
      </Box>

      {quizInfo && (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" gutterBottom>
            {quizInfo.title}
          </Typography>
          {quizInfo.description && (
            <Typography variant="body2" color="textSecondary" mb={1}>
              {quizInfo.description}
            </Typography>
          )}
          <Box display="flex" gap={3} flexWrap="wrap">
            <Typography variant="body2">
              <strong>Temps limite:</strong> {
                quizInfo.timeLimit 
                  ? quizInfo.timeLimit >= 60 
                    ? `${Math.floor(quizInfo.timeLimit / 60)} min`
                    : `${quizInfo.timeLimit} sec`
                  : '∞'
              }
            </Typography>
            <Typography variant="body2">
              <strong>Participants:</strong> {userScores.length}
            </Typography>
            {userScores.length > 0 && (
              <Typography variant="body2">
                <strong>Score moyen:</strong> {
                  Math.round(userScores.reduce((sum, entry) => sum + entry.score, 0) / userScores.length)
                }
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {userScores.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            🎯 Aucune soumission pour ce quiz
          </Typography>
          <Typography variant="body1" color="textSecondary" mt={1}>
            Soyez le premier à tenter ce quiz!
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Rang</strong></TableCell>
                <TableCell><strong>Avatar</strong></TableCell>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell align="center"><strong>Score</strong></TableCell>
                <TableCell align="center"><strong>Performance</strong></TableCell>
                <TableCell align="center"><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userScores.map((entry, idx) => {
                const isMe = isCurrentUser(entry.user?.id);
                const percentage = entry.totalPossible > 0 ? Math.round((entry.score / entry.totalPossible) * 100) : 0;
                
                return (
                  <TableRow 
                    key={entry.id} 
                    hover
                    sx={{ 
                      backgroundColor: isMe ? '#e3f2fd' : 'inherit',
                      border: isMe ? '2px solid #2196f3' : 'none'
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6" sx={{ mr: 1 }}>
                          {idx + 1}
                        </Typography>
                        {idx === 0 && <span>🏆</span>}
                        {idx === 1 && <span>🥈</span>}
                        {idx === 2 && <span>🥉</span>}
                        {isMe && (
                          <Chip 
                            label="MOI" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Avatar 
                        src={entry.user?.profilePic || ""} 
                        alt={entry.user?.name || ""}
                        sx={{ 
                          border: isMe ? '2px solid #2196f3' : 'none'
                        }}
                      >
                        {entry.user?.name?.charAt(0) || '?'}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={isMe ? 'bold' : 'normal'}>
                        {entry.user?.name || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {entry.user?.email || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography 
                        variant="h6" 
                        sx={{ color: getScoreColor(entry.score, entry.totalPossible) }}
                      >
                        <strong>{entry.score}</strong>
                        {entry.totalPossible > 0 && ` / ${entry.totalPossible}`}
                      </Typography>
                      {entry.totalPossible > 0 && (
                        <Typography 
                          variant="caption"
                          sx={{ color: getScoreColor(entry.score, entry.totalPossible) }}
                        >
                          {percentage}%
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getPerformanceLabel(entry.score, entry.totalPossible)}
                        size="small"
                        sx={{
                          backgroundColor: getScoreColor(entry.score, entry.totalPossible),
                          color: "white",
                          fontWeight: "bold"
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {new Date(entry.submittedAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(entry.submittedAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default QuizScores;
