import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AIChatbot = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI Career Counselor. I can help you with career guidance, stream selection, college information, scholarships, and much more. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'urdu', name: 'اردو', flag: '🇵🇰' },
    { code: 'kashmiri', name: 'कॉशुर', flag: '🍃' },
    { code: 'dogri', name: 'डोगरी', flag: '🏔️' }
  ];

  const quickQuestions = [
    "What are the best career options after 12th Science?",
    "How do I choose between Engineering and Medical?",
    "Tell me about scholarships for J&K students",
    "What are the top colleges in Jammu & Kashmir?",
    "How to prepare for JEE/NEET exams?",
    "Career options in Arts stream",
    "Government job opportunities in J&K"
  ];

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask-counselor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: messageText,
          userProfile: userProfile || {
            userId: 'anonymous',
            location: 'Jammu & Kashmir',
            language: selectedLanguage
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        let aiResponse = data.response;

        // Translate if not in English
        if (selectedLanguage !== 'english') {
          try {
            const translateResponse = await fetch('/api/ai/translate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                content: aiResponse,
                targetLanguage: selectedLanguage,
                sourceLanguage: 'english'
              }),
            });

            const translateData = await translateResponse.json();
            if (translateData.success) {
              aiResponse = translateData.translatedContent;
            }
          } catch (error) {
            console.warn('Translation failed, using English response');
          }
        }

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: 'I apologize, but I encountered an error while processing your question. Please try again or contact our support team.',
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I\'m having trouble connecting right now. Please check your internet connection and try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            className={`fixed bottom-24 right-6 z-40 w-96 h-[600px] rounded-2xl shadow-2xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-blue-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">🎓</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    AI Career Counselor
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Online
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className={`text-xs px-2 py-1 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 h-96 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.isError
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : isDarkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className={`text-xs mt-1 block ${
                      message.type === 'user' 
                        ? 'text-blue-100' 
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`rounded-2xl px-4 py-2 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className={`px-4 py-2 border-t ${
                isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
              }`}>
                <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-1">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(question)}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {question.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-end space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about careers, colleges, or exams..."
                  rows="2"
                  className={`flex-1 px-3 py-2 rounded-lg border resize-none text-sm ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  disabled={isLoading}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm">Send</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;