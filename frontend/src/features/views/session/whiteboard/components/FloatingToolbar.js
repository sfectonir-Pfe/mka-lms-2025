import React from "react"
import { Box, Fade } from "@mui/material"

const FloatingToolbar = ({
  floatingToolbar,
  validSeanceId,
  toolbarContent
}) => {
  if (!floatingToolbar.open || !validSeanceId) {
    return null
  }

  return (
    <Fade in timeout={200}>
      <Box
        sx={{
          position: "absolute",
          left: floatingToolbar.left,
          top: floatingToolbar.top,
          zIndex: 1100,
          transform: "translate(-50%, -100%)",
        }}
      >
        <Box sx={{ 
          p: 1, 
          borderRadius: 3, 
          background: "rgba(255, 255, 255, 0.98)", 
          backdropFilter: "blur(20px)", 
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)" 
        }}>
          {toolbarContent}
        </Box>
      </Box>
    </Fade>
  )
}

export default FloatingToolbar


