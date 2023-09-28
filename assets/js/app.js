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
import RegisterPage from "./pages/RegisterPage";
import AgentsPage from "./pages/AgentsPage";
import AgentPage from "./pages/AgentPage";
import PlanningPage from "./pages/PlanningPage";
import AuthAPI from "./services/AuthAPI";
import jwtDecode from "jwt-decode";
import AuthContext from "./contexts/AuthContext";
import Testpage from "./pages/Testpage";
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";


const App = () => {
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

  const AuthenticatedRoute = (path, element) => {
    return (
      <Route
        path={path}
        element={
          isAuthenticated ? (
            element
          ) : (
            <Navigate to="/login" state={{ from: window.location.pathname }} />
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
      }}
    >
      <Router>
        <Navbar/>
        <main className="container pt-5">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PlanningPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test" element={<Testpage />} />
            {adminRoute("/agents", <AgentsPage />)}
            {adminRoute("/agent/:id", <AgentPage />)}
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
