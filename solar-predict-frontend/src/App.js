import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Forecasting from "./components/Forecasting";
import Calculator from "./components/Calculator";
import Policies from "./components/Policies";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forecasting" element={<Forecasting />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/policies" element={<Policies />} />
      </Routes>
    </Router>
  );
}

export default App;
