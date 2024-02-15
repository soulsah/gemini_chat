import React, { useState, useEffect, useRef } from 'react';
import { UserRound, Bot } from 'lucide-react';
import axios from 'axios';
import './App.css';

type MessageType = {
  text: string;
  type: 'user' | 'model';
};

const Chatbot = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock da mensagem inicial do bot ao montar o componente
    const initialBotMessage: MessageType = {
      text:
        'Olá! Agradecemos por entrar em contato com o serviço de consignado do grupo AMP. Podemos te ajudar com isso. Para começar, informe seu nome para darmos início ao atendimento',
      type: 'model',
    };

    setMessages([initialBotMessage]);
  }, []);

  useEffect(() => {
    // Scroll automático quando novas mensagens são adicionadas
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages: MessageType[] = [...messages, { text: input, type: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:2077/chat', {
        message: input,
      });

      const botMessage: MessageType = { text: response.data.message, type: 'model' };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem para o chatbot', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container">
      <div className="header">Atendimento</div>
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'userChat' : 'modelChat'}`}
          >
            {message.type === 'user' ? (
              <div className="icon-container userIconContainer">
                <UserRound className='userIcon' />
              </div>
            ) : (
              <div className="icon-container botIconContainer">
                <Bot className='botIcon' />
              </div>
            )}
            <div
              className={`message-text ${message.type === 'user' ? 'userChat' : 'modelChat'}`}
            >
              <span>{message.text}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="input"
        />
        <button onClick={sendMessage} className="neon-button">
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
