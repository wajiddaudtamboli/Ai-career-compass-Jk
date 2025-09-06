import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import enTranslations from './translations/en.json'
import hiTranslations from './translations/hi.json'
import ksTranslations from './translations/ks.json'

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  ks: {
    translation: ksTranslations
  }
}

// Language detection helper
const detectLanguage = () => {
  // Check localStorage first
  const storedLang = localStorage.getItem('i18nextLng')
  if (storedLang && ['en', 'hi', 'ks'].includes(storedLang)) {
    return storedLang
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0]
  if (['en', 'hi', 'ks'].includes(browserLang)) {
    return browserLang
  }
  
  // Default to English
  return 'en'
}

i18n
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // Not needed for react as it escapes by default
    },

    // Language resources
    lng: detectLanguage(), // Use our custom detection
  })

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng)
  
  // Set RTL for Kashmiri
  if (lng === 'ks') {
    document.documentElement.setAttribute('dir', 'rtl')
    document.documentElement.classList.add('rtl')
  } else {
    document.documentElement.setAttribute('dir', 'ltr')
    document.documentElement.classList.remove('rtl')
  }
})

// Set initial direction
const initialLang = detectLanguage()
if (initialLang === 'ks') {
  document.documentElement.setAttribute('dir', 'rtl')
  document.documentElement.classList.add('rtl')
} else {
  document.documentElement.setAttribute('dir', 'ltr')
  document.documentElement.classList.remove('rtl')
}

export default i18n