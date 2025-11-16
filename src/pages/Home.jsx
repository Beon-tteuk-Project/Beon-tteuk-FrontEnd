import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddSubject from "../components/AddSubject";
import Modal from "../components/Modal";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 localStorage에서 과목 불러오기
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  // 과목이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem('subjects', JSON.stringify(subjects));
    }
  }, [subjects]);

  const handleAddSubject = (subject) => {
    const newSubject = { ...subject, id: Date.now(), priority: 1 }; // 우선순위는 기본값 1로 설정
    setSubjects([...subjects, newSubject]);
    setIsModalOpen(false);
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
      case "createdAt":
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const handleCramming = () => {
    navigate("/cramming");
  };

  const renderSubjectList = () => (
    <>
      <div className="title-section" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 className="main-title">번뜩</h1>
        <p className="subtitle">AI와 함께 과목을 정복하고 시험을 준비하세요</p>
        <p className="description">
          과목별 학습 자료를 등록하고, AI에게 질문하며 효율적으로 공부할 수 있습니다
        </p>
      </div>

      <div className="cramming-section">
        <button className="cramming-btn-large" onClick={handleCramming}>
          ⚡ 벼락치기 모드 시작하기
        </button>
        <p className="cramming-hint">시간이 부족할 때, AI가 자동으로 학습 계획을 세워드립니다</p>
      </div>

      <div className="subject-list-wrapper">
        <div className="subject-list-container">
          <div className="subject-header">
            <h2>내 과목</h2>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">만든 날짜</option>
              <option value="importance">중요도</option>
              <option value="name">이름</option>
              <option value="date">시험일</option>
              <option value="priority">우선순위</option>
            </select>
          </div>
          {subjects.length > 0 ? (
            sortSubjects(subjects).map((s) => (
              <div
                key={s.id}
                className="subject-item"
                onClick={() => setSelectedSubject(s)}
              >
                <div className="subject-info">
                  <h4>{s.name}</h4>
                  {s.description && <p className="subject-desc">{s.description}</p>}
                  <p>중요도: {"★".repeat(s.importance)} | 우선순위: {s.priority}</p>
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

  const renderTaskList = () => (
    <div className="task-list-container">
      <button className="back-btn" onClick={() => setSelectedSubject(null)}>
        &lt; 과목 목록으로
      </button>
      <div className="task-header">
        <h2>{selectedSubject.name}</h2>
        {selectedSubject.description && (
          <p className="subject-description">{selectedSubject.description}</p>
        )}
      </div>
      <div className="task-list">
        <h3>학습 Task</h3>
        {renderTasks()}
      </div>
    </div>
  );

  const renderTasks = () => {
    // 테스트용 Task 데이터 (실제로는 과목별로 다르게 생성)
    const tasks = [
      { id: 1, title: "1장: 기본 개념 이해", completed: false },
      { id: 2, title: "2장: 심화 내용 학습", completed: false },
      { id: 3, title: "3장: 실전 문제 풀이", completed: false },
      { id: 4, title: "4장: 응용 문제", completed: false },
      { id: 5, title: "중간고사 대비", completed: false },
    ];

    return tasks.map((task) => (
      <div
        key={task.id}
        className="task-item"
        onClick={() => navigate(`/task/${selectedSubject.id}/${task.id}`)}
      >
        <div className="task-info">
          <h4>{task.title}</h4>
          <p>{task.completed ? "✅ 완료" : "⏳ 진행중"}</p>
        </div>
        <span>&gt;</span>
      </div>
    ));
  };

  return (
    <main className="main-container">
      {selectedSubject ? renderTaskList() : renderSubjectList()}
    </main>
  );
}

