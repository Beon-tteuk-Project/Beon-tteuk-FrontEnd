
import React, { useState } from "react";

export default function AddSubject({ onAdd }) {
  const [subjectName, setSubjectName] = useState("");
  const [importance, setImportance] = useState(1);
  const [examDate, setExamDate] = useState("");

  const handleSubmit = () => {
    onAdd({ name: subjectName, importance, date: examDate });
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
        PDF/필기 내용:
        <input type="file" />
      </label>
      <button onClick={handleSubmit}>추가</button>
    </div>
  );
}
