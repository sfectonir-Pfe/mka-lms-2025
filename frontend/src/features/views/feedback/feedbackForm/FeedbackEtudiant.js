import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import {
  NavigateBefore,
  NavigateNext,
  CheckCircle
} from "@mui/icons-material";
import axios from "axios";

const API_BASE = "http://localhost:8000/feedback-etudiant";

const FeedbackEtudiant = () => {
  const { id: seanceId } = useParams();
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [studentsToEvaluate, setStudentsToEvaluate] = useState([]);
  const [completedFeedbacks, setCompletedFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  // Emojis uniques pour tous les types de questions
  const emojis = [
    { emoji: "🤨", value: 'poor', label: 'Peu participatif' },
    { emoji: "😐", value: 'average', label: 'Participait parfois' },
    { emoji: "🙂", value: 'good', label: 'Bonne participation' },
    { emoji: "😃", value: 'very_good', label: 'Très participatif' },
    { emoji: "🤩", value: 'excellent', label: 'Exceptionnel' }
  ];

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const user = JSON.parse(localStorage.getItem('user')) || { id: 3 };
        const currentUserId = user.id;
        
        setCurrentStudent({
          id: currentUserId,
          name: user.name || 'Étudiant',
          email: user.email || 'etudiant@test.com'
        });
        
        const groupRes = await axios.get(`${API_BASE}/groups/student/${currentUserId}/seance/${seanceId}`);
        
        if (groupRes.data) {
          setCurrentGroup(groupRes.data);
          
          const questionsRes = await axios.get(`${API_BASE}/questions/group/${groupRes.data.id}`, {
            headers: { 'user-id': currentUserId }
          });
          setQuestions(questionsRes.data);
          
          if (questionsRes.data.length > 0 && questionsRes.data[0].groupStudents) {
            const otherStudents = questionsRes.data[0].groupStudents.filter(
              student => student.id !== currentUserId
            );
            setStudentsToEvaluate(otherStudents);
          }
        }
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        setLoading(false);
      }
    };

    if (seanceId) fetchData();
  }, [seanceId]);

  const handleFeedback = async (reaction) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || { id: 3 };
      const currentUserId = user.id;
      
      // Toujours envoyer la requête au backend (il gère la création/mise à jour)
      await axios.post(`${API_BASE}/feedbacks`, {
        questionId: questions[currentQuestionIndex].id,
        studentId: currentUserId,
        targetStudentId: selectedStudent.id,
        reaction,
        groupId: currentGroup.id,
        seanceId
      });
      
      // Mettre à jour le state local
      const existingFeedbackIndex = completedFeedbacks.findIndex(
        f => f.questionId === questions[currentQuestionIndex].id && 
             f.targetStudentId === selectedStudent.id
      );
      
      if (existingFeedbackIndex >= 0) {
        // Mettre à jour le feedback existant
        const updatedFeedbacks = [...completedFeedbacks];
        updatedFeedbacks[existingFeedbackIndex].reaction = reaction;
        setCompletedFeedbacks(updatedFeedbacks);
      } else {
        // Ajouter un nouveau feedback
        const feedbackData = {
          questionId: questions[currentQuestionIndex].id,
          targetStudentId: selectedStudent.id,
          reaction
        };
        setCompletedFeedbacks(prev => [...prev, feedbackData]);
      }
      
      setSelectedEmoji(reaction);
      return true;
    } catch (error) {
      console.error("Erreur envoi feedback:", error);
      return false;
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedEmoji(null);
    } else {
      setShowSummary(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedEmoji(null);
    }
  };

  const handleNextStudent = () => {
    const currentIndex = studentsToEvaluate.findIndex(
      student => student.id === selectedStudent.id
    );
    
    setShowSummary(false);
    setCurrentQuestionIndex(0);
    setSelectedEmoji(null);
    setCompletedFeedbacks([]);
    
    if (currentIndex < studentsToEvaluate.length - 1) {
      setSelectedStudent(studentsToEvaluate[currentIndex + 1]);
    } else {
      setSelectedStudent(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentGroup) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Vous n'êtes pas dans un groupe pour cette séance.
        </Typography>
      </Paper>
    );
  }

  if (studentsToEvaluate.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Aucun étudiant à évaluer dans votre groupe.
        </Typography>
      </Paper>
    );
  }

  if (!selectedStudent) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Sélectionnez un étudiant à évaluer
        </Typography>
        <Paper sx={{ p: 2, mt: 2 }}>
          <List>
            {studentsToEvaluate.map((student) => (
              <ListItem
                key={student.id}
                button
                onClick={() => setSelectedStudent(student)}
              >
                <ListItemAvatar>
                  <Avatar>
                    {student.name?.charAt(0) || '?'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={student.name || 'Étudiant'}
                  secondary={student.email || ''}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        <Paper sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Signification des évaluations :
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            {emojis.map((item, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1}>
                <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                <Typography variant="body2">
                  <strong>{item.label}</strong>
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  }

  if (showSummary) {
    return (
      <Box p={3}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Merci pour vos feedbacks !
          </Typography>
          <Typography>
            Vous avez évalué {selectedStudent.name} pour cette séance.
          </Typography>
          
          <Box mt={3}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Récapitulatif de vos évaluations pour {selectedStudent.name}
            </Typography>
            {questions.map((question, qIndex) => {
              const feedback = completedFeedbacks.find(
                f => f.questionId === question.id && f.targetStudentId === selectedStudent.id
              );
              const emojiData = emojis.find(e => e.value === feedback?.reaction);
              
              return (
                <Box key={question.id} mb={3}>
                  <Typography fontWeight="bold">{question.text}</Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {emojiData ? (
                      <>
                        <Typography variant="h5" mr={1}>{emojiData.emoji}</Typography>
                        <Typography>{emojiData.label}</Typography>
                      </>
                    ) : (
                      <Typography color="textSecondary">Non évalué</Typography>
                    )}
                  </Box>
                  {qIndex < questions.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              );
            })}
          </Box>
          
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleNextStudent}
            >
              {studentsToEvaluate.findIndex(
                student => student.id === selectedStudent.id
              ) < studentsToEvaluate.length - 1 ? 
                "Évaluer le prochain étudiant" : "Terminer"}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const existingFeedback = completedFeedbacks.find(
    f => f.questionId === currentQuestion.id && f.targetStudentId === selectedStudent.id
  );

  return (
    <Box p={3}>
      <Stepper activeStep={currentQuestionIndex} alternativeLabel sx={{ mb: 3 }}>
        {questions.map((question, index) => (
          <Step key={question.id}>
            <StepLabel>
              Question {index + 1}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
            {selectedStudent.name?.charAt(0) || '?'}
          </Avatar>
          <Box>
            <Typography variant="h6">
              Évaluation de {selectedStudent.name || 'Étudiant'}
            </Typography>
            <Typography color="textSecondary">
              Question {currentQuestionIndex + 1}/{questions.length}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            {currentQuestion.text}
          </Typography>
          
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            {emojis.map((item, index) => (
              <IconButton
                key={index}
                onClick={() => {
                  handleFeedback(item.value);
                }}
                sx={{ 
                  fontSize: '3rem',
                  p: 2,
                  backgroundColor: existingFeedback?.reaction === item.value ? 
                    '#1976d2' : '#f5f5f5',
                  color: existingFeedback?.reaction === item.value ? 
                    'white' : 'inherit',
                  border: '2px solid #e0e0e0',
                  borderRadius: '50%',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s',
                    backgroundColor: existingFeedback?.reaction === item.value ? 
                      '#1565c0' : '#eeeeee'
                  }
                }}
              >
                {item.emoji}
              </IconButton>
            ))}
          </Stack>
          
          {existingFeedback && (
            <Typography 
              variant="body1" 
              textAlign="center" 
              mt={2}
              color="primary.main"
              fontWeight="bold"
            >
              {emojis.find(e => e.value === existingFeedback.reaction)?.label}
            </Typography>
          )}
          

        </Box>
      </Paper>

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Précédent
        </Button>
        
        <Button
          variant="contained"
          endIcon={<NavigateNext />}
          onClick={handleNextQuestion}
          disabled={!existingFeedback}
        >
          {currentQuestionIndex === questions.length - 1 ? 
           "Terminer l'évaluation" : "Suivant"}
        </Button>
      </Box>
    </Box>
  );
};

export default FeedbackEtudiant;