import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { useLanguage } from '../context/LanguageContext'
import DynamicProfile from '../components/DynamicProfile'
import {
  LayoutDashboard,
  ClipboardList,
  Star,
  LogIn,
  User,
  School,
  Briefcase,
  Award,
  TrendingUp,
  CheckCircle,
  Calendar,
  Lightbulb
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useUser()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  // Mock user data
  const mockUserData = {
    profile: {
      name: 'Wajid Daud Tamboli',
      email: 'wajiddaudtamboli123@email.com',
      class: '12th',
      stream: 'Science',
      district: 'Srinagar',
      school: 'Government Higher Secondary School Srinagar',
      profileCompletion: 80
    },
    quizResults: {
      completed: true,
      date: '2025-09-05',
      recommendations: [
        { field: 'Engineering', percentage: 85, rank: 1 },
        { field: 'Medicine', percentage: 72, rank: 2 },
        { field: 'Research', percentage: 68, rank: 3 }
      ]
    },
    bookmarks: {
      colleges: [
        { id: 1, name: 'NIT Srinagar', type: 'Engineering Institute', district: 'Srinagar' },
        { id: 2, name: 'University of Kashmir', type: 'University', district: 'Srinagar' },
        { id: 3, name: 'Government Medical College', type: 'Medical College', district: 'Srinagar' }
      ],
      careers: [
        { id: 1, name: 'Software Engineering', field: 'Technology' },
        { id: 2, name: 'Medicine', field: 'Healthcare' },
        { id: 3, name: 'Research Scientist', field: 'Science' }
      ]
    },
    timeline: [
      { date: '2026-01-05', title: 'JEE Main 2026 Session 1 Registration Opens', type: 'exam', status: 'upcoming' },
      { date: '2026-01-24', title: 'JEE Main 2026 Session 1 Exam Dates', type: 'exam', status: 'upcoming' },
      { date: '2026-03-09', title: 'NEET UG 2026 Application Deadline', type: 'exam', status: 'upcoming' },
      { date: '2026-05-03', title: 'NEET UG 2026 Exam Date', type: 'exam', status: 'upcoming' },
      { date: '2026-05-15', title: 'Board Exam Results 2026', type: 'result', status: 'upcoming' },
      { date: '2026-05-24', title: 'JEE Advanced 2026 Exam Date', type: 'exam', status: 'upcoming' }
    ],
    progress: {
      profileSetup: 100,
      aptitudeTest: 100,
      collegeExploration: 60,
      careerPlanning: 45
    },
    recommendations: {
      colleges: [
        { name: 'NIT Srinagar', match: 92, reason: 'Perfect for Engineering aspirants' },
        { name: 'IIIT Srinagar', match: 88, reason: 'Strong IT program' },
        { name: 'University of Kashmir', match: 75, reason: 'Multiple stream options' }
      ],
      scholarships: [
        { name: 'Merit Scholarship for SC/ST', amount: '₹50,000', deadline: '2024-04-30' },
        { name: 'Prime Minister Scholarship', amount: '₹30,000', deadline: '2024-05-15' },
        { name: 'J&K State Scholarship', amount: '₹25,000', deadline: '2024-06-01' }
      ]
    },
    activities: [
      { date: '2024-01-15', action: 'Completed Aptitude Assessment', type: 'quiz' },
      { date: '2024-01-10', action: 'Bookmarked NIT Srinagar', type: 'bookmark' },
      { date: '2024-01-08', action: 'Explored Engineering Careers', type: 'career' },
      { date: '2024-01-05', action: 'Updated Profile Information', type: 'profile' }
    ]
  }

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUserData(mockUserData)
      setIsLoading(false)
    }, 1000)
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'results', label: 'Quiz Results', icon: ClipboardList },
    { id: 'bookmarks', label: 'Bookmarks', icon: Star },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
  ]

  // Show sign-in prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <LayoutDashboard className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-4">Access Your Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign in to access your personalized career guidance, progress tracking, and recommendations.
          </p>
          <SignInButton redirectUrl="/dashboard">
            <div className="btn-primary text-lg px-8 py-4 cursor-pointer">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to Continue
            </div>
          </SignInButton>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 text-blue-800 dark:text-blue-200">
              ✨ What's in your dashboard:
            </h3>
            <ul className="text-xs text-blue-700 dark:text-blue-300 text-left space-y-1">
              <li>• Personalized career recommendations</li>
              <li>• Progress tracking and achievements</li>
              <li>• College and scholarship suggestions</li>
              <li>• Aptitude test results and insights</li>
            </ul>
          </div>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-white text-3xl"
            >
              <LayoutDashboard className="w-6 h-6" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">Loading Your Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your personalized career guidance...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 px-4 pb-12 sm:pb-16 md:pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 px-4"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gradient mb-2 text-responsive">
            <div className="flex items-center gap-2">
              Welcome back, {user?.firstName || user?.fullName || 'User'}!
              <User className="w-5 h-5 text-primary-500" />
            </div>
          </h1>
          <p className="text-adaptive-secondary text-sm sm:text-base md:text-lg text-responsive">
            Your personalized career guidance dashboard
          </p>
        </motion.div>

        {/* Quick Stats - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 px-4"
        >
          <div className="glass p-3 sm:p-4 rounded-xl text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 mb-1">
              {userData.profile.profileCompletion}%
            </div>
            <div className="text-xs sm:text-sm text-adaptive-muted">Profile Complete</div>
          </div>
          <div className="glass p-3 sm:p-4 rounded-xl text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-600 mb-1">
              {userData.bookmarks.colleges.length}
            </div>
            <div className="text-xs sm:text-sm text-adaptive-muted">Saved Colleges</div>
          </div>
          <div className="glass p-3 sm:p-4 rounded-xl text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-accent-600 mb-1">
              {userData.timeline.filter(item => item.status === 'upcoming').length}
            </div>
            <div className="text-xs sm:text-sm text-adaptive-muted">Upcoming Events</div>
          </div>
          <div className="glass p-3 sm:p-4 rounded-xl text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 mb-1">
              {userData.quizResults.completed ? '✓' : '0'}
            </div>
            <div className="text-xs sm:text-sm text-adaptive-muted">Assessment Done</div>
          </div>
        </motion.div>

        {/* Tab Navigation - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong p-2 rounded-xl mb-6 sm:mb-8 overflow-x-auto mx-4"
        >
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 sm:px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 hover:bg-white/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content - Responsive */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Progress Section - Responsive */}
                <div className="glass-strong p-4 sm:p-6 rounded-xl">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-adaptive">📈 Your Progress</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(userData.progress).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs sm:text-sm font-medium capitalize text-responsive">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-strong p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-6 text-adaptive">🔄 Recent Activity</h2>
                <div className="space-y-4">
                  {userData.activities.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'quiz' ? 'bg-blue-500' :
                        activity.type === 'bookmark' ? 'bg-yellow-500' :
                        activity.type === 'career' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-adaptive">{activity.action}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{activity.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="glass-strong p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-6 text-adaptive">⏰ Upcoming Deadlines</h2>
                <div className="space-y-4">
                  {userData.timeline.filter(item => item.status === 'upcoming').slice(0, 3).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-l-4 ${
                        item.type === 'exam' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                        item.type === 'admission' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                        'border-green-500 bg-green-50 dark:bg-green-900/20'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-adaptive">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.type === 'exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                          item.type === 'admission' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                          'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <DynamicProfile />
          )}

          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong p-8 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-adaptive flex items-center gap-2">
                <ClipboardList className="w-6 h-6" />
                Aptitude Assessment Results
              </h2>
              {userData.quizResults.completed ? (
                <div>
                  <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Assessment completed on: {userData.quizResults.date}
                    </p>
                  </div>
                  <div className="space-y-6">
                    {userData.quizResults.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gradient">
                            #{rec.rank} {rec.field}
                          </h3>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">{rec.percentage}%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Match</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${rec.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <button className="btn-secondary mr-4">Retake Assessment</button>
                    <button className="btn-primary">Explore Careers</button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4 flex justify-center">
                    <ClipboardList className="w-16 h-16 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-adaptive">No Assessment Completed</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Take our comprehensive aptitude assessment to get personalized career recommendations.
                  </p>
                  <button className="btn-primary">Take Assessment Now</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Saved Colleges */}
              <div className="glass-strong p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <School className="w-5 h-5" />
                  Saved Colleges
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.bookmarks.colleges.map((college, index) => (
                    <motion.div
                      key={college.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                    >
                      <h3 className="font-semibold mb-2 text-adaptive">{college.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{college.type}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">📍 {college.district}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="btn-primary text-xs flex-1">View Details</button>
                        <button className="btn-secondary text-xs">Remove</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Saved Careers */}
              <div className="glass-strong p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-6 text-adaptive flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Saved Careers
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.bookmarks.careers.map((career, index) => (
                    <motion.div
                      key={career.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                    >
                      <h3 className="font-semibold mb-2 text-adaptive">{career.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{career.field}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="btn-primary text-xs flex-1">Explore</button>
                        <button className="btn-secondary text-xs">Remove</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-strong p-8 rounded-xl"
            >
              <h2 className="text-2xl font-bold mb-6">📅 Important Timeline</h2>
              <div className="space-y-4">
                {userData.timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      item.status === 'upcoming' ? 'bg-blue-50 dark:bg-blue-900/20' :
                      item.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20' :
                      'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${
                      item.status === 'upcoming' ? 'bg-blue-500' :
                      item.status === 'completed' ? 'bg-green-500' :
                      'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.type === 'exam' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                      item.type === 'admission' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    }`}>
                      {item.type}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* College Recommendations */}
              <div className="glass-strong p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-6">🎯 Recommended Colleges</h2>
                <div className="space-y-4">
                  {userData.recommendations.colleges.map((college, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{college.name}</h3>
                        <div className="text-primary-600 font-bold">{college.match}% Match</div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{college.reason}</p>
                      <div className="flex gap-2">
                        <button className="btn-primary text-xs">View Details</button>
                        <button className="btn-secondary text-xs">Save</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scholarship Recommendations */}
              <div className="glass-strong p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Available Scholarships
                </h2>
                <div className="space-y-4">
                  {userData.recommendations.scholarships.map((scholarship, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{scholarship.name}</h3>
                        <div className="text-green-600 font-bold">{scholarship.amount}</div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Deadline: {scholarship.deadline}
                      </p>
                      <div className="flex gap-2">
                        <button className="btn-primary text-xs">Apply Now</button>
                        <button className="btn-secondary text-xs">Learn More</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
