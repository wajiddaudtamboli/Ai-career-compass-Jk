import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import App from './App.jsx'
import './index.css'

// Environment variable validation for Vercel deployment
const validateEnvVariables = () => {
  const requiredVars = [
    'VITE_BACKEND_URL',
    'VITE_APP_NAME',
    'VITE_APP_VERSION'
  ];
  
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0 && import.meta.env.PROD) {
    console.error('⚠️ Missing required environment variables:', missingVars);
    console.error('Please configure these in Vercel Project Settings → Environment Variables');
    console.error('See VERCEL_DEPLOYMENT.md for details');
  }
  
  return missingVars;
};

// Validate environment variables
const missingEnvVars = validateEnvVariables();

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

// Environment Warning Component
const EnvWarning = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '12px 20px',
    textAlign: 'center',
    zIndex: 9999,
    fontFamily: 'system-ui, sans-serif',
    fontSize: '14px'
  }}>
    ⚠️ <strong>Missing Environment Variables:</strong> {missingEnvVars.join(', ')} 
    — Configure in Vercel Project Settings → Environment Variables
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ThemeProvider>
        <LanguageProvider>
          {import.meta.env.PROD && missingEnvVars.length > 0 && <EnvWarning />}
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
