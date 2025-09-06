import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [isRTL, setIsRTL] = useState(false)

  const changeLanguage = (lang) => {
    setLanguage(lang)
    setIsRTL(lang === 'ur')
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr'
  }

  const translations = {
    en: {
      // Navigation
      home: 'Home',
      quiz: 'Assessment',
      colleges: 'Colleges',
      careers: 'Careers',
      dashboard: 'Dashboard',
      
      // Home Page
      welcome: 'Welcome to AI Career Compass J&K',
      subtitle: 'Your Gateway to Educational Excellence and Career Success in Jammu & Kashmir',
      startJourney: 'Start Your Journey',
      exploreColleges: 'Explore Colleges',
      
      // Features
      personalizedAssessment: 'Personalized Assessment',
      assessmentDesc: 'Comprehensive aptitude test to discover your strengths and interests',
      collegeDirectory: 'College Directory',
      directoryDesc: 'Explore 500+ colleges across J&K with detailed information',
      careerPathways: 'Career Pathways',
      pathwaysDesc: 'Discover diverse career options with step-by-step guidance',
      smartRecommendations: 'Smart Recommendations',
      recommendationsDesc: 'AI-powered suggestions based on your profile and preferences',
      progressTracking: 'Progress Tracking',
      trackingDesc: 'Monitor your journey with detailed analytics and milestones',
      scholarshipFinder: 'Scholarship Finder',
      scholarshipDesc: 'Access hundreds of scholarship opportunities for J&K students',
      
      // Common
      search: 'Search',
      filter: 'Filter',
      apply: 'Apply',
      learnMore: 'Learn More',
      viewDetails: 'View Details',
      save: 'Save',
      share: 'Share',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      cancel: 'Cancel',
      
      // Stats
      studentsGuided: 'Students Guided',
      partnerColleges: 'Partner Colleges',
      careerPaths: 'Career Paths',
      successRate: 'Success Rate'
    },
    hi: {
      // Navigation
      home: 'होम',
      quiz: 'मूल्यांकन',
      colleges: 'कॉलेज',
      careers: 'करियर',
      dashboard: 'डैशबोर्ड',
      
      // Home Page
      welcome: 'जे&के करियर नेवीगेटर में आपका स्वागत है',
      subtitle: 'जम्मू और कश्मीर में शैक्षिक उत्कृष्टता और करियर सफलता का प्रवेश द्वार',
      startJourney: 'अपनी यात्रा शुरू करें',
      exploreColleges: 'कॉलेजों का अन्वेषण करें',
      
      // Features
      personalizedAssessment: 'व्यक्तिगत मूल्यांकन',
      assessmentDesc: 'आपकी शक्तियों और रुचियों की खोज के लिए व्यापक योग्यता परीक्षा',
      collegeDirectory: 'कॉलेज निर्देशिका',
      directoryDesc: 'विस्तृत जानकारी के साथ जे&के में 500+ कॉलेजों का अन्वेषण करें',
      careerPathways: 'करियर पथ',
      pathwaysDesc: 'चरणबद्ध मार्गदर्शन के साथ विविध करियर विकल्पों की खोज करें',
      smartRecommendations: 'स्मार्ट सिफारिशें',
      recommendationsDesc: 'आपकी प्रोफ़ाइल और प्राथमिकताओं के आधार पर AI-संचालित सुझाव',
      progressTracking: 'प्रगति ट्रैकिंग',
      trackingDesc: 'विस्तृत विश्लेषण और मील के पत्थर के साथ अपनी यात्रा की निगरानी करें',
      scholarshipFinder: 'छात्रवृत्ति खोजक',
      scholarshipDesc: 'जे&के छात्रों के लिए सैकड़ों छात्रवृत्ति अवसरों तक पहुंच',
      
      // Common
      search: 'खोजें',
      filter: 'फिल्टर',
      apply: 'आवेदन करें',
      learnMore: 'और जानें',
      viewDetails: 'विवरण देखें',
      save: 'सहेजें',
      share: 'साझा करें',
      back: 'वापस',
      next: 'अगला',
      submit: 'जमा करें',
      cancel: 'रद्द करें',
      
      // Stats
      studentsGuided: 'मार्गदर्शित छात्र',
      partnerColleges: 'भागीदार कॉलेज',
      careerPaths: 'करियर पथ',
      successRate: 'सफलता दर'
    },
    ur: {
      // Navigation
      home: 'ہوم',
      quiz: 'تشخیص',
      colleges: 'کالجز',
      careers: 'کیریئر',
      dashboard: 'ڈیش بورڈ',
      
      // Home Page
      welcome: 'جے اینڈ کے کیریئر نیویگیٹر میں خوش آمدید',
      subtitle: 'جموں و کشمیر میں تعلیمی بہترین اور کیریئر کی کامیابی کا دروازہ',
      startJourney: 'اپنا سفر شروع کریں',
      exploreColleges: 'کالجز دریافت کریں',
      
      // Features
      personalizedAssessment: 'ذاتی تشخیص',
      assessmentDesc: 'آپ کی صلاحیات اور دلچسپیوں کی دریافت کے لیے جامع قابلیت کا ٹیسٹ',
      collegeDirectory: 'کالج ڈائرکٹری',
      directoryDesc: 'تفصیلی معلومات کے ساتھ جے اینڈ کے میں 500+ کالجز کی تلاش کریں',
      careerPathways: 'کیریئر کے راستے',
      pathwaysDesc: 'قدم بہ قدم رہنمائی کے ساتھ متنوع کیریئر کے اختیارات دریافت کریں',
      smartRecommendations: 'ذہین تجاویز',
      recommendationsDesc: 'آپ کی پروفائل اور ترجیحات کی بنیاد پر AI کی تجاویز',
      progressTracking: 'پیش قدمی کا جائزہ',
      trackingDesc: 'تفصیلی تجزیات اور سنگ میل کے ساتھ اپنے سفر کی نگرانی کریں',
      scholarshipFinder: 'اسکالرشپ تلاش کنندہ',
      scholarshipDesc: 'جے اینڈ کے طلباء کے لیے سیکڑوں اسکالرشپ کے مواقع تک رسائی',
      
      // Common
      search: 'تلاش کریں',
      filter: 'فلٹر',
      apply: 'درخواست دیں',
      learnMore: 'مزید جانیں',
      viewDetails: 'تفصیلات دیکھیں',
      save: 'محفوظ کریں',
      share: 'شیئر کریں',
      back: 'واپس',
      next: 'اگلا',
      submit: 'جمع کریں',
      cancel: 'منسوخ کریں',
      
      // Stats
      studentsGuided: 'رہنمائی شدہ طلباء',
      partnerColleges: 'پارٹنر کالجز',
      careerPaths: 'کیریئر کے راستے',
      successRate: 'کامیابی کی شرح'
    }
  }

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      isRTL,
      t,
      availableLanguages: [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
        { code: 'ur', name: 'اردو', flag: '🇵🇰' }
      ]
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider
