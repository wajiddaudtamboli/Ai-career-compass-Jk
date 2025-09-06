import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext';
import aiService from '../services/aiService';

const MultiLanguageTranslationUI = () => {
  const { language, setLanguage, t, isRTL } = useContext(LanguageContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [translationMode, setTranslationMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translationLoading, setTranslationLoading] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳',
      rtl: false,
      color: 'from-orange-500 to-orange-600'
    },
    {
      code: 'ks',
      name: 'Kashmiri',
      nativeName: 'کٲشُر',
      flag: '🏔️',
      rtl: true,
      color: 'from-green-500 to-green-600'
    },
    {
      code: 'ur',
      name: 'Urdu',
      nativeName: 'اردو',
      flag: '🌙',
      rtl: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      code: 'pa',
      name: 'Punjabi',
      nativeName: 'ਪੰਜਾਬੀ',
      flag: '🎵',
      rtl: false,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      code: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      flag: '🏛️',
      rtl: false,
      color: 'from-red-500 to-red-600'
    }
  ];

  useEffect(() => {
    checkVoiceSupport();
    loadTranslationHistory();
    detectAvailableLanguages();
  }, []);

  useEffect(() => {
    // Listen for text selection on the page
    const handleTextSelection = () => {
      const selection = window.getSelection().toString().trim();
      if (selection && selection.length > 0 && translationMode) {
        setSelectedText(selection);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, [translationMode]);

  const checkVoiceSupport = () => {
    setVoiceEnabled('speechSynthesis' in window);
  };

  const loadTranslationHistory = () => {
    const history = localStorage.getItem('translationHistory');
    if (history) {
      setTranslationHistory(JSON.parse(history));
    }
  };

  const detectAvailableLanguages = async () => {
    try {
      const supported = await aiService.getSupportedLanguages();
      setAvailableLanguages(supported);
    } catch (error) {
      console.error('Failed to detect available languages:', error);
      setAvailableLanguages(languages.map(lang => lang.code));
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      setShowLanguageModal(false);
      
      // Track language change
      aiService.addInteraction({
        type: 'language_changed',
        data: { from: language, to: newLanguage }
      });

      // Show success message
      showNotification(`Language changed to ${languages.find(l => l.code === newLanguage)?.name}`, 'success');
    } catch (error) {
      console.error('Failed to change language:', error);
      showNotification('Failed to change language', 'error');
    }
  };

  const translateSelectedText = async (targetLanguage = null) => {
    if (!selectedText.trim()) return;

    setTranslationLoading(true);
    const target = targetLanguage || language;

    try {
      const result = await aiService.translateText(selectedText, target);
      setTranslatedText(result.translatedText);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        originalText: selectedText,
        translatedText: result.translatedText,
        fromLanguage: result.detectedLanguage || 'auto',
        toLanguage: target,
        timestamp: new Date().toISOString()
      };
      
      const newHistory = [historyItem, ...translationHistory.slice(0, 19)]; // Keep last 20
      setTranslationHistory(newHistory);
      localStorage.setItem('translationHistory', JSON.stringify(newHistory));
      
      // Track translation
      aiService.addInteraction({
        type: 'text_translated',
        data: { 
          fromLanguage: result.detectedLanguage, 
          toLanguage: target, 
          textLength: selectedText.length 
        }
      });
    } catch (error) {
      console.error('Translation failed:', error);
      showNotification('Translation failed. Please try again.', 'error');
    } finally {
      setTranslationLoading(false);
    }
  };

  const speakText = (text, languageCode) => {
    if (!voiceEnabled) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getVoiceLanguageCode(languageCode);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Text-to-speech failed:', error);
    }
  };

  const getVoiceLanguageCode = (code) => {
    const voiceCodes = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ks': 'ur-PK', // Fallback to Urdu for Kashmiri
      'ur': 'ur-PK',
      'pa': 'pa-IN',
      'mr': 'mr-IN'
    };
    return voiceCodes[code] || 'en-US';
  };

  const showNotification = (message, type = 'info') => {
    // This would integrate with a notification system
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const clearTranslationHistory = () => {
    setTranslationHistory([]);
    localStorage.removeItem('translationHistory');
    showNotification('Translation history cleared', 'success');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard', 'success');
    } catch (error) {
      console.error('Failed to copy:', error);
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  const currentLanguageData = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      {/* Language Switcher Button */}
      <div className="flex items-center space-x-2">
        <motion.button
          onClick={() => setShowLanguageModal(true)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">{currentLanguageData?.flag}</span>
          <span className="text-sm font-medium text-adaptive">{currentLanguageData?.nativeName}</span>
          <svg className="w-4 h-4 text-adaptive-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        {/* Translation Mode Toggle */}
        <motion.button
          onClick={() => setTranslationMode(!translationMode)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            translationMode
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-adaptive-muted hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-sm">🔄 Translate Mode</span>
        </motion.button>
      </div>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLanguageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-adaptive">Choose Language</h3>
                <button
                  onClick={() => setShowLanguageModal(false)}
                  className="text-adaptive-muted hover:text-adaptive"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      language === lang.code
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="font-medium text-adaptive">{lang.nativeName}</div>
                        <div className="text-sm text-adaptive-muted">{lang.name}</div>
                      </div>
                    </div>
                    {language === lang.code && (
                      <div className="text-primary-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-adaptive-muted text-center">
                  AI Career Compass J&K supports all major regional languages
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Translation Panel */}
      <AnimatePresence>
        {translationMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm w-full z-40"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-adaptive">AI Translator</h4>
              <button
                onClick={() => setTranslationMode(false)}
                className="text-adaptive-muted hover:text-adaptive"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedText && (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-adaptive-muted mb-1">Selected Text:</div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-2 text-sm text-adaptive">
                    {selectedText}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {languages.filter(lang => lang.code !== language).slice(0, 3).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => translateSelectedText(lang.code)}
                      disabled={translationLoading}
                      className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        translationLoading 
                          ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                          : `bg-gradient-to-r ${lang.color} text-white hover:opacity-90`
                      }`}
                    >
                      {lang.flag} {lang.nativeName}
                    </button>
                  ))}
                </div>

                {translationLoading && (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                    <span className="ml-2 text-xs text-adaptive-muted">Translating...</span>
                  </div>
                )}

                {translatedText && (
                  <div className="space-y-2">
                    <div className="text-xs text-adaptive-muted">Translation:</div>
                    <div className="bg-primary-50 dark:bg-primary-900/30 rounded p-2 text-sm text-adaptive">
                      {translatedText}
                    </div>
                    <div className="flex space-x-2">
                      {voiceEnabled && (
                        <button
                          onClick={() => speakText(translatedText, language)}
                          className="text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded"
                        >
                          🔊 Speak
                        </button>
                      )}
                      <button
                        onClick={() => copyToClipboard(translatedText)}
                        className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!selectedText && (
              <div className="text-center py-4">
                <div className="text-adaptive-muted mb-2">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v10a1 1 0 01-1 1H8a1 1 0 01-1-1V4m0 0H6a1 1 0 00-1 1v10a1 1 0 001 1h2m10-6h3m-3 0l2-2m-2 2l2 2" />
                  </svg>
                </div>
                <p className="text-xs text-adaptive-muted">
                  Select any text on the page to translate it instantly
                </p>
              </div>
            )}

            {translationHistory.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-adaptive-muted">Recent Translations</span>
                  <button
                    onClick={clearTranslationHistory}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {translationHistory.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="text-xs bg-gray-50 dark:bg-gray-700 rounded p-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setSelectedText(item.originalText);
                        setTranslatedText(item.translatedText);
                      }}
                    >
                      <div className="truncate text-adaptive">{item.originalText}</div>
                      <div className="truncate text-adaptive-muted">→ {item.translatedText}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RTL Direction Indicator */}
      {isRTL && (
        <div className="fixed top-4 left-4 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs z-30">
          RTL Mode Active
        </div>
      )}
    </div>
  );
};

export default MultiLanguageTranslationUI;
