import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddSubject from "../components/AddSubject";
import Modal from "../components/Modal";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const navigate = useNavigate();
  const { subjectId } = useParams(); // URL에서 subjectId 가져오기

  // 1. 컴포넌트 마운트 시 localStorage에서 과목 불러오기 및 URL 기반 상태 설정
  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjects");
    if (savedSubjects) {
      const parsedSubjects = JSON.parse(savedSubjects);
      setSubjects(parsedSubjects);

      if (subjectId) {
        const foundSubject = parsedSubjects.find(s => String(s.id) === subjectId);
        setSelectedSubject(foundSubject || null);
      } else {
        setSelectedSubject(null);
      }
    }
  }, [subjectId]); // subjectId가 바뀔 때마다 이 effect를 다시 실행

  // 과목이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    // subjects가 초기화되지 않았을 때는 저장하지 않음
    if (subjects && subjects.length > 0) {
      localStorage.setItem("subjects", JSON.stringify(subjects));
    }
  }, [subjects]);

  const extractJsonFromResponse = (text) => {
    try {
      const startMarker = "[START_EXAM_STRUCTURE]";
      const endMarker = "[END_EXAM_STRUCTURE]";
      const startIndex = text.indexOf(startMarker);
      const endIndex = text.indexOf(endMarker);
      if (startIndex !== -1 && endIndex !== -1) {
        const jsonString = text.substring(startIndex + startMarker.length, endIndex);
        return JSON.parse(jsonString);
      }
      return null;
    } catch (e) {
      console.error("JSON 파싱 실패:", e);
      return null;
    }
  };

  const handleAddSubject = (subject) => {
    const aiData = extractJsonFromResponse(subject.aiAnalysis);
    const tasks = aiData ? aiData.tasks : [];
    const aiSummary = aiData ? aiData.subject_summary : "AI 분석에 실패했거나 요약 정보가 없습니다.";
    const newSubject = {
      ...subject,
      id: Date.now(),
      priority: 1,
      tag_name: aiData ? aiData.tag_name : null,
      tasks: tasks,
      aiSummary: aiSummary,
      totalEstimatedHours: aiData ? aiData.total_estimated_hours : 0,
    };
    setSubjects([...subjects, newSubject]);
    setIsModalOpen(false);
  };

  const handleDeleteSubject = (id, e) => {
    e.stopPropagation();
    if (window.confirm("정말로 이 과목을 삭제하시겠습니까?")) {
      const updatedSubjects = subjects.filter((s) => s.id !== id);
      setSubjects(updatedSubjects);
      if (selectedSubject && selectedSubject.id === id) {
        navigate('/'); // 현재 보고 있는 과목이 삭제되면 홈으로 이동
      }
    }
  };

  const calculateDday = (date) => {
    const today = new Date();
    const examDate = new Date(date);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : "Day";
  };

  const sortSubjects = (subjectsArray) => {
    const sorted = [...subjectsArray];
    switch (sortBy) {
      case "importance":
        return sorted.sort((a, b) => b.importance - a.importance);
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "date":
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "priority":
        return sorted.sort((a, b) => a.priority - b.priority);
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // 과목 목록 뷰
  const renderSubjectList = () => (
    <>
      <div className="title-section" style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 className="main-title">번뜩</h1>
        <p className="subtitle">AI와 함께 과목을 정복하고 시험을 준비하세요</p>
      </div>
      <div className="cramming-section">
        <button className="cramming-btn-large" onClick={() => navigate("/cramming")}>
          ⚡ 벼락치기 모드 시작하기
        </button>
      </div>
      <div className="subject-list-wrapper">
        <div className="subject-list-container">
          <div className="subject-header">
            <h2>내 과목</h2>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="createdAt">만든 날짜</option>
              <option value="importance">중요도</option>
              <option value="name">이름</option>
              <option value="date">시험일</option>
            </select>
          </div>
          {subjects.length > 0 ? (
            sortSubjects(subjects).map((s) => (
              <div key={s.id} className="subject-item" onClick={() => navigate(`/subjects/${s.id}`)}>
                <button className="delete-btn" onClick={(e) => handleDeleteSubject(s.id, e)}>
                  삭제
                </button>
                <div className="subject-info">
                  <h4>{s.name}</h4>
                  <p className="subject-desc">
                    {s.aiSummary ? s.aiSummary.substring(0, 50) + "..." : s.description}
                  </p>
                  <p>중요도: {"★".repeat(s.importance)} | Task: {s.tasks ? s.tasks.length : 0}개</p>
                  <p>시험까지 D-{calculateDday(s.date)}</p>
                </div>
                <span>&gt;</span>
              </div>
            ))
          ) : (
            <p>아직 추가된 과목이 없습니다.</p>
          )}
          <button className="add-subject-btn" onClick={() => setIsModalOpen(true)}>
            + 새 과목 추가하기
          </button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <AddSubject onAdd={handleAddSubject} />
          </Modal>
        </div>
      </div>
    </>
  );

  // Task 목록 뷰
  const renderTaskList = () => (
    <div className="task-list-wrapper">
      <div className="task-list-container">
        <button className="back-btn" onClick={() => navigate("/")}>
          &lt; 과목 목록으로
        </button>
        <div className="task-header">
          <h2>{selectedSubject.name}</h2>
          <div style={{ background: "#f0f8ff", padding: "15px", borderRadius: "8px", marginTop: "10px" }}>
            <strong>🤖 AI 과목 분석:</strong>
            <p style={{ marginTop: "5px", whiteSpace: "pre-wrap" }}>
              {selectedSubject.aiSummary || selectedSubject.description}
            </p>
            {selectedSubject.totalEstimatedHours > 0 && (
              <p style={{ fontSize: "0.9em", color: "#666", marginTop: "5px" }}>
                ⏱️ 총 예상 학습 시간: {selectedSubject.totalEstimatedHours}시간
              </p>
            )}
          </div>
        </div>
        <div className="task-list">
          <h3>학습 Task ({selectedSubject.tasks ? selectedSubject.tasks.length : 0})</h3>
          {renderTasks()}
        </div>
      </div>
    </div>
  );

  const renderTasks = () => {
    if (!selectedSubject.tasks || selectedSubject.tasks.length === 0) {
      return <p style={{ textAlign: "center", padding: "20px" }}>생성된 학습 Task가 없습니다.</p>;
    }
    return selectedSubject.tasks.map((task) => (
      <div
        key={task.task_id}
        className="task-item"
        onClick={() => navigate(`/task/${selectedSubject.id}/${task.task_id}`)}
        style={{ borderLeft: `5px solid ${getPriorityColor(task.priority_score)}` }}
      >
        <div className="task-info">
          <h4>{task.title} <span style={{ fontSize: "0.7em", marginLeft: "10px", color: "#888" }}>(중요도: {task.priority_score}점)</span></h4>
          <p>{task.summary}</p>
          <div style={{ display: "flex", gap: "10px", fontSize: "0.8em", color: "#555", marginTop: "5px" }}>
            <span>⏱️ {task.estimated_minutes}분</span>
            <span>📊 난이도: {task.difficulty}</span>
          </div>
        </div>
        <span>&gt;</span>
      </div>
    ));
  };

  const getPriorityColor = (score) => {
    if (score >= 90) return "#ff4d4f";
    if (score >= 70) return "#faad14";
    return "#52c41a";
  };

  return (
    <main className="main-container">
      {selectedSubject ? renderTaskList() : renderSubjectList()}
    </main>
  );
}
