import { useState } from "react"

export const useDrawingState = () => {
  const [drawing, setDrawing] = useState(false)
  const [shapeStart, setShapeStart] = useState(null)
  const [currentShape, setCurrentShape] = useState(null)
  const [textPos, setTextPos] = useState({ x: 0, y: 0 })
  const [showTextInput, setShowTextInput] = useState(false)
  const [currentText, setCurrentText] = useState("")
  const [tableConfig, setTableConfig] = useState({ rows: 3, columns: 4 })
  const [showTableConfig, setShowTableConfig] = useState(false)
  
  // État pour l'édition des cellules de tableau
  const [editingTableCell, setEditingTableCell] = useState(null)
  const [editingCellText, setEditingCellText] = useState("")
  
  return {
    drawing, setDrawing, shapeStart, setShapeStart, currentShape, setCurrentShape,
    textPos, setTextPos, showTextInput, setShowTextInput, currentText, setCurrentText,
    tableConfig, setTableConfig, showTableConfig, setShowTableConfig,
    editingTableCell, setEditingTableCell, editingCellText, setEditingCellText
  }
}


