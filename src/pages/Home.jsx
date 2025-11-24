import React, { useState } from "react";
import ChatContainer from "../components/ChatContainer";
import AddSubject from "../components/AddSubject";
import Modal from "../components/Modal";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
<<<<<<< Updated upstream

  const handleAddSubject = (subject) => {
    setSubjects([...subjects, { ...subject, id: Date.now() }]);
    setIsModalOpen(false);
  };

=======
  const [sortBy, setSortBy] = useState("createdAt");
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 localStorage에서 과목 불러오기
  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjects");
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  // 과목이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem("subjects", JSON.stringify(subjects));
    }
  }, [subjects]);

  // 🛠️ [핵심 기능] AI 응답 텍스트에서 JSON만 추출하는 함수
  const extractJsonFromResponse = (text) => {
    try {
      const startMarker = "[START_EXAM_STRUCTURE]";
      const endMarker = "[END_EXAM_STRUCTURE]";

      const startIndex = text.indexOf(startMarker);
      const endIndex = text.indexOf(endMarker);

      if (startIndex !== -1 && endIndex !== -1) {
        const jsonString = text.substring(
          startIndex + startMarker.length,
          endIndex
        );
        return JSON.parse(jsonString);
      }
      return null;
    } catch (e) {
      console.error("JSON 파싱 실패:", e);
      return null;
    }
  };

  const handleAddSubject = (subject) => {
    // 1. AI 분석 결과 파싱
    const aiData = extractJsonFromResponse(subject.aiAnalysis);

    // 2. 파싱된 데이터가 있으면 tasks와 summary를 가져오고, 없으면 빈 값
    const tasks = aiData ? aiData.tasks : [];
    const aiSummary = aiData
      ? aiData.exam_summary
      : "AI 분석에 실패했거나 요약 정보가 없습니다.";

    const newSubject = {
      ...subject,
      id: Date.now(),
      priority: 1,
      tasks: tasks, // 👈 AI가 만든 Task 리스트 저장
      aiSummary: aiSummary, // 👈 AI가 써준 과목 요약 저장
      totalEstimatedHours: aiData ? aiData.total_estimated_hours : 0,
    };

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
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
  };

  const handleCramming = () => {
    navigate("/cramming");
  };

  // ... (renderSubjectList는 기존과 동일) ...
>>>>>>> Stashed changes
  const renderSubjectList = () => (
    <>
      <div
        className="title-section"
        style={{ marginBottom: "40px", textAlign: "center" }}
      >
        <h1 className="main-title">번뜩</h1>
        <p className="subtitle">AI와 함께 과목을 정복하고 시험을 준비하세요</p>
        <p className="description">
          과목별 학습 자료를 등록하고, AI에게 질문하며 효율적으로 공부할 수 있습니다
        </p>
      </div>
      <div className="subject-list-wrapper">
        <div className="subject-list-container">
          <h2>내 과목</h2>
          {subjects.length > 0 ? (
            subjects.map((s) => (
              <div
                key={s.id}
                className="subject-item"
                onClick={() => setSelectedSubject(s)}
              >
                <div className="subject-info">
                  <h4>{s.name}</h4>
<<<<<<< Updated upstream
                  <p>중요도: {"★".repeat(s.importance)}</p>
=======
                  {/* AI 요약이 있으면 그걸 보여주고, 없으면 사용자 설명 보여줌 */}
                  <p className="subject-desc">
                    {s.aiSummary
                      ? s.aiSummary.substring(0, 50) + "..."
                      : s.description}
                  </p>
                  <p>
                    중요도: {"★".repeat(s.importance)} | Task:{" "}
                    {s.tasks ? s.tasks.length : 0}개
                  </p>
>>>>>>> Stashed changes
                  <p>시험까지 D-{calculateDday(s.date)}</p>
                </div>
                <span>&gt;</span>
              </div>
            ))
          ) : (
            <p>아직 추가된 과목이 없습니다.</p>
          )}
          <button
            className="add-subject-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + 새 과목 추가하기
          </button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <AddSubject onAdd={handleAddSubject} />
          </Modal>
        </div>
      </div>
    </>
  );

<<<<<<< Updated upstream
  const renderSubjectChat = () => (
    <div>
       <button onClick={() => setSelectedSubject(null)}>&lt; 과목 목록으로</button>
      <h2>{selectedSubject.name}</h2>
      <ChatContainer />
=======
  // 과목 상세 화면 (Task 목록)
  const renderTaskList = () => (
    <div className="task-list-container">
      <button className="back-btn" onClick={() => setSelectedSubject(null)}>
        &lt; 과목 목록으로
      </button>
      <div className="task-header">
        <h2>{selectedSubject.name}</h2>
        {/* 🛠️ AI가 요약해준 전체 내용을 여기에 표시 */}
        <div
          style={{
            background: "#f0f8ff",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        >
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
        <h3>
          학습 Task ({selectedSubject.tasks ? selectedSubject.tasks.length : 0})
        </h3>
        {renderTasks()}
      </div>
>>>>>>> Stashed changes
    </div>
  )

<<<<<<< Updated upstream
  const calculateDday = (date) => {
    const today = new Date();
    const examDate = new Date(date);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : "Day";
  }
=======
  // 🛠️ 실제 AI Task 렌더링
  const renderTasks = () => {
    // Task가 없을 경우 처리
    if (!selectedSubject.tasks || selectedSubject.tasks.length === 0) {
      return (
        <p style={{ textAlign: "center", padding: "20px" }}>
          생성된 학습 Task가 없습니다.
        </p>
      );
    }

    return selectedSubject.tasks.map((task) => (
      <div
        key={task.task_id} // AI가 준 task_id 사용
        className="task-item"
        // 클릭 시 채팅방으로 이동 (task_id 전달)
        onClick={() => navigate(`/chat/${selectedSubject.id}/${task.task_id}`)}
        style={{
          borderLeft: `5px solid ${getPriorityColor(task.priority_score)}`,
        }} // 우선순위에 따라 색상 구분
      >
        <div className="task-info">
          <h4>
            {task.title}
            <span
              style={{ fontSize: "0.7em", marginLeft: "10px", color: "#888" }}
            >
              (중요도: {task.priority_score}점)
            </span>
          </h4>
          <p>{task.summary}</p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              fontSize: "0.8em",
              color: "#555",
              marginTop: "5px",
            }}
          >
            <span>⏱️ {task.estimated_minutes}분</span>
            <span>📊 난이도: {task.difficulty}</span>
          </div>
        </div>
        <span>&gt;</span>
      </div>
    ));
  };

  // 우선순위 점수에 따른 색상 반환 헬퍼 함수
  const getPriorityColor = (score) => {
    if (score >= 90) return "#ff4d4f"; // 빨강 (매우 중요)
    if (score >= 70) return "#faad14"; // 주황 (중요)
    return "#52c41a"; // 초록 (보통)
  };
>>>>>>> Stashed changes

  return (
    <main className="main-container">
      {selectedSubject ? renderSubjectChat() : renderSubjectList()}
    </main>
  );
}
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
