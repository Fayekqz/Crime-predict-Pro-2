@echo off
echo ===================================================
echo Crime Analytics Project - Startup Script
echo ===================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed! Please run setup.bat first.
    pause
    exit /b 1
)

echo Starting the Crime Analytics application...
echo.
echo The application will open in your default browser automatically.
echo Press Ctrl+C to stop the server when you're done.
echo.

:: Start the development server
call npm start

if %ERRORLEVEL% neq 0 (
    echo Error starting the application! Please run setup.bat first or check for errors.
    pause
    exit /b 1
)

pause