import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Typography,
  Toolbar,
  IconButton,
  List,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Badge,
  Tooltip,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { sideBarData } from "../constants/sideBarData";
import ScrollToTopButton from "../components/ScrollToTopButton";

const drawerWidth = 240;
const closedDrawerWidth = 56; // mini variant width

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  background: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginLeft: open ? drawerWidth : closedDrawerWidth,
  width: `calc(100% - ${open ? drawerWidth : closedDrawerWidth}px)`,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background: theme.palette.background.paper,
          borderRight: 'none',
        },
      }
    : {
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: closedDrawerWidth,
        "& .MuiDrawer-paper": {
          width: closedDrawerWidth,
          background: theme.palette.background.paper,
          borderRight: 'none',
        },
      }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function Main({ setUser, user }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleVoirProfil = () => {
    handleMenuClose();
    user?.id && navigate(`/ProfilePage/${user.id}`);
  };

  const handleEditProfil = () => {
    handleMenuClose();
    user?.email && navigate(`/EditProfile/${user.email}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                mr: 2,
                ...(open && { display: "none" }),
                color: theme.palette.primary.main,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Master Knowledge Academy
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box sx={{
                  width: 12,
                  height: 12,
                  bgcolor: theme.palette.success.main,
                  borderRadius: '30%',
                  border: `2px solid ${theme.palette.background.paper}`
                }} />
              }
            >
              <Avatar
                src={user?.profilePic ? `http://localhost:8000/uploads/profile-pics/${user.profilePic.split('/').pop()}` : null}
                sx={{ width: 40, height: 40 }}
              >
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </Avatar>
            </Badge>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 100 }}>
                {user?.email}
              </Typography>
              <Chip
                label={user?.role}
                size="small"
                color="primary"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  textTransform: 'capitalize'
                }}
              />
            </Box>

            <IconButton onClick={handleMenuClick} sx={{ color: theme.palette.text.primary }}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: {
                    borderRadius: 2,
                    minWidth: 100,
                    mt: 1.5,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                      typography: 'body2',
                    },
                  }
                }
              }}
            >
              <MenuItem onClick={handleVoirProfil}>
                <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                View Profile
              </MenuItem>
              <MenuItem onClick={handleEditProfil}>
                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                Edit Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ px: 1 }}>
          {sideBarData.map((item, index) => (
            <Tooltip title={!open ? item.text : ''} placement="right" key={index} arrow>
              <ListItem disablePadding sx={{ display: "block", mb: 0.5, borderRadius: 2 }}>
                <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      borderRadius: 2,
                      '&:hover': { backgroundColor: theme.palette.action.hover },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: open ? 1 : 0,
                        '& .MuiTypography-root': {
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: open ? `${drawerWidth}px` : `${closedDrawerWidth}px`,
          bgcolor: theme.palette.background.default,
          minHeight: '60vh'
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            borderRadius: 4,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[1],
            p: 3,
            minHeight: 'calc(100vh - 64px - 32px)'
          }}
        >
          <Outlet />
        </Box>
        <ScrollToTopButton />
      </Box>
    </Box>
  );
}
