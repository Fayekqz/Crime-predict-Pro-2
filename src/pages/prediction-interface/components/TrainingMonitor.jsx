import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainingMonitor = ({ isTraining, trainingConfig, onStopTraining }) => {
  const [progress, setProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [metrics, setMetrics] = useState({
    loss: 0.0,
    valLoss: 0.0,
    mae: 0.0,
    rmse: 0.0
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [logs, setLogs] = useState([]);

  // Simulate training progress
  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      
      if (trainingConfig) {
        const totalEpochs = trainingConfig?.hyperparameters?.epochs || 100;
        const newEpoch = Math.min(currentEpoch + 1, totalEpochs);
        const newProgress = (newEpoch / totalEpochs) * 100;
        
        setCurrentEpoch(newEpoch);
        setProgress(newProgress);
        
        // Simulate improving metrics
        setMetrics({
          loss: Math.max(0.001, 0.5 - (newEpoch * 0.005) + (Math.random() * 0.01)),
          valLoss: Math.max(0.001, 0.6 - (newEpoch * 0.0045) + (Math.random() * 0.015)),
          mae: Math.max(0.1, 2.5 - (newEpoch * 0.02) + (Math.random() * 0.1)),
          rmse: Math.max(0.2, 3.2 - (newEpoch * 0.025) + (Math.random() * 0.15))
        });

        // Add training logs
        if (newEpoch % 10 === 0) {
          const newLog = {
            timestamp: new Date()?.toLocaleTimeString(),
            epoch: newEpoch,
            message: `Epoch ${newEpoch}/${totalEpochs} - Loss: ${metrics?.loss?.toFixed(4)} - Val Loss: ${metrics?.valLoss?.toFixed(4)}`
          };
          setLogs(prev => [newLog, ...prev?.slice(0, 9)]);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isTraining, currentEpoch, trainingConfig, metrics?.loss, metrics?.valLoss]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getEstimatedRemaining = () => {
    if (!trainingConfig || progress === 0) return 'Calculating...';
    const totalEstimated = trainingConfig?.estimatedTime * 60; // Convert to seconds
    const remaining = Math.max(0, totalEstimated - elapsedTime);
    return formatTime(remaining);
  };

  if (!isTraining) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Play" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Active Training</h3>
          <p className="text-muted-foreground">Configure your model parameters and start training to monitor progress here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Training Monitor</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time LSTM model training progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-success font-medium">Training Active</span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            iconName="Square"
            iconPosition="left"
            onClick={onStopTraining}
          >
            Stop Training
          </Button>
        </div>
      </div>
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="BarChart3" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground">Progress</span>
          </div>
          <p className="text-2xl font-bold text-primary">{progress?.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Epoch {currentEpoch}/{trainingConfig?.hyperparameters?.epochs || 100}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} color="var(--color-accent)" />
            <span className="text-sm font-medium text-foreground">Elapsed</span>
          </div>
          <p className="text-2xl font-bold text-accent">{formatTime(elapsedTime)}</p>
          <p className="text-xs text-muted-foreground">Running time</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Timer" size={16} color="var(--color-warning)" />
            <span className="text-sm font-medium text-foreground">Remaining</span>
          </div>
          <p className="text-2xl font-bold text-warning">{getEstimatedRemaining()}</p>
          <p className="text-xs text-muted-foreground">Estimated</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Zap" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-foreground">GPU Usage</span>
          </div>
          <p className="text-2xl font-bold text-success">87%</p>
          <p className="text-xs text-muted-foreground">Utilization</p>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Training Progress</span>
          <span className="text-sm text-muted-foreground">{currentEpoch}/{trainingConfig?.hyperparameters?.epochs || 100} epochs</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Training Loss</p>
          <p className="text-lg font-bold text-foreground">{metrics?.loss?.toFixed(4)}</p>
          <div className="flex items-center justify-center space-x-1 mt-1">
            <Icon name="TrendingDown" size={12} color="var(--color-success)" />
            <span className="text-xs text-success">Improving</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Validation Loss</p>
          <p className="text-lg font-bold text-foreground">{metrics?.valLoss?.toFixed(4)}</p>
          <div className="flex items-center justify-center space-x-1 mt-1">
            <Icon name="TrendingDown" size={12} color="var(--color-success)" />
            <span className="text-xs text-success">Improving</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">MAE</p>
          <p className="text-lg font-bold text-foreground">{metrics?.mae?.toFixed(2)}</p>
          <div className="flex items-center justify-center space-x-1 mt-1">
            <Icon name="TrendingDown" size={12} color="var(--color-success)" />
            <span className="text-xs text-success">Improving</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">RMSE</p>
          <p className="text-lg font-bold text-foreground">{metrics?.rmse?.toFixed(2)}</p>
          <div className="flex items-center justify-center space-x-1 mt-1">
            <Icon name="TrendingDown" size={12} color="var(--color-success)" />
            <span className="text-xs text-success">Improving</span>
          </div>
        </div>
      </div>
      {/* Training Logs */}
      <div className="border border-border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">Training Logs</h3>
          <Button variant="ghost" size="sm" iconName="Download" iconPosition="left">
            Export Logs
          </Button>
        </div>
        <div className="p-4 max-h-48 overflow-y-auto">
          {logs?.length > 0 ? (
            <div className="space-y-2">
              {logs?.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <span className="text-muted-foreground font-mono text-xs">{log?.timestamp}</span>
                  <span className="text-foreground flex-1">{log?.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Training logs will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingMonitor;