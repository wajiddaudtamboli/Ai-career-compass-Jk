import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AIFeaturesShowcase = () => {
  const { isDarkMode } = useTheme();
  const [activeFeature, setActiveFeature] = useState(0);

  const aiFeatures = [
    {
      id: 'chatbot',
      title: 'AI Career Counselor',
      icon: '🤖',
      description: 'Get instant, personalized career guidance powered by Gemini AI',
      details: 'Ask questions about career paths, exam preparation, college selection, and get intelligent responses in multiple languages.',
      link: '#',
      action: 'Chat Now',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'quiz',
      title: 'AI Personality Quiz',
      icon: '🧠',
      description: 'Discover your ideal stream with intelligent assessment',
      details: 'Advanced AI analyzes your interests, skills, and goals to recommend the perfect academic stream for your future.',
      link: '/ai-quiz',
      action: 'Take Quiz',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'knowledge',
      title: 'Knowledge Hub',
      icon: '🌟',
      description: 'Dynamic, AI-generated educational content',
      details: 'Real-time information about scholarships, exams, colleges, and careers. Always up-to-date with the latest opportunities.',
      link: '/knowledge-hub',
      action: 'Explore',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 'scholarships',
      title: 'Scholarship Advisor',
      icon: '💰',
      description: 'Find personalized scholarship opportunities',
      details: 'AI-powered scholarship matching based on your profile, category, income, and achievements. Maximize your funding opportunities.',
      link: '/scholarships',
      action: 'Find Scholarships',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'simulator',
      title: 'Career Path Simulator',
      icon: '🔮',
      description: 'Visualize your future career journey',
      details: 'AI-powered career path simulation with detailed roadmaps, milestones, and opportunities tailored to your goals and timeframe.',
      link: '/career-simulator',
      action: 'Simulate Path',
      gradient: 'from-indigo-500 to-purple-600'
    }
  ];

  const capabilities = [
    {
      icon: '🗣️',
      title: 'Multilingual Support',
      description: 'AI responds in Hindi, Urdu, Kashmiri, Dogri, and English'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track your progress and get personalized insights'
    },
    {
      icon: '🎯',
      title: 'Smart Recommendations',
      description: 'Personalized suggestions based on your unique profile'
    },
    {
      icon: '📱',
      title: 'Always Available',
      description: '24/7 AI assistance for all your career queries'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % aiFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`py-20 px-4 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold mb-6">
            <span className="mr-2">✨</span>
            Powered by Gemini AI
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI-Powered Career Guidance
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience the future of career counseling with intelligent AI that understands your unique needs 
            and provides personalized guidance for students in Jammu & Kashmir.
          </p>
        </motion.div>

        {/* Main Feature Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Feature Display */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-3xl shadow-2xl ${
              isDarkMode ? 'bg-gray-800/50 backdrop-blur border border-gray-700' : 'bg-white/80 backdrop-blur border border-gray-200'
            }`}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${aiFeatures[activeFeature].gradient} text-white text-2xl mb-6`}>
              {aiFeatures[activeFeature].icon}
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {aiFeatures[activeFeature].title}
            </h3>
            <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {aiFeatures[activeFeature].description}
            </p>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {aiFeatures[activeFeature].details}
            </p>
            <Link
              to={aiFeatures[activeFeature].link}
              className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${aiFeatures[activeFeature].gradient} text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
            >
              {aiFeatures[activeFeature].action}
              <span className="ml-2">→</span>
            </Link>
          </motion.div>

          {/* Feature Navigation */}
          <div className="space-y-4">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  index === activeFeature
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-gray-800/30 hover:bg-gray-700/50 text-gray-300'
                      : 'bg-white/50 hover:bg-white/80 text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl ${index === activeFeature ? 'text-white' : ''}`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{feature.title}</h4>
                    <p className={`text-sm ${index === activeFeature ? 'text-blue-100' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Capabilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h3 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI-Powered Capabilities
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`p-6 rounded-2xl text-center transition-all duration-300 hover:transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 backdrop-blur border border-gray-700 hover:border-blue-500' 
                    : 'bg-white/80 backdrop-blur border border-gray-200 hover:border-blue-500 hover:shadow-lg'
                }`}
              >
                <div className="text-3xl mb-4">{capability.icon}</div>
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {capability.title}
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {capability.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`text-center p-12 rounded-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur border border-gray-700' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200'
          }`}
        >
          <h3 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Explore Your Future?
          </h3>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Start your journey with our AI-powered career guidance system. Get personalized recommendations, 
            expert advice, and comprehensive support for your academic and career decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/ai-quiz"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              🧠 Take AI Quiz
            </Link>
            <Link
              to="/knowledge-hub"
              className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                isDarkMode 
                  ? 'border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white' 
                  : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
              }`}
            >
              🌟 Explore Knowledge Hub
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIFeaturesShowcase;