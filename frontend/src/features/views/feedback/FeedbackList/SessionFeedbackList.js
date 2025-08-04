import React, { useEffect, useState } from "react";
import feedbackService from "../../../../services/feedbackService";
import { Box, Typography, Paper, CircularProgress, List, ListItem, ListItemText, Divider } from "@mui/material";

export default function SessionFeedbackList({ sessionId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await feedbackService.getSessionFeedbacks(sessionId);
      setFeedbacks(data);
    } catch {
      setFeedbacks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (sessionId) fetchFeedbacks();
  }, [sessionId]);

  if (loading) return <Box textAlign="center" my={3}><CircularProgress /></Box>;
  if (!feedbacks.length) return <Typography color="text.secondary" my={3}>Aucun feedback pour cette session.</Typography>;

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Feedbacks de la session
      </Typography>
      <List>
        {feedbacks.map((fb, idx) => (
          <React.Fragment key={fb.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={<>
                  <b>{fb.user?.name || "Anonyme"}</b> {fb.user?.email && <span>({fb.user.email})</span>}
                </>}
                secondary={<>
                  <Typography component="span" variant="body2" color="text.primary">
                    Note : {fb.rating ?? "-"}
                  </Typography><br/>
                  <Typography component="span" variant="body2" color="text.secondary">
                    {fb.comments || ""}
                  </Typography>
                </>}
              />
            </ListItem>
            {idx < feedbacks.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
} 