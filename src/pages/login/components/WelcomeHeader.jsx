import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  return (
    <div className="text-center space-y-6 mb-8">
      {/* Logo and Brand */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <Icon name="Shield" size={32} color="white" />
        </div>
      </div>
      {/* Welcome Text */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to CrimePredictPro
        </h1>
        <p className="text-lg text-muted-foreground">
          Advanced Crime Analytics & Prediction Platform
        </p>
      </div>
      {/* Platform Description */}
      <div className="bg-card border border-border rounded-lg p-6 text-left">
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Target" size={20} className="mr-2 text-primary" />
          Platform Overview
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          A comprehensive research platform designed for academic institutions, law enforcement agencies, and policy makers to analyze crime patterns, predict trends, and make data-driven decisions for public safety.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="BarChart3" size={16} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Analytics</p>
              <p className="text-xs text-muted-foreground">Interactive dashboards</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="TrendingUp" size={16} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Predictions</p>
              <p className="text-xs text-muted-foreground">LSTM forecasting</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Map" size={16} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Mapping</p>
              <p className="text-xs text-muted-foreground">Geospatial analysis</p>
            </div>
          </div>
        </div>
      </div>
      {/* Current Status */}
      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-muted-foreground">Platform Online</span>
        </div>
        <div className="w-1 h-4 bg-border"></div>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={14} color="var(--color-muted-foreground)" />
          <span className="text-muted-foreground">
            {new Date()?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;