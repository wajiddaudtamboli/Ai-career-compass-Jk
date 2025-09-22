# 🚀 Railway Deployment Guide for J&K Career Navigator
**Team AIspire Navigators**

This guide will help you deploy the J&K Career Navigator application to Railway platform.

## 🛠️ Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: https://github.com/wajiddaudtamboli/Ai-career-compass-Jk.git
3. **Environment Variables**: Prepare your environment variables

## 📋 Environment Variables Setup

Add these environment variables in Railway dashboard:

### Required Variables:
```env
NODE_ENV=production
PORT=5002
GEMINI_API_KEY=your-google-gemini-api-key
JWT_SECRET=your-super-secure-jwt-secret-key
```

### Database Variables (Railway PostgreSQL):
Railway will automatically provide `DATABASE_URL` when you add PostgreSQL service.

### Optional Variables:
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

## 🚂 Deployment Steps

### Step 1: Connect Repository
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose the `Ai-career-compass-Jk` repository from wajiddaudtamboli
5. Select the `main` branch for deployment

### Step 2: Add PostgreSQL Database
1. In your project dashboard, click "Add Service"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provide `DATABASE_URL`

### Step 3: Configure Environment Variables
1. Go to your service settings
2. Click "Variables" tab
3. Add the environment variables listed above

### Step 4: Deploy
1. Railway will automatically start deployment
2. The build process will:
   - Install dependencies
   - Build the frontend
   - Start the backend server
3. Your app will be available at: `https://your-app-name.railway.app`

## 🔧 Build Process

Railway will execute:
```bash
# Install root dependencies
npm install

# Install frontend dependencies and build
cd frontend && npm install && npm run build

# Install backend dependencies
cd ../backend && npm install

# Start the application
cd backend && npm start
```

## 🌐 Domain Configuration

### Custom Domain (Optional):
1. Go to your service settings
2. Click "Settings" tab
3. Add your custom domain
4. Update DNS records as instructed

## 🔍 Health Checks

- Health endpoint: `https://your-app.railway.app/health`
- API endpoint: `https://your-app.railway.app/api/v1/health`

## 📊 Monitoring

Railway provides:
- Automatic deployments on git push
- Build and runtime logs
- Performance metrics
- Resource usage monitoring

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check environment variables
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

2. **App Won't Start**:
   - Verify PORT environment variable
   - Check server logs
   - Ensure database connection is working

3. **Database Issues**:
   - Verify DATABASE_URL is set
   - Check PostgreSQL service status
   - Review database connection logs

### Support Commands:
```bash
# View logs
railway logs

# Run locally with Railway environment
railway run npm start

# Deploy manually
railway up
```

## 🔄 Updates and Maintenance

- **Automatic Deployments**: Push to main branch triggers deployment
- **Manual Deployment**: Use Railway CLI or dashboard
- **Environment Updates**: Modify variables in Railway dashboard
- **Database Management**: Use Railway dashboard or connect with your preferred tool

## 📝 Notes

- Frontend is served as static files in production
- All API routes are prefixed with `/api`
- Authentication uses JWT tokens
- Database runs in mock mode if PostgreSQL is unavailable
- CORS is configured for Railway domains

## 🎯 Next Steps After Deployment

1. Test all endpoints
2. Verify database connectivity
3. Test authentication flow
4. Configure monitoring alerts
5. Set up backup strategies
6. Update frontend API URLs if needed

---

**Happy Deploying! 🚀**

For support, check Railway documentation or open an issue in the repository.