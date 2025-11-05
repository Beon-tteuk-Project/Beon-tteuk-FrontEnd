import React from "react";

export default function SignUpPage() {
  return (
    <div className="form-container">
      <h2>회원가입</h2>
      <input type="text" placeholder="아이디" />
      <input type="password" placeholder="비밀번호" />
      <input type="password" placeholder="비밀번호 확인" />
      <input type="email" placeholder="이메일" />
      <div className="email-verification">
        <input type="text" placeholder="인증코드" />
        <button style={{ width: '120px' }}>코드 전송</button>
      </div>
      <button>회원가입</button>
    </div>
  );
}
