import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Layout from "components/Layout";
import NotFound from "pages/NotFound";
import MainDashboard from './pages/main-dashboard';
import LoginPage from './pages/login';
import CreateAccountPage from './pages/create-account';
import ModelManagement from './pages/model-management';
import DataUploadInterface from './pages/data-upload-interface';
import InteractiveMapView from './pages/interactive-map-view';
import PredictionInterface from './pages/prediction-interface';
import ProfilePage from './pages/profile';
import Settings from './pages/settings';
import HelpSupport from './pages/help';
import AdminDatabase from './pages/admin-database';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />

        {/* Protected Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/main-dashboard" element={<MainDashboard />} />
          <Route path="/model-management" element={<ModelManagement />} />
          <Route path="/data-upload-interface" element={<DataUploadInterface />} />
          <Route path="/interactive-map-view" element={<InteractiveMapView />} />
          <Route path="/prediction-interface" element={<PredictionInterface />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="/admin-database" element={<AdminDatabase />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
