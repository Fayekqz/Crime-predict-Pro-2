import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationPanel = ({ validationResults, onDownloadReport, onFixIssues }) => {
  const { errors, warnings, summary, fieldValidation } = validationResults;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <Icon name="CheckCircle" size={16} color="var(--color-success)" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />;
      case 'error':
        return <Icon name="XCircle" size={16} color="var(--color-error)" />;
      default:
        return <Icon name="Circle" size={16} color="var(--color-muted-foreground)" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Validation Results</h3>
            <p className="text-sm text-muted-foreground">
              Data quality assessment and compliance check
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onDownloadReport}>
              <Icon name="Download" size={16} className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>
      {/* Summary Stats */}
      <div className="p-6 bg-muted/30 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{summary?.totalRows}</div>
            <div className="text-sm text-muted-foreground">Total Rows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{summary?.validRows}</div>
            <div className="text-sm text-muted-foreground">Valid Rows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{summary?.warningRows}</div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error">{summary?.errorRows}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </div>
        </div>
      </div>
      {/* Field Validation */}
      <div className="p-6 border-b border-border">
        <h4 className="text-md font-medium text-foreground mb-4">Field Validation</h4>
        <div className="space-y-3">
          {fieldValidation?.map((field, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(field?.status)}
                <div>
                  <div className="font-medium text-foreground">{field?.name}</div>
                  <div className="text-sm text-muted-foreground">{field?.description}</div>
                </div>
              </div>
              <div className={`text-sm font-medium ${getStatusColor(field?.status)}`}>
                {field?.completeness}% complete
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Errors Section */}
      {errors?.length > 0 && (
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-error flex items-center space-x-2">
              <Icon name="XCircle" size={16} />
              <span>Critical Errors ({errors?.length})</span>
            </h4>
            <Button variant="destructive" size="sm" onClick={onFixIssues}>
              <Icon name="Wrench" size={16} className="mr-2" />
              Auto-Fix Issues
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {errors?.map((error, index) => (
              <div key={index} className="p-3 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertCircle" size={16} color="var(--color-error)" className="mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-error">{error?.field}</div>
                    <div className="text-sm text-foreground">{error?.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Row {error?.row} • {error?.suggestion}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Warnings Section */}
      {warnings?.length > 0 && (
        <div className="p-6">
          <h4 className="text-md font-medium text-warning flex items-center space-x-2 mb-4">
            <Icon name="AlertTriangle" size={16} />
            <span>Warnings ({warnings?.length})</span>
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {warnings?.map((warning, index) => (
              <div key={index} className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-warning">{warning?.field}</div>
                    <div className="text-sm text-foreground">{warning?.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {warning?.affectedRows} rows affected • {warning?.suggestion}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;