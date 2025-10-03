import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AIPersonalityQuiz = () => {
  const { isDarkMode } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = [
    {
      id: 'interests',
      question: 'What subjects interest you the most?',
      type: 'multiple',
      options: [
        { id: 'science', label: 'Mathematics, Physics, Chemistry, Biology', weight: { science: 3, commerce: 1, arts: 1, vocational: 2 } },
        { id: 'business', label: 'Economics, Business Studies, Accountancy', weight: { science: 1, commerce: 3, arts: 1, vocational: 2 } },
        { id: 'humanities', label: 'History, Political Science, Psychology, Literature', weight: { science: 1, commerce: 1, arts: 3, vocational: 1 } },
        { id: 'creative', label: 'Art, Design, Music, Creative Writing', weight: { science: 1, commerce: 2, arts: 3, vocational: 3 } },
        { id: 'technology', label: 'Computer Science, Programming, Digital Media', weight: { science: 3, commerce: 2, arts: 1, vocational: 3 } }
      ]
    },
    {
      id: 'career_goals',
      question: 'What type of career appeals to you most?',
      type: 'single',
      options: [
        { id: 'doctor', label: 'Doctor/Healthcare Professional', weight: { science: 4, commerce: 1, arts: 1, vocational: 1 } },
        { id: 'engineer', label: 'Engineer/Technology Expert', weight: { science: 4, commerce: 1, arts: 1, vocational: 2 } },
        { id: 'business', label: 'Business Owner/Corporate Leader', weight: { science: 1, commerce: 4, arts: 2, vocational: 2 } },
        { id: 'teacher', label: 'Teacher/Education Professional', weight: { science: 2, commerce: 2, arts: 3, vocational: 2 } },
        { id: 'civil_service', label: 'Civil Services/Government Job', weight: { science: 2, commerce: 2, arts: 4, vocational: 1 } },
        { id: 'creative', label: 'Artist/Designer/Creative Professional', weight: { science: 1, commerce: 2, arts: 4, vocational: 3 } },
        { id: 'entrepreneur', label: 'Entrepreneur/Startup Founder', weight: { science: 2, commerce: 3, arts: 2, vocational: 3 } }
      ]
    },
    {
      id: 'learning_style',
      question: 'How do you prefer to learn and work?',
      type: 'single',
      options: [
        { id: 'analytical', label: 'Analytical thinking and problem-solving', weight: { science: 3, commerce: 2, arts: 2, vocational: 2 } },
        { id: 'practical', label: 'Hands-on experience and practical application', weight: { science: 2, commerce: 2, arts: 1, vocational: 4 } },
        { id: 'theoretical', label: 'Theoretical study and research', weight: { science: 3, commerce: 1, arts: 3, vocational: 1 } },
        { id: 'collaborative', label: 'Group work and team collaboration', weight: { science: 2, commerce: 3, arts: 3, vocational: 2 } },
        { id: 'independent', label: 'Independent work and self-direction', weight: { science: 2, commerce: 2, arts: 3, vocational: 2 } }
      ]
    },
    {
      id: 'skills',
      question: 'Which skills do you feel you excel at or want to develop?',
      type: 'multiple',
      options: [
        { id: 'math', label: 'Mathematical and logical reasoning', weight: { science: 4, commerce: 3, arts: 1, vocational: 2 } },
        { id: 'communication', label: 'Communication and language skills', weight: { science: 1, commerce: 3, arts: 4, vocational: 2 } },
        { id: 'leadership', label: 'Leadership and management', weight: { science: 2, commerce: 4, arts: 3, vocational: 2 } },
        { id: 'creativity', label: 'Creative and artistic abilities', weight: { science: 1, commerce: 2, arts: 4, vocational: 4 } },
        { id: 'technical', label: 'Technical and computer skills', weight: { science: 3, commerce: 2, arts: 1, vocational: 4 } }
      ]
    },
    {
      id: 'work_environment',
      question: 'What type of work environment do you prefer?',
      type: 'single',
      options: [
        { id: 'laboratory', label: 'Laboratory or research facility', weight: { science: 4, commerce: 1, arts: 1, vocational: 2 } },
        { id: 'office', label: 'Corporate office environment', weight: { science: 2, commerce: 4, arts: 2, vocational: 2 } },
        { id: 'field', label: 'Field work and outdoor activities', weight: { science: 2, commerce: 1, arts: 2, vocational: 3 } },
        { id: 'creative_space', label: 'Creative studio or flexible workspace', weight: { science: 1, commerce: 2, arts: 4, vocational: 3 } },
        { id: 'public_service', label: 'Government office or public service', weight: { science: 2, commerce: 2, arts: 4, vocational: 1 } }
      ]
    },
    {
      id: 'motivation',
      question: 'What motivates you most in choosing a career?',
      type: 'single',
      options: [
        { id: 'helping', label: 'Helping others and making a difference', weight: { science: 3, commerce: 2, arts: 3, vocational: 2 } },
        { id: 'financial', label: 'Financial security and high earning potential', weight: { science: 3, commerce: 4, arts: 1, vocational: 3 } },
        { id: 'recognition', label: 'Recognition and professional status', weight: { science: 3, commerce: 3, arts: 2, vocational: 2 } },
        { id: 'flexibility', label: 'Work-life balance and flexibility', weight: { science: 2, commerce: 2, arts: 3, vocational: 3 } },
        { id: 'innovation', label: 'Innovation and creating something new', weight: { science: 3, commerce: 3, arts: 2, vocational: 4 } }
      ]
    }
  ];

  const calculateScores = () => {
    const scores = { science: 0, commerce: 0, arts: 0, vocational: 0 };
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      if (Array.isArray(answer)) {
        // Multiple choice question
        answer.forEach(optionId => {
          const option = question.options.find(o => o.id === optionId);
          if (option && option.weight) {
            Object.entries(option.weight).forEach(([stream, weight]) => {
              scores[stream] += weight;
            });
          }
        });
      } else {
        // Single choice question
        const option = question.options.find(o => o.id === answer);
        if (option && option.weight) {
          Object.entries(option.weight).forEach(([stream, weight]) => {
            scores[stream] += weight;
          });
        }
      }
    });

    return scores;
  };

  const getAIRecommendations = async () => {
    setIsLoading(true);
    try {
      const scores = calculateScores();
      const quizResults = {
        scores,
        answers,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString()
      };

      const userPreferences = {
        userId: 'anonymous',
        location: 'Jammu & Kashmir',
        language: 'english',
        quizType: 'stream_selection'
      };

      const response = await fetch('/api/ai/recommend-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizResults,
          userPreferences
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations({
          scores,
          aiRecommendations: data.recommendations,
          timestamp: data.timestamp
        });
      } else {
        console.error('Failed to get AI recommendations:', data.error);
        setRecommendations({
          scores,
          aiRecommendations: 'Unable to generate AI recommendations at this time. Please try again later.',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Quiz results error:', error);
      const scores = calculateScores();
      setRecommendations({
        scores,
        aiRecommendations: 'Unable to connect to AI service. Your quiz results are shown below.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      getAIRecommendations();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setRecommendations(null);
    setQuizStarted(false);
  };

  const getStreamName = (stream) => {
    const names = {
      science: 'Science Stream',
      commerce: 'Commerce Stream',
      arts: 'Arts/Humanities',
      vocational: 'Vocational/Technical'
    };
    return names[stream] || stream;
  };

  const getStreamIcon = (stream) => {
    const icons = {
      science: '🔬',
      commerce: '💼',
      arts: '🎨',
      vocational: '🛠️'
    };
    return icons[stream] || '📚';
  };

  if (!quizStarted) {
    return (
      <div className={`min-h-screen py-12 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-8 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-6xl mb-6">🧠</div>
            <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              AI-Powered Stream Selection Quiz
            </h1>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover your ideal academic stream with our intelligent assessment. Get personalized recommendations 
              powered by AI based on your interests, skills, and career goals.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <div className="text-3xl mb-3">🎯</div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Personalized Results
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Get customized stream recommendations based on your unique profile and preferences.
                </p>
              </div>
              
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                <div className="text-3xl mb-3">🤖</div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI-Powered Analysis
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Advanced AI analyzes your responses to provide detailed career guidance and insights.
                </p>
              </div>
            </div>

            <motion.button
              onClick={() => setQuizStarted(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Quiz Now
            </motion.button>
            
            <p className={`text-sm mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Takes about 5-7 minutes to complete
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showResults && recommendations) {
    const sortedStreams = Object.entries(recommendations.scores)
      .sort(([,a], [,b]) => b - a)
      .map(([stream, score]) => ({ stream, score }));

    return (
      <div className={`min-h-screen py-12 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-2xl shadow-lg mb-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Personalized Stream Recommendations
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Based on your responses, here are your recommended academic streams:
              </p>
            </div>

            {/* Stream Scores */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {sortedStreams.map(({ stream, score }, index) => (
                <motion.div
                  key={stream}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border-2 ${
                    index === 0 
                      ? 'border-gold bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-500'
                      : isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStreamIcon(stream)}</span>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {getStreamName(stream)}
                      </h3>
                      {index === 0 && <span className="text-lg">👑</span>}
                    </div>
                    <div className={`text-2xl font-bold ${
                      index === 0 ? 'text-yellow-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {score}
                    </div>
                  </div>
                  
                  <div className={`w-full bg-gray-200 rounded-full h-2 mb-2 ${isDarkMode ? 'bg-gray-600' : ''}`}>
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.max((score / Math.max(...sortedStreams.map(s => s.score))) * 100, 10)}%` }}
                    ></div>
                  </div>
                  
                  <p className={`text-sm ${
                    index === 0 ? 'text-yellow-700 dark:text-yellow-300' : 
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {index === 0 ? 'Top Recommendation' : `Score: ${score}`}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* AI Recommendations */}
            <div className={`p-6 rounded-xl mb-6 ${
              isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🤖</span>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Career Counselor Analysis
                </h3>
              </div>
              
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Generating personalized recommendations...
                  </span>
                </div>
              ) : (
                <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
                  <div className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {recommendations.aiRecommendations}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={resetQuiz}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retake Quiz
              </motion.button>
              
              <motion.button
                onClick={() => window.open('/counselling', '_blank')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Personal Counseling
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen py-12 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className={`mb-8 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`p-8 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option) => (
                <motion.label
                  key={option.id}
                  className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    question.type === 'multiple' 
                      ? (answers[question.id] || []).includes(option.id)
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDarkMode 
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      : answers[question.id] === option.id
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDarkMode 
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                    name={question.id}
                    value={option.id}
                    checked={
                      question.type === 'multiple' 
                        ? (answers[question.id] || []).includes(option.id)
                        : answers[question.id] === option.id
                    }
                    onChange={(e) => {
                      if (question.type === 'multiple') {
                        const currentAnswers = answers[question.id] || [];
                        if (e.target.checked) {
                          handleAnswer(question.id, [...currentAnswers, option.id]);
                        } else {
                          handleAnswer(question.id, currentAnswers.filter(id => id !== option.id));
                        }
                      } else {
                        handleAnswer(question.id, option.id);
                      }
                    }}
                    className="sr-only"
                  />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {option.label}
                  </span>
                </motion.label>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <motion.button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  currentQuestion === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={currentQuestion > 0 ? { scale: 1.05 } : {}}
                whileTap={currentQuestion > 0 ? { scale: 0.95 } : {}}
              >
                Previous
              </motion.button>

              <motion.button
                onClick={nextQuestion}
                disabled={!answers[question.id] || (question.type === 'multiple' && (!answers[question.id] || answers[question.id].length === 0))}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  !answers[question.id] || (question.type === 'multiple' && (!answers[question.id] || answers[question.id].length === 0))
                    ? 'opacity-50 cursor-not-allowed bg-gray-400'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
                whileHover={answers[question.id] ? { scale: 1.05 } : {}}
                whileTap={answers[question.id] ? { scale: 0.95 } : {}}
              >
                {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIPersonalityQuiz;