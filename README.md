<<<<<<< HEAD
# Crime-predict-Pro-2
My Crime data analysis pro / Crime predict pro web application
=======
# Crime Analytics Platform

A comprehensive crime data analysis and prediction platform built with modern web technologies.

## Overview

The Crime Analytics Platform provides law enforcement agencies and security professionals with tools to analyze crime patterns, visualize data geographically, and make predictions using machine learning models.

## Features

- **Interactive Map View** - Visualize crime data geographically
- **Data Upload Interface** - Import and manage crime datasets
- **Prediction Interface** - Generate crime forecasts using ML models
- **Model Management** - Train and evaluate prediction models
- **Dashboard Analytics** - View key metrics and trends

## Prerequisites

- Node.js (v16.x or higher)
- npm or yarn

## Installation

### For Windows Users:
1. Run the `setup.bat` file to install all dependencies
2. Run the `start.bat` file to launch the application

### Manual Installation:
1. Install dependencies:
   ```bash
   npm install
   ```
   
2. Start the development server:
   ```bash
   npm start
   ```

## Project Files and Structure

### Root Directory Files

- **package.json** - Project dependencies and npm scripts
- **vite.config.mjs** - Vite bundler configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration for CSS processing
- **jsconfig.json** - JavaScript configuration for editor tooling
- **index.html** - Main HTML entry point
- **.env** - Environment variables
- **.gitignore** - Git ignore rules
- **setup.bat** - Windows setup script
- **start.bat** - Windows startup script
- **PROJECT_STRUCTURE.md** - Detailed project structure documentation

### Source Directory (src)

- **index.jsx** - Application entry point
- **App.jsx** - Main application component
- **Routes.jsx** - Application routing configuration

#### Components Directory

- **AppIcon.jsx** - Application icon components
- **AppImage.jsx** - Image component with optimizations
- **ErrorBoundary.jsx** - Error handling for React components
- **ScrollToTop.jsx** - Utility for scrolling to top on navigation
- **ui/** - UI component library (buttons, inputs, modals, etc.)

#### Pages Directory

- **login/** - User authentication interface
- **main-dashboard/** - Main application dashboard
- **interactive-map-view/** - Geographic visualization of crime data
- **data-upload-interface/** - Interface for uploading crime data
- **prediction-interface/** - Crime prediction interface
- **model-management/** - ML model management interface
- **NotFound.jsx** - 404 page

#### Styles Directory

- **index.css** - Global CSS styles
- **tailwind.css** - Tailwind CSS imports and configurations

#### Utils Directory

- **cn.js** - Class name utility for conditional styling

## Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Data Visualization**: D3.js, Recharts
- **Form Management**: React Hook Form
- **UI Components**: Custom components with Radix UI primitives
- **Animation**: Framer Motion

## Development

### Adding New Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import MainDashboard from "pages/main-dashboard";
import InteractiveMapView from "pages/interactive-map-view";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/main-dashboard", element: <MainDashboard /> },
    { path: "/interactive-map", element: <InteractiveMapView /> },
    // Add more routes as needed
  ]);

  return element;
};
```

### Styling Components

This project uses Tailwind CSS for styling with several plugins:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## Deployment

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.



- Powered by React and Vite
- Styled with Tailwind CSS

>>>>>>> 57f085a (Crime_predict1)
