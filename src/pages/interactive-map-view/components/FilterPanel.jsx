import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  isCollapsed, 
  onToggleCollapse, 
  selectedCrimeTypes, 
  onCrimeTypeChange,
  dateRange,
  onDateRangeChange,
  selectedRegion,
  onRegionChange,
  showHeatmap,
  onHeatmapToggle,
  onExportData,
  selectedSeverities,
  onSeverityChange
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "2024-09-01",
    endDate: "2024-10-02"
  });

  const crimeCategories = [
    { id: "violent", label: "Violent Crime", count: 145, color: "#EF4444" },
    { id: "property", label: "Property Crime", count: 289, color: "#F59E0B" },
    { id: "drug", label: "Drug Crime", count: 67, color: "#8B5CF6" },
    { id: "traffic", label: "Traffic Violation", count: 423, color: "#06B6D4" },
    { id: "public", label: "Public Order", count: 156, color: "#10B981" },
    { id: "cyber", label: "Cyber Crime", count: 34, color: "#EC4899" },
    { id: "financial", label: "Financial Crime", count: 78, color: "#F97316" }
  ];

  const regions = [
    { id: "all", label: "All Regions", count: 1192 },
    { id: "delhi", label: "Delhi", count: 245 },
    { id: "mumbai", label: "Mumbai", count: 312 },
    { id: "bengaluru", label: "Bengaluru", count: 198 },
    { id: "chennai", label: "Chennai", count: 176 },
    { id: "kolkata", label: "Kolkata", count: 159 },
    { id: "hyderabad", label: "Hyderabad", count: 134 },
    { id: "pune", label: "Pune", count: 121 },
    { id: "ahmedabad", label: "Ahmedabad", count: 108 }
  ];

  const timeRanges = [
    { id: "today", label: "Today", value: "today" },
    { id: "week", label: "Last 7 Days", value: "7d" },
    { id: "month", label: "Last 30 Days", value: "30d" },
    { id: "quarter", label: "Last 3 Months", value: "3m" },
    { id: "year", label: "Last Year", value: "1y" },
    { id: "custom", label: "Custom Range", value: "custom" }
  ];

  const handleCrimeTypeToggle = (categoryId) => {
    const updatedTypes = selectedCrimeTypes?.includes(categoryId)
      ? selectedCrimeTypes?.filter(id => id !== categoryId)
      : [...selectedCrimeTypes, categoryId];
    onCrimeTypeChange(updatedTypes);
  };

  const handleDateRangeUpdate = (field, value) => {
    const updated = { ...customDateRange, [field]: value };
    setCustomDateRange(updated);
    onDateRangeChange(updated);
  };

  const handleSeverityToggle = (severity) => {
    const updatedSeverities = selectedSeverities?.includes(severity)
      ? selectedSeverities?.filter(s => s !== severity)
      : [...selectedSeverities, severity];
    onSeverityChange(updatedSeverities);
  };

  const clearAllFilters = () => {
    onCrimeTypeChange([]);
    onRegionChange("all");
    setSearchTerm("");
    onDateRangeChange({ startDate: "", endDate: "" });
    onSeverityChange(["High", "Medium", "Low"]);
  };

  const totalCrimes = crimeCategories?.reduce((sum, cat) => sum + cat?.count, 0);
  const filteredCount = selectedCrimeTypes?.length === 0 
    ? totalCrimes 
    : crimeCategories?.filter(cat => selectedCrimeTypes?.includes(cat?.id))?.reduce((sum, cat) => sum + cat?.count, 0);

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ease-out ${
      isCollapsed ? 'w-0 overflow-hidden' : 'w-80'
    }`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={18} color="var(--color-primary)" />
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
            <Icon name="PanelRightClose" size={16} />
          </Button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search */}
          <div>
            <Input
              type="search"
              placeholder="Search locations, case numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Current View</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{filteredCount?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Incidents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">87%</p>
                <p className="text-xs text-muted-foreground">Resolution Rate</p>
              </div>
            </div>
          </div>

          {/* Time Range */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Time Range</h3>
            <div className="space-y-2">
              {timeRanges?.map((range) => (
                <label key={range?.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="timeRange"
                    value={range?.value}
                    checked={dateRange === range?.value}
                    onChange={(e) => onDateRangeChange(e?.target?.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-foreground">{range?.label}</span>
                </label>
              ))}
            </div>
            
            {dateRange === "custom" && (
              <div className="mt-3 space-y-2">
                <Input
                  type="date"
                  label="Start Date"
                  value={customDateRange?.startDate}
                  onChange={(e) => handleDateRangeUpdate('startDate', e?.target?.value)}
                />
                <Input
                  type="date"
                  label="End Date"
                  value={customDateRange?.endDate}
                  onChange={(e) => handleDateRangeUpdate('endDate', e?.target?.value)}
                />
              </div>
            )}
          </div>

          {/* Crime Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Crime Categories</h3>
              <Button 
                variant="ghost" 
                size="xs"
                onClick={() => onCrimeTypeChange([])}
              >
                Clear All
              </Button>
            </div>
            <div className="space-y-2">
              {crimeCategories?.map((category) => (
                <div key={category?.id} className="flex items-center justify-between">
                  <Checkbox
                    checked={selectedCrimeTypes?.includes(category?.id)}
                    onChange={() => handleCrimeTypeToggle(category?.id)}
                    label={
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category?.color }}
                        />
                        <span className="text-sm text-foreground">{category?.label}</span>
                      </div>
                    }
                  />
                  <span className="text-xs text-muted-foreground font-medium">
                    {category?.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Regions */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Geographic Regions</h3>
            <div className="space-y-2">
              {regions?.map((region) => (
                <label key={region?.id} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="region"
                      value={region?.id}
                      checked={selectedRegion === region?.id}
                      onChange={(e) => onRegionChange(e?.target?.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">{region?.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {region?.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Map Display Options */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Display Options</h3>
            <div className="space-y-3">
              <Checkbox
                checked={showHeatmap}
                onChange={onHeatmapToggle}
                label="Show Crime Heatmap"
              />
              <Checkbox
                defaultChecked
                label="Cluster Markers"
              />
              <Checkbox
                defaultChecked
                label="Show Police Stations"
              />
              <Checkbox
                label="Show Traffic Cameras"
              />
            </div>
          </div>

          {/* Severity Filter */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Crime Severity</h3>
            <div className="space-y-2">
              {["High", "Medium", "Low"]?.map((severity) => (
                <Checkbox
                  key={severity}
                  checked={selectedSeverities?.includes(severity)}
                  onChange={() => handleSeverityToggle(severity)}
                  label={
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        severity === "High" ? "bg-red-500" :
                        severity === "Medium" ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                      <span className="text-sm text-foreground">{severity} Severity</span>
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Button 
            variant="outline" 
            fullWidth 
            onClick={clearAllFilters}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset Filters
          </Button>
          <Button 
            variant="default" 
            fullWidth
            iconName="Download"
            iconPosition="left"
            onClick={() => onExportData && onExportData('csv')}
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
