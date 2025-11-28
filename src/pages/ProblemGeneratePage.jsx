import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProblemGeneratePage() {
  const { subjectId, taskId } = useParams();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [problems, setProblems] = useState([]);
  const [answers, setAnswers] = useState({});

  const handleGenerate = () => {
    setIsGenerating(true);

    // 테스트용: 임시 문제 생성
    setTimeout(() => {
      const generatedProblems = [
        {
          id: 1,
          question: "1 + 1은 무엇인가요?",
          options: ["1", "2", "3", "4"],
          correctAnswer: "2"
        },
        {
          id: 2,
          question: "2 + 2는 무엇인가요?",
          options: ["2", "3", "4", "5"],
          correctAnswer: "4"
        },
        {
          id: 3,
          question: "3 + 3은 무엇인가요?",
          options: ["5", "6", "7", "8"],
          correctAnswer: "6"
        },
      ];
      setProblems(generatedProblems);
      setIsGenerating(false);
    }, 2000);
  };

  const handleAnswerSelect = (problemId, answer) => {
    setAnswers({ ...answers, [problemId]: answer });
  };

  const handleSubmit = () => {
    let correct = 0;
    problems.forEach((problem) => {
      if (answers[problem.id] === problem.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / problems.length) * 100);
    alert(`결과: ${correct}/${problems.length} 정답 (${score}점)`);

    // 기록 저장 후 Task 상세 페이지로 이동
    navigate(`/task/${subjectId}/${taskId}`);
  };

  return (
    <div className="problem-generate-wrapper">
      <div className="problem-generate-container">
        <button className="back-btn" onClick={() => navigate(`/task/${subjectId}/${taskId}`)}>
          &lt; Task로 돌아가기
        </button>

        <div className="problem-header">
          <h2>문제 생성</h2>
        </div>

        {problems.length === 0 ? (
          <div className="generate-section">
            <p>AI가 우선순위에 맞는 문제를 생성합니다.</p>
            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "생성 중..." : "문제 생성하기"}
            </button>
          </div>
        ) : (
          <div className="problem-list">
            {problems.map((problem, index) => (
              <div key={problem.id} className="problem-item">
                <h3>문제 {index + 1}</h3>
                <p className="question">{problem.question}</p>
                <div className="options">
                  {problem.options.map((option, optIndex) => (
                    <label key={optIndex} className="option-label">
                      <input
                        type="radio"
                        name={`problem-${problem.id}`}
                        value={option}
                        checked={answers[problem.id] === option}
                        onChange={() => handleAnswerSelect(problem.id, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button className="submit-btn" onClick={handleSubmit}>
              제출하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
