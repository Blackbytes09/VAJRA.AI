import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicPortal from "./pages/PublicPortal";
import ProDashboard from "./pages/ProDashboard";
import AdminTerminal from "./pages/AdminTerminal";
import AnalystPortal from "./pages/AnalystPortal";
import Pricing from "./pages/Pricing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPortal />} />
        <Route path="/pro" element={<ProDashboard />} />
        <Route path="/admin" element={<AdminTerminal />} />
        <Route path="/analyst" element={<AnalystPortal />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
}
