import React from "react";
import HomePage from "./pages/HomePage";
import AccueilPage from "./pages/AcueilPage";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "../styles/app.css";
import "../bootstrap";

const App = () => {
  return (
    <BrowserRouter>
      <main className="container pt-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<AccueilPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);
root.render(<App />);
