import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const ModelRegistry = ({ models, onDeploy, onViewMetrics }) => {
  const [selectedModel, setSelectedModel] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'production': return 'text-success bg-success/10';
      case 'staging': return 'text-warning bg-warning/10';
      case 'archived': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getVersionBadge = (version) => {
    if (version?.includes('latest')) return 'bg-primary text-primary-foreground';
    if (version?.includes('v1.')) return 'bg-accent text-accent-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Registry Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Model Registry</h3>
          <p className="text-sm text-muted-foreground">
            Manage versioned models and deployment status
          </p>
        </div>
        <Button variant="outline" iconName="Plus" iconPosition="left">
          Register Model
        </Button>
      </div>
      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models?.map((model) => (
          <div key={model?.id} className="bg-card border border-border rounded-lg p-6">
            {/* Model Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-foreground">{model?.name}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVersionBadge(model?.version)}`}>
                    {model?.version}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{model?.description}</p>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model?.status)}`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${
                      model?.status === 'production' ? 'bg-success' : 
                      model?.status === 'staging' ? 'bg-warning' : 'bg-muted-foreground'
                    }`}></div>
                    {model?.status?.charAt(0)?.toUpperCase() + model?.status?.slice(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Updated {model?.lastUpdated}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" iconName="MoreVertical" />
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">MAE</p>
                <p className="text-lg font-semibold text-foreground">{model?.metrics?.mae}</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">RMSE</p>
                <p className="text-lg font-semibold text-foreground">{model?.metrics?.rmse}</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">MAPE</p>
                <p className="text-lg font-semibold text-foreground">{model?.metrics?.mape}%</p>
              </div>
            </div>

            {/* Model Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Training Dataset:</span>
                <span className="text-sm text-foreground">{model?.trainingDataset}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Algorithm:</span>
                <span className="text-sm text-foreground">{model?.algorithm}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Predictions Made:</span>
                <span className="text-sm text-foreground">{model?.predictionsCount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Hyperparameters */}
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground mb-2">Key Parameters:</p>
              <div className="flex flex-wrap gap-2">
                {model?.hyperparameters?.map((param, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                    {param?.name}: {param?.value}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewMetrics(model?.id)}
                  iconName="BarChart3"
                  iconPosition="left"
                >
                  Metrics
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Download"
                >
                  Export
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {model?.status !== 'production' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onDeploy(model?.id)}
                    iconName="Rocket"
                    iconPosition="left"
                  >
                    Deploy
                  </Button>
                )}
                {model?.status === 'production' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    iconName="Square"
                    iconPosition="left"
                  >
                    Stop
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Model Comparison Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Model Performance Comparison</h4>
          <Button variant="outline" size="sm" iconName="GitCompare">
            Compare All
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Model</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Version</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">MAE</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">RMSE</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">MAPE</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {models?.slice(0, 3)?.map((model) => (
                <tr key={model?.id} className="border-b border-border">
                  <td className="p-3 text-sm text-foreground font-medium">{model?.name}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getVersionBadge(model?.version)}`}>
                      {model?.version}
                    </span>
                  </td>
                  <td className="p-3 text-sm font-mono text-foreground">{model?.metrics?.mae}</td>
                  <td className="p-3 text-sm font-mono text-foreground">{model?.metrics?.rmse}</td>
                  <td className="p-3 text-sm font-mono text-foreground">{model?.metrics?.mape}%</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model?.status)}`}>
                      {model?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModelRegistry;