# 🚀 Vercel Deployment Guide - AI Career Compass J&K

## ⚠️ MANDATORY Environment Variables for Vercel

Before deploying to Vercel, you **MUST** configure these environment variables in your Vercel project settings.

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `Ai-career-compass-Jk`
4. Select **"Import"**

### Step 2: Configure Environment Variables (MANDATORY)

In Vercel Project Settings → **Environment Variables**, add these:

---

### 🔴 REQUIRED Variables (App will NOT work without these)

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_BACKEND_URL` | `https://your-backend-url.vercel.app` | Your backend API URL |
| `VITE_APP_NAME` | `AI Career Compass J&K` | Application name |
| `VITE_APP_VERSION` | `2.0.0` | App version |

---

### 🟡 RECOMMENDED Variables

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_CONTACT_EMAIL` | `wajiddaudtamboli123@gmail.com` | Contact email |
| `VITE_CONTACT_PHONE` | `9667033839` | Contact phone |
| `VITE_CONTACT_ADDRESS` | `N.K. Orchid College...` | Contact address |
| `VITE_ENABLE_PWA` | `false` | Enable Progressive Web App |

---

## 📸 How to Add Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in left sidebar
4. For each variable:
   - Enter **Name** (e.g., `VITE_BACKEND_URL`)
   - Enter **Value** (e.g., `https://your-api.vercel.app`)
   - Select environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

![Vercel Environment Variables](https://vercel.com/docs/_next/image?url=%2Fdocs%2F_next%2Fstatic%2Fmedia%2Fenvironment-variables.0b9fdec4.png&w=3840&q=75)

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add VITE_BACKEND_URL
vercel env add VITE_APP_NAME
vercel env add VITE_APP_VERSION

# Deploy
vercel --prod
```

---

## 🔧 Complete Environment Variable Configuration

Copy and paste these values in Vercel:

```
VITE_BACKEND_URL=https://your-backend-api.vercel.app
VITE_APP_VERSION=2.0.0
VITE_APP_NAME=AI Career Compass J&K
VITE_CONTACT_EMAIL=wajiddaudtamboli123@gmail.com
VITE_CONTACT_PHONE=9667033839
VITE_CONTACT_ADDRESS=N.K. Orchid College of Engineering and Technology, Solapur
VITE_ENABLE_PWA=false
```

---

## ⚠️ Important Notes

### For Frontend (This Project)
- All environment variables **MUST** start with `VITE_` to be accessible in the browser
- Variables are embedded at **build time**, not runtime
- After changing variables, you must **redeploy** the project

### For Backend (If hosting separately)
If you deploy the backend as a separate Vercel project, add these variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `PORT` | `5001` | Server port |
| `NODE_ENV` | `production` | Environment |
| `MOCK_MODE` | `true` | Use mock database |
| `GEMINI_API_KEY` | `your-api-key` | Google Gemini AI key |
| `JWT_SECRET` | `your-secret-key` | JWT authentication secret |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Frontend URL for CORS |

---

## 🚀 Quick Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wajiddaudtamboli/Ai-career-compass-Jk&env=VITE_BACKEND_URL,VITE_APP_NAME,VITE_APP_VERSION&envDescription=Required%20environment%20variables%20for%20AI%20Career%20Compass&envLink=https://github.com/wajiddaudtamboli/Ai-career-compass-Jk/blob/main/VERCEL_DEPLOYMENT.md)

---

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] GitHub repository is connected to Vercel
- [ ] `VITE_BACKEND_URL` is set correctly
- [ ] `VITE_APP_NAME` is set
- [ ] `VITE_APP_VERSION` is set
- [ ] Build command is: `cd frontend && npm install && npm run build`
- [ ] Output directory is: `frontend/dist`

---

## 🔍 Troubleshooting

### Build Fails
- Check if all `VITE_*` variables are set in Vercel
- Ensure build command is correct in vercel.json

### API Calls Not Working
- Verify `VITE_BACKEND_URL` points to correct backend
- Check browser console for CORS errors
- Ensure backend has correct `FRONTEND_URL` for CORS

### Blank Page After Deploy
- Check browser console for errors
- Verify all routes are configured in vercel.json

---

## 📞 Support

- **Email**: wajiddaudtamboli123@gmail.com
- **Phone**: 9667033839
- **GitHub Issues**: [Report a problem](https://github.com/wajiddaudtamboli/Ai-career-compass-Jk/issues)

---

**Last Updated**: December 12, 2025
