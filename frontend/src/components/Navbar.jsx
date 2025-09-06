import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { language, changeLanguage, t, isRTL } = useLanguage()
  const { isDark, toggleTheme } = useTheme()

  const navItems = [
    { path: '/', label: t('home'), icon: '🏠' },
    { path: '/colleges', label: t('colleges'), icon: '🎓' },
    { path: '/careers', label: t('career'), icon: '💼' },
    { path: '/quiz', label: t('quiz'), icon: '📝' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => setIsOpen(!isOpen)

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-navbar py-1' : 'glass-navbar py-2'
      } ${isRTL ? 'rtl' : ''}`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 sm:h-12 md:h-14">
            {/* Logo - Responsive sizing */}
            <Link to="/" className="flex items-center space-x-1 sm:space-x-2 group flex-shrink-0">
              <motion.div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-sm sm:text-base"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                👁️
              </motion.div>
              <div className="hidden xs:block sm:block">
                <h1 className="text-xs sm:text-sm md:text-base font-bold navbar-text">
                  AI Career Compass J&K
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on tablet and mobile */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'navbar-text-active'
                      : 'navbar-text hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right side controls - Responsive */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Language Toggle - Simplified for mobile */}
              <div className="flex items-center">
                <button
                  onClick={() => changeLanguage(language === 'en' ? 'hi' : 'en')}
                  className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg navbar-text text-xs sm:text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  {language === 'en' ? 'हिं' : 'EN'}
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1 sm:p-2 rounded-lg navbar-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Toggle theme"
              >
                <span className="text-sm sm:text-base">{isDark ? '☀️' : '🌙'}</span>
              </button>

              {/* Mobile Menu Button - Only visible on tablet and mobile */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-1 sm:p-2 rounded-lg navbar-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden"
          >
            <div className="glass-navbar border-t border-white/10">
              <div className="max-w-7xl mx-auto px-4 py-2">
                <div className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        location.pathname === item.path
                          ? 'navbar-text-active'
                          : 'navbar-text hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
