import React from "react"
import { Box, Typography, Paper } from "@mui/material"
import TableControls from "./TableControls"

const TableControlsDemo = () => {
  const mockTableAction = {
    type: "table",
    data: {
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      rows: 3,
      columns: 4,
      color: "#1976d2",
      cells: {
        "0-0": "A1",
        "0-1": "B1",
        "0-2": "C1",
        "0-3": "D1",
        "1-0": "A2",
        "1-1": "B2",
        "1-2": "C2",
        "1-3": "D2",
        "2-0": "A3",
        "2-1": "B3",
        "2-2": "C3",
        "2-3": "D3"
      }
    }
  }

  const handleAddRow = (tableIndex) => {
    console.log("Adding row to table:", tableIndex)
  }

  const handleAddColumn = (tableIndex) => {
    console.log("Adding column to table:", tableIndex)
  }

  const handleResizeTable = (e, tableIndex, direction) => {
    console.log("Resizing table:", tableIndex, "direction:", direction)
  }

  const handleDragTable = (e, tableIndex) => {
    console.log("Dragging table:", tableIndex)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Table Controls Demo
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ce composant démontre les contrôles de tableau avec :
      </Typography>
      <ul>
        <li>Boutons (+) pour ajouter des lignes et colonnes</li>
        <li>Poignées de redimensionnement aux coins et milieux des côtés</li>
        <li>Poignée de déplacement au centre</li>
      </ul>
      
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          width: 500,
          height: 400,
          border: "2px solid #ccc",
          mt: 2
        }}
      >
        {/* Mock canvas area */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Zone Canvas (Zoom: 1x, Pan: 0,0)
          </Typography>
        </Box>

        {/* Table Controls */}
        <TableControls
          tableAction={mockTableAction}
          tableIndex={0}
          isSelected={true}
          zoom={1}
          panOffset={{ x: 0, y: 0 }}
          onAddRow={handleAddRow}
          onAddColumn={handleAddColumn}
          onResizeTable={handleResizeTable}
          onDragTable={handleDragTable}
        />

        {/* Mock table visualization */}
        <Box
          sx={{
            position: "absolute",
            left: 100,
            top: 100,
            width: 300,
            height: 200,
            border: "2px solid #1976d2",
            backgroundColor: "rgba(25, 118, 210, 0.05)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            zIndex: 1
          }}
        >
          {Array.from({ length: 12 }, (_, i) => {
            const row = Math.floor(i / 4)
            const col = i % 4
            const cellKey = `${row}-${col}`
            const cellText = mockTableAction.data.cells[cellKey] || ""
            
            return (
              <Box
                key={i}
                sx={{
                  border: "1px solid #1976d2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "#1976d2",
                  backgroundColor: "rgba(255, 255, 255, 0.8)"
                }}
              >
                {cellText}
              </Box>
            )
          })}
        </Box>
      </Paper>
    </Box>
  )
}

export default TableControlsDemo


