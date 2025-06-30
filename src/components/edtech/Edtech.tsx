import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TechClub from "./pages/TechClub";
import ExamPrep from "./pages/ExamPrep";
import Library from "./pages/Library";
import AdminDashboard from "./pages/AdminDashboard";
import "./styles/fonts.css";
import "./styles/effects.css";
import "./Edtech.css";

const Edtech: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="library" element={<Library />} />
        <Route path="tech-club" element={<TechClub />} />
        <Route path="exam-prep" element={<ExamPrep />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default Edtech;
