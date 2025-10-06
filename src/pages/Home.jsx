import React from "react";
import ChatContainer from "../components/ChatContainer";

export default function Home() {
  return (
    <main className="main-container">
      <div className="title-section">
        <h1 className="main-title">벼락치기 AI</h1>
        <p className="subtitle">이미지, PDF, 텍스트로 학습하세요</p>
        <p className="description">AI가 당신의 시험 준비를 도와드립니다</p>
      </div>
      <ChatContainer />
    </main>
  );
}
