@echo off
REM Quick Start Script for Campus Memory + ML Integration
REM This script sets up and runs the entire system

echo ================================================================================
echo   Campus Memory + ML Integration - Quick Start
echo ================================================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking Python dependencies...
if not exist ".venv-3" (
    echo Creating virtual environment...
    python -m venv .venv-3
)

echo Activating virtual environment...
call .venv-3\Scripts\activate.bat

echo Installing Python packages...
pip install -r requirements.txt --quiet

echo.
echo [2/4] Checking Next.js dependencies...
cd CampusMemory\CampusMemory

if not exist "node_modules" (
    echo Installing Node.js packages... (this may take 3-5 minutes)
    call npm install
) else (
    echo Node.js packages already installed.
)

cd ..\..

echo.
echo [3/4] Starting Backend Server (API on port 8001)...
start "Campus Memory Backend" cmd /k "call .venv-3\Scripts\activate.bat && python event_api_server.py"

echo Waiting for backend to initialize (AI models loading)...
timeout /t 10 /nobreak >nul

echo.
echo [4/4] Starting Frontend Server...
start "Campus Memory Frontend" cmd /k "cd CampusMemory\CampusMemory && npm run dev"

echo.
echo ================================================================================
echo   Setup Complete! Servers Starting...
echo ================================================================================
echo.
echo   WAIT 30-60 SECONDS for backend AI models to load!
echo.
echo   Access Your Application:
echo   ^> http://localhost:3000
echo.
echo   Backend API (once loaded):
echo   ^> http://localhost:8001
echo   ^> http://localhost:8001/docs (API Documentation)
echo.
echo   Two new terminal windows have opened:
echo   1. Backend Server (Python FastAPI on port 8001)
echo      - Wait for "Uvicorn running on http://0.0.0.0:8001"
echo   2. Frontend Server (Next.js on port 3000)
echo      - Ready when you see "Local: http://localhost:3000"
echo.
echo   Press Ctrl+C in each terminal window to stop the servers
echo ================================================================================
echo.

pause
