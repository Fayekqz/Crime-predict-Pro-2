import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExperimentTable = ({ experiments, onViewDetails, onCompare }) => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedExperiments, setSelectedExperiments] = useState([]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectExperiment = (experimentId) => {
    setSelectedExperiments(prev => 
      prev?.includes(experimentId) 
        ? prev?.filter(id => id !== experimentId)
        : [...prev, experimentId]
    );
  };

  const sortedExperiments = [...experiments]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'running': return 'text-warning bg-warning/10';
      case 'failed': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Table Header Actions */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">Training Experiments</h3>
            <span className="text-sm text-muted-foreground">
              {experiments?.length} total experiments
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {selectedExperiments?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCompare(selectedExperiments)}
                iconName="GitCompare"
                iconPosition="left"
              >
                Compare ({selectedExperiments?.length})
              </Button>
            )}
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      setSelectedExperiments(experiments?.map(exp => exp?.id));
                    } else {
                      setSelectedExperiments([]);
                    }
                  }}
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Experiment Name</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Created</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('mae')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>MAE</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('rmse')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>RMSE</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4">Parameters</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExperiments?.map((experiment) => (
              <tr key={experiment?.id} className="border-b border-border hover:bg-muted/30">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    checked={selectedExperiments?.includes(experiment?.id)}
                    onChange={() => handleSelectExperiment(experiment?.id)}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{experiment?.name}</p>
                    <p className="text-sm text-muted-foreground">{experiment?.description}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm text-foreground">{experiment?.date}</p>
                    <p className="text-xs text-muted-foreground">{experiment?.time}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(experiment?.status)}`}>
                    {experiment?.status === 'running' && <Icon name="Loader2" size={12} className="mr-1 animate-spin" />}
                    {experiment?.status === 'completed' && <Icon name="CheckCircle" size={12} className="mr-1" />}
                    {experiment?.status === 'failed' && <Icon name="XCircle" size={12} className="mr-1" />}
                    {experiment?.status?.charAt(0)?.toUpperCase() + experiment?.status?.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-mono text-foreground">
                    {experiment?.mae ? experiment?.mae?.toFixed(4) : '-'}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-mono text-foreground">
                    {experiment?.rmse ? experiment?.rmse?.toFixed(4) : '-'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {experiment?.parameters?.slice(0, 2)?.map((param, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                        {param?.key}: {param?.value}
                      </span>
                    ))}
                    {experiment?.parameters?.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{experiment?.parameters?.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(experiment?.id)}
                      iconName="Eye"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                    >
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-{experiments?.length} of {experiments?.length} experiments
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentTable;