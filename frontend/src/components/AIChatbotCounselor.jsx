import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import aiService from '../services/aiService';

const AIChatbotCounselor = ({ userId, userProfile, isMinimized, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [currentTopic, setCurrentTopic] = useState('general');
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [voiceInput, setVoiceInput] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const predefinedTopics = [
    {
      id: 'career',
      name: 'Career Guidance',
      icon: '💼',
      color: 'from-blue-500 to-blue-600',
      description: 'Explore career paths and opportunities in J&K'
    },
    {
      id: 'education',
      name: 'Education Planning',
      icon: '🎓',
      color: 'from-green-500 to-green-600',
      description: 'College selection and academic planning'
    },
    {
      id: 'skills',
      name: 'Skill Development',
      icon: '💪',
      color: 'from-purple-500 to-purple-600',
      description: 'Learn about essential skills for your future'
    },
    {
      id: 'local',
      name: 'J&K Opportunities',
      icon: '🏔️',
      color: 'from-orange-500 to-orange-600',
      description: 'Local opportunities and regional advantages'
    },
    {
      id: 'scholarships',
      name: 'Scholarships',
      icon: '💰',
      color: 'from-yellow-500 to-yellow-600',
      description: 'Financial aid and scholarship opportunities'
    },
    {
      id: 'mental-health',
      name: 'Mental Wellness',
      icon: '🧠',
      color: 'from-pink-500 to-pink-600',
      description: 'Stress management and mental health support'
    }
  ];

  useEffect(() => {
    initializeChatbot();
    setupVoiceRecognition();
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChatbot = async () => {
    setIsLoading(true);
    try {
      const welcomeMessage = {
        id: Date.now(),
        text: `नमस्कार! I'm your AI Career Counselor for Jammu & Kashmir students. 🌟\n\nI'm here to help you with:\n• Career guidance and planning\n• College selection and admissions\n• Skill development recommendations\n• J&K-specific opportunities\n• Scholarship information\n• Mental wellness support\n\nHow can I assist you today?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'welcome'
      };
      
      setMessages([welcomeMessage]);
      generateQuickReplies('welcome');
      
      // Initialize chat session
      const sessionId = `chat_${userId}_${Date.now()}`;
      setChatSession(sessionId);
    } catch (error) {
      console.error('Failed to initialize chatbot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-IN'; // Indian English
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setVoiceInput(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceInput(false);
      };
      
      recognitionInstance.onend = () => {
        setVoiceInput(false);
      };
      
      setRecognition(recognitionInstance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateQuickReplies = (context) => {
    const quickReplyOptions = {
      welcome: [
        'Help me choose a career',
        'Show J&K colleges',
        'Scholarship information',
        'Career after 12th grade'
      ],
      career: [
        'Engineering careers',
        'Medical field options',
        'Government jobs in J&K',
        'Business opportunities'
      ],
      education: [
        'Best colleges in J&K',
        'Admission requirements',
        'Course recommendations',
        'Study abroad options'
      ],
      general: [
        'Career guidance',
        'College selection',
        'Skill development',
        'Mental health support'
      ]
    };
    
    setQuickReplies(quickReplyOptions[context] || quickReplyOptions.general);
  };

  const sendMessage = async (messageText = null) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await aiService.getCounselingResponse(
        text,
        messages,
        userProfile,
        currentTopic
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions,
        resources: response.resources,
        followUp: response.followUp
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (response.topic) {
        setCurrentTopic(response.topic);
        generateQuickReplies(response.topic);
      }

      // Track interaction
      aiService.addInteraction({
        type: 'chat_message',
        data: { 
          topic: currentTopic, 
          userMessage: text, 
          responseLength: response.message.length 
        }
      });
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment. In the meantime, you can explore our other features or contact our support team.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  const startVoiceInput = () => {
    if (recognition) {
      setVoiceInput(true);
      recognition.start();
    }
  };

  const clearChat = () => {
    setMessages([]);
    initializeChatbot();
  };

  const exportChatHistory = () => {
    const chatHistory = messages.map(msg => ({
      timestamp: msg.timestamp.toISOString(),
      sender: msg.sender,
      message: msg.text
    }));
    
    const blob = new Blob([JSON.stringify(chatHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isMinimized) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <button
          onClick={onToggle}
          className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <span className="text-2xl">🤖</span>
          {messages.filter(m => m.sender === 'bot' && !m.read).length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">!</span>
            </div>
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Career Counselor</h3>
            <p className="text-xs text-blue-100">J&K Student Support</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowChatHistory(!showChatHistory)}
            className="text-white hover:text-blue-100 transition-colors"
            title="Chat History"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={onToggle}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Topic Selector */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="text-xs text-adaptive-muted mb-2">Quick Topics:</div>
        <div className="flex flex-wrap gap-1">
          {predefinedTopics.slice(0, 4).map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                setCurrentTopic(topic.id);
                generateQuickReplies(topic.id);
                sendMessage(`Tell me about ${topic.name.toLowerCase()}`);
              }}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                currentTopic === topic.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-adaptive-muted hover:bg-primary-100 dark:hover:bg-gray-600'
              }`}
            >
              {topic.icon} {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
                    : message.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-adaptive'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                
                {/* Resources */}
                {message.resources && message.resources.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-medium text-adaptive-muted">Helpful Resources:</div>
                    {message.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs bg-white dark:bg-gray-600 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                      >
                        <div className="font-medium text-primary-600">{resource.title}</div>
                        <div className="text-adaptive-muted">{resource.description}</div>
                      </a>
                    ))}
                  </div>
                )}
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="text-xs font-medium text-adaptive-muted">You might also ask:</div>
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(suggestion)}
                        className="block text-xs bg-white dark:bg-gray-600 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors text-left w-full"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={`text-xs text-adaptive-muted mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {message.sender !== 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm mr-2 order-0 flex-shrink-0">
                🤖
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm">
                🤖
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="text-xs text-adaptive-muted mb-2">Quick replies:</div>
          <div className="flex flex-wrap gap-1">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-white dark:bg-gray-700 text-adaptive-muted hover:bg-primary-100 dark:hover:bg-gray-600 px-2 py-1 rounded-full transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about your career..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-adaptive"
              disabled={isTyping}
            />
            {voiceInput && (
              <div className="absolute right-2 top-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
          
          {recognition && (
            <button
              onClick={startVoiceInput}
              disabled={voiceInput || isTyping}
              className={`p-2 rounded-lg transition-colors ${
                voiceInput 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-600 text-adaptive-muted hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-adaptive-muted">
            Powered by AI • AI Career Compass J&K
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearChat}
              className="text-xs text-adaptive-muted hover:text-adaptive transition-colors"
            >
              Clear
            </button>
            <button
              onClick={exportChatHistory}
              className="text-xs text-adaptive-muted hover:text-adaptive transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatbotCounselor;
