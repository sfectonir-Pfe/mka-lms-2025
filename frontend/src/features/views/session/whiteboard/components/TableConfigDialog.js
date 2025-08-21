import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  Grid,
  Paper,
} from "@mui/material"
import { TableChart as TableIcon } from "@mui/icons-material"

const TableConfigDialog = ({ open, onClose, onConfirm, initialConfig = { rows: 3, columns: 4 } }) => {
  const [config, setConfig] = useState(initialConfig)

  const handleConfirm = () => {
    onConfirm(config)
    onClose()
  }

  const handleCancel = () => {
    setConfig(initialConfig)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TableIcon color="primary" />
        <Typography variant="h6">Configure Table</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" gutterBottom>
            Choose the number of rows and columns for your table:
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                Rows: {config.rows}
              </Typography>
              <Slider
                value={config.rows}
                onChange={(_, value) => setConfig(prev => ({ ...prev, rows: value }))}
                min={2}
                max={10}
                marks
                valueLabelDisplay="auto"
                sx={{ mt: 1 }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                Columns: {config.columns}
              </Typography>
              <Slider
                value={config.columns}
                onChange={(_, value) => setConfig(prev => ({ ...prev, columns: value }))}
                min={2}
                max={8}
                marks
                valueLabelDisplay="auto"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                border: "2px solid #1976d2",
                borderRadius: 2,
                display: "inline-block",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
                  gridTemplateRows: `repeat(${config.rows}, 1fr)`,
                  gap: 0.5,
                  width: config.columns * 30,
                  height: config.rows * 30,
                }}
              >
                                 {Array.from({ length: config.rows * config.columns }, (_, i) => (
                   <Box
                     key={i}
                     sx={{
                       width: 30,
                       height: 30,
                       border: "1px solid #ccc",
                       backgroundColor: i < config.columns ? "#e8e8e8" : "#f5f5f5",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "center",
                       fontSize: "0.75rem",
                       color: "#666",
                     }}
                   />
                 ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Create Table
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TableConfigDialog
