import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [isRTL, setIsRTL] = useState(false)

  const changeLanguage = (lang) => {
    setLanguage(lang)
    setIsRTL(false) // Only English and Hindi are supported, both are LTR
    localStorage.setItem('preferred-language', lang)
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language')
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLanguage(savedLang)
    }
  }, [])

  const translations = {
    en: {
      // App
      appName: 'AI Career Compass J&K',
      
      // Navigation
      home: 'Home',
      careers: 'Careers',
      colleges: 'Colleges', 
      quiz: 'Career Quiz',
      dashboard: 'Dashboard',
      
      // Authentication
      signIn: 'Sign In',
      signUp: 'Sign Up',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      welcome: 'Welcome',
      
      // Common
      search: 'Search',
      filter: 'Filter',
      category: 'Category',
      location: 'Location',
      language: 'Language',
      loading: 'Loading...',
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      exploreNow: 'Explore Now',
      
      // Home Page
      heroTitle: 'Navigate Your Future in Jammu & Kashmir',
      heroSubtitle: 'Discover career opportunities, explore educational institutions, and chart your path to success in the beautiful region of J&K.',
      
      // Career Section
      careerOpportunities: 'Career Opportunities',
      exploreCareerPaths: 'Explore Career Paths',
      careerDescription: 'Discover diverse career opportunities across various sectors in Jammu & Kashmir.',
      
      // College Section
      topColleges: 'Top Colleges',
      findBestInstitutions: 'Find Best Institutions',
      collegeDescription: 'Explore top educational institutions offering quality education in J&K.',
      
      // Quiz Section
      careerAssessment: 'Career Assessment',
      takeQuiz: 'Take Quiz',
      quizDescription: 'Take our comprehensive quiz to discover careers that match your interests and skills.',
      
      // Features
      features: 'Features',
      personalizedGuidance: 'Personalized Guidance',
      comprehensiveDatabase: 'Comprehensive Database',
      expertSupport: 'Expert Support',
      
      // Contact
      contactUs: 'Contact Us',
      getInTouch: 'Get in Touch',
      contactDescription: 'Have questions? We\'re here to help you navigate your career journey.',
      
      // Footer
      aboutUs: 'About Us',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      helpCenter: 'Help Center',
      
      // Testimonials
      whatPeopleSay: 'What People Say',
      testimonials: 'Testimonials',
      
      // AI Chat
      aiAssistant: 'AI Career Assistant',
      askQuestion: 'Ask a question...',
      getAIGuidance: 'Get AI Guidance',
      
      // Miscellaneous
      allRightsReserved: 'All rights reserved',
      madeWithLove: 'Made with ❤️ for J&K students',
      poweredBy: 'Powered by',
    },
    hi: {
      // App
      appName: 'जे&के करियर नेवीगेटर',
      
      // Navigation
      home: 'होम',
      careers: 'करियर',
      colleges: 'कॉलेज',
      quiz: 'करियर क्विज़',
      dashboard: 'डैशबोर्ड',
      
      // Authentication
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      login: 'लॉगिन',
      register: 'रजिस्टर',
      logout: 'लॉगआउट',
      welcome: 'स्वागत',
      
      // Common
      search: 'खोजें',
      filter: 'फिल्टर',
      category: 'श्रेणी',
      location: 'स्थान',
      language: 'भाषा',
      loading: 'लोड हो रहा है...',
      learnMore: 'और जानें',
      getStarted: 'शुरू करें',
      exploreNow: 'अभी एक्सप्लोर करें',
      
      // Home Page
      heroTitle: 'जम्मू और कश्मीर में अपने भविष्य को नेवीगेट करें',
      heroSubtitle: 'करियर के अवसरों की खोज करें, शैक्षणिक संस्थानों का अन्वेषण करें, और जे&के के सुंदर क्षेत्र में सफलता का अपना रास्ता तय करें।',
      
      // Career Section
      careerOpportunities: 'करियर अवसर',
      exploreCareerPaths: 'करियर पथ एक्सप्लोर करें',
      careerDescription: 'जम्मू और कश्मीर में विभिन्न क्षेत्रों में विविध करियर अवसरों की खोज करें।',
      
      // College Section
      topColleges: 'शीर्ष कॉलेज',
      findBestInstitutions: 'सर्वोत्तम संस्थान खोजें',
      collegeDescription: 'जे&के में गुणवत्तापूर्ण शिक्षा प्रदान करने वाले शीर्ष शैक्षणिक संस्थानों का अन्वेषण करें।',
      
      // Quiz Section
      careerAssessment: 'करियर मूल्यांकन',
      takeQuiz: 'क्विज़ लें',
      quizDescription: 'अपनी रुचियों और कौशल से मेल खाने वाले करियर की खोज के लिए हमारा व्यापक क्विज़ लें।',
      
      // Features
      features: 'विशेषताएं',
      personalizedGuidance: 'व्यक्तिगत मार्गदर्शन',
      comprehensiveDatabase: 'व्यापक डेटाबेस',
      expertSupport: 'विशेषज्ञ सहायता',
      
      // Contact
      contactUs: 'संपर्क करें',
      getInTouch: 'संपर्क में रहें',
      contactDescription: 'क्या कोई सवाल हैं? हम आपके करियर की यात्रा में मार्गदर्शन करने के लिए यहाँ हैं।',
      
      // Footer
      aboutUs: 'हमारे बारे में',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा की शर्तें',
      helpCenter: 'सहायता केंद्र',
      
      // Testimonials
      whatPeopleSay: 'लोग क्या कहते हैं',
      testimonials: 'प्रशंसापत्र',
      
      // AI Chat
      aiAssistant: 'AI करियर सहायक',
      askQuestion: 'एक सवाल पूछें...',
      getAIGuidance: 'AI मार्गदर्शन प्राप्त करें',
      
      // Miscellaneous
      allRightsReserved: 'सभी अधिकार सुरक्षित',
      madeWithLove: 'जे&के छात्रों के लिए ❤️ के साथ बनाया गया',
      poweredBy: 'द्वारा संचालित',
    }
  }

  const value = {
    language,
    isRTL,
    changeLanguage,
    translations: translations[language]
  }

  return (
    <LanguageContext.Provider value={value}>
      <div className={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}
