import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Bonjour! Je suis votre assistant LMS. Comment puis-je vous aider?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Ajouter le message de l'utilisateur
    const userMessage = { text: inputMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Envoyer le message au backend
      const response = await axios.post('http://localhost:8000/chatbot/message', {
        message: inputMessage
      });
      
      // Ajouter la réponse du bot
      setMessages(prev => [...prev, { text: response.data.response, isBot: true }]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setMessages(prev => [...prev, { 
        text: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer plus tard.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <button 
        className="btn btn-primary rounded-circle"
        style={{ width: '50px', height: '50px', fontSize: '20px' }}
        onClick={toggleChatbot}
      >
        {isOpen ? '✕' : '💬'}
      </button>
      
      {isOpen && (
        <div className="card" style={{ position: 'absolute', bottom: '70px', right: '0', width: '350px', height: '500px' }}>
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Assistant LMS</h5>
          </div>
          
          <div className="card-body p-3 overflow-auto d-flex flex-column" style={{ height: '380px' }}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-2 mb-2 rounded ${msg.isBot 
                  ? 'bg-light text-dark align-self-start' 
                  : 'bg-primary text-white align-self-end'}`}
                style={{ maxWidth: '80%', borderRadius: '18px' }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-light p-2 mb-2 rounded align-self-start">
                <div className="d-flex">
                  <div className="spinner-grow spinner-grow-sm text-secondary mx-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="spinner-grow spinner-grow-sm text-secondary mx-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="spinner-grow spinner-grow-sm text-secondary mx-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="card-footer p-2">
            <form className="d-flex" onSubmit={sendMessage}>
              <input
                type="text"
                className="form-control me-2"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Tapez votre message..."
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading || !inputMessage.trim()}
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;