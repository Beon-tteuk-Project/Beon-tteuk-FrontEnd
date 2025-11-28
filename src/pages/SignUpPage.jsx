import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signup as signupApi } from "../api/authApi";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    password: "",
    passwordConfirm: "",
    userBirth: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    setError("");

    // 유효성 검사
    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.userId || !formData.userName || !formData.password) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 백엔드 API 호출
      await signupApi(
        formData.userId,
        formData.userName,
        formData.password,
        formData.userBirth || ""
      );
      
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-icon">👤</div>
      <h2>회원가입</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="아이디"
          value={formData.userId}
          onChange={(e) => handleChange("userId", e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="text"
          placeholder="이름"
          value={formData.userName}
          onChange={(e) => handleChange("userName", e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={formData.passwordConfirm}
          onChange={(e) => handleChange("passwordConfirm", e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="text"
          placeholder="생년월일 (예: 1990-01-01)"
          value={formData.userBirth}
          onChange={(e) => handleChange("userBirth", e.target.value)}
          disabled={loading}
        />
        {error && <div style={{ color: "red", fontSize: "14px" }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}
