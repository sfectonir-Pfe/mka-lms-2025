
import React from "react"
import { Box, IconButton, Tooltip } from "@mui/material"
import { 
  Add as AddIcon
} from "@mui/icons-material"

const TableControls = ({ 
  tableAction, 
  tableIndex, 
  isSelected, 
  zoom, 
  panOffset, 
  onAddRow, 
  onAddColumn, 
  onResizeTable,
  onDragTable 
}) => {
  if (!isSelected || !tableAction || tableAction.type !== "table") {
    return null
  }

  const { x, y, width, height, rows, columns } = tableAction.data
  
  // Calculate positions with zoom and pan
  const scaledX = x * zoom + panOffset.x
  const scaledY = y * zoom + panOffset.y
  
  // Use default dimensions if width/height are 0 (same logic as in WhiteboardRefactored.js)
  const effectiveWidth = (width > 0 ? width : 200) * zoom
  const effectiveHeight = (height > 0 ? height : 150) * zoom

  const buttonSize = 36

  // Remplacer le calcul complexe par ceci pour tester :
  const finalOffsetX = 0
  const finalOffsetY = 0

  return (
    <>
      {/* Add Row Button (top-left) */}
      <Box
        sx={{
          position: "absolute",
          left: finalOffsetX + scaledX - buttonSize / 2 - 10,
          top: finalOffsetY + scaledY - buttonSize / 2 - 10,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Ajouter une ligne" arrow>
          <IconButton
            size="small"
            onClick={() => onAddRow(tableIndex)}
            sx={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              border: "2px solid #1976d2",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
                transform: "scale(1.1)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <AddIcon sx={{ transform: "rotate(90deg)", fontSize: 20, color: "#1976d2" }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Add Column Button (top-left, below row button) */}
      <Box
        sx={{
          position: "absolute",
          left: finalOffsetX + scaledX - buttonSize / 2 - 10,
          top: finalOffsetY + scaledY + buttonSize / 2 + 10,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Ajouter une colonne" arrow>
          <IconButton
            size="small"
            onClick={() => onAddColumn(tableIndex)}
            sx={{
              width: buttonSize,
              height: buttonSize,
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              border: "2px solid #1976d2",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
                transform: "scale(1.1)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <AddIcon sx={{ fontSize: 20, color: "#1976d2" }} />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  )
}

export default TableControls 