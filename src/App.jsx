import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import "./styles/header.css";
import "./styles/chat.css";

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Routes prepared for future pages (components not created on purpose) */}
        <Route path="/login" element={<div />} />
        <Route path="/register" element={<div />} />
      </Routes>
    </div>
  );
}
