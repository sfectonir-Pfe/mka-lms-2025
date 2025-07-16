// FeedbackListPage - Liste des feedbacks par étudiant, formateur, et réclamation
// Créé pour affichage dans le sidebar et navigation principale
//
// Utilise MUI DataGrid et feedbackService

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Grid, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MdFeedback } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import feedbackService from "../services/feedbackService";
import SessionFeedbackList from "../components/SessionFeedbackList";

const TABS = [
  { key: "etudiant", label: "Étudiant" },
  { key: "formateur", label: "Formateur" },
  { key: "reclamation", label: "Réclamation" },
];

export default function FeedbackListPage() {
  const [tab, setTab] = useState("etudiant");
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reclamations, setReclamations] = useState([]);
  // Nouvel état pour la modal de détail
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    if (tab === "etudiant" || tab === "formateur") {
      fetchUsers();
    } else if (tab === "reclamation") {
      fetchReclamations();
    }
  }, [tab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsersResponse = await feedbackService.getFeedbackUsers();
      const allUsers = Array.isArray(allUsersResponse) ? allUsersResponse : allUsersResponse.data;
      if (tab === "etudiant") {
        setUsers(allUsers.filter(u => u.role === "etudiant" || u.role === "student"));
      } else {
        setUsers(allUsers.filter(u => u.role === "formateur" || u.role === "instructor"));
      }
    } catch (e) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReclamations = async () => {
    setLoading(true);
    try {
      const allFeedbackResponse = await feedbackService.getAllFeedback();
      const allFeedback = Array.isArray(allFeedbackResponse) ? allFeedbackResponse : allFeedbackResponse.data;
      setReclamations(allFeedback.filter(fb => fb.type === "complaint" || fb.type === "reclamation"));
    } catch (e) {
      setReclamations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFeedbacks = async (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
    setLoading(true);
    try {
      const allFeedbackResponse = await feedbackService.getAllFeedback();
      const allFeedback = Array.isArray(allFeedbackResponse) ? allFeedbackResponse : allFeedbackResponse.data;
      // Filter feedbacks where userId matches
      setFeedbacks(
        allFeedback.filter(fb => fb.user && (fb.user.id === user.id || fb.user.email === user.email || fb.user.name === user.name))
      );
    } catch (e) {
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFeedbacks([]);
  };

  // Ouvre la modal de détail pour un feedback
  const handleViewFeedbackDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setOpenDetailDialog(true);
  };

  // Ferme la modal de détail
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedFeedback(null);
  };

  // Columns for users
  const userColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Nom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<MdFeedback />}
          onClick={() => handleViewFeedbacks(params.row)}
        >
          Voir Feedbacks
        </Button>
      ),
    },
  ];

  // Columns for feedbacks
  const feedbackColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "from", headerName: "De", flex: 1, valueGetter: (params) => params.row.user ? `${params.row.user.name || ''} (${params.row.user.email || ''})` : '' },
    { field: "message", headerName: "Message", flex: 2 },
    { field: "timestamp", headerName: "Date", width: 160, valueGetter: (params) => params.row.createdAt ? new Date(params.row.createdAt).toLocaleString() : '' },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleViewFeedbackDetail(params.row)}
        >
          Voir
        </Button>
      ),
    },
  ];

  // Columns for reclamations
  const reclamationColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "from", headerName: "De", flex: 1 },
    { field: "to", headerName: "À", flex: 1 },
    { field: "message", headerName: "Message", flex: 2 },
    { field: "timestamp", headerName: "Date", width: 160 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Feedbacks
      </Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        {TABS.map((t) => (
          <Button
            key={t.key}
            variant={tab === t.key ? "contained" : "outlined"}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </Box>
      <Box sx={{ height: 500, bgcolor: "white", borderRadius: 2, p: 2 }}>
        {tab === "etudiant" || tab === "formateur" ? (
          <DataGrid
            rows={users}
            columns={userColumns}
            pageSize={8}
            rowsPerPageOptions={[8, 20, 100]}
            getRowId={(row) => row.id}
            loading={loading}
            localeText={{ noRowsLabel: "Aucun utilisateur" }}
          />
        ) : (
          <DataGrid
            rows={reclamations}
            columns={reclamationColumns}
            pageSize={8}
            rowsPerPageOptions={[8, 20, 100]}
            getRowId={(row) => row.id}
            loading={loading}
            localeText={{ noRowsLabel: "Aucune réclamation" }}
          />
        )}
      </Box>
      {/* Affichage des feedbacks de session (exemple pour sessionId=1) */}
      <SessionFeedbackList sessionId={1} />
      {/* Feedback Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Feedbacks de {selectedUser?.name || selectedUser?.email}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={feedbacks}
              columns={feedbackColumns}
              pageSize={6}
              rowsPerPageOptions={[6, 20, 100]}
              getRowId={(row) => row.id}
              loading={loading}
              localeText={{ noRowsLabel: "Aucun feedback" }}
            />
          </Box>
        </DialogContent>
      </Dialog>
      {/* Modal de détail du feedback */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Détail du Feedback
          <IconButton
            aria-label="close"
            onClick={handleCloseDetailDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1"><b>Nom:</b> {selectedFeedback.user?.name || ''}</Typography>
              <Typography variant="subtitle1"><b>Email:</b> {selectedFeedback.user?.email || ''}</Typography>
              <Typography variant="subtitle1"><b>Date:</b> {selectedFeedback.createdAt ? new Date(selectedFeedback.createdAt).toLocaleString() : ''}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}><b>Message:</b></Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{selectedFeedback.message}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
} 