import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MapContainer from './components/MapContainer-APlus';
import FilterPanel from './components/FilterPanel';
import MapToolbar from './components/MapToolbar';
import CrimeStatsSummary from './components/CrimeStatsSummary';

const InteractiveMapView = () => {
  const [filterPanelCollapsed, setFilterPanelCollapsed] = useState(false);
  const [selectedCrimeTypes, setSelectedCrimeTypes] = useState([]);
  const [dateRange, setDateRange] = useState("30d");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeDrawingTool, setActiveDrawingTool] = useState("select");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showStatsSummary, setShowStatsSummary] = useState(false);
  const [mapData, setMapData] = useState([]);
  const [selectedSeverities, setSelectedSeverities] = useState(["High", "Medium", "Low"]);
  const [toolbarPos, setToolbarPos] = useState({ top: 16, left: 16 });
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const toolbarDragStartRef = React.useRef({ x: 0, y: 0 });
  const toolbarStartPosRef = React.useRef({ top: 16, left: 16 });
  const toolbarRef = React.useRef(null);
  const dragPosRef = React.useRef({ top: 16, left: 16 });
  const rafPendingRef = React.useRef(false);
  const [mapRefreshId, setMapRefreshId] = useState(0);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setFilterPanelCollapsed(true);
        setShowStatsSummary(false);
      } else {
        setShowStatsSummary(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExportMap = (format) => {
    if (format === 'csv') {
      const headers = [
        'id','type','category','date','time','location','latitude','longitude','severity','status','description','caseNumber'
      ];
      const rows = mapData?.map((crime) => {
        const latitude = Array.isArray(crime?.coordinates) ? crime?.coordinates[0] : '';
        const longitude = Array.isArray(crime?.coordinates) ? crime?.coordinates[1] : '';
        return [
          crime?.id,
          crime?.type,
          crime?.category,
          crime?.date,
          crime?.time,
          crime?.location,
          latitude,
          longitude,
          crime?.severity,
          crime?.status,
          crime?.description?.replace(/\n/g, ' '),
          crime?.caseNumber
        ].map((val) => {
          const v = val ?? '';
          const s = String(v);
          if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return '"' + s.replace(/"/g, '""') + '"';
          }
          return s;
        }).join(',');
      }) || [];
      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crime-map-data-${Date.now()}.csv`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    if (format === 'geojson') {
      const features = (mapData || [])
        .filter((crime) => Array.isArray(crime?.coordinates))
        .map((crime) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [crime.coordinates[1], crime.coordinates[0]]
          },
          properties: {
            id: crime?.id,
            type: crime?.type,
            category: crime?.category,
            date: crime?.date,
            time: crime?.time,
            location: crime?.location,
            severity: crime?.severity,
            status: crime?.status,
            description: crime?.description,
            caseNumber: crime?.caseNumber
          }
        }));
      const fc = { type: 'FeatureCollection', features };
      const blob = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crime-map-data-${Date.now()}.geojson`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    const exportData = {
      format,
      timestamp: new Date()?.toISOString(),
      filters: {
        crimeTypes: selectedCrimeTypes,
        dateRange,
        region: selectedRegion,
        heatmap: showHeatmap
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crime-map-export-${format}-${Date.now()}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    if (!isFullscreen) {
      setFilterPanelCollapsed(true);
      setShowStatsSummary(false);
    } else {
      setFilterPanelCollapsed(false);
      setShowStatsSummary(true);
    }
  };

  const handleMeasureDistance = () => {
    console.log("Activating distance measurement tool");
    setActiveDrawingTool("measure");
  };

  const handleDrawArea = (toolType) => {
    console.log(`Activating drawing tool: ${toolType}`);
    setActiveDrawingTool(toolType);
  };

  const handleMarkerClick = (crimeData) => {
    setSelectedMarker(crimeData);
    console.log("Selected crime incident:", crimeData);
  };

  const handleRefreshMap = () => {
    setMapRefreshId((id) => id + 1);
  };

  const handleCenterMap = () => {
    setSelectedRegion("all");
    setActiveDrawingTool("select");
  };

  const handleOpenSettings = () => {
    alert("Map settings panel would open here - customize map appearance, units, etc.");
  };

  const totalIncidents = 1192; // Mock total based on filters
  const handleToolbarMouseDown = (e) => {
    setIsDraggingToolbar(true);
    toolbarDragStartRef.current = { x: e.clientX, y: e.clientY };
    toolbarStartPosRef.current = { ...toolbarPos };
    dragPosRef.current = { ...toolbarPos };
    window.addEventListener('mousemove', handleToolbarMouseMove, { passive: true });
    window.addEventListener('mouseup', handleToolbarMouseUp, { passive: true });
  };
  const handleToolbarMouseMove = (e) => {
    const dx = e.clientX - toolbarDragStartRef.current.x;
    const dy = e.clientY - toolbarDragStartRef.current.y;
    const parentRect = toolbarRef.current?.parentElement?.getBoundingClientRect();
    const selfRect = toolbarRef.current?.getBoundingClientRect();
    let nextTop = Math.max(0, toolbarStartPosRef.current.top + dy);
    let nextLeft = Math.max(0, toolbarStartPosRef.current.left + dx);
    if (parentRect && selfRect) {
      const maxTop = Math.max(0, parentRect.height - selfRect.height);
      const maxLeft = Math.max(0, parentRect.width - selfRect.width);
      nextTop = Math.min(nextTop, maxTop);
      nextLeft = Math.min(nextLeft, maxLeft);
    }
    dragPosRef.current = { top: nextTop, left: nextLeft };
    if (!rafPendingRef.current) {
      rafPendingRef.current = true;
      requestAnimationFrame(() => {
        rafPendingRef.current = false;
        if (toolbarRef.current) {
          toolbarRef.current.style.transform = `translate(${dragPosRef.current.left}px, ${dragPosRef.current.top}px)`;
        }
      });
    }
  };
  const handleToolbarMouseUp = () => {
    setIsDraggingToolbar(false);
    setToolbarPos({ ...dragPosRef.current });
    window.removeEventListener('mousemove', handleToolbarMouseMove);
    window.removeEventListener('mouseup', handleToolbarMouseUp);
  };

  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex">
          {/* Filter Panel */}
          <FilterPanel
            isCollapsed={filterPanelCollapsed}
            onToggleCollapse={() => setFilterPanelCollapsed(!filterPanelCollapsed)}
            selectedCrimeTypes={selectedCrimeTypes}
            onCrimeTypeChange={setSelectedCrimeTypes}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            showHeatmap={showHeatmap}
            onHeatmapToggle={() => setShowHeatmap(!showHeatmap)}
            onExportData={(fmt) => handleExportMap(fmt || 'csv')}
            selectedSeverities={selectedSeverities}
            onSeverityChange={setSelectedSeverities}
          />

          {/* Map Area */}
          <div className="flex-1 flex flex-col relative">
            {/* Map Toolbar */}
            <div 
              ref={toolbarRef}
              className="absolute z-10"
              style={{ transform: `translate(${toolbarPos.left}px, ${toolbarPos.top}px)`, cursor: isDraggingToolbar ? 'grabbing' : 'grab' }}
              onMouseDown={handleToolbarMouseDown}
            >
              <MapToolbar
                onExportMap={handleExportMap}
                onToggleFullscreen={handleToggleFullscreen}
                onMeasureDistance={handleMeasureDistance}
                onDrawArea={handleDrawArea}
                isFullscreen={isFullscreen}
                activeDrawingTool={activeDrawingTool}
                onToolChange={setActiveDrawingTool}
                onRefreshMap={handleRefreshMap}
                onCenterMap={handleCenterMap}
                onOpenSettings={handleOpenSettings}
              />
            </div>

            {/* Filter Toggle for Mobile */}
            {filterPanelCollapsed && (
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setFilterPanelCollapsed(false)}
                  className="bg-white/90 backdrop-blur-sm shadow-lg"
                >
                  <Icon name="Filter" size={16} />
                </Button>
              </div>
            )}

            {/* Navigation Breadcrumb */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <div className="flex items-center space-x-2 text-sm">
                <Link to="/main-dashboard" className="text-primary hover:text-primary/80 transition-colors">
                  Dashboard
                </Link>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                <span className="text-foreground font-medium">Interactive Map</span>
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative" style={{ position: 'relative', overflow: 'hidden' }}>
              <MapContainer
                key={mapRefreshId}
                selectedCrimeTypes={selectedCrimeTypes}
                dateRange={dateRange}
                showHeatmap={showHeatmap}
                onMarkerClick={handleMarkerClick}
                onHeatmapToggle={(value) => setShowHeatmap(value)}
                selectedRegion={selectedRegion}
                mapStyle="standard"
                onDataUpdate={setMapData}
                selectedSeverities={selectedSeverities}
                activeDrawingTool={activeDrawingTool}
              />
            </div>

            {/* Stats Summary Panel */}
            {showStatsSummary && !isFullscreen && (
              <div className="absolute bottom-4 right-4 w-80 max-h-96 overflow-y-auto z-10">
                <CrimeStatsSummary
                  selectedCrimeTypes={selectedCrimeTypes}
                  dateRange={dateRange}
                  totalIncidents={totalIncidents}
                />
              </div>
            )}

            {/* Quick Actions - Fixed Position */}
            <div 
              className="absolute bottom-4 left-4 z-[9999] flex space-x-2"
              style={{ 
                pointerEvents: 'auto',
                position: 'absolute',
                zIndex: 9999
              }}
            >
              <Link 
                to="/main-dashboard" 
                className="no-underline"
                style={{ pointerEvents: 'auto' }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white backdrop-blur-sm shadow-2xl hover:bg-gray-50 hover:shadow-2xl transition-all border-2 border-gray-300 text-gray-900 font-semibold min-w-[110px] px-4 py-2"
                  iconName="BarChart3"
                  iconPosition="left"
                  style={{ 
                    backgroundColor: 'white',
                    pointerEvents: 'auto',
                    zIndex: 10000
                  }}
                >
                  Analytics
                </Button>
              </Link>
              <Link 
                to="/prediction-interface" 
                className="no-underline"
                style={{ pointerEvents: 'auto' }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white backdrop-blur-sm shadow-2xl hover:bg-gray-50 hover:shadow-2xl transition-all border-2 border-gray-300 text-gray-900 font-semibold min-w-[120px] px-4 py-2"
                  iconName="TrendingUp"
                  iconPosition="left"
                  style={{ 
                    backgroundColor: 'white',
                    pointerEvents: 'auto',
                    zIndex: 10000
                  }}
                >
                  Predictions
                </Button>
              </Link>
            </div>

            {/* Real-time Status Indicator */}
            <div className="absolute top-20 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-success">Live Data</span>
                <span className="text-xs text-muted-foreground">Updated 2 min ago</span>
              </div>
            </div>
          </div>
        </div>

      {/* Mobile Filter Overlay */}
      {!filterPanelCollapsed && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/50 z-[999] lg:hidden"
          onClick={() => setFilterPanelCollapsed(true)}
        />
      )}
    </>
  );
};

export default InteractiveMapView
