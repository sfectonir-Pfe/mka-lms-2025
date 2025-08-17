import { AppBar, Box, Chip, IconButton, Toolbar, Typography, Button } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import MenuIcon from "@mui/icons-material/Menu"
import PeopleIcon from "@mui/icons-material/People"

export function MobileHeader({ seanceIdLabel, onOpenDrawer }) {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)" }}>
      <Toolbar>
        <IconButton edge="start" onClick={onOpenDrawer} sx={{ mr: 2, color: "#1976d2" }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditIcon sx={{ color: "white", fontSize: 18 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
            Whiteboard
          </Typography>
        </Box>
        <Chip icon={<PeopleIcon />} label={seanceIdLabel} size="small" variant="outlined" />
      </Toolbar>
    </AppBar>
  )
}

export function DesktopHeader({ title, subtitle, seanceIdLabel, onExport }) {
  return (
    <Box sx={{ p: 3, pb: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip icon={<PeopleIcon />} label={seanceIdLabel} variant="outlined" sx={{ bgcolor: "white" }} />
          <Button variant="outlined" sx={{ bgcolor: "white" }} onClick={onExport}>
            Export
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

