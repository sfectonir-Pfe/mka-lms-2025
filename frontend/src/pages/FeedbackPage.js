import React, { useState } from "react";
import AddFeedback from "./users/views/AddFeedback";
import FeedbackList from "./users/views/FeedbackList";
import { Container, Typography, Divider, Tabs, Tab, Box } from "@mui/material";

export default function FeedbackPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        💬 Feedback Center
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="feedback tabs">
        <Tab label="Submit Feedback" />
        <Tab label="View Feedback" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <AddFeedback />}
        {tabIndex === 1 && <FeedbackList />}
      </Box>
    </Container>
  );
}
