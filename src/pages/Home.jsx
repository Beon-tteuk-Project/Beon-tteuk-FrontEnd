import React, { useState } from "react";
import ChatContainer from "../components/ChatContainer";
import AddSubject from "../components/AddSubject";
import Modal from "../components/Modal";

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSubject = (subject) => {
    setSubjects([...subjects, { ...subject, id: Date.now() }]);
    setIsModalOpen(false);
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
                  <p>중요도: {"★".repeat(s.importance)}</p>
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

  const renderSubjectChat = () => (
    <div>
       <button onClick={() => setSelectedSubject(null)}>&lt; 과목 목록으로</button>
      <h2>{selectedSubject.name}</h2>
      <ChatContainer />
    </div>
  )

  const calculateDday = (date) => {
    const today = new Date();
    const examDate = new Date(date);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : "Day";
  }

  return (
    <main className="main-container">
      {selectedSubject ? renderSubjectChat() : renderSubjectList()}
    </main>
  );
}

