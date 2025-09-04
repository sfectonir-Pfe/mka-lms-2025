import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Paper, Button, CircularProgress, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosInstance';
import RoleGate from '../../../pages/auth/RoleGate';

const QuizList = ({ sessionId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <Typography variant="h4" mb={2}>📋 {t('quiz.listTitle', 'Liste des Quizz')}</Typography>
      <RoleGate roles={['formateur']}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('quiz.headers.index', '#')}</TableCell>
                <TableCell>{t('quiz.headers.title', 'Titre')}</TableCell>
                <TableCell>{t('quiz.headers.content', 'Contenu')}</TableCell>
                <TableCell>{t('quiz.headers.time', 'Temps')}</TableCell>
                <TableCell>{t('quiz.headers.actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((q, index) => (
                <TableRow key={q.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{q.title || t('quiz.untitled', 'Sans titre')}</TableCell>
                  <TableCell>{q.contenu?.title || t('seances.dash', '—')}</TableCell>
                  <TableCell>{q.timeLimit ? Math.floor(q.timeLimit / 60) : '∞'} {t('quiz.min', 'min')}</TableCell>
                  <TableCell>

                    <Button onClick={() => navigate(`/quiz/scores/${q.id}`)}>📊 {t('quiz.scores', 'Scores')}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </RoleGate>
    </Box>
  );
};

export default QuizList;
