@echo off
echo ============================================
echo    J&K Career Navigator - Quick Setup
echo ============================================
echo.

echo [1/4] Installing root dependencies...
call npm install

echo.
echo [2/4] Installing frontend dependencies...
cd frontend
call npm install

echo.
echo [3/4] Installing backend dependencies...
cd ..\backend
call npm install

echo.
echo [4/4] Building frontend for production...
cd ..\frontend
call npm run build

echo.
echo ============================================
echo    Setup Complete! Ready for deployment
echo ============================================
echo.
echo To start development servers:
echo   Frontend: cd frontend && npm run dev
echo   Backend:  cd backend && npm start
echo.
echo To deploy to Vercel:
echo   1. Visit https://vercel.com
echo   2. Import your GitHub repository
echo   3. Configure build settings as per guide
echo.
pause
