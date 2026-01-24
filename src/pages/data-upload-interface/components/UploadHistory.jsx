import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadHistory = ({ onSelectDataset }) => {
  const [selectedDataset, setSelectedDataset] = useState(null);

  const uploadHistory = [
    {
      id: 1,
      filename: "chicago_crime_2023.csv",
      uploadDate: "2024-10-01T14:30:00Z",
      size: "45.2 MB",
      rows: 125847,
      status: "processed",
      validationScore: 98,
      processingTime: "4m 32s",
      lastUsed: "2024-10-02T08:15:00Z"
    },
    {
      id: 2,
      filename: "nyc_incidents_q3_2023.csv",
      uploadDate: "2024-09-28T10:45:00Z",
      size: "78.9 MB",
      rows: 234567,
      status: "processed",
      validationScore: 95,
      processingTime: "7m 18s",
      lastUsed: "2024-09-30T16:22:00Z"
    },
    {
      id: 3,
      filename: "la_crime_data_2023.csv",
      uploadDate: "2024-09-25T16:20:00Z",
      size: "32.1 MB",
      rows: 89234,
      status: "processing",
      validationScore: null,
      processingTime: null,
      lastUsed: null
    },
    {
      id: 4,
      filename: "boston_police_reports.csv",
      uploadDate: "2024-09-22T09:15:00Z",
      size: "12.8 MB",
      rows: 34567,
      status: "failed",
      validationScore: 67,
      processingTime: null,
      lastUsed: null,
      error: "Invalid coordinate format in 23% of records"
    },
    {
      id: 5,
      filename: "seattle_crime_incidents.csv",
      uploadDate: "2024-09-20T13:40:00Z",
      size: "28.7 MB",
      rows: 67890,
      status: "processed",
      validationScore: 92,
      processingTime: "3m 45s",
      lastUsed: "2024-09-28T11:30:00Z"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return <Icon name="CheckCircle" size={16} color="var(--color-success)" />;
      case 'processing':
        return <Icon name="Loader" size={16} color="var(--color-warning)" className="animate-spin" />;
      case 'failed':
        return <Icon name="XCircle" size={16} color="var(--color-error)" />;
      default:
        return <Icon name="Circle" size={16} color="var(--color-muted-foreground)" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed':
        return 'text-success';
      case 'processing':
        return 'text-warning';
      case 'failed':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDatasetSelect = (dataset) => {
    setSelectedDataset(dataset?.id);
    onSelectDataset(dataset);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Upload History</h3>
            <p className="text-sm text-muted-foreground">
              Recent dataset uploads and processing status
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Filter" size={16} className="mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              Export List
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Dataset</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Size</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Quality</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Upload Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadHistory?.map((dataset) => (
              <tr 
                key={dataset?.id} 
                className={`hover:bg-muted/30 transition-colors duration-150 cursor-pointer ${
                  selectedDataset === dataset?.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
                onClick={() => handleDatasetSelect(dataset)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={16} color="var(--color-muted-foreground)" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{dataset?.filename}</div>
                      <div className="text-sm text-muted-foreground">
                        {dataset?.rows?.toLocaleString()} rows
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(dataset?.status)}
                    <span className={`text-sm font-medium capitalize ${getStatusColor(dataset?.status)}`}>
                      {dataset?.status}
                    </span>
                  </div>
                  {dataset?.error && (
                    <div className="text-xs text-error mt-1">{dataset?.error}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{dataset?.size}</div>
                  {dataset?.processingTime && (
                    <div className="text-xs text-muted-foreground">
                      Processed in {dataset?.processingTime}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {dataset?.validationScore !== null ? (
                    <div className="flex items-center space-x-2">
                      <div className={`text-sm font-medium ${
                        dataset?.validationScore >= 95 ? 'text-success' :
                        dataset?.validationScore >= 80 ? 'text-warning': 'text-error'
                      }`}>
                        {dataset?.validationScore}%
                      </div>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            dataset?.validationScore >= 95 ? 'bg-success' :
                            dataset?.validationScore >= 80 ? 'bg-warning': 'bg-error'
                          }`}
                          style={{ width: `${dataset?.validationScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">{formatDate(dataset?.uploadDate)}</div>
                  {dataset?.lastUsed && (
                    <div className="text-xs text-muted-foreground">
                      Last used: {formatDate(dataset?.lastUsed)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {dataset?.status === 'processed' && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Icon name="Eye" size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Icon name="Download" size={14} />
                        </Button>
                      </>
                    )}
                    {dataset?.status === 'failed' && (
                      <Button variant="ghost" size="sm">
                        <Icon name="RefreshCw" size={14} />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>Showing {uploadHistory?.length} datasets</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Processed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span>Failed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadHistory;