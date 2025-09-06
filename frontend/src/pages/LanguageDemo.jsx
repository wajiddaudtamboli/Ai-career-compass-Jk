import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { runI18nTests } from '../tests/i18n.test'

const LanguageDemo = () => {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ks'
  const [testResults, setTestResults] = useState(null)
  const [isRunningTests, setIsRunningTests] = useState(false)

  const runTests = async () => {
    setIsRunningTests(true)
    setTestResults(null)
    
    try {
      const results = await runI18nTests()
      setTestResults(results)
    } catch (error) {
      setTestResults(false)
      console.error('Test execution failed:', error)
    } finally {
      setIsRunningTests(false)
    }
  }

  const demoContent = [
    { key: 'common.welcome', label: 'Welcome Message' },
    { key: 'homepage.title', label: 'Main Title' },
    { key: 'homepage.subtitle', label: 'Subtitle' },
    { key: 'navigation.home', label: 'Home Navigation' },
    { key: 'navigation.colleges', label: 'Colleges Navigation' },
    { key: 'navigation.careers', label: 'Careers Navigation' },
    { key: 'features.assessment.title', label: 'Assessment Feature' },
    { key: 'features.colleges.title', label: 'Colleges Feature' },
  ]

  return (
    <div className={`min-h-screen pt-20 pb-10 px-4 ${isRTL ? 'rtl' : ''}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Multi-Language Switcher Demo
          </h1>
          <p className="text-xl text-adaptive-secondary mb-6">
            Test the language switching functionality with live translations
          </p>
          
          {/* Language Switcher */}
          <div className="flex justify-center mb-8">
            <LanguageSwitcher className="scale-110" />
          </div>
          
          {/* Current Language Info */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 inline-block">
            <span className="text-primary-700 dark:text-primary-300 font-medium">
              Current Language: {i18n.language.toUpperCase()} 
              {isRTL && <span className="ml-2">(RTL Mode Active)</span>}
            </span>
          </div>
        </motion.div>

        {/* Demo Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {demoContent.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="mb-3">
                <span className="text-sm text-adaptive-muted font-medium">
                  {item.label}
                </span>
              </div>
              <div className={`text-lg font-semibold text-adaptive ${isRTL ? 'text-right' : 'text-left'}`}>
                {t(item.key)}
              </div>
              <div className="mt-2 text-xs text-adaptive-muted font-mono">
                Key: {item.key}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-adaptive mb-6 text-center">
            {t('features.assessment.title')} - Live Demo
          </h2>
          
          <div className="glass-strong p-8 rounded-xl">
            <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="text-xl font-semibold text-adaptive">
                {t('features.assessment.title')}
              </h3>
              <p className="text-adaptive-secondary">
                {t('features.assessment.description')}
              </p>
              
              <div className="flex gap-4 mt-6">
                <button className="btn-primary">
                  {t('homepage.getStarted')}
                </button>
                <button className="btn-secondary">
                  {t('homepage.learnMore')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Language Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-adaptive mb-6 text-center">
            Language Features
          </h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">🇺🇸</div>
              <h3 className="font-semibold text-adaptive mb-2">English</h3>
              <p className="text-sm text-adaptive-muted">
                Default language with full feature support
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">🇮🇳</div>
              <h3 className="font-semibold text-adaptive mb-2">हिंदी</h3>
              <p className="text-sm text-adaptive-muted">
                Devanagari script with proper font rendering
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">🏔️</div>
              <h3 className="font-semibold text-adaptive mb-2">کٲشُر</h3>
              <p className="text-sm text-adaptive-muted">
                RTL support with Nastaliq typography
              </p>
            </div>
          </div>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 card p-6"
        >
          <h3 className="text-lg font-semibold text-adaptive mb-4">
            Technical Implementation
          </h3>
          <ul className="space-y-2 text-adaptive-secondary mb-6">
            <li>✅ i18next integration with React</li>
            <li>✅ localStorage persistence</li>
            <li>✅ RTL support for Kashmiri</li>
            <li>✅ Instant language switching</li>
            <li>✅ Fallback to English</li>
            <li>✅ Animated transitions</li>
            <li>✅ Responsive design</li>
          </ul>
          
          <div className="border-t pt-6">
            <h4 className="font-semibold text-adaptive mb-3">Test Suite</h4>
            <p className="text-sm text-adaptive-muted mb-4">
              Run comprehensive tests to verify all i18n functionality
            </p>
            
            <button
              onClick={runTests}
              disabled={isRunningTests}
              className={`btn-primary mr-4 ${isRunningTests ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRunningTests ? 'Running Tests...' : 'Run I18n Tests'}
            </button>
            
            {testResults !== null && (
              <div className={`mt-4 p-4 rounded-lg ${
                testResults 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex items-center">
                  <span className="text-xl mr-2">
                    {testResults ? '✅' : '❌'}
                  </span>
                  <span className="font-medium">
                    {testResults 
                      ? 'All tests passed! Check console for details.' 
                      : 'Some tests failed. Check console for details.'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LanguageDemo
