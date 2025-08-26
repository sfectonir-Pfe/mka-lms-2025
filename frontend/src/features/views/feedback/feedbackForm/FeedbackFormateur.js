import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import {
  ThumbUp,
  ThumbDown,
  EmojiEmotions,
  School,
  Star,
  Person,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import api from "../../../../api/axiosInstance";

const FeedbackFormateur = ({ seanceId }) => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
  const formateurId = user?.id;

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [feedbackEnvoye, setFeedbackEnvoye] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [feedbacksEnvoyes, setFeedbacksEnvoyes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chargement des étudiants sans feedback
  const loadStudents = useCallback(() => {
    if (!formateurId || !seanceId) return;
    
    const url = `/users/students/without-feedback?formateurId=${formateurId}&seanceId=${seanceId}`;
    console.log('Chargement des étudiants depuis:', url);
    
    api.get(url)
      .then((response) => {
        console.log('Réponse étudiants sans feedback:', response.data);
        setStudents(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des étudiants:', err);
        setStudents([]);
        // Afficher une erreur plus détaillée
        console.error('Détails de l\'erreur:', err.message);
      });
  }, [formateurId, seanceId]);

  useEffect(() => {
    if (!formateurId || !seanceId) return;

    // Reset state when seanceId changes to avoid sharing state across sessions
    setStudents([]);
    setFeedbacksEnvoyes([]);
    setSelectedStudent(null);
    setSelectedEmoji(null);
    setCommentaire('');
    setFeedbackEnvoye(false);

    loadStudents();

    api.get(`/feedback-formateur/seance/${seanceId}`)
      .then((response) => {
        console.log('Réponse feedbacks envoyés:', response.data);
        setFeedbacksEnvoyes(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => setFeedbacksEnvoyes([]));
  }, [formateurId, seanceId, loadStudents]);

  const studentsFiltered = Array.isArray(students)
    ? students.filter((s) => s.role === 'Etudiant' || !s.role)
    : [];

  const emojis = [
    { id: 1, emoji: '😊', label: t('feedbackFormateur.emoji.satisfied'), color: 'success' },
    { id: 2, emoji: '👍', label: t('feedbackFormateur.emoji.excellent'), color: 'primary' },
    { id: 3, emoji: '💡', label: t('feedbackFormateur.emoji.clearIdeas'), color: 'warning' },
    { id: 4, emoji: '🚀', label: t('feedbackFormateur.emoji.fastProgress'), color: 'info' },
    { id: 5, emoji: '🧠', label: t('feedbackFormateur.emoji.goodUnderstanding'), color: 'secondary' },
    { id: 6, emoji: '⚠️', label: t('feedbackFormateur.emoji.needsAttention'), color: 'error' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedEmoji) return;

    const selectedEmojiData = emojis.find((e) => e.id === selectedEmoji);
    const payload = {
      formateurId: Number(formateurId),
      etudiantId: Number(selectedStudent.id),
      emoji: selectedEmojiData?.emoji,
      commentaire,
      seanceId: Number(seanceId),
    };
    console.log('Payload envoyé:', payload);

    try {
      setIsSubmitting(true);
      
      // Mise à jour optimiste
      // 1. Retirer l'étudiant de la liste
      setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
      
      // 2. Ajouter le feedback dans le DataGrid
      setFeedbacksEnvoyes(prev => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          studentName: selectedStudent.name,
          studentEmail: selectedStudent.email,
          emoji: selectedEmojiData.emoji,
          emojiLabel: selectedEmojiData.label,
          commentaire: commentaire
        }
      ]);
      
      // 3. Envoyer la requête au serveur
      const response = await api.post('/feedback-formateur', payload);

      // 4. Synchroniser avec le serveur
      const updatedFeedbacks = await api.get(`/feedback-formateur/seance/${seanceId}`);
      setFeedbacksEnvoyes(Array.isArray(updatedFeedbacks.data) ? updatedFeedbacks.data : []);

      setFeedbackEnvoye(true);
      setSelectedStudent(null);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du feedback:', err);
      
      // Annuler les modifications optimistes en cas d'erreur
      loadStudents();
      api.get(`/feedback-formateur/seance/${seanceId}`)
        .then((response) => setFeedbacksEnvoyes(Array.isArray(response.data) ? response.data : []));
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Une erreur est survenue lors de l\'envoi du feedback.';
      if (err.response) {
        errorMessage = `Erreur serveur: ${err.response.status}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedEmoji(null);
    setCommentaire('');
    setSelectedStudent(null);
    setFeedbackEnvoye(false);
  };

  if (feedbackEnvoye) {
    return (
      <Box className="text-center p-5" sx={{ bgcolor: '#f8f9fa', borderRadius: 2 }}>
        <Star sx={{ fontSize: 60, color: 'gold', mb: 2 }} />
        <Typography variant="h4" className="text-success mb-3">
          {t('feedbackFormateur.sentSuccessTitle')}
        </Typography>
        <Typography variant="body1" className="mb-2">
          {t('feedbackFormateur.sentFor', { name: selectedStudent?.name || '' })}
        </Typography>
        <Typography variant="body1" className="mb-4">
          {emojis.find((e) => e.id === selectedEmoji)?.emoji} -{' '}
          {emojis.find((e) => e.id === selectedEmoji)?.label}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={resetForm}
          startIcon={<EmojiEmotions />}
          className="me-2"
        >
          {t('feedbackFormateur.newFeedback')}
        </Button>
        
      </Box>
    );
  }

  if (!selectedStudent) {
    return (
      <Paper elevation={3} className="p-4" sx={{ maxWidth: 800, margin: 'auto' }}>
        <Box className="text-center mb-4">
          <School sx={{ fontSize: 50, color: 'primary.main' }} />
          <Typography variant="h4" className="mb-2">
            {t('feedbackFormateur.selectStudentTitle')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('feedbackFormateur.selectStudentSubtitle')}
          </Typography>
        </Box>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {studentsFiltered.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
              {t('feedbackFormateur.allStudentsHaveFeedback')}
            </Typography>
          ) : (
            studentsFiltered.map((student) => (
              <React.Fragment key={student.id}>
                <ListItem alignItems="flex-start" disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedStudent(student)}
                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {(student.name || '').split(' ').map((n) => n[0]).join('').toUpperCase() || '?'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.name}
                      secondary={student.groupe || student.email}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))
          )}
        </List>
        <Box sx={{ height: 350, width: '100%', my: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('feedbackFormateur.studentsAlreadyReceived')}
          </Typography>
          <DataGrid
            rows={Array.isArray(feedbacksEnvoyes) ? feedbacksEnvoyes.map((f, idx) => ({
              id: f && typeof f === 'object' && 'id' in f ? f.id || idx : idx,
              name: f && typeof f === 'object' && 'studentName' in f ? f.studentName : '',
              email: f && typeof f === 'object' && 'studentEmail' in f ? f.studentEmail : '',
              emoji: f && typeof f === 'object' && 'emoji' in f ? f.emoji : '',
              emojiLabel: f && typeof f === 'object' && 'emojiLabel' in f ? f.emojiLabel : '',
              commentaire: f && typeof f === 'object' && 'commentaire' in f ? f.commentaire : '',
            })) : []}
            columns={[
              { field: 'name', headerName: t('feedbackFormateur.gridName'), flex: 1 },
              { field: 'email', headerName: t('feedbackFormateur.gridEmail'), flex: 1 },
              { field: 'emoji', headerName: t('feedbackFormateur.gridEmoji'), width: 80 },
              { field: 'emojiLabel', headerName: t('feedbackFormateur.gridLabel'), flex: 1 },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
          />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} className="p-4" sx={{ maxWidth: 800, margin: 'auto' }}>
      <Box className="text-center mb-4">
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
            {selectedStudent?.name
              ? selectedStudent.name.split(' ').map((n) => n[0]).join('').toUpperCase()
              : '?'}
          </Avatar>
          <Box textAlign="left">
            <Typography variant="h6">{selectedStudent?.name || ''}</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedStudent?.groupe || ''}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h5" className="mb-2">
          {t('feedbackFormateur.header')} <EmojiEmotions />
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setSelectedStudent(null)}
          startIcon={<Person />}
        >
          {t('feedbackFormateur.changeStudent')}
        </Button>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box className="mb-4" sx={{ textAlign: 'center' }}>
          <Typography variant="h6" className="mb-3">
            {t('feedbackFormateur.question', { firstName: (selectedStudent?.name || '').split(' ')[0] })} 😊
          </Typography>
          
          <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 600, margin: '0 auto' }}>
            {emojis.map((item) => (
              <Grid item xs={4} sm={2} key={item.id}>
                <Button
                  fullWidth
                  variant={selectedEmoji === item.id ? 'contained' : 'outlined'}
                  color={item.color}
                  onClick={() => setSelectedEmoji(item.id)}
                  sx={{ fontSize: '2rem', height: '80px', mb: 1 }}
                  disabled={isSubmitting}
                >
                  {item.emoji}
                </Button>
                <Typography variant="caption" display="block" sx={{ textAlign: 'center' }}>
                  {item.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        <TextField
          fullWidth
          label={t('feedbackFormateur.commentLabel', { firstName: (selectedStudent?.name || '').split(' ')[0] })}
          multiline
          rows={4}
          variant="outlined"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          className="mb-4"
          placeholder={t('feedbackFormateur.commentPlaceholder', { firstName: (selectedStudent?.name || '').split(' ')[0] })}
          disabled={isSubmitting}
        />

        <Box className="d-flex justify-content-between">
          <Button
            variant="outlined"
            color="error"
            startIcon={<ThumbDown />}
            onClick={resetForm}
            disabled={isSubmitting}
          >
            {t('feedbackFormateur.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={!selectedEmoji || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <ThumbUp />}
          >
            {isSubmitting ? t('feedbackFormateur.sending') : t('feedbackFormateur.send')}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default FeedbackFormateur;