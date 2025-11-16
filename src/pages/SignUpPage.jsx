import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
    email: "",
    name: ""
  });
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (field === "nickname") setNicknameChecked(false);
  };

  const handleNicknameCheck = () => {
    // 테스트용: 항상 사용 가능
    alert("사용 가능한 닉네임입니다!");
    setNicknameChecked(true);
  };

  const handleSignUp = () => {
    if (!nicknameChecked) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 테스트용: 바로 로그인 처리
    const userData = {
      id: Date.now(),
      username: formData.username,
      nickname: formData.nickname,
      email: formData.email,
      name: formData.name
    };

    login(userData);
    navigate("/");
  };

  return (
    <div className="form-container">
      <div className="form-icon">👤</div>
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="아이디"
        value={formData.username}
        onChange={(e) => handleChange("username", e.target.value)}
      />
      <input
        type="text"
        placeholder="이름"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <div className="nickname-check">
        <input
          type="text"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={(e) => handleChange("nickname", e.target.value)}
        />
        <button onClick={handleNicknameCheck}>중복 확인</button>
      </div>
      <input
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={formData.passwordConfirm}
        onChange={(e) => handleChange("passwordConfirm", e.target.value)}
      />
      <input
        type="email"
        placeholder="이메일"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <div className="email-verification">
        <input type="text" placeholder="인증코드" />
        <button style={{ width: '120px' }}>코드 전송</button>
      </div>
      <button onClick={handleSignUp}>회원가입</button>
    </div>
  );
}
