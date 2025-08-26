import React, { useEffect, useState, useRef } from "react";
import {
  Box, Paper, Typography, Stack, TextField, IconButton, Button, Avatar,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";
import api from "../../api/axiosInstance";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:8000";

export default function UnifiedSessionChatPopup({ user }) {
  // --- NEW: Program chat state ---
  const programSocketRef = useRef(null);
  const [programs, setPrograms] = useState([]);        // [{id, name}]
  const [programId, setProgramId] = useState(null);
  const [programChatMessages, setProgramChatMessages] = useState([]);

  // Existing
  const [generalChatMessages, setGeneralChatMessages] = useState([]);
  const generalSocketRef = useRef(null);

  // Tabs: "program" | "session" | "seance" | "general"
  const [selectedTab, setSelectedTab] = useState("session");

  // Session2 data
  const [session2s, setSession2s] = useState([]);
  const [session2Id, setSession2Id] = useState(null);

  // Seance data
  const [seances, setSeances] = useState([]);
  const [seanceId, setSeanceId] = useState(null);

  // Chat states
  const [sessionChatMessages, setSessionChatMessages] = useState([]);
  const [seanceChatMessages, setSeanceChatMessages] = useState([]);

  const [newMsg, setNewMsg] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const chatBottomRef = useRef();
  const fileInputRef = useRef();
  const sessionSocketRef = useRef(null);
  const seanceSocketRef = useRef(null);

  // UI popup
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [programChatMessages, sessionChatMessages, seanceChatMessages, generalChatMessages, selectedTab, open]);

  // --- General chat socket (unchanged) ---
  useEffect(() => {
    if (generalSocketRef.current) generalSocketRef.current.disconnect();
    const s = io(`${SOCKET_URL}/general-chat`, { 
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    generalSocketRef.current = s;
    s.emit("fetchGeneralMessages");
    s.on("generalMessages", msgs => setGeneralChatMessages(msgs));
    s.on("newGeneralMessage", msg => setGeneralChatMessages(prev => [...prev, msg]));
    s.on("deleteGeneralMessage", ({ id }) => setGeneralChatMessages(prev => prev.filter(m => m.id !== id)));
    return () => s.disconnect();
  }, []);

  // --- Fetch session2s for the user (we’ll also derive programs from sessions) ---
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const res = await api.get(`/users/${user.id}/sessions2`);
      const data = res.data;

      // Normalize into [{id, name, programId?}]
      const sessions = data.map(s =>
        s.session2
          ? { id: s.session2.id, name: s.session2.name, programId: s.session2.programId }
          : s.session2Id
            ? { id: s.session2Id, name: s.session2?.name || "", programId: s.session2?.programId }
            : s
      );

      setSession2s(sessions);
      setSession2Id(sessions[0]?.id ?? null);

      // Build unique program list from sessions
      const progMap = new Map(); // id -> name
      // if programId or program meta isn’t included, fetch meta per session
      for (const sess of sessions) {
        if (sess.programId) {
          // We still need a name. Try to get it cheaply:
          // Prefer existing name pattern "Program <id>" fallback
          progMap.set(sess.programId, progMap.get(sess.programId) || null);
        }
      }

      // Fetch program names for ids missing names
      const idsToResolve = [...progMap.entries()].filter(([_, name]) => !name).map(([id]) => id);
      for (const pid of idsToResolve) {
        try {
          const rp = await api.get(`/programs/${pid}`);
          const pj = rp.data;
          progMap.set(pid, pj?.name || `Programme ${pid}`);
        } catch {
          progMap.set(pid, `Programme ${pid}`);
        }
      }

      const progs = [...progMap.entries()].map(([id, name]) => ({ id: Number(id), name }));
      setPrograms(progs);
      setProgramId(progs[0]?.id ?? null);
    })();
  }, [user?.id]);

  // --- Fetch seances for current session2 ---
  useEffect(() => {
    if (!session2Id) {
      setSeances([]); setSeanceId(null);
      return;
    }
    api.get(`/seance-formateur/session/${session2Id}`)
      .then(res => {
        setSeances(res.data);
        setSeanceId(res.data[0]?.id ?? null);
      });
  }, [session2Id]);

  // --- Fetch messages for session & seance (unchanged) ---
  useEffect(() => {
    if (session2Id) {
      api.get(`/session2-chat-messages/${session2Id}`)
        .then(res => setSessionChatMessages(res.data));
    }
    if (seanceId) {
      api.get(`/chat-messages/${seanceId}`)
        .then(res => setSeanceChatMessages(res.data));
    }
  }, [session2Id, seanceId]);

  // --- Fetch programs (real names) for the user ---
  useEffect(() => {
    if (!user?.id) return;
    api.get(`/program-chat/my-programs/${user.id}`)
      .then(res => {
        // res.data = [{ id, name }]
        setPrograms(res.data);
        setProgramId(res.data[0]?.id ?? null);
      })
      .catch(() => setPrograms([]));
  }, [user?.id]);

  // --- Fetch program chat messages when programId changes ---
  useEffect(() => {
    if (!programId) {
      setProgramChatMessages([]);
      return;
    }
    api.get(`/program-chat/messages/${programId}`)
      .then(res => setProgramChatMessages(res.data))
      .catch(() => setProgramChatMessages([]));
  }, [programId]);



  // --- Session chat socket (unchanged) ---
  useEffect(() => {
    if (!session2Id) return;
    if (sessionSocketRef.current) {
      sessionSocketRef.current.emit("leaveSession2", { session2Id: Number(session2Id) });
      sessionSocketRef.current.disconnect();
    }
    const s = io(SOCKET_URL, { 
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    sessionSocketRef.current = s;
    s.emit("joinSession2", { session2Id: Number(session2Id) });
    s.on("newSession2Message", msg => setSessionChatMessages(prev => [...prev, msg]));
    s.on("deleteSession2Message", payload => setSessionChatMessages(prev => prev.filter(m => m.id !== payload.id)));
    s.on("clearSession2Messages", () => setSessionChatMessages([]));
    return () => {
      s.emit("leaveSession2", { session2Id: Number(session2Id) });
      s.disconnect();
    };
  }, [session2Id]);

  // --- Seance chat socket (unchanged) ---
  useEffect(() => {
    if (!seanceId) return;
    if (seanceSocketRef.current) {
      seanceSocketRef.current.emit("leaveSeance", { seanceId: Number(seanceId) });
      seanceSocketRef.current.disconnect();
    }
    const s = io(SOCKET_URL, { 
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    seanceSocketRef.current = s;
    s.emit("joinSeance", { seanceId: Number(seanceId) });
    s.on("newSeanceMessage", msg => setSeanceChatMessages(prev => [...prev, msg]));
    s.on("deleteSeanceMessage", payload => setSeanceChatMessages(prev => prev.filter(m => m.id !== payload.id)));
    s.on("clearSeanceMessages", () => setSeanceChatMessages([]));
    return () => {
      s.emit("leaveSeance", { seanceId: Number(seanceId) });
      s.disconnect();
    };
  }, [seanceId]);

  // --- NEW: Program chat socket ---
  useEffect(() => {
    if (!programId) return;
    if (programSocketRef.current) {
      programSocketRef.current.emit("leaveProgram", { programId: Number(programId) });
      programSocketRef.current.disconnect();
    }
    const s = io(`${SOCKET_URL}/program-chat`, { 
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    programSocketRef.current = s;
    s.emit("joinProgram", { programId: Number(programId), userId: user?.id }); // userId optional (no security now)
    s.on("newProgramMessage", msg => setProgramChatMessages(prev => [...prev, msg]));
    s.on("deleteProgramMessage", payload =>
      setProgramChatMessages(prev => prev.filter(m => m.id !== payload.id))
    );
    return () => {
      s.emit("leaveProgram", { programId: Number(programId) });
      s.disconnect();
    };
  }, [programId, user?.id]);

  // Scroll bottom on lists update
  useEffect(() => {
    if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [programChatMessages, sessionChatMessages, seanceChatMessages, selectedTab, open]);

  // Reset input on target change
  useEffect(() => {
    setNewMsg(""); setNewFile(null); setShowEmoji(false);
  }, [selectedTab, session2Id, seanceId, programId]);

  // Emoji
  const handleEmoji = (e) => {
    setNewMsg((prev) => prev + e.emoji);
    setShowEmoji(false);
  };

  // Send (text/file) for current tab (NOW includes 'program')
  const handleChatSend = async () => {
    let socket;
    if (selectedTab === "program") socket = programSocketRef.current;
    else if (selectedTab === "session") socket = sessionSocketRef.current;
    else if (selectedTab === "seance") socket = seanceSocketRef.current;
    else if (selectedTab === "general") socket = generalSocketRef.current;
    if (!socket) return;

    // File message
    if (newFile) {
      const formData = new FormData();
      formData.append("file", newFile);

      let uploadUrl = "";
      if (selectedTab === "general") {
        uploadUrl = "/general-chat-messages/upload-chat";
      } else if (selectedTab === "session") {
        formData.append("session2Id", session2Id);
        uploadUrl = "/session2-chat-messages/upload-chat";
      } else if (selectedTab === "seance") {
        formData.append("seanceId", seanceId);
        uploadUrl = "/chat-messages/upload-chat";
      } else if (selectedTab === "program") {
        formData.append("programId", programId);
        formData.append("senderId", user.id);
        uploadUrl = "/program-chat/upload";
      }

      try {
        const res = await api.post(uploadUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const fileData = res.data;

        if (selectedTab === "general") {
          socket.emit("sendGeneralMessage", {
            content: fileData.fileUrl,
            type: fileData.fileType || "file",
            senderId: user.id,
          });
        } else if (selectedTab === "session") {
          socket.emit("sendSession2Message", {
            content: fileData.fileUrl,
            type: fileData.fileType || "file",
            session2Id: Number(session2Id),
            senderId: user.id,
          });
        } else if (selectedTab === "seance") {
          socket.emit("sendSeanceMessage", {
            content: fileData.fileUrl,
            type: fileData.fileType || "file",
            seanceId: Number(seanceId),
            senderId: user.id,
          });
        } else if (selectedTab === "program") {
          socket.emit("sendProgramMessage", {
            content: fileData.fileUrl,
            type: fileData.fileType || "file",
            programId: Number(programId),
            senderId: user.id,
          });
        }
      } catch {
        alert("Erreur upload fichier");
      }
      setNewFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Text message
    if (newMsg.trim()) {
      if (selectedTab === "general") {
        socket.emit("sendGeneralMessage", {
          content: newMsg, type: "text", senderId: user.id,
        });
      } else if (selectedTab === "session") {
        socket.emit("sendSession2Message", {
          content: newMsg, type: "text", session2Id: Number(session2Id), senderId: user.id,
        });
      } else if (selectedTab === "seance") {
        socket.emit("sendSeanceMessage", {
          content: newMsg, type: "text", seanceId: Number(seanceId), senderId: user.id,
        });
      } else if (selectedTab === "program") {
        socket.emit("sendProgramMessage", {
          content: newMsg, type: "text", programId: Number(programId), senderId: user.id,
        });
      }
      setNewMsg("");
    }
  };

  // Delete message (NOW includes 'program')
  const handleDeleteMsg = async (msgId) => {
    if (selectedTab === "session") {
      await api.delete(`/session2-chat-messages/${msgId}`, {
        data: { userId: user.id }
      });
      setSessionChatMessages(prev => prev.filter(m => m.id !== msgId));
    } else if (selectedTab === "seance") {
      await api.delete(`/chat-messages/${msgId}`, {
        data: { userId: user.id }
      });
      setSeanceChatMessages(prev => prev.filter(m => m.id !== msgId));
    } else if (selectedTab === "general") {
      await api.delete(`/general-chat-messages/${msgId}`, {
        data: { userId: user.id }
      });
      setGeneralChatMessages(prev => prev.filter(m => m.id !== msgId));
    } else if (selectedTab === "program") {
      await api.delete(`/program-chat/${msgId}`, {
        data: { userId: user.id }
      });
      setProgramChatMessages(prev => prev.filter(m => m.id !== msgId));
    }
  };

  // --- UI ---
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: "104px", right: "24px", width: "64px", height: "64px",
          borderRadius: "50%", background: open ? "#fff" : "#d32f2f", color: open ? "#d32f2f" : "#fff",
          fontSize: "28px", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.22)", border: open ? "3px solid #d32f2f" : "none",
          zIndex: 2000, cursor: "pointer", transition: "all 0.18s ease-in-out", display: "flex",
          alignItems: "center", justifyContent: "center", outline: "none"
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        onMouseOver={(e) => { e.currentTarget.style.background = open ? "#fbeaec" : "#e53935"; }}
        onMouseOut={(e) => { e.currentTarget.style.background = open ? "#fff" : "#d32f2f"; }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(211, 47, 47, 0.4)"; }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.22)"; }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Popup */}
      {open && (
        <Paper
          sx={{
            position: "fixed", bottom: 180, right: 32, width: 410, maxHeight: "74vh",
            borderRadius: 4, boxShadow: 10, zIndex: 2100, display: "flex", flexDirection: "column",
            p: 0, overflow: "hidden", background: "#f9f9fa",
          }}
        >
          {/* Tabs */}
          <Box display="flex" alignItems="center" bgcolor="#fff" px={2} pt={1.5} pb={0.5} borderBottom="1px solid #e8e8e8">
            <Button
              variant={selectedTab === "program" ? "contained" : "text"}
              onClick={() => setSelectedTab("program")}
              color="success" size="small"
              sx={{ borderRadius: 3, fontWeight: 600, boxShadow: selectedTab === "program" ? 3 : 0, mx: 1, px: 2 }}
              disabled={!programId}
            >
              Program Chat
            </Button>
            <Button
              variant={selectedTab === "session" ? "contained" : "text"}
              onClick={() => setSelectedTab("session")}
              color="error" size="small"
              sx={{ borderRadius: 3, fontWeight: 600, boxShadow: selectedTab === "session" ? 3 : 0, mx: 1, px: 2 }}
            >
              Session Chat
            </Button>
            <Button
              variant={selectedTab === "seance" ? "contained" : "text"}
              onClick={() => setSelectedTab("seance")}
              color="primary" size="small"
              disabled={!seanceId}
              sx={{ borderRadius: 3, fontWeight: 600, boxShadow: selectedTab === "seance" ? 3 : 0, mx: 1, px: 2 }}
            >
              Séance Chat
            </Button>
            <Button
              variant={selectedTab === "general" ? "contained" : "text"}
              onClick={() => setSelectedTab("general")}
              color="secondary" size="small"
              sx={{ borderRadius: 3, fontWeight: 600, boxShadow: selectedTab === "general" ? 3 : 0, mx: 1, px: 2 }}
            >
              Chat Général
            </Button>
          </Box>

          {/* Program selector */}
          {selectedTab === "program" && programs.length > 1 && (
            <Box bgcolor="#f6f6fc" px={2} py={1.5}>
              <select
                value={programId ?? ""}
                onChange={e => setProgramId(Number(e.target.value))}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", fontWeight: 500 }}
              >
                {programs.map(p => (
                  <option value={p.id} key={p.id}>{p.name || `Programme ${p.id}`}</option>
                ))}
              </select>
            </Box>
          )}

          {/* Session selector */}
          {session2s.length > 1 && (
            <Box bgcolor="#f6f6fc" px={2} py={1.5}>
              <select
                value={session2Id ?? ""}
                onChange={e => setSession2Id(Number(e.target.value))}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", fontWeight: 500 }}
              >
                {session2s.map(s => (
                  <option value={s.id} key={s.id}>{s.name}</option>
                ))}
              </select>
            </Box>
          )}

          {/* Seance selector */}
          {selectedTab === "seance" && seances.length > 1 && (
            <Box bgcolor="#f6f6fc" px={2} py={1.5}>
              <select
                value={seanceId ?? ""}
                onChange={e => setSeanceId(Number(e.target.value))}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 8, border: "1px solid #ccc", fontWeight: 500 }}
              >
                {seances.map(s => (
                  <option value={s.id} key={s.id}>{s.title || `Séance ${s.id}`}</option>
                ))}
              </select>
            </Box>
          )}

          {/* Chat Messages */}
          <Box
            sx={{
              p: 2, pt: 1.5, flex: 1, overflowY: "auto", background: "#f7f7fa",
              borderBottom: "1px solid #eee", minHeight: 200, scrollbarWidth: "thin",
              "&::-webkit-scrollbar": { width: "7px", background: "#eaeaea", borderRadius: 5 },
              "&::-webkit-scrollbar-thumb": { background: "#e1e1e1", borderRadius: 5 }
            }}
          >
            <Stack spacing={1}>
              {(
                selectedTab === "program" ? programChatMessages :
                selectedTab === "session" ? sessionChatMessages :
                selectedTab === "seance" ? seanceChatMessages :
                generalChatMessages
              ).map((msg, i) => (
                <Box
                  key={msg.id || i}
                  sx={{
                    display: "flex", alignItems: "flex-start", gap: 1.5,
                    bgcolor: msg.sender?.id === user.id ? "#fff8f8" : "#fff",
                    borderRadius: 3,
                    boxShadow: msg.sender?.id === user.id ? "0 1px 8px #ffe0e0" : "0 1px 8px #e2e2ef0c",
                    border: "1px solid #f2f2f3",
                    px: 1.5, py: 1,
                    mr: msg.sender?.id === user.id ? 0 : "auto",
                    ml: msg.sender?.id === user.id ? "auto" : 0,
                    maxWidth: "85%",
                  }}
                >
                  {msg.sender?.profilePic ? (
                    <img
                      src={
                        msg.sender?.profilePic?.startsWith('http')
                          ? msg.sender.profilePic
                          : `http://localhost:8000${msg.sender?.profilePic || '/profile-pics/default.png'}`
                      }
                      alt={msg.sender?.name}
                      style={{ width: 32, height: 32, borderRadius: "50%", marginTop: 2 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#d5dde9", mt: 0.25 }}>
                      {msg.sender?.name?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ fontSize: 15 }}>
                        {msg.sender?.name || "Anonyme"}
                      </Typography>
                      <Typography sx={{ color: "#aaa", fontSize: 11.5, fontWeight: 500, ml: 1, mt: 0.3 }}>
                        {msg.sender?.role ? "· " + msg.sender.role : ""}
                        {msg.createdAt && (
                          <span style={{ marginLeft: 8 }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </Typography>
                      {msg.sender?.id === user.id && (
                        <IconButton size="small" onClick={() => handleDeleteMsg(msg.id)} color="error" sx={{ ml: "auto" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Box mt={0.5}>
                      {msg.type === "text" && (
                        <Typography sx={{ fontSize: 15, color: "#222" }}>{msg.content}</Typography>
                      )}
                      {msg.type === "image" && (
                        <img src={msg.content} alt="img" style={{ maxWidth: 170, borderRadius: 7, marginTop: 4 }} />
                      )}
                      {msg.type === "audio" && (
                        <audio controls src={msg.content} style={{ maxWidth: 150, marginTop: 4 }} />
                      )}
                      {msg.type === "video" && (
                        <video controls src={msg.content} style={{ maxWidth: 160, borderRadius: 7, marginTop: 4 }} />
                      )}
                      {msg.type === "file" && (
                        <a href={msg.content} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 4, color: "#0072ff" }}>
                          📎 {msg.content.split("/").pop()}
                        </a>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
              <div ref={chatBottomRef} />
            </Stack>
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, background: "#fff", borderTop: "1px solid #e8e8e8" }}>
            <TextField
              fullWidth value={newMsg} size="small" placeholder="Écris un message…"
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleChatSend()}
              sx={{ background: "#f8f8f8", borderRadius: 2 }} inputProps={{ style: { fontSize: 15 } }}
            />
            <IconButton onClick={() => setShowEmoji(v => !v)}><span role="img" aria-label="emoji">😀</span></IconButton>
            <IconButton component="label" color={newFile ? "success" : "primary"}>
              <AddPhotoAlternateIcon />
              <input hidden ref={fileInputRef} type="file"
                     accept="image/*,video/*,audio/*,application/pdf"
                     onChange={e => setNewFile(e.target.files[0])} />
            </IconButton>
            <Button
              onClick={handleChatSend}
              variant="contained"
              color={
                selectedTab === "program" ? "success" :
                selectedTab === "session" ? "error" :
                selectedTab === "seance" ? "primary" : "secondary"
              }
              disabled={!newMsg.trim() && !newFile}
              sx={{ px: 2, fontWeight: 600 }}
            >
              Envoyer
            </Button>
          </Box>

          {showEmoji && (
            <Box sx={{ position: "absolute", bottom: 90, right: 30, zIndex: 11 }}>
              <EmojiPicker onEmojiClick={handleEmoji} autoFocusSearch={false} />
            </Box>
          )}
          {newFile && (
            <Typography color="primary" fontSize={13} ml={2} mt={0.5}>
              Fichier prêt à envoyer : <strong>{newFile.name}</strong>
            </Typography>
          )}
        </Paper>
      )}
    </>
  );
}
