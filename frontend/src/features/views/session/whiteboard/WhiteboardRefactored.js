import React, { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import { TOOLS } from "./constants"
import { 
  getTextBoundingBox, 
  getShapeBoundingBox, 
  getDrawBoundingBox,
  getTableBoundingBox
} from "./canvasUtils"

// Custom hooks
import { useWhiteboardState } from "./hooks/useWhiteboardState"
import { useDrawingState } from "./hooks/useDrawingState"
import { useHistory } from "./hooks/useHistory"
import { useSocketConnection } from "./hooks/useSocketConnection"

// Components
import WhiteboardLayout from "./components/WhiteboardLayout"
import CanvasArea from "./components/CanvasArea"
import InputOverlays from "./components/InputOverlays"
import FloatingToolbar from "./components/FloatingToolbar"
import WarningMessage from "./components/WarningMessage"
import TableConfigDialog from "./components/TableConfigDialog"
import ModernToolbar from "./components/ModernToolbar"

// Helper function for table cell position detection
const getTableCellAtPosition = (x, y, actions) => {
  console.log("getTableCellAtPosition called with:", { x, y, actionsCount: actions.length })
  
  for (let i = actions.length - 1; i >= 0; i--) {
    const action = actions[i]
    if (action.type === "table") {
      const { x: tableX, y: tableY, width, height, rows, columns } = action.data
      
      const effectiveWidth = width > 0 ? width : 200
      const effectiveHeight = height > 0 ? height : 150
      
      const cellWidth = effectiveWidth / columns
      const cellHeight = effectiveHeight / rows
      
      console.log("Checking table:", { tableX, tableY, effectiveWidth, effectiveHeight, cellWidth, cellHeight, rows, columns })
      
      if (x >= tableX && x <= tableX + effectiveWidth && y >= tableY && y <= tableY + effectiveHeight) {
        const col = Math.floor((x - tableX) / cellWidth)
        const row = Math.floor((y - tableY) / cellHeight)
        
        console.log("Point inside table, calculated cell:", { col, row })
        
        if (col >= 0 && col < columns && row >= 0 && row < rows) {
          const result = {
            tableIndex: i,
            row,
            col,
            tableX,
            tableY,
            cellWidth,
            cellHeight,
            cellX: tableX + col * cellWidth,
            cellY: tableY + row * cellHeight
          }
          console.log("Returning cell:", result)
          return result
        }
      }
    }
  }
  console.log("No cell found")
  return null
}

export default function WhiteboardRefactored({ seanceId, userId }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  
  // Ensure seanceId is a valid number
  const validSeanceId = seanceId && !isNaN(Number(seanceId)) ? Number(seanceId) : null
  const seanceIdDisplay = validSeanceId ? String(validSeanceId) : ""

  // Refs
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const canvasContainerRef = useRef(null)

  // State hooks
  const whiteboardState = useWhiteboardState()
  const drawingState = useDrawingState()
  const { pushHistory, undo, redo, pastStates, futureStates } = useHistory(whiteboardState.actions)

  // Destructure state
  const { 
    tool, setTool, color, setColor, actions, setActions, 
    selectedElements, setSelectedElements, zoom, setZoom, 
    panOffset, setPanOffset 
  } = whiteboardState

  const { 
    drawing, setDrawing, shapeStart, setShapeStart, currentShape, setCurrentShape,
    textPos, setTextPos, showTextInput, setShowTextInput, currentText, setCurrentText,
    tableConfig, setTableConfig, showTableConfig, setShowTableConfig,
    editingTableCell, setEditingTableCell, editingCellText, setEditingCellText 
  } = drawingState

  // Additional state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [floatingToolbar, setFloatingToolbar] = useState({ open: false, left: 0, top: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionBox, setSelectionBox] = useState(null)
  const [isDraggingSelection, setIsDraggingSelection] = useState(false)
  const [selectionDragStart, setSelectionDragStart] = useState({ x: 0, y: 0 })
  const [selectionInitial, setSelectionInitial] = useState([])
  const [hoveredTableCell, setHoveredTableCell] = useState(null)
  const [hoveredElement, setHoveredElement] = useState(null)
  const [isResizingTable, setIsResizingTable] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 })
  const [resizeDirection, setResizeDirection] = useState(null)
  const [isDraggingTable, setIsDraggingTable] = useState(false)
  const [tableDragStart, setTableDragStart] = useState({ x: 0, y: 0 })

  // Socket connection
  const socket = useSocketConnection(validSeanceId, setActions)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!validSeanceId) return
      
      // Prevent shortcuts when typing in text inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      
      switch (e.key.toLowerCase()) {
        case 's':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            setTool(TOOLS.SELECT)
          }
          break
        case 'p':
          e.preventDefault()
          setTool(TOOLS.PEN)
          break
        case 't':
          e.preventDefault()
          setTool(TOOLS.TEXT)
          break
        case 'r':
          e.preventDefault()
          setTool(TOOLS.RECTANGLE)
          break
        case 'c':
          e.preventDefault()
          setTool(TOOLS.CIRCLE)
          break
        case 'a':
          e.preventDefault()
          setTool(TOOLS.ARROW)
          break
        case 'escape':
          e.preventDefault()
          setSelectedElements([])
          setTool(TOOLS.SELECT)
          break
        case 'delete':
        case 'backspace':
          if (selectedElements.length > 0) {
            e.preventDefault()
            const idsToDelete = selectedElements
              .map(index => actions[index]?.id)
              .filter(Boolean)
            setActions(prev => prev.filter((_, index) => !selectedElements.includes(index)))
            setSelectedElements([])
            if (socket && validSeanceId && idsToDelete.length > 0) {
              socket.emit("whiteboard-delete", { seanceId: validSeanceId, ids: idsToDelete })
            }
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [validSeanceId, setTool, selectedElements, actions, socket, setActions, setSelectedElements])

  // Utility functions
  const transformCoordinates = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    const rect = canvas?.getBoundingClientRect()
    if (!canvas || !rect) return { x: 0, y: 0 }

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = ((clientX - rect.left) * scaleX - panOffset.x) / zoom
    const y = ((clientY - rect.top) * scaleY - panOffset.y) / zoom
    return { x, y }
  }, [zoom, panOffset])

  const openFloatingToolbarAt = useCallback((clientX, clientY) => {
    if (!validSeanceId) return
    
    const container = containerRef.current
    const containerRect = container?.getBoundingClientRect()
    if (!containerRect) return
    setFloatingToolbar({
      open: true,
      left: clientX - containerRect.left,
      top: clientY - containerRect.top,
    })
  }, [validSeanceId])

  // Table manipulation functions
  const handleAddRow = useCallback((tableIndex) => {
    if (!validSeanceId) return
    
    setActions(prev => prev.map((action, index) => {
      if (index === tableIndex && action.type === "table") {
        const updatedAction = { ...action }
        updatedAction.data.rows += 1
        
        const newCells = { ...updatedAction.data.cells }
        for (let col = 0; col < updatedAction.data.columns; col++) {
          const newRow = updatedAction.data.rows - 1
          const cellKey = `${newRow}-${col}`
          newCells[cellKey] = ""
        }
        
        updatedAction.data.cells = newCells
        
        if (socket) {
          socket.emit("whiteboard-action", updatedAction)
        }
        
        return updatedAction
      }
      return action
    }))
  }, [validSeanceId, socket, setActions])

  const handleAddColumn = useCallback((tableIndex) => {
    if (!validSeanceId) return
    
    setActions(prev => prev.map((action, index) => {
      if (index === tableIndex && action.type === "table") {
        const updatedAction = { ...action }
        updatedAction.data.columns += 1
        
        const newCells = { ...updatedAction.data.cells }
        for (let row = 0; row < updatedAction.data.rows; row++) {
          const newCol = updatedAction.data.columns - 1
          const cellKey = `${row}-${newCol}`
          newCells[cellKey] = ""
        }
        
        updatedAction.data.cells = newCells
        
        if (socket) {
          socket.emit("whiteboard-action", updatedAction)
        }
        
        return updatedAction
      }
      return action
    }))
  }, [validSeanceId, socket, setActions])

  const handleResizeTable = useCallback((e, tableIndex, direction) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!validSeanceId) return
    
    setIsResizingTable(true)
    setResizeDirection(direction)
    setResizeStart({ x: e.clientX, y: e.clientY })
    
    const tableAction = actions[tableIndex]
    if (tableAction && tableAction.type === "table") {
      setTableDragStart({
        x: tableAction.data.x,
        y: tableAction.data.y,
        width: tableAction.data.width,
        height: tableAction.data.height
      })
    }
  }, [validSeanceId, actions, setIsResizingTable, setResizeDirection, setResizeStart, setTableDragStart])

  const handleDragTable = useCallback((e, tableIndex) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!validSeanceId) return
    
    setIsDraggingTable(true)
    const { x, y } = transformCoordinates(e.clientX, e.clientY)
    setTableDragStart({ x, y })
  }, [validSeanceId, transformCoordinates, setIsDraggingTable, setTableDragStart])

  // Event handlers
  const handlePointerDown = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.button === 0 && floatingToolbar.open) {
      setFloatingToolbar(ft => ({ ...ft, open: false }))
    }

    if (e.button === 2) {
      openFloatingToolbarAt(e.clientX, e.clientY)
      return
    }

    const { x, y } = transformCoordinates(e.clientX, e.clientY)

    // Pan tool
    if (tool === TOOLS.PAN) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
      return
    }

    // Check for table cell clicks first (regardless of tool)
    if (!editingTableCell && !isResizingTable && !isDraggingTable) {
      const clickedCell = getTableCellAtPosition(x, y, actions)
      console.log("Clicked cell:", clickedCell, "at position:", { x, y }, "actions:", actions.length)
      if (clickedCell) {
        // Start editing the cell
        const cellKey = `${clickedCell.row}-${clickedCell.col}`
        const tableAction = actions[clickedCell.tableIndex]
        const currentCellText = tableAction.data.cells?.[cellKey] || ""
        
        console.log("Starting cell edit:", { cellKey, currentCellText, tableAction })
        
        setEditingTableCell({
          tableIndex: clickedCell.tableIndex,
          row: clickedCell.row,
          col: clickedCell.col,
          cellX: clickedCell.cellX,
          cellY: clickedCell.cellY,
          cellWidth: clickedCell.cellWidth,
          cellHeight: clickedCell.cellHeight
        })
        setEditingCellText(currentCellText)
        return
      }
    }

    // Selection tool
    if (tool === TOOLS.SELECT) {
      if (editingTableCell || isResizingTable || isDraggingTable) {
        return
      }

      // Enhanced hit testing with better coordinate handling
      let hitIndex = -1
      let bestDistance = Infinity
      
      for (let i = actions.length - 1; i >= 0; i -= 1) {
        const action = actions[i]
        let distance = Infinity
        let hit = false
        
        if (action.type === "text") {
          const box = getTextBoundingBox(canvasRef.current, action)
          if (x >= box.left - 15 && x <= box.right + 15 && 
              y >= box.top - 15 && y <= box.bottom + 15) {
            hit = true
            distance = Math.sqrt(
              Math.pow(x - (box.left + box.right) / 2, 2) +
              Math.pow(y - (box.top + box.bottom) / 2, 2)
            )
          }
        } else if (action.type === "shape") {
          const box = getShapeBoundingBox(action)
          if (x >= box.left - 15 && x <= box.right + 15 && 
              y >= box.top - 15 && y <= box.bottom + 15) {
            hit = true
            distance = Math.sqrt(
              Math.pow(x - (box.left + box.right) / 2, 2) +
              Math.pow(y - (box.top + box.bottom) / 2, 2)
            )
          }
        } else if (action.type === "draw") {
          const box = getDrawBoundingBox(action)
          if (box && x >= box.left - 15 && x <= box.right + 15 && 
              y >= box.top - 15 && y <= box.bottom + 15) {
            hit = true
            distance = Math.sqrt(
              Math.pow(x - (box.left + box.right) / 2, 2) +
              Math.pow(y - (box.top + box.bottom) / 2, 2)
            )
          }
        } else if (action.type === "table") {
          const box = getTableBoundingBox(action)
          if (x >= box.left - 15 && x <= box.right + 15 && 
              y >= box.top - 15 && y <= box.bottom + 15) {
            hit = true
            distance = Math.sqrt(
              Math.pow(x - (box.left + box.right) / 2, 2) +
              Math.pow(y - (box.top + box.bottom) / 2, 2)
            )
          }
        }
        
        if (hit && distance < bestDistance) {
          bestDistance = distance
          hitIndex = i
        }
      }

      if (hitIndex !== -1 && bestDistance < 100) {
        if (!selectedElements.includes(hitIndex)) {
          setSelectedElements([hitIndex])
        }
        setIsDraggingSelection(true)
        setSelectionDragStart({ x, y })
        setSelectionInitial(selectedElements.map(i => ({ ...actions[i] })))
        return
      }

      // If no element was hit, start selection box
      setIsSelecting(true)
      setSelectionBox({ startX: x, startY: y, endX: x, endY: y })
      setSelectedElements([])
      return
    }

    // Drawing tools
    if (tool === TOOLS.PEN) {
      if (!validSeanceId) return
      pushHistory()
      setDrawing(true)
      const newStroke = {
        type: "draw",
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        data: { color, points: [[x, y]] },
        seanceId: validSeanceId,
        createdById: userId,
      }
      setActions(prev => [...prev, newStroke])
      if (socket) socket.emit("whiteboard-action", newStroke)
    }

    // Shape tools
    if ([TOOLS.RECTANGLE, TOOLS.CIRCLE, TOOLS.ARROW].includes(tool)) {
      if (!validSeanceId) return
      pushHistory()
      setShapeStart({ x, y })
      setCurrentShape({
        type: "shape",
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        data: { shapeType: tool, x, y, width: 0, height: 0, color, endX: x, endY: y },
        seanceId: validSeanceId,
        createdById: userId,
      })
    }

    // Table tool
    if (tool === TOOLS.TABLE) {
      if (!validSeanceId) return
      pushHistory()
      setShapeStart({ x, y })
      setCurrentShape({
        type: "table",
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        data: { 
          shapeType: tool, 
          x, y, 
          width: 0, height: 0, 
          color, 
          rows: tableConfig.rows, 
          columns: tableConfig.columns,
          cells: {}
        },
        seanceId: validSeanceId,
        createdById: userId,
      })
    }

    // Text tool
    if (tool === TOOLS.TEXT) {
      pushHistory()
      setTextPos({ x, y })
      setShowTextInput(true)
    }
  }, [tool, color, validSeanceId, userId, actions, selectedElements, panOffset, pushHistory, socket, transformCoordinates, openFloatingToolbarAt, floatingToolbar.open, tableConfig, setActions, setDrawing, setShapeStart, setCurrentShape, setTextPos, setShowTextInput, setSelectedElements, setIsPanning, setPanStart, setIsDraggingSelection, setSelectionDragStart, setIsSelecting, setSelectionBox, setSelectionInitial])

  const handlePointerMove = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const { x, y } = transformCoordinates(e.clientX, e.clientY)

    // Panning
    if (isPanning && tool === TOOLS.PAN) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
      return
    }

    // Table resizing
    if (isResizingTable && resizeDirection && selectedElements.length === 1) {
      const tableIndex = selectedElements[0]
      const tableAction = actions[tableIndex]
      if (tableAction && tableAction.type === "table") {
        const deltaX = (e.clientX - resizeStart.x) / zoom
        const deltaY = (e.clientY - resizeStart.y) / zoom
        
        const { x: startX, y: startY, width: startWidth, height: startHeight } = tableDragStart
        
        let newX = startX
        let newY = startY
        let newWidth = startWidth
        let newHeight = startHeight
        
        switch (resizeDirection) {
          case "nw":
            newX = startX + deltaX
            newY = startY + deltaY
            newWidth = startWidth - deltaX
            newHeight = startHeight - deltaY
            break
          case "ne":
            newY = startY + deltaY
            newWidth = startWidth + deltaX
            newHeight = startHeight - deltaY
            break
          case "sw":
            newX = startX + deltaX
            newWidth = startWidth - deltaX
            newHeight = startHeight + deltaY
            break
          case "se":
            newWidth = startWidth + deltaX
            newHeight = startHeight + deltaY
            break
          case "n":
            newY = startY + deltaY
            newHeight = startHeight - deltaY
            break
          case "s":
            newHeight = startHeight + deltaY
            break
          case "w":
            newX = startX + deltaX
            newWidth = startWidth - deltaX
            break
          case "e":
            newWidth = startWidth + deltaX
            break
        }
        
        const minSize = 50
        if (newWidth >= minSize && newHeight >= minSize) {
          setActions(prev => prev.map((action, index) => {
            if (index === tableIndex) {
              const updatedAction = { ...action }
              updatedAction.data.x = newX
              updatedAction.data.y = newY
              updatedAction.data.width = newWidth
              updatedAction.data.height = newHeight
              return updatedAction
            }
            return action
          }))
        }
      }
      return
    }

    // Table dragging
    if (isDraggingTable && selectedElements.length === 1) {
      const tableIndex = selectedElements[0]
      const tableAction = actions[tableIndex]
      if (tableAction && tableAction.type === "table") {
        const deltaX = x - tableDragStart.x
        const deltaY = y - tableDragStart.y
        
        setActions(prev => prev.map((action, index) => {
          if (index === tableIndex) {
            const updatedAction = { ...action }
            updatedAction.data.x = tableAction.data.x + deltaX
            updatedAction.data.y = tableAction.data.y + deltaY
            return updatedAction
          }
          return action
        }))
        
        setTableDragStart({ x, y })
      }
      return
    }

    // Dragging selection
    if (isDraggingSelection && selectedElements.length > 0) {
      const deltaX = x - selectionDragStart.x
      const deltaY = y - selectionDragStart.y
      
      setActions(prev => prev.map((action, index) => {
        if (selectedElements.includes(index)) {
          const newAction = { ...action }
          if (newAction.type === "text") {
            newAction.data = { ...newAction.data, x: newAction.data.x + deltaX, y: newAction.data.y + deltaY }
          } else if (newAction.type === "shape") {
            newAction.data = { ...newAction.data, x: newAction.data.x + deltaX, y: newAction.data.y + deltaY }
            // Update endX and endY for arrows
            if (newAction.data.shapeType === TOOLS.ARROW) {
              newAction.data.endX = newAction.data.endX + deltaX
              newAction.data.endY = newAction.data.endY + deltaY
            }
          } else if (newAction.type === "draw") {
            newAction.data = { ...newAction.data, points: newAction.data.points.map(([px, py]) => [px + deltaX, py + deltaY]) }
          } else if (newAction.type === "table") {
            newAction.data = { ...newAction.data, x: newAction.data.x + deltaX, y: newAction.data.y + deltaY }
          }
          return newAction
        }
        return action
      }))
      
      setSelectionDragStart({ x, y })
      return
    }

    // Selection box
    if (isSelecting && selectionBox) {
      setSelectionBox(prev => ({ ...prev, endX: x, endY: y }))
      return
    }

    // Shape drawing
    if (currentShape && shapeStart) {
      const width = x - shapeStart.x
      const height = y - shapeStart.y
      setCurrentShape(prev => ({
        ...prev,
        data: { ...prev.data, width, height, endX: x, endY: y }
      }))
      return
    }

    // Drawing
    if (drawing && tool === TOOLS.PEN) {
      setActions(prev => {
        const last = prev[prev.length - 1]
        if (last && last.type === "draw") {
          const updated = { ...last, data: { ...last.data, points: [...last.data.points, [x, y]] } }
          if (socket) socket.emit("whiteboard-action", updated)
          return [...prev.slice(0, -1), updated]
        }
        return prev
      })
    }

    // Table cell hover detection
    if (tool === TOOLS.SELECT) {
      const hoveredCell = getTableCellAtPosition(x, y, actions)
      if (hoveredCell !== hoveredTableCell) {
        setHoveredTableCell(hoveredCell)
      }
      
      // Element hover detection
      let hoveredIndex = -1
      for (let i = actions.length - 1; i >= 0; i -= 1) {
        const action = actions[i]
        let hit = false
        
        if (action.type === "text") {
          const box = getTextBoundingBox(canvasRef.current, action)
          if (x >= box.left - 10 && x <= box.right + 10 && 
              y >= box.top - 10 && y <= box.bottom + 10) {
            hit = true
          }
        } else if (action.type === "shape") {
          const box = getShapeBoundingBox(action)
          if (x >= box.left - 10 && x <= box.right + 10 && 
              y >= box.top - 10 && y <= box.bottom + 10) {
            hit = true
          }
        } else if (action.type === "draw") {
          const box = getDrawBoundingBox(action)
          if (box && x >= box.left - 10 && x <= box.right + 10 && 
              y >= box.top - 10 && y <= box.bottom + 10) {
            hit = true
          }
        } else if (action.type === "table") {
          const box = getTableBoundingBox(action)
          if (x >= box.left - 10 && x <= box.right + 10 && 
              y >= box.top - 10 && y <= box.bottom + 10) {
            hit = true
          }
        }
        
        if (hit) {
          hoveredIndex = i
          break
        }
      }
      
      if (hoveredIndex !== hoveredElement) {
        setHoveredElement(hoveredIndex)
      }
    } else {
      if (hoveredTableCell) {
        setHoveredTableCell(null)
      }
      if (hoveredElement !== null) {
        setHoveredElement(null)
      }
    }
  }, [isPanning, tool, panStart, isSelecting, selectionBox, isDraggingSelection, selectedElements, selectionDragStart, currentShape, shapeStart, drawing, transformCoordinates, getTableCellAtPosition, setPanOffset, setSelectionBox, setSelectionDragStart, setCurrentShape, setActions, setHoveredTableCell, hoveredElement, setHoveredElement])

  const handlePointerUp = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDrawing(false)
    setIsPanning(false)

    // Handle table resizing completion
    if (isResizingTable && selectedElements.length === 1) {
      const tableIndex = selectedElements[0]
      const tableAction = actions[tableIndex]
      if (tableAction && tableAction.type === "table" && socket) {
        socket.emit("whiteboard-action", tableAction)
      }
      setIsResizingTable(false)
      setResizeDirection(null)
      setResizeStart({ x: 0, y: 0 })
      setTableDragStart({ x: 0, y: 0 })
    }

    // Handle table dragging completion
    if (isDraggingTable && selectedElements.length === 1) {
      const tableIndex = selectedElements[0]
      const tableAction = actions[tableIndex]
      if (tableAction && tableAction.type === "table" && socket) {
        socket.emit("whiteboard-action", tableAction)
      }
      setIsDraggingTable(false)
      setTableDragStart({ x: 0, y: 0 })
    }

    // Handle shape completion
    if (currentShape && shapeStart) {
      if (!validSeanceId) {
        setCurrentShape(null)
        setShapeStart(null)
        return
      }
      setActions(prev => [...prev, currentShape])
      if (socket) socket.emit("whiteboard-action", currentShape)
      setCurrentShape(null)
      setShapeStart(null)
    }

    // Handle selection completion
    if (isSelecting && selectionBox) {
      const selLeft = Math.min(selectionBox.startX, selectionBox.endX)
      const selRight = Math.max(selectionBox.startX, selectionBox.endX)
      const selTop = Math.min(selectionBox.startY, selectionBox.endY)
      const selBottom = Math.max(selectionBox.startY, selectionBox.endY)

      const selected = []
      actions.forEach((action, index) => {
        if (action.type === "text") {
          const box = getTextBoundingBox(canvasRef.current, action)
          if (box.left <= selRight && box.right >= selLeft && 
              box.top <= selBottom && box.bottom >= selTop) {
            selected.push(index)
          }
        } else if (action.type === "shape") {
          const box = getShapeBoundingBox(action)
          if (box.left <= selRight && box.right >= selLeft && 
              box.top <= selBottom && box.bottom >= selTop) {
            selected.push(index)
          }
        } else if (action.type === "draw") {
          const box = getDrawBoundingBox(action)
          if (box && box.left <= selRight && box.right >= selLeft && 
              box.top <= selBottom && box.bottom >= selTop) {
            selected.push(index)
          }
        } else if (action.type === "table") {
          const box = getTableBoundingBox(action)
          if (box.left <= selRight && box.right >= selLeft && 
              box.top <= selBottom && box.bottom >= selTop) {
            selected.push(index)
          }
        }
      })

      setSelectedElements(selected)
      setIsSelecting(false)
      setSelectionBox(null)
    }

    // Handle selection dragging completion
    if (isDraggingSelection && selectedElements.length > 0) {
      const movedActions = selectedElements.map(index => actions[index])
      movedActions.forEach(action => {
        if (socket) socket.emit("whiteboard-action", action)
      })
      setIsDraggingSelection(false)
      setSelectionDragStart({ x: 0, y: 0 })
      setSelectionInitial([])
    }

    // Clear selection states if not dragging
    if (!isDraggingSelection) {
      setIsDraggingSelection(false)
      setSelectionDragStart({ x: 0, y: 0 })
      setSelectionInitial([])
    }
  }, [currentShape, shapeStart, isSelecting, selectionBox, isDraggingSelection, selectedElements, actions, socket, setDrawing, setIsPanning, setActions, setCurrentShape, setShapeStart, setSelectedElements, setIsSelecting, setSelectionBox, setIsDraggingSelection, setSelectionInitial])

  // Text handling
  const commitText = useCallback(() => {
    if (!validSeanceId) return
    
    const trimmed = currentText.trim()
    if (!trimmed) {
      setShowTextInput(false)
      setCurrentText("")
      return
    }
    
    const newText = {
      type: "text",
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      data: { x: textPos.x, y: textPos.y, value: trimmed, color },
      seanceId: validSeanceId,
      createdById: userId,
    }
    
    setActions(prev => [...prev, newText])
    if (socket) socket.emit("whiteboard-action", newText)
    setCurrentText("")
    setShowTextInput(false)
  }, [currentText, textPos, color, validSeanceId, userId, socket, setActions, setShowTextInput, setCurrentText])

  // Table cell editing handling
  const commitTableCellEdit = useCallback(() => {
    if (!editingTableCell || !validSeanceId) {
      setEditingTableCell(null)
      setEditingCellText("")
      return
    }
    
    const { tableIndex, row, col } = editingTableCell
    const cellKey = `${row}-${col}`
    
    setActions(prev => prev.map((action, index) => {
      if (index === tableIndex && action.type === "table") {
        const updatedAction = { ...action }
        if (!updatedAction.data.cells) {
          updatedAction.data.cells = {}
        }
        
        if (editingCellText.trim()) {
          updatedAction.data.cells[cellKey] = editingCellText.trim()
        } else {
          delete updatedAction.data.cells[cellKey]
        }
        
        if (socket) {
          socket.emit("whiteboard-action", updatedAction)
        }
        
        return updatedAction
      }
      return action
    }))
    
    setEditingTableCell(null)
    setEditingCellText("")
  }, [editingTableCell, editingCellText, validSeanceId, socket, setActions, setEditingTableCell, setEditingCellText])

  // Utility functions
  const handleUndo = useCallback(() => {
    const prev = undo()
    if (prev) setActions(prev)
  }, [undo, setActions])

  const handleRedo = useCallback(() => {
    const next = redo()
    if (next) setActions(next)
  }, [redo, setActions])

  const clearCanvas = useCallback(() => {
    if (!validSeanceId) return
    pushHistory()
    setActions([])
    setSelectedElements([])
    if (socket) socket.emit("whiteboard-clear", { seanceId: validSeanceId })
  }, [pushHistory, setActions, setSelectedElements, socket, validSeanceId])

  const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev * 1.2, 3)), [setZoom])
  const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev / 1.2, 0.1)), [setZoom])
  const resetView = useCallback(() => {
    setZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }, [setZoom, setPanOffset])

  const handleTableConfig = useCallback(() => {
    setShowTableConfig(true)
  }, [setShowTableConfig])

  const handleTableConfigConfirm = useCallback((newConfig) => {
    setTableConfig(newConfig)
  }, [setTableConfig])

  // Compute positions for overlays
  const textInputPosition = useMemo(() => {
    if (!showTextInput) return null
    const canvas = canvasRef.current
    const container = canvasContainerRef.current
    if (!canvas || !container) return { left: textPos.x, top: textPos.y }
    const rect = canvas.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const left = (rect.left - containerRect.left) + (textPos.x * zoom + panOffset.x) / scaleX
    const top = (rect.top - containerRect.top) + (textPos.y * zoom + panOffset.y) / scaleY - 18
    return { left, top }
  }, [showTextInput, textPos, zoom, panOffset])

  const tableCellInputPosition = useMemo(() => {
    if (!editingTableCell) return null
    const canvas = canvasRef.current
    const container = canvasContainerRef.current
    if (!canvas || !container || !canvas.width || !canvas.height) return null
    
    try {
      const rect = canvas.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      
      // Ensure we have valid dimensions
      if (rect.width === 0 || rect.height === 0 || containerRect.width === 0 || containerRect.height === 0) {
        return null
      }
      
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      
      const left = (rect.left - containerRect.left) + (editingTableCell.cellX * zoom + panOffset.x) / scaleX
      const top = (rect.top - containerRect.top) + (editingTableCell.cellY * zoom + panOffset.y) / scaleY
      
      return { left, top }
    } catch (error) {
      console.warn("Error calculating table cell input position:", error)
      return null
    }
  }, [editingTableCell, zoom, panOffset])

  // Force recalculation of table cell input position when editing starts
  useEffect(() => {
    if (editingTableCell) {
      // Force a re-render by updating the dependency
      const timer = setTimeout(() => {
        // This will trigger the useMemo to recalculate
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [editingTableCell])

  // Toolbar content
  const toolbarContent = (
    <ModernToolbar
      tool={tool}
      setTool={setTool}
      color={color}
      setColor={setColor}
      onUndo={handleUndo}
      onRedo={handleRedo}
      onDelete={() => {
        if (selectedElements.length > 0) {
          pushHistory()
          const idsToDelete = selectedElements
            .map((i) => actions[i]?.id)
            .filter(Boolean)
          setActions(prev => prev.filter((_, index) => !selectedElements.includes(index)))
          setSelectedElements([])
          if (socket && validSeanceId && idsToDelete.length > 0) {
            socket.emit("whiteboard-delete", { seanceId: validSeanceId, ids: idsToDelete })
          }
        }
      }}
      onClear={clearCanvas}
      onTableConfig={handleTableConfig}
      tableConfig={tableConfig}
      canUndo={pastStates.length > 0}
      canRedo={futureStates.length > 0}
      hasSelection={selectedElements.length > 0}
      canvasRef={canvasRef}
      actions={actions}
      zoom={zoom}
      panOffset={panOffset}
    />
  )

  return (
    <WhiteboardLayout
      seanceId={seanceId}
      seanceIdDisplay={seanceIdDisplay}
      isMobile={isMobile}
      mobileDrawerOpen={mobileDrawerOpen}
      setMobileDrawerOpen={setMobileDrawerOpen}
      tool={tool}
      setTool={setTool}
      toolbarContent={toolbarContent}
      validSeanceId={validSeanceId}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onReset={resetView}
      zoom={zoom}
    >
      <WarningMessage validSeanceId={validSeanceId} />
      
      <CanvasArea
        canvasRef={canvasRef}
        containerRef={containerRef}
        canvasContainerRef={canvasContainerRef}
        isMobile={isMobile}
        actions={actions}
        selectedElements={selectedElements}
        currentShape={currentShape}
        selectionBox={selectionBox}
        tool={tool}
        zoom={zoom}
        panOffset={panOffset}
        hoveredTableCell={hoveredTableCell}
        hoveredElement={hoveredElement}
        validSeanceId={validSeanceId}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerUp={handlePointerUp}
        openFloatingToolbarAt={openFloatingToolbarAt}
        getCursor={() => {
          if (tool === TOOLS.PAN) return isPanning ? "grabbing" : "grab"
          if (tool === TOOLS.PEN) return "crosshair"
          if (tool === TOOLS.SELECT) {
            if (isDraggingSelection) return "grabbing"
            if (isResizingTable) return "nw-resize"
            if (isDraggingTable) return "grabbing"
            if (isSelecting) return "crosshair"
            if (hoveredElement !== null && hoveredElement !== -1) return "pointer"
            return "default"
          }
          if ([TOOLS.RECTANGLE, TOOLS.CIRCLE, TOOLS.ARROW, TOOLS.TABLE].includes(tool)) return "crosshair"
          if (tool === TOOLS.TEXT) return "text"
          return "default"
        }}
        onAddRow={handleAddRow}
        onAddColumn={handleAddColumn}
        onResizeTable={handleResizeTable}
        onDragTable={handleDragTable}
      />

      <InputOverlays
        showTextInput={showTextInput}
        textInputPosition={textInputPosition}
        currentText={currentText}
        setCurrentText={setCurrentText}
        commitText={commitText}
        setShowTextInput={setShowTextInput}
        color={color}
        zoom={zoom}
        editingTableCell={editingTableCell}
        tableCellInputPosition={tableCellInputPosition}
        editingCellText={editingCellText}
        setEditingCellText={setEditingCellText}
        commitTableCellEdit={commitTableCellEdit}
        setEditingTableCell={setEditingTableCell}
      />

      <FloatingToolbar
        floatingToolbar={floatingToolbar}
        validSeanceId={validSeanceId}
        toolbarContent={toolbarContent}
      />

      <TableConfigDialog
        open={showTableConfig}
        onClose={() => setShowTableConfig(false)}
        onConfirm={handleTableConfigConfirm}
        initialConfig={tableConfig}
      />
    </WhiteboardLayout>
  )
}
