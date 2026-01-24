import React, { useMemo, useEffect } from 'react';
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

  // Default center (Chicago/India/World fallback)
  const defaultCenter = [41.8781, -87.6298]; // Chicago
  
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border relative">
      <LeafletMap 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapBounds && <MapController bounds={mapBounds} />}

        {/* Render Hotspots (Red Zones) */}
        {showHeatmap && hotspots.map((spot, idx) => (
            <Circle
                key={`hotspot-${idx}`}
                center={[spot.lat, spot.lng]}
                radius={spot.radius}
                pathOptions={{
                    color: 'red',
                    fillColor: '#ef4444', // Tailwind red-500
                    fillOpacity: 0.3 + (spot.intensity * 0.4), // More intense = more opaque
                    stroke: false
                }}
            >
                <Popup>
                    <div className="text-sm font-semibold">High Alert Area</div>
                    <div className="text-xs">Crime Density: High ({spot.count} incidents)</div>
                </Popup>
            </Circle>
        ))}

        {/* Render Individual Crime Markers (Optional, if not too many or if zoomed in) */}
        {/* We can limit this to only show if < 500 points or something, or just show all for now */}
        {filteredCrimeData.slice(0, 1000).map((crime, idx) => (
            <Marker 
                key={crime.id || idx} 
                position={crime.coordinates}
                eventHandlers={{
                    click: () => onMarkerClick && onMarkerClick(crime)
                }}
            >
                <Popup>
                    <div className="p-1">
                        <div className="font-bold text-sm">{crime.type || crime.category}</div>
                        <div className="text-xs text-gray-600">{crime.location}</div>
                        <div className="text-xs mt-1">{crime.date} {crime.time}</div>
                        <div className={`text-xs mt-1 font-semibold ${
                            crime.severity === 'High' ? 'text-red-600' : 
                            crime.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                            Severity: {crime.severity}
                        </div>
                    </div>
                </Popup>
            </Marker>
        ))}
        
      </LeafletMap>

      {/* Legend / Info Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <h4 className="text-xs font-bold mb-2">Map Legend</h4>
        <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-50"></div>
            <span className="text-xs">High Crime Zone (Red Alert)</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
            <span className="text-xs">Incident Marker</span>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
