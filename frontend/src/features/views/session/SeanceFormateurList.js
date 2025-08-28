import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  Rating,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import api from "../../../api/axiosInstance";

const SeanceFormateurList = ({ seances, onAnimer, onDelete, fetchSeances, setSelectedSeance, setFeedbackOpen }) => {
  const { t } = useTranslation();
  const [feedbackAverages, setFeedbackAverages] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, seanceId: null, seanceTitle: '' });

  useEffect(() => {
    if (!seances || seances.length === 0) {
      setFeedbackAverages({});
      return;
    }
    
    const fetchAverages = async () => {
      const avgObj = {};
      
      for (const seance of seances) {
        try {
          const res = await api.get(`/feedback/seance/${seance.id}`);
          const feedbacks = res.data;
          
          if (Array.isArray(feedbacks) && feedbacks.length > 0) {
            const validRatings = feedbacks
              .map(f => f.averageRating)
              .filter(rating => rating !== null && rating !== undefined && rating > 0);
            
            if (validRatings.length > 0) {
              const average = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
              avgObj[seance.id] = average;
            }
          }
        } catch (error) {
          console.error(t('seances.feedbackError', { seanceId: seance.id }), error);
        }
      }
      
      setFeedbackAverages(avgObj);
    };
    
    fetchAverages();
  }, [seances, t]);

  const confirmDelete = (seanceId, seanceTitle) => {
    setDeleteDialog({ open: true, seanceId, seanceTitle });
  };

  const handleDelete = () => {
    if (deleteDialog.seanceId && onDelete) {
      onDelete(deleteDialog.seanceId);
      toast.success(t('seances.deleteSuccess'));
    }
    setDeleteDialog({ open: false, seanceId: null, seanceTitle: '' });
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        📅 {t('seances.sessionsList')}
      </Typography>
      {(!seances || seances.length === 0) ? (
        <Typography color="text.secondary">{t('seances.noSessions')}</Typography>
      ) : (
        seances.map((s) => (
          <Paper key={s.id} elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{s.title}</Typography>
            {/* Affichage de la moyenne des feedbacks */}
            {feedbackAverages[s.id] && (
              <Typography variant="body2" color="secondary">
                ⭐ {t('seances.averageRating')}: {feedbackAverages[s.id].toFixed(1)} / 5
              </Typography>
            )}
            <Typography variant="body2">
              🕒 {new Date(s.startTime).toLocaleString()}
            </Typography>
            <Box mt={2} display="flex" gap={1}>
              
              
              <Button
                variant="contained"
                onClick={() =>
                  (window.location.href = `/formateur/seance/${s.id}`)
                }
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                  boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(25,118,210,0.4)' }
                }}
              >
                {t('seances.animateSession')}
              </Button>

              {fetchSeances && (
                <Button
                  variant="contained"
                  color="info"
                  onClick={fetchSeances}
                  sx={{
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #0288d1, #29b6f6)",
                    boxShadow: "0 8px 24px rgba(2, 136, 209, 0.3)",
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(2,136,209,0.4)' }
                  }}
                >
                  🔄 {t('seances.refresh')}
                </Button>
              )}

              {setSelectedSeance && setFeedbackOpen && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSelectedSeance(s);
                    setFeedbackOpen(true);
                  }}
                  sx={{
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #7b1fa2, #ab47bc)",
                    boxShadow: "0 8px 24px rgba(123, 31, 162, 0.3)",
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(123,31,162,0.4)' }
                  }}
                >
                  💬 {t('seances.feedback')}
                </Button>
              )}
              <Button
                variant="contained"
                color="error"
                onClick={() => confirmDelete(s.id, s.title)}
                sx={{
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
                  boxShadow: '0 8px 24px rgba(211,47,47,0.3)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(211,47,47,0.4)' }
                }}
              >
                {t('common.delete')}
              </Button>
            </Box>
          </Paper>
        ))
      )}

      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, seanceId: null, seanceTitle: '' })}
      >
        <DialogTitle sx={{ color: '#d32f2f' }}>
          🗑️ {t('common.confirmDelete')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('seances.deleteConfirmMessage', { title: deleteDialog.seanceTitle })}
            <br />
            <br />
            {t('common.irreversibleAction')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, seanceId: null, seanceTitle: '' })}
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #757575, #9e9e9e)',
              color: 'white',
              '&:hover': { 
                background: 'linear-gradient(135deg, #616161, #757575)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained" 
            sx={{ 
              borderRadius: 2, 
              minWidth: 120,
              background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
              boxShadow: '0 6px 18px rgba(211,47,47,0.25)',
              '&:hover': { 
                transform: 'translateY(-1px)', 
                boxShadow: '0 10px 24px rgba(211,47,47,0.35)' 
              }
            }}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
      

    </Box>
  );
};

export default SeanceFormateurList;
