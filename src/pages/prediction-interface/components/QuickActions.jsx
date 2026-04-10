import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ hasResults, isTraining }) => {
  const actionItems = [
    {
      title: 'Model Management',
      description: 'View experiment history and manage model versions',
      icon: 'Settings',
      path: '/model-management',
      color: 'primary',
      disabled: false
    },
    {
      title: 'Interactive Map',
      description: 'Visualize predictions on geospatial crime map',
      icon: 'Map',
      path: '/interactive-map-view',
      color: 'accent',
      disabled: !hasResults
    },
    {
      title: 'Data Upload',
      description: 'Upload new datasets for model training',
      icon: 'Upload',
      path: '/data-upload-interface',
      color: 'secondary',
      disabled: isTraining
    },
    {
      title: 'Main Dashboard',
      description: 'Return to analytics overview dashboard',
      icon: 'BarChart3',
      path: '/main-dashboard',
      color: 'success',
      disabled: false
    }
  ];

  const exportOptions = [
    {
      title: 'Export Predictions',
      description: 'Download prediction results as CSV',
      icon: 'Download',
      action: 'export-csv',
      disabled: !hasResults
    },
    {
      title: 'Generate Report',
      description: 'Create comprehensive analysis report',
      icon: 'FileText',
      action: 'generate-report',
      disabled: !hasResults
    },
    {
      title: 'Share Results',
      description: 'Share prediction results with team',
      icon: 'Share',
      action: 'share-results',
      disabled: !hasResults
    }
  ];

  const handleExportAction = (action) => {
    switch (action) {
      case 'export-csv':
        // Mock CSV export
        console.log('Exporting predictions as CSV...');
        break;
      case 'generate-report':
        // Mock report generation
        console.log('Generating analysis report...');
        break;
      case 'share-results':
        // Mock sharing functionality
        console.log('Sharing results...');
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Navigation" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-medium text-foreground">Quick Navigation</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {actionItems?.map((item, index) => (
            <Link
              key={index}
              to={item?.path}
              className={`block p-4 rounded-lg border transition-all duration-200 ${
                item?.disabled
                  ? 'border-border bg-muted/50 cursor-not-allowed opacity-60' :'border-border hover:border-primary hover:shadow-sm bg-card'
              }`}
              onClick={(e) => item?.disabled && e?.preventDefault()}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item?.color === 'primary' ? 'bg-primary/10' :
                  item?.color === 'accent' ? 'bg-accent/10' :
                  item?.color === 'secondary' ? 'bg-secondary/10' :
                  item?.color === 'success' ? 'bg-success/10' : 'bg-muted'
                }`}>
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    color={
                      item?.color === 'primary' ? 'var(--color-primary)' :
                      item?.color === 'accent' ? 'var(--color-accent)' :
                      item?.color === 'secondary' ? 'var(--color-secondary)' :
                      item?.color === 'success' ? 'var(--color-success)' : 'var(--color-muted-foreground)'
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground mb-1">{item?.title}</h4>
                  <p className="text-sm text-muted-foreground">{item?.description}</p>
                </div>
                {!item?.disabled && (
                  <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Export Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Download" size={20} color="var(--color-accent)" />
          <h3 className="text-lg font-medium text-foreground">Export & Share</h3>
        </div>
        <div className="space-y-3">
          {exportOptions?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleExportAction(option?.action)}
              disabled={option?.disabled}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg border text-left transition-all duration-200 ${
                option?.disabled
                  ? 'border-border bg-muted/50 cursor-not-allowed opacity-60' :'border-border hover:border-accent hover:bg-accent/5'
              }`}
            >
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name={option?.icon} size={16} color="var(--color-accent)" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{option?.title}</h4>
                <p className="text-sm text-muted-foreground">{option?.description}</p>
              </div>
              {!option?.disabled && (
                <Icon name="ExternalLink" size={14} color="var(--color-muted-foreground)" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Training Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={20} color="var(--color-success)" />
          <h3 className="text-lg font-medium text-foreground">System Status</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-foreground">GPU Cluster</p>
                <p className="text-xs text-muted-foreground">Available for training</p>
              </div>
            </div>
            <span className="text-xs text-success font-medium">Online</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-foreground">MLflow Server</p>
                <p className="text-xs text-muted-foreground">Experiment tracking</p>
              </div>
            </div>
            <span className="text-xs text-warning font-medium">Maintenance</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Data Pipeline</p>
                <p className="text-xs text-muted-foreground">Processing queue</p>
              </div>
            </div>
            <span className="text-xs text-success font-medium">Active</span>
          </div>
        </div>
      </div>
      {/* Help & Documentation */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="HelpCircle" size={20} color="var(--color-muted-foreground)" />
          <h3 className="text-lg font-medium text-foreground">Help & Resources</h3>
        </div>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" iconName="Book" iconPosition="left">
            LSTM Model Documentation
          </Button>
          <Button variant="ghost" className="w-full justify-start" iconName="Video" iconPosition="left">
            Training Tutorial Videos
          </Button>
          <Button variant="ghost" className="w-full justify-start" iconName="MessageCircle" iconPosition="left">
            Contact Support Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;