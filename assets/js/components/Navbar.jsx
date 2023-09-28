import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AuthAPI from "../services/AuthAPI";
import jwtDecode from "jwt-decode";
import "../../styles/navbar.css";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

export const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    var token = localStorage.getItem("authToken");

    if (token) {
      var decodedToken = jwtDecode(token);
      if (decodedToken.roles[0] === "ADMIN") {
        setIsAdmin(true);
      }
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    AuthAPI.logout();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand"
          to="/"
          style={{ paddingRight: "50px" }}
        >
          DISP
        </NavLink>
        <div className="collapse navbar-collapse" id="navbarColor02">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Planning
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/agents">
                  Gestion Agent
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">
                  Gestion User
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ml-auto">
            {(isAuthenticated === false && (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Inscription
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="btn btn-outline-success">
                    Connexion
                  </NavLink>
                </li>
              </>
            )) || (
              <li className="nav-item">
                <Button variant="contained" onClick={handleLogout} color="error">
                Déconnexion
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
