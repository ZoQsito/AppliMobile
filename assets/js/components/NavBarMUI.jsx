import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import { useAuth } from "../contexts/AuthContext";
import AuthAPI from "../services/AuthAPI";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CustomizedSwitches from "./MUISwitch";
import ColorModeContext from "../services/ColorModeContext";
import { useContext } from "react";

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const { isAdmin, setIsAuthenticated, isAuthenticated, isRESP } = useAuth();

  const handleLogout = () => {
    setIsAuthenticated(false);
    AuthAPI.logout();
    navigate("/login");
  };

  const colorMode = useContext(ColorModeContext);
  const currentMode = colorMode.mode;

  const loginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static" color="inherit">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <NavLink to="/">
              <EventIcon
                sx={{
                  display: { xs: "none", md: "flex" },
                  mr: 3,
                  fontSize: "36px",
                }}
              />
            </NavLink>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {isAuthenticated ? (
                isAdmin === true ? (
                  <>
                    <Link
                      variant="contained"
                      color="inherit"
                      style={currentMode === 'dark' ? { textDecoration: "none", color: "white", marginRight: "10px" } : {textDecoration: "none", color:"black", marginRight: "10px"}}
                      to={"/agents"}
                    >
                      Gestion Agent
                    </Link>
                    <Link
                      variant="contained"
                      color="inherit"
                      style={currentMode === 'dark' ? { textDecoration: "none", color: "white" } : {textDecoration: "none", color:"black"}}
                      to={"/users"}
                    >
                      Gestion User
                    </Link>
                  </>
                ) : null
              ) : null}
            </Box>
            <Box>
              <CustomizedSwitches />
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {(isAuthenticated === false && (
                <Button
                  variant="contained"
                  onClick={() => loginClick()}
                  color="success"
                >
                  Connexion
                </Button>
              )) || (
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  color="error"
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
