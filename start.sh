#!/bin/bash

echo "==================================================="
echo "Crime Analytics Project - Startup Script for macOS"
echo "==================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed! Please run setup.sh first."
    exit 1
fi

echo "Starting the Crime Analytics application..."
echo ""
echo "The application will open in your default browser automatically."
echo "Press Ctrl+C to stop the server when you're done."
echo ""

# Start the development server
npm start

if [ $? -ne 0 ]; then
    echo "Error starting the application! Please run setup.sh first or check for errors."
    exit 1
fi