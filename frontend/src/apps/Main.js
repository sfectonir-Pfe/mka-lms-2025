import * as React from "react";
import { styled, useTheme, alpha } from "@mui/material/styles";
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
  Button,
  Avatar,
  Badge,
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { sideBarData } from "../constants/sideBarData";
import ScrollToTopButton from "../components/ScrollToTopButton";
import LanguageSelectorWithFlags from "../components/LanguageSelectorWithFlags";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { secureLogout } from "../utils/authUtils";
import { clearAllStorage, debugStorageState } from "../utils/storageDebug";

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.default,
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(9)} + 1px)`,
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 2),
  height: "80px",
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(8px)",
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }
    : {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

export default function Main({ setUser, user }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Log user object for debugging and ensure role is set correctly
  React.useEffect(() => {
    console.log("User object in Main.js:", user);
    if (user) {
      console.log("User ID:", user.id);
      console.log("User email:", user.email);
      console.log("User role:", user.role);
      console.log("User keys:", Object.keys(user));

      // Ensure role is set correctly
      if (!user.role || user.role === "user") {
        const updatedUser = { ...user, role: "Etudiant" };
        setUser(updatedUser);

        // Mettre à jour le storage approprié selon le flag Remember Me
        const rememberMeFlag = localStorage.getItem("rememberMe") === "true";
        if (rememberMeFlag) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
        }
        console.log("Updated user role to Etudiant");
      }

      // Récupérer les données utilisateur à jour, y compris la photo de profil
      const fetchUserData = async () => {
        try {
          if (user.email) {
            const response = await axios.get(`http://localhost:8000/users/email/${user.email}`);
            if (response.data) {
              // Mettre à jour l'objet utilisateur avec les données à jour
              const updatedUser = {
                ...user,
                profilePic: response.data.profilePic || user.profilePic,
                name: response.data.name || user.name,
                role: response.data.role || user.role
              };

              // Si l'utilisateur est khalil, s'assurer que son rôle est Admin
              if (updatedUser.email === "khalil@gmail.com" && updatedUser.role !== "Admin") {
                updatedUser.role = "Admin";
              }

              setUser(updatedUser);

              // Mettre à jour le storage approprié selon le flag Remember Me
              const rememberMeFlag = localStorage.getItem("rememberMe") === "true";
              if (rememberMeFlag) {
                localStorage.setItem("user", JSON.stringify(updatedUser));
              } else {
                sessionStorage.setItem("user", JSON.stringify(updatedUser));
              }
              console.log("Updated user data with profile pic:", updatedUser);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [user?.email]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleLogout = async () => {
    console.log("=== LOGOUT INITIATED FROM MAIN COMPONENT ===");
    console.log("Current user before logout:", user);

    try {
      // Utiliser la fonction de déconnexion sécurisée
      await secureLogout(setUser, navigate);
    } catch (error) {
      console.error("Error during logout from Main component:", error);

      // En cas d'erreur, forcer un rechargement complet
      console.log("Forcing complete page reload as fallback...");
      window.location.href = "/";
    }
  };

  // Fonction de test pour nettoyer complètement le storage
  const handleClearStorage = () => {
    console.log("🧹 MANUAL STORAGE CLEANUP INITIATED");
    debugStorageState();
    clearAllStorage();
    setUser(null);
    navigate("/");
  };

  // Menu déroulant pour le profil
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleVoirProfil = async () => {
    handleMenuClose();

    // Afficher l'objet utilisateur complet pour le débogage
    console.log("Current user object:", user);

    // Récupérer les données utilisateur depuis le localStorage pour le débogage
    const storedUserStr = localStorage.getItem("user");
    let storedUser = null;

    if (storedUserStr) {
      try {
        storedUser = JSON.parse(storedUserStr);
        console.log("User from localStorage:", storedUser);
      } catch (err) {
        console.error("Error parsing localStorage user:", err);
      }
    }

    try {
      // Si l'utilisateur a un email, essayer de récupérer son ID depuis le backend
      if (user && user.email) {
        console.log("Trying to fetch user data from backend for email:", user.email);
        try {
          const response = await axios.get(`http://localhost:8000/users/email/${user.email}`);
          if (response.data && response.data.id) {
            console.log("User data from backend:", response.data);

            // Mettre à jour l'objet utilisateur dans le localStorage et l'état
            const updatedUser = { ...user, id: response.data.id };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            console.log("Navigating to profile page with ID from backend:", response.data.id);
            navigate(`/ProfilePage/${response.data.id}`);
            return;
          }
        } catch (error) {
          console.error("Error fetching user data from backend:", error);
        }
      }

      // Si l'utilisateur a un ID dans l'état, l'utiliser
      if (user && user.id) {
        console.log("Navigating to profile page with ID from state:", user.id);
        navigate(`/ProfilePage/${user.id}`);
        return;
      }

      // Si l'utilisateur a un ID dans le localStorage, l'utiliser
      if (storedUser && storedUser.id) {
        console.log("Navigating to profile page with ID from localStorage:", storedUser.id);
        navigate(`/ProfilePage/${storedUser.id}`);
        return;
      }

      // Si tout échoue, naviguer vers la page de profil sans ID
      console.log("No valid user ID found, navigating to profile page without ID");
      navigate("/ProfilePage");
    } catch (err) {
      console.error("Error in handleVoirProfil:", err);
      navigate("/ProfilePage");
    }
  };

  const handleEditProfil = () => {
    handleMenuClose();
    if (user && user.email) {
      console.log("Navigating to edit profile with email:", user.email);
      // Assurez-vous que la route correspond exactement à celle définie dans App.js
      navigate(`/EditProfile/${user.email}`);
    } else {
      console.error("User email not available for edit profile navigation");
      // Récupérer l'email depuis le localStorage comme solution de secours
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData && userData.email) {
            console.log("Using email from localStorage:", userData.email);
            navigate(`/EditProfile/${userData.email}`);
            return;
          }
        } catch (err) {
          console.error("Error parsing user data from localStorage:", err);
        }
      }
      // Si tout échoue, naviguer vers la page d'accueil
      navigate("/");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 2,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              {t('common.appTitle', 'Master Knowledge Academy')}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LanguageSelectorWithFlags />

            
            <IconButton color="inherit">
              <StyledBadge badgeContent={4} color="error">
                <NotificationsIcon />
              </StyledBadge>
            </IconButton>

            <Typography variant="body1" noWrap>
              {user && user.email ? user.email : t('common.user')} |
              <span style={{ textTransform: 'capitalize' }}>
                {user && user.role  }
              </span>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={handleMenuClick}
                size="small"
                sx={{ p: 0 }}
              >
                <Avatar
                  alt={user?.name || user?.email || "User"}
                  src={user?.profilePic ?
                    (user.profilePic.startsWith('/profile-pics/') ?
                      `http://localhost:8000/uploads${user.profilePic}` :
                      (user.profilePic.startsWith('http') ?
                        user.profilePic :
                        `http://localhost:8000/uploads/profile-pics/${user.profilePic.split('/').pop()}`
                      )
                    ) :
                    null
                  }
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main' // Couleur de fond pour l'avatar par défaut
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </IconButton>
              {open && (
                <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                  {user?.email}
                </Typography>
              )}

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    }
                  }
                }}
              >
                <MenuItem onClick={handleVoirProfil}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  {t('profile.viewProfile')}
                </MenuItem>
                <MenuItem onClick={handleEditProfil}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  {t('profile.editProfile')}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  {t('common.logout')}
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography variant="h6" sx={{ fontWeight: 700, opacity: open ? 1 : 0 }}>
            MENU
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List sx={{ px: 1 }}>
          {sideBarData.map((elem, index) => {
            const item = (
              <Link to={elem.path} key={index} style={{ all: "unset" }}>
                <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                      "&.Mui-selected": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.25),
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: theme.palette.primary.main,
                      }}
                    >
                      {elem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={elem.text}
                      sx={{
                        opacity: open ? 1 : 0,
                        '& .MuiTypography-root': {
                          fontWeight: 500
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            );

            return open ? item : (
              <Tooltip title={elem.text} placement="right" key={index}>
                {item}
              </Tooltip>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.grey[50],
          minHeight: "100vh",
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
            p: 3,
          }}
        >
          <Outlet />
        </Box>
        <ScrollToTopButton />
      </Box>
    </Box >
  );
}