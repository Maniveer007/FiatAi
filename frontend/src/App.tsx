import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import BuyFiat from "./pages/BuyFiat";
import SellFiat from "./pages/SellFiat";
import Success from "./pages/Success";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] via-[#2b2c31] to-[#1f2024]">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/buy" element={<BuyFiat />} />
          <Route path="/sell" element={<SellFiat />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
