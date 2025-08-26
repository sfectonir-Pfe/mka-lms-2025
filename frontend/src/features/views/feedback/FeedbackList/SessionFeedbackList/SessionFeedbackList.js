import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { Feedback as FeedbackIcon } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import api from "../../../../../api/axiosInstance";
import { useSessionFeedbacks } from "./useSessionFeedbacks";
import { buildFeedbackColumns } from "./columns";
import { FeedbackDetailsDialog } from "./FeedbackDetailsDialog";

const SessionFeedbackList = () => {
  const { sessionId } = useParams();
  const { t } = useTranslation();

  const { feedbacks } = useSessionFeedbacks(sessionId);
  const [selectedStudentFeedbacks, setSelectedStudentFeedbacks] = useState([]);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const handleShowMore = (userId) => {
    if (!sessionId || !userId) return;
    api.get(`/feedback/session/${sessionId}/student/${userId}`)
      .then((res) => {
        setSelectedStudentFeedbacks(res.data);
        setFeedbackDialogOpen(true);
      })
      .catch((err) => console.error("Error loading all feedback for student:", err));
  };

  const columns = buildFeedbackColumns(t, handleShowMore);

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: "#fefefe" }}>


      <Typography variant="h4" mb={3} fontWeight="bold" display="flex" alignItems="center" gap={1}>
        <FeedbackIcon fontSize="large" />
        {t('sessions.sessionFeedbackList')}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid 
            rows={feedbacks} 
            columns={columns} 
            pageSize={10} 
            rowsPerPageOptions={[5, 10, 20]} 
            disableSelectionOnClick
            localeText={{
              noRowsLabel: t('table.noRows'),
              labelRowsPerPage: t('table.rowsPerPage')
            }}
          />
        </Box>
      </Paper>

      <FeedbackDetailsDialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        t={t}
        items={selectedStudentFeedbacks}
      />
    </Paper>
  );
};

export default SessionFeedbackList;