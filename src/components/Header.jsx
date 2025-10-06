import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo">벼락치기</div>
      <div className="nav-buttons">
        <button className="nav-btn" onClick={() => navigate("/login")}>
          로그인
        </button>
        <button className="nav-btn" onClick={() => navigate("/register")}>
          회원가입
        </button>
      </div>
    </header>
  );
}
