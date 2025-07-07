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
import {
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  Chat as ChatIcon,
  InsertDriveFile as InsertDriveFileIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Movie as MovieIcon,
  Save as SaveIcon,
  ZoomInMap as ZoomInMapIcon,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { Avatar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";











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
  const [sessionNotes, setSessionNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // --- CHAT STATE & SOCKET ---
  const [chatMessages, setChatMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const chatBottomRef = useRef();
  const [socket, setSocket] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")); // Or wherever your user is stored
  const navigate = useNavigate();



  // Init socket.io
 ;

  // Load old messages (optional)
  useEffect(() => {
    if (!seanceId) return;
    axios.get(`http://localhost:8000/chat-messages/${seanceId}`)
      .then((res) => setChatMessages(res.data))
      .catch(() => setChatMessages([]));
  }, [seanceId]);

  // Always scroll to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleEmoji = (e) => {
    setNewMsg((prev) => prev + e.emoji);
    setShowEmoji(false);
  };

  const handleChatSend = async () => {
    if (!socket) return;
    if (newFile) {
      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("seanceId", seanceId);
      try {
        const res = await axios.post("http://localhost:8000/chat-messages/upload-chat", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Sending chat message:", {
          content: newMsg,
          senderId: user.id,
          // ...
        });


        socket.emit("sendMessage", {
          content: res.data.fileUrl,
          type: res.data.fileType || "file",
          seanceId: Number(seanceId),
          senderId: user.id,
        });

        setNewFile(null);
      } catch {
        alert("Erreur upload fichier");
      }
    } else if (newMsg.trim()) {
      socket.emit("sendMessage", {
        content: newMsg,
        type: "text",
        seanceId: Number(seanceId),
        senderId: user.id,
      });

      setNewMsg("");
    }
  };
  // Delete a single message
  const handleDeleteMsg = async (msgId) => {
  try {
    await axios.delete(`http://localhost:8000/chat-messages/${msgId}`, {
      data: { userId: user.id }, // user.id must be available in your component
    });
    setChatMessages((prev) => prev.filter((m) => m.id !== msgId));
  } catch (err) {
    alert("Suppression impossible (vous n'êtes pas l'auteur du message)");
  }
};


  // Delete all messages in this séance
  
useEffect(() => {
  const s = io("http://localhost:8000");
  setSocket(s);
  s.emit("joinRoom", { seanceId: Number(seanceId) });

  s.on("newMessage", (msg) => {
    setChatMessages((prev) => [...prev, msg]);
  });

  // 👇 Listen for delete event from backend
  s.on("deleteMessage", (payload) => {
    setChatMessages((prev) => prev.filter((m) => m.id !== payload.id));
  });

  return () => {
    s.disconnect();
  };
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
          src={`https://meet.jitsi.local:8443/${seance.title || "default-room"}`}
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
          <Tab icon={<ChatIcon />} iconPosition="start" label="Notes / Chat" />
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

              <Typography variant="h6" mt={2}>Notes propres à la séance</Typography>
              <TextField
                fullWidth multiline minRows={3}
                placeholder="Prends tes notes ici..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                sx={{ my: 1 }}
              />
              <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSaveSession} disabled={saving}>
                {saving ? "Sauvegarde..." : "Sauvegarder la séance"}
              </Button>
            </Box>
          )}

          {/* Onglet 2 */}
          {tab === 1 && (
            <Typography color="text.secondary">🧪 La fonctionnalité "Quiz"</Typography>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="h6" mb={1}>💬 Chat de séance</Typography>
              <Paper sx={{
                p: 2, mb: 2, maxHeight: 320, minHeight: 150, overflowY: "auto",
                border: "1px solid #ccc", borderRadius: 2, background: "#f9f9f9"
              }}>
                {/* <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={handleClearAll}
                >
                  Supprimer tous les messages
                </Button> */}

                <Stack spacing={1}>
                  {chatMessages.map((msg, i) => (

                    <Paper
                      key={i}
                      sx={{
                        p: 1,
                        background: "#fff",
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      {/* Avatar (optional) */}
                      {msg.sender?.profilePic
                        ? (
                          <img
                            src={
                              msg.sender?.profilePic?.startsWith('http')
                                ? msg.sender.profilePic
                                : `http://localhost:8000${msg.sender?.profilePic || '/profile-pics/default.png'}`
                            }
                            alt={msg.sender?.name}
                            style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                          />

                        ) : (
                          <Avatar sx={{ width: 32, height: 32, marginRight: 1 }}>
                            {msg.sender?.name?.[0]?.toUpperCase() || "?"}
                          </Avatar>
                        )
                      }

                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary">
                          {msg.sender?.name || "Anonyme"}
                          {msg.sender?.role && (
                            <span style={{ color: "#888", fontWeight: 400, marginLeft: 8, fontSize: 13 }}>
                              · {msg.sender.role}
                            </span>
                          )}
                          {msg.createdAt && (
                            <span style={{ color: "#888", fontSize: 11, marginLeft: 8 }}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}{msg.sender?.id === user.id && (
  <IconButton size="small" onClick={() => handleDeleteMsg(msg.id)} color="error">
    <DeleteIcon fontSize="small" />
  </IconButton>
)}


                        </Typography>

                        {/* Message Content */}
                        {msg.type === "text" && <span>{msg.content}</span>}
                        {msg.type === "image" && (
                          <img src={msg.content} alt="img" style={{ maxWidth: 180, borderRadius: 6, marginTop: 4 }} />
                        )}
                        {msg.type === "audio" && (
                          <audio controls src={msg.content} style={{ maxWidth: 180, marginTop: 4 }} />
                        )}
                        {msg.type === "video" && (
                          <video controls src={msg.content} style={{ maxWidth: 180, borderRadius: 6, marginTop: 4 }} />
                        )}
                        {msg.type === "file" && (
                          <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 4 }}>
                            📎 {msg.content.split("/").pop()}
                          </a>
                        )}
                      </Box>
                    </Paper>
                  ))}
                  <div ref={chatBottomRef} />
                </Stack>
              </Paper>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  value={newMsg}
                  size="small"
                  placeholder="Ecris un message…"
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                  sx={{ background: "#fff", borderRadius: 1 }}
                />
                <IconButton onClick={() => setShowEmoji((v) => !v)}>
                  <span role="img" aria-label="emoji">😀</span>
                </IconButton>
                <IconButton component="label" color={newFile ? "success" : "primary"}>
                  <AddPhotoAlternateIcon />
                  <input
                    hidden
                    type="file"
                    accept="image/*,video/*,audio/*,application/pdf"
                    onChange={(e) => setNewFile(e.target.files[0])}
                  />
                </IconButton>
                <Button onClick={handleChatSend} variant="contained" disabled={!newMsg.trim() && !newFile}>
                  Envoyer
                </Button>
              </Stack>
              {showEmoji && (
                <Box sx={{ position: "absolute", zIndex: 11 }}>
                  <EmojiPicker onEmojiClick={handleEmoji} autoFocusSearch={false} />
                </Box>
              )}
              {newFile && (
                <Typography color="primary" fontSize={12} ml={1} mt={0.5}>
                  Fichier prêt à envoyer: {newFile.name}
                </Typography>
              )}
            </Box>
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
