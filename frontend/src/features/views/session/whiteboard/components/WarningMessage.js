import React from "react"
import { Box } from "@mui/material"

const WarningMessage = ({ validSeanceId }) => {
  if (validSeanceId) {
    return null
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: 4,
        border: "1px solid rgba(255, 0, 0, 0.3)",
        p: 3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <p style={{ color: 'red', margin: 0, textAlign: 'center' }}>
        ⚠️ Aucun ID de séance valide fourni
      </p>
    </Box>
  )
}

export default WarningMessage


