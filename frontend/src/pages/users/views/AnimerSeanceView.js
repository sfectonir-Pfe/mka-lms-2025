import React, { useEffect, useState, useRef } from "react";
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
} from "@mui/material";
import axios from "axios";
import ReactPlayer from "react-player";
import DescriptionIcon from "@mui/icons-material/Description";
import QuizIcon from "@mui/icons-material/Quiz";
import ChatIcon from "@mui/icons-material/Chat";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import MovieIcon from "@mui/icons-material/Movie";
import SaveIcon from "@mui/icons-material/Save";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import { v4 as uuidv4 } from "uuid";

const AnimerSeanceView = () => {
  const { id: seanceId } = useParams();
  const [seance, setSeance] = useState(null);
  const [programDetails, setProgramDetails] = useState(null); // NEW
  const [tab, setTab] = useState(0);
  const [showContenus, setShowContenus] = useState(true);
  const [sessionImages, setSessionImages] = useState([]);
  const [sessionVideos, setSessionVideos] = useState([]);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});



  // Ajouts spécifiques à la séance (local state)

  const [sessionNotes, setSessionNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Chat placeholder
  const [chatMessages, setChatMessages] = useState([]);
  const chatInput = useRef();

  const toggleCourseVisibility = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };


  useEffect(() => {
    const fetchSeance = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/seance-formateur/${seanceId}`);
        const base = res.data;
        // Récupérer les détails complets du buildProgram (modules/cours/contenus)
        const detailRes = await axios.get(
          `http://localhost:8000/seance-formateur/details/${base.buildProgramId}`
        );
        setSeance(base);
        setProgramDetails(detailRes.data); // NEW
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

    // Envoie POST vers backend (n’oublie pas le /media après l’ID !)
    const res = await axios.post(
      `http://localhost:8000/seance-formateur/${seanceId}/upload-media`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  };


  const handleTabChange = (e, newValue) => setTab(newValue);

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const media = await uploadMedia(file, "IMAGE");
      setSessionImages((prev) => [...prev, media]);
    } catch (err) {
      alert("Erreur upload image");
    }
  };


  const handleAddVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const media = await uploadMedia(file, "VIDEO");
      setSessionVideos((prev) => [...prev, media]);
    } catch (err) {
      alert("Erreur upload vidéo");
    }
  };


  const handleSaveSession = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000); // Fake wait
    alert("Contenu spécifique de la séance sauvegardé !");
  };

  const handleChatSend = () => {
    if (chatInput.current.value) {
      setChatMessages((prev) => [...prev, { id: uuidv4(), text: chatInput.current.value }]);
      chatInput.current.value = "";
    }
  };
  const handlePublishContenu = async (contenuId) => {
    if (!contenuId) return alert("contenuId is undefined!");
    try {
      const res = await axios.patch(`http://localhost:8000/contenus/${contenuId}/publish`, {
        published: true // Or toggle depending on your backend logic
      });
      // Refresh UI
      const detailRes = await axios.get(
        `http://localhost:8000/seance-formateur/details/${seance.buildProgramId}`
      );
      setProgramDetails(detailRes.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du changement de statut.");
    }
  };




  const renderFilePreview = (contenu) => {
    const { fileType, fileUrl, title } = contenu;
    switch (fileType) {
      case "IMAGE":
        return <img src={fileUrl} alt={title} style={{ maxWidth: "100%" }} />;
      case "VIDEO":
        return <ReactPlayer url={fileUrl} controls width="100%" />;
      case "PDF":
      case "WORD":
      case "EXCEL":
      case "PPT":
        return (
          <Chip
            icon={<InsertDriveFileIcon />}
            label={`Ouvrir ${title}`}
            color="primary"
            component="a"
            href={fileUrl}
            target="_blank"
            clickable
          />
        );
      default:
        return <Typography>Type de fichier non pris en charge.</Typography>;
    }
  };

  const renderProgramHierarchy = () => {
    if (!programDetails) return <Typography>Chargement du programme...</Typography>;

    return (
      <Box>
        <Typography variant="h6" mb={1}>
          📘 <strong>Programme : {programDetails.program.name}</strong>
        </Typography>

        <Box ml={2} mt={2}>
          {programDetails.modules.map((mod) => (
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
                        {expandedCourses[course.id] ? "Masquer" : "Afficher"}
                      </Button>
                    </Stack>

                    <Collapse in={expandedCourses[course.id]}>
                     
                       {course.contenus.map((ct) => (
  <Box key={ct.contenu?.id ?? uuidv4()} // ← this avoids key warning

                          display="flex"
                          alignItems="center"
                          gap={1}
                          flexWrap="wrap"
                          mt={1}
                        >
                          <Chip
                            icon={
                              <InsertDriveFileIcon
                                sx={{
                                  fontSize: 22,
                                  color: ct.contenu.published ? "#4caf50" : "#b0bec5",
                                }}
                              />
                            }
                            label={ct.contenu.title}
                            variant="outlined"
                            onClick={() =>
                              ct.contenu?.fileUrl && window.open(ct.contenu.fileUrl, "_blank")
                            }
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
      {/* ----------- ZOOM PLACEHOLDER ----------- */}
      <Paper sx={{ mb: 3, p: 3, background: "#f8fafc", minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #bcbcbc" }}>
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            🔗 Espace visioconférence (Zoom)
          </Typography>
        </Box>
      </Paper>

      {/* ----------- PROGRAMME + MASQUER/CONTENU ----------- */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Chip label={`Programme : ${programDetails ? programDetails.program.name : ""}`} color="info" />
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

      {/* ----------- RESTE : ONGLET VERTICAL ----------- */}
      <Box display="flex" mt={2}>
        <Tabs
          orientation="vertical"
          value={tab}
          onChange={handleTabChange}
          sx={{ borderRight: 1, borderColor: "divider", minWidth: 180 }}
        >
          <Tab icon={<DescriptionIcon />} iconPosition="start" label="Ajouts séance" />
          <Tab icon={<QuizIcon />} iconPosition="start" label="Quiz (à venir)" />
          <Tab icon={<ChatIcon />} iconPosition="start" label="Notes / Chat" />
        </Tabs>

        <Box flex={1} pl={3}>
          {tab === 0 && (
            <Box>
              {/* Images séance */}
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


              {/* Vidéos séance */}
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

              {/* Notes séance */}
              <Typography variant="h6" mt={2}>
                Notes propres à la séance
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="Prends tes notes ici..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                sx={{ my: 1 }}
              />
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={handleSaveSession}
                disabled={saving}
              >
                {saving ? "Sauvegarde..." : "Sauvegarder la séance"}
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Typography color="text.secondary">
              🧪 La fonctionnalité "Quiz"
            </Typography>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="h6">Notes & Chat de séance</Typography>
              <Stack spacing={1} mb={2}>
                {chatMessages.map((msg) => (
                  <Paper key={msg.id} sx={{ p: 1, background: "#f5f5f5" }}>
                    {msg.text}
                  </Paper>
                ))}
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField
                  inputRef={chatInput}
                  fullWidth
                  size="small"
                  placeholder="Ecris un message..."
                  onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                />
                <Button onClick={handleChatSend} variant="contained">
                  Envoyer
                </Button>
              </Stack>
            </Box>
          )}{zoomedImage && (
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
                cursor: "zoom-out"
              }}
            >
              <img
                src={zoomedImage}
                alt=""
                style={{
                  maxWidth: "92vw",
                  maxHeight: "92vh",
                  borderRadius: 12,
                  boxShadow: "0 2px 24px #111"
                }}
                onClick={e => e.stopPropagation()} // Pour ne pas fermer si on clique sur l'image
              />
            </Box>
          )}

        </Box>
      </Box>
    </Box>
  );
};

export default AnimerSeanceView;
