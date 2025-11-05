import React, { useState } from 'react';

const ChatHistorySidebar = ({ history, onSelect }) => (
  <div className="chat-history-sidebar">
    <h3>질문 히스토리</h3>
    <div className="history-list">
      <ul>
        {history.map((item, index) => (
          <li key={index} onClick={() => onSelect(item)}>
            {item.question}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const MessageDisplayArea = ({ messages }) => (
  <div className="message-display-area">
    {messages.length > 0 ? (
      messages.map((msg, index) => (
        <div key={index} className={`message message-${msg.sender}`}>
          <p>{msg.text}</p>
        </div>
      ))
    ) : (
      <p>AI에게 질문하여 답변을 받아보세요.</p>
    )}
  </div>
);

const ChatInputForm = ({ input, setInput, onSend }) => (
  <div className="chat-input-form">
    <input
      type="text"
      placeholder="질문을 입력하세요..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && onSend()}
    />
    <button onClick={onSend}>전송</button>
  </div>
);

export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    const newHistoryItem = { question: input, answer: 'AI 답변 예시입니다.' };

    setMessages([...messages, userMessage, { text: newHistoryItem.answer, sender: 'ai' }]);
    setHistory([...history, newHistoryItem]);
    setInput('');
  };

  const handleHistorySelect = (item) => {
    setMessages([
      { text: item.question, sender: 'user' },
      { text: item.answer, sender: 'ai' },
    ]);
  };

  return (
    <div className="chat-page-layout">
      <ChatHistorySidebar history={history} onSelect={handleHistorySelect} />
      <div className="chat-main">
        <MessageDisplayArea messages={messages} />
        <ChatInputForm input={input} setInput={setInput} onSend={handleSend} />
      </div>
    </div>
  );
}
