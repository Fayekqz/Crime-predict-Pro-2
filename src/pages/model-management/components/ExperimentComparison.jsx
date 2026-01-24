import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExperimentComparison = ({ experiments, onClose }) => {
  const [selectedMetric, setSelectedMetric] = useState('mae');
  const [comparisonView, setComparisonView] = useState('table');

  const metrics = [
    { key: 'mae', label: 'Mean Absolute Error', format: (val) => val?.toFixed(4) },
    { key: 'rmse', label: 'Root Mean Square Error', format: (val) => val?.toFixed(4) },
    { key: 'mape', label: 'Mean Absolute Percentage Error', format: (val) => `${val?.toFixed(2)}%` },
    { key: 'r2', label: 'R² Score', format: (val) => val?.toFixed(4) }
  ];

  const getBestValue = (metric) => {
    const values = experiments?.map(exp => exp?.[metric])?.filter(val => val !== null && val !== undefined);
    if (values?.length === 0) return null;
    
    // For R², higher is better; for others, lower is better
    return metric === 'r2' ? Math.max(...values) : Math.min(...values);
  };

  const isOptimalValue = (value, metric) => {
    const bestValue = getBestValue(metric);
    return bestValue !== null && Math.abs(value - bestValue) < 0.0001;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Experiment Comparison</h3>
            <p className="text-sm text-muted-foreground">
              Comparing {experiments?.length} experiments across key performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setComparisonView('table')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  comparisonView === 'table' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setComparisonView('chart')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  comparisonView === 'chart' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Chart
              </button>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {comparisonView === 'table' ? (
            <div className="space-y-6">
              {/* Metrics Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics?.map((metric) => (
                  <button
                    key={metric?.key}
                    onClick={() => setSelectedMetric(metric?.key)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedMetric === metric?.key
                        ? 'border-primary bg-primary/10 text-primary' :'border-border bg-card hover:bg-muted/50'
                    }`}
                  >
                    <p className="text-sm font-medium">{metric?.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Best: {getBestValue(metric?.key) !== null ? metric?.format(getBestValue(metric?.key)) : 'N/A'}
                    </p>
                  </button>
                ))}
              </div>

              {/* Comparison Table */}
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-foreground">Experiment</th>
                        <th className="text-left p-4 font-medium text-foreground">Status</th>
                        <th className="text-left p-4 font-medium text-foreground">MAE</th>
                        <th className="text-left p-4 font-medium text-foreground">RMSE</th>
                        <th className="text-left p-4 font-medium text-foreground">MAPE</th>
                        <th className="text-left p-4 font-medium text-foreground">R² Score</th>
                        <th className="text-left p-4 font-medium text-foreground">Training Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {experiments?.map((experiment) => (
                        <tr key={experiment?.id} className="border-b border-border hover:bg-muted/30">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-foreground">{experiment?.name}</p>
                              <p className="text-sm text-muted-foreground">{experiment?.date}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              experiment?.status === 'completed' ? 'text-success bg-success/10' :
                              experiment?.status === 'running'? 'text-warning bg-warning/10' : 'text-error bg-error/10'
                            }`}>
                              {experiment?.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-mono ${
                                isOptimalValue(experiment?.mae, 'mae') ? 'text-success font-semibold' : 'text-foreground'
                              }`}>
                                {experiment?.mae ? experiment?.mae?.toFixed(4) : '-'}
                              </span>
                              {isOptimalValue(experiment?.mae, 'mae') && (
                                <Icon name="Crown" size={14} color="var(--color-success)" />
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-mono ${
                                isOptimalValue(experiment?.rmse, 'rmse') ? 'text-success font-semibold' : 'text-foreground'
                              }`}>
                                {experiment?.rmse ? experiment?.rmse?.toFixed(4) : '-'}
                              </span>
                              {isOptimalValue(experiment?.rmse, 'rmse') && (
                                <Icon name="Crown" size={14} color="var(--color-success)" />
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-mono ${
                                isOptimalValue(experiment?.mape, 'mape') ? 'text-success font-semibold' : 'text-foreground'
                              }`}>
                                {experiment?.mape ? `${experiment?.mape?.toFixed(2)}%` : '-'}
                              </span>
                              {isOptimalValue(experiment?.mape, 'mape') && (
                                <Icon name="Crown" size={14} color="var(--color-success)" />
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-mono ${
                                isOptimalValue(experiment?.r2, 'r2') ? 'text-success font-semibold' : 'text-foreground'
                              }`}>
                                {experiment?.r2 ? experiment?.r2?.toFixed(4) : '-'}
                              </span>
                              {isOptimalValue(experiment?.r2, 'r2') && (
                                <Icon name="Crown" size={14} color="var(--color-success)" />
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-foreground">{experiment?.trainingTime}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Parameter Comparison */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">Hyperparameter Comparison</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-foreground">Experiment</th>
                        <th className="text-left p-3 font-medium text-foreground">Learning Rate</th>
                        <th className="text-left p-3 font-medium text-foreground">Batch Size</th>
                        <th className="text-left p-3 font-medium text-foreground">Epochs</th>
                        <th className="text-left p-3 font-medium text-foreground">Hidden Units</th>
                        <th className="text-left p-3 font-medium text-foreground">Dropout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {experiments?.map((experiment) => (
                        <tr key={experiment?.id} className="border-b border-border">
                          <td className="p-3 font-medium text-foreground">{experiment?.name}</td>
                          <td className="p-3 text-sm font-mono text-foreground">
                            {experiment?.parameters?.find(p => p?.key === 'learning_rate')?.value || '-'}
                          </td>
                          <td className="p-3 text-sm font-mono text-foreground">
                            {experiment?.parameters?.find(p => p?.key === 'batch_size')?.value || '-'}
                          </td>
                          <td className="p-3 text-sm font-mono text-foreground">
                            {experiment?.parameters?.find(p => p?.key === 'epochs')?.value || '-'}
                          </td>
                          <td className="p-3 text-sm font-mono text-foreground">
                            {experiment?.parameters?.find(p => p?.key === 'hidden_units')?.value || '-'}
                          </td>
                          <td className="p-3 text-sm font-mono text-foreground">
                            {experiment?.parameters?.find(p => p?.key === 'dropout')?.value || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Chart View */
            (<div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-foreground">Performance Visualization</h4>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e?.target?.value)}
                  className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
                >
                  {metrics?.map((metric) => (
                    <option key={metric?.key} value={metric?.key}>
                      {metric?.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Chart Placeholder */}
              <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Icon name="BarChart3" size={48} color="var(--color-muted-foreground)" />
                  <p className="text-lg font-medium text-foreground mt-4">Performance Comparison Chart</p>
                  <p className="text-sm text-muted-foreground">
                    Visualizing {metrics?.find(m => m?.key === selectedMetric)?.label} across experiments
                  </p>
                </div>
              </div>
              {/* Statistical Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h5 className="font-semibold text-foreground mb-2">Best Performer</h5>
                  <p className="text-sm text-muted-foreground">
                    {experiments?.find(exp => isOptimalValue(exp?.[selectedMetric], selectedMetric))?.name || 'N/A'}
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h5 className="font-semibold text-foreground mb-2">Average</h5>
                  <p className="text-sm text-muted-foreground">
                    {experiments?.length > 0 ? 
                      metrics?.find(m => m?.key === selectedMetric)?.format(
                        experiments?.reduce((sum, exp) => sum + (exp?.[selectedMetric] || 0), 0) / experiments?.length
                      ) : 'N/A'
                    }
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h5 className="font-semibold text-foreground mb-2">Improvement</h5>
                  <p className="text-sm text-success">+12.5% vs baseline</p>
                </div>
              </div>
            </div>)
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Statistical significance testing available for detailed analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" iconName="Download">
              Export Report
            </Button>
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentComparison;