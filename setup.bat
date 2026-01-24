@echo off
echo ===================================================
echo Crime Analytics Project - Setup Script for Windows
echo ===================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed! Please install Node.js from https://nodejs.org/
    echo Recommended version: Node.js 16.x or higher
    pause
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed! Please reinstall Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed. Version:
node --version
echo.
echo npm is installed. Version:
npm --version
echo.

echo Installing project dependencies...
echo This may take a few minutes...
call npm install

if %ERRORLEVEL% neq 0 (
    echo Error installing dependencies! Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo ===================================================
echo Setup completed successfully!
echo.
echo To start the application, run the start.bat file
echo ===================================================
echo.
pause