import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Box, IconButton, Tooltip, Divider, Chip, Typography, useTheme } from "@mui/material"
import {
  Create as PenIcon,
  TextFields as TextIcon,
  CropSquare as RectangleIcon,
  RadioButtonUnchecked as CircleIcon,
  ArrowForward as ArrowIcon,
  TableChart as TableIcon,
  Settings as SettingsIcon,
  PanTool as PanIcon,
  SelectAll as SelectIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
} from "@mui/icons-material"
import { TOOLS } from "../constants"
import ExportButton from "./ExportButton"

const ToolButton = ({ tool, currentTool, setTool, icon: Icon, label, color = "primary" }) => (
  <Tooltip title={label} placement="right">
    <IconButton
      onClick={() => setTool(tool)}
      sx={{
        backgroundColor: currentTool === tool ? `${color}.main` : "transparent",
        color: currentTool === tool ? "white" : `${color}.main`,
        "&:hover": {
          backgroundColor: currentTool === tool ? `${color}.dark` : `${color}.light`,
          color: "white",
          transform: "scale(1.05)",
        },
        "&:active": {
          transform: "scale(0.95)",
        },
        transition: "all 0.2s ease",
        width: 48,
        height: 48,
        borderRadius: 2,
        border: currentTool === tool ? `2px solid ${color}.dark` : "2px solid transparent",
        position: "relative",
      }}
    >
      <Icon />
      {currentTool === tool && (
        <Box
          sx={{
            position: "absolute",
            bottom: -2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: `4px solid ${color}.dark`,
          }}
        />
      )}
    </IconButton>
  </Tooltip>
)

const ColorPicker = ({ color, setColor }) => {
  const colors = ["#1976d2", "#d32f2f", "#388e3c", "#f57c00", "#7b1fa2", "#ff9800", "#795548", "#000000"]
  
  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
      {colors.map((c) => (
        <Box
          key={c}
          onClick={() => setColor(c)}
          sx={{
            width: 32,
            height: 32,
            backgroundColor: c,
            borderRadius: "50%",
            cursor: "pointer",
            border: color === c ? "3px solid white" : "2px solid transparent",
            boxShadow: color === c ? "0 0 0 2px #1976d2" : "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            },
          }}
        />
      ))}
    </Box>
  )
}

const ActionButton = ({ onClick, icon: Icon, label, color = "default", disabled = false }) => (
  <Tooltip title={label} placement="right">
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        color: `${color}.main`,
        "&:hover": {
          backgroundColor: `${color}.light`,
        },
        "&:disabled": {
          color: "text.disabled",
        },
        transition: "all 0.2s ease",
        width: 48,
        height: 48,
        borderRadius: 2,
      }}
    >
      <Icon />
    </IconButton>
  </Tooltip>
)

export default function ModernToolbar({
  tool,
  setTool,
  color,
  setColor,
  onUndo,
  onRedo,
  onDelete,
  onClear,
  onTableConfig,
  tableConfig = { rows: 3, columns: 4 },
  canUndo = false,
  canRedo = false,
  hasSelection = false,
  canvasRef,
  actions,
  zoom,
  panOffset,
}) {
  const theme = useTheme()
  const { t } = useTranslation()

  const drawingTools = [
    { tool: TOOLS.PEN, icon: PenIcon, label: `${t('whiteboard.tools.pen', 'Pen')} (P)`, color: "primary" },
    { tool: TOOLS.TEXT, icon: TextIcon, label: `${t('whiteboard.tools.text', 'Text')} (T)`, color: "secondary" },
    { tool: TOOLS.RECTANGLE, icon: RectangleIcon, label: `${t('whiteboard.tools.rectangle', 'Rectangle')} (R)`, color: "success" },
    { tool: TOOLS.CIRCLE, icon: CircleIcon, label: `${t('whiteboard.tools.circle', 'Circle')} (C)`, color: "info" },
    { tool: TOOLS.ARROW, icon: ArrowIcon, label: `${t('whiteboard.tools.arrow', 'Arrow')} (A)`, color: "warning" },
    { tool: TOOLS.TABLE, icon: TableIcon, label: `${t('whiteboard.tools.table', 'Table')} (B)`, color: "info" },
  ]

  const utilityTools = [
    { tool: TOOLS.SELECT, icon: SelectIcon, label: `${t('whiteboard.tools.select', 'Select')} (S)`, color: "error" },
    { tool: TOOLS.PAN, icon: PanIcon, label: `${t('whiteboard.tools.pan', 'Pan')} (G)`, color: "default" },
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Title */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Chip
          label={t('whiteboard.groups.toolsTitle', 'Whiteboard Tools')}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: "0.9rem" }}
        />
      </Box>

      {/* Drawing Tools */}
      <Box>
        <Chip label={t('whiteboard.groups.drawingTools', 'Drawing Tools')} size="small" sx={{ mb: 2, width: "100%" }} />
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
          {drawingTools.map(({ tool: toolType, icon, label, color: toolColor }) => (
            <ToolButton
              key={toolType}
              tool={toolType}
              currentTool={tool}
              setTool={setTool}
              icon={icon}
              label={label}
              color={toolColor}
            />
          ))}
        </Box>
        
        {/* Table Configuration */}
        {tool === TOOLS.TABLE && onTableConfig && (
          <Box sx={{ mt: 2, p: 2, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 2, backgroundColor: "rgba(25, 118, 210, 0.05)" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {t('whiteboard.table.label', 'Table')}: {tableConfig.rows}×{tableConfig.columns}
              </Typography>
              <Tooltip title={t('whiteboard.table.configure', 'Configure Table')} placement="top">
                <IconButton
                  onClick={onTableConfig}
                  size="small"
                  sx={{
                    color: "primary.main",
                    "&:hover": { backgroundColor: "primary.light" },
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
                         <Box
               sx={{
                 display: "grid",
                 gridTemplateColumns: `repeat(${tableConfig.columns}, 1fr)`,
                 gridTemplateRows: `repeat(${tableConfig.rows}, 1fr)`,
                 gap: 0.5,
                 width: "100%",
                 height: 40,
               }}
             >
               {Array.from({ length: tableConfig.rows * tableConfig.columns }, (_, i) => (
                 <Box
                   key={i}
                   sx={{
                     border: "1px solid #ccc",
                     backgroundColor: i < tableConfig.columns ? "#e8e8e8" : "#f5f5f5",
                     borderRadius: 0.5,
                   }}
                 />
               ))}
             </Box>
          </Box>
        )}
      </Box>

      {/* Utility Tools */}
      <Box>
        <Chip label={t('whiteboard.groups.utilityTools', 'Utility Tools')} size="small" sx={{ mb: 2, width: "100%" }} />
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
          {utilityTools.map(({ tool: toolType, icon, label, color: toolColor }) => (
            <ToolButton
              key={toolType}
              tool={toolType}
              currentTool={tool}
              setTool={setTool}
              icon={icon}
              label={label}
              color={toolColor}
            />
          ))}
          <ExportButton
            canvasRef={canvasRef}
            actions={actions}
            zoom={zoom}
            panOffset={panOffset}
          />
        </Box>
      </Box>

      <Divider />

      {/* Color Picker */}
      <Box>
        <Chip label={t('whiteboard.groups.colors', 'Colors')} size="small" sx={{ mb: 2, width: "100%" }} />
        <ColorPicker color={color} setColor={setColor} />
      </Box>

      <Divider />

      {/* Actions */}
      <Box>
        <Chip label={t('whiteboard.groups.actions', 'Actions')} size="small" sx={{ mb: 2, width: "100%" }} />
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
          <ActionButton
            onClick={onUndo}
            icon={UndoIcon}
            label={`${t('whiteboard.tools.undo', 'Undo')} (Ctrl+Z)`}
            color="primary"
            disabled={!canUndo}
          />
          <ActionButton
            onClick={onRedo}
            icon={RedoIcon}
            label={`${t('whiteboard.tools.redo', 'Redo')} (Ctrl+Y)`}
            color="primary"
            disabled={!canRedo}
          />
          <ActionButton
            onClick={onDelete}
            icon={DeleteIcon}
            label={t('whiteboard.actions.deleteSelected', 'Delete Selected')}
            color="error"
            disabled={!hasSelection}
          />
          <ActionButton
            onClick={onClear}
            icon={ClearIcon}
            label={t('whiteboard.actions.clearAll', 'Clear All')}
            color="error"
          />
        </Box>
      </Box>

      {/* Current Tool Indicator */}
      <Box sx={{ textAlign: "center", mt: "auto" }}>
        <Chip
          label={`${t('whiteboard.status.current', 'Current')}: ${tool}`}
          color="primary"
          variant="filled"
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Box>
    </Box>
  )
}
