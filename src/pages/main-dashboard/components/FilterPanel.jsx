import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { start: '2024-01-01', end: '2026-03-31' },
    region: '',
    city: '',
    crimeTypes: [],
    timeOfDay: '',
    severity: ''
  });

  const regionOptions = [
    { value: '', label: 'All Regions' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'bengaluru', label: 'Bengaluru' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'pune', label: 'Pune' },
    { value: 'ahmedabad', label: 'Ahmedabad' }
  ];

  const cityOptions = [
    { value: '', label: 'All Cities' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'bengaluru', label: 'Bengaluru' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'pune', label: 'Pune' },
    { value: 'ahmedabad', label: 'Ahmedabad' }
  ];

  const crimeTypeOptions = [
    { value: 'violent', label: 'Violent Crimes' },
    { value: 'property', label: 'Property Crimes' },
    { value: 'drug', label: 'Drug Offenses' },
    { value: 'traffic', label: 'Traffic Violations' },
    { value: 'fraud', label: 'Fraud & Financial' },
    { value: 'cyber', label: 'Cyber Crimes' },
    { value: 'domestic', label: 'Domestic Violence' },
    { value: 'other', label: 'Other Crimes' }
  ];

  const timeOfDayOptions = [
    { value: '', label: 'All Times' },
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-12AM)' },
    { value: 'night', label: 'Night (12AM-6AM)' }
  ];

  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'low', label: 'Low Severity' },
    { value: 'medium', label: 'Medium Severity' },
    { value: 'high', label: 'High Severity' },
    { value: 'critical', label: 'Critical Severity' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const newDateRange = { ...filters?.dateRange, [type]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: { start: '2024-01-01', end: '2026-03-31' },
      region: '',
      city: '',
      crimeTypes: [],
      timeOfDay: '',
      severity: ''
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.region) count++;
    if (filters?.city) count++;
    if (filters?.crimeTypes?.length > 0) count++;
    if (filters?.timeOfDay) count++;
    if (filters?.severity) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Advanced Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={resetFilters}
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      {/* Always Visible Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          label="Start Date"
          type="date"
          value={filters?.dateRange?.start}
          onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
          className="w-full"
        />
        
        <Input
          label="End Date"
          type="date"
          value={filters?.dateRange?.end}
          onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
          className="w-full"
        />
        
        <Select
          label="Region"
          options={regionOptions}
          value={filters?.region}
          onChange={(value) => handleFilterChange('region', value)}
          placeholder="Select region..."
          className="w-full"
        />
        
        <Select
          label="Crime Types"
          options={crimeTypeOptions}
          value={filters?.crimeTypes}
          onChange={(value) => handleFilterChange('crimeTypes', value)}
          placeholder="Select crime types..."
          multiple
          searchable
          className="w-full"
        />
      </div>
      {/* Expandable Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border animate-slide-in">
          <Select
            label="City/Area"
            options={cityOptions}
            value={filters?.city}
            onChange={(value) => handleFilterChange('city', value)}
            placeholder="Select city..."
            className="w-full"
          />
          
          <Select
            label="Time of Day"
            options={timeOfDayOptions}
            value={filters?.timeOfDay}
            onChange={(value) => handleFilterChange('timeOfDay', value)}
            placeholder="Select time period..."
            className="w-full"
          />
          
          <Select
            label="Severity Level"
            options={severityOptions}
            value={filters?.severity}
            onChange={(value) => handleFilterChange('severity', value)}
            placeholder="Select severity..."
            className="w-full"
          />
        </div>
      )}
      {/* Filter Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters?.region && (
              <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
                <span>Region: {regionOptions?.find(r => r?.value === filters?.region)?.label}</span>
                <button onClick={() => handleFilterChange('region', '')}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.city && (
              <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
                <span>City: {cityOptions?.find(c => c?.value === filters?.city)?.label}</span>
                <button onClick={() => handleFilterChange('city', '')}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.crimeTypes?.length > 0 && (
              <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
                <span>Types: {filters?.crimeTypes?.length} selected</span>
                <button onClick={() => handleFilterChange('crimeTypes', [])}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.timeOfDay && (
              <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
                <span>Time: {timeOfDayOptions?.find(t => t?.value === filters?.timeOfDay)?.label}</span>
                <button onClick={() => handleFilterChange('timeOfDay', '')}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {filters?.severity && (
              <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
                <span>Severity: {severityOptions?.find(s => s?.value === filters?.severity)?.label}</span>
                <button onClick={() => handleFilterChange('severity', '')}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
