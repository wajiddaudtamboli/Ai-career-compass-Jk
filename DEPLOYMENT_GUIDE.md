# J&K Career Navigator - Deployment Guide

## 🚀 Live Website
🌐 **Frontend**: [https://jk-career-navigator.vercel.app](https://jk-career-navigator.vercel.app)
🔧 **Backend API**: [https://jk-career-navigator.vercel.app/api](https://jk-career-navigator.vercel.app/api)

## 📋 Environment Variables Required

### Backend Environment Variables:
```env
NODE_ENV=production
PORT=5002
FRONTEND_URL=https://jk-career-navigator.vercel.app
DATABASE_URL=your_neon_database_url_here
MOCK_MODE=false
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Environment Variables:
```env
VITE_BACKEND_URL=https://jk-career-navigator.vercel.app/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
VITE_CONTACT_EMAIL=wajiddaudtamboli123@gmail.com
VITE_CONTACT_PHONE=9667033839
VITE_CONTACT_ADDRESS=N.K. Orchid College of Engineering and Technology, Solapur
```

## 🔧 Deployment Steps

### 1. **Vercel Deployment** (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

### 2. **Alternative: Netlify + Railway**
- **Frontend**: Deploy to Netlify
- **Backend**: Deploy to Railway

### 3. **Alternative: Render**
- Full-stack deployment on Render

## 📱 Features
- ✅ Responsive design for all devices
- ✅ AI-powered career guidance
- ✅ Real-time backend API
- ✅ PostgreSQL database integration
- ✅ Modern React 18 + Vite frontend
- ✅ Node.js + Express backend
