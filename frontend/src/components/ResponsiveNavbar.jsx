import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { 
  MockSignInButton as SignInButton, 
  MockSignUpButton as SignUpButton, 
  MockUserButton as UserButton, 
  MockSignedIn as SignedIn, 
  MockSignedOut as SignedOut,
  useMockUser as useUser 
} from './ClerkProviderWrapper'

const ResponsiveNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { user } = useUser()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/colleges', label: 'Colleges', icon: '🏛️' },
    { path: '/careers', label: 'Careers', icon: '💼' },
    { path: '/counselling', label: 'Counselling', icon: '🎯' },
    { path: '/quiz', label: 'Quiz', icon: '📝' },
    { path: '/scholarships', label: 'Scholarships', icon: '💰' },
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
      {/* Main Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-navbar py-1' : 'glass-navbar py-2'
      }`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 sm:h-12 md:h-14">
            {/* Logo - Fully Responsive */}
            <Link to="/" className="flex items-center space-x-1 sm:space-x-2 group flex-shrink-0">
              <motion.div
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="https://www.idreameducation.org/wp-content/uploads/2023/09/jk-board-logo.png"
                  alt="J&K Board Logo"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="text-lg sm:text-xl md:text-2xl hidden">🎓</span>
              </motion.div>
              <div className="hidden xs:block">
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold navbar-title-light group-hover:text-yellow-200 transition-colors duration-300">
                  AI Career Compass J&K
                </h1>
                <p className="text-xs sm:text-sm golden-tagline hidden sm:block">
                  Guiding Your Future
                </p>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on tablet and mobile */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === item.path
                      ? 'navbar-text-active'
                      : 'navbar-text'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="hidden xl:inline">{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right side controls - Fully Responsive */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Clerk Authentication */}
              <SignedOut>
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <button className="p-1 sm:p-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm bg-accent-500 text-white hover:bg-accent-600 transition-all duration-300 transform hover:scale-105 shadow-md">
                      🔐 Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="p-1 sm:p-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm border-2 border-white text-white hover:bg-white hover:text-blue-800 transition-all duration-300 transform hover:scale-105">
                      📝 Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              
              <SignedIn>
                <div className="flex items-center space-x-2">
                  <span className="hidden sm:inline text-sm navbar-text">
                    👋 {user?.firstName || 'User'}
                  </span>
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 sm:w-10 sm:h-10"
                      }
                    }}
                  />
                </div>
              </SignedIn>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1 sm:p-2 rounded-lg navbar-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Toggle theme"
              >
                <span className="text-base sm:text-lg">{isDark ? '☀️' : '🌙'}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-1 sm:p-2 rounded-lg navbar-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 sm:top-24 left-0 right-0 z-40 lg:hidden"
          >
            <div className="glass-strong mx-2 sm:mx-4 md:mx-6 rounded-xl p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`relative flex items-center space-x-3 p-3 sm:p-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                      location.pathname === item.path
                        ? 'navbar-text-active'
                        : 'navbar-text'
                    }`}
                  >
                    <span className="text-lg sm:text-xl">{item.icon}</span>
                    <span className="text-sm sm:text-base font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile Authentication */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <SignedOut>
                  <div className="flex flex-col gap-3">
                    <SignInButton mode="modal">
                      <button className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-300 font-medium">
                        🔐 Sign In to Your Account
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="w-full py-3 px-4 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-all duration-300 font-medium">
                        📝 Create New Account
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <UserButton 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-10 h-10"
                        }
                      }}
                    />
                    <div>
                      <p className="font-medium navbar-text">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                </SignedIn>
              </div>

              {/* Mobile Contact Info */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-adaptive-muted">
                  <a href="mailto:wajiddaudtamboli123@gmail.com" className="navbar-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    📧 wajiddaudtamboli123@gmail.com
                  </a>
                  <a href="tel:+919667033839" className="navbar-text hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    📞 +91 9667033839
                  </a>
                  <div className="md:hidden navbar-text">
                    🏫 N.K. Orchid College, Solapur
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ResponsiveNavbar