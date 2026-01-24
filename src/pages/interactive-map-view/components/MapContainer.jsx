import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// Simple debounce implementation
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const MapContainer = ({ 
  selectedCrimeTypes, 
  dateRange, 
  showHeatmap, 
  onMarkerClick,
  selectedRegion,
  mapStyle,
  onDataUpdate,
  showSensitiveAreas,
  selectedSeverities,
  activeDrawingTool
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [showPoliceStations, setShowPoliceStations] = useState(false);
  const [showTrafficCameras, setShowTrafficCameras] = useState(false);
  const [showCrimeMarkers, setShowCrimeMarkers] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);

  // Load uploaded data if available, else use mock
  let uploadedData = [];
  try {
    const raw = localStorage.getItem('crime_data_uploaded');
    if (raw) {
      uploadedData = JSON.parse(raw);
    }
  } catch (e) {}

  // Function to create area highlights based on crime density
  const createAreaHighlights = (crimeData) => {
    if (!crimeData || crimeData.length === 0) return [];
    
    // Group crimes by area (using district/area field or clustering by coordinates)
    const areaGroups = new Map();
    
    crimeData.forEach(crime => {
      if (!crime.coordinates || !Array.isArray(crime.coordinates)) return;
      
      const [lat, lng] = crime.coordinates;
      
      // Create area key from district if available, otherwise cluster by coordinates
      let areaKey;
      if (crime.district) {
        areaKey = crime.district.toLowerCase();
      } else {
        // Cluster coordinates into grid areas (approximately 1km x 1km)
        const latGrid = Math.floor(lat * 100) / 100; // Round to 2 decimal places
        const lngGrid = Math.floor(lng * 100) / 100;
        areaKey = `${latGrid}_${lngGrid}`;
      }
      
      if (!areaGroups.has(areaKey)) {
        areaGroups.set(areaKey, {
          key: areaKey,
          crimes: [],
          centerLat: lat,
          centerLng: lng,
          crimeTypes: new Set(),
          severityCount: { High: 0, Medium: 0, Low: 0 }
        });
      }
      
      const area = areaGroups.get(areaKey);
      area.crimes.push(crime);
      area.crimeTypes.add(crime.type || crime.category);
      area.severityCount[crime.severity] = (area.severityCount[crime.severity] || 0) + 1;
      
      // Update center to be average of all crimes in area
      area.centerLat = (area.centerLat * (area.crimes.length - 1) + lat) / area.crimes.length;
      area.centerLng = (area.centerLng * (area.crimes.length - 1) + lng) / area.crimes.length;
    });
    
    // Convert map to array and calculate risk levels
    const areas = Array.from(areaGroups.values()).map(area => {
      const totalCrimes = area.crimes.length;
      const highSeverityRatio = area.severityCount.High / totalCrimes;
      
      // Determine risk level based on crime count and severity
      let riskLevel;
      if (totalCrimes >= 10 || (totalCrimes >= 5 && highSeverityRatio >= 0.6)) {
        riskLevel = 'critical';
      } else if (totalCrimes >= 5 || (totalCrimes >= 3 && highSeverityRatio >= 0.4)) {
        riskLevel = 'high';
      } else if (totalCrimes >= 2) {
        riskLevel = 'medium';
      } else {
        riskLevel = 'low';
      }
      
      // Calculate highlight size based on crime density
      const baseSize = Math.min(300, 50 + totalCrimes * 15);
      const severityMultiplier = 1 + (highSeverityRatio * 0.5);
      const size = baseSize * severityMultiplier;
      
      return {
        ...area,
        totalCrimes,
        riskLevel,
        size,
        highSeverityRatio,
        crimeTypes: Array.from(area.crimeTypes)
      };
    });
    
    return areas.sort((a, b) => b.totalCrimes - a.totalCrimes);
  };

  // Generate area highlights from uploaded data
  const areaHighlights = useMemo(() => {
    const dataToUse = Array.isArray(uploadedData) && uploadedData.length > 0 ? uploadedData : filteredCrimeData;
    return createAreaHighlights(dataToUse);
  }, [uploadedData, filteredCrimeData]);

  // Mock crime data with coordinates
  const mockCrimeData = [
    {
      id: 1,
      type: "Drunk Driving",
      category: "Traffic Crime",
      date: "2024-09-28",
      time: "23:45",
      location: "Connaught Place, Delhi",
      coordinates: [28.6139, 77.2090],
      severity: "High",
      status: "Under Investigation",
      description: "DUI arrest after traffic stop",
      caseNumber: "CR-2024-001234"
    },
    {
      id: 2,
      type: "Hit and Run",
      category: "Traffic Crime",
      date: "2024-09-29",
      time: "02:30",
      location: "Marine Drive, Mumbai",
      coordinates: [19.0760, 72.8777],
      severity: "High",
      status: "Active",
      description: "Pedestrian struck by fleeing vehicle",
      caseNumber: "CR-2024-001235"
    },
    {
      id: 3,
      type: "Vehicle Theft",
      category: "Property Crime",
      date: "2024-09-30",
      time: "15:20",
      location: "Indiranagar, Bengaluru",
      coordinates: [12.9716, 77.5946],
      severity: "Medium",
      status: "Under Investigation",
      description: "Car stolen from parking garage",
      caseNumber: "CR-2024-001236"
    },
    {
      id: 4,
      type: "Sexual Harassment",
      category: "Violent Crime",
      date: "2024-10-01",
      time: "19:15",
      location: "T. Nagar, Chennai",
      coordinates: [13.0827, 80.2707],
      severity: "High",
      status: "Active",
      description: "Workplace harassment complaint",
      caseNumber: "CR-2024-001237"
    },
    {
      id: 5,
      type: "Domestic Violence",
      category: "Violent Crime",
      date: "2024-10-02",
      time: "22:10",
      location: "Park Street, Kolkata",
      coordinates: [22.5726, 88.3639],
      severity: "High",
      status: "Active",
      description: "Spousal abuse incident reported",
      caseNumber: "CR-2024-001238"
    },
    {
      id: 6,
      type: "Child Abuse",
      category: "Crime Against Children",
      date: "2024-10-03",
      time: "16:45",
      location: "Karol Bagh, Delhi",
      coordinates: [28.6538, 77.1902],
      severity: "High",
      status: "Under Investigation",
      description: "Child endangerment case",
      caseNumber: "CR-2024-001239"
    },
    {
      id: 7,
      type: "Crime Against Children",
      category: "Crime Against Children",
      date: "2024-10-04",
      time: "11:30",
      location: "Bandra West, Mumbai",
      coordinates: [19.0597, 72.8295],
      severity: "High",
      status: "Active",
      description: "Child neglect investigation",
      caseNumber: "CR-2024-001240"
    },
    {
      id: 8,
      type: "Robbery",
      category: "Property Crime",
      date: "2024-10-05",
      time: "20:15",
      location: "MG Road, Bengaluru",
      coordinates: [12.9791, 77.6073],
      severity: "High",
      status: "Active",
      description: "Armed robbery at convenience store",
      caseNumber: "CR-2024-001241"
    },
    {
      id: 9,
      type: "Drug Trafficking",
      category: "Drug Crime",
      date: "2024-10-06",
      time: "13:20",
      location: "Gurgaon, Haryana",
      coordinates: [28.4595, 77.0266],
      severity: "High",
      status: "Under Investigation",
      description: "Large-scale drug bust operation",
      caseNumber: "CR-2024-001242"
    },
    {
      id: 10,
      type: "Robbery",
      category: "Property Crime",
      date: "2024-10-07",
      time: "14:30",
      location: "Salt Lake, Kolkata",
      coordinates: [22.5806, 88.4181],
      severity: "Medium",
      status: "Resolved",
      description: "Bank robbery attempt foiled",
      caseNumber: "CR-2024-001243"
    },
    {
      id: 11,
      type: "Drunk Driving",
      category: "Traffic Crime",
      date: "2024-10-08",
      time: "01:15",
      location: "Koramangala, Bengaluru",
      coordinates: [12.9279, 77.6271],
      severity: "Medium",
      status: "Closed",
      description: "DUI with property damage",
      caseNumber: "CR-2024-001244"
    },
    {
      id: 12,
      type: "Vehicle Theft",
      category: "Property Crime",
      date: "2024-10-09",
      time: "08:00",
      location: "Dwarka, Delhi",
      coordinates: [28.5860, 77.0430],
      severity: "Medium",
      status: "Under Investigation",
      description: "Motorcycle theft from residential area",
      caseNumber: "CR-2024-001245"
    },
    {
      id: 13,
      type: "Drug Trafficking",
      category: "Drug Crime",
      date: "2024-10-10",
      time: "10:30",
      location: "Old City, Hyderabad",
      coordinates: [17.3616, 78.4747],
      severity: "High",
      status: "Active",
      description: "Drug smuggling ring uncovered",
      caseNumber: "CR-2024-001246"
    },
    {
      id: 14,
      type: "Sexual Harassment",
      category: "Violent Crime",
      date: "2024-10-11",
      time: "18:45",
      location: "Brewery District, Pune",
      coordinates: [18.5204, 73.8567],
      severity: "Medium",
      status: "Under Investigation",
      description: "Public harassment incident",
      caseNumber: "CR-2024-001247"
    },
    {
      id: 15,
      type: "Hit and Run",
      category: "Traffic Crime",
      date: "2024-10-12",
      time: "21:00",
      location: "Fort Area, Mumbai",
      coordinates: [18.9667, 72.8333],
      severity: "High",
      status: "Active",
      description: "Fatal hit and run incident",
      caseNumber: "CR-2024-001248"
    }
  ];

  const baseCrimeData = Array.isArray(uploadedData) && uploadedData.length > 0 ? uploadedData : mockCrimeData;
  const filteredCrimeData = useMemo(() => {
    return baseCrimeData?.filter(crime => {
      const crimeTypeMatch = selectedCrimeTypes?.length === 0 || selectedCrimeTypes?.includes(crime?.category);
      const dateMatch = true;
      const regionMatch = !selectedRegion || selectedRegion === 'all' || (crime?.location?.toLowerCase()?.includes(String(selectedRegion)?.toLowerCase()));
      const severityMatch = selectedSeverities?.includes(crime?.severity);
      return crimeTypeMatch && dateMatch && regionMatch && severityMatch;
    });
  }, [baseCrimeData, selectedCrimeTypes, selectedRegion, selectedSeverities]);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Debounced data update to prevent excessive re-renders
  const debouncedDataUpdate = useMemo(
    () => debounce((data) => {
      if (onDataUpdate) {
        onDataUpdate(data);
      }
    }, 300),
    [onDataUpdate]
  );

  useEffect(() => {
    debouncedDataUpdate(filteredCrimeData);
  }, [filteredCrimeData, debouncedDataUpdate]);

  const handleMarkerClick = useCallback((crime) => {
    setSelectedMarker(crime);
    onMarkerClick && onMarkerClick(crime);
  }, [onMarkerClick]);

  const getCrimeColor = (category) => {
    const colors = {
      "Violent Crime": "#EF4444",
      "Property Crime": "#F59E0B",
      "Drug Crime": "#8B5CF6",
      "Traffic Crime": "#06B6D4",
      "Crime Against Children": "#EC4899"
    };
    return colors?.[category] || "#6B7280";
  };

  const getSeveritySize = (severity) => {
    const sizes = {
      "Low": 8,
      "Medium": 12,
      "High": 16
    };
    return sizes?.[severity] || 10;
  };

  const getOverlayColor = (category) => {
    const colors = {
      "Violent Crime": "rgba(239, 68, 68, 0.20)",
      "Property Crime": "rgba(245, 158, 11, 0.18)",
      "Drug Crime": "rgba(139, 92, 246, 0.18)",
      "Traffic Crime": "rgba(6, 182, 212, 0.18)",
      "Crime Against Children": "rgba(236, 72, 153, 0.18)"
    };
    return colors?.[category] || "rgba(107, 114, 128, 0.18)";
  };

  const indiaBounds = { latMin: 8.0, latMax: 37.0, lngMin: 68.0, lngMax: 97.0 };
  const projectToPercent = (lat, lng) => {
    const x = ((lng - indiaBounds.lngMin) / (indiaBounds.lngMax - indiaBounds.lngMin)) * 100;
    const y = (1 - (lat - indiaBounds.latMin) / (indiaBounds.latMax - indiaBounds.latMin)) * 100;
    return { left: `${Math.max(0, Math.min(100, x))}%`, top: `${Math.max(0, Math.min(100, y))}%` };
  };

  const computeHotspots = (data) => {
    const gridSize = 0.5;
    const map = new Map();
    for (const item of data || []) {
      if (!Array.isArray(item?.coordinates)) continue;
      const lat = item.coordinates[0];
      const lng = item.coordinates[1];
      const glat = Math.floor(lat / gridSize) * gridSize;
      const glng = Math.floor(lng / gridSize) * gridSize;
      const key = `${glat.toFixed(2)},${glng.toFixed(2)}`;
      const prev = map.get(key) || { lat: glat + gridSize / 2, lng: glng + gridSize / 2, count: 0 };
      prev.count += 1;
      map.set(key, prev);
    }
    const arr = Array.from(map.values()).sort((a, b) => b.count - a.count);
    return arr.slice(0, 6);
  };

  // Mock police stations data with accurate coordinates
  const policeStations = [
    { id: 1, name: "Delhi Police HQ", coordinates: [28.6308, 77.2177], type: "HQ", address: "ITO, New Delhi" },
    { id: 2, name: "Mumbai Police Commissioner", coordinates: [19.0760, 72.8777], type: "HQ", address: " Crawford Market, Mumbai" },
    { id: 3, name: "Bengaluru City Police", coordinates: [12.9716, 77.5946], type: "HQ", address: "NR Road, Bengaluru" },
    { id: 4, name: "Chennai Police Commissioner", coordinates: [13.0827, 80.2707], type: "HQ", address: "Egmore, Chennai" },
    { id: 5, name: "Kolkata Police HQ", coordinates: [22.5726, 88.3639], type: "HQ", address: "Lalbazar, Kolkata" },
    { id: 6, name: "Connaught Place Police Station", coordinates: [28.6314, 77.2169], type: "Station", address: "CP, New Delhi" },
    { id: 7, name: "Bandra Police Station", coordinates: [19.0597, 72.8295], type: "Station", address: "Bandra West, Mumbai" },
    { id: 8, name: "Indiranagar Police Station", coordinates: [12.9853, 77.6150], type: "Station", address: "Indiranagar, Bengaluru" },
    { id: 9, name: "T. Nagar Police Station", coordinates: [13.0415, 80.2338], type: "Station", address: "T. Nagar, Chennai" },
    { id: 10, name: "Salt Lake Police Station", coordinates: [22.5806, 88.4181], type: "Station", address: "Salt Lake, Kolkata" },
    { id: 11, name: "Karol Bagh Police Station", coordinates: [28.6538, 77.1902], type: "Station", address: "Karol Bagh, Delhi" },
    { id: 12, name: "Gurgaon Sector 29 Police Station", coordinates: [28.4595, 77.0266], type: "Station", address: "Sector 29, Gurgaon" },
    { id: 13, name: "Cyberabad Police Station", coordinates: [17.3616, 78.4747], type: "Station", address: "HITEC City, Hyderabad" },
    { id: 14, name: "Pune City Police", coordinates: [18.5204, 73.8567], type: "HQ", address: "Camp, Pune" },
    { id: 15, name: "Ahmedabad Crime Branch", coordinates: [23.0225, 72.5714], type: "HQ", address: "Shahibaug, Ahmedabad" }
  ];

  // Mock traffic cameras data
  const trafficCameras = [
    { id: 1, name: "Camera-001", coordinates: [28.6139, 77.2090], status: "Active" },
    { id: 2, name: "Camera-002", coordinates: [19.0760, 72.8777], status: "Active" },
    { id: 3, name: "Camera-003", coordinates: [12.9716, 77.5946], status: "Maintenance" },
    { id: 4, name: "Camera-004", coordinates: [13.0827, 80.2707], status: "Active" }
  ];

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 1));
  };

  const handleResetMap = () => {
    const centers = {
      all: { lat: 20.5937, lng: 78.9629, z: 5 },
      delhi: { lat: 28.6139, lng: 77.2090, z: 11 },
      mumbai: { lat: 19.0760, lng: 72.8777, z: 11 },
      bengaluru: { lat: 12.9716, lng: 77.5946, z: 11 },
      chennai: { lat: 13.0827, lng: 80.2707, z: 11 },
      kolkata: { lat: 22.5726, lng: 88.3639, z: 11 },
      hyderabad: { lat: 17.3850, lng: 78.4867, z: 11 },
      pune: { lat: 18.5204, lng: 73.8567, z: 11 },
      ahmedabad: { lat: 23.0225, lng: 72.5714, z: 11 }
    };
    const key = selectedRegion && centers[selectedRegion] ? selectedRegion : 'all';
    const c = centers[key];
    setMapCenter({ lat: c.lat, lng: c.lng });
    setMapZoom(c.z);
  };

  const handleRefreshMap = () => {
    setMapLoaded(false);
    setTimeout(() => setMapLoaded(true), 1000);
  };

  const handleMapClick = (event) => {
    if (!isDrawing) return;
    
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Convert percent to lat/lng (approximate)
    const lat = indiaBounds.latMax - (yPercent / 100) * (indiaBounds.latMax - indiaBounds.latMin);
    const lng = indiaBounds.lngMin + (xPercent / 100) * (indiaBounds.lngMax - indiaBounds.lngMin);
    
    const point = { x: xPercent, y: yPercent, lat, lng };
    
    if (activeDrawingTool === "measure") {
      const newPoints = [...measurePoints, point];
      setMeasurePoints(newPoints);
      
      if (newPoints.length > 1) {
        const distance = calculateDistance(newPoints[newPoints.length - 2], newPoints[newPoints.length - 1]);
        setTotalDistance(prev => prev + distance);
      }
    } else {
      setCurrentShape(prev => prev ? [...prev, point] : [point]);
    }
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const finishDrawing = () => {
    if (activeDrawingTool === "measure") {
      setMeasurePoints([]);
      setTotalDistance(0);
    } else if (currentShape && currentShape.length > 2) {
      setDrawnShapes(prev => [...prev, { type: activeDrawingTool, points: currentShape }]);
      setCurrentShape(null);
    }
    setIsDrawing(false);
  };

  const clearDrawings = () => {
    setDrawnShapes([]);
    setCurrentShape(null);
    setMeasurePoints([]);
    setTotalDistance(0);
    setIsDrawing(false);
  };

  useEffect(() => {
    if (activeDrawingTool !== "select" && !isDrawing) {
      setIsDrawing(true);
    } else if (activeDrawingTool === "select" && isDrawing) {
      finishDrawing();
    }
  }, [activeDrawingTool]);

  // Optimize marker rendering based on zoom level
  const visibleCrimeData = useMemo(() => {
    if (mapZoom < 6) {
      // Show only high severity crimes at low zoom
      return filteredCrimeData?.filter(crime => crime?.severity === 'High').slice(0, 50);
    } else if (mapZoom < 8) {
      // Show high and medium severity crimes
      return filteredCrimeData?.filter(crime => crime?.severity !== 'Low').slice(0, 100);
    } else {
      // Show all crimes but limit total number
      return filteredCrimeData?.slice(0, 200);
    }
  }, [filteredCrimeData, mapZoom]);

  const dangerHotspots = useMemo(() => computeHotspots(filteredCrimeData), [filteredCrimeData]);

  if (!mapLoaded) {
    return (
      <div className="relative w-full h-full bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading interactive map...</p>
          <p className="text-sm text-muted-foreground mt-1">Initializing geospatial visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-card rounded-lg overflow-hidden">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full relative"
        onClick={handleMapClick}
      >
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Crime Analysis Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={(function(){
            const centers = {
              all: { lat: 20.5937, lng: 78.9629, z: 5 },
              delhi: { lat: 28.6139, lng: 77.2090, z: 11 },
              mumbai: { lat: 19.0760, lng: 72.8777, z: 11 },
              bengaluru: { lat: 12.9716, lng: 77.5946, z: 11 },
              chennai: { lat: 13.0827, lng: 80.2707, z: 11 },
              kolkata: { lat: 22.5726, lng: 88.3639, z: 11 },
              hyderabad: { lat: 17.3850, lng: 78.4867, z: 11 },
              pune: { lat: 18.5204, lng: 73.8567, z: 11 },
              ahmedabad: { lat: 23.0225, lng: 72.5714, z: 11 }
            };
            const key = selectedRegion && centers[selectedRegion] ? selectedRegion : 'all';
            const c = centers[key];
            return `https://www.google.com/maps?q=${c.lat},${c.lng}&z=${c.z}&output=embed`;
          })()}
          className="w-full h-full"
        />

        <div className="absolute inset-0 pointer-events-none">
          {/* Crime Markers - Optimized Rendering */}
          {showCrimeMarkers && visibleCrimeData?.map((crime) => {
            if (!Array.isArray(crime?.coordinates)) return null;
            const pos = projectToPercent(crime.coordinates[0], crime.coordinates[1]);
            return (
              <div
                key={crime?.id}
                className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                style={{ left: pos.left, top: pos.top }}
                onClick={() => handleMarkerClick(crime)}
              >
                <div
                  className="absolute rounded-full blur-md -z-10"
                  style={{
                    width: mapZoom < 8 ? 32 : 48,
                    height: mapZoom < 8 ? 32 : 48,
                    backgroundColor: getOverlayColor(crime?.category)
                  }}
                />
                <div
                  className="rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  style={{
                    backgroundColor: getCrimeColor(crime?.category),
                    width: `${Math.min(getSeveritySize(crime?.severity), mapZoom < 8 ? 10 : 16)}px`,
                    height: `${Math.min(getSeveritySize(crime?.severity), mapZoom < 8 ? 10 : 16)}px`
                  }}
                >
                  <Icon 
                    name={crime?.category === "Violent Crime" ? "AlertTriangle" : 
                          crime?.category === "Property Crime" ? "Home" :
                          crime?.category === "Drug Crime" ? "Pill" :
                          crime?.category === "Traffic Crime" ? "Car" :
                          crime?.category === "Crime Against Children" ? "Heart" : "MapPin"} 
                    size={Math.min(getSeveritySize(crime?.severity) - 4, mapZoom < 8 ? 6 : 12)} 
                    color="white" 
                  />
                </div>
                {mapZoom >= 8 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {crime?.type} - {crime?.date}
                  </div>
                )}
              </div>
            );
          })}

          {/* Police Stations */}
          {showPoliceStations && policeStations?.map((station) => {
            if (!Array.isArray(station?.coordinates)) return null;
            const pos = projectToPercent(station.coordinates[0], station.coordinates[1]);
            return (
              <div
                key={station?.id}
                className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-20"
                style={{ left: pos.left, top: pos.top }}
              >
                {/* Police station marker with distinctive design */}
                <div className="relative">
                  {/* Outer glow effect */}
                  <div
                    className="absolute rounded-full blur-md -z-10 animate-pulse"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "rgba(59, 130, 246, 0.4)",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)"
                    }}
                  />
                  
                  {/* Main marker */}
                  <div
                    className="rounded-full border-3 border-white shadow-lg flex items-center justify-center bg-blue-600 relative"
                    style={{
                      width: station?.type === "HQ" ? "28px" : "24px",
                      height: station?.type === "HQ" ? "28px" : "24px"
                    }}
                  >
                    <Icon name="Shield" size={station?.type === "HQ" ? 14 : 12} color="white" />
                    
                    {/* HQ indicator */}
                    {station?.type === "HQ" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                    <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg font-medium">
                      {station?.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 text-center">
                      {station?.address}
                    </div>
                  </div>
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-30">
                  <div className="font-semibold">{station?.name}</div>
                  <div className="text-gray-300">{station?.address}</div>
                  <div className="text-blue-300 mt-1">
                    {station?.type === "HQ" ? "Police Headquarters" : "Local Police Station"}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Traffic Cameras */}
          {showTrafficCameras && trafficCameras?.map((camera) => {
            if (!Array.isArray(camera?.coordinates)) return null;
            const pos = projectToPercent(camera.coordinates[0], camera.coordinates[1]);
            return (
              <div
                key={camera?.id}
                className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                style={{ left: pos.left, top: pos.top }}
              >
                <div
                  className="rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  style={{
                    backgroundColor: camera?.status === "Active" ? "#10B981" : "#F59E0B",
                    width: "16px",
                    height: "16px"
                  }}
                >
                  <Icon name="Camera" size={10} color="white" />
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                  {camera?.name} ({camera?.status})
                </div>
              </div>
            );
          })}
        </div>

        {showSensitiveAreas && (
          <div className="absolute inset-0 pointer-events-none">
            {dangerHotspots?.map((h, idx) => {
              const pos = projectToPercent(h.lat, h.lng);
              const size = Math.min(200, 60 + h.count * 20);
              const riskLevel = h.count >= 5 ? 'critical' : h.count >= 3 ? 'high' : 'medium';
              const colors = {
                critical: 'rgba(239, 68, 68, 0.4)',
                high: 'rgba(245, 158, 11, 0.35)',
                medium: 'rgba(250, 204, 21, 0.3)'
              };
              const borderColors = {
                critical: 'rgba(239, 68, 68, 0.8)',
                high: 'rgba(245, 158, 11, 0.7)',
                medium: 'rgba(250, 204, 21, 0.6)'
              };
              
              return (
                <div key={idx} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: pos.left, top: pos.top }}>
                  {/* Pulsing animation for critical areas */}
                  {riskLevel === 'critical' && (
                    <div 
                      className="absolute rounded-full animate-ping"
                      style={{ 
                        width: size, 
                        height: size, 
                        backgroundColor: colors.critical 
                      }} 
                    />
                  )}
                  
                  {/* Main hotspot area */}
                  <div 
                    className="rounded-full blur-xl relative"
                    style={{ 
                      width: size, 
                      height: size, 
                      backgroundColor: colors[riskLevel],
                      border: `2px solid ${borderColors[riskLevel]}`,
                      animation: riskLevel === 'critical' ? 'pulse 2s infinite' : 'none'
                    }} 
                  />
                  
                  {/* Risk level indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                      riskLevel === 'critical' ? 'bg-red-600' :
                      riskLevel === 'high' ? 'bg-orange-600' : 'bg-yellow-600'
                    }`}>
                      {riskLevel.toUpperCase()}
                    </div>
                    <div className="text-center mt-1 px-2 py-0.5 bg-white/90 rounded text-[10px] font-medium text-destructive">
                      {h.count} incidents
                    </div>
                  </div>
                  
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl whitespace-nowrap">
                      <div className="font-semibold text-sm">Sensitive Area</div>
                      <div className="text-xs text-gray-300 mt-1">Risk Level: {riskLevel}</div>
                      <div className="text-xs text-gray-300">Crime Count: {h.count}</div>
                      <div className="text-xs text-gray-300">Coordinates: {h.lat.toFixed(4)}, {h.lng.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Heatmap Toggle Overlay */}
        {showHeatmap && (
          <div className="absolute inset-0 bg-gradient-radial from-red-500/20 via-yellow-500/10 to-transparent pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/30 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-orange-500/25 rounded-full blur-lg"></div>
            <div className="absolute bottom-1/3 left-1/2 w-20 h-20 bg-yellow-500/20 rounded-full blur-lg"></div>
          </div>
        )}

        {/* Area Highlights from CSV Data */}
        {areaHighlights && areaHighlights.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {areaHighlights?.map((area, idx) => {
              const pos = projectToPercent(area.centerLat, area.centerLng);
              const colors = {
                critical: 'rgba(239, 68, 68, 0.5)',
                high: 'rgba(245, 158, 11, 0.4)',
                medium: 'rgba(250, 204, 21, 0.35)',
                low: 'rgba(34, 197, 94, 0.3)'
              };
              const borderColors = {
                critical: 'rgba(239, 68, 68, 0.9)',
                high: 'rgba(245, 158, 11, 0.8)',
                medium: 'rgba(250, 204, 21, 0.7)',
                low: 'rgba(34, 197, 94, 0.6)'
              };
              
              return (
                <div key={idx} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: pos.left, top: pos.top }}>
                  {/* Pulsing animation for critical areas */}
                  {area.riskLevel === 'critical' && (
                    <div 
                      className="absolute rounded-full animate-ping"
                      style={{ 
                        width: area.size, 
                        height: area.size, 
                        backgroundColor: colors.critical 
                      }} 
                    />
                  )}
                  
                  {/* Main area highlight */}
                  <div 
                    className="rounded-full blur-2xl relative"
                    style={{ 
                      width: area.size, 
                      height: area.size, 
                      backgroundColor: colors[area.riskLevel],
                      border: `3px solid ${borderColors[area.riskLevel]}`,
                      animation: area.riskLevel === 'critical' ? 'pulse 2s infinite' : 'none'
                    }} 
                  />
                  
                  {/* Area information label */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                      area.riskLevel === 'critical' ? 'bg-red-600' :
                      area.riskLevel === 'high' ? 'bg-orange-600' :
                      area.riskLevel === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                    }`}>
                      {area.riskLevel.toUpperCase()}
                    </div>
                    <div className="text-center mt-1 px-2 py-0.5 bg-white/90 rounded text-[10px] font-medium text-destructive">
                      {area.totalCrimes} incidents
                    </div>
                  </div>
                  
                  {/* Detailed hover tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl whitespace-nowrap max-w-xs">
                      <div className="font-semibold text-sm mb-1">Crime Area Analysis</div>
                      <div className="text-xs text-gray-300">Area: {area.key}</div>
                      <div className="text-xs text-gray-300">Risk Level: {area.riskLevel}</div>
                      <div className="text-xs text-gray-300">Total Crimes: {area.totalCrimes}</div>
                      <div className="text-xs text-gray-300">High Severity: {Math.round(area.highSeverityRatio * 100)}%</div>
                      <div className="text-xs text-gray-300 mt-1">Crime Types:</div>
                      <div className="text-xs text-blue-300">
                        {area.crimeTypes.slice(0, 3).join(', ')}
                        {area.crimeTypes.length > 3 && ` +${area.crimeTypes.length - 3} more`}
                      </div>
                      <div className="text-xs text-gray-300">Coordinates: {area.centerLat.toFixed(4)}, {area.centerLng.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-white/90 backdrop-blur-sm"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <Icon name="Plus" size={16} />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-white/90 backdrop-blur-sm"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <Icon name="Minus" size={16} />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-white/90 backdrop-blur-sm"
            onClick={handleResetMap}
            title="Reset Map"
          >
            <Icon name="RotateCcw" size={16} />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-white/90 backdrop-blur-sm"
            onClick={handleRefreshMap}
            title="Refresh Map"
          >
            <Icon name="RefreshCw" size={16} />
          </Button>
        </div>

        {/* Layer Controls */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Map Layers</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={showHeatmap} 
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="rounded" 
              />
              <span>Crime Heatmap</span>
            </label>
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={showCrimeMarkers}
                onChange={(e) => setShowCrimeMarkers(e.target.checked)}
                className="rounded" 
              />
              <span>Crime Markers</span>
            </label>
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={showPoliceStations}
                onChange={(e) => setShowPoliceStations(e.target.checked)}
                className="rounded" 
              />
              <span>Police Stations</span>
            </label>
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={showTrafficCameras}
                onChange={(e) => setShowTrafficCameras(e.target.checked)}
                className="rounded" 
              />
              <span>Traffic Cameras</span>
            </label>
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!showSensitiveAreas} 
                onChange={(e) => setShowSensitiveAreas && setShowSensitiveAreas(e.target.checked)}
                className="rounded" 
              />
              <span>Sensitive Areas</span>
            </label>
          </div>
        </div>

        {/* Drawing Layer */}
        {isDrawing && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Current shape being drawn */}
            {currentShape && currentShape.length > 0 && (
              <svg className="absolute inset-0 w-full h-full">
                {activeDrawingTool === "polygon" && (
                  <polygon
                    points={currentShape.map(p => `${p.x}%,${p.y}%`).join(' ')}
                    fill="rgba(59, 130, 246, 0.3)"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                )}
                {activeDrawingTool === "circle" && currentShape.length === 2 && (
                  <>
                    <circle
                      cx={`${currentShape[0].x}%`}
                      cy={`${currentShape[0].y}%`}
                      r={Math.sqrt(
                        Math.pow(currentShape[1].x - currentShape[0].x, 2) +
                        Math.pow(currentShape[1].y - currentShape[0].y, 2)
                      ) + "%"}
                      fill="rgba(59, 130, 246, 0.3)"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                    />
                  </>
                )}
                {activeDrawingTool === "rectangle" && currentShape.length === 2 && (
                  <rect
                    x={`${Math.min(currentShape[0].x, currentShape[1].x)}%`}
                    y={`${Math.min(currentShape[0].y, currentShape[1].y)}%`}
                    width={`${Math.abs(currentShape[1].x - currentShape[0].x)}%`}
                    height={`${Math.abs(currentShape[1].y - currentShape[0].y)}%`}
                    fill="rgba(59, 130, 246, 0.3)"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                )}
              </svg>
            )}
            
            {/* Measurement lines */}
            {activeDrawingTool === "measure" && measurePoints.length > 0 && (
              <svg className="absolute inset-0 w-full h-full">
                {measurePoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={`${point.x}%`}
                    cy={`${point.y}%`}
                    r="4"
                    fill="rgb(239, 68, 68)"
                  />
                ))}
                {measurePoints.length > 1 && (
                  <polyline
                    points={measurePoints.map(p => `${p.x}%,${p.y}%`).join(' ')}
                    fill="none"
                    stroke="rgb(239, 68, 68)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                )}
              </svg>
            )}
            
            {/* Measurement display */}
            {activeDrawingTool === "measure" && totalDistance > 0 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-3 py-2 rounded-lg text-sm">
                Distance: {totalDistance.toFixed(2)} km
                <button
                  onClick={finishDrawing}
                  className="ml-2 bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs"
                >
                  Finish
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Completed shapes */}
        {drawnShapes.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute inset-0 w-full h-full">
              {drawnShapes.map((shape, shapeIndex) => (
                <g key={shapeIndex}>
                  {shape.type === "polygon" && (
                    <polygon
                      points={shape.points.map(p => `${p.x}%,${p.y}%`).join(' ')}
                      fill="rgba(34, 197, 94, 0.2)"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                    />
                  )}
                  {shape.type === "circle" && shape.points.length === 2 && (
                    <circle
                      cx={`${shape.points[0].x}%`}
                      cy={`${shape.points[0].y}%`}
                      r={Math.sqrt(
                        Math.pow(shape.points[1].x - shape.points[0].x, 2) +
                        Math.pow(shape.points[1].y - shape.points[0].y, 2)
                      ) + "%"}
                      fill="rgba(34, 197, 94, 0.2)"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                    />
                  )}
                  {shape.type === "rectangle" && shape.points.length === 2 && (
                    <rect
                      x={`${Math.min(shape.points[0].x, shape.points[1].x)}%`}
                      y={`${Math.min(shape.points[0].y, shape.points[1].y)}%`}
                      width={`${Math.abs(shape.points[1].x - shape.points[0].x)}%`}
                      height={`${Math.abs(shape.points[1].y - shape.points[0].y)}%`}
                      fill="rgba(34, 197, 94, 0.2)"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>
        )}
        
        {/* Drawing controls */}
        {isDrawing && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-lg flex items-center space-x-3">
            <span className="text-sm">
              {activeDrawingTool === "measure" ? "Click points to measure distance" : 
               activeDrawingTool === "polygon" ? "Click points to draw polygon" :
               activeDrawingTool === "circle" ? "Click center and edge for circle" :
               "Click corners for rectangle"}
            </span>
            <button
              onClick={finishDrawing}
              className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs"
            >
              Cancel
            </button>
          </div>
        )}
        
        {/* Clear drawings button */}
        {drawnShapes.length > 0 && (
          <div className="absolute top-20 right-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={clearDrawings}
              className="bg-red-600 hover:bg-red-700"
            >
              <Icon name="Trash2" size={14} className="mr-1" />
              Clear Drawings
            </Button>
          </div>
        )}

        {/* Scale and Coordinates */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-700">
          Scale: 1:{Math.round(50000 / mapZoom)} | Lat: {mapCenter.lat.toFixed(4)}, Lng: {mapCenter.lng.toFixed(4)}
        </div>
      </div>
      {/* Selected Marker Details Modal */}
      {selectedMarker && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Crime Details</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedMarker(null)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getCrimeColor(selectedMarker?.category) }}
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedMarker?.type}</p>
                  <p className="text-sm text-gray-600">{selectedMarker?.category}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Date & Time</p>
                  <p className="font-medium">{selectedMarker?.date} {selectedMarker?.time}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-medium">{selectedMarker?.location}</p>
                </div>
                <div>
                  <p className="text-gray-600">Severity</p>
                  <p className="font-medium">{selectedMarker?.severity}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-medium">{selectedMarker?.status}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Description</p>
                <p className="text-sm mt-1">{selectedMarker?.description}</p>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm">Case Number</p>
                <p className="text-sm font-mono mt-1">{selectedMarker?.caseNumber}</p>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-6">
              <Button variant="outline" size="sm" className="flex-1">
                <Icon name="FileText" size={14} className="mr-2" />
                View Report
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Icon name="MapPin" size={14} className="mr-2" />
                Navigate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
