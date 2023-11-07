import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import "../styles/app.css";
import LoginPage from "./pages/LoginPage";
import AgentsPage from "./pages/AgentsPage";
import AgentPage from "./pages/AgentPage";
import PlanningPage from "./pages/PlanningPage";
import AuthAPI from "./services/AuthAPI";
import jwtDecode from "jwt-decode";
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";
import { AuthContext } from "./contexts/AuthContext";
import { CssBaseline } from "@mui/material";
import ResponsiveAppBar from "./components/NavBarMUI";
import ToggleColorModeProvider from "./services/ToggleColorModeProvider";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );
  
  const [decodedToken, setDecodedToken] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRESP, setIsRESP] = useState(false);


  useEffect(() => {
    var token = localStorage.getItem("authToken");

    if (token) {
      var decodedToken = jwtDecode(token);
      setDecodedToken(decodedToken);
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
          isAdmin ? (
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
          isAdmin || isRESP ? (
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
        setIsAdmin,
        setIsRESP,
      }}
    >
        <ToggleColorModeProvider>
        <CssBaseline />
        <Router basename={process.env.BASE_PATH}>
          <div className="App">
            <ResponsiveAppBar/>
            <main id="container" style={{marginLeft: "10%", marginRight:"10%"}}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<PlanningPage />} />
                {RESPRoute("/agents", <AgentsPage />)}
                {RESPRoute("/agent/:id", <AgentPage />)}
                {adminRoute("/users", <UsersPage />)}
                {adminRoute("/user/:id", <UserPage />)}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </Router>
        </ToggleColorModeProvider>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
const root = createRoot(rootElement);
root.render(<App />);
