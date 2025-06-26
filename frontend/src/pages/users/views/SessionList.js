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
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import { Close, Facebook, Twitter, LinkedIn, ContentCopy } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { toast } from "react-toastify";

const SessionList = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [shareModal, setShareModal] = useState({ open: false, session: null });
  const [shareText, setShareText] = useState('');

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
            {/* 📸 Image */}
            {session.imageUrl && (
              <Box mb={2} display="flex" justifyContent="center">
                <img
                  src={session.imageUrl}
                  alt="Session"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 180,
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}

            {/* 🧾 Session Info + Boutons */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6" fontWeight="bold" color="primary">
                🧾 {session.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleShare(session)}
                >
                  📤 {t("sessions.share")}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(session.id)}
                >
                  🗑️ {t("common.delete")}
                </Button>
              </Stack>
            </Stack>

            <Typography variant="body2" mb={0.5}>
              📚 {t("sessions.program")} : <strong>{session.program?.name || t("sessions.unknown")}</strong>
            </Typography>
            <Typography variant="body2">
              📅 {t("sessions.period")} <strong>{session.startDate?.slice(0, 10)}</strong> {t("sessions.to")}{" "}
              <strong>{session.endDate?.slice(0, 10)}</strong>
            </Typography>

            {/* 📦 Modules + Contenus */}
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
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9ff', borderRadius: 2, border: '1px solid #e3f2fd' }}>
            <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>🎓 {shareModal.session?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t("sessions.sharePreview")}
            </Typography>
          </Box>
          
          <TextField
            multiline
            rows={10}
            fullWidth
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            variant="outlined"
            label={`📝 ${t("sessions.customizePost")}`}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                lineHeight: 1.6
              }
            }}
          />
          
          <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle1" mb={2} sx={{ fontWeight: 600 }}>🚀 {t("sessions.choosePlatform")} :</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
              <Button
                variant="contained"
                startIcon={<Facebook />}
                onClick={() => handleSocialShare('facebook')}
                sx={{ 
                  bgcolor: '#1877f2',
                  '&:hover': { bgcolor: '#166fe5' },
                  borderRadius: 3,
                  px: 3
                }}
              >
                Facebook
              </Button>
              <Button
                variant="contained"
                startIcon={<Twitter />}
                onClick={() => handleSocialShare('twitter')}
                sx={{ 
                  bgcolor: '#1da1f2',
                  '&:hover': { bgcolor: '#1a91da' },
                  borderRadius: 3,
                  px: 3
                }}
              >
                Twitter
              </Button>
              <Button
                variant="contained"
                startIcon={<LinkedIn />}
                onClick={() => handleSocialShare('linkedin')}
                sx={{ 
                  bgcolor: '#0077b5',
                  '&:hover': { bgcolor: '#006ba1' },
                  borderRadius: 3,
                  px: 3
                }}
              >
                LinkedIn
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopyText}
                sx={{ 
                  borderRadius: 3,
                  px: 3,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': { bgcolor: '#f3f4f6' }
                }}
              >
                {t("sessions.copyText")}
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default SessionList;
