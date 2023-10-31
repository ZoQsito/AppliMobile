import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthAPI from "../services/AuthAPI";
import { NavLink, useNavigate } from "react-router-dom";
import CustomizedSwitches from "./MUISwitch";

const pages = ["Products", "Pricing", "Blog"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const navigate = useNavigate();

  const { isAdmin, setIsAuthenticated, isAuthenticated, isRESP, decodedToken } =
    useAuth();

  const handleLogout = () => {
    setIsAuthenticated(false);
    AuthAPI.logout();
  };

  const userClick = () => {
    navigate("/users")
  }

  const agentClick = () => {
    navigate("/agents")
  }

  return (
    <>
      <AppBar position="static" color="inherit">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <NavLink to="/">
            <EventIcon sx={{ display: { xs: "none", md: "flex" }, mr: 3, fontSize: "36px" }} />
            </NavLink>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {isAdmin === true || isRESP === true ? (
                <Button
                  variant="contained"
                  color="inherit"
                  style={{ marginRight: "10px" }}
                  onClick={(() => agentClick())}
                >
                  Gestion Agent
                </Button>
              ) : null}
              {isAdmin === true && (
                <Button variant="contained" color="inherit" onClick={(() => userClick())}>
                  Gestion User
                </Button>
              )}
            </Box>
            <Box >
              <CustomizedSwitches />
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {(isAuthenticated === false && (
                <Button variant="contained" href="/login" color="success">
                  Connexion
                </Button>
              )) || (
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  color="error"
                  href="/login"
                >
                  Déconnexion
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default ResponsiveAppBar;
