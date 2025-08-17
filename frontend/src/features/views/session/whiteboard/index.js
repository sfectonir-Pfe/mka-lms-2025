// Main components
export { default as Whiteboard } from "./WhiteboardRefactored.js"
export { default as WhiteboardRefactored } from "./WhiteboardRefactored.js"

// Layout components
export { default as WhiteboardLayout } from "./components/WhiteboardLayout.js"
export { default as CanvasArea } from "./components/CanvasArea.js"
export { default as InputOverlays } from "./components/InputOverlays.js"
export { default as FloatingToolbar } from "./components/FloatingToolbar.js"
export { default as WarningMessage } from "./components/WarningMessage.js"

// Control components
export { default as TableControls } from "./components/TableControls.js"
export { default as TableControlsDemo } from "./components/TableControlsDemo.js"

// Utility components
export { default as ModernHeader } from "./components/ModernHeader.js"
export { default as ModernToolbar } from "./components/ModernToolbar.js"
export { default as ModernCanvas } from "./components/ModernCanvas.js"
export { default as TableConfigDialog } from "./components/TableConfigDialog.js"
export { ZoomControls, ZoomIndicator } from "./ZoomControls.js"

// Custom hooks
export { useWhiteboardState } from "./hooks/useWhiteboardState.js"
export { useDrawingState } from "./hooks/useDrawingState.js"
export { useHistory } from "./hooks/useHistory.js"
export { useSocketConnection } from "./hooks/useSocketConnection.js"

// Utilities
export * from "./canvasUtils.js"
export * from "./constants.js"


