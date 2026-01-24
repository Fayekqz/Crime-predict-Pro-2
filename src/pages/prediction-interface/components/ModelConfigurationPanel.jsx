import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ModelConfigurationPanel = ({ onStartTraining, isTraining }) => {
  const [config, setConfig] = useState({
    modelType: 'lstm',
    dataset: 'chicago_crime_2023',
    dateRange: {
      start: '2023-01-01',
      end: '2023-12-31'
    },
    forecastHorizon: 30,
    lookbackWindow: 60,
    features: ['crime_count', 'day_of_week', 'month', 'temperature'],
    hyperparameters: {
      // LSTM specific
      lstmUnits: 128,
      dropoutRate: 0.2,
      learningRate: 0.001,
      batchSize: 32,
      epochs: 100,
      // ARIMA specific
      arimaOrder: { p: 1, d: 1, q: 1 },
      seasonalOrder: { P: 1, D: 1, Q: 1, s: 7 },
      // Random Forest specific
      nEstimators: 100,
      maxDepth: 10,
      minSamplesSplit: 2,
      // XGBoost specific
      xgbLearningRate: 0.1,
      maxDepthXgb: 6,
      nEstimatorsXgb: 100,
      subsample: 0.8,
      // Prophet specific
      prophetSeasonality: 'auto',
      changePointPrior: 0.05,
      seasonalityPrior: 10,
      holidaysPrior: 10,
      // SVM specific
      svmKernel: 'rbf',
      svmC: 1.0,
      svmGamma: 'scale'
    }
  });

  const modelTypeOptions = [
    { 
      value: 'lstm', 
      label: 'LSTM (Long Short-Term Memory)',
      description: 'Deep learning model ideal for sequential crime data with complex patterns',
      complexity: 'High',
      accuracy: '★★★★★',
      speed: '★★★☆☆'
    },
    { 
      value: 'arima', 
      label: 'ARIMA (AutoRegressive Integrated Moving Average)',
      description: 'Classical statistical model excellent for trend and seasonality detection',
      complexity: 'Medium',
      accuracy: '★★★★☆',
      speed: '★★★★★'
    },
    { 
      value: 'prophet', 
      label: 'Prophet (Facebook\'s Time Series)',
      description: 'Robust forecasting with holiday effects and trend changepoints',
      complexity: 'Low',
      accuracy: '★★★★☆',
      speed: '★★★★☆'
    },
    { 
      value: 'random_forest', 
      label: 'Random Forest Regressor',
      description: 'Ensemble method handling non-linear relationships and feature importance',
      complexity: 'Medium',
      accuracy: '★★★★☆',
      speed: '★★★★☆'
    },
    { 
      value: 'xgboost', 
      label: 'XGBoost (Extreme Gradient Boosting)',
      description: 'High-performance gradient boosting for complex pattern recognition',
      complexity: 'High',
      accuracy: '★★★★★',
      speed: '★★★☆☆'
    },
    { 
      value: 'svm', 
      label: 'SVM (Support Vector Machine)',
      description: 'Effective for high-dimensional data with kernel trick capabilities',
      complexity: 'Medium',
      accuracy: '★★★☆☆',
      speed: '★★★★☆'
    },
    { 
      value: 'linear_regression', 
      label: 'Linear Regression with Time Features',
      description: 'Simple baseline model with polynomial and interaction terms',
      complexity: 'Low',
      accuracy: '★★★☆☆',
      speed: '★★★★★'
    },
    { 
      value: 'ensemble', 
      label: 'Ensemble Model (Multiple Models)',
      description: 'Combines predictions from multiple models for improved accuracy',
      complexity: 'High',
      accuracy: '★★★★★',
      speed: '★★☆☆☆'
    }
  ];

  const datasetOptions = [
    { value: 'chicago_crime_2023', label: 'Chicago Crime Dataset 2023 (45,231 records)' },
    { value: 'nyc_crime_2023', label: 'NYC Crime Dataset 2023 (38,567 records)' },
    { value: 'la_crime_2023', label: 'LA Crime Dataset 2023 (52,891 records)' },
    { value: 'combined_metro_2023', label: 'Combined Metro Areas 2023 (136,689 records)' }
  ];

  const featureOptions = [
    { value: 'crime_count', label: 'Crime Count (Primary)' },
    { value: 'day_of_week', label: 'Day of Week' },
    { value: 'month', label: 'Month' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'precipitation', label: 'Precipitation' },
    { value: 'unemployment_rate', label: 'Unemployment Rate' },
    { value: 'population_density', label: 'Population Density' },
    { value: 'event_indicator', label: 'Special Events' }
  ];

  const handleConfigChange = (field, value) => {
    if (field?.includes('.')) {
      const [parent, child] = field?.split('.');
      setConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev?.[parent],
          [child]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleStartTraining = () => {
    const trainingConfig = {
      ...config,
      estimatedTime: calculateEstimatedTime(),
      resourceRequirements: calculateResourceRequirements()
    };
    onStartTraining(trainingConfig);
  };

  const calculateEstimatedTime = () => {
    let baseTime = 15; // minutes
    
    // Model-specific time multipliers
    const modelTimeMultipliers = {
      'lstm': 2.0,
      'arima': 0.5,
      'prophet': 0.3,
      'random_forest': 0.8,
      'xgboost': 1.2,
      'svm': 1.5,
      'linear_regression': 0.2,
      'ensemble': 3.5
    };

    const datasetMultiplier = config?.dataset === 'combined_metro_2023' ? 2.5 : 1;
    const modelMultiplier = modelTimeMultipliers?.[config?.modelType] || 1;
    
    // Additional time for epochs-based models
    let epochMultiplier = 1;
    if (['lstm', 'xgboost']?.includes(config?.modelType)) {
      const epochs = config?.hyperparameters?.epochs || config?.hyperparameters?.nEstimatorsXgb || 100;
      epochMultiplier = epochs / 100;
    }
    
    return Math.round(baseTime * datasetMultiplier * modelMultiplier * epochMultiplier);
  };

  const calculateResourceRequirements = () => {
    const resourceMap = {
      'lstm': { gpu: 'High', memory: '8GB', storage: '3.2GB' },
      'arima': { gpu: 'None', memory: '2GB', storage: '1.5GB' },
      'prophet': { gpu: 'Low', memory: '3GB', storage: '2GB' },
      'random_forest': { gpu: 'Low', memory: '4GB', storage: '2.5GB' },
      'xgboost': { gpu: 'Medium', memory: '6GB', storage: '3GB' },
      'svm': { gpu: 'Medium', memory: '5GB', storage: '2.8GB' },
      'linear_regression': { gpu: 'None', memory: '1GB', storage: '1GB' },
      'ensemble': { gpu: 'High', memory: '12GB', storage: '5GB' }
    };

    return resourceMap?.[config?.modelType] || { gpu: 'Medium', memory: '4GB', storage: '2.5GB' };
  };

  const renderModelSpecificParams = () => {
    switch (config?.modelType) {
      case 'lstm':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="LSTM Units"
              type="number"
              min="32"
              max="512"
              step="32"
              value={config?.hyperparameters?.lstmUnits}
              onChange={(e) => handleConfigChange('hyperparameters.lstmUnits', parseInt(e?.target?.value))}
            />
            <Input
              label="Dropout Rate"
              type="number"
              min="0.1"
              max="0.5"
              step="0.1"
              value={config?.hyperparameters?.dropoutRate}
              onChange={(e) => handleConfigChange('hyperparameters.dropoutRate', parseFloat(e?.target?.value))}
            />
            <Input
              label="Learning Rate"
              type="number"
              min="0.0001"
              max="0.01"
              step="0.0001"
              value={config?.hyperparameters?.learningRate}
              onChange={(e) => handleConfigChange('hyperparameters.learningRate', parseFloat(e?.target?.value))}
            />
            <Input
              label="Batch Size"
              type="number"
              min="16"
              max="128"
              step="16"
              value={config?.hyperparameters?.batchSize}
              onChange={(e) => handleConfigChange('hyperparameters.batchSize', parseInt(e?.target?.value))}
            />
            <Input
              label="Epochs"
              type="number"
              min="50"
              max="500"
              step="10"
              value={config?.hyperparameters?.epochs}
              onChange={(e) => handleConfigChange('hyperparameters.epochs', parseInt(e?.target?.value))}
            />
          </div>
        );

      case 'arima':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">ARIMA Order (p,d,q)</h4>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="p (AR)"
                  type="number"
                  min="0"
                  max="5"
                  value={config?.hyperparameters?.arimaOrder?.p}
                  onChange={(e) => handleConfigChange('hyperparameters.arimaOrder.p', parseInt(e?.target?.value))}
                />
                <Input
                  label="d (I)"
                  type="number"
                  min="0"
                  max="2"
                  value={config?.hyperparameters?.arimaOrder?.d}
                  onChange={(e) => handleConfigChange('hyperparameters.arimaOrder.d', parseInt(e?.target?.value))}
                />
                <Input
                  label="q (MA)"
                  type="number"
                  min="0"
                  max="5"
                  value={config?.hyperparameters?.arimaOrder?.q}
                  onChange={(e) => handleConfigChange('hyperparameters.arimaOrder.q', parseInt(e?.target?.value))}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Seasonal Order (P,D,Q,s)</h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="P (SAR)"
                  type="number"
                  min="0"
                  max="2"
                  value={config?.hyperparameters?.seasonalOrder?.P}
                  onChange={(e) => handleConfigChange('hyperparameters.seasonalOrder.P', parseInt(e?.target?.value))}
                />
                <Input
                  label="D (SI)"
                  type="number"
                  min="0"
                  max="1"
                  value={config?.hyperparameters?.seasonalOrder?.D}
                  onChange={(e) => handleConfigChange('hyperparameters.seasonalOrder.D', parseInt(e?.target?.value))}
                />
                <Input
                  label="Q (SMA)"
                  type="number"
                  min="0"
                  max="2"
                  value={config?.hyperparameters?.seasonalOrder?.Q}
                  onChange={(e) => handleConfigChange('hyperparameters.seasonalOrder.Q', parseInt(e?.target?.value))}
                />
                <Input
                  label="s (Season)"
                  type="number"
                  min="2"
                  max="365"
                  value={config?.hyperparameters?.seasonalOrder?.s}
                  onChange={(e) => handleConfigChange('hyperparameters.seasonalOrder.s', parseInt(e?.target?.value))}
                />
              </div>
            </div>
          </div>
        );

      case 'prophet':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Seasonality Mode"
              options={[
                { value: 'auto', label: 'Automatic' },
                { value: 'additive', label: 'Additive' },
                { value: 'multiplicative', label: 'Multiplicative' }
              ]}
              value={config?.hyperparameters?.prophetSeasonality}
              onChange={(value) => handleConfigChange('hyperparameters.prophetSeasonality', value)}
            />
            <Input
              label="Changepoint Prior Scale"
              type="number"
              min="0.001"
              max="0.5"
              step="0.001"
              value={config?.hyperparameters?.changePointPrior}
              onChange={(e) => handleConfigChange('hyperparameters.changePointPrior', parseFloat(e?.target?.value))}
            />
            <Input
              label="Seasonality Prior Scale"
              type="number"
              min="0.1"
              max="50"
              step="0.1"
              value={config?.hyperparameters?.seasonalityPrior}
              onChange={(e) => handleConfigChange('hyperparameters.seasonalityPrior', parseFloat(e?.target?.value))}
            />
            <Input
              label="Holidays Prior Scale"
              type="number"
              min="0.1"
              max="50"
              step="0.1"
              value={config?.hyperparameters?.holidaysPrior}
              onChange={(e) => handleConfigChange('hyperparameters.holidaysPrior', parseFloat(e?.target?.value))}
            />
          </div>
        );

      case 'random_forest':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Number of Trees"
              type="number"
              min="10"
              max="500"
              step="10"
              value={config?.hyperparameters?.nEstimators}
              onChange={(e) => handleConfigChange('hyperparameters.nEstimators', parseInt(e?.target?.value))}
            />
            <Input
              label="Max Depth"
              type="number"
              min="3"
              max="50"
              value={config?.hyperparameters?.maxDepth}
              onChange={(e) => handleConfigChange('hyperparameters.maxDepth', parseInt(e?.target?.value))}
            />
            <Input
              label="Min Samples Split"
              type="number"
              min="2"
              max="20"
              value={config?.hyperparameters?.minSamplesSplit}
              onChange={(e) => handleConfigChange('hyperparameters.minSamplesSplit', parseInt(e?.target?.value))}
            />
          </div>
        );

      case 'xgboost':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Learning Rate"
              type="number"
              min="0.01"
              max="0.3"
              step="0.01"
              value={config?.hyperparameters?.xgbLearningRate}
              onChange={(e) => handleConfigChange('hyperparameters.xgbLearningRate', parseFloat(e?.target?.value))}
            />
            <Input
              label="Max Depth"
              type="number"
              min="3"
              max="15"
              value={config?.hyperparameters?.maxDepthXgb}
              onChange={(e) => handleConfigChange('hyperparameters.maxDepthXgb', parseInt(e?.target?.value))}
            />
            <Input
              label="Number of Estimators"
              type="number"
              min="50"
              max="1000"
              step="50"
              value={config?.hyperparameters?.nEstimatorsXgb}
              onChange={(e) => handleConfigChange('hyperparameters.nEstimatorsXgb', parseInt(e?.target?.value))}
            />
            <Input
              label="Subsample"
              type="number"
              min="0.5"
              max="1.0"
              step="0.1"
              value={config?.hyperparameters?.subsample}
              onChange={(e) => handleConfigChange('hyperparameters.subsample', parseFloat(e?.target?.value))}
            />
          </div>
        );

      case 'svm':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Kernel"
              options={[
                { value: 'rbf', label: 'RBF (Radial Basis Function)' },
                { value: 'linear', label: 'Linear' },
                { value: 'poly', label: 'Polynomial' },
                { value: 'sigmoid', label: 'Sigmoid' }
              ]}
              value={config?.hyperparameters?.svmKernel}
              onChange={(value) => handleConfigChange('hyperparameters.svmKernel', value)}
            />
            <Input
              label="C (Regularization)"
              type="number"
              min="0.1"
              max="100"
              step="0.1"
              value={config?.hyperparameters?.svmC}
              onChange={(e) => handleConfigChange('hyperparameters.svmC', parseFloat(e?.target?.value))}
            />
            <Select
              label="Gamma"
              options={[
                { value: 'scale', label: 'Scale (1/(n_features * X.var()))' },
                { value: 'auto', label: 'Auto (1/n_features)' }
              ]}
              value={config?.hyperparameters?.svmGamma}
              onChange={(value) => handleConfigChange('hyperparameters.svmGamma', value)}
            />
          </div>
        );

      case 'linear_regression':
        return (
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Linear regression uses polynomial features and interaction terms automatically.
              No hyperparameters required for basic configuration.
            </p>
          </div>
        );

      case 'ensemble':
        return (
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Ensemble model combines predictions from multiple algorithms:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• LSTM with reduced complexity</li>
              <li>• XGBoost with optimized parameters</li>
              <li>• Prophet for trend analysis</li>
              <li>• Random Forest for feature importance</li>
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  const selectedModel = modelTypeOptions?.find(model => model?.value === config?.modelType);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Model Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure prediction model parameters and training settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-xs text-success font-medium">GPU Available</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Model Type Selection */}
        <div>
          <Select
            label="Prediction Model Type"
            description="Choose the machine learning algorithm for crime prediction"
            options={modelTypeOptions?.map(model => ({
              value: model?.value,
              label: model?.label
            }))}
            value={config?.modelType}
            onChange={(value) => handleConfigChange('modelType', value)}
            className="mb-4"
          />
          
          {/* Model Details Card */}
          {selectedModel && (
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-2">{selectedModel?.label}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{selectedModel?.description}</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Complexity:</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        selectedModel?.complexity === 'High' ? 'bg-destructive/10 text-destructive' :
                        selectedModel?.complexity === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                      }`}>
                        {selectedModel?.complexity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Accuracy:</span>
                      <span className="text-xs text-warning">{selectedModel?.accuracy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">Speed:</span>
                      <span className="text-xs text-primary">{selectedModel?.speed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dataset Selection */}
        <div>
          <Select
            label="Training Dataset"
            description="Select the crime dataset for model training"
            options={datasetOptions}
            value={config?.dataset}
            onChange={(value) => handleConfigChange('dataset', value)}
            className="mb-4"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={config?.dateRange?.start}
            onChange={(e) => handleConfigChange('dateRange.start', e?.target?.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={config?.dateRange?.end}
            onChange={(e) => handleConfigChange('dateRange.end', e?.target?.value)}
          />
        </div>

        {/* Prediction Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Forecast Horizon (days)"
            type="number"
            min="1"
            max="365"
            value={config?.forecastHorizon}
            onChange={(e) => handleConfigChange('forecastHorizon', parseInt(e?.target?.value))}
            description="Number of days to predict ahead"
          />
          <Input
            label="Lookback Window (days)"
            type="number"
            min="7"
            max="180"
            value={config?.lookbackWindow}
            onChange={(e) => handleConfigChange('lookbackWindow', parseInt(e?.target?.value))}
            description="Historical data window for training"
          />
        </div>

        {/* Feature Selection */}
        <div>
          <Select
            label="Input Features"
            description="Select features for model training"
            options={featureOptions}
            value={config?.features}
            onChange={(value) => handleConfigChange('features', value)}
            multiple
            searchable
            className="mb-4"
          />
        </div>

        {/* Model-Specific Hyperparameters */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-lg font-medium text-foreground mb-4">
            {selectedModel?.label || 'Model'} Parameters
          </h3>
          {renderModelSpecificParams()}
        </div>

        {/* Resource Estimation */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Estimated Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />
              <div>
                <p className="text-sm font-medium text-foreground">{calculateEstimatedTime()} minutes</p>
                <p className="text-xs text-muted-foreground">Training Time</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={16} color="var(--color-muted-foreground)" />
              <div>
                <p className="text-sm font-medium text-foreground">{calculateResourceRequirements()?.gpu}</p>
                <p className="text-xs text-muted-foreground">GPU Usage</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="HardDrive" size={16} color="var(--color-muted-foreground)" />
              <div>
                <p className="text-sm font-medium text-foreground">{calculateResourceRequirements()?.memory}</p>
                <p className="text-xs text-muted-foreground">Memory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button variant="outline" iconName="Save" iconPosition="left">
              Save Config
            </Button>
            <Button variant="ghost" iconName="RotateCcw" iconPosition="left">
              Reset to Default
            </Button>
          </div>
          <Button
            variant="default"
            iconName="Play"
            iconPosition="left"
            loading={isTraining}
            onClick={handleStartTraining}
            disabled={isTraining}
          >
            {isTraining ? 'Training in Progress...' : 'Start Training'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelConfigurationPanel;