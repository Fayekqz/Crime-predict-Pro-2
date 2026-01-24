import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CrimeStatsSummary = ({ selectedCrimeTypes, dateRange, totalIncidents }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const statsData = [
    {
      id: "total",
      label: "Total Incidents",
      value: totalIncidents || 1192,
      change: "+12.5%",
      trend: "up",
      icon: "AlertTriangle",
      color: "text-primary"
    },
    {
      id: "resolved",
      label: "Resolved Cases",
      value: 1038,
      change: "+8.3%",
      trend: "up",
      icon: "CheckCircle",
      color: "text-success"
    },
    {
      id: "active",
      label: "Active Cases",
      value: 154,
      change: "-5.2%",
      trend: "down",
      icon: "Clock",
      color: "text-warning"
    },
    {
      id: "hotspots",
      label: "Crime Hotspots",
      value: 23,
      change: "+2",
      trend: "up",
      icon: "MapPin",
      color: "text-destructive"
    }
  ];

  const crimeTypeBreakdown = [
    { type: "Property Crime", count: 456, percentage: 38.3, color: "#F59E0B" },
    { type: "Traffic Violations", count: 342, percentage: 28.7, color: "#06B6D4" },
    { type: "Violent Crime", count: 189, percentage: 15.9, color: "#EF4444" },
    { type: "Public Order", count: 123, percentage: 10.3, color: "#10B981" },
    { type: "Drug Crime", count: 82, percentage: 6.8, color: "#8B5CF6" }
  ];

  const timeDistribution = [
    { period: "00:00-06:00", count: 89, label: "Night" },
    { period: "06:00-12:00", count: 234, label: "Morning" },
    { period: "12:00-18:00", count: 456, label: "Afternoon" },
    { period: "18:00-24:00", count: 413, label: "Evening" }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <button
            className="inline-flex items-center justify-center h-6 w-6 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={isCollapsed ? "Expand summary" : "Collapse summary"}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={14} />
          </button>
          <h3 className="text-lg font-semibold text-foreground">Crime Statistics Summary</h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={14} />
          <span>Last 30 Days</span>
        </div>
      </div>
      
      <div className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[1000px] opacity-100 animate-slide-in'}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData?.map((stat) => (
          <div key={stat?.id} className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <Icon name={stat?.icon} size={16} className={stat?.color} />
              <div className={`flex items-center space-x-1 text-xs ${
                stat?.trend === "up" ? "text-success" : "text-destructive"
              }`}>
                <Icon name={stat?.trend === "up" ? "TrendingUp" : "TrendingDown"} size={12} />
                <span>{stat?.change}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat?.value?.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Crime Type Breakdown */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Crime Type Distribution</h4>
        <div className="space-y-2">
          {crimeTypeBreakdown?.map((crime, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: crime?.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground truncate">{crime?.type}</span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {crime?.count} ({crime?.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: crime?.color, 
                      width: `${crime?.percentage}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Time Distribution */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Time Distribution</h4>
        <div className="grid grid-cols-2 gap-2">
          {timeDistribution?.map((time, index) => (
            <div key={index} className="bg-muted/30 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{time?.label}</span>
                <span className="text-sm font-medium text-foreground">{time?.count}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{time?.period}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Insights */}
      <div className="bg-primary/5 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">Key Insights</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Property crimes peak during afternoon hours (12-18:00)</li>
              <li>• Downtown area shows highest crime concentration</li>
              <li>• Resolution rate improved by 8.3% compared to last month</li>
              <li>• 23 active hotspots identified for increased patrol</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CrimeStatsSummary;
