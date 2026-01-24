import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProcessingOptions = ({ onOptionsChange, onStartProcessing, isProcessing }) => {
  const [options, setOptions] = useState({
    standardizeDates: true,
    validateCoordinates: true,
    detectDuplicates: true,
    fillMissingValues: false,
    normalizeAddresses: true,
    categorizecrimes: true,
    generateTimestamps: false,
    createBackup: true
  });

  const handleOptionChange = (key, value) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const processingSteps = [
    {
      key: 'standardizeDates',
      label: 'Standardize Date Formats',
      description: 'Convert all date fields to ISO 8601 format (YYYY-MM-DD)',
      icon: 'Calendar',
      recommended: true
    },
    {
      key: 'validateCoordinates',
      label: 'Validate Coordinates',
      description: 'Check latitude/longitude values are within valid ranges',
      icon: 'MapPin',
      recommended: true
    },
    {
      key: 'detectDuplicates',
      label: 'Detect Duplicates',
      description: 'Identify and flag potential duplicate crime records',
      icon: 'Copy',
      recommended: true
    },
    {
      key: 'fillMissingValues',
      label: 'Fill Missing Values',
      description: 'Use statistical methods to impute missing data points',
      icon: 'Database',
      recommended: false
    },
    {
      key: 'normalizeAddresses',
      label: 'Normalize Addresses',
      description: 'Standardize address formats and geocode when possible',
      icon: 'Home',
      recommended: true
    },
    {
      key: 'categorizecrimes',
      label: 'Categorize Crime Types',
      description: 'Group similar crime types into standardized categories',
      icon: 'Tag',
      recommended: true
    },
    {
      key: 'generateTimestamps',
      label: 'Generate Timestamps',
      description: 'Create Unix timestamps for time-series analysis',
      icon: 'Clock',
      recommended: false
    },
    {
      key: 'createBackup',
      label: 'Create Backup',
      description: 'Save original data before applying transformations',
      icon: 'Shield',
      recommended: true
    }
  ];

  const selectedCount = Object.values(options)?.filter(Boolean)?.length;
  const estimatedTime = selectedCount * 2; // 2 minutes per option

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Data Processing Options</h3>
            <p className="text-sm text-muted-foreground">
              Configure preprocessing steps for optimal data quality
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{selectedCount} steps selected</div>
              <div className="text-xs text-muted-foreground">~{estimatedTime} min processing</div>
            </div>
            <Button 
              variant="default" 
              onClick={onStartProcessing}
              disabled={isProcessing || selectedCount === 0}
              loading={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Start Processing'}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processingSteps?.map((step) => (
            <div key={step?.key} className={`p-4 border rounded-lg transition-all duration-200 ${
              options?.[step?.key] 
                ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground/50'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  options?.[step?.key] 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={step?.icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      checked={options?.[step?.key]}
                      onChange={(e) => handleOptionChange(step?.key, e?.target?.checked)}
                      disabled={isProcessing}
                    />
                    <label className="font-medium text-foreground cursor-pointer">
                      {step?.label}
                    </label>
                    {step?.recommended && (
                      <span className="px-2 py-0.5 text-xs bg-success/10 text-success rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{step?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Processing Progress */}
      {isProcessing && (
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <Icon name="Cog" size={16} color="white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Processing data...</span>
                <span className="text-sm text-muted-foreground">Step 3 of {selectedCount}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-1/3 transition-all duration-300"></div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Current step: Validating coordinate ranges and geographic boundaries...
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingOptions;