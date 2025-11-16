import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProblemViewPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  // 테스트용 문제 데이터
  const problemData = {
    id: problemId,
    createdAt: "2025-01-12",
    score: 90,
    totalProblems: 10,
    correctProblems: 9,
    problems: [
      {
        id: 1,
        question: "1 + 1은 무엇인가요?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        userAnswer: "2",
        isCorrect: true
      },
      {
        id: 2,
        question: "2 + 2는 무엇인가요?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        userAnswer: "3",
        isCorrect: false
      },
      {
        id: 3,
        question: "3 + 3은 무엇인가요?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        userAnswer: "6",
        isCorrect: true
      },
    ]
  };

  return (
    <div className="problem-view-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &lt; 뒤로 가기
      </button>

      <div className="problem-view-header">
        <h2>문제 풀이 결과</h2>
        <div className="result-summary">
          <p>날짜: {problemData.createdAt}</p>
          <p>
            정답률: {problemData.correctProblems}/{problemData.totalProblems} ({problemData.score}점)
          </p>
        </div>
      </div>

      <div className="problem-detail-list">
        {problemData.problems.map((problem, index) => (
          <div key={problem.id} className={`problem-detail-item ${problem.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="problem-detail-header">
              <h3>문제 {index + 1}</h3>
              <span className="result-badge">
                {problem.isCorrect ? "✅ 정답" : "❌ 오답"}
              </span>
            </div>
            <p className="question">{problem.question}</p>
            <div className="answer-info">
              <p>내 답변: <strong>{problem.userAnswer}</strong></p>
              {!problem.isCorrect && (
                <p>정답: <strong className="correct-answer">{problem.correctAnswer}</strong></p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
