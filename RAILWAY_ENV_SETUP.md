# 🔧 Railway Environment Variables Setup

## 🚨 **REQUIRED Environment Variables**

Add these in your Railway dashboard under **Project → Settings → Variables**:

### **Core Variables:**
```env
NODE_ENV=production
PORT=8080
GEMINI_API_KEY=your_google_gemini_api_key_here
JWT_SECRET=your_super_secure_jwt_secret_key
```

### **Optional Variables (Recommended):**
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
JWT_EXPIRY=7d
```

## 🔑 **How to Get Required Keys:**

### **1. Google Gemini API Key:**
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key and add as `GEMINI_API_KEY`

### **2. JWT Secret:**
Generate a secure random string (32+ characters):
```bash
# Example secure JWT secret:
JWT_SECRET=mySecureJWT2025!@#RandomString456$%^ForProduction
```

## 🗄️ **Database Setup (Optional):**

### **Add PostgreSQL Service in Railway:**
1. In Railway dashboard, click "Add Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provide `DATABASE_URL`
4. No additional configuration needed!

## ✅ **Current Status Fix:**

Your project is running but needs these environment variables to enable full functionality:

- **Gemini AI**: Add `GEMINI_API_KEY` to enable AI features
- **Database**: Add PostgreSQL service to enable real database
- **JWT**: Add `JWT_SECRET` for secure authentication

## 🚀 **Quick Setup Steps:**

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Select Your Project**: "jk-career-navigator" or similar
3. **Click Settings → Variables**
4. **Add the required variables above**
5. **Add PostgreSQL service** (optional but recommended)
6. **Redeploy** - Railway will automatically redeploy with new variables

## 📊 **Expected Results After Setup:**

```
✅ Google Gemini AI initialized
✅ PostgreSQL Database: Connected
✅ Server started successfully!
📡 Server running on port 8080
🔐 Auth endpoints: /auth/* (JWT Authentication)
🤖 AI features: Fully enabled
```

## 🔧 **Environment Variables Template:**

Copy this to Railway Variables section:

```env
NODE_ENV=production
PORT=8080
GEMINI_API_KEY=AIzaSyA...your_actual_key_here
JWT_SECRET=mySecureRandomString123!@#Production2025
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
JWT_EXPIRY=7d
```

## 🆘 **Need Help?**

- **Railway Docs**: https://docs.railway.app/reference/variables
- **Gemini API**: https://ai.google.dev/docs
- **Project Support**: Check GitHub issues or documentation