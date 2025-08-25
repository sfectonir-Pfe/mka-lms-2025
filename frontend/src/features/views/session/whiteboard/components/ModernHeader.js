import React, { useState } from "react"
import { Box, Typography, IconButton, Tooltip, Chip, useTheme } from "@mui/material"
import { useTranslation } from "react-i18next"
import {
  Group as GroupIcon,
  Help as HelpIcon,
} from "@mui/icons-material"
import { TOOLS } from "../constants"
import HelpDialog from "./HelpDialog"

const getToolIcon = (tool) => {
  switch (tool) {
    case TOOLS.PEN:
      return "✏️"
    case TOOLS.TEXT:
      return "T"
    case TOOLS.RECTANGLE:
      return "⬜"
    case TOOLS.CIRCLE:
      return "⭕"
    case TOOLS.ARROW:
      return "➡️"
    case TOOLS.SELECT:
      return "👆"
    case TOOLS.PAN:
      return "✋"

    default:
      return "🖱️"
  }
}

const getToolName = (tool) => {
  switch (tool) {
    case TOOLS.PEN:
      return "Pen"
    case TOOLS.TEXT:
      return "Text"
    case TOOLS.RECTANGLE:
      return "Rectangle"
    case TOOLS.CIRCLE:
      return "Circle"
    case TOOLS.ARROW:
      return "Arrow"
    case TOOLS.SELECT:
      return "Select"
    case TOOLS.PAN:
      return "Pan"

    default:
      return "Tool"
  }
}

export default function ModernHeader({
  title,
  subtitle,
  seanceId,
  participants,
  isMobile = false,
  currentTool = TOOLS.PEN,
}) {
  const theme = useTheme()
  const { t } = useTranslation()
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <Box
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        p: isMobile ? 2 : 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Left side - Title and Session Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
        <Box>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              opacity: 0.8,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/* Current Tool Indicator */}
        <Chip
          icon={<span style={{ fontSize: "1.2em" }}>{getToolIcon(currentTool)}</span>}
          label={t(`whiteboard.tools.${getToolName(currentTool).toLowerCase()}`, getToolName(currentTool))}
          color="primary"
          variant="filled"
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
            height: 32,
            "& .MuiChip-icon": {
              fontSize: "1.2em",
              margin: 0,
            },
          }}
        />
      </Box>

      {/* Center - Session ID */}
      {seanceId && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
            background: "rgba(124, 58, 237, 0.1)",
            borderRadius: 2,
            border: "1px solid rgba(124, 58, 237, 0.2)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t('whiteboard.sessionLabel', 'Session')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              fontFamily: "monospace",
              fontSize: "1.1rem",
            }}
          >
            #{seanceId}
          </Typography>
        </Box>
      )}

      {/* Right side - Actions and Participants */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Participants Count */}
        <Chip
          icon={<GroupIcon />}
          label={participants}
          color="secondary"
          variant="outlined"
          size="small"
          sx={{ fontWeight: 600 }}
        />

        {/* Help Button */}
        <Tooltip title={t('whiteboard.help', 'Aide et raccourcis')} placement="bottom">
          <IconButton
            onClick={() => setHelpOpen(true)}
            sx={{
              color: "primary.main",
              backgroundColor: "rgba(25, 118, 210, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.2)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Help Dialog */}
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </Box>
  )
}
