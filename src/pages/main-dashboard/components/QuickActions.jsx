import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const actionItems = [
    {
      title: 'Upload Crime Data',
      description: 'Import new CSV datasets for analysis',
      icon: 'Upload',
      path: '/data-upload-interface',
      color: 'bg-primary',
      textColor: 'text-primary-foreground',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      title: 'View Interactive Map',
      description: 'Explore geospatial crime patterns',
      icon: 'Map',
      path: '/interactive-map-view',
      color: 'bg-success',
      textColor: 'text-success-foreground',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Generate Predictions',
      description: 'Train LSTM models and forecast trends',
      icon: 'TrendingUp',
      path: '/prediction-interface',
      color: 'bg-warning',
      textColor: 'text-warning-foreground',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      title: 'Manage Models',
      description: 'Track experiments and model registry',
      icon: 'Settings',
      path: '/model-management',
      color: 'bg-accent',
      textColor: 'text-accent-foreground',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'LSTM Model Training Completed',
      timestamp: '2 minutes ago',
      status: 'success',
      icon: 'CheckCircle'
    },
    {
      id: 2,
      action: 'New Dataset Uploaded: Q3_2024_Crime_Data.csv',
      timestamp: '15 minutes ago',
      status: 'info',
      icon: 'Upload'
    },
    {
      id: 3,
      action: 'Prediction Job Queued',
      timestamp: '1 hour ago',
      status: 'warning',
      icon: 'Clock'
    },
    {
      id: 4,
      action: 'Model Evaluation Report Generated',
      timestamp: '2 hours ago',
      status: 'success',
      icon: 'FileText'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Info';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={18} color="var(--color-primary)" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actionItems?.map((item, index) => (
            <Link
              key={index}
              to={item?.path}
              className={`group p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${item?.bgColor} ${item?.borderColor} hover:border-opacity-40`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item?.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon name={item?.icon} size={20} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                    {item?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item?.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            iconName="ExternalLink"
            iconPosition="right"
            className="w-full"
          >
            View All Features
          </Button>
        </div>
      </div>
      {/* Recent Activities */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={18} color="var(--color-success)" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
          </div>
          <Button variant="ghost" size="sm" iconName="RefreshCw">
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {recentActivities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity?.status === 'success' ? 'bg-success/10' :
                activity?.status === 'warning' ? 'bg-warning/10' :
                activity?.status === 'error' ? 'bg-destructive/10' : 'bg-primary/10'
              }`}>
                <Icon 
                  name={activity?.icon} 
                  size={16} 
                  color={`var(--color-${activity?.status === 'error' ? 'destructive' : activity?.status})`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {activity?.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity?.timestamp}
                </p>
              </div>
              <div className={`flex-shrink-0 ${getStatusColor(activity?.status)}`}>
                <Icon name={getStatusIcon(activity?.status)} size={16} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            iconName="History"
            iconPosition="left"
            className="w-full"
          >
            View Activity Log
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;