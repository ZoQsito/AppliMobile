import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import "../styles/app.css";
import "../bootstrap";
import { Navbar } from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import AgentsPage from "./pages/AgentsPage";
import AgentPage from "./pages/AgentPage";
import PlanningPage from "./pages/PlanningPage";
import AuthAPI from "./services/AuthAPI";
import jwtDecode from "jwt-decode";
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";
import { AuthContext } from "./contexts/AuthContext";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const [isAdmin, setIsAdmin] = useState(false);
  const [isRESP, setIsRESP] = useState(false);
  const [decodedToken, setDecodedToken] = useState([]);

  useEffect(() => {
    var token = localStorage.getItem("authToken");

    if (token) {
      var decodedToken = jwtDecode(token);
      setDecodedToken(decodedToken)
      if (decodedToken.roles[0] === "ROLE_ADMIN") {
        setIsAdmin(true);
      }

      if (decodedToken.roles[0] === "ROLE_RESP") {
        setIsRESP(true);
      }
    }
  }, [isAuthenticated]);

  const adminRoute = (path, element) => {
    return (
      <Route
        path={path}
        element={
          isAuthenticated && isAdmin ? (
            element
          ) : (
            <Navigate to="/" state={{ from: window.location.pathname }} />
          )
        }
      />
    );
  };

  const RESPRoute = (path, element) => {
    return (
      <Route
        path={path}
        element={
          (isAuthenticated && isAdmin) || isRESP ? (
            element
          ) : (
            <Navigate to="/" state={{ from: window.location.pathname }} />
          )
        }
      />
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isAdmin,
        isRESP,
        decodedToken,
      }}
    >
      <Router basename={process.env.BASE_PATH}>
        <Navbar />
        <main className="container pt-5">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PlanningPage />} />
            {RESPRoute("/agents", <AgentsPage />)}
            {RESPRoute("/agent/:id", <AgentPage />)}
            {adminRoute("/users", <UsersPage />)}
            {adminRoute("/user/:id", <UserPage />)}
          </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
const root = createRoot(rootElement);
root.render(<App />);
