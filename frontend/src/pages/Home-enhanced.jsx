import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

const Home = () => {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
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
      description: 'Explore 500+ colleges across J&K with detailed information',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '💼',
      title: 'Career Pathways',
      description: 'Discover diverse career options with step-by-step guidance',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '💡',
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions based on your profile and preferences',
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

  const testimonials = [
    {
      name: 'Aisha Sharma',
      role: 'Medical Student, GMC Srinagar',
      image: '👩‍⚕️',
      text: 'AI Career Compass J&K helped me choose the right path. The assessment was spot-on and guided me to pursue medicine. Now I\'m studying at GMC Srinagar!',
      rating: 5
    },
    {
      name: 'Rahul Kumar',
      role: 'Engineering Student, NIT Srinagar',
      image: '👨‍💻',
      text: 'The platform provided excellent guidance for engineering careers. The college information was comprehensive and helped me make informed decisions.',
      rating: 5
    },
    {
      name: 'Priya Devi',
      role: 'Business Student, University of Kashmir',
      image: '👩‍💼',
      text: 'Found my passion for business through the career explorer. The scholarship finder feature helped me secure funding for my studies.',
      rating: 5
    },
    {
      name: 'Arjun Singh',
      role: 'Research Scholar, Central University',
      image: '👨‍🔬',
      text: 'The personalized recommendations opened my eyes to research opportunities I never knew existed. Highly recommend this platform!',
      rating: 5
    }
  ]

  const successStories = [
    { number: '10,000+', label: 'Students Guided', icon: '🎓' },
    { number: '500+', label: 'Partner Colleges', icon: '🏛️' },
    { number: '200+', label: 'Career Paths', icon: '💼' },
    { number: '95%', label: 'Success Rate', icon: '🎯' }
  ]

  // Animate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute inset-0 bg-pattern opacity-10" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gradient mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              AI Career Compass J&K
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your Gateway to Educational Excellence and Career Success in Jammu & Kashmir
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/quiz" className="btn-primary text-lg px-8 py-4">
                Start Your Journey 🚀
              </Link>
              <Link to="/colleges" className="btn-secondary text-lg px-8 py-4">
                Explore Colleges 🏛️
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {successStories.map((stat, index) => (
                <motion.div
                  key={index}
                  className="glass p-6 rounded-xl text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-primary-600 mb-1" id="stats-section">
                    {index === 0 ? `${stats.students.toLocaleString()}+` :
                     index === 1 ? `${stats.colleges}+` :
                     index === 2 ? `${stats.careers}+` :
                     `${stats.success}%`}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
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
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools and resources designed specifically for students in Jammu & Kashmir
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="glass-strong p-8 rounded-xl hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from students who found their path with AI Career Compass J&K
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="glass-strong p-8 md:p-12 rounded-xl text-center"
              >
                <div className="text-6xl mb-6">{testimonials[currentTestimonial].image}</div>
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                  ))}
                </div>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <h4 className="text-xl font-bold text-gradient mb-2">
                  {testimonials[currentTestimonial].name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {testimonials[currentTestimonial].role}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-primary-500 w-8'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Shape Your Future?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of J&K students who have discovered their ideal career path
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 text-lg">
                Start Free Assessment
              </Link>
              <Link to="/dashboard" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 text-lg">
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
