import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PersonalizedDashboard from '../components/PersonalizedDashboard';
import AdaptiveQuizComponent from '../components/AdaptiveQuizComponent';
import CareerRoadmapComponent from '../components/CareerRoadmapComponent';
import MultiLanguageTranslationUI from '../components/MultiLanguageTranslationUI';
import AIChatbotCounselor from '../components/AIChatbotCounselor';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [chatbotMinimized, setChatbotMinimized] = useState(true);
  const [loading, setLoading] = useState(true);

  // Mock user profile - in real app, this would come from authentication
  const mockUserProfile = {
    id: 'user_123',
    name: 'Rahul Kumar',
    age: 17,
    grade: '12th',
    location: 'Srinagar, J&K',
    interests: ['Technology', 'Mathematics', 'Science'],
    academicLevel: 'class_12',
    preferredLanguage: 'en',
    goals: ['Engineering', 'IIT Preparation', 'Local Opportunities'],
    strengths: ['Analytical Thinking', 'Problem Solving', 'Mathematics'],
    weaknesses: ['Public Speaking', 'Time Management'],
    completedActivities: 12,
    studyStreak: 7
  };

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUserProfile(mockUserProfile);
      setLoading(false);
    }, 1000);
  }, []);

  const handleQuizCompletion = (results) => {
    setQuizResults(results);
    // Update user profile with quiz results
    setUserProfile(prev => ({
      ...prev,
      quizResults: results,
      lastQuizDate: new Date().toISOString()
    }));
  };

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '🏠',
      description: 'Your personalized AI-powered overview'
    },
    {
      id: 'quiz',
      name: 'Aptitude Assessment',
      icon: '🧠',
      description: 'AI-adaptive career aptitude test'
    },
    {
      id: 'roadmap',
      name: 'Career Roadmap',
      icon: '🗺️',
      description: 'AI-generated career pathways for J&K'
    },
    {
      id: 'colleges',
      name: 'College Explorer',
      icon: '🏫',
      description: 'Find the best colleges in J&K and beyond'
    },
    {
      id: 'opportunities',
      name: 'Opportunities',
      icon: '🌟',
      description: 'Scholarships, internships, and local programs'
    },
    {
      id: 'progress',
      name: 'Progress Tracker',
      icon: '📈',
      description: 'Track your academic and career progress'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-3xl text-white">🚀</span>
          </motion.div>
          <h2 className="text-2xl font-bold text-adaptive mb-2">Loading Your Dashboard</h2>
          <p className="text-adaptive-muted">Preparing your AI-powered career guidance experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">JK</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-adaptive">AI Career Compass J&K</h1>
                <p className="text-sm text-adaptive-muted">AI-Powered Student Guidance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <MultiLanguageTranslationUI />
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-adaptive">{userProfile?.name}</div>
                  <div className="text-xs text-adaptive-muted">{userProfile?.grade} - {userProfile?.location}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-adaptive mb-4">Navigation</h3>
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-adaptive'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{item.icon}</span>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className={`text-xs ${
                          activeSection === item.id ? 'text-blue-100' : 'text-adaptive-muted'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-adaptive mb-3">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-adaptive-muted">Study Streak</span>
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-1">🔥</span>
                      <span className="font-medium text-adaptive">{userProfile?.studyStreak} days</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-adaptive-muted">Activities</span>
                    <span className="font-medium text-adaptive">{userProfile?.completedActivities}</span>
                  </div>
                  {quizResults && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-adaptive-muted">Aptitude Score</span>
                      <span className="font-medium text-primary-600">{quizResults.overallScore}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'dashboard' && (
                <PersonalizedDashboard 
                  userId={userProfile?.id} 
                  userProfile={userProfile}
                />
              )}

              {activeSection === 'quiz' && (
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                    <h2 className="text-2xl font-bold text-adaptive mb-2">AI-Adaptive Aptitude Assessment</h2>
                    <p className="text-adaptive-muted">
                      Our AI-powered assessment adapts to your responses in real-time, providing personalized 
                      career recommendations based on your unique strengths and interests.
                    </p>
                  </div>
                  <AdaptiveQuizComponent
                    studentInterests={userProfile?.interests}
                    academicLevel={userProfile?.academicLevel}
                    onQuizComplete={handleQuizCompletion}
                  />
                </div>
              )}

              {activeSection === 'roadmap' && (
                <div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                    <h2 className="text-2xl font-bold text-adaptive mb-2">AI-Generated Career Roadmap</h2>
                    <p className="text-adaptive-muted">
                      Explore personalized career pathways designed specifically for students in Jammu & Kashmir, 
                      with AI-curated opportunities and regional advantages.
                    </p>
                  </div>
                  <CareerRoadmapComponent
                    studentInterests={userProfile?.interests}
                    academicLevel={userProfile?.academicLevel}
                    targetCareer={quizResults?.recommendedCareers?.[0]}
                  />
                </div>
              )}

              {activeSection === 'colleges' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                  <span className="text-6xl mb-4 block">🏫</span>
                  <h2 className="text-2xl font-bold text-adaptive mb-4">College Explorer</h2>
                  <p className="text-adaptive-muted mb-6">
                    Discover the best colleges and universities in J&K and beyond, with AI-powered matching 
                    based on your interests, academic performance, and career goals.
                  </p>
                  <div className="text-adaptive-muted">
                    🚧 Coming Soon - AI-powered college recommendation engine
                  </div>
                </div>
              )}

              {activeSection === 'opportunities' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                  <span className="text-6xl mb-4 block">🌟</span>
                  <h2 className="text-2xl font-bold text-adaptive mb-4">Opportunities Hub</h2>
                  <p className="text-adaptive-muted mb-6">
                    Find scholarships, internships, government schemes, and local opportunities 
                    specifically curated for J&K students.
                  </p>
                  <div className="text-adaptive-muted">
                    🚧 Coming Soon - Real-time opportunity discovery and application tracking
                  </div>
                </div>
              )}

              {activeSection === 'progress' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                  <span className="text-6xl mb-4 block">📈</span>
                  <h2 className="text-2xl font-bold text-adaptive mb-4">Progress Tracker</h2>
                  <p className="text-adaptive-muted mb-6">
                    Track your academic progress, career preparation milestones, and skill development 
                    with AI-powered insights and recommendations.
                  </p>
                  <div className="text-adaptive-muted">
                    🚧 Coming Soon - Comprehensive progress tracking and analytics
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Chatbot Counselor */}
      <AIChatbotCounselor
        userId={userProfile?.id}
        userProfile={userProfile}
        isMinimized={chatbotMinimized}
        onToggle={() => setChatbotMinimized(!chatbotMinimized)}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">JK</span>
              </div>
              <span className="text-lg font-bold text-adaptive">AI Career Compass J&K</span>
            </div>
            <p className="text-adaptive-muted mb-4">
              Empowering Jammu & Kashmir students with AI-powered career guidance and personalized education pathways.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-adaptive-muted">
              <span>🤖 Powered by Gemini AI</span>
              <span>🏔️ Made for J&K Students</span>
              <span>🌍 Multi-language Support</span>
              <span>📱 Mobile Responsive</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
