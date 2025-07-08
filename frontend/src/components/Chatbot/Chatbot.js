import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LanguageService } from '../../services/languageService';
import QuickSuggestions from './QuickSuggestions';

const BOT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'; // Example bot avatar

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userLanguage, setUserLanguage] = useState(() => LanguageService.detectBrowserLanguage());
  const [messages, setMessages] = useState([]);
  const [uiMessages, setUiMessages] = useState(() => LanguageService.getUIMessages(LanguageService.detectBrowserLanguage()));
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Welcome messages in different languages
  const welcomeMessages = {
    fr: "Bonjour! Je suis votre assistant LMS. Comment puis-je vous aider?",
    en: "Hello! I'm your LMS assistant. How can I help you?",
    es: "¡Hola! Soy tu asistente LMS. ¿Cómo puedo ayudarte?",
    ar: "مرحبا! أنا مساعد نظام إدارة التعلم الخاص بك. كيف يمكنني مساعدتك؟",
    tn: "أهلا وسهلا! أنا مساعد نظام التعليم متاعك. كيفاش نجم نعاونك؟"
  };

  // Initialize with welcome message and update UI messages
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ text: welcomeMessages[userLanguage], isBot: true }]);
    }
    setUiMessages(LanguageService.getUIMessages(userLanguage));
  }, [userLanguage]);

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

  // Generate a unique session ID when the component mounts
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Ensure userId is a number (integer) as expected by the database
        const userId = user.id ? parseInt(user.id, 10) : null;
        return {
          id: isNaN(userId) ? null : userId,
          email: user.email
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return { id: null, email: null };
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setShowSuggestions(false);

    const userMessage = { text: inputMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const userInfo = getUserInfo();

      console.log('Sending to chatbot:', {
        message: inputMessage,
        sessionId: sessionId,
        userId: userInfo.id,
        userLanguage: userLanguage
      });

      const response = await axios.post('http://localhost:8000/chatbot/message', {
        message: inputMessage,
        sessionId: sessionId,
        userId: userInfo.id,
        userLanguage: userLanguage
      });
      
      // Update user language if detected
      if (response.data.detectedLanguage && response.data.detectedLanguage !== userLanguage) {
        setUserLanguage(response.data.detectedLanguage);
      }
      
      setMessages(prev => [...prev, { text: response.data.response, isBot: true }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessages = {
        fr: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer plus tard.",
        en: "Sorry, I couldn't process your request. Please try again later.",
        es: "Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
        ar: "آسف، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً."
      };
      setMessages(prev => [...prev, {
        text: errorMessages[userLanguage] || errorMessages.fr,
        isBot: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 3000 }}>
      {/* Floating Chat Button */}
      <button
        className="btn btn-primary shadow-lg d-flex align-items-center justify-content-center"
        style={{ width: 60, height: 60, borderRadius: '50%', fontSize: 28, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'background 0.2s' }}
        onClick={toggleChatbot}
        aria-label={isOpen ? uiMessages.close : uiMessages.open}
      >
        {isOpen ? '✕' : <span role="img" aria-label="chat">💬</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="card animate__animated animate__fadeInUp" style={{ position: 'absolute', bottom: 80, right: 0, width: 370, maxWidth: '95vw', height: 520, borderRadius: 22, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="card-header bg-primary text-white d-flex align-items-center justify-content-start"
            style={{
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              minHeight: 64,
              height: 64,
              padding: '0 20px',
              boxSizing: 'border-box',
              overflow: 'hidden',
              gap: 12
            }}>
            <img src={BOT_AVATAR} alt="Bot" style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', flexShrink: 0 }} />
            <div style={{ fontWeight: 600, fontSize: 20, lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {uiMessages.chatTitle}
            </div>
          </div>

          {/* Messages */}
          <div className="card-body p-3 flex-grow-1 overflow-auto d-flex flex-column" style={{ background: '#f7f8fa', minHeight: 0, direction: LanguageService.getTextDirection(userLanguage) }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex mb-2 ${msg.isBot ? 'align-items-start' : 'justify-content-end'}`}
              >
                {msg.isBot && (
                  <img src={BOT_AVATAR} alt="Bot" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8, alignSelf: 'flex-end' }} />
                )}
                <div
                  className={msg.isBot ? 'bg-white text-dark' : 'bg-primary text-white'}
                  style={{
                    borderRadius: msg.isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    padding: '10px 16px',
                    maxWidth: '75%',
                    fontSize: 15,
                    boxShadow: msg.isBot ? '0 1px 4px rgba(0,0,0,0.04)' : 'none',
                    marginLeft: msg.isBot ? 0 : 32,
                    marginRight: msg.isBot ? 32 : 0
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="d-flex align-items-center mb-2">
                <img src={BOT_AVATAR} alt="Bot" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
                <div className="bg-white text-dark" style={{ borderRadius: '18px 18px 18px 4px', padding: '10px 16px', fontSize: 15, opacity: 0.7 }}>
                  <span className="spinner-border spinner-border-sm text-secondary me-2" role="status" />
                  ...
                </div>
              </div>
            )}
            <QuickSuggestions 
              language={userLanguage}
              onSuggestionClick={handleSuggestionClick}
              isVisible={showSuggestions && messages.length <= 1}
            />
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="card-footer p-2 bg-white" style={{ borderBottomLeftRadius: 22, borderBottomRightRadius: 22 }}>
            <form className="d-flex" onSubmit={sendMessage} autoComplete="off">
              <input
                type="text"
                className="form-control me-2"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder={uiMessages.placeholder}
                disabled={isLoading}
                style={{ borderRadius: 18, fontSize: 15, background: '#f4f6fa', border: '1px solid #e0e3e8' }}
              />
              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center justify-content-center"
                disabled={isLoading || !inputMessage.trim()}
                style={{ borderRadius: 18, minWidth: 44, minHeight: 44, fontSize: 20 }}
                aria-label={uiMessages.send}
              >
                <span role="img" aria-label="send">➤</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
