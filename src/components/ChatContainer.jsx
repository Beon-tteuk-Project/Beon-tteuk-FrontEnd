import React, { useState, useRef, useEffect } from "react";

export default function ChatContainer() {
  const [uploadedFiles, setUploadedFiles] = useState([]); // array of File
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const dropRef = useRef(null);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    // auto scroll to bottom
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFiles = (files) => {
    // convert FileList to array and append
    const arr = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...arr]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (
      e.dataTransfer &&
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // only set false when leaving the drop area
    setDragActive(false);
  };

  useEffect(() => {
    const div = dropRef.current;
    if (!div) return;
    div.addEventListener("dragover", handleDragOver);
    div.addEventListener("dragleave", handleDragLeave);
    div.addEventListener("drop", handleDrop);
    return () => {
      div.removeEventListener("dragover", handleDragOver);
      div.removeEventListener("dragleave", handleDragLeave);
      div.removeEventListener("drop", handleDrop);
    };
  }, []);

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text && uploadedFiles.length === 0) return;

    const newUserMsg = { role: "user", text, files: uploadedFiles };
    setMessages((prev) => [...prev, newUserMsg]);

    // reset input and files
    setInputValue("");
    setUploadedFiles([]);

    // fake AI response (placeholder for real API call)
    setTimeout(() => {
      const replyText = `${
        text ? `"${text}"에 대한 답변입니다.` : ""
      } 벼락치기 AI가 여러분의 학습을 도와드립니다! 자세한 질문을 해주세요.`;
      setMessages((prev) => [...prev, { role: "ai", text: replyText }]);
    }, 900);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const openFileDialog = () => {
    // create a hidden input to trigger file select
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*,application/pdf";
    input.onchange = (e) => handleFiles(e.target.files);
    input.click();
  };
  return (
    <div className="chat-wrapper">
      <div
        className={`input-container ${dragActive ? "drag-active" : ""}`}
        ref={dropRef}
        onClick={() => {
          /* focus fallback */
        }}
      >
        <div className="input-left">
          <input
            id="chatInput"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={
              uploadedFiles.length > 0
                ? `${uploadedFiles.length}개 파일 업로드됨. 질문을 입력하세요...`
                : "질문을 입력하거나 파일을 드래그하세요..."
            }
          />
        </div>

        <div className="upload-buttons">
          <button
            className="upload-btn"
            onClick={openFileDialog}
            title="파일 선택"
          >
            📎
          </button>
          <button className="send-btn" onClick={sendMessage}>
            ➤
          </button>
        </div>

        <div className="drag-hint">
          {dragActive
            ? "여기에 놓으세요!"
            : "파일을 여기로 드래그하거나 클릭하여 선택하세요"}
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📸</div>
          <div className="feature-title">이미지 분석</div>
          <div className="feature-desc">
            사진을 업로드하고 즉시 설명을 받으세요
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <div className="feature-title">PDF 학습</div>
          <div className="feature-desc">교과서와 자료를 빠르게 요약</div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <div className="feature-title">실시간 대화</div>
          <div className="feature-desc">궁금한 점을 바로 물어보세요</div>
        </div>
      </div>

      <div className="chat-area" id="chatArea">
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`message ${m.role}`}>
              <div className="message-avatar">
                {m.role === "user" ? "👤" : "🤖"}
              </div>
              <div className="message-content">
                {m.text}
                {m.files && m.files.length > 0 && (
                  <div className="file-list">
                    {m.files.map((f, i) => (
                      <div key={i} className="file-preview">
                        📎 {f.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* If there are pending uploaded files (before sending) show previews */}
          {uploadedFiles.length > 0 && (
            <div className="pending-files">
              <div className="pending-title">업로드 대기중</div>
              <div className="pending-list">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="pending-item">
                    <span className="pending-name">{f.name}</span>
                    <button
                      className="remove-file"
                      onClick={() => removeFile(i)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
