import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import TestimonialSlider from '../components/TestimonialSlider'
import AIFeaturesShowcase from '../components/AIFeaturesShowcase'

const Home = () => {
  const { theme } = useTheme()
  const [stats, setStats] = useState({ students: 0, colleges: 0, careers: 0, success: 0 })

  // Mock data
  const features = [
    {
      icon: '🎯',
      title: 'Personalized Assessment',
      description: 'Comprehensive aptitude test to discover your strengths and interests',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🏛️',
      title: 'College Directory',
      description: 'Explore top colleges and universities in Jammu & Kashmir',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '💼',
      title: 'Career Guidance',
      description: 'Expert advice on career paths suited for your profile',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '💡',
      title: 'Expert Guidance',
      description: 'Connect with career counselors and industry experts',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your journey with detailed analytics and milestones',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: '🎓',
      title: 'Scholarship Finder',
      description: 'Access hundreds of scholarship opportunities for J&K students',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const successStories = [
    { number: '10,000+', label: 'Students Helped', icon: '🎓' },
    { number: '500+', label: 'College Partners', icon: '🏛️' },
    { number: '200+', label: 'Career Paths', icon: '💼' },
    { number: '95%', label: 'Success Rate', icon: '🎯' }
  ]

  // Animate stats
  useEffect(() => {
    const animateStats = () => {
      const targets = { students: 10000, colleges: 500, careers: 200, success: 95 }
      const duration = 2000
      const steps = 60
      const increment = {
        students: targets.students / steps,
        colleges: targets.colleges / steps,
        careers: targets.careers / steps,
        success: targets.success / steps
      }

      let step = 0
      const timer = setInterval(() => {
        step++
        setStats({
          students: Math.min(Math.floor(increment.students * step), targets.students),
          colleges: Math.min(Math.floor(increment.colleges * step), targets.colleges),
          careers: Math.min(Math.floor(increment.careers * step), targets.careers),
          success: Math.min(Math.floor(increment.success * step), targets.success)
        })

        if (step >= steps) clearInterval(timer)
      }, duration / steps)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats()
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    const statsElement = document.getElementById('stats-section')
    if (statsElement) observer.observe(statsElement)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Fully Responsive */}
      <section className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 px-4 relative overflow-hidden hero-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-secondary-50/80 to-accent-50/80 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90" />
        <div className="absolute inset-0 bg-pattern opacity-10" />
        
        <div className="max-w-7xl mx-auto relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center w-full"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gradient-premium mb-4 sm:mb-6 px-2 text-responsive"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              AI Career Compass J&K
            </motion.h1>
            
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-subtitle-yellow mb-6 sm:mb-8 max-w-3xl mx-auto px-4 text-responsive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your Gateway to Educational Excellence and Career Success
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/quiz" className="btn-primary text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                Get Started 🚀
              </Link>
              <Link to="/colleges" className="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                Explore Colleges 🏛️
              </Link>
            </motion.div>

            {/* Quick Stats - Responsive Grid */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {successStories.map((stat, index) => (
                <motion.div
                  key={index}
                  className="glass p-3 sm:p-4 md:p-6 rounded-xl text-center card-responsive"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">{stat.icon}</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-stats-yellow mb-1" id="stats-section">
                    {index === 0 ? `${stats.students.toLocaleString()}+` :
                     index === 1 ? `${stats.colleges}+` :
                     index === 2 ? `${stats.careers}+` :
                     `${stats.success}%`}
                  </div>
                  <div className="text-xs sm:text-sm text-adaptive-muted text-responsive">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Why Choose AI Career Compass J&K?
            </h2>
            <p className="text-xl text-adaptive-secondary max-w-3xl mx-auto">
              Comprehensive tools and resources designed specifically for students in Jammu & Kashmir
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="glass-strong p-4 sm:p-6 md:p-8 rounded-xl hover:shadow-xl transition-all duration-300 card-responsive"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 heading-secondary text-responsive">{feature.title}</h3>
                <p className="text-sm sm:text-base text-adaptive-secondary text-responsive">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <AIFeaturesShowcase />

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              How It Works
            </h2>
            <p className="text-xl text-adaptive-secondary max-w-3xl mx-auto">
              Simple steps to unlock your career potential
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Take Assessment',
                description: 'Complete our comprehensive aptitude and personality test',
                icon: '📝'
              },
              {
                step: '02',
                title: 'Get Recommendations',
                description: 'Receive personalized career and college suggestions',
                icon: '🎯'
              },
              {
                step: '03',
                title: 'Plan Your Future',
                description: 'Create your educational and career roadmap',
                icon: '🗺️'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center card-responsive"
              >
                <div className="relative mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl md:text-4xl mx-auto mb-3 sm:mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 heading-secondary text-responsive">{step.title}</h3>
                <p className="text-sm sm:text-base text-adaptive-secondary text-responsive">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Testimonials Section */}
      <TestimonialSlider />

      {/* CTA Section - Responsive */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-responsive">
              Ready to Shape Your Future?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 text-responsive">
              Join thousands of J&K students who have discovered their ideal career path
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/quiz" className="bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base lg:text-lg w-full sm:w-auto">
                Start Free Assessment
              </Link>
              <Link to="/dashboard" className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 text-sm sm:text-base lg:text-lg w-full sm:w-auto">
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
