import React, { useState } from "react";

export default function AddSubject({ onAdd }) {
  const [subjectName, setSubjectName] = useState("");
  const [importance, setImportance] = useState(1);
  const [examDate, setExamDate] = useState("");
  const [description, setDescription] = useState("");
  
  // 1. 여러 파일을 다루도록 files 상태로 변경
  const [files, setFiles] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const handleFileChange = (e) => {
    // 2. 선택된 모든 파일을 상태에 저장
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async () => {
    if (!subjectName) {
      alert("과목명을 입력해주세요!");
      return;
    }

    setIsLoading(true); // 로딩 시작

    const formData = new FormData();
    formData.append("name", subjectName);
    formData.append("importance", importance);
    formData.append("date", examDate);
    formData.append("description", description);
    
    // 3. 모든 파일을 FormData에 추가
    if (files.length > 0) {
      for (const file of files) {
        formData.append("files", file); // key를 "files"로 변경
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/add-subject", {
        method: "POST",
        body: formData, 
      });

      const result = await response.json();

      if (result.status === "success") {
        onAdd({
          id: crypto.randomUUID(), // 고유 ID 생성
          name: subjectName,
          importance,
          date: examDate,
          description,
          aiAnalysis: result.data, 
          createdAt: new Date().toISOString(),
        });
        
        alert("과목 분석이 완료되었습니다! 🔥");
      } else {
        alert("오류 발생: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버 연결에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 끝
    }
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
        PDF/필기 내용 (다중 선택 가능):
        {/* 4. multiple 속성 추가 */}
        <input type="file" multiple onChange={handleFileChange} accept=".pdf,.jpg,.png,.txt" />
      </label>
      
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "AI 분석 중..." : "추가"}
      </button>
    </div>
  );
}