import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Chip,
  Button,
  Collapse,
  Stack,
  TextField,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import ReactPlayer from "react-player";
import {
  Description as DescriptionIcon,
  Quiz as QuizIcon,

  InsertDriveFile as InsertDriveFileIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Movie as MovieIcon,
  Save as SaveIcon,
  ZoomInMap as ZoomInMapIcon,
  Feedback as FeedbackIcon,
  List as ListIcon,
  Group as GroupIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

import { useNavigate } from "react-router-dom";
import AddSeanceFeedback from '../../../features/views/feedback/feedbackForm/AddSeanceFeedback';
import FeedbackFormateur from '../feedback/feedbackForm/FeedbackFormateur';
import FeedbackEtudiant from '../feedback/feedbackForm/FeedbackEtudiant';
import SeanceFeedbackList from '../../../features/views/feedback/FeedbackList/seancefeedbacklist';
import Regroupement from './Regroupement';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

const AnimerSeanceView = () => {
  const { t } = useTranslation('seances');
  const { id: seanceId } = useParams();
  const [seance, setSeance] = useState(null);
  const [programDetails, setProgramDetails] = useState(null);
  const [tab, setTab] = useState(0);
  const [prevTab, setPrevTab] = useState(0);
  const [showContenus, setShowContenus] = useState(true);
  const [sessionImages, setSessionImages] = useState([]);
  const [sessionVideos, setSessionVideos] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [sessionNotes, setSessionNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFeedbackSidebar, setShowFeedbackSidebar] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [showFeedbackTab, setShowFeedbackTab] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();



  // Load feedbacks
  const reloadFeedbacks = () => {
    if (seanceId) {
      axios.get(`http://localhost:8000/feedback/feedbacklist/${seanceId}`)
        .then(res => {
          console.log("Feedbacks reçus:", res.data);
          const mapped = [];
          const seenEmails = new Set();
          res.data.forEach(fb => {
            if (!seenEmails.has(fb.email)) {
              mapped.push({
                ...fb,
                studentName: fb.nom || '',
                studentEmail: fb.email || '',
                content: fb.feedback || '',
                sessionComments: fb.sessionComments,
                trainerComments: fb.trainerComments,
                teamComments: fb.teamComments,
                suggestions: fb.suggestions,
                answers: fb.answers || [],
              });
              seenEmails.add(fb.email);
            }
          });
          setFeedbacks(mapped);
        })
        .catch(err => console.error("Erreur chargement feedbacklist:", err));
    }
  };

  useEffect(() => {
    reloadFeedbacks();
  }, [seanceId]);





  useEffect(() => {
    const fetchSeance = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/seance-formateur/${seanceId}`);
        const base = res.data;
        setSeance(base);

        if (base?.session2?.id) {
          const detailRes = await axios.get(
            `http://localhost:8000/seance-formateur/details/${base.session2.id}`
          );
          setProgramDetails(detailRes.data);
        }
      } catch (err) {
        console.error("❌ Erreur chargement séance :", err);
      }
    };
    fetchSeance();
  }, [seanceId]);

  useEffect(() => {
    if (!seanceId) return;
    axios.get(`http://localhost:8000/seance-formateur/${seanceId}/media`)
      .then(res => {
        setSessionImages(res.data.filter(m => m.type === "IMAGE"));
        setSessionVideos(res.data.filter(m => m.type === "VIDEO"));
      })
      .catch(err => {
        console.error("Erreur chargement médias:", err);
      });
  }, [seanceId]);

  const uploadMedia = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const res = await axios.post(
      `http://localhost:8000/seance-formateur/${seanceId}/upload-media`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  };

  const toggleCourseVisibility = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const handleTabChange = (e, newValue) => {
    if (newValue !== 3 && newValue !== 4) setPrevTab(tab);
    setTab(newValue);
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const media = await uploadMedia(file, "IMAGE");
      setSessionImages((prev) => [...prev, media]);
    } catch (err) {
      alert(t('uploadImageError'));
    }
  };

  const handleAddVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const media = await uploadMedia(file, "VIDEO");
      setSessionVideos((prev) => [...prev, media]);
    } catch (err) {
      alert(t('uploadVideoError'));
    }
  };

  const handleSaveSession = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
    alert(t('seance.saveSuccess'));
  };

  const handlePublishContenu = async (contenuId) => {
    if (!contenuId) return;
    try {
      await axios.patch(`http://localhost:8000/contenus/${contenuId}/publish`, {
        published: true,
      });
      const detailRes = await axios.get(
        `http://localhost:8000/seance-formateur/details/${seance.session2.id}`
      );
      setProgramDetails(detailRes.data);
    } catch {
      alert(t('statusChangeError'));
    }
  };

  const toggleFeedbackTab = () => {
    setShowFeedbackTab(!showFeedbackTab);
  };





  const feedbackColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'studentName', headerName: t('seances.studentName'), width: 200 },
    { field: 'studentEmail', headerName: t('seances.studentEmail'), width: 250 },
    {
      field: 'createdAt',
      headerName: t('seances.date'),
      width: 180,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleString()
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('seances.actions'),
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DescriptionIcon />}
          label={t('seances.viewFeedback')}
          onClick={() => {
            setSelectedFeedback(params.row);
            setFeedbackDialogOpen(true);
          }}
        />
      ],
    },
  ];

  const renderProgramHierarchy = () => {
    if (!programDetails) return <Typography>{t('loadingProgram')}</Typography>;

    return (
      <Box>
        <Typography variant="h6" mb={1}>📘 <strong>{t('program')} : {programDetails.program.name}</strong></Typography>

        <Box ml={2} mt={2}>
          {programDetails.session2Modules.map((mod) => (
            <Box key={mod.id} mt={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#1976d2" }}>
                📦 {mod.module.name}
              </Typography>

              <Box ml={3}>
                {mod.courses.map((course) => (
                  <Box key={course.id} mt={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: "#1e88e5" }}>
                        📘 {course.course.title}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => toggleCourseVisibility(course.id)}
                      >
                        {expandedCourses[course.id] ? t('hide') : t('show')}
                      </Button>
                    </Stack>

                    <Collapse in={expandedCourses[course.id]}>
                      {course.contenus.map((ct) => (
                        <Box key={ct.contenu?.id ?? uuidv4()} display="flex" alignItems="center" gap={1} flexWrap="wrap" mt={1}>
                          <Chip
                            icon={<InsertDriveFileIcon sx={{ fontSize: 22, color: ct.contenu.published ? "#4caf50" : "#b0bec5" }} />}
                            label={ct.contenu.title}
                            variant="outlined"
                            onClick={() => ct.contenu?.fileUrl && window.open(ct.contenu.fileUrl, "_blank")}
                            sx={{
                              cursor: ct.contenu?.fileUrl ? "pointer" : "default",
                              borderColor: ct.contenu.published ? "#4caf50" : "#b0bec5",
                              color: ct.contenu.published ? "#2e7d32" : "#546e7a",
                              fontWeight: "bold",
                              minWidth: 140,
                              justifyContent: "flex-start",
                            }}
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            color={ct.contenu?.published ? "success" : "warning"}
                            onClick={() => handlePublishContenu(ct.contenu?.id)}
                          >
                            {ct.contenu?.published ? t('unpublish') : t('publish')}
                          </Button>
                        </Box>
                      ))}
                    </Collapse>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  if (!seance) return <Typography>{t('loadingSession')}</Typography>;

  return (
    <Box p={2}>
      {/* Meet */}
      <Paper sx={{
        mb: 3, p: 0, background: "#f8fafc", minHeight: "70vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "2px solid #bcbcbc", overflow: "hidden",
      }}>
        <iframe
          src={`https://localhost:8443/${seance.title || "default-room"}`}
          allow="camera; microphone; fullscreen; display-capture"
          style={{ width: "100%", height: "70vh", border: "none" }}
          title={t('jitsiMeeting')}
        />
      </Paper>

      {/* Programme */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip label={`${t('program')} : ${programDetails?.program?.name || ""}`} color="info" />
          <Button
            startIcon={<ZoomInMapIcon />}
            onClick={() => setShowContenus(!showContenus)}
            variant="outlined"
            size="small"
          >
            {showContenus ? t('hideHierarchy') : t('showHierarchy')}
          </Button>
          <Button
            startIcon={<FeedbackIcon />}
            onClick={() => setShowFeedbackTab((v) => !v)}
            variant={showFeedbackTab ? "outlined" : "contained"}
            color="secondary"
            size="small"
          >
            {showFeedbackTab ? t('hideFeedback') : t('showFeedback')}
          </Button>
        </Stack>
        <Collapse in={showContenus}>
          <Divider sx={{ my: 2 }} />
          {renderProgramHierarchy()}
        </Collapse>
      </Paper>

      {/* Tabs */}
      <Box display="flex" mt={2}>
        <Tabs orientation="vertical" value={tab} onChange={handleTabChange} sx={{ borderRight: 1, borderColor: "divider", minWidth: 180 }}>
          <Tab icon={<DescriptionIcon />} iconPosition="start" label={t('sessionAdditions')} />
          <Tab icon={<QuizIcon />} iconPosition="start" label={t('quizComing')} />
          <Tab icon={<InsertDriveFileIcon />} iconPosition="start" label={t('whiteboard')} onClick={() => navigate(`/whiteboard/${seanceId}`)} />
          <Tab icon={<GroupIcon />} iconPosition="start" label="Regroupement" />
          <Tab icon={<FeedbackIcon />} iconPosition="start" label={t('feedbackFormateur') || 'Feedback Formateur'} />
          <Tab icon={<FeedbackIcon />} iconPosition="start" label="Feedback Étudiant" />
          {showFeedbackTab && (
            <Tab icon={<FeedbackIcon />} iconPosition="start" label={t('feedback')} />
          )}
          <Tab icon={<FeedbackIcon />} iconPosition="start" label={t('feedbackList')} />
        </Tabs>

        <Box flex={1} pl={3}>
          {/* Onglet 1 */}
          {tab === 0 && (
            <Box>
              <Typography variant="h6" mt={1}>
                {t('sessionImages')}
                <IconButton color="primary" component="label">
                  <AddPhotoAlternateIcon />
                  <input type="file" accept="image/*" hidden onChange={handleAddImage} />
                </IconButton>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sessionImages.map((img) => (
                  <img
                    key={img.id}
                    src={img.fileUrl}
                    alt=""
                    style={{ maxHeight: 100, margin: 2, cursor: "pointer", borderRadius: 8, boxShadow: "0 1px 6px #bbb" }}
                    onClick={() => setZoomedImage(img.fileUrl)}
                  />
                ))}
              </Stack>

              <Typography variant="h6" mt={2}>
                {t('sessionVideos')}
                <IconButton color="primary" component="label">
                  <MovieIcon />
                  <input type="file" accept="video/*" hidden onChange={handleAddVideo} />
                </IconButton>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sessionVideos.map((vid) => (
                  <Box key={vid.id} sx={{ width: 180 }}>
                    <ReactPlayer url={vid.fileUrl} controls width="100%" height={100} />
                  </Box>
                ))}
              </Stack>

              <Typography variant="h6" mt={2}>{t('sessionNotes')}</Typography>
              <TextField
                fullWidth multiline minRows={3}
                placeholder={t('notesPlaceholder')}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                sx={{ my: 1 }}
              />
              <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSaveSession} disabled={saving}>
                {saving ? t('saving') : t('saveSession')}
              </Button>
            </Box>
          )}
          {/* Onglet 2 */}
          {tab === 1 && (
            <Typography color="text.secondary">🧪 {t('quizFeature')}</Typography>
          )}
          {/* Onglet 3 */}
          {tab === 2 && (
            <Box>
              <Typography variant="h6" mt={1}>
                {t('sessionImages')}
                <IconButton color="primary" component="label">
                  <AddPhotoAlternateIcon />
                  <input type="file" accept="image/*" hidden onChange={handleAddImage} />
                </IconButton>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sessionImages.map((img) => (
                  <img
                    key={img.id}
                    src={img.fileUrl}
                    alt=""
                    style={{ maxHeight: 100, margin: 2, cursor: "pointer", borderRadius: 8, boxShadow: "0 1px 6px #bbb" }}
                    onClick={() => setZoomedImage(img.fileUrl)}
                  />
                ))}
              </Stack>

              <Typography variant="h6" mt={2}>
                {t('sessionVideos')}
                <IconButton color="primary" component="label">
                  <MovieIcon />
                  <input type="file" accept="video/*" hidden onChange={handleAddVideo} />
                </IconButton>
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sessionVideos.map((vid) => (
                  <Box key={vid.id} sx={{ width: 180 }}>
                    <ReactPlayer url={vid.fileUrl} controls width="100%" height={100} />
                  </Box>
                ))}
              </Stack>

              <Typography variant="h6" mt={2}>{t('sessionNotes')}</Typography>
              <TextField
                fullWidth multiline minRows={3}
                placeholder={t('notesPlaceholder')}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                sx={{ my: 1 }}
              />
              <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSaveSession} disabled={saving}>
                {saving ? t('saving') : t('saveSession')}
              </Button>
            </Box>
          )}

          {/* Onglet FeedbackFormateur */}
          {tab === 4 && (
            <Box>
              <Typography variant="h6" mb={2}>{t('feedbackFormateur') || 'Feedback Formateur'}</Typography>
              <FeedbackFormateur seanceId={seanceId} />
            </Box>
          )}
          {/* Onglet Feedback Étudiant */}
          {tab === 5 && (
            <Box>
              <Typography variant="h6" mb={2}>Feedback Étudiant</Typography>
              <FeedbackEtudiant seanceId={seanceId} />
            </Box>
          )}
          {/* Onglet Feedback (dynamique) */}
          {showFeedbackTab && tab === 6 && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Typography variant="h6">📝 {t('sessionFeedback')}</Typography>
              </Stack>
              <AddSeanceFeedback seanceId={seanceId} onFeedbackSubmitted={reloadFeedbacks} />
            </Box>
          )}
          {/* Onglet Regroupement */}
          {tab === 3 && (
            <Regroupement />
          )}
          {/* Onglet FeedbackList */}
          {tab === 7 && (
            <SeanceFeedbackList />
          )}
        </Box>
      </Box>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FeedbackIcon color="primary" />
            <Box>
              {t('feedbackFrom')} <b>{selectedFeedback?.studentName}</b>
              <Typography variant="body2" color="text.secondary">
                {selectedFeedback?.studentEmail}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#f8fafc", maxHeight: 500 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('date')}: {selectedFeedback?.createdAt && new Date(selectedFeedback.createdAt).toLocaleString()}
              </Typography>
            </Box>
            {selectedFeedback?.answers?.length > 0 && (() => {
              // Définition des sections thématiques
              const sections = [
                {
                  title: t('sessionSection'),
                  keywords: [
                    'note de la session',
                    'organisation',
                    'objectifs',
                    'durée',
                    'durée de la séance',
                    'qualité du contenu',
                    'commentaires sur la session'
                  ]
                },
                {
                  title: t('trainerSection'),
                  keywords: ['note du formateur', 'clarté', 'disponibilité', 'pédagogie', 'interaction', 'commentaires sur le formateur']
                },
                {
                  title: t('teamSection'),
                  keywords: ['note de l\'équipe', 'collaboration', 'participation', 'communication', 'commentaires sur l\'équipe']
                },
                {
                  title: t('suggestionsSection'),
                  keywords: ['suggestions', 'amélioration', 'recommanderait']
                }
              ];
              // Grouper les réponses par section avec un matching robuste
              function normalize(str) {
                return str
                  .toLowerCase()
                  .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
                  .replace(/[^a-z0-9]/g, ''); // retire tout sauf lettres/chiffres
              }
              const groupedAnswers = selectedFeedback && selectedFeedback.answers ? sections.map(section => ({
                ...section,
                answers: selectedFeedback.answers.filter(qa =>
                  section.keywords.some(keyword =>
                    normalize(qa.question).includes(normalize(keyword))
                  )
                )
              })) : [];
              // Réponses non classées
              const otherAnswers = selectedFeedback && selectedFeedback.answers
                ? selectedFeedback.answers.filter(qa =>
                    !sections.some(section =>
                      section.keywords.some(keyword =>
                        normalize(qa.question).includes(normalize(keyword))
                      )
                    )
                  )
                : [];
              // Emoji/label pour toutes les réponses numériques (1-5)
              const moodEmojis = ["😞", "😐", "🙂", "😊", "🤩"];
              const moodLabels = [t('veryDissatisfied'), t('dissatisfied'), t('neutral'), t('satisfied'), t('verySatisfied')];
              return (
                <>
                  {groupedAnswers.map((section, idx) =>
                    section.answers.length > 0 && (
                      <Box key={idx} mb={2}>
                        <Divider sx={{ mb: 1 }}>{section.title}</Divider>
                        <Stack spacing={2}>
                          {section.answers.map((qa, qidx) => {
                            let isNumeric = !isNaN(Number(qa.answer)) && Number(qa.answer) >= 1 && Number(qa.answer) <= 5;
                            let value = isNumeric ? Number(qa.answer) : null;
                            return (
                              <Paper key={qidx} elevation={1} sx={{ p: 2, bgcolor: "#fff" }}>
                                <Typography fontWeight="bold" gutterBottom>
                                  {qa.question}
                                </Typography>
                                {isNumeric ? (
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Typography fontSize={32}>{moodEmojis[value - 1]}</Typography>
                                    <Typography fontWeight="bold">{moodLabels[value - 1]}</Typography>
                                    <Typography color="text.secondary">({value})</Typography>
                                  </Box>
                                ) : (
                                  <Typography style={{ whiteSpace: 'pre-line' }}>{qa.answer || t('noAnswer')}</Typography>
                                )}
                              </Paper>
                            );
                          })}
                        </Stack>
                      </Box>
                    )
                  )}
                  {otherAnswers.length > 0 && (
                    <Box mb={2}>
                      <Divider sx={{ mb: 1 }}>{t('otherSection')}</Divider>
                      <Stack spacing={2}>
                        {otherAnswers.map((qa, qidx) => {
                          let isNumeric = !isNaN(Number(qa.answer)) && Number(qa.answer) >= 1 && Number(qa.answer) <= 5;
                          let value = isNumeric ? Number(qa.answer) : null;
                          return (
                            <Paper key={qidx} elevation={1} sx={{ p: 2, bgcolor: "#fff" }}>
                              <Typography fontWeight="bold" gutterBottom>
                                {qa.question}
                              </Typography>
                              {isNumeric ? (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography fontSize={32}>{moodEmojis[value - 1]}</Typography>
                                  <Typography fontWeight="bold">{moodLabels[value - 1]}</Typography>
                                  <Typography color="text.secondary">({value})</Typography>
                                </Box>
                              ) : (
                                <Typography style={{ whiteSpace: 'pre-line' }}>{qa.answer || t('noAnswer')}</Typography>
                              )}
                            </Paper>
                          );
                        })}
                      </Stack>
                    </Box>
                  )}
                </>
              );
            })()}
            {/* Note moyenne de feedback */}
            <Divider>{t('averageRating')}</Divider>
            {(() => {
              // Récupère toutes les réponses numériques (1-5)
              const numericAnswers = selectedFeedback && selectedFeedback.answers ? selectedFeedback.answers
                .map(qa => Number(qa.answer))
                .filter(val => !isNaN(val) && val >= 1 && val <= 5) : [];
              if (numericAnswers.length === 0) {
                return <Typography color="text.secondary">{t('noRating')}</Typography>;
              }
              const avg = numericAnswers.reduce((a, b) => a + b, 0) / numericAnswers.length;
              const rounded = Math.round(avg);
              const moodEmojis = ["😞", "😐", "🙂", "😊", "🤩"];
              const moodLabels = [t('veryDissatisfied'), t('dissatisfied'), t('neutral'), t('satisfied'), t('verySatisfied')];
              return (
                <Box display="flex" alignItems="center" gap={1} mt={1} mb={2}>
                  <Typography fontSize={32}>{moodEmojis[rounded - 1]}</Typography>
                  <Typography fontWeight="bold">{moodLabels[rounded - 1]}</Typography>
                  <Typography color="text.secondary">({avg.toFixed(2)})</Typography>
                </Box>
              );
            })()}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Image zoom */}
      {zoomedImage && (
        <Box
          onClick={() => setZoomedImage(null)}
          sx={{
            position: "fixed", top: 0, left: 0, zIndex: 2000, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "zoom-out",
          }}
        >
          <img
            src={zoomedImage}
            alt=""
            style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 12, boxShadow: "0 2px 24px #111" }}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
      )}
    </Box>
  );
};

export default AnimerSeanceView;