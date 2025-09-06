@echo off
setlocal enabledelayedexpansion

echo.
echo =====================================================
echo J&K Career Navigator - Enhanced Dynamic System Setup
echo =====================================================
echo.

:: Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
    echo [SUCCESS] Node.js is installed: !NODE_VERSION!
)

:: Check if npm is installed
echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm and try again.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%a in ('npm --version') do set NPM_VERSION=%%a
    echo [SUCCESS] npm is installed: !NPM_VERSION!
)

:: Setup backend
echo.
echo [INFO] Setting up backend...
cd backend
if errorlevel 1 (
    echo [ERROR] Backend directory not found!
    pause
    exit /b 1
)

echo [INFO] Installing backend dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
) else (
    echo [SUCCESS] Backend dependencies installed successfully
)

:: Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env >nul
        echo [WARNING] Please update .env file with your actual configuration before proceeding
    ) else (
        echo [WARNING] No .env.example found. You'll need to create .env manually
    )
)

cd ..

:: Setup frontend
echo.
echo [INFO] Setting up frontend...
cd frontend
if errorlevel 1 (
    echo [ERROR] Frontend directory not found!
    pause
    exit /b 1
)

echo [INFO] Installing frontend dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
) else (
    echo [SUCCESS] Frontend dependencies installed successfully
)

cd ..

:: Setup database
echo.
echo [INFO] Setting up enhanced database...
cd backend

echo [INFO] Initializing dynamic schema and sample data...
node db/enhanced-database-manager.js setup
if errorlevel 1 (
    echo [WARNING] Database setup had issues - check your DATABASE_URL in .env
    echo [WARNING] You can run 'npm run db:setup' later to retry
) else (
    echo [SUCCESS] Database setup completed successfully
)

cd ..

:: Create necessary directories
echo.
echo [INFO] Ensuring project structure...
if not exist logs mkdir logs
if not exist uploads mkdir uploads

:: Create .gitignore if it doesn't exist
if not exist .gitignore (
    echo # Dependencies > .gitignore
    echo node_modules/ >> .gitignore
    echo */node_modules/ >> .gitignore
    echo. >> .gitignore
    echo # Environment files >> .gitignore
    echo .env >> .gitignore
    echo .env.local >> .gitignore
    echo .env.development.local >> .gitignore
    echo .env.test.local >> .gitignore
    echo .env.production.local >> .gitignore
    echo. >> .gitignore
    echo # Logs >> .gitignore
    echo logs/ >> .gitignore
    echo *.log >> .gitignore
    echo npm-debug.log* >> .gitignore
    echo. >> .gitignore
    echo # Build outputs >> .gitignore
    echo dist/ >> .gitignore
    echo build/ >> .gitignore
    echo. >> .gitignore
    echo # IDE files >> .gitignore
    echo .vscode/ >> .gitignore
    echo .idea/ >> .gitignore
    echo. >> .gitignore
    echo # OS files >> .gitignore
    echo .DS_Store >> .gitignore
    echo Thumbs.db >> .gitignore
    echo. >> .gitignore
    echo # Uploads >> .gitignore
    echo uploads/ >> .gitignore
    echo [SUCCESS] Created .gitignore file
)

:: Test backend option
echo.
set /p TEST_BACKEND="Do you want to test the backend API? (y/n): "
if /i "!TEST_BACKEND!"=="y" (
    echo [INFO] Testing backend API...
    cd backend
    echo [INFO] Starting backend server for testing...
    start /b npm start
    timeout /t 10 /nobreak >nul
    echo [INFO] Testing health endpoint...
    curl -s http://localhost:5002/health >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Backend health check failed - server might need more time to start
    ) else (
        echo [SUCCESS] Backend health check passed
    )
    taskkill /f /im node.exe >nul 2>&1
    cd ..
)

:: Display final instructions
echo.
echo =====================================================
echo Enhanced J&K Career Navigator Setup Complete!
echo =====================================================
echo.
echo [SUCCESS] Next Steps:
echo.
echo 1. Configure Environment:
echo    • Update backend\.env with your database URL and API keys
echo    • Set CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY for authentication
echo    • Set GEMINI_API_KEY for AI features
echo.
echo 2. Start the Development Servers:
echo    • Backend:  cd backend ^&^& npm start
echo    • Frontend: cd frontend ^&^& npm start
echo.
echo 3. Access the Application:
echo    • Frontend: http://localhost:3000
echo    • Backend API: http://localhost:5002
echo    • API Health: http://localhost:5002/health
echo.
echo 4. Enhanced Features:
echo    • Dynamic Content: http://localhost:5002/api/v1/content-blocks
echo    • Crypto Prices: http://localhost:5002/api/gemini/prices
echo    • Career Data: http://localhost:5002/api/v1/careers
echo.
echo 5. Database Management:
echo    • Setup: npm run db:setup (in backend directory)
echo    • Validate: npm run db:validate
echo    • Health: npm run db:health
echo.
echo [WARNING] Make sure to update your .env file with actual credentials before starting!
echo.
echo Press any key to exit...
pause >nul
