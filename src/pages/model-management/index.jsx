import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ExperimentTable from './components/ExperimentTable';
import ModelRegistry from './components/ModelRegistry';
import DeploymentMonitor from './components/DeploymentMonitor';
import ExperimentComparison from './components/ExperimentComparison';

const ModelManagement = () => {
  const [activeTab, setActiveTab] = useState('experiments');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedExperiments, setSelectedExperiments] = useState([]);

  // Mock data for experiments
  const mockExperiments = [
    {
      id: 'exp_001',
      name: 'LSTM Crime Predictor v2.1',
      description: 'Advanced LSTM model with attention mechanism for crime prediction',
      date: '2025-10-01',
      time: '14:30',
      timestamp: new Date('2025-10-01T14:30:00'),
      status: 'completed',
      mae: 0.1245,
      rmse: 0.2156,
      mape: 8.34,
      r2: 0.8567,
      trainingTime: '2h 15m',
      parameters: [
        { key: 'learning_rate', value: '0.001' },
        { key: 'batch_size', value: '32' },
        { key: 'epochs', value: '100' },
        { key: 'hidden_units', value: '128' },
        { key: 'dropout', value: '0.2' }
      ]
    },
    {
      id: 'exp_002',
      name: 'Random Forest Baseline',
      description: 'Baseline model using Random Forest for comparison',
      date: '2025-09-30',
      time: '09:15',
      timestamp: new Date('2025-09-30T09:15:00'),
      status: 'completed',
      mae: 0.1567,
      rmse: 0.2489,
      mape: 10.12,
      r2: 0.7834,
      trainingTime: '45m',
      parameters: [
        { key: 'n_estimators', value: '100' },
        { key: 'max_depth', value: '10' },
        { key: 'min_samples_split', value: '2' }
      ]
    },
    {
      id: 'exp_003',
      name: 'LSTM with Hyperparameter Tuning',
      description: 'Optimized LSTM model with automated hyperparameter tuning',
      date: '2025-10-02',
      time: '08:45',
      timestamp: new Date('2025-10-02T08:45:00'),
      status: 'running',
      mae: null,
      rmse: null,
      mape: null,
      r2: null,
      trainingTime: 'In progress',
      parameters: [
        { key: 'learning_rate', value: '0.0005' },
        { key: 'batch_size', value: '64' },
        { key: 'epochs', value: '150' }
      ]
    },
    {
      id: 'exp_004',
      name: 'Ensemble Model v1.0',
      description: 'Combination of LSTM and Random Forest models',
      date: '2025-09-29',
      time: '16:20',
      timestamp: new Date('2025-09-29T16:20:00'),
      status: 'failed',
      mae: null,
      rmse: null,
      mape: null,
      r2: null,
      trainingTime: 'Failed at 1h 30m',
      parameters: [
        { key: 'lstm_weight', value: '0.7' },
        { key: 'rf_weight', value: '0.3' }
      ]
    }
  ];

  // Mock data for models
  const mockModels = [
    {
      id: 'model_001',
      name: 'LSTM Crime Predictor',
      version: 'v2.1-latest',
      description: 'Production-ready LSTM model for crime prediction with 94% accuracy',
      status: 'production',
      lastUpdated: '2 hours ago',
      metrics: {
        mae: '0.1245',
        rmse: '0.2156',
        mape: '8.34'
      },
      trainingDataset: 'Chicago Crime 2020-2024',
      algorithm: 'LSTM with Attention',
      predictionsCount: 15847,
      hyperparameters: [
        { name: 'lr', value: '0.001' },
        { name: 'batch', value: '32' },
        { name: 'epochs', value: '100' }
      ]
    },
    {
      id: 'model_002',
      name: 'Random Forest Baseline',
      version: 'v1.3-stable',
      description: 'Reliable baseline model for performance comparison',
      status: 'staging',
      lastUpdated: '1 day ago',
      metrics: {
        mae: '0.1567',
        rmse: '0.2489',
        mape: '10.12'
      },
      trainingDataset: 'Chicago Crime 2020-2024',
      algorithm: 'Random Forest',
      predictionsCount: 8234,
      hyperparameters: [
        { name: 'trees', value: '100' },
        { name: 'depth', value: '10' },
        { name: 'split', value: '2' }
      ]
    },
    {
      id: 'model_003',
      name: 'Ensemble Predictor',
      version: 'v1.0-beta',
      description: 'Experimental ensemble combining multiple algorithms',
      status: 'archived',
      lastUpdated: '1 week ago',
      metrics: {
        mae: '0.1389',
        rmse: '0.2234',
        mape: '9.12'
      },
      trainingDataset: 'Chicago Crime 2019-2024',
      algorithm: 'Ensemble (LSTM + RF)',
      predictionsCount: 3456,
      hyperparameters: [
        { name: 'lstm_weight', value: '0.7' },
        { name: 'rf_weight', value: '0.3' }
      ]
    }
  ];

  // Mock data for deployments
  const mockDeployments = [
    {
      id: 'deploy_001',
      modelName: 'LSTM Crime Predictor',
      version: 'v2.1',
      environment: 'Production',
      health: 'healthy',
      metrics: {
        requests24h: 2847,
        avgLatency: 145,
        errorRate: 0.2,
        cpuUsage: 34
      },
      alerts: []
    },
    {
      id: 'deploy_002',
      modelName: 'Random Forest Baseline',
      version: 'v1.3',
      environment: 'Staging',
      health: 'warning',
      metrics: {
        requests24h: 456,
        avgLatency: 89,
        errorRate: 1.8,
        cpuUsage: 67
      },
      alerts: ['High CPU usage detected', 'Response time above threshold']
    }
  ];

  // Mock system metrics
  const mockSystemMetrics = {
    activeModels: 3,
    requestsPerHour: 1247,
    avgResponseTime: 142,
    successRate: 99.8
  };

  const tabs = [
    { id: 'experiments', label: 'Experiments', icon: 'FlaskConical' },
    { id: 'models', label: 'Model Registry', icon: 'Database' },
    { id: 'deployments', label: 'Deployments', icon: 'Rocket' }
  ];

  const handleViewExperimentDetails = (experimentId) => {
    console.log('Viewing experiment details:', experimentId);
  };

  const handleCompareExperiments = (experimentIds) => {
    const experimentsToCompare = mockExperiments?.filter(exp => experimentIds?.includes(exp?.id));
    setSelectedExperiments(experimentsToCompare);
    setShowComparison(true);
  };

  const handleDeployModel = (modelId) => {
    console.log('Deploying model:', modelId);
  };

  const handleViewModelMetrics = (modelId) => {
    console.log('Viewing model metrics:', modelId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                <Link to="/main-dashboard" className="hover:text-foreground">Dashboard</Link>
                <Icon name="ChevronRight" size={14} />
                <span>Model Management</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">Model Management</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive MLflow integration for experiment tracking, model registry, and deployment monitoring
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="RefreshCw" iconPosition="left">
                Sync MLflow
              </Button>
              <Button variant="default" iconName="Plus" iconPosition="left">
                New Experiment
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Experiments</p>
                <p className="text-2xl font-bold text-foreground">{mockExperiments?.length}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FlaskConical" size={20} color="var(--color-primary)" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Registered Models</p>
                <p className="text-2xl font-bold text-foreground">{mockModels?.length}</p>
              </div>
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="Database" size={20} color="var(--color-accent)" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Deployments</p>
                <p className="text-2xl font-bold text-foreground">{mockDeployments?.length}</p>
              </div>
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Rocket" size={20} color="var(--color-success)" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best MAE Score</p>
                <p className="text-2xl font-bold text-foreground">0.1245</p>
              </div>
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="Trophy" size={20} color="var(--color-warning)" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card border border-border rounded-lg mb-8">
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'experiments' && (
              <ExperimentTable
                experiments={mockExperiments}
                onViewDetails={handleViewExperimentDetails}
                onCompare={handleCompareExperiments}
              />
            )}

            {activeTab === 'models' && (
              <ModelRegistry
                models={mockModels}
                onDeploy={handleDeployModel}
                onViewMetrics={handleViewModelMetrics}
              />
            )}

            {activeTab === 'deployments' && (
              <DeploymentMonitor
                deployments={mockDeployments}
                systemMetrics={mockSystemMetrics}
              />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Play" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Start Training</h3>
                <p className="text-sm text-muted-foreground">Launch new model training job</p>
              </div>
            </div>
            <Link to="/prediction-interface">
              <Button variant="outline" fullWidth iconName="ArrowRight" iconPosition="right">
                Go to Training
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={20} color="var(--color-accent)" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Analyze model performance</p>
              </div>
            </div>
            <Link to="/main-dashboard">
              <Button variant="outline" fullWidth iconName="ArrowRight" iconPosition="right">
                Open Dashboard
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Upload" size={20} color="var(--color-success)" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Upload Data</h3>
                <p className="text-sm text-muted-foreground">Add new training datasets</p>
              </div>
            </div>
            <Link to="/data-upload-interface">
              <Button variant="outline" fullWidth iconName="ArrowRight" iconPosition="right">
                Upload Data
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Experiment Comparison Modal */}
      {showComparison && (
        <ExperimentComparison
          experiments={selectedExperiments}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export default ModelManagement;