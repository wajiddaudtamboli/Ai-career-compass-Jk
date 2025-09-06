/**
 * Multi-Language Implementation Test Suite
 * Tests all i18n functionality including language switching, persistence, and RTL support
 */

import i18n from '../i18n/config'

// Test configurations
const LANGUAGES = ['en', 'hi', 'ks']
const TEST_KEYS = [
  'common.welcome',
  'navigation.home',
  'homepage.title',
  'features.assessment.title',
  'languageSwitcher.selectLanguage'
]

/**
 * Test 1: Configuration Loading
 */
function testI18nConfiguration() {
  console.log('🧪 Testing i18n Configuration...')
  
  // Check if i18n is initialized
  if (!i18n.isInitialized) {
    console.error('❌ i18n not initialized')
    return false
  }

  // Check supported languages
  const supportedLngs = i18n.options.supportedLngs
  const hasAllLanguages = LANGUAGES.every(lang => supportedLngs.includes(lang))
  
  if (!hasAllLanguages) {
    console.error('❌ Missing supported languages:', supportedLngs)
    return false
  }

  console.log('✅ i18n configuration loaded successfully')
  return true
}

/**
 * Test 2: Translation Key Availability
 */
function testTranslationKeys() {
  console.log('🧪 Testing Translation Keys...')
  
  for (const lang of LANGUAGES) {
    console.log(`  Testing ${lang.toUpperCase()} translations...`)
    
    for (const key of TEST_KEYS) {
      const translation = i18n.getResource(lang, 'translation', key)
      
      if (!translation || translation === key) {
        console.error(`❌ Missing translation for ${key} in ${lang}`)
        return false
      }
    }
  }

  console.log('✅ All translation keys available')
  return true
}

/**
 * Test 3: Language Switching
 */
async function testLanguageSwitching() {
  console.log('🧪 Testing Language Switching...')
  
  const originalLang = i18n.language
  
  for (const lang of LANGUAGES) {
    await i18n.changeLanguage(lang)
    
    if (i18n.language !== lang) {
      console.error(`❌ Failed to switch to ${lang}`)
      return false
    }
    
    // Test translation after switch
    const translation = i18n.t('common.welcome')
    if (!translation || translation === 'common.welcome') {
      console.error(`❌ Translation not working after switch to ${lang}`)
      return false
    }
  }
  
  // Restore original language
  await i18n.changeLanguage(originalLang)
  
  console.log('✅ Language switching works correctly')
  return true
}

/**
 * Test 4: LocalStorage Persistence
 */
function testLocalStoragePersistence() {
  console.log('🧪 Testing LocalStorage Persistence...')
  
  const testLang = 'hi'
  
  // Set language and check localStorage
  i18n.changeLanguage(testLang)
  const storedLang = localStorage.getItem('i18nextLng')
  
  if (storedLang !== testLang) {
    console.error(`❌ Language not persisted. Expected: ${testLang}, Got: ${storedLang}`)
    return false
  }
  
  console.log('✅ LocalStorage persistence working')
  return true
}

/**
 * Test 5: RTL Detection
 */
function testRTLDetection() {
  console.log('🧪 Testing RTL Detection...')
  
  // Test Kashmiri (RTL)
  i18n.changeLanguage('ks')
  if (document.documentElement.dir !== 'rtl') {
    console.error('❌ RTL not applied for Kashmiri')
    return false
  }
  
  // Test English (LTR)
  i18n.changeLanguage('en')
  if (document.documentElement.dir !== 'ltr') {
    console.error('❌ LTR not applied for English')
    return false
  }
  
  console.log('✅ RTL detection working correctly')
  return true
}

/**
 * Test 6: Fallback Behavior
 */
function testFallbackBehavior() {
  console.log('🧪 Testing Fallback Behavior...')
  
  // Test with non-existent key
  const fallback = i18n.t('nonexistent.key')
  if (fallback !== 'nonexistent.key') {
    console.error('❌ Fallback behavior not working for missing keys')
    return false
  }
  
  // Test with partial namespace
  const existingTranslation = i18n.t('common.welcome')
  if (!existingTranslation || existingTranslation === 'common.welcome') {
    console.error('❌ Existing translations not working')
    return false
  }
  
  console.log('✅ Fallback behavior working correctly')
  return true
}

/**
 * Test 7: Performance Check
 */
function testPerformance() {
  console.log('🧪 Testing Performance...')
  
  const iterations = 1000
  const startTime = performance.now()
  
  // Test rapid translation calls
  for (let i = 0; i < iterations; i++) {
    i18n.t('common.welcome')
    i18n.t('navigation.home')
    i18n.t('homepage.title')
  }
  
  const endTime = performance.now()
  const duration = endTime - startTime
  
  console.log(`  ${iterations} translations completed in ${duration.toFixed(2)}ms`)
  
  if (duration > 100) {
    console.warn('⚠️ Translation performance might be slow')
  } else {
    console.log('✅ Translation performance is good')
  }
  
  return true
}

/**
 * Run All Tests
 */
export async function runI18nTests() {
  console.log('🚀 Starting i18n Test Suite...\n')
  
  const tests = [
    testI18nConfiguration,
    testTranslationKeys,
    testLanguageSwitching,
    testLocalStoragePersistence,
    testRTLDetection,
    testFallbackBehavior,
    testPerformance
  ]
  
  let passedTests = 0
  
  for (const test of tests) {
    try {
      const result = await test()
      if (result) passedTests++
    } catch (error) {
      console.error('❌ Test failed with error:', error)
    }
    console.log('')
  }
  
  console.log(`\n📊 Test Results: ${passedTests}/${tests.length} tests passed`)
  
  if (passedTests === tests.length) {
    console.log('🎉 All i18n tests passed! Your multi-language implementation is working correctly.')
  } else {
    console.log('⚠️ Some tests failed. Please check the implementation.')
  }
  
  return passedTests === tests.length
}

// Make test function available globally for browser console
if (typeof window !== 'undefined') {
  window.runI18nTests = runI18nTests
}

export default {
  runI18nTests,
  testI18nConfiguration,
  testTranslationKeys,
  testLanguageSwitching,
  testLocalStoragePersistence,
  testRTLDetection,
  testFallbackBehavior,
  testPerformance
}
