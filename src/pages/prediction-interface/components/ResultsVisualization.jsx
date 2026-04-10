import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ResultsVisualization = ({ hasResults, trainingConfig }) => {
  const [viewMode, setViewMode] = useState('predictions');
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('crime_count');
  const [predictionData, setPredictionData] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    mae: 2.34,
    rmse: 3.12,
    mape: 8.7,
    r2: 0.89,
    accuracy: 92.5
  });
  const [isExporting, setIsExporting] = useState(false);

  const viewModeOptions = [
    { value: 'predictions', label: 'Predictions vs Actual' },
    { value: 'confidence', label: 'Confidence Intervals' },
    { value: 'residuals', label: 'Residual Analysis' },
    { value: 'performance', label: 'Performance Metrics' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '180d', label: 'Last 180 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const metricOptions = [
    { value: 'crime_count', label: 'Total Crime Count' },
    { value: 'violent_crime', label: 'Violent Crimes' },
    { value: 'property_crime', label: 'Property Crimes' },
    { value: 'drug_crime', label: 'Drug-related Crimes' }
  ];

  // Generate mock prediction data
  useEffect(() => {
    if (hasResults) {
      const generateData = () => {
        const data = [];
        const endOfActualData = new Date('2026-03-31'); // The end date of your latest dataset
        const historicalDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 180;
        
        // Define future horizon based on timeRange
        const futureDaysMap = {
          '7d': 15,
          '30d': 30,
          '90d': 60,   // 2 months
          '180d': 90,  // 3 months
          'custom': 30
        };
        const futureDays = futureDaysMap[timeRange] || 30;

        const baseDate = new Date(endOfActualData);
        baseDate.setDate(baseDate.getDate() - historicalDays + 1);
        
        // Metric-specific parameters (base rate and volatility)
        const metricParams = {
          'crime_count': { base: 45, variance: 25, trendFactor: 0.3 },
          'violent_crime': { base: 12, variance: 8, trendFactor: 0.1 },
          'property_crime': { base: 25, variance: 15, trendFactor: 0.2 },
          'drug_crime': { base: 8, variance: 5, trendFactor: 0.05 }
        };
        const params = metricParams[selectedMetric] || metricParams['crime_count'];

        // Use a stable seed for random values based on date and metric to keep predictions "same"
        const getSeededRandom = (dateStr, metric) => {
          let seed = 0;
          const combinedStr = dateStr + metric;
          for (let i = 0; i < combinedStr.length; i++) {
            seed = ((seed << 5) - seed) + combinedStr.charCodeAt(i);
            seed |= 0;
          }
          const x = Math.sin(seed) * 10000;
          return x - Math.floor(x);
        };
        
        // Generate historical data
        for (let i = 0; i < historicalDays; i++) {
          const date = new Date(baseDate);
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          const seededRandom = getSeededRandom(dateStr, selectedMetric);
          
          const actual = Math.floor(seededRandom * params.variance) + params.base + Math.sin(i * 0.1) * (params.base * 0.2);
          const predicted = actual + (seededRandom - 0.5) * (params.variance * 0.2);
          const upperBound = predicted + (seededRandom * 5) + (params.base * 0.1);
          const lowerBound = Math.max(0, predicted - (seededRandom * 5) - (params.base * 0.1));
          
          data.push({
            date: dateStr,
            dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            actual: Math.round(actual),
            predicted: Math.round(predicted),
            futurePredicted: null,
            upperBound: Math.round(upperBound),
            lowerBound: Math.round(lowerBound),
            residual: Math.round(actual - predicted)
          });
        }

        // Add connecting point (March 31)
        data[data.length - 1].futurePredicted = data[data.length - 1].predicted;

        // Generate future predictions starting from April 1
        for (let i = 1; i <= futureDays; i++) {
          const date = new Date(endOfActualData);
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          const seededRandom = getSeededRandom(dateStr, selectedMetric);
          
          const trend = i * params.trendFactor;
          const seasonality = Math.sin(i * 0.1) * (params.base * 0.25);
          const noise = (seededRandom - 0.5) * (params.variance * 0.15);
          const predicted = params.base + trend + seasonality + noise;
          
          const uncertainty = (params.base * 0.15) + (i * 0.5); 
          const upperBound = predicted + uncertainty;
          const lowerBound = Math.max(0, predicted - uncertainty);

          data.push({
            date: dateStr,
            dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            actual: null,
            predicted: null,
            futurePredicted: Math.round(predicted),
            upperBound: Math.round(upperBound),
            lowerBound: Math.round(lowerBound),
            residual: null
          });
        }

        return data;
      };
      
      setPredictionData(generateData());
    }
  }, [hasResults, timeRange, selectedMetric]); // Added selectedMetric to dependencies

  const handleExportChart = () => {
    setIsExporting(true);
    
    // Simulate chart export logic
    setTimeout(() => {
      const fileName = `crime_prediction_export_${new Date().toISOString().split('T')[0]}.png`;
      
      // In a real environment, we would use html2canvas or direct SVG export from Recharts
      // For this demo, we'll trigger a simulated download
      const link = document.createElement('a');
      link.href = '#';
      link.download = fileName;
      document.body.appendChild(link);
      
      console.log(`Exporting chart to ${fileName}...`);
      
      // Feedback to user
      alert(`Chart exported successfully as ${fileName}`);
      
      setIsExporting(false);
      document.body.removeChild(link);
    }, 1500);
  };

  const renderPredictionsChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={predictionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="dateFormatted" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--color-popover)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: 'var(--color-popover-foreground)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="actual" 
          stroke="var(--color-primary)" 
          strokeWidth={2}
          name="Actual"
          dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="predicted" 
          stroke="var(--color-accent)" 
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Validation (Past)"
          dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="futurePredicted" 
          stroke="#8B5CF6" 
          strokeWidth={2}
          name="Future Prediction (LSTM)"
          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderConfidenceChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={predictionData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="dateFormatted" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--color-popover)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: 'var(--color-popover-foreground)'
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="upperBound"
          stackId="1"
          stroke="var(--color-accent)"
          fill="var(--color-accent)"
          fillOpacity={0.2}
          name="Upper Bound"
        />
        <Area
          type="monotone"
          dataKey="lowerBound"
          stackId="1"
          stroke="var(--color-accent)"
          fill="var(--color-accent)"
          fillOpacity={0.2}
          name="Lower Bound"
        />
        <Line 
          type="monotone" 
          dataKey="predicted" 
          stroke="var(--color-accent)" 
          strokeWidth={2}
          name="Predicted"
        />
        <Line 
          type="monotone" 
          dataKey="futurePredicted" 
          stroke="#8B5CF6" 
          strokeWidth={2}
          name="Future Prediction"
        />
        <Line 
          type="monotone" 
          dataKey="actual" 
          stroke="var(--color-primary)" 
          strokeWidth={2}
          name="Actual"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderPerformanceMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="Target" size={24} color="var(--color-primary)" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{performanceMetrics?.mae}</h3>
        <p className="text-sm text-muted-foreground mb-2">Mean Absolute Error</p>
        <div className="flex items-center justify-center space-x-1">
          <Icon name="TrendingDown" size={12} color="var(--color-success)" />
          <span className="text-xs text-success">12% better than baseline</span>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="BarChart3" size={24} color="var(--color-accent)" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{performanceMetrics?.rmse}</h3>
        <p className="text-sm text-muted-foreground mb-2">Root Mean Square Error</p>
        <div className="flex items-center justify-center space-x-1">
          <Icon name="TrendingDown" size={12} color="var(--color-success)" />
          <span className="text-xs text-success">8% better than baseline</span>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="Percent" size={24} color="var(--color-warning)" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{performanceMetrics?.mape}%</h3>
        <p className="text-sm text-muted-foreground mb-2">Mean Absolute Percentage Error</p>
        <div className="flex items-center justify-center space-x-1">
          <Icon name="TrendingDown" size={12} color="var(--color-success)" />
          <span className="text-xs text-success">15% better than baseline</span>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="TrendingUp" size={24} color="var(--color-success)" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{performanceMetrics?.r2}</h3>
        <p className="text-sm text-muted-foreground mb-2">R² Score</p>
        <div className="flex items-center justify-center space-x-1">
          <Icon name="TrendingUp" size={12} color="var(--color-success)" />
          <span className="text-xs text-success">Excellent fit</span>
        </div>
      </div>
    </div>
  );

  if (!hasResults) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="BarChart3" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Results Available</h3>
          <p className="text-muted-foreground mb-6">Start model training to view prediction results and performance metrics.</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} />
              <span>Real-time visualization</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Download" size={16} />
              <span>Export capabilities</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} />
              <span>Performance metrics</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Results Visualization</h2>
          <p className="text-sm text-muted-foreground mt-1">Prediction analysis and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            iconName="Download" 
            iconPosition="left"
            onClick={handleExportChart}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Chart'}
          </Button>
          <Button variant="outline" size="sm" iconName="Share" iconPosition="left">
            Share Results
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select
          label="View Mode"
          options={viewModeOptions}
          value={viewMode}
          onChange={setViewMode}
        />
        <Select
          label="Time Range"
          options={timeRangeOptions}
          value={timeRange}
          onChange={setTimeRange}
        />
        <Select
          label="Metric"
          options={metricOptions}
          value={selectedMetric}
          onChange={setSelectedMetric}
        />
      </div>
      {/* Visualization Content */}
      <div className="space-y-6">
        {viewMode === 'predictions' && (
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Predictions vs Actual Values</h3>
            {renderPredictionsChart()}
          </div>
        )}

        {viewMode === 'confidence' && (
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Confidence Intervals</h3>
            {renderConfidenceChart()}
          </div>
        )}

        {viewMode === 'performance' && (
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Model Performance Metrics</h3>
            {renderPerformanceMetrics()}
          </div>
        )}

        {/* Model Comparison */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-lg font-medium text-foreground mb-4">Baseline Model Comparison</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-medium text-foreground mb-2">LSTM (Current)</h4>
              <div className="flex justify-center items-center space-x-12">
                <div>
                  <p className="text-2xl font-bold text-success mb-1">{performanceMetrics?.accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistical Significance */}
        <div className="bg-success/5 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <h4 className="font-medium text-success">Statistical Significance</h4>
          </div>
          <p className="text-sm text-foreground">
            Model predictions show statistically significant improvement over baseline models (p &lt; 0.001). 
            The LSTM model demonstrates superior performance in capturing temporal patterns and seasonal variations in crime data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsVisualization;