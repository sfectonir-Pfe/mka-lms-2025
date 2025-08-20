"use client"

import React, { useState, useCallback, useEffect } from "react"
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
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  TextField,
  InputAdornment,
  Container,
  Divider,
  Avatar,
} from "@mui/material"
import {
  Close as CloseIcon,
  Report as ReportIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  PendingActions as PendingIcon,
} from "@mui/icons-material"
import api from "../../../../api/axiosInstance";

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState([])
  const [filteredReclamations, setFilteredReclamations] = useState([])
  const [selectedReclamation, setSelectedReclamation] = useState(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const reloadReclamations = useCallback(() => {
    console.log("🔄 Rechargement des réclamations")
    setIsLoading(true)
    api
      .get(`/reclamation/list`)
      .then((res) => {
        console.log("✅ Réclamations reçues:", res.data)
        setReclamations(res.data)
        setFilteredReclamations(res.data)
      })
      .catch((err) => console.error("❌ Error loading reclamations:", err))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    reloadReclamations()
    const interval = setInterval(reloadReclamations, 30000)
    return () => clearInterval(interval)
  }, [reloadReclamations])

  // Filter reclamations based on search and status
  useEffect(() => {
    let filtered = reclamations

    if (searchTerm) {
      filtered = filtered.filter(
        (rec) =>
          rec.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rec.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((rec) => rec.status === statusFilter)
    }

    setFilteredReclamations(filtered)
  }, [reclamations, searchTerm, statusFilter])

  const handleShowDetails = (reclamationId) => {
    api
      .get(`/reclamation/${reclamationId}`)
      .then((res) => {
        setSelectedReclamation(res.data)
        setDetailDialogOpen(true)
      })
      .catch((err) => console.error("Error loading reclamation details:", err))
  }

  const STATUS_OPTIONS = [
    { value: "EN_ATTENTE", label: "En Attente", icon: AccessTimeIcon, color: "warning" },
    { value: "EN_COURS", label: "En Cours", icon: PendingIcon, color: "info" },
    { value: "RESOLU", label: "Résolu", icon: CheckCircleIcon, color: "success" },
    { value: "REJETE", label: "Rejeté", icon: CancelIcon, color: "error" },
  ]

  const handleOpenStatusDialog = () => {
    if (!selectedReclamation) return
    setNewStatus(selectedReclamation.status || "EN_ATTENTE")
    setStatusDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedReclamation) return
    try {
      setIsUpdatingStatus(true)
      const { data } = await api.patch(`/reclamation/${selectedReclamation.id}`, {
        status: newStatus,
      })
      setSelectedReclamation(data)
      reloadReclamations()
      setStatusDialogOpen(false)
    } catch (error) {
      console.error("❌ Error updating status:", error)
      alert("Erreur lors de la mise à jour du statut")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "en_attente":
        return "warning"
      case "en_cours":
        return "info"
      case "resolu":
        return "success"
      case "rejete":
        return "error"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "haute":
        return "error"
      case "moyenne":
        return "warning"
      case "basse":
        return "success"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status)
    return statusOption ? statusOption.icon : WarningIcon
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <RefreshIcon sx={{ animation: "spin 1s linear infinite" }} />
            <Typography variant="h6">Chargement des réclamations...</Typography>
          </Stack>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Header */}
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: "rgba(255,255,255,0.9)" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  <ReportIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    Réclamations
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Gestion des réclamations clients
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={reloadReclamations}
                sx={{ borderRadius: 2 }}
              >
                Actualiser
              </Button>
            </Stack>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3}>
            {STATUS_OPTIONS.map((status) => {
              const count = reclamations.filter((r) => r.status === status.value).length
              const StatusIcon = status.icon
              return (
                <Grid item xs={12} sm={6} md={3} key={status.value}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                      background: "rgba(255,255,255,0.9)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: `${status.color}.light`, color: `${status.color}.main` }}>
                          <StatusIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {status.label}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>

          {/* Filters */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, background: "rgba(255,255,255,0.9)" }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Rechercher par nom, email, sujet ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filtrer par statut</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Filtrer par statut"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    startAdornment={<FilterIcon sx={{ mr: 1, color: "action.active" }} />}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">Tous les statuts</MenuItem>
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Reclamations List */}
          <Stack spacing={3}>
            {filteredReclamations.length === 0 ? (
              <Paper elevation={2} sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
                <ReportIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Aucune réclamation trouvée
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Aucune réclamation ne correspond à vos critères de recherche.
                </Typography>
              </Paper>
            ) : (
              filteredReclamations.map((reclamation) => {
                const StatusIcon = getStatusIcon(reclamation.status)
                return (
                  <Card
                    key={reclamation.id}
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      borderLeft: 4,
                      borderLeftColor: "primary.main",
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
                      background: "rgba(255,255,255,0.95)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={3} alignItems="center">
                        {/* Main Info */}
                        <Grid item xs={12} lg={8}>
                          <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                  {reclamation.subject}
                                </Typography>
                                <Stack direction="row" spacing={3} alignItems="center">
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <PersonIcon fontSize="small" color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                      {reclamation.userName}
                                    </Typography>
                                  </Stack>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <EmailIcon fontSize="small" color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                      {reclamation.userEmail}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Box>
                              <Stack alignItems="flex-end" spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <CalendarIcon fontSize="small" color="action" />
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(reclamation.createdAt)}
                                  </Typography>
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                  #{reclamation.id}
                                </Typography>
                              </Stack>
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip
                                icon={<WarningIcon />}
                                label={reclamation.priority}
                                color={getPriorityColor(reclamation.priority)}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                icon={<StatusIcon />}
                                label={reclamation.status}
                                color={getStatusColor(reclamation.status)}
                                size="small"
                              />
                              <Chip label={reclamation.category} size="small" variant="outlined" />
                            </Stack>
                          </Stack>
                        </Grid>

                        {/* Actions */}
                        <Grid item xs={12} lg={4}>
                          <Stack direction="row" justifyContent="flex-end">
                            <Button
                              variant="contained"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleShowDetails(reclamation.id)}
                              sx={{ borderRadius: 2 }}
                            >
                              Voir détails
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </Stack>
        </Stack>
      </Container>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <DescriptionIcon fontSize="large" />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Réclamation #{selectedReclamation?.id}
              </Typography>
              {selectedReclamation && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {selectedReclamation.userName} ({selectedReclamation.userEmail})
                </Typography>
              )}
            </Box>
          </Stack>
          <IconButton onClick={() => setDetailDialogOpen(false)} sx={{ color: "white" }} size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          {selectedReclamation && (
            <Stack spacing={4}>
              {/* Status and Priority */}
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  icon={React.createElement(getStatusIcon(selectedReclamation.status))}
                  label={selectedReclamation.status}
                  color={getStatusColor(selectedReclamation.status)}
                />
                <Chip
                  icon={<WarningIcon />}
                  label={selectedReclamation.priority}
                  color={getPriorityColor(selectedReclamation.priority)}
                  variant="outlined"
                />
                <Chip label={selectedReclamation.category} variant="outlined" />
              </Stack>

              <Divider />

              {/* Subject and Description */}
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Sujet
                  </Typography>
                  <Typography variant="body1">{selectedReclamation.subject}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Description
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {selectedReclamation.description}
                    </Typography>
                  </Paper>
                </Box>
              </Stack>

              {/* Response */}
              {selectedReclamation.response && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                      Réponse
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{ p: 3, bgcolor: "success.50", borderColor: "success.200", borderRadius: 2 }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {selectedReclamation.response}
                      </Typography>
                      {selectedReclamation.responseDate && (
                        <Typography variant="caption" color="success.main" sx={{ mt: 2, display: "block" }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                          Répondu le: {formatDate(selectedReclamation.responseDate)}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                </>
              )}

              <Divider />

              {/* Technical Info */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Créé le: {formatDate(selectedReclamation.createdAt)}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Modifié le: {formatDate(selectedReclamation.updatedAt)}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          {selectedReclamation && (
            <Button variant="outlined" onClick={handleOpenStatusDialog} startIcon={<WarningIcon />}>
              Changer le statut
            </Button>
          )}
          <Button variant="contained" onClick={() => setDetailDialogOpen(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon />
            <Typography variant="h6">Changer le statut</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Sélectionnez le nouveau statut pour cette réclamation.
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Nouveau statut</InputLabel>
              <Select value={newStatus} label="Nouveau statut" onChange={(e) => setNewStatus(e.target.value)}>
                {STATUS_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Icon fontSize="small" />
                        <Typography>{option.label}</Typography>
                      </Stack>
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setStatusDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={isUpdatingStatus}
            startIcon={
              isUpdatingStatus ? <RefreshIcon sx={{ animation: "spin 1s linear infinite" }} /> : <CheckCircleIcon />
            }
          >
            {isUpdatingStatus ? "En cours..." : "Mettre à jour"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ReclamationList
