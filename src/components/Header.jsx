import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        번뜩 ⚡️
      </div>
      <div className="nav-buttons">
        {isAuthenticated ? (
          <>
            <button className="nav-btn" onClick={() => navigate("/profile")}>
              내 정보
            </button>
            <button className="nav-btn icon-btn" onClick={toggleTheme} title="다크모드 전환">
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </>
        ) : (
          <>
            <button className="nav-btn" onClick={() => navigate("/login")}>
              로그인
            </button>
            <button
              className="nav-btn primary"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}
