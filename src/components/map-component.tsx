import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, MapPin, Clock, RotateCw } from 'lucide-react';

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

export function MapComponent({ onLocationChange }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [locationA, setLocationA] = useState('');
  const [locationB, setLocationB] = useState('');
  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const polylineRef = useRef(null);
  const markersRef = useRef({ a: null, b: null });
  const [showStartLocations, setShowStartLocations] = useState(false);
  const [showEndLocations, setShowEndLocations] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // 'map' or 'details'

  const [tileLayer, setTileLayer] = useState(null);


  useEffect(() => {
    const initializeMap = async () => {
      if (typeof window !== "undefined" && !map) {
        
        const L = await import('leaflet');
        const isDarkMode = document.documentElement.classList.contains('dark');
        
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
          zoomControl: false,
          attributionControl: false
        }).setView([24.0, 54.0], 8); // Centered on UAE
        
        // Add tile layer from a modern-looking map provider
        const tileUrl = isDarkMode
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
          
        const newTileLayer = L.tileLayer(tileUrl, {
          maxZoom: 19,
          updateWhenIdle: true,
          maxNativeZoom: 18
        }).addTo(newMap);
        
        // Store the tile layer reference
        setTileLayer(newTileLayer);
        
        // Add zoom control to bottom right
        L.control.zoom({
          position: 'bottomright'
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


  useEffect(() => {
    // Set up a MutationObserver to watch for theme changes
    if (map && tileLayer) {
      const observer = new MutationObserver(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        // Update the tile layer URL based on current theme
        tileLayer.setUrl(
          isDarkMode
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        );
      });
      
      // Start observing theme changes on document.documentElement
      observer.observe(document.documentElement, { 
        attributes: true,
        attributeFilter: ['class'] 
      });
      
      return () => {
        observer.disconnect();
      };
    }
  }, [map, tileLayer]);

  

  // Pass location data to parent component when locations or distance changes
  useEffect(() => {
    if (onLocationChange && typeof onLocationChange === 'function') {
      onLocationChange(locationA, locationB, distance);
    }
  }, [locationA, locationB, distance, onLocationChange]);

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
      html: `<div class="marker-pin ${type === 'a' ? 'bg-green-900' : 'bg-destructive'} text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-semibold">${type === 'a' ? 'A' : 'B'}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
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

  // Fetch route from OSRM routing service
  const fetchRoute = useCallback(async (startCoords, endCoords) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }
      
      const route = data.routes[0];
      return {
        geometry: route.geometry.coordinates.map(coord => [coord[1], coord[0]]), // OSRM returns [lon, lat], Leaflet needs [lat, lon]
        distance: route.distance / 1000, // Convert to kilometers
      };
    } catch (error) {
      console.error('Error fetching route:', error);
      return null;
    }
  }, []);

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
    
    setIsLoading(true);
    
    try {
      const routeData = await fetchRoute(
        [pointALatLng.lat, pointALatLng.lng],
        [pointBLatLng.lat, pointBLatLng.lng]
      );
      
      if (routeData) {
        // Create polyline from route geometry with modern style
        const polyline = L.polyline(routeData.geometry, {
          color: '#006400',
          weight: 5,
          opacity: 0.8,
          lineJoin: 'round',
          lineCap: 'round',
          className: 'route-path-shadow'
        }).addTo(map);
        
        polylineRef.current = polyline;
        
        setDistance(routeData.distance.toFixed(1));
        
       
        
        // Fit map to show the route with some padding
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      } else {
        // Fallback to straight line if routing fails
        const polyline = L.polyline(
          [
            [pointALatLng.lat, pointALatLng.lng],
            [pointBLatLng.lat, pointBLatLng.lng]
          ],
          { 
            color: '#006400', 
            weight: 4, 
            opacity: 0.7, 
            dashArray: '5, 5',
            lineCap: 'round',
            lineJoin: 'round'
          }
        ).addTo(map);
        
        polylineRef.current = polyline;
        
        // Calculate direct distance as fallback
        const distanceInMeters = pointALatLng.distanceTo(pointBLatLng);
        const distanceInKm = (distanceInMeters / 1000).toFixed(1);
        
        setDistance(distanceInKm);
        
      
      }
    } catch (error) {
      console.error("Error calculating route:", error);
    } finally {
      setIsLoading(false);
    }
  }, [map, fetchRoute]);

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
    setShowStartLocations(false);
    setShowEndLocations(false);
  }, [map]);

  // Clear location handler
  const clearLocation = useCallback((type) => {
    if (!map) return;
    
    if (type === 'a') {
      setLocationA('');
      if (markersRef.current.a) {
        map.removeLayer(markersRef.current.a);
        markersRef.current.a = null;
        setPointA(null);
      }
    } else {
      setLocationB('');
      if (markersRef.current.b) {
        map.removeLayer(markersRef.current.b);
        markersRef.current.b = null;
        setPointB(null);
      }
    }
    
    // Remove route if either point is cleared
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
      setDistance(null);
    }
  }, [map]);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-zinc-200 bg-white dark:bg-card dark:border-zinc-900">
      {/* Top White Card - Locations Input */}
      <div className="bg-white dark:bg-card p-4 lg:p-6 border-b border-zinc-100 dark:border-zinc-900 rounded-t-xl">
        <div className="flex flex-col space-y-4">
          {/* Location Input A */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-900 flex items-center justify-center text-white font-medium shadow-md">
                A
              </div>
              <div className="relative flex-grow">
                <Input
                  placeholder="Select pickup location"
                  value={locationA}
                  readOnly
                  onClick={() => {
                    setShowStartLocations(!showStartLocations);
                    setShowEndLocations(false);
                  }}
                  className="w-full pr-8 cursor-pointer bg-zinc-50 dark:bg-card border-zinc-200 dark:border-zinc-700 h-12 rounded-lg"
                />
                {locationA && (
                  <button
                    className="absolute right-3 top-1/2 transform -tranzinc-y-1/2 text-zinc-400 hover:text-zinc-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearLocation('a');
                    }}
                    type="button"
                    aria-label="Clear location A"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Start location dropdown */}
            {showStartLocations && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-card shadow-xl rounded-lg border border-zinc-100 dark:border-zinc-700 max-h-60 overflow-auto">
                {PREDEFINED_LOCATIONS.start.map(location => (
                  <div
                    key={location.id}
                    className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-card cursor-pointer text-sm flex items-center border-b border-zinc-50 dark:border-zinc-700 last:border-b-0"
                    onClick={() => selectLocation(location, 'a')}
                  >
<MapPin className="h-4 w-4 mr-3 flex-shrink-0 text-green-600" />
<span className="font-medium">{location.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Location Input B */}
          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-white font-medium shadow-md">
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
                  className="w-full pr-8 cursor-pointer bg-card dark:bg-card border-zinc-200 dark:border-zinc-700 h-12 rounded-lg"
                />
                {locationB && (
                  <button
                    className="absolute right-3 top-1/2 transform -tranzinc-y-1/2 text-zinc-400 hover:text-zinc-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearLocation('b');
                    }}
                    type="button"
                    aria-label="Clear location B"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* End location dropdown */}
            {showEndLocations && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-card shadow-xl rounded-lg border border-zinc-400 dark:border-zinc-900 max-h-60 overflow-auto">
                {PREDEFINED_LOCATIONS.end.map(location => (
                  <div
                    key={location.id}
                    className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-card cursor-pointer text-sm flex items-center border-b border-zinc-50 dark:border-zinc-700 last:border-b-0"
                    onClick={() => selectLocation(location, 'b')}
                  >
<MapPin className="h-4 w-4 mr-3 flex-shrink-0 text-green-600" />
<span className="font-medium">{location.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Map Display */}
      <div 
        ref={mapRef} 
        className="h-96 w-full relative border  dark:border-zinc-900"
        style={{ zIndex: 0 }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-base font-medium">Finding optimal route...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {distance && (
  <div className="bg-white dark:bg-card border-t border-zinc-100 dark:border-zinc-800">
    <div className="p-4 lg:p-5 space-y-6">
      
      {/* Trip details */}
      <div className="flex items-start space-x-3">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-green-900"></div>
          <div className="w-0.5 h-12 bg-zinc-200 dark:bg-zinc-700"></div>
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <div className="font-medium">{locationA}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Pickup location</div>
          </div>
          <div>
            <div className="font-medium">{locationB}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Destination</div>
          </div>
        </div>
        <div className="text">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Distance</div>
          <div className="font-semibold mt-1">{distance} km</div>
        </div>
      </div>

       
      

    </div>
  </div>
)}

      
     
    </div>
  );
}