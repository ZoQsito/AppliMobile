import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { createRoot } from "react-dom/client";
import "../styles/app.css";
import "../bootstrap";
import { Navbar2 } from "./components/Navbar2";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AgentsPage from "./pages/AgentsPage";
import AgentPage from "./pages/AgentPage";
import PlanningPage from "./pages/PlanningPage";

const App = () => {
  return (
    <Router>
      <Navbar2/>
      <main className="container pt-5">
        <Routes>
          <Route path="/" element={<PlanningPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agent/:id" element={<AgentPage/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </Router>
  );
};

const rootElement = document.querySelector("#app");
const root = createRoot(rootElement);
root.render(<App />);
