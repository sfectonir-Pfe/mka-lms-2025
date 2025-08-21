import React from "react"
import { Box } from "@mui/material"

const InputOverlays = ({
  showTextInput,
  textInputPosition,
  currentText,
  setCurrentText,
  commitText,
  setShowTextInput,
  color,
  zoom,
  editingTableCell,
  tableCellInputPosition,
  editingCellText,
  setEditingCellText,
  commitTableCellEdit,
  setEditingTableCell
}) => {
  console.log("InputOverlays render:", { 
    editingTableCell, 
    tableCellInputPosition, 
    editingCellText,
    hasEditingTableCell: !!editingTableCell,
    hasTableCellInputPosition: !!tableCellInputPosition
  })
  return (
    <>
      {/* Text Input Overlay */}
      {showTextInput && textInputPosition && (
        <textarea
          autoFocus
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          onBlur={() => commitText()}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              commitText()
            }
            if (e.key === "Escape") {
              e.preventDefault()
              setShowTextInput(false)
              setCurrentText("")
            }
          }}
          style={{
            position: "absolute",
            left: textInputPosition.left,
            top: textInputPosition.top,
            minWidth: 150,
            maxWidth: 400,
            padding: 6,
            borderRadius: 6,
            border: "1px solid rgba(0,0,0,0.2)",
            outline: "none",
            resize: "none",
            font: `500 ${18 / zoom}px Inter, system-ui, sans-serif`,
            color: color,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 1200,
          }}
          rows={1}
        />
      )}

      {/* Table Cell Input Overlay */}
      {editingTableCell && tableCellInputPosition && tableCellInputPosition.left !== undefined && tableCellInputPosition.top !== undefined && (
        <>
          {/* Visual indicator for editing cell */}
          <Box
            sx={{
              position: "absolute",
              left: tableCellInputPosition.left - 2,
              top: tableCellInputPosition.top - 2,
              width: Math.max(editingTableCell.cellWidth * zoom - 4, 64),
              height: Math.max(editingTableCell.cellHeight * zoom - 4, 34),
              border: "2px solid #1976d2",
              borderRadius: 6,
              backgroundColor: "rgba(25, 118, 210, 0.1)",
              zIndex: 1199,
              pointerEvents: "none",
            }}
          />
          <textarea
            autoFocus
            data-table-cell="true"
            value={editingCellText}
            onChange={(e) => setEditingCellText(e.target.value)}
            onBlur={() => commitTableCellEdit()}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                commitTableCellEdit()
              }
              if (e.key === "Escape") {
                e.preventDefault()
                setEditingTableCell(null)
                setEditingCellText("")
              }
              if (e.key === "Tab") {
                e.preventDefault()
                commitTableCellEdit()
              }
            }}
            style={{
              position: "absolute",
              left: tableCellInputPosition.left,
              top: tableCellInputPosition.top,
              width: Math.max(editingTableCell.cellWidth * zoom - 8, 60),
              height: Math.max(editingTableCell.cellHeight * zoom - 8, 30),
              padding: 4,
              borderRadius: 4,
              border: "2px solid #1976d2",
              outline: "none",
              resize: "none",
              font: `500 ${Math.max(12, 14 / zoom)}px Inter, system-ui, sans-serif`,
              color: "#1a1a1a",
              background: "rgba(255,255,255,0.98)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 1200,
              textAlign: "center",
              lineHeight: `${Math.max(editingTableCell.cellHeight * zoom - 8, 30)}px`,
              minWidth: "60px",
              minHeight: "30px",
            }}
            rows={1}
            placeholder="Écrire ici..."
          />
        </>
      )}
    </>
  )
}

export default InputOverlays


