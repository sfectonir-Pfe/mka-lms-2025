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

const AnimerSeanceView = () => {
  const { t } = useTranslation("seances");
  const { id: seanceId } = useParams();
  const navigate = useNavigate();

  // --- state ---
  const [seance, setSeance] = useState(null);
  const [programDetails, setProgramDetails] = useState(null);
  const [tab, setTab] = useState(0);
  const [showContenus, setShowContenus] = useState(true);
  const [sessionImages, setSessionImages] = useState([]);
  const [sessionVideos, setSessionVideos] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [showFeedbackTab, setShowFeedbackTab] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [quizMetaByContenu, setQuizMetaByContenu] = useState({}); // {contenuId: {timeLimit, questions: []}}

  // --- helpers ---
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
        console.error("❌ Erreur chargement séance :", err);
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
      alert(t("uploadImageError"));
    }
  };

  const handleAddVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const media = await uploadMedia(file, "VIDEO");
      setSessionVideos((prev) => [...prev, media]);
    } catch {
      alert(t("uploadVideoError"));
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
      alert(t("statusChangeError"));
    }
  };

  // --- UI: hierarchy (accordion, cards) ---
  const renderProgramHierarchy = () => {
    if (!programDetails) return <Typography>{t("loadingProgram")}</Typography>;

    return (
      <Box>
        <Typography variant="h6" mb={1}>
          📘 <strong>{t("program")} : {programDetails.program.title}</strong>
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
                      bgcolor: "#fafafa",
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
                                        ? `Questions: ${meta?.questions?.length ?? "—"} · Time: ${meta?.timeLimit ? `${meta.timeLimit} min` : "—"}`
                                        : (cn?.fileType || "File")}
                                    </Typography>
                                  </Box>

                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <Tooltip title={cn?.published ? t("unpublish") : t("publish")}>
                                      <Switch
                                        size="small"
                                        checked={!!cn?.published}
                                        onChange={(e) => handlePublishContenu(cn?.id, e.target.checked)}
                                      />
                                    </Tooltip>

                                    {isQuiz ? (
                                      <Tooltip title={cn?.published ? t("open") : t("publishFirst")}>
                                        <span>
                                          <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<PlayArrowIcon />}
                                            disabled={!cn?.published}
                                            onClick={() => navigate(`/seances/${seanceId}/quiz/${cn.id}`)}
                                          >
                                            {t("open")}
                                          </Button>
                                        </span>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip title={t("open")}>
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
                                          >
                                            {t("open")}
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
      {/* Meet */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Chip size="small" color="primary" label="LIVE" />
            <Typography variant="subtitle1" fontWeight={700}>
              {seance.title || t("jitsiMeeting")}
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
            background: "linear-gradient(180deg,#fafafa, #f3f4f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <iframe
            src={`https://localhost:8443/${seance.title || "default-room"}`}
            allow="camera; microphone; fullscreen; display-capture"
            style={{ width: "100%", height: "68vh", border: "none" }}
            title={t("jitsiMeeting")}
          />
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
          bgcolor: "#fff",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip
            variant="outlined"
            label={`${t("program")} : ${programDetails?.program?.title || ""}`}
            color="primary"
          />
          <ButtonGroup variant="outlined" size="small">
            <Button startIcon={<ZoomInMapIcon />} onClick={() => setShowContenus(!showContenus)}>
              {showContenus ? t("hideHierarchy") : t("showHierarchy")}
            </Button>
            <Button
              startIcon={<FeedbackIcon />}
              onClick={() => setShowFeedbackTab((v) => !v)}
              variant={showFeedbackTab ? "outlined" : "contained"}
              color="secondary"
            >
              {showFeedbackTab ? t("hideFeedback") : t("showFeedback")}
            </Button>
          </ButtonGroup>
        </Stack>

        <Collapse in={showContenus}>
          <Divider sx={{ my: 2 }} />
          {renderProgramHierarchy()}
        </Collapse>
      </Paper>

      {/* Tabs */}
      <Box display="flex" mt={2}>
        <Tabs
          orientation="vertical"
          value={tab}
          onChange={handleTabChange}
          sx={{
            minWidth: 220,
            borderRight: "1px solid #e5e7eb",
            "& .MuiTab-root": {
              alignItems: "flex-start",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1,
              mb: 0.5,
              minHeight: 44,
            },
            "& .Mui-selected": { bgcolor: "#eef2ff" },
            "& .MuiTabs-indicator": { left: 0, width: 3, bgcolor: "#6366f1" },
          }}
        >
          <Tab icon={<DescriptionIcon />} iconPosition="start" label={t("sessionAdditions")} />
          <Tab icon={<QuizIcon />} iconPosition="start" label={t("quizComing")} />
          <Tab
            icon={<InsertDriveFileIcon />}
            iconPosition="start"
            label={t("whiteboard")}
            onClick={() => navigate(`/whiteboard/${seanceId}`)}
          />
          <Tab icon={<GroupIcon />} iconPosition="start" label="Regroupement" />
          <Tab icon={<FeedbackIcon />} iconPosition="start" label={t("feedbackFormateur") || "Feedback Formateur"} />
          <Tab icon={<FeedbackIcon />} iconPosition="start" label="Feedback Étudiant" />
          {showFeedbackTab && <Tab icon={<FeedbackIcon />} iconPosition="start" label={t("feedback")} />}
          <Tab icon={<FeedbackIcon />} iconPosition="start" label={t("feedbackList")} />
        </Tabs>

        <Box flex={1} pl={3}>
          {/* Tab 0: images/videos */}
          {tab === 0 && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mt={0.5} mb={1}>
                <Typography variant="h6">{t("sessionImages")}</Typography>
                <Tooltip title={t("uploadImage") || "Upload image"}>
                  <IconButton color="primary" component="label" size="small">
                    <AddPhotoAlternateIcon />
                    <input type="file" accept="image/*" hidden onChange={handleAddImage} />
                  </IconButton>
                </Tooltip>
              </Stack>

              {sessionImages.length ? (
                <ImageList variant="masonry" cols={4} gap={8}>
                  {sessionImages.map((img) => (
                    <ImageListItem
                      key={img.id}
                      onClick={() => setZoomedImage(img.fileUrl)}
                      sx={{ cursor: "zoom-in" }}
                    >
                      <img
                        src={img.fileUrl}
                        alt=""
                        style={{ width: "100%", borderRadius: 8, boxShadow: "0 1px 6px #bbb" }}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {t("noImages") || "No images yet."}
                </Typography>
              )}

              <Stack direction="row" alignItems="center" spacing={1} mt={3} mb={1}>
                <Typography variant="h6">{t("sessionVideos")}</Typography>
                <Tooltip title={t("uploadVideo") || "Upload video"}>
                  <IconButton color="primary" component="label" size="small">
                    <MovieIcon />
                    <input type="file" accept="video/*" hidden onChange={handleAddVideo} />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sessionVideos.length ? (
                  sessionVideos.map((vid) => (
                    <Paper
                      key={vid.id}
                      variant="outlined"
                      sx={{ width: 220, p: 1, borderRadius: 2, bgcolor: "#fafafa" }}
                    >
                      <ReactPlayer url={vid.fileUrl} controls width="100%" height={120} />
                    </Paper>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    {t("noVideos") || "No videos yet."}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {/* Tab 1: quizzes */}
          {tab === 1 && (
            <Box>
              <Typography variant="h6" mb={2}>🧪 {t("quizComing") || "Quizzes (session)"}</Typography>
              <QuizList sessionId={seance?.session2?.id} />
              
              
              {getSessionQuizzes().length === 0 ? (
                <Typography color="text.secondary">No quizzes linked to this session yet.</Typography>
                
              ) : (
                <Stack spacing={1.25}>
                  {getSessionQuizzes().map((q) => {
                    const meta = quizMetaByContenu[q.contenuId];
                    const qCount = meta?.questions?.length ?? "—";
                    const timeStr = meta?.timeLimit ? `${meta.timeLimit} min` : "—";

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
                              {t("course") || "Course"}: {q.courseTitle || "—"}
                            </Typography>
                          </Box>
                        </Stack>

                        <Chip
                          label={q.published ? "Published" : "Draft"}
                          color={q.published ? "success" : "default"}
                          size="small"
                          variant={q.published ? "filled" : "outlined"}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {t("questions") || "Questions"}: <b>{qCount}</b> · {t("time") || "Time"}: <b>{timeStr}</b>
                        </Typography>

                        <Tooltip title={q.published ? t("open") : t("publishFirst")}>
                          <span>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PlayArrowIcon />}
                              disabled={!q.published}
                              onClick={() => navigate(`/seances/${seanceId}/quiz/${q.contenuId}`)}
                            >
                              {t("open")}
                            </Button>
                          </span>
                        </Tooltip>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Box>
          )}

          {/* Tab 2: whiteboard (navigates on click) */}
          {tab === 2 && <Box />}

          {/* Tab 3: Regroupement */}
          {tab === 3 && <Regroupement />}

          {/* Tab 4: Feedback Formateur */}
          {tab === 4 && (
            <Box>
              <Typography variant="h6" mb={2}>
                {t("feedbackFormateur") || "Feedback Formateur"}
              </Typography>
              <FeedbackFormateur seanceId={seanceId} />
            </Box>
          )}

          {/* Tab 5: Feedback Étudiant */}
          {tab === 5 && (
            <Box>
              <Typography variant="h6" mb={2}>Feedback Étudiant</Typography>
              <FeedbackEtudiant seanceId={seanceId} />
            </Box>
          )}

          {/* Dynamic Feedback form (only if toggled) */}
          {showFeedbackTab && tab === 6 && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Typography variant="h6">📝 {t("sessionFeedback")}</Typography>
              </Stack>
              <AddSeanceFeedback seanceId={seanceId} onFeedbackSubmitted={reloadFeedbacks} />
            </Box>
          )}

          {/* Feedback list (last tab) */}
          {tab === (showFeedbackTab ? 7 : 6) && <SeanceFeedbackList />}
        </Box>
      </Box>

      {/* Feedback dialog (kept for future use; currently not invoked) */}
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FeedbackIcon color="primary" />
            <Box>
              {t("feedbackFrom")} <b>{selectedFeedback?.studentName}</b>
              <Typography variant="body2" color="text.secondary">
                {selectedFeedback?.studentEmail}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#f8fafc", maxHeight: 500 }}>
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
            background: "rgba(0,0,0,0.88)",
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
