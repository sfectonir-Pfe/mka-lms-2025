import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Divider,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Collapse,
} from "@mui/material";
import { Close, Facebook, Twitter, LinkedIn, ContentCopy, Feedback } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";


import { useNavigate } from "react-router-dom";
import SessionFeedbackForm from '../../../components/session-feedback-form';




const SessionList = () => {
  const [showAddUserId, setShowAddUserId] = useState(null);
const [userEmail, setUserEmail] = useState("");
const [addLoading, setAddLoading] = useState(false);
const { t } = useTranslation();
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
  } catch (e) {
    toast.error(
      e.response?.data?.message ||
      t("sessions.addUserError")
    );
  } finally {
    setAddLoading(false);
  }
};

  const [sessions, setSessions] = useState([]);
  const [shareModal, setShareModal] = useState({ open: false, session: null });
  const [shareText, setShareText] = useState('');
  const [showFeedback, setShowFeedback] = useState({});
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

const navigate = useNavigate();

  const toggleFeedback = (sessionId) => {
    setShowFeedback(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const openFeedbackForm = (session) => {
    console.log("openFeedbackForm called with session:", session);
    setSelectedSession(session);
    setOpenFeedbackDialog(true);
    console.log("openFeedbackDialog set to true");
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/session2");
      setSessions(res.data);
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

  const handleShare = (session) => {
    const text = `🌟 NOUVELLE SESSION DE FORMATION DISPONIBLE! 🌟\n\n🎯 ${session.name}\n\n📚 PROGRAMME: ${session.program?.name || 'Programme'}\n📅 PÉRIODE: ${session.startDate?.slice(0, 10)} ➜ ${session.endDate?.slice(0, 10)}\n\n${session.session2Modules?.length > 0 ? '🎓 MODULES INCLUS:\n' + session.session2Modules.map(mod => `✅ ${mod.module?.name}`).join('\n') + '\n\n' : ''}🚀 Une opportunité unique de développer vos compétences!\n\n💡 Inscrivez-vous dès maintenant et transformez votre avenir professionnel!\n\n#Formation #Éducation #DéveloppementProfessionnel #Apprentissage #Compétences #LMS #Success`;
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
    const element = document.getElementById("session-preview");
    if (!element) return;

    const canvas = await html2canvas(element);
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `session-${shareModal.session?.name || "preview"}.png`;
    link.click();
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
            }}
          >
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
  <Box>
    <Button
      variant="outlined"
      color="error"
      size="small"
      onClick={() => handleDelete(session.id)}
    >
      🗑️ {t("sessions.delete")}
    </Button>
    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={() => navigate(`/sessions/${session.id}/seances`)}
      sx={{ ml: 2 }}
    >
      🚀 {t("sessions.join")}
    </Button>
    <Button
  variant="outlined"
  color="secondary"
  size="small"
  sx={{ ml: 2 }}
  onClick={() => setShowAddUserId(session.id === showAddUserId ? null : session.id)}
>
  ➕ {t("sessions.addUser")}
</Button>
<Button
  variant="contained"
  color="info"
  size="small"
  sx={{ ml: 2 }}
  startIcon={<Feedback />}
  onClick={() => {
    console.log("Button clicked for session:", session.name);
    openFeedbackForm(session);
  }}
>
  📝 {t("sessions.feedback")}
</Button>
{showAddUserId === session.id && (
  <Box mt={2} display="flex" gap={1} alignItems="center">
    <input
      type="email"
      placeholder={t("sessions.userEmailPlaceholder")}
      value={userEmail}
      onChange={e => setUserEmail(e.target.value)}
      style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', minWidth: 220 }}
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

  </Box>
</Stack>


            <Typography variant="body2" mb={0.5}>
              📚 {t("sessions.program")} : <strong>{session.program?.name || t("sessions.unknown")}</strong>
            </Typography>
            <Typography variant="body2">
              📅 {t("sessions.period")} <strong>{session.startDate?.slice(0, 10)}</strong> {t("sessions.to")}{" "}
              <strong>{session.endDate?.slice(0, 10)}</strong>
            </Typography>

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
                    {mod.courses.map((c) => (
                      <Box key={c.id} ml={2} mt={1}>
                        <Typography variant="body2" fontWeight="bold" color="text.primary">
                          📘 {c.course?.title}
                        </Typography>
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                          {c.contenus.map((ct) => (
                            <Chip
                              key={ct.id}
                              label={`📄 ${ct.contenu?.title}`}
                              size="small"
                              variant="outlined"
                              color="info"
                              onClick={() =>
                                ct.contenu?.fileUrl &&
                                window.open(ct.contenu.fileUrl, "_blank")
                              }
                              sx={{
                                cursor: ct.contenu?.fileUrl ? "pointer" : "default",
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                ))}
              </>
            )}

            {/* Section Feedback - Supprimée car maintenant en dialog */}
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

          {/* 💎 Widget stylé */}
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

          {/* Champs texte + boutons */}
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
            <Button variant="outlined" onClick={handleDownloadPreview}>🖼️ {t("sessions.downloadImage")}</Button>
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
