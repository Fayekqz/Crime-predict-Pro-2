import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CrimeDistributionChart = ({ data: externalData }) => {
  const [chartType, setChartType] = useState('pie');
  const [distributionData, setDistributionData] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);

  const isViolent = (v) => {
    const s = String(v || '').toLowerCase();
    return /assault|homicide|robbery|violent|weapon/i.test(s);
  };
  const isProperty = (v) => {
    const s = String(v || '').toLowerCase();
    return /theft|burglary|vandalism|larceny|property|arson|fraud/i.test(s);
  };
  const isDrug = (v) => {
    const s = String(v || '').toLowerCase();
    return /drug|narcotic|substance/i.test(s);
  };

  useEffect(() => {
    const computeDistribution = (rows) => {
      if (!Array.isArray(rows) || rows.length === 0) {
        setDistributionData([]);
        setSubcategoryData([]);
        return;
      }

      const counts = {
        property: 0,
        violent: 0,
        drug: 0,
        traffic: 0,
        other: 0
      };

      const subCounts = {};

      rows.forEach(r => {
        const cat = (r?.category ?? r?.type ?? r?.Crime_Type ?? '').toLowerCase();
        let mainCat = 'other';
        
        if (isProperty(cat)) mainCat = 'property';
        else if (isViolent(cat)) mainCat = 'violent';
        else if (isDrug(cat)) mainCat = 'drug';
        else if (/traffic/.test(cat)) mainCat = 'traffic';
        
        counts[mainCat]++;

        // Subcategory counts
        const subName = r?.type ?? r?.Crime_Type ?? 'Other';
        subCounts[subName] = (subCounts[subName] || 0) + 1;
      });

      const total = rows.length;
      const dist = [
        { category: 'Property Crimes', value: counts.property, percentage: Number(((counts.property / total) * 100).toFixed(1)), color: '#F59E0B' },
        { category: 'Violent Crimes', value: counts.violent, percentage: Number(((counts.violent / total) * 100).toFixed(1)), color: '#EF4444' },
        { category: 'Drug Offenses', value: counts.drug, percentage: Number(((counts.drug / total) * 100).toFixed(1)), color: '#8B5CF6' },
        { category: 'Traffic Violations', value: counts.traffic, percentage: Number(((counts.traffic / total) * 100).toFixed(1)), color: '#06B6D4' },
        { category: 'Other Crimes', value: counts.other, percentage: Number(((counts.other / total) * 100).toFixed(1)), color: '#6B7280' }
      ].filter(d => d.value > 0);

      const subDist = Object.entries(subCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Top 10 subcategories

      setDistributionData(dist);
      setSubcategoryData(subDist);
    };

    if (externalData) {
      computeDistribution(externalData);
    } else {
      const raw = localStorage.getItem('crime_data_uploaded');
      if (raw) computeDistribution(JSON.parse(raw));
    }
  }, [externalData]);

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
          data={distributionData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ category, percentage }) => `${category}: ${percentage}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {distributionData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry?.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={subcategoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="name" 
          stroke="var(--color-muted-foreground)"
          fontSize={10}
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
          <p className="text-sm text-muted-foreground">Categorical breakdown of reported incidents</p>
        </div>
        
        <div className="flex items-center bg-muted/50 p-1 rounded-lg">
          <button 
            onClick={() => setChartType('pie')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${chartType === 'pie' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Pie Chart
          </button>
          <button 
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${chartType === 'bar' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Bar Chart
          </button>
        </div>
      </div>

      <div className="h-[350px] w-full">
        {chartType === 'pie' ? renderPieChart() : renderBarChart()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-border">
        {/* Category Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Category Breakdown</h4>
          <div className="space-y-3">
            {distributionData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-sm text-foreground">{item?.category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-medium text-foreground">{item?.value?.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground w-12 text-right">{item?.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend/Info */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 p-2 bg-primary/10 rounded-full">
              <Icon name="Info" size={16} className="text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">About this distribution</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This analysis shows the distribution of crimes across major categories based on the current filtered dataset. 
                Switch to Bar Chart view to see specific sub-categories like Theft, Assault, or Burglary.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('PNG')}>
                  <Icon name="Download" size={14} className="mr-2" />
                  PNG
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('PDF')}>
                  <Icon name="FileText" size={14} className="mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeDistributionChart;
