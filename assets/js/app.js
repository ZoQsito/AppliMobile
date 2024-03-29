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
import {
  CssBaseline,
  Backdrop,
  CircularProgress,
  Container,
} from "@mui/material";
import ResponsiveAppBar from "./components/NavBarMUI";
import ToggleColorModeProvider from "./services/ToggleColorModeProvider";
import HomePage from "./pages/HomePage";
import TicketClientPage from "./pages/TicketClientPage";
import { createTheme } from "./theme";
import { ThemeProvider } from '@mui/material/styles';
import UsersPage from "./pages/UsersPage";
import TicketsAdminPage from "./pages/TicketAdmin";
import TicketForm from "./pages/TicketForm";
import ApplicationAPI from "./services/ApplicationAPI";
import etatAPI from "./services/etatAPI";
import UserForm from "./pages/UserForm";
import NotificationAPI from "./services/NotificationAPI";
import AppAdmin from "./pages/AppAdmin";
import TicketsAdminPersoPage from "./pages/TicketAdminPerso";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const [decodedToken, setDecodedToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(true);
  const [apps, setApps] = useState()
  const [etats, setEtats] = useState()
  const [notifIds, setNotifIds] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  const UserId = decodedToken?.custom_data?.UserId

  useEffect(() => {
    var token = localStorage.getItem("authToken");

    if (token) {
      var decodedToken = jwtDecode(token);
      setDecodedToken(decodedToken);
      if (decodedToken.roles[0] === "ROLE_ADMIN") {
        setIsAdmin(true);
      }
    } else {
      setIsAdmin(false);
      setDecodedToken(null);
    }
    
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const notif = await NotificationAPI.findAll();
      const app = await ApplicationAPI.findAll();
      const etat = await etatAPI.findAll();
      setEtats(etat);
      setApps(app);
      setNotifIds(notif);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (notifIds && UserId) {
      const filteredNotifs = notifIds.filter((notif) => {
        return notif.users.includes(`/api/users/${UserId}`);
      });

      setFilteredNotifications(filteredNotifs);
    }
  }, [notifIds, UserId]);

  useEffect(() => {
    fetchData()
  }, []);


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

  const theme = createTheme();

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isAdmin,
        decodedToken,
        setIsAdmin,
        etats,
        apps,
        notifIds : filteredNotifications,
        setNotifIds,
        setApps,
      }}
    >
      <ToggleColorModeProvider>
        <CssBaseline />
        <Router basename={process.env.BASE_PATH}>
          <div className="App">
            <ThemeProvider theme={theme}>
              <ResponsiveAppBar />
              <main
                id="container"
                style={{ marginLeft: "10%", marginRight: "10%", marginTop: "75px" }}
              >
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<HomePage />} />
                  {isAuthenticated &&(<Route path="/ticket" element={<TicketClientPage />} />)}
                  {adminRoute("/ticketsAdmin", <TicketsAdminPage />)}
                  {adminRoute("/ticketsAdminPerso", <TicketsAdminPersoPage />)}
                  {adminRoute("/users", <UsersPage />)}
                  {adminRoute("/AddUsers", <UserForm />)}
                  {adminRoute("/applications", <AppAdmin />)}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </ThemeProvider>
          </div>
        </Router>
      </ToggleColorModeProvider>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
const root = createRoot(rootElement);
root.render(<App />);
