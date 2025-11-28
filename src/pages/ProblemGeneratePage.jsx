import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProblemGeneratePage() {
  const { subjectId, taskId } = useParams();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [problems, setProblems] = useState([]);
  const [answers, setAnswers] = useState({});
  const [taskInfo, setTaskInfo] = useState(null);

  // 1. 컴포넌트 로드 시 localStorage에서 태그 정보(tag_name) 가져오기
  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjects");
    if (savedSubjects) {
      const parsedSubjects = JSON.parse(savedSubjects);
      const subject = parsedSubjects.find((s) => String(s.id) === subjectId);
      if (subject) {
        const task = subject.tasks.find((t) => String(t.task_id) === taskId);
        if (task) {
          setTaskInfo(task);
        }
      }
    }
  }, [subjectId, taskId]);

  // 2. AI 응답 텍스트에서 문제 JSON 추출하는 함수
  const extractQuestionsFromJson = (text) => {
    try {
      const startMarker = "[START_QUESTIONS_JSON]";
      const endMarker = "[END_QUESTIONS_JSON]";
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

  // 3. 문제 생성 핸들러 (API 호출)
  const handleGenerate = async () => {
    if (!taskInfo || !taskInfo.tag_name) {
      alert("태스크 정보를 찾을 수 없습니다. (tag_name 누락)");
      return;
    }

    setIsGenerating(true);
    setProblems([]); // 기존 문제 초기화

    try {
      const response = await fetch("http://localhost:5000/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tag_name: taskInfo.tag_name, // 백엔드로 태그 전달
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        const aiResponseText = result.data;
        const parsedQuestions = extractQuestionsFromJson(aiResponseText);

        if (parsedQuestions && parsedQuestions.length > 0) {
          // 화면 표시에 맞게 데이터 변환
          const formattedProblems = parsedQuestions.map((q, index) => {
            // options 객체를 배열로 변환 (순서 보장을 위해 키 정렬)
            // 예: {"1": "A", "2": "B"} -> ["A", "B"]
            const sortedKeys = Object.keys(q.options).sort();
            const optionsArray = sortedKeys.map((key) => q.options[key]);
            
            // 정답 번호를 이용해 정답 텍스트 찾기
            const correctText = q.options[q.correct_answer]; 

            return {
              id: index + 1,
              tag_name: q.tag_name,
              question: q.question_content,
              options: optionsArray,
              correctAnswer: correctText, // 텍스트 비교를 위해 변환값 저장
              explanation: q.explanation,
            };
          });

          setProblems(formattedProblems);
        } else {
          alert("AI가 문제를 생성했지만 형식을 파싱하지 못했습니다.");
          console.log("Raw AI Response:", aiResponseText);
        }
      } else {
        alert("서버 오류: " + result.message);
      }
    } catch (error) {
      console.error("문제 생성 요청 실패:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (problemId, answer) => {
    setAnswers({ ...answers, [problemId]: answer });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    problems.forEach((problem) => {
      // 선택한 텍스트와 정답 텍스트 비교
      if (answers[problem.id] === problem.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / problems.length) * 100);
    
    // 결과 메시지 구성
    let resultMsg = `결과: ${correctCount}/${problems.length} 정답 (${score}점)\n\n`;
    
    // 틀린 문제 해설 추가 (선택 사항)
    problems.forEach((p) => {
        if (answers[p.id] !== p.correctAnswer) {
            resultMsg += `[문제 ${p.id}] 오답! (정답: ${p.correctAnswer})\n해설: ${p.explanation}\n\n`;
        }
    });

    alert(resultMsg);

    // (추후 기능) 점수나 학습 완료 여부를 localStorage나 서버에 저장하는 로직 추가 가능
    navigate(`/task/${subjectId}/${taskId}`);
  };

  return (
    <div className="problem-generate-container" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button 
        className="back-btn" 
        onClick={() => navigate(`/task/${subjectId}/${taskId}`)}
        style={{ marginBottom: "20px", padding: "8px 16px", cursor: "pointer" }}
      >
        &lt; Task로 돌아가기
      </button>

      <div className="problem-header" style={{ marginBottom: "30px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        <h2>문제 생성: {taskInfo ? taskInfo.title : "로딩 중..."}</h2>
        {taskInfo && <p style={{ color: "#666" }}>Tag: {taskInfo.tag_name}</p>}
      </div>

      {problems.length === 0 ? (
        <div className="generate-section" style={{ textAlign: "center", padding: "40px", background: "#f9f9f9", borderRadius: "10px" }}>
          <p style={{ marginBottom: "20px", fontSize: "1.1em" }}>
            AI가 <strong>{taskInfo?.title}</strong>의 핵심 내용을 바탕으로 진단 문제를 생성합니다.
          </p>
          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating || !taskInfo}
            style={{
              padding: "15px 30px",
              fontSize: "1.2em",
              backgroundColor: isGenerating ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isGenerating ? "not-allowed" : "pointer",
            }}
          >
            {isGenerating ? "AI가 문제를 만드는 중입니다... (약 10~20초)" : "🚀 문제 생성하기"}
          </button>
        </div>
      ) : (
        <div className="problem-list">
          {problems.map((problem, index) => (
            <div key={problem.id} className="problem-item" style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
              <h3 style={{ marginBottom: "15px" }}>문제 {index + 1}</h3>
              <p className="question" style={{ fontSize: "1.1em", marginBottom: "20px", whiteSpace: "pre-wrap" }}>
                {problem.question}
              </p>
              <div className="options" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {problem.options.map((option, optIndex) => (
                  <label key={optIndex} className="option-label" style={{ padding: "10px", background: "#f5f5f5", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <input
                      type="radio"
                      name={`problem-${problem.id}`}
                      value={option}
                      checked={answers[problem.id] === option}
                      onChange={() => handleAnswerSelect(problem.id, option)}
                      style={{ marginRight: "10px" }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            style={{
                width: "100%",
                padding: "15px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "1.2em",
                cursor: "pointer",
                marginTop: "20px"
            }}
          >
            제출하기
          </button>
        </div>
      )}
    </div>
  );
}