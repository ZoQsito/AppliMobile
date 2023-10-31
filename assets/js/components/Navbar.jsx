import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthAPI from "../services/AuthAPI";
import CustomizedSwitches from "./MUISwitch";

export const Navbar = () => {
  const navigate = useNavigate();

  const { isAdmin, setIsAuthenticated, isAuthenticated, isRESP, decodedToken} =
    useAuth();

  const handleLogout = () => {
    setIsAuthenticated(false);
    AuthAPI.logout();
    navigate("/login");
  };



  return (
    <nav className="navbar navbar-expand-lg navbar-light">
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
            {isAdmin === true || isRESP === true ? (
              <li className="nav-item">
                <NavLink className="nav-link" to="/agents">
                  Gestion Agent
                </NavLink>
              </li>
            ) : null}
            {isAdmin === true && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">
                  Gestion User
                </NavLink>
              </li>
            )}
          </ul>
          <ul>
          <CustomizedSwitches/>
          </ul>
          <ul className="navbar-nav ml-auto">
            {(isAuthenticated === false && (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="btn btn-outline-success">
                    Connexion
                  </NavLink>
                </li>
              </>
            )) || (
              <li className="nav-item">
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  color="error"
                >
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
