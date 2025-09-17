import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import ClerkProviderWrapper from './components/ClerkProviderWrapper'
import App from './App.jsx'
import './index.css'

// Register service worker for PWA (opt-in via env flag)
if (import.meta.env.VITE_ENABLE_PWA === 'true' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered successfully:', registration)
      })
      .catch((registrationError) => {
        console.log('❌ SW registration failed:', registrationError)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProviderWrapper>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ThemeProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ClerkProviderWrapper>
  </React.StrictMode>
)
