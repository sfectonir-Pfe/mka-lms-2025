import { Box, Fab, Tooltip, Typography } from "@mui/material"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong"
import PanToolIcon from "@mui/icons-material/PanTool"

import { TOOLS } from "./constants"

export function ZoomControls({ tool, setTool, onZoomIn, onZoomOut, onReset, isSidebar = false }) {
  if (isSidebar) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
        <Tooltip title="Zoom In" placement="left">
          <Fab 
            size="small" 
            onClick={onZoomIn} 
            sx={{ 
              bgcolor: "white",
              width: 40,
              height: 40,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#f5f5f5",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              }
            }}
          >
            <ZoomInIcon sx={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="left">
          <Fab 
            size="small" 
            onClick={onZoomOut} 
            sx={{ 
              bgcolor: "white",
              width: 40,
              height: 40,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#f5f5f5",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              }
            }}
          >
            <ZoomOutIcon sx={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>
        <Tooltip title="Reset View" placement="left">
          <Fab 
            size="small" 
            onClick={onReset} 
            sx={{ 
              bgcolor: "white",
              width: 40,
              height: 40,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#f5f5f5",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              }
            }}
          >
            <CenterFocusStrongIcon sx={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>
        <Tooltip title="Pan Tool" placement="left">
          <Fab 
            size="small" 
            onClick={() => setTool(TOOLS.PAN)} 
            color={tool === TOOLS.PAN ? "primary" : "default"} 
            sx={{ 
              bgcolor: tool === TOOLS.PAN ? undefined : "white",
              width: 40,
              height: 40,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: tool === TOOLS.PAN ? undefined : "#f5f5f5",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              }
            }}
          >
            <PanToolIcon sx={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>
      </Box>
    )
  }

  return (
    <Box sx={{ position: "absolute", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 1 }}>
      <Tooltip title="Zoom In">
        <Fab size="small" onClick={onZoomIn} sx={{ bgcolor: "white" }}>
          <ZoomInIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <Fab size="small" onClick={onZoomOut} sx={{ bgcolor: "white" }}>
          <ZoomOutIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Reset View">
        <Fab size="small" onClick={onReset} sx={{ bgcolor: "white" }}>
          <CenterFocusStrongIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Pan Tool">
        <Fab size="small" onClick={() => setTool(TOOLS.PAN)} color={tool === TOOLS.PAN ? "primary" : "default"} sx={{ bgcolor: tool === TOOLS.PAN ? undefined : "white" }}>
          <PanToolIcon />
        </Fab>
      </Tooltip>

    </Box>
  )
}

export function ZoomIndicator({ zoom }) {
  return (
    <Box sx={{ position: "absolute", bottom: 20, left: 20, bgcolor: "rgba(255,255,255,0.9)", px: 2, py: 1, borderRadius: 2, backdropFilter: "blur(10px)" }}>
      <Typography variant="caption" sx={{ fontWeight: 600 }}>
        {Math.round(zoom * 100)}%
      </Typography>
    </Box>
  )
}

