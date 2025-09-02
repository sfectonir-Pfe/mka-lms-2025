import React from "react"
import { Box, Typography } from "@mui/material"
import ModernCanvas from "./ModernCanvas"
import TableControls from "./TableControls"
import { TOOLS } from "../constants"
import { useTranslation } from "react-i18next"

const CanvasArea = ({
  canvasRef,
  containerRef,
  canvasContainerRef,
  isMobile,
  actions,
  selectedElements,
  currentShape,
  selectionBox,
  tool,
  zoom,
  panOffset,
  hoveredTableCell,
  hoveredElement,
  validSeanceId,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  openFloatingToolbarAt,
  getCursor,
  onAddRow,
  onAddColumn,
  onResizeTable,
  onDragTable
}) => {
  const { t } = useTranslation()
  return (
    <Box sx={{ flex: 1, position: "relative" }} ref={canvasContainerRef} data-canvas-container>
      {/* Tool Status Indicator */}
      {validSeanceId && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 100,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 3,
            p: 2,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: tool === TOOLS.PEN ? "#1976d2" :
                            tool === TOOLS.TEXT ? "#9c27b0" :
                            tool === TOOLS.RECTANGLE ? "#2e7d32" :
                            tool === TOOLS.CIRCLE ? "#0288d1" :
                            tool === TOOLS.ARROW ? "#ed6c02" :
                            tool === TOOLS.SELECT ? "#d32f2f" :
                            tool === TOOLS.PAN ? "#757575" : "#757575",
              animation: "pulse 2s infinite",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {t(`whiteboard.tools.${tool}`, tool)}
          </Typography>
        </Box>
      )}

      <ModernCanvas
        ref={canvasRef}
        width={isMobile ? window.innerWidth - 32 : 1000}
        height={isMobile ? window.innerHeight - 150 : 600}
        actions={actions}
        selectedElements={selectedElements}
        currentShape={currentShape}
        selectionBox={selectionBox}
        tool={tool}
        zoom={zoom}
        panOffset={panOffset}
        hoveredTableCell={hoveredTableCell}
        hoveredElement={hoveredElement}
        onPointerDown={validSeanceId ? handlePointerDown : undefined}
        onPointerMove={validSeanceId ? handlePointerMove : undefined}
        onPointerUp={validSeanceId ? handlePointerUp : undefined}
        onContextMenu={validSeanceId ? (e) => {
          e.preventDefault()
          openFloatingToolbarAt(e.clientX, e.clientY)
        } : undefined}
        cursor={validSeanceId ? getCursor() : "not-allowed"}
        isMobile={isMobile}
      />

      {/* Table Controls Overlay */}
      {validSeanceId && selectedElements.length === 1 && (() => {
        const selectedIndex = selectedElements[0]
        const selectedAction = actions[selectedIndex]
        if (selectedAction && selectedAction.type === "table") {
          return (
            <TableControls
              tableAction={selectedAction}
              tableIndex={selectedIndex}
              isSelected={true}
              zoom={zoom}
              panOffset={panOffset}
              onAddRow={onAddRow}
              onAddColumn={onAddColumn}
              onResizeTable={onResizeTable}
              onDragTable={onDragTable}
            />
          )
        }
        return null
      })()}
    </Box>
  )
}

export default CanvasArea


