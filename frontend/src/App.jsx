import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ResponsiveNavbar from './components/ResponsiveNavbar'
import ResponsiveFooter from './components/ResponsiveFooter'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Colleges from './pages/Colleges'
import Careers from './pages/Careers'
import Dashboard from './pages/Dashboard'
import DashboardNew from './pages/DashboardNew'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <ResponsiveNavbar />
      <main className="pt-12 sm:pt-14 md:pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-ai" element={<DashboardNew />} />
        </Routes>
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
