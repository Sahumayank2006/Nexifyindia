@echo off
REM Stop all Campus Memory servers

echo Stopping Campus Memory servers...

REM Find and kill Python processes running backend_server.py
for /f "tokens=2" %%a in ('tasklist ^| findstr /i "python.exe"') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Find and kill Node.js processes
for /f "tokens=2" %%a in ('tasklist ^| findstr /i "node.exe"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All servers stopped.
echo.
pause
