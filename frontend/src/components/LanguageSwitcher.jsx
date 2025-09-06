import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = [
    { 
      code: 'en', 
      name: t('languageSwitcher.english', 'English'), 
      flag: '🇺🇸',
      nativeName: 'English'
    },
    { 
      code: 'hi', 
      name: t('languageSwitcher.hindi', 'Hindi'), 
      flag: '🇮🇳',
      nativeName: 'हिंदी'
    },
    { 
      code: 'ks', 
      name: t('languageSwitcher.kashmiri', 'Kashmiri'), 
      flag: '🏔️',
      nativeName: 'کٲشُر'
    }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  // Set initial RTL on component mount
  useEffect(() => {
    // RTL handling is now done in i18n config
  }, [i18n.language])

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium 
                   navbar-text hover:bg-gray-100 dark:hover:bg-gray-700 
                   transition-all duration-300 border border-gray-200 dark:border-gray-600"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={t('languageSwitcher.selectLanguage', 'Select Language')}
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs"
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-600 
                       rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {languages.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-sm
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200
                           ${i18n.language === language.code 
                             ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                             : 'navbar-text'
                           }`}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.1 }}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-adaptive-muted">{language.name}</span>
                </div>
                {i18n.language === language.code && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-primary-600 dark:text-primary-400"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher
