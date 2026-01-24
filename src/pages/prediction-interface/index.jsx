import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ModelConfigurationPanel from './components/ModelConfigurationPanel';
import TrainingMonitor from './components/TrainingMonitor';
import ResultsVisualization from './components/ResultsVisualization';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PredictionInterface = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState(null);
  const [hasResults, setHasResults] = useState(false);
  const [activeTab, setActiveTab] = useState('configuration');

  // Simulate training completion
  useEffect(() => {
    if (isTraining && trainingConfig) {
      const timer = setTimeout(() => {
        setIsTraining(false);
        setHasResults(true);
        setActiveTab('results');
        
        // Show completion notification
        console.log('Training completed successfully!');
      }, 30000); // 30 seconds for demo

      return () => clearTimeout(timer);
    }
  }, [isTraining, trainingConfig]);

  const handleStartTraining = (config) => {
    setTrainingConfig(config);
    setIsTraining(true);
    setActiveTab('monitor');
    console.log('Starting training with config:', config);
  };

  const handleStopTraining = () => {
    setIsTraining(false);
    setTrainingConfig(null);
    console.log('Training stopped by user');
  };

  const tabItems = [
    {
      id: 'configuration',
      label: 'Configuration',
      icon: 'Settings',
      count: null
    },
    {
      id: 'monitor',
      label: 'Monitor',
      icon: 'Activity',
      count: isTraining ? 'Active' : null
    },
    {
      id: 'results',
      label: 'Results',
      icon: 'BarChart3',
      count: hasResults ? 'Ready' : null
    },
    {
      id: 'actions',
      label: 'Actions',
      icon: 'Zap',
      count: null
    }
  ];

  return (
    <>
      <Helmet>
        <title>Prediction Interface - CrimePredictPro</title>
        <meta name="description" content="LSTM model training interface for crime prediction with real-time monitoring and results visualization" />
      </Helmet>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Prediction Interface</h1>
                  <p className="text-muted-foreground mt-2">
                    Configure, train, and analyze LSTM models for crime prediction with real-time monitoring
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {isTraining && (
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-success">Training Active</span>
                    </div>
                  )}
                  {hasResults && (
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full">
                      <Icon name="CheckCircle" size={12} color="var(--color-primary)" />
                      <span className="text-xs font-medium text-primary">Results Available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${trainingConfig ? 'bg-success' : 'bg-muted'}`}></div>
                  <span className="text-sm text-muted-foreground">Configuration</span>
                </div>
                <div className="w-8 h-px bg-border"></div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isTraining ? 'bg-warning animate-pulse' : trainingConfig ? 'bg-success' : 'bg-muted'}`}></div>
                  <span className="text-sm text-muted-foreground">Training</span>
                </div>
                <div className="w-8 h-px bg-border"></div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${hasResults ? 'bg-success' : 'bg-muted'}`}></div>
                  <span className="text-sm text-muted-foreground">Results</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-border">
                <nav className="flex space-x-8">
                  {tabItems?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab?.id
                          ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                      }`}
                    >
                      <Icon 
                        name={tab?.icon} 
                        size={16} 
                        color={activeTab === tab?.id ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                      />
                      <span>{tab?.label}</span>
                      {tab?.count && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tab?.count === 'Active' ? 'bg-warning/10 text-warning' :
                          tab?.count === 'Ready'? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                        }`}>
                          {tab?.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                {activeTab === 'configuration' && (
                  <ModelConfigurationPanel
                    onStartTraining={handleStartTraining}
                    isTraining={isTraining}
                  />
                )}

                {activeTab === 'monitor' && (
                  <TrainingMonitor
                    isTraining={isTraining}
                    trainingConfig={trainingConfig}
                    onStopTraining={handleStopTraining}
                  />
                )}

                {activeTab === 'results' && (
                  <ResultsVisualization
                    hasResults={hasResults}
                    trainingConfig={trainingConfig}
                  />
                )}

                {activeTab === 'actions' && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Zap" size={24} color="var(--color-primary)" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Quick Actions</h3>
                      <p className="text-muted-foreground mb-6">
                        Access additional tools and export options from the sidebar panel.
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Icon name="Navigation" size={16} />
                          <span>Quick navigation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Download" size={16} />
                          <span>Export tools</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="HelpCircle" size={16} />
                          <span>Help resources</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Panel */}
              <div className="xl:col-span-1">
                <QuickActions
                  hasResults={hasResults}
                  isTraining={isTraining}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-sm text-muted-foreground">
                    {trainingConfig?.dataset || 'No dataset selected'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-sm text-muted-foreground">
                    Last updated: {new Date()?.toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" iconName="RefreshCw" iconPosition="left">
                  Refresh
                </Button>
                <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
                  Settings
                </Button>
              </div>
            </div>
          </div>
    </>
  );
};

export default PredictionInterface;