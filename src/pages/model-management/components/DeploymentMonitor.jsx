import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeploymentMonitor = ({ deployments, systemMetrics }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'critical': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getHealthIcon = (health) => {
    switch (health) {
      case 'healthy': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'critical': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Monitor Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Deployment Monitor</h3>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring of deployed models and system health
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button variant="outline" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>
      </div>
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Models</p>
              <p className="text-2xl font-bold text-foreground">{systemMetrics?.activeModels}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Cpu" size={20} color="var(--color-primary)" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Requests/Hour</p>
              <p className="text-2xl font-bold text-foreground">{systemMetrics?.requestsPerHour?.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} color="var(--color-accent)" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold text-foreground">{systemMetrics?.avgResponseTime}ms</p>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} color="var(--color-warning)" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold text-foreground">{systemMetrics?.successRate}%</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="var(--color-success)" />
            </div>
          </div>
        </div>
      </div>
      {/* Active Deployments */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h4 className="text-lg font-semibold text-foreground">Active Deployments</h4>
        </div>
        
        <div className="divide-y divide-border">
          {deployments?.map((deployment) => (
            <div key={deployment?.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    deployment?.health === 'healthy' ? 'bg-success' :
                    deployment?.health === 'warning' ? 'bg-warning' : 'bg-error'
                  }`}></div>
                  <div>
                    <h5 className="font-semibold text-foreground">{deployment?.modelName}</h5>
                    <p className="text-sm text-muted-foreground">{deployment?.version} • {deployment?.environment}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(deployment?.health)}`}>
                    <Icon name={getHealthIcon(deployment?.health)} size={12} className="mr-1" />
                    {deployment?.health?.charAt(0)?.toUpperCase() + deployment?.health?.slice(1)}
                  </span>
                  <Button variant="ghost" size="sm" iconName="ExternalLink">
                    Monitor
                  </Button>
                </div>
              </div>

              {/* Deployment Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Requests (24h)</p>
                  <p className="text-sm font-semibold text-foreground">{deployment?.metrics?.requests24h?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Latency</p>
                  <p className="text-sm font-semibold text-foreground">{deployment?.metrics?.avgLatency}ms</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Error Rate</p>
                  <p className="text-sm font-semibold text-foreground">{deployment?.metrics?.errorRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CPU Usage</p>
                  <p className="text-sm font-semibold text-foreground">{deployment?.metrics?.cpuUsage}%</p>
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="h-20 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Icon name="TrendingUp" size={16} />
                  <span className="text-sm">Performance trend visualization</span>
                </div>
              </div>

              {/* Alerts */}
              {deployment?.alerts && deployment?.alerts?.length > 0 && (
                <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-warning">Active Alerts</p>
                      {deployment?.alerts?.map((alert, index) => (
                        <p key={index} className="text-xs text-warning/80 mt-1">{alert}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Model Performance Degradation */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Performance Degradation Analysis</h4>
          <Button variant="outline" size="sm" iconName="AlertTriangle">
            View All Alerts
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingDown" size={20} color="var(--color-warning)" />
              <div>
                <p className="font-medium text-foreground">LSTM Crime Predictor v2.1</p>
                <p className="text-sm text-muted-foreground">MAE increased by 15% over last 7 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Investigate
              </Button>
              <Button variant="warning" size="sm">
                Retrain
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
              <div>
                <p className="font-medium text-foreground">Random Forest Baseline v1.3</p>
                <p className="text-sm text-muted-foreground">Performance stable within expected range</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" iconName="Eye">
              View Details
            </Button>
          </div>
        </div>
      </div>
      {/* Automated Recommendations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Automated Recommendations</h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <Icon name="Lightbulb" size={16} color="var(--color-primary)" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Retrain LSTM Model</p>
              <p className="text-xs text-muted-foreground">
                Recent data drift detected. Consider retraining with last 6 months of data.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Schedule
            </Button>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <Icon name="Zap" size={16} color="var(--color-accent)" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Scale Up Resources</p>
              <p className="text-xs text-muted-foreground">
                High request volume detected. Consider increasing compute resources.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentMonitor;