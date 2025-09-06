# 🔐 Complete Environment Variables Guide - J&K Career Navigator

## 📋 **Required API Keys & Environment Variables**

### 🔑 **1. Clerk Authentication (Optional - Currently using Mock)**
- **Get API Keys**: https://clerk.com
- **Setup**: Create account → Create application → Get keys from dashboard

### 🤖 **2. Google Gemini AI (Required for AI features)**
- **Get API Key**: https://makersuite.google.com/app/apikey
- **Setup**: Create Google account → Access AI Studio → Generate API key

---

## 📂 **Backend Environment Variables**

### **File: `backend/.env`** (for development)
```env
# Environment Configuration
NODE_ENV=development
PORT=5002

# Google Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key_here

# Clerk Authentication (Optional - Currently using Mock)
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Database Configuration (Mock mode for current setup)
DATABASE_URL=mock_database
DB_HOST=localhost
DB_USER=career_nav_user
DB_PASSWORD=your_secure_password
DB_NAME=jk_career_navigator
DB_PORT=3306
USE_MOCK_DB=true
MOCK_DATA_ENABLED=true

# API Configuration
FRONTEND_URL=http://localhost:3001
API_BASE_URL=http://localhost:5002

# Security Configuration
JWT_SECRET=your_jwt_secret_here_min_32_characters
CORS_ORIGIN=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_REAL_TIME_UPDATES=true
ENABLE_ANALYTICS=false
```

### **File: `backend/.env.production`** (for deployment)
```env
# Environment Configuration
NODE_ENV=production
PORT=5002

# Google Gemini AI Configuration
GEMINI_API_KEY=AIzaSyALm_JHvyrOTpIiDZJawtEMLmM3V0EKKMM
GOOGLE_GEMINI_API_KEY=AIzaSyALm_JHvyrOTpIiDZJawtEMLmM3V0EKKMM

# Clerk Authentication (Optional)
CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key_here

# Database Configuration
USE_MOCK_DB=true
MOCK_DATA_ENABLED=true

# API Configuration
API_BASE_URL=https://your-app-name.vercel.app/api
FRONTEND_URL=https://your-app-name.vercel.app

# Security Configuration
JWT_SECRET=your_production_jwt_secret_min_32_characters
CORS_ORIGIN=https://your-app-name.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🎨 **Frontend Environment Variables**

### **File: `frontend/.env`** (for development)
```env
# Environment Configuration
VITE_NODE_ENV=development
VITE_APP_NAME=J&K Career Navigator
VITE_APP_VERSION=2.0.0

# Backend API Configuration
VITE_BACKEND_URL=http://localhost:5002
VITE_API_BASE_URL=http://localhost:5002/api

# Clerk Authentication (Optional)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# Contact Information
VITE_CONTACT_EMAIL=wajiddaudtamboli123@gmail.com
VITE_CONTACT_PHONE=9667033839
VITE_CONTACT_ADDRESS=N.K. Orchid College of Engineering and Technology, Solapur

# Feature Flags
VITE_USE_MOCK_AUTH=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_NOTIFICATIONS=true

# API Endpoints
VITE_AI_SERVICE_URL=http://localhost:5002/api/ai
VITE_CAREERS_API_URL=http://localhost:5002/api/careers
VITE_COLLEGES_API_URL=http://localhost:5002/api/colleges
```

### **File: `frontend/.env.production`** (for deployment)
```env
# Environment Configuration
VITE_NODE_ENV=production
VITE_APP_NAME=J&K Career Navigator
VITE_APP_VERSION=2.0.0

# Backend API Configuration
VITE_BACKEND_URL=https://your-app-name.vercel.app
VITE_API_BASE_URL=https://your-app-name.vercel.app/api

# Clerk Authentication (Optional)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_publishable_key_here

# Contact Information
VITE_CONTACT_EMAIL=wajiddaudtamboli123@gmail.com
VITE_CONTACT_PHONE=9667033839
VITE_CONTACT_ADDRESS=N.K. Orchid College of Engineering and Technology, Solapur

# Feature Flags
VITE_USE_MOCK_AUTH=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_NOTIFICATIONS=true

# API Endpoints
VITE_AI_SERVICE_URL=https://your-app-name.vercel.app/api/ai
VITE_CAREERS_API_URL=https://your-app-name.vercel.app/api/careers
VITE_COLLEGES_API_URL=https://your-app-name.vercel.app/api/colleges
```

---

## 🌐 **Vercel Environment Variables** (for deployment dashboard)

### **Add these in Vercel Project Settings → Environment Variables:**

```
# Required for Production
NODE_ENV = production
VITE_NODE_ENV = production

# Google Gemini AI (REQUIRED)
GEMINI_API_KEY = your_actual_gemini_api_key_here
GOOGLE_GEMINI_API_KEY = your_actual_gemini_api_key_here

# Clerk Authentication (OPTIONAL)
CLERK_PUBLISHABLE_KEY = pk_live_your_clerk_publishable_key_here
CLERK_SECRET_KEY = sk_live_your_clerk_secret_key_here
VITE_CLERK_PUBLISHABLE_KEY = pk_live_your_clerk_publishable_key_here

# Database & Features
USE_MOCK_DB = true
MOCK_DATA_ENABLED = true
VITE_USE_MOCK_AUTH = true

# API Configuration (will be auto-set by Vercel)
VITE_API_BASE_URL = https://your-deployed-app.vercel.app/api
VITE_BACKEND_URL = https://your-deployed-app.vercel.app

# Feature Flags
VITE_ENABLE_ANALYTICS = true
VITE_ENABLE_CHATBOT = true
VITE_ENABLE_NOTIFICATIONS = true

# Security
JWT_SECRET = your_production_jwt_secret_32_chars_minimum
```

---

## 🔗 **How to Get API Keys**

### **1. Google Gemini AI Key** (Essential for AI features)
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. Add to environment variables as `GEMINI_API_KEY`

### **2. Clerk Authentication Keys** (Optional - currently using mock)
1. Go to: https://clerk.com
2. Create account and new application
3. Go to "API Keys" in dashboard
4. Copy:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
5. Add to environment variables

---

## 🚀 **Quick Setup Commands**

### **Create Environment Files:**
```bash
# Backend development
copy "backend\.env.production" "backend\.env"

# Frontend development  
copy "frontend\.env.production" "frontend\.env"

# Edit the files and add your actual API keys
```

### **Update with Your Keys:**
1. Replace `your_actual_gemini_api_key_here` with your Gemini key
2. Replace `your_clerk_publishable_key_here` with your Clerk key (optional)
3. Replace `your-app-name.vercel.app` with your actual Vercel URL

---

## ⚠️ **Important Security Notes**

### **✅ DO:**
- Keep `.env` files in `.gitignore` (already configured)
- Use different keys for development and production
- Use `VITE_` prefix for frontend environment variables
- Store sensitive keys in Vercel dashboard, not in code

### **❌ DON'T:**
- Commit actual API keys to GitHub
- Share secret keys publicly
- Use test keys in production
- Store backend keys in frontend

---

## 📊 **Current Project Status**

### **✅ Working Without API Keys:**
- Mock authentication system
- Static career data
- Responsive design
- Navigation and UI

### **🔑 Enhanced with API Keys:**
- Real AI-powered career recommendations
- Dynamic content generation
- User authentication and profiles
- Personalized suggestions

---

## 🎯 **Deployment Checklist**

### **Before Deploying to Vercel:**
- [ ] Get Google Gemini API key
- [ ] Add environment variables to Vercel dashboard
- [ ] Test locally with real API keys
- [ ] Verify all features work
- [ ] Deploy to production

**Your project works perfectly without API keys using mock data, but adding them will unlock the full AI-powered experience!** 🤖✨
