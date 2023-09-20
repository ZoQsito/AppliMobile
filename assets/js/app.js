import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "../styles/app.css";
import "../bootstrap";
import { Navbar2 } from "./components/Navbar2";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AgentsPage from "./pages/AgentsPage";
import AgentPage from "./pages/AgentPage";
import PlanningPage from "./pages/PlanningPage";
import AuthAPI from "./services/AuthAPI";
import jwtDecode from "jwt-decode";
import AuthContext from "./contexts/AuthContext";

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

  const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      <Router>
        <Navbar2 />
        <main className="container pt-5">
          <Routes>
            <Route path="/" element={<PlanningPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agent/:id" element={<AgentPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
const root = createRoot(rootElement);
root.render(<App />);
