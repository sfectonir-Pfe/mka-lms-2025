import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Divider,
  Stack,
  Button,
  Avatar,
  IconButton,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { Close, Facebook, Twitter, LinkedIn, ContentCopy, Feedback, Download } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import api from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddSessionFeedback from '../../../features/views/feedback/feedbackForm/AddSessionFeedback';
import { getCurrentRole, getCurrentUserId } from '../../../pages/auth/token';
import RoleGate from '../../../pages/auth/RoleGate';
const SessionList = () => {
  const [showAddUserId, setShowAddUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [assignedUsersMap, setAssignedUsersMap] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState({});
  const [shareModal, setShareModal] = useState({ open: false, session: null });
  const [shareText, setShareText] = useState('');
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, sessionId: null });
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
  
  // Check user permissions
  const currentRole = getCurrentRole()?.toLowerCase();
  const canManageUsers = ['admin',].includes(currentRole);

  const styles = {
    primary: {
      borderRadius: 3,
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(25,118,210,0.4)'
      }
    },
    danger: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
      boxShadow: '0 6px 18px rgba(211,47,47,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(211,47,47,0.35)' }
    },
    success: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
      boxShadow: '0 6px 18px rgba(46,125,50,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(46,125,50,0.35)' }
    },
    info: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
      boxShadow: '0 6px 18px rgba(2,136,209,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(2,136,209,0.35)' }
    },
    secondary: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #7b1fa2, #ab47bc)',
      boxShadow: '0 6px 18px rgba(123,31,162,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(123,31,162,0.35)' }
    },
    rounded: { borderRadius: 2 }
  };

  const fetchSessions = async () => {
    try {
      const currentRole = getCurrentRole()?.toLowerCase();
      const currentUserId = getCurrentUserId();
      
      let sessionsData = [];
      
      // Role-based session fetching
      if (['formateur', 'etudiant'].includes(currentRole)) {
        // For formateurs and etudiants, only fetch sessions they're assigned to
        if (currentUserId) {
          const res = await api.get(`/session2/my-sessions/${currentUserId}`);
          // Transform the response to match the expected format
          sessionsData = res.data.map(userSession => userSession.session2);
        }
      } else {
        // For admin, createurdeformation, and etablissement, fetch all sessions
        const res = await api.get("/session2");
        sessionsData = res.data;
      }
      
      setSessions(sessionsData);
      
      // Only fetch users if user has admin/creator permissions
      const canManageUsers = ['admin', 'createurdeformation',].includes(currentRole);
      
      const usersMap = {};
      if (canManageUsers) {
        await Promise.all(
          sessionsData.map(async (session) => {
            try {
              const resp = await api.get(`/session2/${session.id}/users`);
              usersMap[session.id] = resp.data || [];
            } catch {
              usersMap[session.id] = [];
            }
          })
        );
      }
      setAssignedUsersMap(usersMap);
    } catch {
      toast.error(t("sessions.loadError"));
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id) => {
    setDeleteDialog({ open: true, sessionId: id });
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/session2/${deleteDialog.sessionId}`);
      toast.success(t("sessions.deleteSuccess"));
      fetchSessions();
      setDeleteDialog({ open: false, sessionId: null });
    } catch {
      toast.error(t("sessions.deleteError"));
    }
  };

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      await api.patch(`/session2/${sessionId}/status`, {
        status: newStatus,
      });
      toast.success(t("sessions.statusUpdated"));
      fetchSessions();
    } catch {
      toast.error(t("sessions.statusUpdateError"));
    }
  };

  const handleRemoveUser = async (sessionId, userId) => {
    try {
      await api.delete(`/session2/${sessionId}/remove-user/${userId}`);
      toast.success(t("sessions.userRemoved"));
      await fetchSessions();
    } catch (e) {
      toast.error(
        e.response?.data?.message || t("sessions.removeUserError")
      );
    }
  };

  const handleAddUser = async (sessionId) => {
    if (!userEmail) {
      toast.error(t("sessions.enterEmail"));
      return;
    }
    setAddLoading(true);
    try {
      await api.post(`/session2/${sessionId}/add-user`, {
        email: userEmail,
      });
      toast.success(t("sessions.userAdded"));
      setShowAddUserId(null);
      setUserEmail("");
      await fetchSessions();
    } catch (e) {
      toast.error(
        e.response?.data?.message || t("sessions.addUserError")
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleToggleSidebar = (sessionId) => {
    setSidebarOpen(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const handleShare = (session) => {
    const text = `🌟 ${t("sessions.newSessionAvailable")} 🌟\n\n🎯 ${session.name}\n\n📚 ${t("sessions.program")}: ${session.program?.name || t("sessions.program")}\n📅 ${t("sessions.period")}: ${session.startDate?.slice(0, 10)} ➜ ${session.endDate?.slice(0, 10)}\n\n${session.session2Modules?.length > 0 ? `🎓 ${t("sessions.includedModules")}:\n` + session.session2Modules.map(mod => `✅ ${mod.module?.name}`).join('\n') + '\n\n' : ''}🚀 ${t("sessions.uniqueOpportunity")}\n\n💡 ${t("sessions.registerNow")}\n\n${t("sessions.hashtags")}`;
    setShareText(text);
    setShareModal({ open: true, session });
  };

  const handleSocialShare = async (platform) => {
    const encodedText = encodeURIComponent(shareText);
    
    if (platform === 'facebook') {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success(t('sessions.textCopiedForFacebook'), {
          autoClose: 8000,
          position: "top-center"
        });
        // Délai pour laisser le temps à l'utilisateur de voir la notification
        setTimeout(() => {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
        }, 1000);
        return;
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success(t('sessions.textCopied'));
    } catch (err) {
      toast.error(t('sessions.copyError'));
    }
  };

  // Fonction utilitaire pour s'assurer qu'une image est chargée
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        console.warn('Image preload failed:', src, error);
        reject(error);
      };
      img.src = src;
    });
  };

  // Fonction pour vérifier si une image est accessible
  const checkImageAccessibility = async (src) => {
    try {
      const response = await fetch(src, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn('Image accessibility check failed:', src, error);
      return false;
    }
  };

  const handleDownloadPreview = async () => {
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById("session-preview");
      if (!element) return;

      // Vérifier et précharger l'image si elle existe
      if (shareModal.session?.imageUrl) {
        const isAccessible = await checkImageAccessibility(shareModal.session.imageUrl);
        if (isAccessible) {
          try {
            await preloadImage(shareModal.session.imageUrl);
          } catch (error) {
            console.warn('Failed to preload image:', error);
            toast.warning(t('sessions.imageLoadWarning'));
          }
        } else {
          console.warn('Image not accessible:', shareModal.session.imageUrl);
          toast.warning(t('sessions.imageLoadWarning'));
        }
      }

      // Configuration pour html2canvas avec gestion CORS
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        scale: 2, // Améliore la qualité
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000, // Timeout plus long pour les images
        onclone: (clonedDoc) => {
          // S'assurer que l'image est chargée dans le clone
          const clonedElement = clonedDoc.getElementById("session-preview");
          if (clonedElement && shareModal.session?.imageUrl) {
            const imgElement = clonedElement.querySelector('img');
            if (imgElement) {
              // Forcer le rechargement de l'image
              imgElement.crossOrigin = 'anonymous';
              imgElement.src = shareModal.session.imageUrl;
            }
          }
        }
      });
      
      const dataURL = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `session-${shareModal.session?.name || "preview"}.png`;
      link.click();
      
      toast.success(t('sessions.imageDownloadSuccess'));
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(t('sessions.imageGenerationError'));
    }
  };

  const openFeedbackForm = (session) => {
    setSelectedSession(session);
    setOpenFeedbackDialog(true);
  };

  // Show loading state if i18n is not ready
  if (!ready) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t("common.loadingTranslations")}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
      

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📋 {t('sessions.sessionList')}
      </Typography>

      {sessions.length === 0 ? (
        <Typography mt={2} color="text.secondary">
          {t("sessions.noSessions")}
        </Typography>
      ) : (
        sessions.map((session) => (
          <Paper
            key={session.id}
            elevation={1}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 3
            }}
          >
            {/* Main Content */}
            <Box flex={1}>
              {session.imageUrl && (
                <Box mb={2} display="flex" justifyContent="center">
                  <img
                    src={session.imageUrl}
                    alt="Session"
                    crossOrigin="anonymous"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 180,
                      borderRadius: 16,
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6" fontWeight="bold" color="primary">
                  🧾 {session.name}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    label={
                      session.status === "ACTIVE" ? t("sessions.active") :
                      session.status === "INACTIVE" ? t("sessions.inactive") :
                      session.status === "COMPLETED" ? t("sessions.completed") :
                      session.status === "ARCHIVED" ? t("sessions.archived") :
                      session.status
                    }
                    color={
                      session.status === "ACTIVE"
                        ? "success"
                        : session.status === "INACTIVE"
                        ? "default"
                        : session.status === "COMPLETED"
                        ? "primary"
                        : "secondary"
                    }
                    sx={{ fontWeight: 700, textTransform: "capitalize" }}
                  />
                  {canManageUsers && (
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel id={`status-label-${session.id}`}>{t("sessions.status")}</InputLabel>
                      <Select
                        labelId={`status-label-${session.id}`}
                        value={session.status}
                        label={t("sessions.status")}
                        onChange={e => handleStatusChange(session.id, e.target.value)}
                      >
                        <MenuItem value="ACTIVE">{t("sessions.active")}</MenuItem>
                        <MenuItem value="INACTIVE">{t("sessions.inactive")}</MenuItem>
                        <MenuItem value="COMPLETED">{t("sessions.completed")}</MenuItem>
                        <MenuItem value="ARCHIVED">{t("sessions.archived")}</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Stack>
              </Stack>

              {!sidebarOpen[session.id] && (
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  {canManageUsers && (
                    <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteIcon sx={{ color: 'white' }} />}
                    onClick={() => handleDelete(session.id)}
                    sx={{ ...styles.danger, color: 'white', borderColor: 'white' }}
                  >
                    {t("sessions.delete")}
                  </Button>
                  )}
                  <RoleGate roles={["admin","formateur","etudiant"]}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<RocketLaunchIcon />}
                    onClick={() => navigate(`/sessions/${session.id}/seances`)}
                    sx={styles.primary}
                  >
                    {currentRole === 'formateur' ? 'Animer la session' : 'Rejoindre la session'}
                  </Button>
                  </RoleGate>
                  {canManageUsers && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<PersonAddAlt1Icon />}
                      onClick={() => handleToggleSidebar(session.id)}
                    >
                      {t("sessions.addUser")}
                    </Button>
                    
                  )}
                  <RoleGate roles={["admin"]}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleShare(session)}
                    >
                      📤 {t("sessions.share")}
                    </Button>
                  </RoleGate>
                  {session.status === "COMPLETED" && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/sessions/${session.id}/attestation`)}
                      sx={styles.success}
                    >
                      🏅 {t("sessions.attestation")}
                    </Button>
                  )}
                  <RoleGate roles={["admin","etudiant"]}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Feedback />}
                    onClick={() => openFeedbackForm(session)}
                    sx={styles.info}
                  >
                    📝 {t("sessions.feedback")}
                  </Button>
                  </RoleGate>
                  <RoleGate roles={["admin","formateur"]}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/sessions/${session.id}/feedbacklist`)}
                    sx={{ ...styles.primary, color: 'white', borderColor: 'white' }}
                  >
                    📊 {t("sessions.feedbackList")}
                  </Button>
                  </RoleGate>
                </Stack>
              )}
{/* 
              Add User Section
              {showAddUserId === session.id && (
                <Box mt={2} mb={2} display="flex" gap={1} alignItems="center">
                  <TextField
                    type="email"
                    placeholder={t("sessions.userEmailPlaceholder")}
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    size="small"
                    sx={{ minWidth: 220 }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAddUser(session.id)}
                    disabled={addLoading}
                    sx={styles.success}
                  >
                    {addLoading ? t("sessions.adding") : t("sessions.add")}
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => { setShowAddUserId(null); setUserEmail(""); }}
                    sx={styles.secondary}
                  >
                    {t("sessions.cancel")}
                  </Button>
                </Box>
              )} */}

              <Typography variant="body2" mb={0.5}>
                📚 {t("sessions.program")} : <strong>{session.program?.name || t("sessions.unknown")}</strong>
              </Typography>
              <Typography variant="body2">
                📅 {t("sessions.period")} <strong>{session.startDate?.slice(0, 10)}</strong> {t("sessions.to")}{" "}
                <strong>{session.endDate?.slice(0, 10)}</strong>
              </Typography>
              
              {/* Average Feedback Rating */}
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" fontWeight="bold">
                  ⭐ {t("sessions.averageRating")}:
                </Typography>
                {session.averageRating ? (
                  <>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {session.averageRating.toFixed(1)}/5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({session.feedbackCount} {session.feedbackCount === 1 ? t("sessions.feedback") : t("sessions.feedbacks")})
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t("sessions.noFeedbackYet")}
                  </Typography>
                )}
              </Box>

              {/* Modules and Contents */}
              {session.session2Modules?.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    🧱 {t("sessions.modulesContent")}
                  </Typography>
                  {session.session2Modules.map((mod) => (
                    <Box key={mod.id} mt={1}>
                      <Typography fontWeight="bold" color="secondary.main">
                        📦 {mod.module?.name}
                      </Typography>
                      {mod.courses?.map((c) => (
                        <Box key={c.id} ml={2} mt={1}>
                          <Typography variant="body2" fontWeight="bold" color="text.primary">
                            📘 {c.course?.title}
                          </Typography>
                          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                            {c.contenus?.map((ct) => (
                              <Button
                                key={ct.id}
                                variant="outlined"
                                color="info"
                                size="small"
                                sx={{ mr: 1, mb: 1, borderRadius: 2 }}
                                onClick={() =>
                                  ct.contenu?.fileUrl &&
                                  window.open(ct.contenu.fileUrl, "_blank")
                                }
                              >
                                📄 {ct.contenu?.title}
                              </Button>
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </>
              )}
            </Box>

            {/* Sidebar for Users */}
            {canManageUsers && sidebarOpen[session.id] && (
              <Paper
                elevation={4}
                sx={{
                  minWidth: 350,
                  maxWidth: 400,
                  borderRadius: 4,
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  boxShadow: "0 12px 36px 0 rgba(25, 118, 210, 0.09)",
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography fontWeight={700} color="primary" fontSize={18}>
                    {t("sessions.members")}
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => handleToggleSidebar(session.id)}
                    sx={{ fontWeight: 600, fontSize: 14, textTransform: "none", ...styles.primary }}
                  >
                    {t("sessions.hide")}
                  </Button>
                </Box>

                {/* Add User Input */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={3}
                  borderRadius={2}
                  p={1.5}
                >
                  <TextField
                    size="small"
                    type="email"
                    placeholder={t("sessions.addByEmail")}
                    value={showAddUserId === session.id ? userEmail : ""}
                    onFocus={() => setShowAddUserId(session.id)}
                    onChange={(e) => setUserEmail(e.target.value)}
                    variant="outlined"
                    sx={{ flex: 1, borderRadius: 2 }}
                  />
                  <IconButton
                    disabled={addLoading}
                    onClick={() => handleAddUser(session.id)}
                    sx={{ ...styles.primary, color: "#fff" }}
                  >
                    <PersonAddAlt1Icon />
                  </IconButton>
                </Box>

                {/* Users List */}
                <Stack spacing={2}>
                  {(assignedUsersMap[session.id] || []).length === 0 ? (
                    <Typography color="text.secondary" fontSize={14}>
                      {t("sessions.noUsers")}
                    </Typography>
                  ) : (
                    assignedUsersMap[session.id].map((user) => (
                      <Box
                        key={user.id}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        p={2}
                        borderRadius={2}
                        sx={{
                          boxShadow: "0 2px 8px rgba(25,118,210,.04)",
                          cursor: "pointer",
                          transition: "background .15s",
                          "&:hover": { opacity: 0.8 }
                        }}
                        onClick={() => navigate(`/ProfilePage/${user.id}`)}
                      >
                        <Avatar
                          src={user.profilePic || undefined}
                          sx={{
                            width: 38, height: 38, fontWeight: 700, fontSize: 16,
                          }}
                        >
                          {!user.profilePic && user.name ? user.name[0].toUpperCase() : null}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={600} fontSize={14} color="#222">
                            {user.name}
                          </Typography>
                          <Typography fontSize={12} color="#999">
                            {user.role}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveUser(session.id, user.id);
                          }}
                          sx={styles.danger}
                        >
                          <DeleteIcon fontSize="small" sx={{ color: 'white' }} />
                        </IconButton>
                      </Box>
                    ))
                  )}
                </Stack>
              </Paper>
            )}
          </Paper>
        ))
      )}

      {/* Share Modal */}
      <Dialog open={shareModal.open} onClose={() => setShareModal({ open: false, session: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          
          📤 {t("sessions.shareSession")}
          <IconButton onClick={() => setShareModal({ open: false, session: null })} sx={{ position: 'absolute', right: 8, top: 8, ...styles.danger }}>
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Session Preview Widget */}
          <Box
            id="session-preview"
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "2px solid #1976d2",
              boxShadow: 3,
              mb: 3,
              maxWidth: 800,
              mx: "auto"
            }}
          >
            <Box
              sx={{
                color: "#fff",
                p: 3,
                textAlign: "center"
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                🎓 {shareModal.session?.name}
              </Typography>
              <Typography variant="subtitle1">
                🚀 {t("sessions.newOpportunity")}
              </Typography>
            </Box>

            {shareModal.session?.imageUrl && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 2
                }}
              >
                <img
                  src={shareModal.session.imageUrl}
                  alt="Session"
                  crossOrigin="anonymous"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 240,
                    borderRadius: 12,
                    objectFit: "cover",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
                  }}
                />
              </Box>
            )}

            <Box sx={{ p: 3 }}>
              <Typography fontSize={16} mb={1}>
                📚 <strong>{t("sessions.program")}</strong> : {shareModal.session?.program?.name}
              </Typography>
              <Typography fontSize={16} mb={2}>
                📅 <strong>{t("sessions.period")}</strong> :{" "}
                {shareModal.session?.startDate?.slice(0, 10)} ➜ {shareModal.session?.endDate?.slice(0, 10)}
              </Typography>

              {shareModal.session?.session2Modules?.length > 0 && (
                <>
                  <Typography fontWeight="bold" fontSize={16} mb={1}>
                    🧱 {t("sessions.modulesContent")}
                  </Typography>
                  <ul style={{ paddingLeft: 20 }}>
                    {shareModal.session.session2Modules.map((mod) => (
                      <li key={mod.id}>
                        <Typography fontSize={14}>✅ {mod.module?.name}</Typography>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <Typography fontSize={14} mt={3} color="text.secondary">
                {t("sessions.hashtagsShort")}
              </Typography>
            </Box>
          </Box>

          {/* Share Text and Buttons */}
          <TextField
            multiline
            rows={8}
            fullWidth
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            variant="outlined"
            label={`📝 ${t("sessions.customizePost")}`}
            sx={{ mb: 3 }}
          />

                      <Stack direction="row" spacing={2} flexWrap="wrap" gap={1} mb={2}>
              <Button variant="contained" startIcon={<Facebook />} onClick={() => handleSocialShare('facebook')} sx={styles.info}>{t("sessions.facebook")}</Button>
              <Button variant="contained" startIcon={<Twitter />} onClick={() => handleSocialShare('twitter')} sx={styles.info}>{t("sessions.twitter")}</Button>
              <Button variant="contained" startIcon={<LinkedIn />} onClick={() => handleSocialShare('linkedin')} sx={styles.info}>{t("sessions.linkedin")}</Button>
              <Button variant="outlined" startIcon={<ContentCopy />} onClick={handleCopyText} sx={{ ...styles.secondary, color: 'white', borderColor: 'white', '& .MuiSvgIcon-root': { color: 'white' } }}>📋 {t("sessions.hide")}</Button>
              <Button variant="contained" startIcon={<Download />} onClick={handleDownloadPreview} sx={styles.success}>🖼️ {t("sessions.downloadImage")}</Button>
            </Stack>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <AddSessionFeedback
        open={openFeedbackDialog} 
        onClose={() => setOpenFeedbackDialog(false)}
        session={selectedSession}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, sessionId: null })}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{t("sessions.confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography id="delete-dialog-description">
            {t("sessions.confirmDeleteDescription")}
          </Typography>
        </DialogContent>
        <DialogActions>
                     <Button onClick={() => setDeleteDialog({ open: false, sessionId: null })} sx={{ 
             backgroundColor: 'white', 
             color: '#666', 
             border: '1px solid #ddd',
             borderRadius: 2,
             '&:hover': {
               backgroundColor: '#f5f5f5',
               borderColor: '#999'
             }
           }}>
             {t("sessions.cancel")}
           </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={styles.danger}>
            {t("sessions.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SessionList;
