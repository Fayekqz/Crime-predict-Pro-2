#!/bin/bash

echo "==================================================="
echo "Crime Analytics Project - Setup Script for macOS"
echo "==================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed! Please install Node.js from https://nodejs.org/"
    echo "Recommended version: Node.js 16.x or higher"
    echo "You can also use Homebrew: brew install node"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed! Please reinstall Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js is installed. Version:"
node --version
echo ""
echo "npm is installed. Version:"
npm --version
echo ""

echo "Installing project dependencies..."
echo "This may take a few minutes..."
npm install

if [ $? -ne 0 ]; then
    echo "Error installing dependencies! Please check your internet connection and try again."
    exit 1
fi

echo ""
echo "==================================================="
echo "Setup completed successfully!"
echo ""
echo "To start the application, run the start.sh file:"
echo "chmod +x start.sh"
echo "./start.sh"
echo "==================================================="
echo ""