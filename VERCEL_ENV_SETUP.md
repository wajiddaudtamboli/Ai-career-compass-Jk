# 🔧 VERCEL ENVIRONMENT VARIABLES SETUP

## 🌐 Your Live Website: https://ai-career-compass-jk.vercel.app

To make your website fully functional, add these environment variables in your Vercel dashboard:

### **📍 How to Add Environment Variables:**
1. Go to https://vercel.com/dashboard
2. Click on your project "ai-career-compass-jk"
3. Go to Settings → Environment Variables
4. Add each variable below

---

## 🔑 **REQUIRED ENVIRONMENT VARIABLES:**

### **Backend Variables:**
```env
NODE_ENV=production
FRONTEND_URL=https://ai-career-compass-jk.vercel.app
DATABASE_URL=mock_database_for_development
MOCK_MODE=true
JWT_SECRET=jk-career-navigator-super-secure-jwt-secret-key-2025-production
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=AIzaSyALm_JHvyrOTpIiDZJawtEMLmM3V0EKKMM
ALLOWED_ORIGINS=https://ai-career-compass-jk.vercel.app
```

### **Frontend Variables:**
```env
VITE_BACKEND_URL=https://ai-career-compass-jk.vercel.app/api
VITE_CONTACT_EMAIL=wajiddaudtamboli123@gmail.com
VITE_CONTACT_PHONE=9667033839
VITE_CONTACT_ADDRESS=N.K. Orchid College of Engineering and Technology, Solapur
```

---

## ⚡ **AFTER ADDING VARIABLES:**

1. **Redeploy**: Go to Deployments tab → Click "Redeploy" on latest deployment
2. **Or**: Push any small change to GitHub (auto-redeploys)

---

## 🧪 **TEST YOUR WEBSITE:**

### **Frontend Tests:**
- ✅ Visit: https://ai-career-compass-jk.vercel.app
- ✅ Check responsive design on mobile
- ✅ Test navigation between pages

### **Backend API Tests:**
- ✅ Visit: https://ai-career-compass-jk.vercel.app/api
- ✅ Test: https://ai-career-compass-jk.vercel.app/api/health
- ✅ Test: https://ai-career-compass-jk.vercel.app/api/careers

---

## 🎯 **FEATURES THAT WILL WORK:**

- ✅ **Responsive Career Guidance Platform**
- ✅ **AI-Powered Recommendations** (with Gemini API)
- ✅ **Interactive Dashboard**
- ✅ **Mobile-Optimized Design**
- ✅ **Real-time API Responses**
- ✅ **Career Pathways Exploration**

---

**🚀 Your J&K Career Navigator is LIVE and ready to help students!**
