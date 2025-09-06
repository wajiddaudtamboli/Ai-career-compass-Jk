import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: "Wajid Tamboli",
      role: "Team Leader",
      avatar: "👨‍💼",
      rating: 5,
      quote: "Leading this project has been an incredible journey of innovation and collaboration. The platform we've built truly empowers students to make informed career decisions.",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      name: "Pooja Mallelor",
      role: "Team Member",
      avatar: "👩‍💻",
      rating: 5,
      quote: "The technical implementation of this career guidance system showcases cutting-edge web technologies. Every line of code was written with students' success in mind.",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 3,
      name: "Sneha Khairate",
      role: "Team Member",
      avatar: "👩‍🎨",
      rating: 5,
      quote: "Designing the user experience for this platform was deeply rewarding. We've created an intuitive interface that makes career exploration accessible to all.",
      color: "from-pink-500 to-pink-600"
    },
    {
      id: 4,
      name: "Vijayalaxmi Kamble",
      role: "Team Member",
      avatar: "👩‍🔬",
      rating: 5,
      quote: "The research and data analysis behind our career recommendations ensures students receive accurate, evidence-based guidance for their future paths.",
      color: "from-green-500 to-green-600"
    },
    {
      id: 5,
      name: "Sanjana Waghmare",
      role: "Team Member",
      avatar: "👩‍💼",
      rating: 5,
      quote: "Coordinating between different project aspects taught me the importance of systematic planning in creating impactful educational technology solutions.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: 6,
      name: "Priyanka Dhule",
      role: "Team Member",
      avatar: "👩‍🎓",
      rating: 5,
      quote: "As a student myself, I understand the challenges of career selection. This platform addresses real student needs with practical, actionable insights.",
      color: "from-teal-500 to-teal-600"
    },
    {
      id: 7,
      name: "Prof. V. D. Gaikwad",
      role: "Mentor",
      avatar: "👨‍🏫",
      rating: 5,
      quote: "Mentoring this talented team has been a privilege. Their dedication to creating meaningful solutions for student career guidance is truly commendable.",
      color: "from-orange-500 to-orange-600"
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        )
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlay, testimonials.length])

  const nextSlide = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
  }

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gradient mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Meet Our Team
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Dedicated professionals working together to revolutionize career guidance in J&K
          </motion.p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-strong rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500"></div>
                </div>

                {/* Avatar with Gradient Background */}
                <motion.div 
                  className={`w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${currentTestimonial.color} flex items-center justify-center text-4xl md:text-5xl shadow-xl relative z-10`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentTestimonial.avatar}
                  <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm"></div>
                </motion.div>

                {/* Rating Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      className="text-yellow-400 text-2xl md:text-3xl mx-1"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Quote */}
                <motion.blockquote 
                  className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 mb-8 italic leading-relaxed max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  "{currentTestimonial.quote}"
                </motion.blockquote>

                {/* Name and Role */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentTestimonial.name}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
                    {currentTestimonial.role}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 z-10"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 z-10"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary-500 w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-300'
              }`}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            />
          ))}
        </div>

        {/* Auto-play Control */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
          >
            {isAutoPlay ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1" />
                </svg>
                <span>Play</span>
              </>
            )}
          </button>
        </div>

        {/* Team Grid Preview */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Our Complete Team
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {testimonials.map((member, index) => (
              <motion.button
                key={member.id}
                onClick={() => goToSlide(index)}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary-100 dark:bg-primary-900/30 scale-105'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                } shadow-md hover:shadow-lg`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-xl`}>
                  {member.avatar}
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {member.role}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSlider
