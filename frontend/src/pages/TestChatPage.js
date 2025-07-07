// import React, { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Stack,
//   IconButton,
// } from "@mui/material";
// import EmojiPicker from "emoji-picker-react";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

// const socket = io("http://localhost:8000"); // ✅ Adjust if backend URL differs

// const TestChatPage = () => {
//   const seanceId = 1; // 💡 Replace with actual seanceId
//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [file, setFile] = useState(null);
//   const fileRef = useRef();
//   const chatRef = useRef();

//   useEffect(() => {
//     socket.emit("joinRoom", { seanceId });

//     socket.on("newMessage", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//       scrollToBottom();
//     });

//     return () => {
//       socket.off("newMessage");
//     };
//   }, []);

//   const scrollToBottom = () => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   };

//   const handleSend = async () => {
//     if (newMsg.trim()) {
//       socket.emit("sendMessage", {
//         seanceId,
//         senderId: 1, // Optional: your user ID
//         type: "text",
//         content: newMsg,
//       });
//       setNewMsg("");
//     }

//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);
//       const res = await fetch("http://localhost:8000/upload-chat", {
//         method: "POST",
//         body: formData,
//       });
//       const { fileUrl, fileType } = await res.json();

//       socket.emit("sendMessage", {
//         seanceId,
//         senderId: 1,
//         type: fileType,
//         content: fileUrl,
//       });

//       setFile(null);
//     }
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h5" gutterBottom>💬 Test Chat Page</Typography>

//       <Paper
//         ref={chatRef}
//         sx={{
//           height: 400,
//           overflowY: "auto",
//           p: 2,
//           mb: 2,
//           border: "1px solid #ddd",
//           borderRadius: 2,
//         }}
//       >
//         <Stack spacing={1}>
//           {messages.map((msg, idx) => (
//             <Paper key={idx} sx={{ p: 1, background: "#f1f1f1" }}>
//               {msg.type === "text" && msg.content}
//               {msg.type === "image" && (
//                 <img src={msg.content} alt="media" style={{ maxWidth: 150 }} />
//               )}
//               {msg.type === "audio" && (
//                 <audio controls src={msg.content}></audio>
//               )}
//               {msg.type === "video" && (
//                 <video controls src={msg.content} style={{ maxWidth: 200 }} />
//               )}
//             </Paper>
//           ))}
//         </Stack>
//       </Paper>

//       <Stack direction="row" spacing={1}>
//         <TextField
//           value={newMsg}
//           onChange={(e) => setNewMsg(e.target.value)}
//           placeholder="Message"
//           fullWidth
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <Button variant="contained" onClick={handleSend}>
//           Send
//         </Button>
//         <IconButton onClick={() => setShowEmoji((prev) => !prev)}>
//           😊
//         </IconButton>
//         <IconButton component="label">
//           <AddPhotoAlternateIcon />
//           <input
//             type="file"
//             hidden
//             accept="image/*,video/*,audio/*"
//             ref={fileRef}
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//         </IconButton>
//       </Stack>

//       {showEmoji && (
//         <Box mt={1}>
//           <EmojiPicker
//             onEmojiClick={(e) => setNewMsg((prev) => prev + e.emoji)}
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default TestChatPage;
