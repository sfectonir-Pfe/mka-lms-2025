import React, { forwardRef, useEffect } from "react"
import { Box, Paper, Fade } from "@mui/material"
import { drawGrid, renderActions, renderCurrentShape } from "../canvasUtils"

const ModernCanvas = forwardRef(({
  width = 1000,
  height = 600,
  actions = [],
  selectedElements = [],
  currentShape = null,
  selectionBox = null,
  tool = "pen",
  zoom = 1,
  panOffset = { x: 0, y: 0 },
  hoveredTableCell = null,
  hoveredElement = null,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onContextMenu,
  cursor = "default",
  isMobile = false,
  className = "",
}, ref) => {
  
  // Canvas rendering effect
  useEffect(() => {
    const canvas = ref?.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.save()
    ctx.scale(zoom, zoom)
    ctx.translate(panOffset.x / zoom, panOffset.y / zoom)

    // Draw grid
    drawGrid(ctx, canvas, zoom, panOffset)

    // Render all actions
    renderActions(ctx, canvas, actions, selectedElements, tool, zoom, panOffset, hoveredTableCell, hoveredElement)

    // Render current shape being drawn
    renderCurrentShape(ctx, currentShape, zoom)

    // Draw selection box
    if (selectionBox) {
      const { startX, startY, endX, endY } = selectionBox
      ctx.strokeStyle = "#667eea"
      ctx.lineWidth = 2 / zoom
      ctx.setLineDash([8 / zoom, 8 / zoom])
      ctx.strokeRect(
        Math.min(startX, endX),
        Math.min(startY, endY),
        Math.abs(endX - startX),
        Math.abs(endY - startY)
      )
      ctx.setLineDash([])
    }

    ctx.restore()
  }, [actions, zoom, panOffset, selectedElements, currentShape, selectionBox, tool, hoveredTableCell, hoveredElement, ref])

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={16}
        sx={{
          p: isMobile ? 1 : 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: isMobile ? 0 : 4,
          height: isMobile ? "calc(100vh - 64px)" : "auto",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          overflow: "hidden",
        }}
        className={className}
      >
        <canvas
          ref={ref}
          width={width}
          height={height}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onContextMenu={onContextMenu}
          style={{
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 16,
            backgroundColor: "white",
            cursor: cursor,
            boxShadow: "inset 0 4px 8px rgba(0,0,0,0.1)",
            width: "100%",
            height: "100%",
            transition: "all 0.3s ease",
          }}
        />
      </Paper>
    </Fade>
  )
})

ModernCanvas.displayName = "ModernCanvas"

export default ModernCanvas
