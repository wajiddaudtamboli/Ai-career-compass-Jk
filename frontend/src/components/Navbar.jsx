import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, 
  Sparkles, 
  Home, 
  Building2, 
  Briefcase, 
  MessageCircleQuestion,
  ClipboardList,
  Award,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import NavLink from './NavLink'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { language, changeLanguage, t, isRTL } = useLanguage()
  const { isDark, toggleTheme } = useTheme()

  // Main navigation items
  const mainNavItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/colleges', label: t('colleges'), icon: Building2 },
    { path: '/careers', label: t('careers'), icon: Briefcase },
    { path: '/counselling', label: 'Counselling', icon: MessageCircleQuestion },
    { path: '/quiz', label: t('quiz'), icon: ClipboardList }
  ]

  // Secondary navigation items (remaining features)
  const secondaryNavItems = [
    { path: '/scholarships', label: 'Scholarships', icon: Award },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
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
      <nav className={`fixed top-0 w-full z-50 bg-blue-700 shadow-lg transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-3'
      } ${isRTL ? 'rtl' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section: Logo + Brand */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <motion.div
                className="relative w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <GraduationCap size={24} className="text-white" strokeWidth={2.5} />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  <Sparkles size={12} className="text-yellow-300" />
                </motion.div>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">
                  AI Career Compass J&K
                </h1>
                <p className="text-xs text-blue-200 -mt-1">
                  Guiding Your Future
                </p>
              </div>
            </Link>

            {/* Center Section: Main Navigation (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  variant="default"
                />
              ))}
            </div>

            {/* Right Section: Secondary Nav + Controls */}
            <div className="flex items-center gap-6">
              
              {/* Secondary Navigation (Large Desktop Only) */}
              <div className="hidden lg:flex items-center gap-6">
                {secondaryNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    icon={item.icon}
                    label={item.label}
                    variant="secondary"
                  />
                ))}
              </div>

              {/* Language Toggle */}
              <button
                onClick={() => changeLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
              >
                {language === 'en' ? 'हिं' : 'EN'}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-blue-700 border-t border-blue-600"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="space-y-2">
                {/* Main Navigation */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-blue-200 px-3 py-1">
                    Main Navigation
                  </h3>
                  {mainNavItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      icon={item.icon}
                      label={item.label}
                      variant="mobile"
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </div>

                {/* Secondary Navigation */}
                <div className="space-y-1 border-t border-blue-600 pt-3">
                  <h3 className="text-sm font-semibold text-blue-200 px-3 py-1">
                    Additional Features
                  </h3>
                  {secondaryNavItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      icon={item.icon}
                      label={item.label}
                      variant="mobile"
                      onClick={() => setIsOpen(false)}
                    />
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
