import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
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

const TOOLS = {
  PEN: "pen",
  TEXT: "text",
  TABLE: "table",
};

export default function Whiteboard({ seanceId, userId }) {
  const { t } = useTranslation();
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
      console.log("✅ Socket.io connecté à", SOCKET_URL);
    });
    s.on("connect_error", (err) => {
      console.error("❌ Erreur de connexion socket.io :", err);
    });

    s.emit("join-seance", seanceId);

    s.on("whiteboard-sync", (actions) => setActions(actions));
    s.on("whiteboard-action", (action) => setActions((prev) => [...prev, action]));

    return () => s.disconnect();
  }, [seanceId]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
          {t('whiteboard.collaborativeWhiteboard')}
        </span>
      </Stack>
      
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
        <Tooltip title={t('whiteboard.tools.pen')} placement="right" TransitionComponent={Fade}>
          <IconButton color={tool === TOOLS.PEN ? "primary" : "default"} onClick={() => setTool(TOOLS.PEN)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('whiteboard.tools.text')} placement="right" TransitionComponent={Fade}>
          <IconButton color={tool === TOOLS.TEXT ? "primary" : "default"} onClick={() => setTool(TOOLS.TEXT)}>
            <TextFieldsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('whiteboard.tools.table')} placement="right" TransitionComponent={Fade}>
          <IconButton color={tool === TOOLS.TABLE ? "primary" : "default"} onClick={() => setTool(TOOLS.TABLE)}>
            <TableChartIcon />
          </IconButton>
        </Tooltip>
        <Divider sx={{ my: 1, width: 26 }} />
        <Tooltip title={t('whiteboard.tools.color')} placement="right" TransitionComponent={Fade}>
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
        <Tooltip title={t('whiteboard.tools.undo')} placement="right" TransitionComponent={Fade}>
          <IconButton onClick={handleUndo} disabled={actions.length === 0}>
            <UndoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('whiteboard.tools.redo')} placement="right" TransitionComponent={Fade}>
          <IconButton onClick={handleRedo} disabled={undoStack.length === 0}>
            <RedoIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      <canvas
        ref={canvasRef}
        width={900}
        height={500}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          border: "2px solid #e1e8f5",
          borderRadius: 12,
          cursor: tool === TOOLS.PEN ? "crosshair" : "default",
          marginLeft: 80,
          background: "#fff",
        }}
      />

      {showTextInput && (
        <Box
          component="form"
          onSubmit={handleTextSubmit}
          sx={{
            position: "absolute",
            left: textPos.x + 80,
            top: textPos.y + 140,
            zIndex: 20,
          }}
        >
          <input
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={() => setShowTextInput(false)}
            autoFocus
            style={{
              border: "2px solid #1976d2",
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: 16,
              fontFamily: "Poppins, Arial",
            }}
          />
        </Box>
      )}
    </Box>
  );
}