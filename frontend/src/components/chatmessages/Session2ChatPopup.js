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

  // const globalSocketRef = useRef(null);


  const [generalChatMessages, setGeneralChatMessages] = useState([]);
  const generalSocketRef = useRef(null);

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
  useEffect(() => {
    if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [sessionChatMessages, seanceChatMessages, generalChatMessages, selectedTab, open]);

  //genralechat 
  useEffect(() => {
    // Only connect once
    if (generalSocketRef.current) {
      generalSocketRef.current.disconnect();
    }
    const s = io(`${SOCKET_URL}/general-chat`, { transports: ["websocket"] });
    generalSocketRef.current = s;

    // Fetch messages
    s.emit("fetchGeneralMessages");
    s.on("generalMessages", msgs => setGeneralChatMessages(msgs));
    s.on("newGeneralMessage", msg =>
      setGeneralChatMessages(prev => [...prev, msg])
    );
    s.on("deleteGeneralMessage", ({ id }) =>
      setGeneralChatMessages(prev => prev.filter(m => m.id !== id))
    );
    return () => s.disconnect();
  }, []); // []: only once

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
    let socket;
    if (selectedTab === "session") socket = sessionSocketRef.current;
    else if (selectedTab === "seance") socket = seanceSocketRef.current;
    else if (selectedTab === "general") socket = generalSocketRef.current;
    if (!socket) return;

    // File message
    if (newFile) {
      const formData = new FormData();
      formData.append("file", newFile);

      let uploadUrl = "";
      if (selectedTab === "general") {
        uploadUrl = "http://localhost:8000/general-chat-messages/upload-chat";
      } else if (selectedTab === "session") {
        formData.append("session2Id", session2Id);
        uploadUrl = "http://localhost:8000/session2-chat-messages/upload-chat";
      } else if (selectedTab === "seance") {
        formData.append("seanceId", seanceId);
        uploadUrl = "http://localhost:8000/chat-messages/upload-chat";
      }
      try {
        const res = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
        const fileData = await res.json();
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
        } else {
          socket.emit("sendSeanceMessage", {
            content: fileData.fileUrl,
            type: fileData.fileType || "file",
            seanceId: Number(seanceId),
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
          content: newMsg,
          type: "text",
          senderId: user.id,
        });
      } else if (selectedTab === "session") {
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
    } else if (selectedTab === "seance") {
      await fetch(`http://localhost:8000/chat-messages/${msgId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      setSeanceChatMessages((prev) => prev.filter((m) => m.id !== msgId));
    } else if (selectedTab === "general") {
      await fetch(`http://localhost:8000/general-chat-messages/${msgId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      setGeneralChatMessages((prev) => prev.filter((m) => m.id !== msgId));
    }
  };


  // --- UI ---
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "104px",
          right: "24px",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: open ? "#fff" : "#d32f2f",
          color: open ? "#d32f2f" : "#fff",
          fontSize: "28px",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.22)",
          border: open ? "3px solid #d32f2f" : "none",
          zIndex: 2000,
          cursor: "pointer",
          transition: "all 0.18s ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none"
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        onMouseOver={(e) => {
          e.currentTarget.style.background = open ? "#fbeaec" : "#e53935";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = open ? "#fff" : "#d32f2f";
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(211, 47, 47, 0.4)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.22)";
        }}
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
            bottom: 180,
            right: 32,
            width: 410,
            maxHeight: "74vh",
            borderRadius: 4,
            boxShadow: 10,
            zIndex: 2100,
            display: "flex",
            flexDirection: "column",
            p: 0,
            overflow: "hidden",
            background: "#f9f9fa",
          }}
        >
          {/* Tabs */}
          <Box
            display="flex"
            alignItems="center"
            bgcolor="#fff"
            px={2}
            pt={1.5}
            pb={0.5}
            borderBottom="1px solid #e8e8e8"
          >
            <Button
              variant={selectedTab === "session" ? "contained" : "text"}
              onClick={() => setSelectedTab("session")}
              color="error"
              size="small"
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: selectedTab === "session" ? 3 : 0,
                mx: 1,
                px: 2
              }}
            >
              Session Chat
            </Button>
            <Button
              variant={selectedTab === "seance" ? "contained" : "text"}
              onClick={() => setSelectedTab("seance")}
              color="primary"
              size="small"
              disabled={!seanceId}
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: selectedTab === "seance" ? 3 : 0,
                mx: 1,
                px: 2
              }}
            >
              Séance Chat
            </Button>
            <Button
              variant={selectedTab === "general" ? "contained" : "text"}
              onClick={() => setSelectedTab("general")}
              color="secondary"
              size="small"
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: selectedTab === "general" ? 3 : 0,
                mx: 1,
                px: 2
              }}
            >
              Chat Général
            </Button>

          </Box>
          {/* Session selector */}
          {session2s.length > 1 && (
            <Box bgcolor="#f6f6fc" px={2} py={1.5}>
              <select
                value={session2Id}
                onChange={e => setSession2Id(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  fontWeight: 500
                }}
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
                value={seanceId}
                onChange={e => setSeanceId(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  fontWeight: 500
                }}
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
              p: 2,
              pt: 1.5,
              flex: 1,
              overflowY: "auto",
              background: "#f7f7fa",
              borderBottom: "1px solid #eee",
              minHeight: 200,
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: "7px",
                background: "#eaeaea",
                borderRadius: 5
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#e1e1e1",
                borderRadius: 5
              }
            }}
          >
            <Stack spacing={1}>
              {(
                selectedTab === "session"
                  ? sessionChatMessages
                  : selectedTab === "seance"
                    ? seanceChatMessages
                    : generalChatMessages
              ).map((msg, i) => (
                <Box
                  key={msg.id || i}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    bgcolor: msg.sender?.id === user.id ? "#fff8f8" : "#fff",
                    borderRadius: 3,
                    boxShadow: msg.sender?.id === user.id ? "0 1px 8px #ffe0e0" : "0 1px 8px #e2e2ef0c",
                    border: "1px solid #f2f2f3",
                    px: 1.5,
                    py: 1,
                    mr: msg.sender?.id === user.id ? 0 : "auto",
                    ml: msg.sender?.id === user.id ? "auto" : 0,
                    maxWidth: "85%",
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
                        style={{ width: 32, height: 32, borderRadius: "50%", marginTop: 2 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "#d5dde9", mt: 0.25 }}>
                        {msg.sender?.name?.[0]?.toUpperCase() || "?"}
                      </Avatar>
                    )
                  }
                  <Box sx={{ flex: 1 }}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ fontSize: 15 }}>
                        {msg.sender?.name || "Anonyme"}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#aaa",
                          fontSize: 11.5,
                          fontWeight: 500,
                          ml: 1,
                          mt: 0.3
                        }}
                      >
                        {msg.sender?.role ? "· " + msg.sender.role : ""}
                        {msg.createdAt && (
                          <span style={{ marginLeft: 8 }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </Typography>
                      {msg.sender?.id === user.id && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteMsg(msg.id)}
                          color="error"
                          sx={{ ml: "auto" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    {/* Message Content */}
                    <Box mt={0.5}>
                      {msg.type === "text" && (
                        <Typography sx={{ fontSize: 15, color: "#222" }}>
                          {msg.content}
                        </Typography>
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
          <Box sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: "#fff",
            borderTop: "1px solid #e8e8e8"
          }}>
            <TextField
              fullWidth
              value={newMsg}
              size="small"
              placeholder="Écris un message…"
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleChatSend()}
              sx={{ background: "#f8f8f8", borderRadius: 2 }}
              inputProps={{ style: { fontSize: 15 } }}
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
            <Button onClick={handleChatSend} variant="contained" color={selectedTab === "session" ? "error" : "primary"} disabled={!newMsg.trim() && !newFile} sx={{ px: 2, fontWeight: 600 }}>
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
