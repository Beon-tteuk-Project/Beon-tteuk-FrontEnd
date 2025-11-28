import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TaskDetailPage() {
  const { subjectId, taskId } = useParams();
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [problemHistory] = useState([
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

  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      const parsedSubjects = JSON.parse(savedSubjects);

      // 현재 subjectId에 해당하는 과목 찾기
      const foundSubject = parsedSubjects.find(
        (sub) => String(sub.id) === String(subjectId)
      );

      if (foundSubject && foundSubject.tasks) {
        // 현재 taskId에 해당하는 Task 찾기
        const foundTask = foundSubject.tasks.find(
          (t) => String(t.task_id) === String(taskId)
        );
        setCurrentTask(foundTask);
      }
    }
    setLoading(false);
  }, [subjectId, taskId]);

  const handleGenerateProblem = () => {
    navigate(`/problem/generate/${subjectId}/${taskId}`);
  };

  const handleViewProblem = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  if (loading) {
    return <div className="task-detail-container">로딩 중...</div>;
  }

  if (!currentTask) {
    return (
      <div className="task-detail-container">
        <p>Task를 찾을 수 없습니다.</p>
        <button className="back-btn" onClick={() => navigate("/")}>
          &lt; 홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="task-detail-wrapper">
      <div className="task-detail-container">
        <button className="back-btn" onClick={() => navigate(`/subjects/${subjectId}`)}>
          &lt; 뒤로 가기
        </button>

        <div className="task-detail-header">
          <h2>{currentTask.title}</h2>
          <p className="task-subject">{currentTask.subject}</p>
        </div>

        <div className="task-section">
          <h3>Task 설명</h3>
          <p className="task-description">{currentTask.summary}</p>
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
    </div>
  );
}
