import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Forecasting from "./components/Forecasting";
import Calculator from "./components/Calculator";
import Policies from "./components/Policies";

function App() {
  const [solarData, setSolarData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null); // ⬅ new

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={<Dashboard solarData={solarData} lastUpdated={lastUpdated} />} 
        />

        <Route 
          path="/calculator" 
          element={<Calculator setSolarData={setSolarData} setLastUpdated={setLastUpdated} />} 
        />

        <Route 
          path="/forecasting" 
          element={<Forecasting solarData={solarData} />} 
        />

        <Route 
          path="/policies" 
          element={<Policies />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

