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
import AuthAPI from "./services/AuthAPI";
import jwtDecode from "jwt-decode";
import { AuthContext } from "./contexts/AuthContext";
import { CssBaseline,Backdrop, CircularProgress, Container } from "@mui/material";
import ResponsiveAppBar from "./components/NavBarMUI";
import ToggleColorModeProvider from "./services/ToggleColorModeProvider";
import HomePage from "./pages/HomePage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );
  
  const [decodedToken, setDecodedToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    var token = localStorage.getItem("authToken");

    if (token) {
      var decodedToken = jwtDecode(token);
      setDecodedToken(decodedToken);
      if (decodedToken.roles[0] === "ROLE_ADMIN") {
        setIsAdmin(true);
      }
    }

    else {
      setIsAdmin(false);
      setDecodedToken(null);

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

  if (isAuthenticated && !decodedToken) {
    return (
      <Container>
        <Backdrop open={true}>
          <CircularProgress color="primary" />
        </Backdrop>
      </Container>
    );
  }
    
  

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isAdmin,
        decodedToken,
        setIsAdmin,
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
                <Route path="/" element={<HomePage />} />
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
