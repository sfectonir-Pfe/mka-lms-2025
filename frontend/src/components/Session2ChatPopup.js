import React, { useEffect, useState, useRef } from "react";
import {
  Box, Paper, Typography, Stack, TextField, IconButton, Button, Avatar,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";
import { Tabs, Tab } from "@mui/material";

const SOCKET_URL = "http://localhost:8000";

export default function UnifiedSessionChatPopup({ user }) {
  // Which chat is active: "session" or "seance"
  const [selectedTab, setSelectedTab] = useState("session");

  // Session2 data
  const [session2s, setSession2s] = useState([]); // All sessions user is in
  const [session2Id, setSession2Id] = useState(null);

  // Seance data
  const [seances, setSeances] = useState([]); // All seances for current session
  const [seanceId, setSeanceId] = useState(null);

  // Chat states (messages, input, etc)
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

  // Fetch session2s for the user
  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8000/users/${user.id}/sessions2`)
      .then((res) => res.json())
      .then((data) => {
        // Normalize (handles both array of userSession2 or array of session2)
        const sessions = data.map(s =>
          s.session2
            ? { id: s.session2.id, name: s.session2.name }
            : s.session2Id
            ? { id: s.session2Id, name: s.session2?.name || "" }
            : s
        );
        setSession2s(sessions);
        setSession2Id(sessions[0]?.id ?? null);
      });
  }, [user?.id]);

  // Fetch seances for current session2
  useEffect(() => {
    if (!session2Id) {
      setSeances([]);
      setSeanceId(null);
      return;
    }
    fetch(`http://localhost:8000/seance-formateur/session/${session2Id}`)
      .then(res => res.json())
      .then(data => {
        setSeances(data);
        setSeanceId(data[0]?.id ?? null); // pick first as default, or let user choose if multiple
      });
  }, [session2Id]);

  // Fetch messages for both chats
  useEffect(() => {
    if (session2Id) {
      fetch(`http://localhost:8000/session2-chat-messages/${session2Id}`)
        .then(res => res.json())
        .then(msgs => setSessionChatMessages(msgs));
    }
    if (seanceId) {
      fetch(`http://localhost:8000/chat-messages/${seanceId}`)
        .then(res => res.json())
        .then(msgs => setSeanceChatMessages(msgs));
    }
  }, [session2Id, seanceId]);

  // Session chat socket
  useEffect(() => {
    if (!session2Id) return;
    if (sessionSocketRef.current) {
      sessionSocketRef.current.emit("leaveSession2", { session2Id: Number(session2Id) });
      sessionSocketRef.current.disconnect();
    }
    const s = io(SOCKET_URL, { transports: ["websocket"] });
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

  // Seance chat socket
  useEffect(() => {
    if (!seanceId) return;
    if (seanceSocketRef.current) {
      seanceSocketRef.current.emit("leaveSeance", { seanceId: Number(seanceId) });
      seanceSocketRef.current.disconnect();
    }
    const s = io(SOCKET_URL, { transports: ["websocket"] });
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

  // Scroll to bottom
  useEffect(() => {
    if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [sessionChatMessages, seanceChatMessages, selectedTab, open]);

  // Tab switch resets input
  useEffect(() => {
    setNewMsg("");
    setNewFile(null);
    setShowEmoji(false);
  }, [selectedTab, session2Id, seanceId]);

  // Emoji
  const handleEmoji = (e) => {
    setNewMsg((prev) => prev + e.emoji);
    setShowEmoji(false);
  };

  // Send message (text/file) for current tab
  const handleChatSend = async () => {
    let socket = selectedTab === "session" ? sessionSocketRef.current : seanceSocketRef.current;
    if (!socket) return;
    if (selectedTab === "session" && !session2Id) return;
    if (selectedTab === "seance" && !seanceId) return;

    // File message
    if (newFile) {
      const formData = new FormData();
      if (selectedTab === "session") {
        formData.append("file", newFile);
        formData.append("session2Id", session2Id);
        try {
          const res = await fetch("http://localhost:8000/session2-chat-messages/upload-chat", {
            method: "POST",
            body: formData,
          });
          const fileData = await res.json();
          socket.emit("sendSession2Message", {
            content: fileData.fileUrl,
            type: fileData.fileType || "file",
            session2Id: Number(session2Id),
            senderId: user.id,
          });
        } catch {
          alert("Erreur upload fichier");
        }
      } else {
        formData.append("file", newFile);
        formData.append("seanceId", seanceId);
        try {
          const res = await fetch("http://localhost:8000/chat-messages/upload-chat", {
            method: "POST",
            body: formData,
          });
          const fileData = await res.json();
          socket.emit("sendSeanceMessage", {
            content: fileData.fileUrl,
            type: fileData.fileType || "file",
            seanceId: Number(seanceId),
            senderId: user.id,
          });
        } catch {
          alert("Erreur upload fichier");
        }
      }
      setNewFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    // Text message
    if (newMsg.trim()) {
      if (selectedTab === "session") {
        socket.emit("sendSession2Message", {
          content: newMsg,
          type: "text",
          session2Id: Number(session2Id),
          senderId: user.id,
        });
      } else {
        socket.emit("sendSeanceMessage", {
          content: newMsg,
          type: "text",
          seanceId: Number(seanceId),
          senderId: user.id,
        });
      }
      setNewMsg("");
    }
  };

  // Delete message
  const handleDeleteMsg = async (msgId) => {
    if (selectedTab === "session") {
      await fetch(`http://localhost:8000/session2-chat-messages/${msgId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      setSessionChatMessages((prev) => prev.filter((m) => m.id !== msgId));
    } else {
      await fetch(`http://localhost:8000/chat-messages/${msgId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      setSeanceChatMessages((prev) => prev.filter((m) => m.id !== msgId));
    }
  };

  // --- UI ---
  return (
    <>
      {/* Floating Red Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 100,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#dc3545",
          color: "#fff",
          fontSize: 28,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          border: "none",
          zIndex: 2000,
          cursor: "pointer",
        }}
        aria-label="Chat session"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {open ? "✕" : "💬"}
      </button>
      {/* Tooltip au survol */}
      {showTooltip && (
        <div style={{
          position: "fixed",
          bottom: 166,
          right: 24,
          fontSize: "12px",
          color: "white",
          background: "rgba(0,0,0,0.8)",
          padding: "6px 12px",
          borderRadius: "6px",
          whiteSpace: "nowrap",
          zIndex: 2001
        }}>
          Chat de session
        </div>
      )}

      {/* Popup */}
      {open && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 100,
            right: 32,
            width: 400,
            maxHeight: "72vh",
            borderRadius: 3,
            boxShadow: 8,
            zIndex: 2100,
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          {/* Tabs always visible */}
          <Box display="flex" gap={2} mb={1} justifyContent="center">
            <Button
              variant={selectedTab === "session" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("session")}
              color="error"
              size="small"
              sx={{ flex: 1, fontWeight: 600 }}
            >
              💬 Session Chat
            </Button>
            <Button
              variant={selectedTab === "seance" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("seance")}
              color="primary"
              size="small"
              disabled={!seanceId}
              sx={{ flex: 1, fontWeight: 600 }}
            >
              💬 Séance Chat
            </Button>
          </Box>
          {/* Session selector (if needed) */}
          {session2s.length > 1 && (
            <select
              value={session2Id}
              onChange={e => setSession2Id(Number(e.target.value))}
              style={{ marginBottom: 8, padding: 6, borderRadius: 8, border: "1px solid #aaa" }}
            >
              {session2s.map(s => (
                <option value={s.id} key={s.id}>{s.name}</option>
              ))}
            </select>
          )}
          {/* Seance selector (if needed) */}
          {selectedTab === "seance" && seances.length > 1 && (
            <select
              value={seanceId}
              onChange={e => setSeanceId(Number(e.target.value))}
              style={{ marginBottom: 8, padding: 6, borderRadius: 8, border: "1px solid #aaa" }}
            >
              {seances.map(s => (
                <option value={s.id} key={s.id}>{s.title || `Séance ${s.id}`}</option>
              ))}
            </select>
          )}
          {/* Chat Messages */}
          <Paper sx={{
            p: 1,
            mb: 1,
            maxHeight: 290,
            minHeight: 120,
            overflowY: "auto",
            background: "#f8f8f8"
          }}>
            <Stack spacing={1}>
              {(selectedTab === "session" ? sessionChatMessages : seanceChatMessages).map((msg, i) => (
                <Paper
                  key={msg.id || i}
                  sx={{
                    p: 1,
                    background: "#fff",
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 1,
                    gap: 1,
                  }}
                >
                  {/* Avatar */}
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
                      )}
                      {msg.sender?.id === user.id && (
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
          {/* Input */}
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              fullWidth
              value={newMsg}
              size="small"
              placeholder="Écris un message…"
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleChatSend()}
              sx={{ background: "#fff", borderRadius: 1 }}
            />
            <IconButton onClick={() => setShowEmoji(v => !v)}>
              <span role="img" aria-label="emoji">😀</span>
            </IconButton>
            <IconButton component="label" color={newFile ? "success" : "primary"}>
              <AddPhotoAlternateIcon />
              <input
                hidden
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*,application/pdf"
                onChange={e => setNewFile(e.target.files[0])}
              />
            </IconButton>
            <Button onClick={handleChatSend} variant="contained" color={selectedTab === "session" ? "error" : "primary"} disabled={!newMsg.trim() && !newFile}>
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
        </Paper>
      )}
    </>
  );
}
