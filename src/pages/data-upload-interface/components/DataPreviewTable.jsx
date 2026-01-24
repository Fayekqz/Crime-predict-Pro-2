import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DataPreviewTable = ({ data, columns, onColumnMapping }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [mappings, setMappings] = useState({});
  const rowsPerPage = 10;

  const standardFields = [
    { key: 'date', label: 'Date', required: true },
    { key: 'time', label: 'Time', required: false },
    { key: 'crime_type', label: 'Crime Type', required: true },
    { key: 'latitude', label: 'Latitude', required: true },
    { key: 'longitude', label: 'Longitude', required: true },
    { key: 'address', label: 'Address', required: false },
    { key: 'district', label: 'District', required: false },
    { key: 'description', label: 'Description', required: false }
  ];

  const totalPages = Math.ceil(data?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data?.slice(startIndex, endIndex);

  const handleMappingChange = (originalColumn, standardField) => {
    const newMappings = { ...mappings };
    if (standardField === '') {
      delete newMappings?.[originalColumn];
    } else {
      newMappings[originalColumn] = standardField;
    }
    setMappings(newMappings);
    onColumnMapping(newMappings);
  };

  const getColumnStatus = (column) => {
    const mapping = mappings?.[column];
    if (!mapping) return 'unmapped';
    const field = standardFields?.find(f => f?.key === mapping);
    return field?.required ? 'required' : 'optional';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Data Preview</h3>
            <p className="text-sm text-muted-foreground">
              {data?.length} rows • {columns?.length} columns
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, data?.length)} of {data?.length}
            </span>
          </div>
        </div>
      </div>
      {/* Column Mapping Section */}
      <div className="p-6 bg-muted/30 border-b border-border">
        <h4 className="text-md font-medium text-foreground mb-4">Column Mapping</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {columns?.map((column) => (
            <div key={column} className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <span>{column}</span>
                <div className={`w-2 h-2 rounded-full ${
                  getColumnStatus(column) === 'required' ? 'bg-success' :
                  getColumnStatus(column) === 'optional'? 'bg-warning' : 'bg-muted-foreground'
                }`}></div>
              </label>
              <select
                value={mappings?.[column] || ''}
                onChange={(e) => handleMappingChange(column, e?.target?.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select mapping...</option>
                {standardFields?.map((field) => (
                  <option key={field?.key} value={field?.key}>
                    {field?.label} {field?.required ? '(Required)' : '(Optional)'}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns?.map((column) => (
                <th key={column} className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-border">
                  <div className="flex items-center space-x-2">
                    <span>{column}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      getColumnStatus(column) === 'required' ? 'bg-success' :
                      getColumnStatus(column) === 'optional'? 'bg-warning' : 'bg-muted-foreground'
                    }`}></div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData?.map((row, index) => (
              <tr key={index} className="hover:bg-muted/30 transition-colors duration-150">
                {columns?.map((column) => (
                  <td key={column} className="px-4 py-3 text-sm text-foreground border-b border-border">
                    <div className="max-w-xs truncate" title={row?.[column]}>
                      {row?.[column] || <span className="text-muted-foreground italic">null</span>}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreviewTable;