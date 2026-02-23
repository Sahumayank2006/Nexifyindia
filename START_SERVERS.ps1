# Campus Memory - Quick Start Script
# This script starts both backend and frontend servers automatically

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 CAMPUS MEMORY - STARTING SERVERS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$rootDir = "C:\Users\Asus\Downloads\campus-memory-main\campus-memory-main"
$venvPath = "$rootDir\.venv-3\Scripts\Activate.ps1"
$frontendDir = "$rootDir\CampusMemory\CampusMemory"

# Check if virtual environment exists
if (-not (Test-Path $venvPath)) {
    Write-Host "❌ Virtual environment not found at: $venvPath" -ForegroundColor Red
    Write-Host "Please run setup first or check the path.`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Starting Backend API Server (Port 8001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; & '$venvPath'; python event_api_server.py"

Write-Host "⏳ Waiting 3 seconds before starting frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "✅ Starting Frontend Server (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ SERVERS STARTING!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n⏳ WAIT 30-60 SECONDS for backend AI models to load!`n" -ForegroundColor Yellow
Write-Host "🌐 Access Your Application:" -ForegroundColor Cyan
Write-Host "   👉 http://localhost:3000`n" -ForegroundColor White
Write-Host "📡 Backend API (once loaded):" -ForegroundColor Cyan
Write-Host "   • http://localhost:8001" -ForegroundColor White
Write-Host "   • http://localhost:8001/docs (API Docs)`n" -ForegroundColor White
Write-Host "📝 Two PowerShell windows opened:" -ForegroundColor Cyan
Write-Host "   1. Backend - Wait for 'Uvicorn running on http://0.0.0.0:8001'" -ForegroundColor White
Write-Host "   2. Frontend - Ready when you see 'Local: http://localhost:3000'`n" -ForegroundColor White
Write-Host "Press Ctrl+C in each window to stop servers" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan
