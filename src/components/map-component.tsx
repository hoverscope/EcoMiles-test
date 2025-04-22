import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// UAE bounds (approximate)
const UAE_BOUNDS = {
  center: [55.2708, 25.2048], // Dubai center coordinates
  zoom: 9
};

// Predefined locations in UAE
const PREDEFINED_LOCATIONS = {
  start: [
    { id: 1, name: "Dubai Mall", lat: 25.1972, lon: 55.2744 },
    { id: 2, name: "Burj Khalifa", lat: 25.1972, lon: 55.2744 },
    { id: 3, name: "Palm Jumeirah", lat: 25.1121, lon: 55.1387 },
    { id: 4, name: "Dubai Marina", lat: 25.0763, lon: 55.1384 },
    { id: 5, name: "Jumeirah Beach", lat: 25.1412, lon: 55.1854 },
    { id: 6, name: "Deira City Center", lat: 25.2669, lon: 55.3279 },
    { id: 7, name: "Mirdif City Center", lat: 25.2205, lon: 55.4215 },
    { id: 8, name: "Global Village", lat: 25.0556, lon: 55.3629 },
    { id: 9, name: "Dubai Airport", lat: 25.2532, lon: 55.3657 },
    { id: 10, name: "Al Qusais", lat: 25.2793, lon: 55.3806 },
    { id: 11, name: "Al Barsha", lat: 25.1194, lon: 55.2017 },
    { id: 12, name: "Business Bay", lat: 25.1866, lon: 55.2665 },
    { id: 13, name: "Silicon Oasis", lat: 25.1172, lon: 55.3789 },
    { id: 14, name: "Jebel Ali", lat: 24.9857, lon: 55.0266 },
    { id: 15, name: "Al Karama", lat: 25.2516, lon: 55.3070 }
  ],
  end: [
    { id: 16, name: "Abu Dhabi Mall", lat: 24.4909, lon: 54.3568 },
    { id: 17, name: "Sheikh Zayed Mosque", lat: 24.4129, lon: 54.4740 },
    { id: 18, name: "Yas Island", lat: 24.4884, lon: 54.6061 },
    { id: 19, name: "Ferrari World", lat: 24.4849, lon: 54.6051 },
    { id: 20, name: "Corniche Abu Dhabi", lat: 24.4670, lon: 54.3479 },
    { id: 21, name: "Sharjah Museum", lat: 25.3480, lon: 55.3916 },
    { id: 22, name: "Ajman Corniche", lat: 25.4117, lon: 55.4350 },
    { id: 23, name: "Ras Al Khaimah Beach", lat: 25.7915, lon: 55.9428 },
    { id: 24, name: "Fujairah Fort", lat: 25.1309, lon: 56.3347 },
    { id: 25, name: "Umm Al Quwain Marina", lat: 25.5653, lon: 55.5533 },
    { id: 26, name: "Al Ain Oasis", lat: 24.2305, lon: 55.7633 },
    { id: 27, name: "Hatta Dam", lat: 24.7939, lon: 56.1156 },
    { id: 28, name: "Dubai Creek", lat: 25.2653, lon: 55.2925 },
    { id: 29, name: "Kite Beach", lat: 25.1434, lon: 55.1935 },
    { id: 30, name: "Mall of the Emirates", lat: 25.1193, lon: 55.1987 }
  ]
};

export function MapComponent() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [locationA, setLocationA] = useState('');
  const [locationB, setLocationB] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [transportMode, setTransportMode] = useState('car');
  const polylineRef = useRef(null);
  const markersRef = useRef({ a: null, b: null });
  const [showStartLocations, setShowStartLocations] = useState(false);
  const [showEndLocations, setShowEndLocations] = useState(false);

  // Initialize map on component mount
  useEffect(() => {
    const initializeMap = async () => {
      if (typeof window !== "undefined" && !map) {
        const L = await import('leaflet');
        
        // Add Leaflet CSS if not already loaded
        if (!document.querySelector('[data-leaflet-css]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
          link.setAttribute('data-leaflet-css', '');
          document.head.appendChild(link);
        }

        if (!mapRef.current) return;
        
        // Initialize the map with UAE view
        const newMap = L.map(mapRef.current, {
          center: UAE_BOUNDS.center,
          zoom: UAE_BOUNDS.zoom,
          preferCanvas: true
        });
        
        // Add tile layer from OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          updateWhenIdle: true,
          maxNativeZoom: 18
        }).addTo(newMap);
        
        setMap(newMap);
      }
    };
    
    initializeMap();
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Handle location selection
  const selectLocation = useCallback(async (location, type) => {
    if (!map) return;
    
    const L = await import('leaflet');
    const { lat, lon, name } = location;
    
    // Remove existing marker of this type
    if (markersRef.current[type]) {
      map.removeLayer(markersRef.current[type]);
    }
    
    // Create marker icon based on type
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-pin ${type === 'a' ? 'bg-blue-500' : 'bg-red-500'} text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">${type === 'a' ? 'A' : 'B'}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });
    
    // Create marker
    const marker = L.marker([lat, lon], { icon }).addTo(map);
    
    // Store marker reference
    markersRef.current[type] = marker;
    
    // Store marker state
    if (type === 'a') {
      setPointA(marker);
      setLocationA(name);
      setShowStartLocations(false);
    } else {
      setPointB(marker);
      setLocationB(name);
      setShowEndLocations(false);
    }
    
    // Update the view if needed
    const currentBounds = map.getBounds();
    const markerLatLng = L.latLng(lat, lon);
    
    if (!currentBounds.contains(markerLatLng)) {
      map.setView([lat, lon], 13);
    }
    
    // Calculate route if both points exist
    if ((type === 'a' && markersRef.current.b) || (type === 'b' && markersRef.current.a)) {
      calculateRoute();
    }
  }, [map]);

  // Calculate route between points
  const calculateRoute = useCallback(async () => {
    if (!markersRef.current.a || !markersRef.current.b || !map) return;
    
    const L = await import('leaflet');
    const pointALatLng = markersRef.current.a.getLatLng();
    const pointBLatLng = markersRef.current.b.getLatLng();
    
    // Remove existing polyline
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }
    
    // Create direct polyline between points
    const polyline = L.polyline(
      [
        [pointALatLng.lat, pointALatLng.lng],
        [pointBLatLng.lat, pointBLatLng.lng]
      ],
      { color: '#2563eb', weight: 4, opacity: 0.7 }
    ).addTo(map);
    
    polylineRef.current = polyline;
    
    // Calculate distance in kilometers and estimate duration
    const distanceInMeters = pointALatLng.distanceTo(pointBLatLng);
    const distanceInKm = (distanceInMeters / 1000).toFixed(1);
    
    // Estimate duration based on transport mode
    let speedKmh;
    switch (transportMode) {
      case 'car': speedKmh = 50; break;
      case 'transit': speedKmh = 30; break;
      case 'bike': speedKmh = 15; break;
      case 'walking': speedKmh = 5; break;
      default: speedKmh = 30;
    }
    
    const durationInHours = distanceInKm / speedKmh;
    const durationInMinutes = Math.max(1, Math.round(durationInHours * 60));
    
    setDistance(distanceInKm);
    setDuration(durationInMinutes);
    
    // Fit map to show the route with some padding
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  }, [map, transportMode]);

  // Change transport mode
  const changeTransportMode = useCallback((mode) => {
    setTransportMode(mode);
    if (markersRef.current.a && markersRef.current.b) {
      setTimeout(() => calculateRoute(), 100);
    }
  }, [calculateRoute]);

  // Reset everything
  const resetMap = useCallback(() => {
    if (!map) return;
    
    if (markersRef.current.a) map.removeLayer(markersRef.current.a);
    if (markersRef.current.b) map.removeLayer(markersRef.current.b);
    if (polylineRef.current) map.removeLayer(polylineRef.current);
    
    markersRef.current = { a: null, b: null };
    polylineRef.current = null;
    
    setPointA(null);
    setPointB(null);
    setLocationA('');
    setLocationB('');
    setDistance(null);
    setDuration(null);
    setShowStartLocations(false);
    setShowEndLocations(false);
    
    // Reset view to UAE
    map.setView(UAE_BOUNDS.center, UAE_BOUNDS.zoom);
  }, [map]);

  return (
    <div className="w-full shadow-lg rounded-lg overflow-hidden">
      <div className="bg-white dark:bg-slate-800 p-4 shadow-md">
        <div className="flex flex-col space-y-4">
          {/* Location Input A */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                A
              </div>
              <div className="relative flex-grow">
                <Input
                  placeholder="Select start location"
                  value={locationA}
                  readOnly
                  onClick={() => {
                    setShowStartLocations(!showStartLocations);
                    setShowEndLocations(false);
                  }}
                  className="w-full pr-8 cursor-pointer"
                />
                {locationA && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocationA('');
                      if (markersRef.current.a && map) {
                        map.removeLayer(markersRef.current.a);
                        markersRef.current.a = null;
                        setPointA(null);
                        if (polylineRef.current) {
                          map.removeLayer(polylineRef.current);
                          polylineRef.current = null;
                          setDistance(null);
                          setDuration(null);
                        }
                      }
                    }}
                    type="button"
                    aria-label="Clear location A"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* Start location dropdown */}
            {showStartLocations && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                {PREDEFINED_LOCATIONS.start.map(location => (
                  <div
                    key={location.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-sm flex items-start"
                    onClick={() => selectLocation(location, 'a')}
                  >
                    <Search className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                    <span>{location.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Location Input B */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-medium">
                B
              </div>
              <div className="relative flex-grow">
                <Input
                  placeholder="Select destination"
                  value={locationB}
                  readOnly
                  onClick={() => {
                    setShowEndLocations(!showEndLocations);
                    setShowStartLocations(false);
                  }}
                  className="w-full pr-8 cursor-pointer"
                />
                {locationB && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocationB('');
                      if (markersRef.current.b && map) {
                        map.removeLayer(markersRef.current.b);
                        markersRef.current.b = null;
                        setPointB(null);
                        if (polylineRef.current) {
                          map.removeLayer(polylineRef.current);
                          polylineRef.current = null;
                          setDistance(null);
                          setDuration(null);
                        }
                      }
                    }}
                    type="button"
                    aria-label="Clear location B"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* End location dropdown */}
            {showEndLocations && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                {PREDEFINED_LOCATIONS.end.map(location => (
                  <div
                    key={location.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-sm flex items-start"
                    onClick={() => selectLocation(location, 'b')}
                  >
                    <Search className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                    <span>{location.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Transportation Mode Options */}
        <div className="mt-4 flex items-center justify-between overflow-x-auto pb-1">
          <div 
            className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${transportMode === 'car' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            onClick={() => changeTransportMode('car')}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transportMode === 'car' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={transportMode === 'car' ? 'text-white' : 'text-gray-500'}>
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"></path>
                <circle cx="7" cy="17" r="2"></circle>
                <circle cx="17" cy="17" r="2"></circle>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Car</span>
          </div>
          
          <div 
            className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${transportMode === 'transit' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            onClick={() => changeTransportMode('transit')}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transportMode === 'transit' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={transportMode === 'transit' ? 'text-white' : 'text-gray-500'}>
                <rect x="4" y="3" width="16" height="16" rx="2"></rect>
                <path d="M4 11h16"></path>
                <path d="M12 3v16"></path>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Transit</span>
          </div>
          
          <div 
            className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${transportMode === 'bike' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            onClick={() => changeTransportMode('bike')}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transportMode === 'bike' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={transportMode === 'bike' ? 'text-white' : 'text-gray-500'}>
                <circle cx="6" cy="15" r="4"></circle>
                <circle cx="18" cy="15" r="4"></circle>
                <path d="M6 15 9 3h7"></path>
                <path d="m19 9-5 6"></path>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Bike</span>
          </div>
          
          <div 
            className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${transportMode === 'walking' ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            onClick={() => changeTransportMode('walking')}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transportMode === 'walking' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={transportMode === 'walking' ? 'text-white' : 'text-gray-500'}>
                <path d="M13 22 9 17v-5l-4-3 3-3 2 2 1.5-1.5"></path>
                <path d="m7 17 3-3"></path>
                <path d="M16.5 2a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1"></path>
                <path d="m13 7 1.5-4.5c.8 0 1.5.7 1.5 1.5v3.5"></path>
                <path d="m13 7 3 5-3 5"></path>
                <path d="m16 12-1 2-2.5 2"></path>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Walk</span>
          </div>
        </div>
      </div>
      
      {/* Map Display */}
      <div 
        ref={mapRef} 
        className="h-96 w-full"
        style={{ zIndex: 0 }}
      ></div>
      
      {/* Bottom Panel with Distance Info */}
      {distance && duration && (
        <div className="bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <div className="text-lg font-semibold">{duration} min ({distance} km)</div>
                <div className="text-sm text-gray-500">via fastest route</div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={resetMap}
              className="text-sm"
            >
              Reset
            </Button>
          </div>
          
         
        </div>
      )}
    </div>
  );
}