import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CrimeDistributionChart = () => {
  const [chartType, setChartType] = useState('pie');

  const mockDistributionData = [
    { category: 'Property Crimes', value: 2847, percentage: 42.3, color: '#F59E0B' },
    { category: 'Violent Crimes', value: 1923, percentage: 28.6, color: '#EF4444' },
    { category: 'Drug Offenses', value: 1245, percentage: 18.5, color: '#8B5CF6' },
    { category: 'Traffic Violations', value: 456, percentage: 6.8, color: '#06B6D4' },
    { category: 'Other Crimes', value: 258, percentage: 3.8, color: '#6B7280' }
  ];

  const mockSubcategoryData = [
    { name: 'Theft', value: 1245, category: 'Property' },
    { name: 'Burglary', value: 892, category: 'Property' },
    { name: 'Vandalism', value: 710, category: 'Property' },
    { name: 'Assault', value: 1156, category: 'Violent' },
    { name: 'Robbery', value: 567, category: 'Violent' },
    { name: 'Domestic Violence', value: 200, category: 'Violent' },
    { name: 'Drug Possession', value: 789, category: 'Drug' },
    { name: 'Drug Trafficking', value: 456, category: 'Drug' }
  ];

  const handleExport = (format) => {
    console.log(`Exporting distribution chart as ${format}`);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{data?.category || data?.name}</p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="font-semibold text-foreground">{data?.value?.toLocaleString()}</span>
          </p>
          {data?.percentage && (
            <p className="text-sm text-muted-foreground">
              Percentage: <span className="font-semibold text-foreground">{data?.percentage}%</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={mockDistributionData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ category, percentage }) => `${category}: ${percentage}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {mockDistributionData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry?.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={mockSubcategoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="name" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Crime Distribution Analysis</h3>
          <p className="text-sm text-muted-foreground">Breakdown of crime categories and subcategories</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Selector */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setChartType('pie')}
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                chartType === 'pie' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="PieChart" size={14} />
              <span>Pie Chart</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                chartType === 'bar' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name="BarChart3" size={14} />
              <span>Bar Chart</span>
            </button>
          </div>

          {/* Export Options */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => handleExport('png')}
            >
              PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              iconPosition="left"
              onClick={() => handleExport('pdf')}
            >
              PDF
            </Button>
          </div>
        </div>
      </div>
      {/* Chart Container */}
      <div className="w-full h-80 mb-6">
        {chartType === 'pie' ? renderPieChart() : renderBarChart()}
      </div>
      {/* Distribution Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Category Breakdown</h4>
          <div className="space-y-3">
            {mockDistributionData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-sm text-foreground">{item?.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{item?.value?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{item?.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Key Insights</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium">Property crimes dominate</p>
                <p className="text-xs text-muted-foreground">42.3% of all reported incidents</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium">Violent crimes trending down</p>
                <p className="text-xs text-muted-foreground">5.2% decrease from last quarter</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium">Drug offenses stable</p>
                <p className="text-xs text-muted-foreground">Consistent 18-19% share</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground font-medium">Seasonal patterns observed</p>
                <p className="text-xs text-muted-foreground">Peak activity in summer months</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeDistributionChart;