import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ResponsiveNavbar from './components/ResponsiveNavbar'
import ResponsiveFooter from './components/ResponsiveFooter'
import AIChatbot from './components/AIChatbot'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Colleges from './pages/Colleges'
import Careers from './pages/Careers'
import Counselling from './pages/Counselling'
import Dashboard from './pages/Dashboard'
import DashboardNew from './pages/DashboardNew'
import AIPersonalityQuiz from './components/AIPersonalityQuiz'
import AIKnowledgeHub from './components/AIKnowledgeHub'
import ScholarshipAdvisor from './components/ScholarshipAdvisor'
import CareerPathSimulator from './components/CareerPathSimulator'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <ResponsiveNavbar />
      <main className="pt-12 sm:pt-14 md:pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/ai-quiz" element={<AIPersonalityQuiz />} />
          <Route path="/knowledge-hub" element={<AIKnowledgeHub />} />
          <Route path="/scholarships" element={<ScholarshipAdvisor />} />
          <Route path="/career-simulator" element={<CareerPathSimulator />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/counselling" element={<Counselling />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-ai" element={<DashboardNew />} />
        </Routes>
        <AIChatbot />
      </main>
      <ResponsiveFooter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#10b981',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  )
}

export default App
