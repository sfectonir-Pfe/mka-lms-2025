import { TOOLS } from "./constants"

export const getTextBoundingBox = (canvas, textAction) => {
  const { x, y, value } = textAction.data
  const ctx = canvas.getContext("2d")
  if (!ctx) return { left: x, top: y - 18, right: x, bottom: y + 4 }
  ctx.font = "500 18px Inter, system-ui, sans-serif"
  const width = ctx.measureText(value || "").width
  const height = 22
  return { left: x, top: y - 18, right: x + width, bottom: y + (height - 18) }
}

export const getShapeBoundingBox = (shapeAction) => {
  const { x, y, width, height } = shapeAction.data
  return { left: x, top: y, right: x + width, bottom: y + height }
}

export const getDrawBoundingBox = (drawAction) => {
  const points = drawAction?.data?.points || []
  if (!points.length) return null
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const [px, py] of points) {
    if (px < minX) minX = px
    if (py < minY) minY = py
    if (px > maxX) maxX = px
    if (py > maxY) maxY = py
  }
  return { left: minX, top: minY, right: maxX, bottom: maxY }
}

export const getTableBoundingBox = (tableAction) => {
  const { x, y, width, height } = tableAction.data
  // Use default dimensions if width/height are 0 (same logic as in WhiteboardRefactored.js)
  const effectiveWidth = width > 0 ? width : 200
  const effectiveHeight = height > 0 ? height : 150
  return { left: x, top: y, right: x + effectiveWidth, bottom: y + effectiveHeight }
}

export const drawGrid = (ctx, canvas, zoom, panOffset) => {
  const gridSize = 20
  ctx.save()
  ctx.strokeStyle = "#f5f5f5"
  ctx.lineWidth = 0.5 / zoom
  for (let x = -panOffset.x / zoom; x < (canvas.width - panOffset.x) / zoom; x += gridSize) {
    if (x < 0) continue
    ctx.beginPath()
    ctx.moveTo(x, -panOffset.y / zoom)
    ctx.lineTo(x, (canvas.height - panOffset.y) / zoom)
    ctx.stroke()
  }
  for (let y = -panOffset.y / zoom; y < (canvas.height - panOffset.y) / zoom; y += gridSize) {
    if (y < 0) continue
    ctx.beginPath()
    ctx.moveTo(-panOffset.x / zoom, y)
    ctx.lineTo((canvas.width - panOffset.x) / zoom, y)
    ctx.stroke()
  }
  ctx.restore()
}

export const renderActions = (ctx, canvas, actions, selectedIndices, tool, zoom, panOffset, hoveredTableCell = null, hoveredElement = null) => {
  actions.forEach((action, index) => {
    const isSelected = selectedIndices.includes(index)
    const isHovered = hoveredElement === index

    if (action.type === "draw") {
      const { color, points } = action.data
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5 / zoom
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.beginPath()
      points.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      if (isSelected) {
        const box = getDrawBoundingBox(action)
        if (box) {
          ctx.strokeStyle = "#1976d2"
          ctx.lineWidth = 2 / zoom
          ctx.setLineDash([5 / zoom, 5 / zoom])
          ctx.strokeRect(box.left - 2, box.top - 2, box.right - box.left + 4, box.bottom - box.top + 4)
          ctx.setLineDash([])
        }
      } else if (isHovered) {
        const box = getDrawBoundingBox(action)
        if (box) {
          ctx.strokeStyle = "rgba(25, 118, 210, 0.5)"
          ctx.lineWidth = 1.5 / zoom
          ctx.setLineDash([3 / zoom, 3 / zoom])
          ctx.strokeRect(box.left - 1, box.top - 1, box.right - box.left + 2, box.bottom - box.top + 2)
          ctx.setLineDash([])
        }
      }
    }

    if (action.type === "text") {
      const { x, y, value, color } = action.data
      ctx.font = `500 ${18 / zoom}px Inter, system-ui, sans-serif`
      ctx.fillStyle = color || "#1a1a1a"
      ctx.fillText(value, x, y)

      if (isSelected) {
        const box = getTextBoundingBox(canvas, action)
        ctx.strokeStyle = "#1976d2"
        ctx.lineWidth = 2 / zoom
        ctx.setLineDash([5 / zoom, 5 / zoom])
        ctx.strokeRect(box.left - 2, box.top - 2, box.right - box.left + 4, box.bottom - box.top + 4)
        ctx.setLineDash([])
      } else if (isHovered) {
        const box = getTextBoundingBox(canvas, action)
        ctx.strokeStyle = "rgba(25, 118, 210, 0.5)"
        ctx.lineWidth = 1.5 / zoom
        ctx.setLineDash([3 / zoom, 3 / zoom])
        ctx.strokeRect(box.left - 1, box.top - 1, box.right - box.left + 2, box.bottom - box.top + 2)
        ctx.setLineDash([])
      }
    }



    if (action.type === "shape") {
      const { x, y, width, height, color, shapeType, endX, endY } = action.data
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5 / zoom
      ctx.lineCap = "round"

      if (shapeType === TOOLS.RECTANGLE) {
        ctx.strokeRect(x, y, width, height)
      } else if (shapeType === TOOLS.CIRCLE) {
        const centerX = x + width / 2
        const centerY = y + height / 2
        const radius = Math.min(Math.abs(width), Math.abs(height)) / 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.stroke()
      } else if (shapeType === TOOLS.ARROW) {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        const angle = Math.atan2(endY - y, endX - x)
        const headLength = 15 / zoom
        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - headLength * Math.cos(angle - Math.PI / 6),
          endY - headLength * Math.sin(angle - Math.PI / 6),
        )
        ctx.moveTo(endX, endY)
        ctx.lineTo(
          endX - headLength * Math.cos(angle + Math.PI / 6),
          endY - headLength * Math.sin(angle + Math.PI / 6),
        )
        ctx.stroke()
      }

      if (isSelected) {
        ctx.strokeStyle = "#1976d2"
        ctx.lineWidth = 2 / zoom
        ctx.setLineDash([5 / zoom, 5 / zoom])
        if (shapeType === TOOLS.ARROW) {
          const minX = Math.min(x, endX) - 10
          const minY = Math.min(y, endY) - 10
          const maxX = Math.max(x, endX) + 10
          const maxY = Math.max(y, endY) + 10
          ctx.strokeRect(minX, minY, maxX - minX, maxY - minY)
        } else {
          ctx.strokeRect(x - 2, y - 2, width + 4, height + 4)
        }
        ctx.setLineDash([])
      } else if (isHovered) {
        ctx.strokeStyle = "rgba(25, 118, 210, 0.5)"
        ctx.lineWidth = 1.5 / zoom
        ctx.setLineDash([3 / zoom, 3 / zoom])
        if (shapeType === TOOLS.ARROW) {
          const minX = Math.min(x, endX) - 8
          const minY = Math.min(y, endY) - 8
          const maxX = Math.max(x, endX) + 8
          const maxY = Math.max(y, endY) + 8
          ctx.strokeRect(minX, minY, maxX - minX, maxY - minY)
        } else {
          ctx.strokeRect(x - 1, y - 1, width + 2, height + 2)
        }
        ctx.setLineDash([])
      }
    }

    if (action.type === "table") {
      const { x, y, width, height, color, rows, columns, cells = {} } = action.data
      
      // Use default dimensions if width/height are 0 (same logic as in WhiteboardRefactored.js)
      const effectiveWidth = width > 0 ? width : 200
      const effectiveHeight = height > 0 ? height : 150
      
      // Draw table border
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5 / zoom
      ctx.strokeRect(x, y, effectiveWidth, effectiveHeight)
      
      // Draw vertical lines
      const colWidth = effectiveWidth / columns
      for (let i = 1; i < columns; i++) {
        ctx.beginPath()
        ctx.moveTo(x + i * colWidth, y)
        ctx.lineTo(x + i * colWidth, y + effectiveHeight)
        ctx.stroke()
      }
      
      // Draw horizontal lines
      const rowHeight = effectiveHeight / rows
      for (let i = 1; i < rows; i++) {
        ctx.beginPath()
        ctx.moveTo(x, y + i * rowHeight)
        ctx.lineTo(x + effectiveWidth, y + i * rowHeight)
        ctx.stroke()
      }

      // Draw cell text
      ctx.font = `500 ${Math.max(12, 14 / zoom)}px Inter, system-ui, sans-serif`
      ctx.fillStyle = color || "#1a1a1a"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const cellKey = `${row}-${col}`
          const cellText = cells[cellKey]
          if (cellText) {
            const cellX = x + col * colWidth + colWidth / 2
            const cellY = y + row * rowHeight + rowHeight / 2
            ctx.fillText(cellText, cellX, cellY)
          }
        }
      }

      if (isSelected) {
        ctx.strokeStyle = "#1976d2"
        ctx.lineWidth = 2 / zoom
        ctx.setLineDash([5 / zoom, 5 / zoom])
        ctx.strokeRect(x - 2, y - 2, effectiveWidth + 4, effectiveHeight + 4)
        ctx.setLineDash([])
      } else if (isHovered) {
        ctx.strokeStyle = "rgba(25, 118, 210, 0.5)"
        ctx.lineWidth = 1.5 / zoom
        ctx.setLineDash([3 / zoom, 3 / zoom])
        ctx.strokeRect(x - 1, y - 1, effectiveWidth + 2, effectiveHeight + 2)
        ctx.setLineDash([])
      }

      // Draw hover effect for table cells
      if (hoveredTableCell && hoveredTableCell.tableIndex === index) {
        const { cellX, cellY, cellWidth, cellHeight } = hoveredTableCell
        ctx.fillStyle = "rgba(25, 118, 210, 0.1)"
        ctx.fillRect(cellX, cellY, cellWidth, cellHeight)
        ctx.strokeStyle = "#1976d2"
        ctx.lineWidth = 1.5 / zoom
        ctx.strokeRect(cellX, cellY, cellWidth, cellHeight)
      }
    }
  })
}

export const renderCurrentShape = (ctx, currentShape, zoom) => {
  if (!currentShape) return
  const { x, y, width, height, color, shapeType, endX, endY, rows, columns } = currentShape.data
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5 / zoom
  ctx.lineCap = "round"
  ctx.setLineDash([5 / zoom, 5 / zoom])

  if (shapeType === TOOLS.RECTANGLE) {
    ctx.strokeRect(x, y, width, height)
  } else if (shapeType === TOOLS.CIRCLE) {
    const centerX = x + width / 2
    const centerY = y + height / 2
    const radius = Math.min(Math.abs(width), Math.abs(height)) / 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()
  } else if (shapeType === TOOLS.ARROW) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  } else if (shapeType === TOOLS.TABLE) {
    // Use default dimensions if width/height are 0 (same logic as in WhiteboardRefactored.js)
    const effectiveWidth = width > 0 ? width : 200
    const effectiveHeight = height > 0 ? height : 150
    
    // Draw table border
    ctx.strokeRect(x, y, effectiveWidth, effectiveHeight)
    
    // Draw vertical lines
    const colWidth = effectiveWidth / columns
    for (let i = 1; i < columns; i++) {
      ctx.beginPath()
      ctx.moveTo(x + i * colWidth, y)
      ctx.lineTo(x + i * colWidth, y + effectiveHeight)
      ctx.stroke()
    }
    
    // Draw horizontal lines
    const rowHeight = effectiveHeight / rows
    for (let i = 1; i < rows; i++) {
      ctx.beginPath()
      ctx.moveTo(x, y + i * rowHeight)
      ctx.lineTo(x + effectiveWidth, y + i * rowHeight)
      ctx.stroke()
    }
    
    // Draw cell text for current shape (if any)
    const cells = currentShape.data.cells || {}
    ctx.font = `500 ${Math.max(12, 14 / zoom)}px Inter, system-ui, sans-serif`
    ctx.fillStyle = color || "#1a1a1a"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const cellKey = `${row}-${col}`
        const cellText = cells[cellKey]
        if (cellText) {
          const cellX = x + col * colWidth + colWidth / 2
          const cellY = y + row * rowHeight + rowHeight / 2
          ctx.fillText(cellText, cellX, cellY)
        }
      }
    }
  }

  ctx.setLineDash([])
}

