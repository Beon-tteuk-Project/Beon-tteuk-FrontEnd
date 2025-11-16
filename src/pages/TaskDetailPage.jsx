import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TaskDetailPage() {
  const { subjectId, taskId } = useParams();
  const navigate = useNavigate();
  const [problemHistory, setProblemHistory] = useState([
    {
      id: 1,
      createdAt: "2025-01-10",
      score: 85,
      totalProblems: 10,
      correctProblems: 8
    },
    {
      id: 2,
      createdAt: "2025-01-12",
      score: 90,
      totalProblems: 10,
      correctProblems: 9
    }
  ]);

  // 테스트용 Task 데이터
  const task = {
    id: taskId,
    title: "1장: 기본 개념 이해",
    description: "이 Task에서는 기본적인 개념을 학습합니다. 주요 개념들을 숙지하고, 실전 문제를 통해 이해도를 높이세요.",
    subject: "수학",
  };

  const handleGenerateProblem = () => {
    navigate(`/problem/generate/${subjectId}/${taskId}`);
  };

  const handleViewProblem = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  return (
    <div className="task-detail-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        &lt; 과목 목록으로
      </button>

      <div className="task-detail-header">
        <h2>{task.title}</h2>
        <p className="task-subject">{task.subject}</p>
      </div>

      <div className="task-section">
        <h3>Task 설명</h3>
        <p className="task-description">{task.description}</p>
      </div>

      <div className="task-section">
        <h3>문제 생성</h3>
        <button className="generate-problem-btn" onClick={handleGenerateProblem}>
          📝 새 문제 생성하기
        </button>
      </div>

      <div className="task-section">
        <h3>문제 풀이 기록</h3>
        {problemHistory.length > 0 ? (
          <div className="problem-history-list">
            {problemHistory.map((record) => (
              <div
                key={record.id}
                className="problem-history-item"
                onClick={() => handleViewProblem(record.id)}
              >
                <div className="history-info">
                  <h4>문제 {record.id}</h4>
                  <p>날짜: {record.createdAt}</p>
                  <p>
                    정답률: {record.correctProblems}/{record.totalProblems} ({record.score}점)
                  </p>
                </div>
                <span>&gt;</span>
              </div>
            ))}
          </div>
        ) : (
          <p>아직 풀이 기록이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
