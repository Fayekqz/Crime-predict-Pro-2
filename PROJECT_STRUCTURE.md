# Crime Analytics Project Structure

This document provides an overview of the project structure and explains the purpose of key files and directories.

## Root Directory Files

- `.env` - Environment variables for the application
- `.gitignore` - Specifies files to be ignored by Git
- `README.md` - Project overview and documentation
- `index.html` - Main HTML entry point for the application
- `jsconfig.json` - JavaScript configuration for editor tooling
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Exact dependency versions
- `postcss.config.js` - PostCSS configuration for CSS processing
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.mjs` - Vite bundler configuration

## Public Directory

Contains static assets served directly:

- `_redirects` - Configuration for redirects (useful for deployment)
- `manifest.json` - Web app manifest for PWA functionality
- `robots.txt` - Instructions for web crawlers

## Source Directory (src)

The main application code:

### Core Files

- `App.jsx` - Main application component
- `Routes.jsx` - Application routing configuration
- `index.jsx` - Application entry point

### Components

Reusable UI components:

- `AppIcon.jsx` - Icon component for the application
- `AppImage.jsx` - Image component with optimizations
- `ErrorBoundary.jsx` - Error handling for React components
- `ScrollToTop.jsx` - Utility for scrolling to top on navigation
- `ui/` - UI component library (buttons, inputs, etc.)

### Pages

Application pages organized by feature:

- `NotFound.jsx` - 404 page
- `data-upload-interface/` - Interface for uploading crime data
- `interactive-map-view/` - Geographic visualization of crime data
- `login/` - User authentication
- `main-dashboard/` - Main application dashboard
- `model-management/` - ML model management interface
- `prediction-interface/` - Crime prediction interface

### Styles

- `index.css` - Global CSS styles
- `tailwind.css` - Tailwind CSS imports and configurations

### Utils

Utility functions:

- `cn.js` - Class name utility for conditional styling

## Technology Stack

- **Frontend Framework**: React
- **Routing**: React Router
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Data Visualization**: D3.js, Recharts
- **Form Handling**: React Hook Form
- **UI Components**: Custom components with Radix UI primitives
- **Animation**: Framer Motion