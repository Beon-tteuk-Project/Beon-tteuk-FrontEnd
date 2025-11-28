import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CrammingPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  const handleStartCramming = () => {
    if (subjects.length === 0) {
      alert("먼저 과목을 추가해주세요!");
      navigate("/");
      return;
    }
    setIsStarted(true);
  };

  const calculateDaysUntilExam = () => {
    if (subjects.length === 0) return 0;

    const examDates = subjects.map(s => new Date(s.date));
    const latestExam = new Date(Math.max(...examDates));
    const today = new Date();
    const diffTime = latestExam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const renderIntro = () => (
    <div className="cramming-wrapper">
      <div className="cramming-intro">
        <div className="cramming-header">
          <h1>⚡ 벼락치기 모드</h1>
          <p className="cramming-subtitle">시간이 부족할 때, AI가 당신을 위한 최적의 학습 계획을 세워드립니다</p>
        </div>

      <div className="cramming-comparison">
        <div className="mode-card">
          <h3>📚 일반 모드</h3>
          <div className="mode-steps">
            <div className="mode-step">
              <span className="step-number">1</span>
              <p>과목 선택</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="mode-step">
              <span className="step-number">2</span>
              <p>Task 선택</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="mode-step">
              <span className="step-number">3</span>
              <p>문제 생성</p>
            </div>
          </div>
          <p className="mode-description">체계적으로 하나씩 학습하며 진도를 나가는 방식</p>
        </div>

        <div className="mode-card highlight">
          <h3>⚡ 벼락치기 모드</h3>
          <div className="mode-steps">
            <div className="mode-step">
              <span className="step-number">1</span>
              <p>시작 버튼 클릭</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="mode-step">
              <span className="step-number">2</span>
              <p>AI가 자동 계획</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="mode-step">
              <span className="step-number">3</span>
              <p>따라하기만!</p>
            </div>
          </div>
          <p className="mode-description">마지막 시험까지 남은 시간을 고려해 자동으로 최적화된 학습 순서 제공</p>
        </div>
      </div>

      <div className="cramming-features">
        <h3>벼락치기 모드의 특징</h3>
        <div className="feature-grid">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <h4>우선순위 자동 설정</h4>
            <p>중요도와 시험일을 고려하여 무엇부터 공부할지 자동으로 결정</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏱️</span>
            <p>남은 시간 기반 최적화</p>
            <p>마지막 시험까지 남은 시간을 계산하여 학습량 자동 조절</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <h4>자동 문제 생성</h4>
            <p>각 과목의 핵심 내용을 중심으로 문제를 자동 생성</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <h4>실시간 진도 추적</h4>
            <p>현재 어디까지 했는지, 얼마나 남았는지 한눈에 확인</p>
          </div>
        </div>
      </div>

      <div className="cramming-stats">
        <div className="stat-item">
          <span className="stat-number">{subjects.length}</span>
          <span className="stat-label">등록된 과목</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{calculateDaysUntilExam()}</span>
          <span className="stat-label">마지막 시험까지 남은 일</span>
        </div>
      </div>

      <div className="cramming-actions">
        <button className="start-cramming-btn" onClick={handleStartCramming}>
          벼락치기 모드 시작하기
        </button>
        <button className="back-home-btn" onClick={() => navigate("/")}>
          홈으로 돌아가기
        </button>
      </div>
      </div>
    </div>
  );

  const renderCrammingProgress = () => (
    <div className="cramming-wrapper">
      <div className="cramming-progress">
        <div className="progress-header">
          <h2>벼락치기 모드 진행 중</h2>
          <p>AI가 생성한 학습 순서를 따라가세요</p>
        </div>

      <div className="progress-timeline">
        {subjects
          .sort((a, b) => {
            // 우선순위, 중요도, 시험일 기준으로 정렬
            if (a.priority !== b.priority) return a.priority - b.priority;
            if (a.importance !== b.importance) return b.importance - a.importance;
            return new Date(a.date) - new Date(b.date);
          })
          .map((subject, index) => (
            <div key={subject.id} className={`timeline-item ${index === currentStep ? 'active' : index < currentStep ? 'completed' : ''}`}>
              <div className="timeline-marker">
                {index < currentStep ? '✓' : index + 1}
              </div>
              <div className="timeline-content">
                <h4>{subject.name}</h4>
                <p>중요도: {"★".repeat(subject.importance)}</p>
                <p>시험까지: D-{Math.ceil((new Date(subject.date) - new Date()) / (1000 * 60 * 60 * 24))}</p>
                {index === currentStep && (
                  <button className="study-now-btn" onClick={() => navigate(`/task/${subject.id}/1`)}>
                    지금 공부하기
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="progress-footer">
        <button className="back-btn" onClick={() => setIsStarted(false)}>
          처음으로
        </button>
      </div>
      </div>
    </div>
  );

  return (
    <div className="cramming-container">
      {!isStarted ? renderIntro() : renderCrammingProgress()}
    </div>
  );
}
