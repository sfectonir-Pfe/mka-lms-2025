import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Skeleton,
  LinearProgress,
  ImageList,
  ImageListItem,
  ButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Tooltip,
  Switch,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosInstance";
import ReactPlayer from "react-player";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  InsertDriveFile as InsertDriveFileIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Movie as MovieIcon,
  ZoomInMap as ZoomInMapIcon,
  Feedback as FeedbackIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

// NEW feedback bits you asked to integrate
import AddSeanceFeedback from "../../../features/views/feedback/feedbackForm/AddSeanceFeedback";
import FeedbackFormateur from "../feedback/feedbackForm/FeedbackFormateur";
import FeedbackEtudiant from "../feedback/feedbackForm/FeedbackEtudiant";
import SeanceFeedbackList from "../../../features/views/feedback/FeedbackList/seancefeedbacklist";
import Regroupement from "./Regroupement";
import QuizList from "../../../features/views/quiz/QuizList";
import RoleGate from "../../../pages/auth/RoleGate";

const AnimerSeanceView = () => {
  const { t } = useTranslation();
  const { id: seanceId } = useParams();
  const navigate = useNavigate();

  // Jitsi configuration
  const jitsiUrl = process.env.REACT_APP_JITSI_URL || 'https://localhost:8443';

  // --- state ---
  const [seance, setSeance] = useState(null);
  const [programDetails, setProgramDetails] = useState(null);
  const [tab, setTab] = useState(0);
  const [showContenus, setShowContenus] = useState(true);
  const [sessionImages, setSessionImages] = useState([]);
  const [sessionVideos, setSessionVideos] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [feedbackVisibleToStudents, setFeedbackVisibleToStudents] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [quizMetaByContenu, setQuizMetaByContenu] = useState({}); // {contenuId: {timeLimit, questions: []}}
  const [programVisibleToStudents, setProgramVisibleToStudents] = useState(false);
  const [jitsiLoading, setJitsiLoading] = useState(true);
  const [jitsiError, setJitsiError] = useState(false);

  // --- helpers ---
  const sanitizeRoomName = (name) => {
    if (!name) return 'default-room';
    // Remove special characters and spaces, keep only alphanumeric, hyphens, and underscores
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50) || 'default-room';
  };

  const getSessionQuizzes = () => {
    if (!programDetails) return [];
    const items = [];
    programDetails.session2Modules?.forEach((mod) => {
      mod.courses?.forEach((c) => {
        c.contenus?.forEach((ct) => {
          const cn = ct?.contenu;
          if (cn?.type === "Quiz") {
            items.push({
              contenuId: cn.id,
              title: cn.title,
              published: !!cn.published,
              courseTitle: c?.course?.title || "",
            });
          }
        });
      });
    });
    return items;
  };

  const reloadFeedbacks = () => {
    if (!seanceId) return;
    api.get(`/feedback/seance/feedbacklist/${seanceId}`)

      .then((res) => {
        const mapped = [];
        const seenEmails = new Set();
        res.data.forEach((fb) => {
          if (!seenEmails.has(fb.email)) {
            mapped.push({
              ...fb,
              studentName: fb.nom || "",
              studentEmail: fb.email || "",
              content: fb.feedback || "",
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
      .catch(() => {});
  };

  // --- effects ---
  useEffect(() => {
    const fetchSeance = async () => {
      try {
        const res = await api.get(`/seance-formateur/${seanceId}`);
        const base = res.data;
        setSeance(base);

        if (base?.session2?.id) {
          const detailRes = await api.get(
            `/seance-formateur/details/${base.session2.id}`
          );
          setProgramDetails(detailRes.data);
        }
      } catch (err) {
        console.error("❌ " + t("seances.loadError"), err);
      }
    };
    fetchSeance();
  }, [seanceId]);

  useEffect(() => {
    if (!seanceId) return;
    api
      .get(`/seance-formateur/${seanceId}/media`)
      .then((res) => {
        setSessionImages(res.data.filter((m) => m.type === "IMAGE"));
        setSessionVideos(res.data.filter((m) => m.type === "VIDEO"));
      })
      .catch(() => {});
  }, [seanceId]);

  // fetch quiz metas for all quiz contenus in this session
  useEffect(() => {
    if (!programDetails) return;

    const ids = [];
    programDetails.session2Modules?.forEach((m) =>
      m.courses?.forEach((c) =>
        c.contenus?.forEach((ct) => {
          if (ct?.contenu?.type === "Quiz" && ct?.contenu?.id) ids.push(ct.contenu.id);
        })
      )
    );

    if (!ids.length) {
      setQuizMetaByContenu({});
      return;
    }

    Promise.all(
      ids.map((id) =>
        api
          .get(`/quizzes/by-contenu/${id}`)
          .then((r) => ({ id, meta: r.data }))
          .catch(() => ({ id, meta: null }))
      )
    ).then((arr) => {
      const map = {};
      arr.forEach(({ id, meta }) => {
        if (meta) map[id] = meta;
      });
      setQuizMetaByContenu(map);
    });
  }, [programDetails]);

  useEffect(() => {
    reloadFeedbacks();
  }, [seanceId]);

  // Fetch program visibility state from backend with polling for real-time updates
  useEffect(() => {
    if (!seanceId) return;
    
    const fetchVisibility = () => {
      api.get(`/seance-formateur/${seanceId}/program-visibility`)
        .then(res => setProgramVisibleToStudents(res.data.visible))
        .catch(() => {});
    };
    
    // Initial fetch
    fetchVisibility();
    
    // Poll every 3 seconds for visibility changes
    const interval = setInterval(fetchVisibility, 3000);
    
    return () => clearInterval(interval);
  }, [seanceId]);

  // Fetch feedback visibility state from backend with polling for real-time updates
  useEffect(() => {
    if (!seanceId) return;
    
    const fetchFeedbackVisibility = () => {
      api.get(`/seance-formateur/${seanceId}/feedback-visibility`)
        .then(res => setFeedbackVisibleToStudents(res.data.visible))
        .catch(() => {});
    };
    
    // Initial fetch
    fetchFeedbackVisibility();
    
    // Poll every 3 seconds for feedback visibility changes
    const interval = setInterval(fetchFeedbackVisibility, 3000);
    
    return () => clearInterval(interval);
  }, [seanceId]);

  // --- actions ---
  const handleTabChange = (_e, newValue) => setTab(newValue);

  const uploadMedia = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const res = await api.post(
      `/seance-formateur/${seanceId}/upload-media`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const media = await uploadMedia(file, "IMAGE");
      setSessionImages((prev) => [...prev, media]);
    } catch {
      alert(t("seances.uploadImageError"));
    }
  };

  const handleAddVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const media = await uploadMedia(file, "VIDEO");
      setSessionVideos((prev) => [...prev, media]);
    } catch {
      alert(t("seances.uploadVideoError"));
    }
  };

  const toggleCourseVisibility = (courseId) =>
    setExpandedCourses((prev) => ({ ...prev, [courseId]: !prev[courseId] }));

  const handlePublishContenu = async (contenuId, nextPublished) => {
    if (!contenuId) return;
    try {
      // optimistic UI
      setProgramDetails((prev) => {
        if (!prev) return prev;
        const copy = JSON.parse(JSON.stringify(prev));
        copy.session2Modules.forEach((mod) =>
          mod.courses.forEach((c) =>
            c.contenus.forEach((cc) => {
              if (cc.contenu?.id === contenuId) cc.contenu.published = nextPublished;
            })
          )
        );
        return copy;
      });

      await api.patch(`/contenus/${contenuId}/publish`, {
        published: nextPublished,
      });

      const detailRes = await api.get(
        `/seance-formateur/details/${seance.session2.id}`
      );
      setProgramDetails(detailRes.data);
    } catch {
      alert(t("seances.statusChangeError"));
    }
  };

  const handleToggleProgramVisibility = async () => {
    if (!seanceId) return;
    try {
      const newVisibility = !programVisibleToStudents;
      // Optimistic UI update
      setProgramVisibleToStudents(newVisibility);
      
      await api.post(`/seance-formateur/${seanceId}/program-visibility`, {
        visible: newVisibility
      });
    } catch (error) {
      // Revert on error
      setProgramVisibleToStudents(!programVisibleToStudents);
      console.error(t('seances.programVisibilityError'), error);
    }
  };

  const handleToggleFeedbackVisibility = async () => {
    if (!seanceId) return;
    try {
      const newVisibility = !feedbackVisibleToStudents;
      // Optimistic UI update
      setFeedbackVisibleToStudents(newVisibility);
      
      await api.post(`/seance-formateur/${seanceId}/feedback-visibility`, {
        visible: newVisibility
      });
    } catch (error) {
      // Revert on error
      setFeedbackVisibleToStudents(!feedbackVisibleToStudents);
      console.error(t('seances.feedbackVisibilityError'), error);
    }
  };

  // --- UI: hierarchy (accordion, cards) ---
  const renderProgramHierarchy = () => {
    if (!programDetails) return <Typography>{t("seances.loadingProgram")}</Typography>;

    return (
      <Box>
        <Typography variant="h6" mb={1}>
          📘 <strong>{t("seances.program")} : {programDetails.program.title}</strong>
        </Typography>

        <Box mt={2}>
          {programDetails.session2Modules.map((mod) => (
            <Accordion key={mod.id} disableGutters sx={{ mb: 1, borderRadius: 2, overflow: "hidden" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 700, color: "#1976d2" }}>
                  📦 {mod.module.name}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ pt: 0 }}>
                {mod.courses.map((course) => (
                  <Accordion
                    key={course.id}
                    disableGutters
                    sx={{
                      mb: 1,
                      ml: 1,
                      borderRadius: 2,
                      overflow: "hidden",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography sx={{ fontWeight: 600, color: "#1e88e5" }}>
                        📘 {course.course.title}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Grid container spacing={1.5}>
                        {course.contenus.map((ct) => {
                          const cn = ct.contenu;
                          const isQuiz = cn?.type === "Quiz";
                          const meta = isQuiz ? quizMetaByContenu[cn.id] : null;

                          return (
                            <Grid item xs={12} md={6} key={cn?.id ?? uuidv4()}>
                              <Card
                                variant="outlined"
                                sx={{
                                  borderRadius: 2,
                                  "&:hover": { boxShadow: 3, borderColor: "#e0e0e0" },
                                  borderLeft: `4px solid ${isQuiz ? "#1976d2" : "#4caf50"}`,
                                }}
                              >
                                <CardContent
                                  sx={{
                                    py: 1.5,
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr auto",
                                    alignItems: "center",
                                    gap: 1.25,
                                  }}
                                >
                                  <Box sx={{ display: "grid", placeItems: "center" }}>
                                    {isQuiz ? (
                                      <QuizIcon sx={{ fontSize: 24, color: cn?.published ? "#1976d2" : "#b0bec5" }} />
                                    ) : (
                                      <InsertDriveFileIcon sx={{ fontSize: 24, color: cn?.published ? "#4caf50" : "#b0bec5" }} />
                                    )}
                                  </Box>

                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography noWrap sx={{ fontWeight: 600 }}>
                                      {cn?.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                      {isQuiz
                            ? `${t("seances.questions")}: ${meta?.questions?.length ?? t("seances.dash")} · ${t("seances.time")}: ${meta?.timeLimit && meta.timeLimit > 0 ? `${Math.floor(meta.timeLimit / 60)} ${t("seances.min")}` : t("seances.dash")}`
                            : (cn?.fileType || t("seances.file"))}
                                    </Typography>
                                  </Box>

                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <Tooltip title={cn?.published ? t("seances.unpublish") : t("seances.publish")}>
                                      <Switch
                                        size="small"
                                        checked={!!cn?.published}
                                        onChange={(e) => handlePublishContenu(cn?.id, e.target.checked)}
                                      />
                                    </Tooltip>

                                    {isQuiz ? (
                                      <Tooltip title={cn?.published ? t("seances.open") : t("seances.publishFirst")}>
                                        <span>
                                           <RoleGate roles={['formatuer',]}>

                                          <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<PlayArrowIcon />}
                                            disabled={!cn?.published}
                                            onClick={() => navigate(`/seances/${seanceId}/quiz/${cn.id}`)}
                                            sx={{
                                              borderRadius: 2,
                                              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                                              '&:hover': { 
                                                transform: 'translateY(-1px)', 
                                                boxShadow: '0 8px 20px rgba(25,118,210,0.4)' 
                                              }
                                            }}
                                          >
                                            {t("seances.open")}
                                          </Button>
                                          </RoleGate>
                                        </span>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip title={t("seances.open")}>
                                        <span>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<LaunchIcon />}
                                            disabled={!cn?.fileUrl}
                                            onClick={() => {
                                              if (!cn?.fileUrl) return;
                                              const url = cn.fileUrl.startsWith("http")
                                                ? cn.fileUrl
                                                : `${cn.fileUrl.startsWith("/") ? "" : "/"}${cn.fileUrl}`;
                                              window.open(url, "_blank");
                                            }}
                                            sx={{
                                              borderRadius: 2,
                                              border: "2px solid",
                                              borderImage: "linear-gradient(135deg, #1976d2, #42a5f5) 1",
                                              '&:hover': { 
                                                transform: 'translateY(-1px)',
                                                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                                                color: 'white'
                                              }
                                            }}
                                          >
                                            {t("seances.open")}
                                          </Button>
                                        </span>
                                      </Tooltip>
                                    )}
                                  </Stack>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    );
  };

  // --- loading skeleton ---
  if (!seance) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2, mt: 1 }} />
      </Paper>
    );
  }

  return (
    <Box p={2}>
      {/* Header with Return Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          🎯 {t('seances.animateSession')}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #7b1fa2, #ab47bc)',
            boxShadow: '0 6px 18px rgba(123,31,162,0.25)',
            transition: 'transform 0.15s ease',
            '&:hover': { 
              transform: 'translateY(-1px)', 
              boxShadow: '0 10px 24px rgba(123,31,162,0.35)' 
            }
          }}
        >
          📋 {t('seances.backToList')}
        </Button>
      </Box>

      {/* Meet */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Chip size="small" color="primary" label={t("seances.live")} />
            <Typography variant="subtitle1" fontWeight={700}>
              {seance.title || t("seances.jitsiMeeting")}
            </Typography>
          </Stack>
          {seance?.startTime && (
            <Typography variant="body2" color="text.secondary">
              {new Date(seance.startTime).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {jitsiError ? (
            <Box
              sx={{
                width: "100%",
                height: "68vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                border: "2px dashed #ccc",
              }}
            >
              <Typography variant="h6" color="error" mb={2}>
                🚫 {t("seances.jitsiError")}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {t("seances.jitsiErrorMessage")}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setJitsiError(false);
                  setJitsiLoading(true);
                }}
              >
                {t("seances.retry")}
              </Button>
            </Box>
          ) : (
            <>
              {jitsiLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <LinearProgress sx={{ width: 200, mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {t("seances.loadingJitsi")}
                    </Typography>
                  </Box>
                </Box>
              )}
              <iframe
                src={`${jitsiUrl}/${sanitizeRoomName(seance.title || t("seances.defaultRoom"))}`}
                allow="camera; microphone; fullscreen; display-capture; screen-wake-lock"
                style={{ width: "100%", height: "68vh", border: "none" }}
                title={t("seances.jitsiMeeting")}
                onLoad={() => setJitsiLoading(false)}
                onError={() => {
                  setJitsiLoading(false);
                  setJitsiError(true);
                }}
              />
            </>
          )}
        </Box>
      </Paper>

      {/* Programme controls */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip
            variant="outlined"
            label={`${t("seances.program")} : ${programDetails?.program?.title || ""}`}
            color="primary"
          />
          <ButtonGroup variant="outlined" size="small">
                         <RoleGate roles={['formateur',]}>

            <Button 
              startIcon={<ZoomInMapIcon />} 
              onClick={() => setShowContenus(!showContenus)}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(135deg, #0288d1, #29b6f6)",
                boxShadow: "0 4px 12px rgba(2, 136, 209, 0.3)",
                color: 'white',
                border: 'none',
                '&:hover': { 
                  transform: 'translateY(-1px)', 
                  boxShadow: '0 8px 20px rgba(2,136,209,0.4)' 
                }
              }}
            >
              {showContenus ? t("seances.hideHierarchy") : t("seances.showHierarchy")}
            </Button>
            </RoleGate>
             
<RoleGate roles={['formateur',]}>
            <Button
              startIcon={<FeedbackIcon />}
              onClick={handleToggleFeedbackVisibility}
              variant={feedbackVisibleToStudents ? "contained" : "outlined"}
              color="secondary"
              sx={{
                borderRadius: 2,
                background: feedbackVisibleToStudents 
                  ? "linear-gradient(135deg, #ff9800, #ffc107)"
                  : "transparent",
                boxShadow: feedbackVisibleToStudents 
                  ? "0 4px 12px rgba(255, 152, 0, 0.3)"
                  : "none",
                color: feedbackVisibleToStudents ? 'white' : '#ff9800',
                border: feedbackVisibleToStudents ? 'none' : '2px solid #ff9800',
                '&:hover': { 
                  transform: 'translateY(-1px)', 
                  boxShadow: feedbackVisibleToStudents 
                    ? '0 8px 20px rgba(255, 152, 0, 0.4)'
                    : '0 4px 12px rgba(255, 152, 0, 0.2)',
                  background: feedbackVisibleToStudents
                    ? "linear-gradient(135deg, #ff9800, #ffc107)"
                    : "rgba(255, 152, 0, 0.1)"
                }
              }}
            >
              {feedbackVisibleToStudents ? t("seances.hideFeedback") : t("seances.showFeedback")}
            </Button>
            </RoleGate>
             
          </ButtonGroup>
        </Stack>

        <Collapse in={showContenus}>
          <Divider sx={{ my: 2 }} />
          <RoleGate roles={['formateur',]} fallback={
            programVisibleToStudents ? renderProgramHierarchy() : (
              <Box sx={{ p: 3, textAlign: "center", bgcolor: "#f5f5f5", borderRadius: 2 }}>
                <Typography color="text.secondary">
                  🔒 {t("seances.programNotVisible")}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {t("seances.waitForFormateur")}
                </Typography>
              </Box>
            )
          }>
            {renderProgramHierarchy()}
          </RoleGate>
        </Collapse>
      </Paper>

      {/* Sidebar */}
      <Box display="flex" mt={2} gap={2}>
        {/* Sidebar Navigation */}
        <Paper
          elevation={0}
          sx={{
            minWidth: 280,
            maxWidth: 280,
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb", bgcolor: "#f8fafc" }}>
            <Typography variant="h6" fontWeight={700} color="primary">
              🎛️ {t("seances.sessionTools")}
            </Typography>
          </Box>
          
          <Box sx={{ p: 1 }}>
            <Stack spacing={0.5}>
              {/* Media & Resources */}
              <RoleGate roles={['formateur','etudiant']}>
                <Typography variant="overline" sx={{ px: 1, py: 0.5, fontWeight: 700, color: "text.secondary" }}>
                  📁 {t("seances.mediaResources")}
                </Typography>
                <Button
                  fullWidth
                  variant={tab === 0 ? "contained" : "text"}
                  startIcon={<DescriptionIcon />}
                  onClick={() => setTab(0)}
                  sx={{ justifyContent: "flex-start", textTransform: "none", py: 1 }}
                >
                  {t("seances.sessionAdditions")}
                </Button>
              </RoleGate>
              
              {/* Program Control */}
              <RoleGate roles={['formateur']}>
                <Typography variant="overline" sx={{ px: 1, py: 0.5, mt: 1, fontWeight: 700, color: "text.secondary" }}>
                  📚 {t("seances.programControl")}
                </Typography>
                <Button
                  fullWidth
                  variant={programVisibleToStudents ? "contained" : "outlined"}
                  color={programVisibleToStudents ? "success" : "primary"}
                  onClick={handleToggleProgramVisibility}
                  sx={{ justifyContent: "flex-start", textTransform: "none", py: 1, mb: 1 }}
                >
                  {programVisibleToStudents ? t("seances.programVisibleToStudents") : t("seances.showProgramToStudents")}
                </Button>
              </RoleGate>
              
              {/* Learning Tools */}
              <RoleGate roles={['formateur', 'etudiant']}>
                <Typography variant="overline" sx={{ px: 1, py: 0.5, mt: 1, fontWeight: 700, color: "text.secondary" }}>
                  🎓 {t("seances.learningTools")}
                </Typography>
                <Button
                  fullWidth
                  variant={tab === 1 ? "contained" : "text"}
                  startIcon={<QuizIcon />}
                  onClick={() => setTab(1)}
                  sx={{ justifyContent: "flex-start", textTransform: "none", py: 1 }}
                >
                  {t("seances.quizComing")}
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  startIcon={<InsertDriveFileIcon />}
                  onClick={() => navigate(`/whiteboard/${seanceId}`)}
                  sx={{ justifyContent: "flex-start", textTransform: "none", py: 1 }}
                >
                  {t("seances.whiteboard")}
                </Button>
              </RoleGate>
              
              {/* Collaboration */}
              <RoleGate roles={['formateur', ]}>
                <Typography variant="overline" sx={{ px: 1, py: 0.5, mt: 1, fontWeight: 700, color: "text.secondary" }}>
                  👥 {t("seances.collaboration")}
                </Typography>
                <Button
                  fullWidth
                  variant={tab === 3 ? "contained" : "text"}
                  startIcon={<GroupIcon />}
                  onClick={() => setTab(3)}
                  sx={{ justifyContent: "flex-start", textTransform: "none", py: 1 }}
                >
                  {t("seances.regroupement")}
                </Button>
              </RoleGate>
              
              {/* Feedback */}
              <RoleGate roles={['formateur', 'admin','etudiant']}>
                <Typography variant="overline" sx={{ px: 1, py: 0.5, mt: 1, fontWeight: 700, color: "text.secondary" }}>
                  💬 {t("seances.feedbackSection")}
                </Typography>
                <RoleGate roles={['formateur']}>
                <Button
                  fullWidth
                  variant={tab === 4 ? "contained" : "text"}
                  startIcon={<FeedbackIcon />}
                  onClick={() => setTab(4)}
                  sx={{ justifyContent: "flex-start", textTransform: "none", py: 1 }}
                >
                  {t("seances.feedbackFormateur")}
                </Button>
                </RoleGate>
                <RoleGate roles={['etudiant']}>
                <Button
                  fullWidth
                  variant={tab === 5 ? "contained" : "text"}
                  startIcon={<FeedbackIcon />}
                  onClick={() => setTab(5)}
                  sx={{ justifyContent: "flex-start", textTransform: "none", py: 1 }}
                >
                  {t("seances.feedbackEtudiant")}
                </Button>
                </RoleGate>

                {feedbackVisibleToStudents && (
                  <RoleGate roles={['etudiant']}>
                  <Button
                    fullWidth
                    variant={tab === 6 ? "contained" : "text"}
                    startIcon={<FeedbackIcon />}
                    onClick={() => setTab(6)}
                    sx={{ justifyContent: "flex-start", textTransform: "none", py: 1 }}
                  >
                    {t("seances.feedback")}
                  </Button>
                  </RoleGate>
                )}
                <RoleGate roles={['formateur', 'admin',]}>
                <Button
                  fullWidth
                  variant={tab === (feedbackVisibleToStudents ? 7 : 6) ? "contained" : "text"}
                  startIcon={<FeedbackIcon />}
                  onClick={() => setTab(feedbackVisibleToStudents ? 7 : 6)}
                  sx={{ justifyContent: "flex-start", textTransform: "none", py: 1 }}
                >
                  {t("seances.feedbackList")}
                </Button>
                </RoleGate>
              </RoleGate>
            </Stack>
          </Box>
        </Paper>

        {/* Main Content Area */}
        <Box flex={1}>
          {/* Tab 0: Media & Resources */}
          {tab === 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e5e7eb" }}>
              <Typography variant="h5" fontWeight={700} mb={3} color="primary">
                📁 {t("seances.mediaResources")}
              </Typography>
              
              {/* Images Section */}
              <Box mb={4}>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    🖼️ {t("seances.sessionImages")}
                  </Typography>
                  <RoleGate roles={['formateur']}>
                    <Tooltip title={t("seances.uploadImage")}>
                      <Button
                        variant="outlined"
                        size="small"
                        component="label"
                        startIcon={<AddPhotoAlternateIcon />}
                      >
                        {t("seances.addImage")}
                        <input type="file" accept="image/*" hidden onChange={handleAddImage} />
                      </Button>
                    </Tooltip>
                  </RoleGate>
                </Stack>

                {sessionImages.length ? (
                  <ImageList variant="masonry" cols={3} gap={12}>
                    {sessionImages.map((img) => (
                      <ImageListItem
                        key={img.id}
                        onClick={() => setZoomedImage(img.fileUrl)}
                        sx={{ 
                          cursor: "zoom-in",
                          borderRadius: 2,
                          overflow: "hidden",
                          "&:hover": { transform: "scale(1.02)", transition: "transform 0.2s" }
                        }}
                      >
                        <img
                          src={img.fileUrl}
                          alt=""
                          style={{ width: "100%", borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      border: "2px dashed #e0e0e0",
                      borderRadius: 2,
                      textAlign: "center",
                      bgcolor: "#fafafa"
                    }}
                  >
                    <Typography color="text.secondary">
                      {t("seances.noImages")}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Videos Section */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    🎥 {t("seances.sessionVideos")}
                  </Typography>
                  <RoleGate roles={['formateur']}>
                    <Tooltip title={t("seances.uploadVideo")}>
                      <Button
                        variant="outlined"
                        size="small"
                        component="label"
                        startIcon={<MovieIcon />}
                      >
                        {t("seances.addVideo")}
                        <input type="file" accept="video/*" hidden onChange={handleAddVideo} />
                      </Button>
                    </Tooltip>
                  </RoleGate>
                </Stack>

                {sessionVideos.length ? (
                  <Grid container spacing={2}>
                    {sessionVideos.map((vid) => (
                      <Grid item xs={12} sm={6} md={4} key={vid.id}>
                        <Paper
                          variant="outlined"
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 2,
                            "&:hover": { boxShadow: 3 }
                          }}
                        >
                          <ReactPlayer 
                            url={vid.fileUrl} 
                            controls 
                            width="100%" 
                            height={140}
                            style={{ borderRadius: 8 }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      border: "2px dashed #e0e0e0",
                      borderRadius: 2,
                      textAlign: "center",
                      bgcolor: "#fafafa"
                    }}
                  >
                    <Typography color="text.secondary">
                      {t("seances.noVideos")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          )}

          {/* Tab 1: Learning Tools */}
          {tab === 1 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e5e7eb" }}>
              <Typography variant="h5" fontWeight={700} mb={3} color="primary">
                🎓 {t("seances.learningTools")}
              </Typography>
              
              <Box mb={3}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  🧪 {t("seances.quizComing")}
                </Typography>
                <QuizList sessionId={seance?.session2?.id} />
              </Box>
              
              
              {getSessionQuizzes().length === 0 ? (
                <Typography color="text.secondary">{t("seances.noQuizzesLinked")}</Typography>
                
              ) : (
                <Stack spacing={1.25}>
                  {getSessionQuizzes().map((q) => {
                    const meta = quizMetaByContenu[q.contenuId];
                    const qCount = meta?.questions?.length ?? t("seances.dash");
                    const timeStr = meta?.timeLimit && meta.timeLimit > 0 ? `${Math.floor(meta.timeLimit / 60)} ${t("seances.min")}` : t("seances.dash");

                    return (
                      <Paper
                        key={q.contenuId}
                        variant="outlined"
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          display: "grid",
                          gridTemplateColumns: "1fr auto auto auto",
                          alignItems: "center",
                          gap: 1,
                          "&:hover": { boxShadow: 2, borderColor: "#e0e0e0" },
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <QuizIcon />
                          <Box>
                            <Typography fontWeight={700}>{q.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t("seances.course")}: {q.courseTitle || t("seances.dash")}
                            </Typography>
                          </Box>
                        </Stack>

                        <Chip
                          label={q.published ? t("seances.published") : t("seances.draft")}
                          color={q.published ? "success" : "default"}
                          size="small"
                          variant={q.published ? "filled" : "outlined"}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {t("seances.questions")}: <b>{qCount}</b> · {t("seances.time")}: <b>{timeStr}</b>
                        </Typography>

                        <Tooltip title={q.published ? t("seances.open") : t("seances.publishFirst")}>
                          <span>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PlayArrowIcon />}
                              disabled={!q.published}
                              onClick={() => navigate(`/seances/${seanceId}/quiz/${q.contenuId}`)}
                              sx={{
                                borderRadius: 2,
                                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                                '&:hover': { 
                                  transform: 'translateY(-1px)', 
                                  boxShadow: '0 8px 20px rgba(25,118,210,0.4)' 
                                }
                              }}
                            >
                              {t("seances.open")}
                            </Button>
                          </span>
                        </Tooltip>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          )}

          {/* Tab 2: whiteboard (navigates on click) */}
          {tab === 2 && <Box />}

          {/* Tab 3: Regroupement */}
          {tab === 3 && <Regroupement />}

          {/* Tab 4: Feedback Formateur */}
          {tab === 4 && (
            <Box>
              <Typography variant="h6" mb={2}>
                {t("seances.feedbackFormateur")}
              </Typography>
              <FeedbackFormateur seanceId={seanceId} />
            </Box>
          )}

          {/* Tab 5: Feedback Étudiant */}
          {tab === 5 && (
            <Box>
              <Typography variant="h6" mb={2}>{t("seances.feedbackEtudiant")}</Typography>
              <FeedbackEtudiant seanceId={seanceId} />
            </Box>
          )}

          {/* Dynamic Feedback form (only if visible and student role) */}
          {feedbackVisibleToStudents && tab === 6 && (
            <RoleGate roles={['etudiant']}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Typography variant="h6">📝 {t("seances.sessionFeedback")}</Typography>
                </Stack>
                <AddSeanceFeedback seanceId={seanceId} onFeedbackSubmitted={reloadFeedbacks} />
              </Box>
            </RoleGate>
          )}

          {/* Feedback list (last tab) */}
          {tab === (feedbackVisibleToStudents ? 7 : 6) && <SeanceFeedbackList />}
        </Box>
      </Box>

      {/* Feedback dialog (kept for future use; currently not invoked) */}
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FeedbackIcon color="primary" />
            <Box>
              {t("seances.feedbackFrom")} <b>{selectedFeedback?.studentName}</b>
              <Typography variant="body2" color="text.secondary">
                {selectedFeedback?.studentEmail}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 500 }}>
          {/* body omitted intentionally */}
        </DialogContent>
      </Dialog>

      {/* Image zoom */}
      {zoomedImage && (
        <Box
          onClick={() => setZoomedImage(null)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 2000,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
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


