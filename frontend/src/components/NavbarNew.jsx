import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useUser, SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { 
  SunIcon, 
  MoonIcon, 
  Bars3Icon, 
  XMarkIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  MapPinIcon 
} from '@heroicons/react/24/outline'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useTheme()
  const { language, changeLanguage, translations } = useLanguage()
  const { user } = useUser()
  const location = useLocation()

  const navigation = [
    { name: translations.home, href: '/' },
    { name: translations.careers, href: '/careers' },
    { name: translations.colleges, href: '/colleges' },
    { name: translations.quiz, href: '/quiz' },
    { name: translations.dashboard, href: '/dashboard' }
  ]

  const contactInfo = {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'wajiddaudtamboli123@gmail.com',
    phone: import.meta.env.VITE_CONTACT_PHONE || '9667033839',
    address: import.meta.env.VITE_CONTACT_ADDRESS || 'N.K. Orchid College of Engineering and Technology, Solapur'
  }

  const isActiveRoute = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Top contact bar */}
      <div className="bg-primary-600/10 dark:bg-primary-900/20 border-b border-primary-200/20 dark:border-primary-700/20">
        <div className="max-w-5xl mx-auto px-4 py-2">
          <div className="flex flex-wrap items-center justify-between text-xs md:text-sm">
            <div className="flex items-center space-x-4">
              <a 
                href={`mailto:${contactInfo.email}`}
                className="flex items-center space-x-1 text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 transition-colors"
              >
                <EnvelopeIcon className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{contactInfo.email}</span>
              </a>
              <a 
                href={`tel:${contactInfo.phone}`}
                className="flex items-center space-x-1 text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 transition-colors"
              >
                <PhoneIcon className="h-3 w-3 md:h-4 md:w-4" />
                <span>{contactInfo.phone}</span>
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-1 text-primary-600 dark:text-primary-400">
              <MapPinIcon className="h-4 w-4" />
              <span className="text-xs">{contactInfo.address}</span>
            </div>
          </div>
        </div>
      </div>

      <motion.nav 
        className="sticky top-0 z-50 glass border-b border-gray-200/20 dark:border-gray-700/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 md:h-14">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg md:text-xl">👁️</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    {translations.appName}
                  </h1>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActiveRoute(item.href)
                        ? 'bg-primary-500/20 text-primary-700 dark:text-primary-300 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Language Selector */}
              <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                    language === 'en'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => changeLanguage('hi')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                    language === 'hi'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  🇮🇳 हिं
                </button>
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {darkMode ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
              </motion.button>

              {/* Authentication */}
              <SignedOut>
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <button className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                      {translations.signIn || 'Sign In'}
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-3 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      {translations.signUp || 'Sign Up'}
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </SignedIn>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
              >
                {darkMode ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
              </motion.button>

              {/* Mobile Auth */}
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-6 h-6"
                    }
                  }}
                />
              </SignedIn>

              {/* Mobile menu toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden glass border-t border-gray-200/20 dark:border-gray-700/20"
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActiveRoute(item.href)
                        ? 'bg-primary-500/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Language Selector */}
                <div className="pt-2 pb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {translations.language || 'Language'}:
                    </span>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`px-2 py-1 text-sm rounded ${
                        language === 'en'
                          ? 'bg-primary-500/20 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      🇬🇧 EN
                    </button>
                    <button
                      onClick={() => changeLanguage('hi')}
                      className={`px-2 py-1 text-sm rounded ${
                        language === 'hi'
                          ? 'bg-primary-500/20 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      🇮🇳 हिंदी
                    </button>
                  </div>
                </div>

                {/* Mobile Authentication */}
                <SignedOut>
                  <div className="pt-2 space-y-2">
                    <SignInButton mode="modal">
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-left px-3 py-2 text-base font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        {translations.signIn || 'Sign In'}
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-left px-3 py-2 text-base font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        {translations.signUp || 'Sign Up'}
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>

                {/* Mobile Contact Info */}
                <div className="pt-2 border-t border-gray-200/20 dark:border-gray-700/20">
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-3 w-3" />
                      <span>{contactInfo.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar
