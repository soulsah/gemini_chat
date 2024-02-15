import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

type MessageType = {
  text: string;
  type: 'user' | 'bot';
};

const Chatbot = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages: MessageType[] = [...messages, { text: input, type: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:2077/chat', {
        message: input,
      });

      const botMessage: MessageType = { text: response.data.message, type: 'bot' };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem para o chatbot', error);
    }
  };

  return (
    <div className="container">
      <div className="header">Gemini Chatbot</div>
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'user' : 'bot'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="input"
        />
        <button onClick={sendMessage} className="button">
          Enviar
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <Chatbot />
    </div>
  );
}

export default App;