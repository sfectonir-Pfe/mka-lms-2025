import React from "react"
import { Box, useMediaQuery, useTheme, Drawer, Fade } from "@mui/material"
import ModernHeader from "./ModernHeader"
import ModernToolbar from "./ModernToolbar"
import { ZoomControls, ZoomIndicator } from "../ZoomControls"

const WhiteboardLayout = ({
  children,
  seanceId,
  seanceIdDisplay,
  isMobile,
  mobileDrawerOpen,
  setMobileDrawerOpen,
  tool,
  setTool,
  toolbarContent,
  validSeanceId,
  onZoomIn,
  onZoomOut,
  onReset,
  zoom
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        "& @keyframes pulse": {
          "0%": { opacity: 1 },
          "50%": { opacity: 0.5 },
          "100%": { opacity: 1 },
        },
      }}
    >
      {/* Modern Header */}
      <ModernHeader
        title="Collaborative Whiteboard"
        subtitle={validSeanceId ? "Real-time collaboration workspace" : "No valid ID"}
        seanceId={seanceIdDisplay && seanceIdDisplay.length >= 6 ? seanceIdDisplay.slice(-6) : seanceIdDisplay}
        participants={1}
        isMobile={isMobile}
        currentTool={tool}
      />

      <Box sx={{ display: "flex", flex: 1, gap: isMobile ? 0 : 3, p: isMobile ? 0 : 3, pt: 0 }}>
        {/* Toolbar */}
        {!isMobile && validSeanceId && (
          <Fade in timeout={500}>
            <Box
              sx={{
                width: 280,
                height: "fit-content",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                p: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              {toolbarContent}
            </Box>
          </Fade>
        )}

        {/* Mobile Drawer */}
        {validSeanceId && (
          <Drawer
            anchor="left"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 280,
                p: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
              },
            }}
          >
            {toolbarContent}
          </Drawer>
        )}

        {/* Main Content Area */}
        <Box sx={{ flex: 1, position: "relative" }}>
          {children}
          
          {/* Zoom Indicator only */}
          {validSeanceId && (
            <ZoomIndicator zoom={zoom} />
          )}
        </Box>

        {/* Side Zoom Controls for Desktop */}
        {!isMobile && validSeanceId && (
          <Fade in timeout={500}>
            <Box
              sx={{
                width: 60,
                height: "fit-content",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                p: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignSelf: "flex-start",
                mt: 2,
              }}
            >
              <ZoomControls 
                tool={tool} 
                setTool={setTool}
                onZoomIn={onZoomIn}
                onZoomOut={onZoomOut}
                onReset={onReset}
                isSidebar={true}
              />
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  )
}

export default WhiteboardLayout


