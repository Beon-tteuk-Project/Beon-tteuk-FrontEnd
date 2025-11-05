import React from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="form-container">
      <h2>로그인</h2>
      <input type="text" placeholder="아이디" />
      <input type="password" placeholder="비밀번호" />
      <button>로그인</button>
      <div className="form-links">
        <Link to="/signup">회원가입</Link> | <Link to="/forgot-password">비밀번호 찾기</Link>
      </div>
    </div>
  );
}
