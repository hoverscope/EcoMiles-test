import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigation, Search, CornerDownRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// MapComponent to be imported into your Page component
export function MapComponent() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);
  const [locationA, setLocationA] = useState('');
  const [locationB, setLocationB] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [autocompleteResults, setAutocompleteResults] = useState({ a: [], b: [] });
  const [focusedInput, setFocusedInput] = useState(null);
  const [transportMode, setTransportMode] = useState('car');
  const polylineRef = useRef(null);
  
  // Initialize map on component mount
  useEffect(() => {
    const initializeMap = async () => {
      if (typeof window !== "undefined" && !map) {
        const L = await import('leaflet');
        
        // Add Leaflet CSS 
        if (!document.querySelector('[data-leaflet-css]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
          link.setAttribute('data-leaflet-css', '');
          document.head.appendChild(link);
        }

        if (!mapRef.current) return;
        
        const newMap = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
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

  // Search location with autocomplete
  const searchLocation = async (query, type) => {
    if (!query.trim()) {
      setAutocompleteResults({ ...autocompleteResults, [type]: [] });
      return;
    }

    try {
      const response = await fetch(`https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setAutocompleteResults({ 
          ...autocompleteResults, 
          [type]: data.map(item => ({
            id: item.place_id,
            text: item.display_name,
            lat: item.lat,
            lon: item.lon
          }))
        });
      } else {
        setAutocompleteResults({ ...autocompleteResults, [type]: [] });
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      setAutocompleteResults({ ...autocompleteResults, [type]: [] });
    }
  };

  // Handle location selection
  const selectLocation = async (location, type) => {
    if (!map) return;
    
    const L = await import('leaflet');
    const { lat, lon, text } = location;
    
    // Remove existing marker of this type
    if (type === 'a' && pointA) {
      map.removeLayer(pointA);
    } else if (type === 'b' && pointB) {
      map.removeLayer(pointB);
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
    
    // Store marker and location name
    if (type === 'a') {
      setPointA(marker);
      setLocationA(text);
    } else {
      setPointB(marker);
      setLocationB(text);
    }
    
    // Clear autocomplete results
    setAutocompleteResults({ ...autocompleteResults, [type]: [] });
    
    // Update the view if this is the first point
    if ((!pointA && type === 'a') || (!pointB && type === 'b')) {
      map.setView([lat, lon], 14);
    }
    
    // Calculate route if both points exist
    if ((type === 'a' && pointB) || (type === 'b' && pointA)) {
      setTimeout(() => calculateRoute(), 100);
    }
  };

  // Calculate route between points
  const calculateRoute = async () => {
    if (!pointA || !pointB || !map) return;
    
    const L = await import('leaflet');
    const pointALatLng = pointA.getLatLng();
    const pointBLatLng = pointB.getLatLng();
    
    // Remove existing polyline
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
    }
    
    try {
      // Get route from OSRM
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${transportMode === 'car' ? 'driving' : 'walking'}/${pointALatLng.lng},${pointALatLng.lat};${pointBLatLng.lng},${pointBLatLng.lat}?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        
        // Create polyline for the route
        const polyline = L.polyline(routeCoordinates, { 
          color: '#2563eb', 
          weight: 5, 
          opacity: 0.7
        }).addTo(map);
        
        polylineRef.current = polyline;
        
        // Calculate distance and duration
        const distanceInMeters = route.distance;
        const distanceInKm = (distanceInMeters / 1000).toFixed(1);
        const durationInSeconds = route.duration;
        const durationInMinutes = Math.round(durationInSeconds / 60);
        
        setDistance(distanceInKm);
        setDuration(durationInMinutes);
        setRouteInfo(`${durationInMinutes} min (${distanceInKm} mi)`);
        
        // Fit map to show the route
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      } else {
        throw new Error('No route found');
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      
      // Fallback to direct line if route calculation fails
      const polyline = L.polyline(
        [
          [pointALatLng.lat, pointALatLng.lng],
          [pointBLatLng.lat, pointBLatLng.lng]
        ],
        { color: '#2563eb', weight: 4, opacity: 0.7 }
      ).addTo(map);
      
      polylineRef.current = polyline;
      
      // Calculate straight-line distance
      const distanceInMeters = pointALatLng.distanceTo(pointBLatLng);
      const distanceInKm = (distanceInMeters / 1000).toFixed(1);
      const durationInMinutes = Math.round((distanceInMeters / 1000) * (transportMode === 'car' ? 1.5 : 12));
      
      setDistance(distanceInKm);
      setDuration(durationInMinutes);
      setRouteInfo(`${durationInMinutes} min (${distanceInKm} mi)`);
      
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  };

  // Change transport mode
  const changeTransportMode = (mode) => {
    setTransportMode(mode);
    if (pointA && pointB) {
      setTimeout(() => calculateRoute(), 100);
    }
  };

  // Reset everything
  const resetMap = () => {
    if (!map) return;
    
    if (pointA) map.removeLayer(pointA);
    if (pointB) map.removeLayer(pointB);
    if (polylineRef.current) map.removeLayer(polylineRef.current);
    
    setPointA(null);
    setPointB(null);
    setLocationA('');
    setLocationB('');
    setDistance(null);
    setDuration(null);
    setRouteInfo(null);
    polylineRef.current = null;
  };

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
                  placeholder="Your location"
                  value={locationA}
                  onChange={(e) => {
                    setLocationA(e.target.value);
                    searchLocation(e.target.value, 'a');
                  }}
                  onFocus={() => setFocusedInput('a')}
                  className="w-full pr-8"
                />
                {locationA && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setLocationA('');
                      if (pointA && map) {
                        map.removeLayer(pointA);
                        setPointA(null);
                        if (polylineRef.current) {
                          map.removeLayer(polylineRef.current);
                          polylineRef.current = null;
                          setDistance(null);
                          setDuration(null);
                          setRouteInfo(null);
                        }
                      }
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* Autocomplete results for location A */}
            {focusedInput === 'a' && autocompleteResults.a.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                {autocompleteResults.a.map(result => (
                  <div
                    key={result.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-sm flex items-start"
                    onClick={() => selectLocation(result, 'a')}
                  >
                    <Search className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                    <span className="line-clamp-2">{result.text}</span>
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
                  onChange={(e) => {
                    setLocationB(e.target.value);
                    searchLocation(e.target.value, 'b');
                  }}
                  onFocus={() => setFocusedInput('b')}
                  className="w-full pr-8"
                />
                {locationB && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setLocationB('');
                      if (pointB && map) {
                        map.removeLayer(pointB);
                        setPointB(null);
                        if (polylineRef.current) {
                          map.removeLayer(polylineRef.current);
                          polylineRef.current = null;
                          setDistance(null);
                          setDuration(null);
                          setRouteInfo(null);
                        }
                      }
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* Autocomplete results for location B */}
            {focusedInput === 'b' && autocompleteResults.b.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                {autocompleteResults.b.map(result => (
                  <div
                    key={result.id}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-sm flex items-start"
                    onClick={() => selectLocation(result, 'b')}
                  >
                    <Search className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                    <span className="line-clamp-2">{result.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Transportation Mode Options */}
        {(pointA || pointB) && (
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
              <span className="text-xs mt-1 font-medium">11 min</span>
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
              <span className="text-xs mt-1 font-medium">15 min</span>
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
              <span className="text-xs mt-1 font-medium">25 min</span>
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
              <span className="text-xs mt-1 font-medium">47 min</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Map Display */}
      <div 
        ref={mapRef} 
        className="h-96 w-full"
        style={{ zIndex: 0 }}
      ></div>
      
      {/* Bottom Panel with Options */}
      {routeInfo && (
        <div className="bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{routeInfo}</div>
              <div className="text-sm text-gray-500">via Main St</div>
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700">
              START
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M5 8h14M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4M19 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M9 14h6"></path>
                </svg>
              </div>
              <span className="text-xs text-center">Restaurants</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                  <line x1="6" x2="6" y1="2" y2="4"></line>
                  <line x1="10" x2="10" y1="2" y2="4"></line>
                  <line x1="14" x2="14" y1="2" y2="4"></line>
                </svg>
              </div>
              <span className="text-xs text-center">Coffee</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                  <path d="M19 9H9a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z"></path>
                  <path d="M12 16v4"></path>
                  <path d="M8 16v4"></path>
                  <path d="M16 16v4"></path>
                  <path d="M4 9h20"></path>
                  <path d="M8 4h8"></path>
                  <path d="M9 4v5"></path>
                  <path d="M15 4v5"></path>
                </svg>
              </div>
              <span className="text-xs text-center">Hotels</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m16 10-4 4-2-2"></path>
                </svg>
              </div>
              <span className="text-xs text-center">More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}