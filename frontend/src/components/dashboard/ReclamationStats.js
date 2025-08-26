import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Avatar,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import {
  Report as ReportIcon,
  AccessTime as AccessTimeIcon,
  PendingActions as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

const ACCENT_COLORS = [
  "#1e40af", // Deep Blue
  "#3b82f6", // Blue
  "#60a5fa", // Light Blue
  "#475569", // Blue Gray
  "#0ea5e9", // Sky Blue
  "#06b6d4"  // Cyan
];

const PRIMARY_BLUE = "#1e40af";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "en_attente":
      return "warning";
    case "en_cours":
      return "info";
    case "resolu":
      return "success";
    case "rejete":
      return "error";
    default:
      return "default";
  }
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "haute":
      return "error";
    case "moyenne":
      return "warning";
    case "basse":
      return "success";
    default:
      return "default";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "EN_ATTENTE":
      return AccessTimeIcon;
    case "EN_COURS":
      return PendingIcon;
    case "RESOLU":
      return CheckCircleIcon;
    case "REJETE":
      return CancelIcon;
    default:
      return WarningIcon;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Modern Card Component
function ModernCard({ children, ...props }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

// Status Stats Card Component
function StatusStatsCard({ status, count, icon: Icon, color, label }) {
  return (
    <ModernCard>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ 
            bgcolor: `${color}.light`, 
            color: `${color}.main`,
            width: 48,
            height: 48
          }}>
            <Icon />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </ModernCard>
  );
}

// Latest Reclamation Item Component
function LatestReclamationItem({ reclamation }) {
  const StatusIcon = getStatusIcon(reclamation.status);
  
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        borderLeft: 4,
        borderLeftColor: "primary.main",
        transition: "all 0.3s ease",
        "&:hover": { transform: "translateX(4px)", boxShadow: 2 },
        background: "rgba(255,255,255,0.95)",
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ maxWidth: "60%" }}>
            {reclamation.subject}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            #{reclamation.id}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {reclamation.userName}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            icon={<StatusIcon />}
            label={reclamation.status}
            color={getStatusColor(reclamation.status)}
            size="small"
          />
          <Chip
            icon={<WarningIcon />}
            label={reclamation.priority}
            color={getPriorityColor(reclamation.priority)}
            size="small"
            variant="outlined"
          />
          <Chip 
            label={reclamation.category} 
            size="small" 
            variant="outlined" 
          />
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {formatDate(reclamation.createdAt)}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default function ReclamationStats({ reclamationStats }) {
  if (!reclamationStats) {
    return null;
  }

  const {
    totalReclamations,
    statusBreakdown,
    priorityBreakdown,
    recentReclamations,
    latestReclamations,
  } = reclamationStats;

  return (
    <Grid container spacing={3}>
      {/* Status Overview */}
      <Grid item xs={12}>
        <ModernCard>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar sx={{ 
                bgcolor: PRIMARY_BLUE, 
                width: 48, 
                height: 48,
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              }}>
                <ReportIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                  Réclamations - Vue d'ensemble
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {recentReclamations} nouvelles cette semaine
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <StatusStatsCard
                  status="EN_ATTENTE"
                  count={statusBreakdown.enAttente}
                  icon={AccessTimeIcon}
                  color="warning"
                  label="En Attente"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatusStatsCard
                  status="EN_COURS"
                  count={statusBreakdown.enCours}
                  icon={PendingIcon}
                  color="info"
                  label="En Cours"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatusStatsCard
                  status="RESOLU"
                  count={statusBreakdown.resolu}
                  icon={CheckCircleIcon}
                  color="success"
                  label="Résolues"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatusStatsCard
                  status="REJETE"
                  count={statusBreakdown.rejete}
                  icon={CancelIcon}
                  color="error"
                  label="Rejetées"
                />
              </Grid>
            </Grid>
          </CardContent>
        </ModernCard>
      </Grid>

      {/* Priority Breakdown */}
      <Grid item xs={12} md={6}>
        <ModernCard>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar sx={{ 
                bgcolor: ACCENT_COLORS[1], 
                width: 40, 
                height: 40,
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              }}>
                <TrendingUpIcon />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                Répartition par Priorité
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'error.main', fontSize: 14 }}>
                    H
                  </Avatar>
                  <Typography fontWeight={500}>Haute</Typography>
                </Stack>
                <Typography variant="h6" fontWeight={700} color="error.main">
                  {priorityBreakdown.haute}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main', fontSize: 14 }}>
                    M
                  </Avatar>
                  <Typography fontWeight={500}>Moyenne</Typography>
                </Stack>
                <Typography variant="h6" fontWeight={700} color="warning.main">
                  {priorityBreakdown.moyenne}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'success.main', fontSize: 14 }}>
                    B
                  </Avatar>
                  <Typography fontWeight={500}>Basse</Typography>
                </Stack>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  {priorityBreakdown.basse}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </ModernCard>
      </Grid>

      {/* Latest Reclamations */}
      <Grid item xs={12} md={6}>
        <ModernCard>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Avatar sx={{ 
                bgcolor: ACCENT_COLORS[2], 
                width: 40, 
                height: 40,
                background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
              }}>
                <ReportIcon />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color={PRIMARY_BLUE}>
                Réclamations Récentes
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            
            <Stack spacing={2}>
              {latestReclamations.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune réclamation récente
                  </Typography>
                </Box>
              ) : (
                latestReclamations.map((reclamation) => (
                  <LatestReclamationItem key={reclamation.id} reclamation={reclamation} />
                ))
              )}
            </Stack>
          </CardContent>
        </ModernCard>
      </Grid>

      {/* Summary Stats */}
      <Grid item xs={12}>
        <ModernCard>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h3" fontWeight={700} color={PRIMARY_BLUE}>
                    {totalReclamations}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Réclamations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h3" fontWeight={700} color="success.main">
                    {statusBreakdown.resolu}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Résolues
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography 
                    variant="h3" 
                    fontWeight={700} 
                    color={statusBreakdown.enAttente + statusBreakdown.enCours > 0 ? "warning.main" : "success.main"}
                  >
                    {statusBreakdown.enAttente + statusBreakdown.enCours}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En Traitement
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </ModernCard>
      </Grid>
    </Grid>
  );
}
