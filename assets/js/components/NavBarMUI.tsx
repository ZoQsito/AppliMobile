import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthAPI from "../services/AuthAPI";
import ColorModeContext from "../services/ColorModeContext";
import CustomizedSwitches from "./MUISwitch";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Badge,
  Box,
  Button,
  CSSObject,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Theme,
  Toolbar,
  Typography,
  styled,
  useTheme,
  ListSubheader,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AppsIcon from '@mui/icons-material/Apps';
import CustomizedSnackbars from "./CustomizedSnackbars";
import NotificationAPI from "../services/NotificationAPI.js";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
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
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function NavBarAndSideBar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { isAdmin, setIsAuthenticated, isAuthenticated, notifIds, setNotifIds } =
    useAuth();
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [message, setMessage] = useState("");


  const handleNotification = async (event) => {
    event.preventDefault();

    try {
      setErrorOccurred(true);
      setMessage(`Vous avez ${notifIds.length} nouveau Ticket`);
      await Promise.all(notifIds.map(notification => NotificationAPI.delete(notification.id)));
      setNotifIds([]);
    } catch (error) {}
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    AuthAPI.logout();
    setIsAuthenticated(false);
    navigate("/login");
  };

  const loginClick = () => {
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        style={{ backgroundColor: "#6366F1" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  style={{ marginRight: "30px" }}
                  onClick={handleNotification}
                >
                  <Badge badgeContent={notifIds.length} color="success">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <CustomizedSwitches />
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  color="error"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <CustomizedSwitches />
                <Button
                  variant="contained"
                  onClick={() => loginClick()}
                  color="success"
                >
                  Connexion
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <div>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            {isAuthenticated && (
              <>
                <ListItemButton onClick={() => navigate("/ticket")}>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tickets" />
                </ListItemButton>
              </>
            )}
          </div>
        </List>
        {isAdmin && isAuthenticated && (
          <>
            <Divider />
            <List>
              <div>
                <ListSubheader inset>Administration</ListSubheader>
                <ListItemButton onClick={() => navigate("/ticketsAdmin")}>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tous les Tickets" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/ticketsAdminPerso")}>
                  <ListItemIcon>
                    <AssignmentIndIcon />
                  </ListItemIcon>
                  <ListItemText primary="Mes Tickets" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/applications")}>
                  <ListItemIcon>
                    <AppsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Applications" />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/users")}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Utilisateurs" />
                </ListItemButton>
              </div>
            </List>
          </>
        )}
      </Drawer>
      {errorOccurred && (
        <CustomizedSnackbars
          anchorOrigin={{ vertical : "top", horizontal : "right" }}
          open={errorOccurred}
          severity="success"
          message={message}
          onClose={() => setErrorOccurred(false)}
          style={{top: "86px"}}
        />
      )}
    </Box>
  );
}
