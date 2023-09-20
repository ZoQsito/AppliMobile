import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthAPI from "../services/AuthAPI";
import { toast } from "react-toastify";
import AuthContext from "../contexts/AuthContext";

export const Navbar2 = () => {
  const isAuthenticated = useContext(AuthContext);

  const [isAdmin, setIsAdmin] = useState(true);

  const handleLogout = () => {
    AuthAPI.logout();
    window.location.href = "/login";
  };



  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          DISP
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor02"
          aria-controls="navbarColor02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

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
          </ul>
          <ul className="navbar-nav ml-auto">
            {(isAuthenticated.isAuthenticated === false && (
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
                <button onClick={handleLogout} className="btn btn-danger">
                  Déconnexion
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
