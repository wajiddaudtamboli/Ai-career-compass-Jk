import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export { LanguageContext }
export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en') // Default to English
  const [isRTL, setIsRTL] = useState(false)

  const changeLanguage = (lang) => {
    setLanguage(lang)
    // Set RTL for languages that require it
    const rtlLanguages = ['ur', 'ks'] // Urdu and Kashmiri
    setIsRTL(rtlLanguages.includes(lang))
  }

  const translations = {
    en: {
      welcome: 'Welcome to AI Career Compass J&K',
      career: 'Career',
      colleges: 'Colleges',
      quiz: 'Aptitude Test'
    },
    hi: {
      welcome: 'जे&के करियर नेवीगेटर में आपका स्वागत है',
      career: 'करियर',
      colleges: 'कॉलेज',
      quiz: 'योग्यता परीक्षा'
    },
    ks: {
      welcome: 'جے اینڈ کے کیریئر نیویگیٹر میں خوش آمدید',
      career: 'کیریئر',
      colleges: 'کالجز',
      quiz: 'اہلیت ٹیسٹ'
    },
    ur: {
      welcome: 'جے اینڈ کے کیریئر نیویگیٹر میں خوش آمدید',
      career: 'کیریئر',
      colleges: 'کالجز',
      quiz: 'اہلیت ٹیسٹ'
    },
    pa: {
      welcome: 'ਜੇ ਐਂਡ ਕੇ ਕੈਰੀਅਰ ਨੈਵੀਗੇਟਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ',
      career: 'ਕੈਰੀਅਰ',
      colleges: 'ਕਾਲਜ',
      quiz: 'ਯੋਗਤਾ ਟੈਸਟ'
    },
    mr: {
      welcome: 'जे आणि के करिअर नेव्हिगेटरमध्ये आपले स्वागत आहे',
      career: 'करिअर',
      colleges: 'कॉलेज',
      quiz: 'योग्यता चाचणी'
    }
  }

  const t = (key) => translations[language]?.[key] || key

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: changeLanguage, 
      isRTL, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}
