@echo off
REM Ultra-Quick Start - No checks, just launch!

echo ========================================
echo  STARTING CAMPUS MEMORY SERVERS
echo ========================================
echo.

cd /d "C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main"

echo Starting Backend Server...
start "Backend API" cmd /k "call .venv-3\Scripts\activate.bat && python event_api_server.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd CampusMemory\CampusMemory && npm run dev"

echo.
echo ========================================
echo  SERVERS STARTING!
echo ========================================
echo.
echo  Wait 30-60 seconds for backend to load AI models
echo  Then open: http://localhost:3000
echo.
echo  Backend API: http://localhost:8001
echo  API Docs: http://localhost:8001/docs
echo ========================================
echo.
