import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FileUploadZone from './components/FileUploadZone';
import DataPreviewTable from './components/DataPreviewTable';
import ValidationPanel from './components/ValidationPanel';
import ProcessingOptions from './components/ProcessingOptions';
import UploadHistory from './components/UploadHistory';

const DataUploadInterface = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState(null);
  const [columnMappings, setColumnMappings] = useState({});
  const [validationResults, setValidationResults] = useState(null);
  const [processingOptions, setProcessingOptions] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const parseCsv = async (file) => {
    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });

    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const headerLine = lines[0];
    const headers = parseCsvLine(headerLine);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      if (cols.length === 0) continue;
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = cols[j] ?? '';
      }
      rows.push(row);
    }
    return rows;
  };

  const parseCsvLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
    }
    result.push(current);
    return result.map(s => s.trim());
  };

  // Mock data for demonstration
  const mockPreviewData = [
    {
      "Date": "2023-10-15",
      "Time": "14:30:00",
      "Crime_Type": "Theft",
      "Latitude": "41.8781",
      "Longitude": "-87.6298",
      "Address": "123 Main St",
      "District": "Central",
      "Description": "Bicycle theft from parking area"
    },
    {
      "Date": "2023-10-15",
      "Time": "16:45:00",
      "Crime_Type": "Assault",
      "Latitude": "41.8850",
      "Longitude": "-87.6200",
      "Address": "456 Oak Ave",
      "District": "North",
      "Description": "Minor altercation between individuals"
    },
    {
      "Date": "2023-10-16",
      "Time": "09:15:00",
      "Crime_Type": "Vandalism",
      "Latitude": "41.8700",
      "Longitude": "-87.6400",
      "Address": "789 Pine St",
      "District": "South",
      "Description": "Graffiti on public property"
    },
    {
      "Date": "2023-10-16",
      "Time": "22:30:00",
      "Crime_Type": "Burglary",
      "Latitude": "41.8900",
      "Longitude": "-87.6100",
      "Address": "321 Elm Dr",
      "District": "West",
      "Description": "Residential break-in, electronics stolen"
    },
    {
      "Date": "2023-10-17",
      "Time": "11:20:00",
      "Crime_Type": "Drug Offense",
      "Latitude": "41.8750",
      "Longitude": "-87.6350",
      "Address": "654 Cedar Blvd",
      "District": "Central",
      "Description": "Possession of controlled substance"
    }
  ];

  const mockValidationResults = {
    errors: [
      {
        field: "Latitude",
        message: "Invalid coordinate format",
        row: 45,
        suggestion: "Use decimal degrees format (e.g., 41.8781)"
      },
      {
        field: "Date",
        message: "Inconsistent date format",
        row: 127,
        suggestion: "Standardize to YYYY-MM-DD format"
      }
    ],
    warnings: [
      {
        field: "Address",
        message: "Missing address information",
        affectedRows: 23,
        suggestion: "Consider geocoding from coordinates"
      },
      {
        field: "Description",
        message: "Inconsistent text formatting",
        affectedRows: 67,
        suggestion: "Apply text normalization"
      }
    ],
    summary: {
      totalRows: 1250,
      validRows: 1180,
      warningRows: 90,
      errorRows: 2
    },
    fieldValidation: [
      { name: "Date", status: "success", completeness: 100, description: "All dates present and valid" },
      { name: "Time", status: "success", completeness: 98, description: "Most timestamps available" },
      { name: "Crime_Type", status: "success", completeness: 100, description: "All crime types categorized" },
      { name: "Latitude", status: "warning", completeness: 95, description: "Some invalid coordinates" },
      { name: "Longitude", status: "warning", completeness: 95, description: "Some invalid coordinates" },
      { name: "Address", status: "warning", completeness: 82, description: "Missing address data" },
      { name: "District", status: "success", completeness: 100, description: "All districts mapped" },
      { name: "Description", status: "success", completeness: 89, description: "Most descriptions available" }
    ]
  };

  const handleFileSelect = async (file) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const parsed = await parseCsv(file);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsUploading(false);
            setPreviewData(parsed);
            setValidationResults(mockValidationResults);
            setActiveTab('preview');
            try {
              const normalized = (parsed || []).map((row, idx) => {
                const getVal = (keys) => {
                  for (const k of keys) {
                    if (row[k] !== undefined) return row[k];
                  }
                  return '';
                };
                const date = getVal(['Date', 'date']);
                const time = getVal(['Time', 'time']);
                const type = getVal(['Crime_Type', 'crime_type', 'Type', 'type', 'Category', 'category', 'crime_category']);
                const latRaw = getVal(['Latitude', 'latitude', 'Lat', 'lat']);
                const lngRaw = getVal(['Longitude', 'longitude', 'Long', 'Lng', 'lng']);
                const address = getVal(['Address', 'address', 'Location', 'location']);
                const district = getVal(['District', 'district', 'Region', 'region', 'Area', 'area']);
                const description = getVal(['Description', 'description', 'Desc', 'desc']);
                const status = getVal(['Status', 'status']);
                const responseRaw = getVal(['Response_Time_Minutes', 'response_time_minutes', 'ResponseTime', 'responseTime']);

                const lat = parseFloat(latRaw);
                const lng = parseFloat(lngRaw);

                const responseMinutes = (responseRaw && isFinite(parseFloat(responseRaw))) ? parseFloat(responseRaw) : null;

                return {
                  id: idx + 1,
                  type: type || 'Unknown',
                  category: type || 'Unknown',
                  date: date || '',
                  time: time || '',
                  location: address || '',
                  coordinates: (isFinite(lat) && isFinite(lng)) ? [lat, lng] : null,
                  severity: 'Medium',
                  status: status || 'Active',
                  description: description || '',
                  caseNumber: `UP-${Date.now()}-${idx + 1}`,
                  district: district || '',
                  responseMinutes
                };
              });

              try {
                localStorage.setItem('crime_data_uploaded', JSON.stringify(normalized));
              } catch (e) {
                if (e.name === 'QuotaExceededError' || e.code === 22) {
                   console.warn('Storage quota exceeded, saving latest 5000 records');
                   const subset = normalized.slice(-5000);
                   localStorage.setItem('crime_data_uploaded', JSON.stringify(subset));
                } else {
                   console.error('Failed to persist uploaded data:', e);
                }
              }

            } catch (e) {
              console.error('Failed to process data:', e);
            }
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    } catch (e) {
      setIsUploading(false);
      console.error('Failed to parse CSV:', e);
    }
  };

  const handleColumnMapping = (mappings) => {
    setColumnMappings(mappings);
  };

  const handleDownloadReport = () => {
    // Mock download functionality
    console.log('Downloading validation report...');
  };

  const handleFixIssues = () => {
    // Mock auto-fix functionality
    console.log('Auto-fixing validation issues...');
  };

  const handleOptionsChange = (options) => {
    setProcessingOptions(options);
  };

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const normalized = (previewData || []).map((row, idx) => {
        const getVal = (keys) => {
          for (const k of keys) {
            if (row[k] !== undefined) return row[k];
          }
          return '';
        };
        const mapKey = (target) => {
          const entry = Object.entries(columnMappings).find(([orig, t]) => t === target);
          return entry ? entry[0] : null;
        };
        const dateKey = mapKey('date') || 'Date';
        const timeKey = mapKey('time') || 'Time';
        const typeKey = mapKey('crime_type') || 'Crime_Type';
        const latKey = mapKey('latitude') || 'Latitude';
        const lngKey = mapKey('longitude') || 'Longitude';
        const addrKey = mapKey('address') || 'Address';
        const distKey = mapKey('district') || 'District';
        const descKey = mapKey('description') || 'Description';
        const statusKey = mapKey('status') || 'Status';
        const respKey = mapKey('response_time_minutes') || 'Response_Time_Minutes';

        const lat = parseFloat(getVal([latKey])) || null;
        const lng = parseFloat(getVal([lngKey])) || null;

        return {
          id: idx + 1,
          type: getVal([typeKey]) || 'Unknown',
          category: getVal([typeKey]) || 'Unknown',
          date: getVal([dateKey]) || '',
          time: getVal([timeKey]) || '',
          location: getVal([addrKey]) || '',
          coordinates: lat != null && lng != null ? [lat, lng] : null,
          severity: 'Medium',
          status: getVal([statusKey]) || 'Active',
          description: getVal([descKey]) || '',
          caseNumber: `UP-${Date.now()}-${idx + 1}`,
          district: getVal([distKey]) || '',
          responseMinutes: (function(){
            const v = getVal([respKey]);
            const num = parseFloat(v);
            return isFinite(num) ? num : null;
          })()
        };
      });

      try {
        localStorage.setItem('crime_data_uploaded', JSON.stringify(normalized));
      } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            console.warn('Storage quota exceeded, saving latest 5000 records');
            const subset = normalized.slice(-5000);
            localStorage.setItem('crime_data_uploaded', JSON.stringify(subset));
        } else {
            console.error('Failed to persist uploaded data:', e);
        }
      }

      setIsProcessing(false);
      navigate('/interactive-map-view');
    }, 2000);
  };

  const handleSelectDataset = (dataset) => {
    console.log('Selected dataset:', dataset);
  };

  const tabs = [
    { id: 'upload', label: 'Upload', icon: 'Upload' },
    { id: 'preview', label: 'Preview', icon: 'Eye', disabled: !previewData },
    { id: 'validation', label: 'Validation', icon: 'CheckCircle', disabled: !validationResults },
    { id: 'processing', label: 'Processing', icon: 'Settings', disabled: !validationResults },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  return (
    <>
      <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Upload" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Data Upload Interface</h1>
                <p className="text-muted-foreground">
                  Import and validate crime datasets for analysis and prediction
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => !tab?.disabled && setActiveTab(tab?.id)}
                    disabled={tab?.disabled}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary'
                        : tab?.disabled
                        ? 'border-transparent text-muted-foreground cursor-not-allowed opacity-50'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <FileUploadZone
                  onFileSelect={handleFileSelect}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Icon name="Database" size={20} color="var(--color-success)" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">5</div>
                        <div className="text-sm text-muted-foreground">Total Datasets</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="BarChart3" size={20} color="var(--color-primary)" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">452K</div>
                        <div className="text-sm text-muted-foreground">Total Records</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                        <Icon name="Clock" size={20} color="var(--color-warning)" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">1</div>
                        <div className="text-sm text-muted-foreground">Processing</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon name="TrendingUp" size={20} color="var(--color-accent)" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">94%</div>
                        <div className="text-sm text-muted-foreground">Avg Quality</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && previewData && (
              <DataPreviewTable
                data={previewData}
                columns={Object.keys(previewData?.[0])}
                onColumnMapping={handleColumnMapping}
              />
            )}

            {activeTab === 'validation' && validationResults && (
              <ValidationPanel
                validationResults={validationResults}
                onDownloadReport={handleDownloadReport}
                onFixIssues={handleFixIssues}
              />
            )}

            {activeTab === 'processing' && validationResults && (
              <ProcessingOptions
                onOptionsChange={handleOptionsChange}
                onStartProcessing={handleStartProcessing}
                isProcessing={isProcessing}
              />
            )}

            {activeTab === 'history' && (
              <UploadHistory onSelectDataset={handleSelectDataset} />
            )}
          </div>

          {/* Action Bar */}
          {(activeTab === 'preview' || activeTab === 'validation') && (
            <div className="fixed bottom-6 right-6 bg-card border border-border rounded-lg shadow-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  {uploadedFile?.name} • {previewData?.length} rows
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => setActiveTab('upload')}>
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Back
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => setActiveTab(activeTab === 'preview' ? 'validation' : 'processing')}
                  >
                    Next
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
    </>
  );
};

export default DataUploadInterface;
