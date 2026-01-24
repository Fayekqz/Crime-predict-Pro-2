import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MapToolbar = ({ 
  onExportMap, 
  onToggleFullscreen, 
  onMeasureDistance, 
  onDrawArea,
  isFullscreen,
  activeDrawingTool,
  onToolChange,
  onRefreshMap,
  onCenterMap,
  onOpenSettings
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMeasureMenu, setShowMeasureMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const exportOptions = [
    { id: "png", label: "PNG Image", icon: "Image" },
    { id: "pdf", label: "PDF Report", icon: "FileText" },
    { id: "csv", label: "CSV Data", icon: "Table" },
    { id: "geojson", label: "GeoJSON", icon: "Map" }
  ];

  const drawingTools = [
    { id: "select", label: "Select", icon: "MousePointer" },
    { id: "polygon", label: "Draw Area", icon: "Pentagon" },
    { id: "circle", label: "Draw Circle", icon: "Circle" },
    { id: "rectangle", label: "Draw Rectangle", icon: "Square" },
    { id: "measure", label: "Measure Distance", icon: "Ruler" }
  ];

  const handleExport = (format) => {
    onExportMap(format);
    setShowExportMenu(false);
  };

  const handleToolSelect = (toolId) => {
    onToolChange(toolId);
    if (toolId === "measure") {
      onMeasureDistance();
    } else if (toolId !== "select") {
      onDrawArea(toolId);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-2">
      <div className="flex items-center justify-between mb-1">
        <button
          className="inline-flex items-center justify-center h-6 w-6 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={isCollapsed ? "Expand toolbar" : "Collapse toolbar"}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={14} />
        </button>
      </div>
      <div className={`flex items-center space-x-1 transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[500px] opacity-100 animate-slide-in'}`}>
        {/* Drawing Tools */}
        <div className="flex items-center space-x-1 pr-2 border-r border-border">
          {drawingTools?.map((tool) => (
            <Button
              key={tool?.id}
              variant={activeDrawingTool === tool?.id ? "default" : "ghost"}
              size="icon"
              onClick={() => handleToolSelect(tool?.id)}
              title={tool?.label}
            >
              <Icon name={tool?.icon} size={16} />
            </Button>
          ))}
        </div>

        {/* Map Controls */}
        <div className="flex items-center space-x-1 pr-2 border-r border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefreshMap}
            title="Refresh Map"
          >
            <Icon name="RefreshCw" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onCenterMap}
            title="Center Map"
          >
            <Icon name="Navigation" size={16} />
          </Button>
        </div>

        {/* Export Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="Export Options"
          >
            <Icon name="Download" size={16} />
          </Button>

          {showExportMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 animate-fade-in">
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                  Export Options
                </div>
                {exportOptions?.map((option) => (
                  <button
                    key={option?.id}
                    onClick={() => handleExport(option?.id)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Icon name={option?.icon} size={16} />
                    <span>{option?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>



        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          title="Map Settings"
          onClick={onOpenSettings}
        >
          <Icon name="Settings" size={16} />
        </Button>
      </div>
      {/* Active Tool Indicator */}
      {activeDrawingTool && activeDrawingTool !== "select" && !isCollapsed && (
        <div className="mt-2 px-2 py-1 bg-primary/10 rounded text-xs text-primary font-medium transition-all duration-300 ease-in-out">
          <Icon name="Info" size={12} className="inline mr-1" />
          {drawingTools?.find(t => t?.id === activeDrawingTool)?.label} tool active
        </div>
      )}
      {/* Overlay for closing menus */}
      {(showExportMenu || showMeasureMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowExportMenu(false);
            setShowMeasureMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default MapToolbar;
