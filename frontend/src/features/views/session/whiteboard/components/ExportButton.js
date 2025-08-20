import React, { useState } from "react"
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Alert,
} from "@mui/material"
import {
  FileDownload as ExportIcon,
  Image as ImageIcon,
  Code as SvgIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material"

const ExportButton = ({ canvasRef, actions, zoom, panOffset }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("png")
  const [exportSettings, setExportSettings] = useState({
    filename: "whiteboard-export",
    quality: 0.9,
    scale: 2,
    includeBackground: true,
    backgroundColor: "#ffffff",
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleExportFormatSelect = (format) => {
    setExportFormat(format)
    setExportDialogOpen(true)
    handleMenuClose()
  }

  const handleExport = async () => {
    if (!canvasRef.current) {
      setExportError("Canvas not available")
      return
    }

    setIsExporting(true)
    setExportError(null)

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      // Create a temporary canvas for export
      const exportCanvas = document.createElement("canvas")
      const exportCtx = exportCanvas.getContext("2d")

      // Calculate export dimensions
      const scale = exportSettings.scale
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      
      exportCanvas.width = canvasWidth * scale
      exportCanvas.height = canvasHeight * scale

      // Set background if requested
      if (exportSettings.includeBackground) {
        exportCtx.fillStyle = exportSettings.backgroundColor
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
      }

      // Scale the context
      exportCtx.scale(scale, scale)

      // Draw the original canvas content
      exportCtx.drawImage(canvas, 0, 0)

      // Export based on format
      let dataUrl
      let mimeType
      let fileExtension

      switch (exportFormat) {
        case "png":
          dataUrl = exportCanvas.toDataURL("image/png")
          mimeType = "image/png"
          fileExtension = "png"
          break
        case "jpeg":
          dataUrl = exportCanvas.toDataURL("image/jpeg", exportSettings.quality)
          mimeType = "image/jpeg"
          fileExtension = "jpg"
          break

        case "svg":
          // For SVG, we'll convert canvas content to SVG
          await exportAsSVG(actions, exportSettings)
          setExportDialogOpen(false)
          setIsExporting(false)
          return
        default:
          throw new Error("Unsupported export format")
      }

      // Create download link
      const link = document.createElement("a")
      link.download = `${exportSettings.filename}.${fileExtension}`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setExportDialogOpen(false)
    } catch (error) {
      console.error("Export error:", error)
      setExportError(error.message || "Export failed")
    } finally {
      setIsExporting(false)
    }
  }



  const exportAsSVG = async (actions, settings) => {
    try {
      // Calculate canvas bounds
      let minX = 0, minY = 0, maxX = 800, maxY = 600
      
      actions.forEach(action => {
        if (action.data) {
          const { x, y, width, height } = action.data
          if (x !== undefined) minX = Math.min(minX, x)
          if (y !== undefined) minY = Math.min(minY, y)
          if (x !== undefined && width !== undefined) maxX = Math.max(maxX, x + width)
          if (y !== undefined && height !== undefined) maxY = Math.max(maxY, y + height)
        }
      })

      const svgWidth = maxX - minX
      const svgHeight = maxY - minY

      let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
`

      if (settings.includeBackground) {
        svgContent += `<rect width="100%" height="100%" fill="${settings.backgroundColor}"/>`
      }

      // Convert actions to SVG elements
      actions.forEach(action => {
        switch (action.type) {
          case "draw":
            if (action.data.points && action.data.points.length > 0) {
              const points = action.data.points.map(p => `${p.x - minX},${p.y - minY}`).join(" ")
              svgContent += `<polyline points="${points}" stroke="${action.data.color}" stroke-width="${action.data.width}" fill="none"/>`
            }
            break
          case "text":
            svgContent += `<text x="${action.data.x - minX}" y="${action.data.y - minY}" font-family="Arial" font-size="${action.data.fontSize || 16}" fill="${action.data.color}">${action.data.text}</text>`
            break
          case "rectangle":
            svgContent += `<rect x="${action.data.x - minX}" y="${action.data.y - minY}" width="${action.data.width}" height="${action.data.height}" stroke="${action.data.color}" stroke-width="2" fill="none"/>`
            break
          case "circle":
            svgContent += `<circle cx="${action.data.x - minX + action.data.radius}" cy="${action.data.y - minY + action.data.radius}" r="${action.data.radius}" stroke="${action.data.color}" stroke-width="2" fill="none"/>`
            break
          // Add more cases for other shapes as needed
        }
      })

      svgContent += "</svg>"

      // Create download link for SVG
      const blob = new Blob([svgContent], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `${settings.filename}.svg`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("SVG export error:", error)
      setExportError("SVG export failed")
    }
  }

  const exportOptions = [
    { format: "png", label: "PNG Image", icon: ImageIcon, description: "High quality, transparent background" },
    { format: "jpeg", label: "JPEG Image", icon: ImageIcon, description: "Compressed, smaller file size" },
    { format: "svg", label: "SVG Vector", icon: SvgIcon, description: "Editable vector format" },
  ]

  return (
    <>
      <Tooltip title="Export Whiteboard" placement="right">
        <IconButton
          onClick={handleExportClick}
          sx={{
            color: "primary.main",
            "&:hover": {
              backgroundColor: "primary.light",
              transform: "scale(1.05)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
            transition: "all 0.2s ease",
            width: 48,
            height: 48,
            borderRadius: 2,
            border: "2px solid transparent",
          }}
        >
          <ExportIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {exportOptions.map((option) => (
          <MenuItem
            key={option.format}
            onClick={() => handleExportFormatSelect(option.format)}
            sx={{ minWidth: 200 }}
          >
            <ListItemIcon>
              <option.icon />
            </ListItemIcon>
            <ListItemText
              primary={option.label}
              secondary={option.description}
            />
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SettingsIcon />
            <Typography variant="h6">Export Settings</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Filename"
              value={exportSettings.filename}
              onChange={(e) => setExportSettings(prev => ({ ...prev, filename: e.target.value }))}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                label="Export Format"
              >
                {exportOptions.map((option) => (
                  <MenuItem key={option.format} value={option.format}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Scale Factor"
              type="number"
              value={exportSettings.scale}
              onChange={(e) => setExportSettings(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
              inputProps={{ min: 0.5, max: 5, step: 0.5 }}
              helperText="Higher scale = better quality but larger file"
            />

            {(exportFormat === "jpeg" || exportFormat === "png") && (
              <TextField
                label="Quality"
                type="number"
                value={exportSettings.quality}
                onChange={(e) => setExportSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
                inputProps={{ min: 0.1, max: 1, step: 0.1 }}
                helperText="JPEG quality (0.1 = low, 1.0 = high)"
              />
            )}

            <FormControl fullWidth>
              <InputLabel>Background</InputLabel>
              <Select
                value={exportSettings.includeBackground ? "include" : "transparent"}
                onChange={(e) => setExportSettings(prev => ({ 
                  ...prev, 
                  includeBackground: e.target.value === "include" 
                }))}
                label="Background"
              >
                <MenuItem value="include">Include Background</MenuItem>
                <MenuItem value="transparent">Transparent</MenuItem>
              </Select>
            </FormControl>

            {exportSettings.includeBackground && (
              <TextField
                label="Background Color"
                type="color"
                value={exportSettings.backgroundColor}
                onChange={(e) => setExportSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                fullWidth
              />
            )}

            {exportError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {exportError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            variant="contained"
            disabled={isExporting}
            startIcon={isExporting ? <SettingsIcon /> : <ExportIcon />}
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExportButton
