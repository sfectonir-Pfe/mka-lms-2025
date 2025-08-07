import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Card,
  CardHeader,
  CardContent,
  Grid,
} from "@mui/material";
import { Close as CloseIcon, Report as ReportIcon } from "@mui/icons-material";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { useTranslation } from 'react-i18next';

const ReclamationList = () => {
  const { t } = useTranslation('reclamations');
  const [reclamations, setReclamations] = useState([]);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const reloadReclamations = React.useCallback(() => {
    console.log("🔄 Rechargement des réclamations");
    axios.get(`http://localhost:8000/reclamation/list`)
      .then(res => {
        console.log("✅ Réclamations reçues:", res.data);
        setReclamations(res.data);
      })
      .catch(err => console.error("❌ Error loading reclamations:", err));
  }, []);

  React.useEffect(() => {
    reloadReclamations();
    const interval = setInterval(reloadReclamations, 30000);
    return () => clearInterval(interval);
  }, [reloadReclamations]);

  const handleShowDetails = (reclamationId) => {
    axios.get(`http://localhost:8000/reclamation/${reclamationId}`)
      .then(res => {
        setSelectedReclamation(res.data);
        setDetailDialogOpen(true);
      })
      .catch(err => console.error("Error loading reclamation details:", err));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'en_attente': return 'warning';
      case 'en_cours': return 'info';
      case 'resolu': return 'success';
      case 'rejete': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'haute': return 'error';
      case 'moyenne': return 'warning';
      case 'basse': return 'success';
      default: return 'default';
    }
  };

  const reclamationColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'userName', headerName: 'Utilisateur', width: 180 },
    { field: 'userEmail', headerName: 'Email', width: 220 },
    { field: 'subject', headerName: 'Sujet', width: 200 },
    { 
      field: 'priority', 
      headerName: 'Priorité', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getPriorityColor(params.value)}
          size="small"
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Statut', 
      width: 140,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value)}
          size="small"
        />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 180,
      renderCell: (params) => {
        const date = new Date(params.value);
        const formatted =
          date.getFullYear() +
          '-' +
          String(date.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(date.getDate()).padStart(2, '0') +
          ' ' +
          String(date.getHours()).padStart(2, '0') +
          ':' +
          String(date.getMinutes()).padStart(2, '0') +
          ':' +
          String(date.getSeconds()).padStart(2, '0');
        return formatted;
      }
    },
    {
      field: 'details',
      headerName: 'Détails',
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => handleShowDetails(params.row.id)}
          sx={{ minWidth: 'auto', px: 2, py: 1, fontSize: '0.8rem' }}
        >
          Voir
        </Button>
      )
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: "#fefefe" }}>
      <Typography variant="h4" mb={3} fontWeight="bold" display="flex" alignItems="center" gap={1}>
        <ReportIcon fontSize="large" />
        Liste des Réclamations
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={reclamations}
            columns={reclamationColumns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      </Paper>

      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ReportIcon fontSize="large" />
            <Box>
              <Typography variant="h5" fontWeight="bold">Détails de la Réclamation</Typography>
              {selectedReclamation && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {selectedReclamation.userName} ({selectedReclamation.userEmail})
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton
            onClick={() => setDetailDialogOpen(false)}
            sx={{ color: 'white' }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedReclamation && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    sx={{ bgcolor: 'primary.light', color: 'white' }}
                    title="Informations Générales"
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Sujet</Typography>
                        <Typography variant="body1">{selectedReclamation.subject}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Catégorie</Typography>
                        <Typography variant="body1">{selectedReclamation.category}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Priorité</Typography>
                        <Chip 
                          label={selectedReclamation.priority} 
                          color={getPriorityColor(selectedReclamation.priority)}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Statut</Typography>
                        <Chip 
                          label={selectedReclamation.status} 
                          color={getStatusColor(selectedReclamation.status)}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    sx={{ bgcolor: 'info.light', color: 'white' }}
                    title="Description"
                  />
                  <CardContent>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedReclamation.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {selectedReclamation.response && (
                <Grid item xs={12}>
                  <Card>
                    <CardHeader
                      sx={{ bgcolor: 'success.light', color: 'white' }}
                      title="Réponse"
                    />
                    <CardContent>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedReclamation.response}
                      </Typography>
                      {selectedReclamation.responseDate && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Répondu le: {new Date(selectedReclamation.responseDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    sx={{ bgcolor: 'grey.700', color: 'white' }}
                    title="Informations Techniques"
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Date de création</Typography>
                        <Typography variant="body2">
                          {new Date(selectedReclamation.createdAt).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Dernière mise à jour</Typography>
                        <Typography variant="body2">
                          {new Date(selectedReclamation.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDetailDialogOpen(false)} variant="contained">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReclamationList;