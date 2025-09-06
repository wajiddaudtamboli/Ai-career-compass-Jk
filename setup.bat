@echo off
echo 🚀 Setting up AI Career Compass J&K...
echo ==================================

echo 📋 Checking prerequisites...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

:: Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

:: Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install @clerk/clerk-react axios lucide-react
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

:: Copy environment files
echo ⚙️ Setting up environment files...

if not exist ".\backend\.env" (
    copy ".\backend\.env.example" ".\backend\.env" >nul
    echo ✅ Backend .env file created from example
    echo ⚠️ Please update backend\.env with your actual values:
    echo    - DATABASE_URL (Neon PostgreSQL connection string)
    echo    - CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
    echo    - GEMINI_API_KEY is already set
) else (
    echo ℹ️ Backend .env file already exists
)

cd ..

:: Database setup instructions
echo.
echo 🗄️ Database Setup Instructions:
echo ================================
echo 1. Create a Neon PostgreSQL database at https://neon.tech
echo 2. Copy the connection string to backend\.env as DATABASE_URL
echo 3. Run the schema: psql $DATABASE_URL -f database\schema.sql
echo 4. Load sample data: psql $DATABASE_URL -f database\sample_data.sql

:: Clerk setup instructions
echo.
echo 🔐 Clerk Authentication Setup:
echo ==============================
echo 1. Create a Clerk account at https://clerk.com
echo 2. Create a new application
echo 3. Copy your publishable key to:
echo    - backend\.env as CLERK_PUBLISHABLE_KEY
echo    - frontend\.env as VITE_CLERK_PUBLISHABLE_KEY
echo 4. Copy your secret key to backend\.env as CLERK_SECRET_KEY

echo.
echo 🎉 Setup Complete!
echo ==================
echo Next steps:
echo 1. Update your environment variables as mentioned above
echo 2. Set up your Neon database and run the SQL files
echo 3. Configure Clerk authentication
echo 4. Start the backend: cd backend ^&^& npm run dev
echo 5. Start the frontend: cd frontend ^&^& npm run dev
echo.
echo 📧 Contact: wajiddaudtamboli123@gmail.com
echo 📞 Phone: 9667033839
echo 🏫 Address: N.K. Orchid College of Engineering and Technology, Solapur

pause
