import React, { useState } from "react";

export default function AddSubject({ onAdd }) {
  const [subjectName, setSubjectName] = useState("");
  const [importance, setImportance] = useState(1);
  const [examDate, setExamDate] = useState("");
  const [description, setDescription] = useState("");
  
  // 1. 파일 상태 추가
  const [file, setFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!subjectName) {
      alert("과목명을 입력해주세요!");
      return;
    }

    setIsLoading(true); // 로딩 시작

    // 2. 서버로 보낼 데이터 폼 생성
    const formData = new FormData();
    formData.append("name", subjectName);
    formData.append("importance", importance);
    formData.append("date", examDate);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }

    try {
      // 3. Python Flask 서버로 요청 (포트 5000 가정)
      const response = await fetch("http://localhost:5000/api/add-subject", {
        method: "POST",
        body: formData, // 헤더에 Content-Type 설정 불필요 (브라우저가 자동 설정)
      });

      const result = await response.json();

      if (result.status === "success") {
        // 4. 성공 시 부모 컴포넌트에 결과 전달
        // result.data에는 Gemini가 분석한 JSON 텍스트가 들어있을 거야.
        onAdd({
          name: subjectName,
          importance,
          date: examDate,
          description,
          aiAnalysis: result.data, // AI 분석 결과 포함
          createdAt: new Date().toISOString(),
        });
        
        alert("과목 분석이 완료되었습니다! 🔥");
        // 입력창 초기화 로직은 필요시 추가
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
        PDF/필기 내용:
        {/* 파일 핸들러 연결 */}
        <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.png,.txt" />
      </label>
      
      {/* 로딩 중이면 버튼 비활성화 */}
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "AI 분석 중..." : "추가"}
      </button>
    </div>
  );
}