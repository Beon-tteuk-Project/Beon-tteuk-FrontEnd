import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    // 테스트용: 비밀번호 변경 성공
    alert("비밀번호가 변경되었습니다.");
    setIsEditingPassword(false);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-icon">👤</div>
        <h2>내 정보</h2>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>기본 정보</h3>
          <div className="profile-item">
            <label>회원 고유번호</label>
            <span>{user?.id}</span>
          </div>
          <div className="profile-item">
            <label>아이디</label>
            <span>{user?.username}</span>
          </div>
          <div className="profile-item">
            <label>닉네임</label>
            <span>{user?.nickname}</span>
          </div>
          <div className="profile-item">
            <label>이름</label>
            <span>{user?.name}</span>
          </div>
          <div className="profile-item">
            <label>이메일</label>
            <span>{user?.email}</span>
          </div>
        </div>

        <div className="profile-section">
          <h3>학습 통계</h3>
          <div className="profile-item">
            <label>총 학습 시간</label>
            <span>0 시간</span>
          </div>
          <div className="profile-item">
            <label>완료한 문제</label>
            <span>0 개</span>
          </div>
          <div className="profile-item">
            <label>등록한 과목</label>
            <span>0 개</span>
          </div>
        </div>

        <div className="profile-section">
          <h3>보안</h3>
          {!isEditingPassword ? (
            <button className="edit-btn" onClick={() => setIsEditingPassword(true)}>
              비밀번호 변경
            </button>
          ) : (
            <div className="password-change-form">
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
              <div className="button-group">
                <button onClick={handlePasswordChange}>변경</button>
                <button onClick={() => setIsEditingPassword(false)}>취소</button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
