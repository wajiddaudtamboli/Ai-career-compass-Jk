import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import aiService from '../services/aiService';

const PersonalizedDashboard = ({ userId, userProfile }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [streakData, setStreakData] = useState(null);

  useEffect(() => {
    initializeDashboard();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      refreshRecommendations();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const initializeDashboard = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadRecommendations(),
        loadNotifications(),
        loadWeatherData(),
        loadStreakData()
      ]);
    } catch (error) {
      console.error('Dashboard initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const data = await aiService.getPersonalizedRecommendations(userProfile);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await aiService.getSmartNotifications(userId);
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadWeatherData = async () => {
    try {
      // Mock weather data for J&K region
      setWeatherData({
        location: userProfile?.location || 'Srinagar, J&K',
        temperature: '22°C',
        condition: 'Partly Cloudy',
        icon: '⛅',
        impact: 'Good weather for outdoor activities and college visits'
      });
    } catch (error) {
      console.error('Failed to load weather data:', error);
    }
  };

  const loadStreakData = async () => {
    try {
      const data = await aiService.getStudyStreak(userId);
      setStreakData(data);
    } catch (error) {
      console.error('Failed to load streak data:', error);
    }
  };

  const refreshRecommendations = async () => {
    try {
      const data = await aiService.getPersonalizedRecommendations(userProfile, true);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await aiService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'course': return '📚';
      case 'college': return '🏫';
      case 'career': return '💼';
      case 'skill': return '💪';
      case 'opportunity': return '🌟';
      case 'scholarship': return '💰';
      default: return '✨';
    }
  };

  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-adaptive mb-2">Loading Your Dashboard</h3>
          <p className="text-adaptive-muted">AI is preparing personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-adaptive mb-2">
              Welcome back, {userProfile?.name || 'Student'}! 👋
            </h1>
            <p className="text-adaptive-muted">
              Your AI-powered career guidance dashboard for J&K opportunities
            </p>
          </div>
          
          {weatherData && (
            <div className="mt-4 md:mt-0 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{weatherData.icon}</span>
                <div>
                  <div className="font-semibold text-adaptive">{weatherData.temperature}</div>
                  <div className="text-sm text-adaptive-muted">{weatherData.location}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Study Streak */}
        {streakData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-lg">
                  🔥
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-adaptive">{streakData.current_streak} Day Study Streak</div>
                  <div className="text-sm text-adaptive-muted">Keep going! Your longest streak: {streakData.longest_streak} days</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">{streakData.weekly_hours}h</div>
                <div className="text-sm text-adaptive-muted">This week</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'recommendations', label: 'AI Recommendations', icon: '🤖' },
            { id: 'notifications', label: 'Notifications', icon: '🔔', badge: notifications.filter(n => !n.read).length },
            { id: 'progress', label: 'Progress', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 font-medium text-sm transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-adaptive-muted hover:text-adaptive'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {recommendations?.quiz_results?.overall_score || 'N/A'}
                        </div>
                        <div className="text-sm text-blue-600">Aptitude Score</div>
                      </div>
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        🎯
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {recommendations?.completed_activities || 0}
                        </div>
                        <div className="text-sm text-green-600">Activities Done</div>
                      </div>
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                        ✅
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {recommendations?.matched_careers?.length || 0}
                        </div>
                        <div className="text-sm text-purple-600">Career Matches</div>
                      </div>
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                        💼
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {recommendations?.upcoming_deadlines?.length || 0}
                        </div>
                        <div className="text-sm text-orange-600">Deadlines</div>
                      </div>
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                        ⏰
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today's Focus */}
                <div className="bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 rounded-xl p-6 border border-accent-200 dark:border-accent-700">
                  <h3 className="text-lg font-semibold text-adaptive mb-4">🎯 Today's Focus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-adaptive mb-2">Priority Actions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-adaptive-muted">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Complete career assessment quiz
                        </li>
                        <li className="flex items-center text-sm text-adaptive-muted">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          Research NIT Srinagar admission requirements
                        </li>
                        <li className="flex items-center text-sm text-adaptive-muted">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Apply for J&K scholarship deadline: 2 days
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-adaptive mb-2">Recommended Study Time</h4>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-adaptive-muted">Mathematics</span>
                          <span className="text-sm font-medium text-adaptive">2 hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-adaptive-muted">Science</span>
                          <span className="text-sm font-medium text-adaptive">1.5 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {recommendations?.daily_recommendations?.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getRecommendationIcon(rec.type)}</span>
                        <div>
                          <h4 className="font-semibold text-adaptive">{rec.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            rec.relevance_score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            rec.relevance_score >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {rec.relevance_score}% Match
                          </span>
                        </div>
                      </div>
                      <button className="text-adaptive-muted hover:text-adaptive">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-adaptive-muted text-sm mb-3">{rec.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-adaptive-muted">
                        <span className="mr-3">⏱️ {rec.time_commitment}</span>
                        <span>📍 {rec.j_k_specific ? 'J&K Specific' : 'General'}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-xs bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 px-3 py-1 rounded">
                          Learn More
                        </button>
                        <button className="text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 px-3 py-1 rounded">
                          Add to Plan
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      notification.read 
                        ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800' 
                        : getNotificationColor(notification.priority)
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-lg mr-2">{notification.icon}</span>
                          <h4 className={`font-semibold ${notification.read ? 'text-adaptive-muted' : 'text-adaptive'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="ml-2 w-2 h-2 bg-primary-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-adaptive-muted mb-2">{notification.message}</p>
                        <div className="flex items-center text-xs text-adaptive-muted">
                          <span>{notification.time_ago}</span>
                          {notification.action_required && (
                            <span className="ml-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded">
                              Action Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="mt-3 flex space-x-2">
                        {notification.actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className="text-xs bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 px-3 py-1 rounded"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Academic Progress */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-adaptive mb-4">Academic Progress</h3>
                  <div className="space-y-4">
                    {[
                      { subject: 'Mathematics', progress: 85, target: 90 },
                      { subject: 'Physics', progress: 78, target: 85 },
                      { subject: 'Chemistry', progress: 82, target: 88 },
                      { subject: 'English', progress: 90, target: 92 }
                    ].map((subject, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-adaptive">{subject.subject}</span>
                          <span className="text-sm text-adaptive-muted">{subject.progress}% / {subject.target}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goal Tracking */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-adaptive mb-4">Goal Tracking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Completed Goals</h4>
                      <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <li>• Complete JEE application</li>
                        <li>• Research career options</li>
                        <li>• Take aptitude assessment</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🎯 Current Goals</h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Improve Math score to 90%</li>
                        <li>• Apply for scholarships</li>
                        <li>• Visit college campuses</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
