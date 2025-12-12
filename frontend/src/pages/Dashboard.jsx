import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
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
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  // Mock user data
  const mockUserData = {
    profile: {
      name: 'Guest User',
      email: 'guest@example.com',
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
    { id: 'quiz', label: 'Quiz Results', icon: ClipboardList },
    { id: 'bookmarks', label: 'Bookmarks', icon: Star },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {userData?.profile?.name || 'Guest'}! 👋
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track your career journey and explore new opportunities
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/quiz"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-300"
              >
                <ClipboardList className="w-5 h-5 mr-2" />
                Take Career Quiz
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Progress Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
                  Your Progress
                </h3>
                <div className="space-y-4">
                  {Object.entries(userData?.progress || {}).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-500" />
                  Upcoming Events
                </h3>
                <div className="space-y-3">
                  {userData?.timeline?.slice(0, 4).map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-primary-500" />
                  Recommended Colleges
                </h3>
                <div className="space-y-3">
                  {userData?.recommendations?.colleges?.map((college, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{college.name}</span>
                        <span className="text-sm text-primary-500 font-bold">{college.match}% match</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{college.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quiz Results</h3>
              {userData?.quizResults?.completed ? (
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Completed on: {userData.quizResults.date}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {userData.quizResults.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-700 dark:to-gray-600">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">#{rec.rank}</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{rec.field}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{rec.percentage}% match</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't taken the career quiz yet.</p>
                  <Link
                    to="/quiz"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium"
                  >
                    Take Quiz Now
                  </Link>
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Bookmarked Colleges */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <School className="w-5 h-5 mr-2 text-primary-500" />
                  Saved Colleges
                </h3>
                <div className="space-y-3">
                  {userData?.bookmarks?.colleges?.map((college) => (
                    <div key={college.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-shadow">
                      <div className="font-medium text-gray-900 dark:text-white">{college.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{college.type} • {college.district}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bookmarked Careers */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-primary-500" />
                  Saved Careers
                </h3>
                <div className="space-y-3">
                  {userData?.bookmarks?.careers?.map((career) => (
                    <div key={career.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-shadow">
                      <div className="font-medium text-gray-900 dark:text-white">{career.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{career.field}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DynamicProfile />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Dashboard
