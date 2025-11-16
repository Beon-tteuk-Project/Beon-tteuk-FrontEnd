import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // 테스트용: 임시 사용자 데이터
    const userData = {
      id: Date.now(),
      username: username,
      nickname: username,
      email: `${username}@example.com`,
      name: "테스트 사용자"
    };

    login(userData);
    navigate("/");
  };

  return (
    <div className="form-container">
      <div className="form-icon">👤</div>
      <h2>로그인</h2>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
      <div className="form-links">
        <Link to="/signup">회원가입</Link> | <Link to="/forgot-password">비밀번호 찾기</Link>
      </div>
    </div>
  );
}
