@echo off
echo ================================================
echo    J&K Career Navigator - Database Setup
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Change to backend directory
cd /d "%~dp0\backend"

echo.
echo 🔍 Checking environment configuration...

REM Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found
    echo Creating .env file from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ✅ .env file created
        echo ⚠️ Please edit .env file with your database credentials
        echo.
        echo Required configurations:
        echo   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
        echo   GEMINI_API_KEY=your_gemini_api_key
        echo.
        pause
    ) else (
        echo ❌ .env.example file not found
        pause
        exit /b 1
    )
)

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Running database automation setup...
node db/setup-automation.js setup

if %errorlevel% neq 0 (
    echo.
    echo ❌ Database setup failed
    echo.
    echo Troubleshooting steps:
    echo 1. Check your DATABASE_URL in .env file
    echo 2. Ensure your Neon database is active
    echo 3. Verify your internet connection
    echo 4. Check Neon console for database status
    echo.
    echo Manual setup options:
    echo - Test connection: node db/setup-automation.js health
    echo - Database manager: node db/database-manager.js setup
    echo.
    pause
    exit /b 1
)

echo.
echo 🧪 Testing server startup...
timeout /t 3 /nobreak > nul

REM Start server in background for testing
start /b node server.js > server.log 2>&1

REM Wait for server to start
timeout /t 5 /nobreak > nul

REM Test server health
curl -s http://localhost:5002/health > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server started successfully
    echo 🌐 API available at: http://localhost:5002
    echo 🏥 Health check: http://localhost:5002/health
) else (
    echo ⚠️ Server might not have started properly
    echo Check server.log for details
)

REM Kill background server
taskkill /f /im node.exe > nul 2>&1

echo.
echo 🎉 Database setup completed!
echo.
echo Next steps:
echo 1. Start the backend server: npm run dev
echo 2. Start the frontend: cd ../frontend && npm run dev
echo 3. Open your browser to the frontend URL
echo.
echo Useful commands:
echo - Health check: node db/setup-automation.js health
echo - Create backup: node db/setup-automation.js backup
echo - Database stats: node db/database-manager.js stats
echo - Reset database: node db/database-manager.js reset
echo.
pause
