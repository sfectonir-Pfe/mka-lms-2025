import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  Fade,
  Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TableChartIcon from "@mui/icons-material/TableChart";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ColorLensIcon from "@mui/icons-material/ColorLens";

const SOCKET_URL = "http://localhost:8000/whiteboard";
 // adapte ton URL

const TOOLS = {
  PEN: "pen",
  TEXT: "text",
  TABLE: "table",
};

export default function Whiteboard({ seanceId, userId }) {
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [tool, setTool] = useState(TOOLS.PEN);
  const [drawing, setDrawing] = useState(false);
  const [actions, setActions] = useState([]);
  const [color, setColor] = useState("#1976d2");
  const [currentText, setCurrentText] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState([]);
 
useEffect(() => {

  const s = io(SOCKET_URL, { transports: ["websocket"] });
  setSocket(s);

  s.on("connect", () => {
    console.log("✅ Socket.io connected to", SOCKET_URL);
  });
  s.on("connect_error", (err) => {
    console.error("❌ Erreur de connexion socket.io :", err);
  });

  s.emit("join-seance", seanceId);

  s.on("whiteboard-sync", (actions) => setActions(actions));
  s.on("whiteboard-action", (action) => setActions((prev) => [...prev, action]));

  return () => s.disconnect();
}, [seanceId]);

  // Connect socket + join room
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(s);

    s.emit("join-seance", seanceId);

    s.on("whiteboard-sync", (actions) => setActions(actions));
    s.on("whiteboard-action", (action) => setActions((prev) => [...prev, action]));

    return () => s.disconnect();
  }, [seanceId]);

  // Dessin pen
  const handlePointerDown = (e) => {
    if (tool === TOOLS.PEN) {
      setDrawing(true);
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const newStroke = { type: "draw", data: { color, points: [[x, y]] }, seanceId, createdById: userId };
      setActions((prev) => [...prev, newStroke]);
      if (socket) socket.emit("whiteboard-action", newStroke);
    }
    if (tool === TOOLS.TEXT) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      setTextPos({ x, y });
      setShowTextInput(true);
    }
    if (tool === TOOLS.TABLE) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const newTable = {
        type: "table",
        data: { x, y, rows: 3, cols: 3 },
        seanceId,
        createdById: userId,
      };
      setActions((prev) => [...prev, newTable]);
      if (socket) socket.emit("whiteboard-action", newTable);
    }
  };

  const handlePointerMove = (e) => {
    if (!drawing || tool !== TOOLS.PEN) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setActions((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.type === "draw") {
        last.data.points.push([x, y]);
        return [...prev.slice(0, -1), last];
      }
      return prev;
    });
  };

  const handlePointerUp = () => {
    setDrawing(false);
  };

  // Ajout texte après input
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!currentText.trim()) return;
    const newText = {
      type: "text",
      data: { x: textPos.x, y: textPos.y, value: currentText, color },
      seanceId,
      createdById: userId,
    };
    setActions((prev) => [...prev, newText]);
    if (socket) socket.emit("whiteboard-action", newText);
    setCurrentText("");
    setShowTextInput(false);
  };

  // Undo/Redo logic
  const handleUndo = () => {
    if (actions.length === 0) return;
    setUndoStack((prev) => [...prev, actions[actions.length - 1]]);
    setActions((prev) => prev.slice(0, -1));
  };
  const handleRedo = () => {
    if (undoStack.length === 0) return;
    setActions((prev) => [...prev, undoStack[undoStack.length - 1]]);
    setUndoStack((prev) => prev.slice(0, -1));
  };

  // Redessiner tout le canvas à chaque update d’actions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid (style Canva)
    const gridSize = 24;
    ctx.save();
    ctx.strokeStyle = "#e9e9f1";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();

    actions.forEach((action) => {
      if (action.type === "draw") {
        const { color, points } = action.data;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        points.forEach(([x, y], i) => {
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
      if (action.type === "text") {
        const { x, y, value, color } = action.data;
        ctx.font = "bold 20px Poppins, Arial";
        ctx.fillStyle = color || "#222";
        ctx.fillText(value, x, y);
      }
      if (action.type === "table") {
        const { x, y, rows, cols } = action.data;
        const cellSize = 44;
        ctx.save();
        ctx.strokeStyle = "#b8b8d4";
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= rows; i++) {
          ctx.beginPath();
          ctx.moveTo(x, y + i * cellSize);
          ctx.lineTo(x + cols * cellSize, y + i * cellSize);
          ctx.stroke();
        }
        for (let j = 0; j <= cols; j++) {
          ctx.beginPath();
          ctx.moveTo(x + j * cellSize, y);
          ctx.lineTo(x + j * cellSize, y + rows * cellSize);
          ctx.stroke();
        }
        ctx.restore();
      }
    });
  }, [actions]);

  // --- Toolbar Stylée (verticale à gauche) ---
  return (
    <Box
      sx={{
        p: 3,
        background: "#f6f9ff",
        borderRadius: 5,
        boxShadow: 3,
        minHeight: 650,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2659/2659360.png"
          alt=""
          style={{ width: 38, marginRight: 7 }}
        />
        <span style={{ fontSize: 32, fontWeight: 700, fontFamily: "Poppins, Arial" }}>
          Tableau blanc collaboratif
        </span>
      </Stack>
      {/* TOOLBAR FLOTTANTE */}
      <Paper
        elevation={5}
        sx={{
          position: "absolute",
          left: 18,
          top: 88,
          zIndex: 10,
          p: 1,
          borderRadius: 4,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          boxShadow: "0 4px 18px #dde2f3bb",
        }}
      >
        <Tooltip title="Stylo (Pen)" placement="right" TransitionComponent={Fade}>
          <IconButton color={tool === TOOLS.PEN ? "primary" : "default"} onClick={() => setTool(TOOLS.PEN)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Texte" placement="right" TransitionComponent={Fade}>
          <IconButton color={tool === TOOLS.TEXT ? "primary" : "default"} onClick={() => setTool(TOOLS.TEXT)}>
            <TextFieldsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Tableau" placement="right" TransitionComponent={Fade}>
          <IconButton color={tool === TOOLS.TABLE ? "primary" : "default"} onClick={() => setTool(TOOLS.TABLE)}>
            <TableChartIcon />
          </IconButton>
        </Tooltip>
        <Divider sx={{ my: 1, width: 26 }} />
        <Tooltip title="Changer la couleur" placement="right" TransitionComponent={Fade}>
          <Box>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: 34,
                height: 34,
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                background: "none",
                padding: 0,
              }}
            />
          </Box>
        </Tooltip>
        <Divider sx={{ my: 1, width: 26 }} />
        <Tooltip title="Annuler (Undo)" placement="right" TransitionComponent={Fade}>
          <span>
            <IconButton onClick={handleUndo} disabled={actions.length === 0}>
              <UndoIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Rétablir (Redo)" placement="right" TransitionComponent={Fade}>
          <span>
            <IconButton onClick={handleRedo} disabled={undoStack.length === 0}>
              <RedoIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Paper>

      {/* CANVAS */}
      <Paper
        sx={{
          ml: 13,
          mt: 0,
          borderRadius: 4,
          boxShadow: 2,
          background: "#fafdff",
          border: "2.5px solid #e5e8f3",
          width: 1050,
          height: 600,
          position: "relative",
          overflow: "visible",
        }}
      >
        <canvas
          ref={canvasRef}
          width={1050}
          height={600}
          style={{
            borderRadius: 16,
            background: "transparent",
            cursor: tool === TOOLS.PEN ? "crosshair" : "pointer",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        {/* TEXT INPUT flottant */}
        {showTextInput && (
          <form
            style={{
              position: "absolute",
              left: textPos.x + 25,
              top: textPos.y + 60,
              background: "#fff",
              padding: 7,
              borderRadius: 7,
              border: "1.5px solid #92b7ec",
              boxShadow: "0 2px 10px #adc7ee22",
              zIndex: 111,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onSubmit={handleTextSubmit}
          >
            <input
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              autoFocus
              style={{
                fontSize: 18,
                fontWeight: 500,
                fontFamily: "Poppins, Arial",
                border: "none",
                outline: "none",
                background: "none",
                padding: "2px 7px",
                borderBottom: `2px solid ${color}`,
                width: 180,
              }}
              placeholder="Tape ton texte..."
            />
            <Button variant="contained" size="small" color="primary" type="submit">
              OK
            </Button>
          </form>
        )}
      </Paper>
      
    </Box>
  );
}
