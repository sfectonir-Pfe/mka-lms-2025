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
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
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
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

const AnimerSeanceView = () => {
  const { id: seanceId } = useParams();
  const [seance, setSeance] = useState(null);
  const [programDetails, setProgramDetails] = useState(null);
  const [tab, setTab] = useState(0);
  const [showContenus, setShowContenus] = useState(true);
  const [sessionImages, setSessionImages] = useState([]);
  const [sessionVideos, setSessionVideos] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

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

  const handleTabChange = (e, newValue) => setTab(newValue);

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const media = await uploadMedia(file, "IMAGE");
      setSessionImages((prev) => [...prev, media]);
    } catch {
      alert("Erreur upload image");
    }
  };

  const handleAddVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const media = await uploadMedia(file, "VIDEO");
      setSessionVideos((prev) => [...prev, media]);
    } catch {
      alert("Erreur upload vidéo");
    }
  };

  const handleSaveSession = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
    alert("Contenu spécifique de la séance sauvegardé !");
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
      alert("Erreur lors du changement de statut.");
    }
  };

  const renderProgramHierarchy = () => {
    if (!programDetails) return <Typography>Chargement du programme...</Typography>;
    return (
      <Box>
        <Typography variant="h6" mb={1}>
          📘 <strong>Programme : {programDetails.program.title}</strong>
        </Typography>
        <Box ml={2} mt={2}>
          {programDetails.session2Modules.map((mod) => (
            <Box key={mod.id} mt={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#1976d2" }}>
                📦 {mod.module.title}
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
                        {expandedCourses[course.id] ? "Masquer" : "Afficher"}
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
                            {ct.contenu?.published ? "Dépublier" : "Publier"}
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

  if (!seance) return <Typography>Chargement de la séance...</Typography>;

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
          title="Jitsi Meeting"
        />
      </Paper>

      {/* Programme */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip label={`Programme : ${programDetails?.program?.title || ""}`} color="info" />
          <Button
            startIcon={<ZoomInMapIcon />}
            onClick={() => setShowContenus(!showContenus)}
            variant="outlined"
            size="small"
          >
            {showContenus ? "Masquer la hiérarchie" : "Afficher la hiérarchie"}
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
          <Tab icon={<DescriptionIcon />} iconPosition="start" label="Ajouts séance" />
          <Tab icon={<QuizIcon />} iconPosition="start" label="Quiz (à venir)" />
          <Tab icon={<InsertDriveFileIcon />} iconPosition="start" label="Whiteboard" onClick={() => navigate(`/whiteboard/${seanceId}`)} />
        </Tabs>
        <Box flex={1} pl={3}>
          {/* Onglet 1 */}
          {tab === 0 && (
            <Box>
              <Typography variant="h6" mt={1}>
                Images propres à la séance
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
                Vidéos propres à la séance
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
            </Box>
          )}

          {/* Onglet 2 */}
          {tab === 1 && (
            <Typography color="text.secondary">🧪 La fonctionnalité "Quiz"</Typography>
          )}
        </Box>
      </Box>
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
