import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login as loginApi } from "../api/authApi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 백엔드 API 호출
      const response = await loginApi(username, password);
      
      // 응답 데이터를 AuthContext 형식에 맞게 변환
      const userData = {
        userId: response.userId,
        username: response.userId,
        userName: response.userName,
        nickname: response.userName,
        email: `${response.userId}@example.com`,
        userAuth: response.userAuth
      };

      login(userData);
      navigate("/");
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-icon">👤</div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        {error && <div style={{ color: "red", fontSize: "14px" }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      <div className="form-links">
        <Link to="/signup">회원가입</Link> | <Link to="/forgot-password">비밀번호 찾기</Link>
      </div>
    </div>
  );
}
