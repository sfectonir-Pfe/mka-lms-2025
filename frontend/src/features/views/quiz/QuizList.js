import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosInstance';

const QuizList = ({ sessionId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/quizzes`)
      .then((res) => {
        setQuizzes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching quizzes', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>📋 Liste des Quizz</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Contenu</TableCell>
              <TableCell>Temps</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((q, index) => (
              <TableRow key={q.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{q.title || 'Sans titre'}</TableCell>
                <TableCell>{q.contenu?.title || '—'}</TableCell>
                <TableCell>{q.timeLimit ?? '∞'} min</TableCell>
                <TableCell>

                  <Button onClick={() => navigate(`/quiz/scores/${q.id}`)}>📊 Scores</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QuizList;
