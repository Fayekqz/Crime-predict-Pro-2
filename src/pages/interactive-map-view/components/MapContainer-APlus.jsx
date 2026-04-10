import React, { useMemo, useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Circle, Popup, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { initialCrimeData } from '../../../data/initialCrimeData';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Mock Data
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

const trafficCameras = [
  { id: 1, name: "Camera-001", coordinates: [28.6139, 77.2090], status: "Active" },
  { id: 2, name: "Camera-002", coordinates: [19.0760, 72.8777], status: "Active" },
  { id: 3, name: "Camera-003", coordinates: [12.9716, 77.5946], status: "Maintenance" },
  { id: 4, name: "Camera-004", coordinates: [13.0827, 80.2707], status: "Active" }
];

// Custom Icons
const createIcon = (color, type = 'circle') => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
            background-color: ${color};
            width: ${type === 'hq' ? '20px' : '12px'};
            height: ${type === 'hq' ? '20px' : '12px'};
            border-radius: ${type === 'camera' ? '2px' : '50%'};
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const icons = {
    police: createIcon('#3B82F6'),
    policeHQ: createIcon('#1D4ED8', 'hq'),
    camera: createIcon('#F59E0B', 'camera'),
    crime: {
        violent: createIcon('#EF4444'),
        property: createIcon('#F59E0B'),
        drug: createIcon('#8B5CF6'),
        other: createIcon('#6B7280')
    }
};

// Helper component to update map view when bounds change
const MapController = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

const MapContainer = ({ 
  selectedCrimeTypes, 
  dateRange, 
  showHeatmap, 
  onHeatmapToggle,
  onMarkerClick,
  selectedRegion,
  mapStyle,
  onDataUpdate,
  selectedSeverities,
  activeDrawingTool
}) => {
  const [showPoliceStations, setShowPoliceStations] = useState(true);
  const [showTrafficCameras, setShowTrafficCameras] = useState(true);
  const [showCrimeMarkers, setShowCrimeMarkers] = useState(true);
  const [showSensitiveAreas, setShowSensitiveAreas] = useState(true);

  // 1. Data Processing
  const filteredCrimeData = useMemo(() => {
    // If no initial data, return empty
    if (!initialCrimeData || !Array.isArray(initialCrimeData)) return [];

    const idToLabel = {
      violent: "Violent Crime",
      property: "Property Crime",
      drug: "Drug Crime",
      traffic: "Traffic Crime",
      public: "Public Order",
      cyber: "Cyber Crime",
      financial: "Financial Crime"
    };

    const selectedSet = new Set(
      (selectedCrimeTypes || []).map((id) => idToLabel[id] || id)
    );

    return initialCrimeData.filter(crime => {
      // Filter by Crime Type
      // If selectedSet is empty, we might want to show all or none. 
      // Usually "none selected" might mean "all" or "none". Let's assume if user selects nothing, show all, or handle as per logic.
      // But typically selectedCrimeTypes is non-empty if categories are active.
      // Let's assume if length > 0, we filter. If 0, maybe show all? Or usually UI handles "all" by passing all IDs.
      const crimeTypeMatch = selectedSet.size === 0 || selectedSet.has(crime?.category) || selectedSet.has(crime?.type);
      
      // Filter by Region (Location string match)
      const regionMatch = !selectedRegion || selectedRegion === 'all' || 
        (crime?.location?.toLowerCase()?.includes(String(selectedRegion)?.toLowerCase()));
      
      // Filter by Severity
      const severityMatch = !selectedSeverities || selectedSeverities.length === 0 || selectedSeverities.includes(crime?.severity);

      // Filter by Date (Optional, if dateRange provided)
      let dateMatch = true;
      if (dateRange && dateRange.start && dateRange.end && crime.date) {
         const crimeDate = new Date(crime.date);
         const start = new Date(dateRange.start);
         const end = new Date(dateRange.end);
         dateMatch = crimeDate >= start && crimeDate <= end;
      }

      return crimeTypeMatch && regionMatch && severityMatch && dateMatch;
    });
  }, [selectedCrimeTypes, selectedRegion, selectedSeverities, dateRange]);

  // 2. Compute Map Bounds
  const mapBounds = useMemo(() => {
    if (!filteredCrimeData || filteredCrimeData.length === 0) {
      return null; // Let Leaflet handle default or keep previous
    }

    let latMin = 90, latMax = -90, lngMin = 180, lngMax = -180;
    let hasValidData = false;

    filteredCrimeData.forEach(c => {
       if (c.coordinates && Array.isArray(c.coordinates)) {
         const [lat, lng] = c.coordinates;
         if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
             latMin = Math.min(latMin, lat);
             latMax = Math.max(latMax, lat);
             lngMin = Math.min(lngMin, lng);
             lngMax = Math.max(lngMax, lng);
             hasValidData = true;
         }
       }
    });

    if (!hasValidData) return null;

    // Format for Leaflet: [[lat1, lng1], [lat2, lng2]]
    return [
        [latMin, lngMin],
        [latMax, lngMax]
    ];
  }, [filteredCrimeData]);

  // 3. Compute Hotspots (Red Zones)
  const hotspots = useMemo(() => {
    if (!filteredCrimeData || filteredCrimeData.length === 0) return [];

    // Grid size in degrees (approx 500m - 1km)
    const gridSize = 0.005; 
    const grid = new Map();

    filteredCrimeData.forEach(crime => {
        if (!crime.coordinates) return;
        const [lat, lng] = crime.coordinates;
        // Snap to grid
        const latKey = Math.floor(lat / gridSize);
        const lngKey = Math.floor(lng / gridSize);
        const key = `${latKey},${lngKey}`;

        if (!grid.has(key)) {
            grid.set(key, { 
                lat: (latKey * gridSize) + (gridSize / 2), 
                lng: (lngKey * gridSize) + (gridSize / 2), 
                count: 0 
            });
        }
        grid.get(key).count += 1;
    });

    // Convert to array and normalize intensity
    const hotspotArray = Array.from(grid.values());
    if (hotspotArray.length === 0) return [];

    const maxCount = Math.max(...hotspotArray.map(h => h.count));

    return hotspotArray.map(h => ({
        ...h,
        intensity: h.count / maxCount, // 0 to 1
        radius: 300 + (h.count / maxCount) * 500 // Radius based on intensity
    })).filter(h => h.count > 2); // Only show if more than 2 crimes in area
  }, [filteredCrimeData]);

  // Compute Highly Sensitive Areas (Top Hotspots)
  const sensitiveAreas = useMemo(() => {
    return [...hotspots].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [hotspots]);

  // Default center (India)
  const defaultCenter = [20.5937, 78.9629]; // India Center
  
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border relative">
      <LeafletMap 
        center={defaultCenter} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapBounds && <MapController bounds={mapBounds} />}

        {/* Render Hotspots (Red Zones/Cluster Markers) */}
        {showHeatmap && hotspots.map((spot, idx) => (
            <Circle
                key={`hotspot-${idx}`}
                center={[spot.lat, spot.lng]}
                radius={spot.radius}
                pathOptions={{
                    color: 'red',
                    fillColor: '#ef4444', 
                    fillOpacity: 0.3 + (spot.intensity * 0.4), 
                    stroke: false
                }}
            >
                <Popup>
                    <div className="text-sm font-semibold">High Alert Area</div>
                    <div className="text-xs">Crime Density: High ({spot.count} incidents)</div>
                </Popup>
            </Circle>
        ))}

        {/* Highly Sensitive Areas (Pulsing Effect) */}
        {showSensitiveAreas && sensitiveAreas.map((area, idx) => (
            <Circle
                key={`sensitive-${idx}`}
                center={[area.lat, area.lng]}
                radius={area.radius * 0.8}
                pathOptions={{
                    color: '#991b1b', // Darker red
                    fillColor: '#7f1d1d',
                    fillOpacity: 0.6,
                    weight: 2,
                    dashArray: '5, 10'
                }}
            >
                <Popup>
                    <div className="text-sm font-bold text-red-900">CRITICAL SENSITIVE ZONE</div>
                    <div className="text-xs font-semibold">Extreme Caution Advised</div>
                    <div className="text-xs">Incidents: {area.count}</div>
                </Popup>
            </Circle>
        ))}

        {/* Police Stations */}
        {showPoliceStations && policeStations.map(station => (
          <Marker 
            key={`police-${station.id}`}
            position={station.coordinates}
            icon={station.type === 'HQ' ? icons.policeHQ : icons.police}
          >
            <Popup>
              <div className="font-semibold">{station.name}</div>
              <div className="text-xs text-gray-600">{station.address}</div>
            </Popup>
          </Marker>
        ))}

        {/* Traffic Cameras */}
        {showTrafficCameras && trafficCameras.map(camera => (
          <Marker 
            key={`camera-${camera.id}`}
            position={camera.coordinates}
            icon={icons.camera}
          >
            <Popup>
              <div className="font-semibold">{camera.name}</div>
              <div className="text-xs">Status: {camera.status}</div>
            </Popup>
          </Marker>
        ))}

        {/* Crime Markers */}
        {showCrimeMarkers && filteredCrimeData.map((crime, idx) => {
            if (!crime.coordinates) return null;
            // Determine icon based on type
            let icon = icons.crime.other;
            const type = (crime.type || crime.category || '').toLowerCase();
            if (type.includes('assault') || type.includes('homicide') || type.includes('violent')) icon = icons.crime.violent;
            else if (type.includes('theft') || type.includes('burglary')) icon = icons.crime.property;
            else if (type.includes('drug')) icon = icons.crime.drug;

            return (
              <Marker 
                key={`crime-${idx}`}
                position={crime.coordinates}
                icon={icon}
              >
                <Popup>
                  <div className="font-semibold">{crime.type}</div>
                  <div className="text-xs">{crime.location}</div>
                  <div className="text-xs">{crime.date}</div>
                </Popup>
              </Marker>
            );
        })}
        
      </LeafletMap>

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Map Layers</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={showHeatmap} 
                onChange={(e) => onHeatmapToggle && onHeatmapToggle(e.target.checked)}
                className="rounded" 
              />
              <span>Cluster Heatmap</span>
            </label>
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={showSensitiveAreas}
                onChange={(e) => setShowSensitiveAreas(e.target.checked)}
                className="rounded" 
              />
              <span>Sensitive Areas</span>
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
          </div>
      </div>

      {/* Legend / Info Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <h4 className="text-xs font-bold mb-2">Map Legend</h4>
        <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-50"></div>
            <span className="text-xs">High Crime Zone</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
             <div className="w-3 h-3 rounded-full bg-blue-500 border border-white"></div>
             <span className="text-xs">Police Station</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
             <div className="w-3 h-3 bg-yellow-500 border border-white rounded-sm"></div>
             <span className="text-xs">Traffic Camera</span>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
