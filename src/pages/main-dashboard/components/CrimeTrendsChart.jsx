import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CrimeTrendsChart = ({ data: externalData }) => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedCategories, setSelectedCategories] = useState(['total', 'violent', 'property']);
  const [chartData, setChartData] = useState({ daily: [], weekly: [], monthly: [] });
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Re-compute when data prop changes
  useEffect(() => {
    if (externalData) {
      setChartData(computeData(externalData));
    } else {
      const raw = localStorage.getItem('crime_data_uploaded');
      if (raw) {
        setChartData(computeData(JSON.parse(raw)));
      }
    }
  }, [externalData]);

  const isViolent = (v) => {
    const s = String(v || '').toLowerCase();
    return /assault|homicide|robbery|violent/.test(s);
  };
  const isProperty = (v) => {
    const s = String(v || '').toLowerCase();
    return /theft|burglary|vandalism|larceny|property/.test(s);
  };
  const isDrug = (v) => {
    const s = String(v || '').toLowerCase();
    return /drug/.test(s);
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    
    // Try DD/MM/YYYY or DD-MM-YYYY
    const match = String(dateStr).match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (match) {
        const [_, day, month, year] = match;
        const d2 = new Date(`${year}-${month}-${day}`);
        if (!isNaN(d2.getTime())) return d2;
    }
    return null;
  };

  const computeData = (rows) => {
    // 1. Identify valid rows and parse dates
    if (!Array.isArray(rows)) return { daily: [], weekly: [], monthly: [] };
    const validRows = [];
    let minTime = Infinity;
    let maxTime = -Infinity;

    for (const r of rows || []) {
      const dateStr = r?.date || r?.Date || '';
      const d = parseDate(dateStr);
      if (d) {
        const time = d.getTime();
        if (time < minTime) minTime = time;
        if (time > maxTime) maxTime = time;
        validRows.push({ ...r, _parsedDate: d });
      }
    }

    if (validRows.length === 0) return { daily: [], weekly: [], monthly: [] };

    // 2. Generate all months in range (YYYY-MM)
    const months = [];
    const minDate = new Date(minTime);
    const maxDate = new Date(maxTime);
    
    // Start from the first day of the min month
    const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    // End at the last day of the max month
    const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);

    while (current <= end) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      months.push(`${y}-${m}`);
      current.setMonth(current.getMonth() + 1);
    }

    // 3. Initialize map with 0s for all months
    const monthlyMap = new Map();
    months.forEach(m => {
      monthlyMap.set(m, { 
        date: m, 
        total: 0, 
        violent: 0, 
        property: 0, 
        drug: 0, 
        other: 0 
      });
    });

    // 4. Aggregate data
    for (const r of validRows) {
      const d = r._parsedDate;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const monthKey = `${y}-${m}`;
      
      if (monthlyMap.has(monthKey)) {
        const entry = monthlyMap.get(monthKey);
        const cat = r?.category ?? r?.type;

        entry.total += 1;
        if (isViolent(cat)) entry.violent += 1;
        else if (isProperty(cat)) entry.property += 1;
        else if (isDrug(cat)) entry.drug += 1;
        else entry.other += 1;
      }
    }

    const monthly = Array.from(monthlyMap.values());
    return { daily: [], weekly: [], monthly };
  };

  const categoryColors = {
    total: '#1E40AF',
    violent: '#EF4444',
    property: '#F59E0B',
    drug: '#8B5CF6',
    other: '#6B7280'
  };

  const categoryLabels = {
    total: 'Total Crimes',
    violent: 'Violent Crimes',
    property: 'Property Crimes',
    drug: 'Drug Offenses',
    other: 'Other Crimes'
  };

  const handleExport = (format) => {
    console.log(`Exporting chart as ${format}`);
    // Mock export functionality
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev?.includes(category) 
        ? prev?.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Crime Trends Analysis</h3>
          <p className="text-sm text-muted-foreground">Interactive visualization of crime patterns over time</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            iconName={isCollapsed ? "ChevronDown" : "ChevronUp"}
            iconPosition="left"
            aria-label={isCollapsed ? "Expand chart" : "Collapse chart"}
          >
            {isCollapsed ? 'Expand' : 'Collapse'}
          </Button>
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
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[1000px] opacity-100'}`}>
        {/* Category Legend */}
        <div className="flex flex-wrap gap-4 mb-6 animate-slide-in">
          {Object.entries(categoryLabels)?.map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                selectedCategories?.includes(key)
                  ? 'border-primary bg-primary/5 text-primary' :'border-border bg-background text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColors?.[key] }}
              />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
        {/* Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData?.monthly} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => {
                  if (!value) return '';
                  const [y, m] = value.split('-');
                  const date = new Date(parseInt(y), parseInt(m) - 1);
                  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
                }}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                labelFormatter={(label) => {
                  if (!label) return '';
                  const [y, m] = label.split('-');
                  const date = new Date(parseInt(y), parseInt(m) - 1);
                  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
                }}
              />
              <Legend />
              {selectedCategories?.map(category => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={categoryColors?.[category]}
                  strokeWidth={2}
                  dot={{ fill: categoryColors?.[category], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: categoryColors?.[category], strokeWidth: 2 }}
                  name={categoryLabels?.[category]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Chart Statistics */}
        <div className="mt-6 pt-4 border-t border-border">
          {(function(){
            const data = chartData?.monthly || [];
            const totals = data.map(d => d.total);
            const peakIdx = totals.length ? totals.indexOf(Math.max(...totals)) : -1;
            const peakLabel = peakIdx >= 0 ? data[peakIdx]?.date : 'N/A';
            const avgDaily = (function(){
              if (!data.length) return 'N/A';
              const sum = data.reduce((s,d)=>s+(d.total||0),0);
              return Number((sum/data.length).toFixed(1));
            })();
            const trendPct = (function(){
              if (data.length < 2) return 'N/A';
              const current = data[data.length - 1].total;
              const previous = data[data.length - 2].total;
              if (previous === 0) return 'N/A';
              const diff = ((current - previous) / previous) * 100;
              return Number(diff.toFixed(1));
            })();
            const trendPositive = typeof trendPct === 'number' && trendPct >= 0;
            const confidence = 100;
            return (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Peak Month</p>
                  <p className="text-lg font-semibold text-foreground">{peakLabel}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg Monthly</p>
                  <p className="text-lg font-semibold text-foreground">{avgDaily}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Trend</p>
                  <div className={`flex items-center justify-center space-x-1 ${trendPositive? 'text-success':'text-error'}`}>
                    <Icon name={trendPositive? 'TrendingUp':'TrendingDown'} size={16} />
                    <p className="text-lg font-semibold">{typeof trendPct==='number'? `${trendPct}%` : 'N/A'}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-lg font-semibold text-foreground">{confidence}%</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default CrimeTrendsChart;
