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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { Close, Facebook, Twitter, LinkedIn, ContentCopy, Feedback } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SessionFeedbackForm from '../../../components/session-feedback-form';

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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/session2");
      setSessions(res.data);
      const usersMap = {};
      await Promise.all(
        res.data.map(async (session) => {
          try {
            const resp = await axios.get(`http://localhost:8000/session2/${session.id}/users`);
            usersMap[session.id] = resp.data || [];
          } catch {
            usersMap[session.id] = [];
          }
        })
      );
      setAssignedUsersMap(usersMap);
    } catch {
      toast.error(t("sessions.loadError"));
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/session2/${id}`);
      toast.success(t("sessions.deleteSuccess"));
      fetchSessions();
    } catch {
      toast.error(t("sessions.deleteError"));
    }
  };

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/session2/${sessionId}/status`, {
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
      await axios.delete(`http://localhost:8000/session2/${sessionId}/remove-user/${userId}`);
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
      await axios.post(`http://localhost:8000/session2/${sessionId}/add-user`, {
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
    const text = `🌟 ${t("sessions.newSessionAvailable")} 🌟\n\n🎯 ${session.name}\n\n📚 ${t("sessions.program")}: ${session.program?.name || t("sessions.program")}\n📅 ${t("sessions.period")}: ${session.startDate?.slice(0, 10)} ➜ ${session.endDate?.slice(0, 10)}\n\n${session.session2Modules?.length > 0 ? `🎓 ${t("sessions.includedModules")}:\n` + session.session2Modules.map(mod => `✅ ${mod.module?.name}`).join('\n') + '\n\n' : ''}🚀 ${t("sessions.uniqueOpportunity")}\n\n💡 ${t("sessions.registerNow")}\n\n#Formation #Éducation #DéveloppementProfessionnel #Apprentissage #Compétences #LMS #Success`;
    setShareText(text);
    setShareModal({ open: true, session });
  };

  const handleSocialShare = (platform) => {
    const encodedText = encodeURIComponent(shareText);
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

  const handleDownloadPreview = async () => {
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById("session-preview");
      if (!element) return;

      const canvas = await html2canvas(element);
      const dataURL = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `session-${shareModal.session?.name || "preview"}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(t('sessions.imageGenerationError'));
    }
  };

  const openFeedbackForm = (session) => {
    setSelectedSession(session);
    setOpenFeedbackDialog(true);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: "#fefefe" }}>
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
              backgroundColor: "#ffffff",
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
                    label={session.status}
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
                </Stack>
              </Stack>

              {!sidebarOpen[session.id] && (
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(session.id)}
                  >
                    {t("sessions.delete")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<RocketLaunchIcon />}
                    onClick={() => navigate(`/sessions/${session.id}/seances`)}
                  >
                    {t("sessions.join")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<PersonAddAlt1Icon />}
                    onClick={() => handleToggleSidebar(session.id)}
                  >
                    {t("sessions.addUser")}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleShare(session)}
                  >
                    📤 {t("sessions.share")}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<Feedback />}
                    onClick={() => openFeedbackForm(session)}
                  >
                    📝 {t("sessions.feedback")}
                  </Button>
                </Stack>
              )}

              {/* Add User Section */}
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
                    color="secondary"
                    onClick={() => handleAddUser(session.id)}
                    disabled={addLoading}
                  >
                    {addLoading ? t("sessions.adding") : t("sessions.add")}
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => { setShowAddUserId(null); setUserEmail(""); }}
                  >
                    {t("sessions.cancel")}
                  </Button>
                </Box>
              )}

              <Typography variant="body2" mb={0.5}>
                📚 {t("sessions.program")} : <strong>{session.program?.name || t("sessions.unknown")}</strong>
              </Typography>
              <Typography variant="body2">
                📅 {t("sessions.period")} <strong>{session.startDate?.slice(0, 10)}</strong> {t("sessions.to")}{" "}
                <strong>{session.endDate?.slice(0, 10)}</strong>
              </Typography>

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
            {sidebarOpen[session.id] && (
              <Paper
                elevation={4}
                sx={{
                  minWidth: 350,
                  maxWidth: 400,
                  bgcolor: "#f8fbff",
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
                    color="primary"
                    onClick={() => handleToggleSidebar(session.id)}
                    sx={{ fontWeight: 600, fontSize: 14, textTransform: "none" }}
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
                  bgcolor="#eaf0f9"
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
                    sx={{ flex: 1, bgcolor: "#fff", borderRadius: 2 }}
                  />
                  <IconButton
                    color="primary"
                    disabled={addLoading}
                    onClick={() => handleAddUser(session.id)}
                    sx={{ bgcolor: "#1976d2", color: "#fff", "&:hover": { bgcolor: "#1565c0" } }}
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
                        bgcolor="#fff"
                        borderRadius={2}
                        sx={{
                          boxShadow: "0 2px 8px rgba(25,118,210,.04)",
                          cursor: "pointer",
                          transition: "background .15s",
                          "&:hover": { background: "#f0f6ff" }
                        }}
                        onClick={() => navigate(`/ProfilePage/${user.id}`)}
                      >
                        <Avatar
                          src={user.profilePic || undefined}
                          sx={{
                            width: 38, height: 38, fontWeight: 700, fontSize: 16,
                            bgcolor: user.profilePic ? "transparent" : "#B5C7D3",
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
                          color="error"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveUser(session.id, user.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
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
          <IconButton onClick={() => setShareModal({ open: false, session: null })} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Session Preview Widget */}
          <Box
            id="session-preview"
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              bgcolor: "#ffffff",
              border: "2px solid #1976d2",
              boxShadow: 3,
              mb: 3,
              maxWidth: 800,
              mx: "auto"
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
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
                  backgroundColor: "#e3f2fd",
                  p: 2
                }}
              >
                <img
                  src={shareModal.session.imageUrl}
                  alt="Session"
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
                #Formation #Éducation #LMS #Apprentissage #Succès
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
            <Button variant="contained" startIcon={<Facebook />} onClick={() => handleSocialShare('facebook')} sx={{ bgcolor: '#1877f2' }}>Facebook</Button>
            <Button variant="contained" startIcon={<Twitter />} onClick={() => handleSocialShare('twitter')} sx={{ bgcolor: '#1da1f2' }}>Twitter</Button>
            <Button variant="contained" startIcon={<LinkedIn />} onClick={() => handleSocialShare('linkedin')} sx={{ bgcolor: '#0077b5' }}>LinkedIn</Button>
            <Button variant="outlined" startIcon={<ContentCopy />} onClick={handleCopyText}>📋 {t("sessions.copyText")}</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <SessionFeedbackForm 
        open={openFeedbackDialog} 
        onClose={() => setOpenFeedbackDialog(false)}
        session={selectedSession}
      />
    </Paper>
  );
};

export default SessionList;