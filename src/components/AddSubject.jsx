
import React, { useState } from "react";

export default function AddSubject({ onAdd }) {
  const [subjectName, setSubjectName] = useState("");
  const [importance, setImportance] = useState(1);
  const [examDate, setExamDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onAdd({
      name: subjectName,
      importance,
      date: examDate,
      description,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="add-subject-container">
      <h3>과목 추가</h3>
      <input
        type="text"
        placeholder="과목명"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
      />
      <label>
        중요도:
        <select
          value={importance}
          onChange={(e) => setImportance(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label>
        시험일:
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
        />
      </label>
      <label>
        과목 설명:
        <textarea
          placeholder="예: 이 과목 재수강 과목이야"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </label>
      <label>
        PDF/필기 내용:
        <input type="file" />
      </label>
      <button onClick={handleSubmit}>추가</button>
    </div>
  );
}
