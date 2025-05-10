import React from "react";
import { Box,Typography,Paper,Grid,Card,CardContent,Chip,} from "@mui/material";

const dummyFeedbacks = [
  {
    id: 1,
    from: "Etudiant1",
    to: "Formateur1",
    message: "Great explanation of the module content!",
    timestamp: "2025-05-06 10:15",
    type: "etudiant-formateur",
  },
  {
    id: 2,
    from: "Formateur1",
    to: "Etudiant2",
    message: "Excellent project work, well done!",
    timestamp: "2025-05-06 11:30",
    type: "formateur-etudiant",
  },
];

export default function FeedbackList() {
  return (
    <Box component={Paper} elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        📋 Recent Feedback
      </Typography>
      <Grid container spacing={2}>
        {dummyFeedbacks.map((fb) => (
          <Grid item xs={12} sm={6} md={4} key={fb.id}>
            <Card variant="outlined" sx={{ borderLeft: "6px solid #1976d2" }}>
              <CardContent>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={fb.type.replace("-", " → ")}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  From: {fb.from} → To: {fb.to}
                </Typography>
                <Typography variant="body1" sx={{ my: 1 }}>
                  {fb.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fb.timestamp}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
