"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";

// Bus Icon
const busIcon = L.divIcon({
  className: 'bus-icon',
  html: `
    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
      <svg viewBox="0 0 24 24" width="24" height="24" style="fill: #000000;">
        <path d="M17 20H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9H2V8h1V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3h1v4h-2v9a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1zM5 5v9h14V5H5zm0 11v2h4v-2H5zm10 0v2h4v-2h-4z"/>
      </svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// Stop Icons
const stopIcon = L.divIcon({
  className: 'bus-stop-icon',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  html: '<div class="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>'
});

const stopIconSelected = L.divIcon({
  className: 'bus-stop-icon-selected',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  html: '<div class="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-lg"></div>'
});

// CSS for map markers
const mapStyles = `
  .bus-stop-icon { background: transparent !important; border: none !important; }
  .bus-stop-icon-selected { background: transparent !important; border: none !important; }
  .leaflet-popup-content {
    margin: 10px 12px;
  }
`;

function FitBounds({ 
  positions, 
  padding = [50, 50] 
}: { 
  positions: LatLngTuple[]; 
  padding?: [number, number]; 
}) {
  const map = useMap();
  const memoizedPadding = React.useMemo(() => padding, [padding[0], padding[1]]);
  
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: memoizedPadding });
    }
  }, [map, positions, memoizedPadding]);
  
  return null;
}

interface BusStop {
  latitude: number;
  longitude: number;
  name?: string;
}

interface BusRoute {
  id: number;
  name: string;
  bus_stops: BusStop[];
  current_location: {
    latitude: number;
    longitude: number;
  };
}

interface BusMapProps {
  routes: BusRoute[];
  activeRouteId: number | null;
}

export default function BusMap({ routes, activeRouteId }: BusMapProps) {
  const [selectedStop, setSelectedStop] = useState<number | null>(null);
  const mapRef = useRef<L.Map>(null);
  const [busStopTimes, setBusStopTimes] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // This code only runs on the client side
    const now = new Date();
    const times: {[key: string]: string} = {};
    
    routes.forEach(route => {
      route.bus_stops.forEach((_, idx) => {
        const nextHour = (now.getHours() % 12) + 1;
        const nextMinute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        times[`${route.id}-${idx}`] = `${nextHour}:${nextMinute} ${ampm}`;
      });
    });
    
    setBusStopTimes(times);
  }, [routes]);

  const getBusDetails = (bus: BusRoute) => {
    return {
      id: bus.id,
      name: bus.name,
      status: bus.id % 3 === 0 ? 'Maintenance' : 'In Service',
      capacity: 50,
      currentPassengers: Math.floor(Math.random() * 50) + 1,
      nextStop: bus.bus_stops[1]?.name || 'Central Station'
    };
  };

  const handleMarkerClick = (index: number) => {
    setSelectedStop(selectedStop === index ? null : index);
  };

  const allStops = activeRouteId
    ? routes.find(route => route.id === activeRouteId)?.bus_stops || []
    : routes.flatMap(route => route.bus_stops);

  const activeRoute = activeRouteId 
    ? routes.find(route => route.id === activeRouteId)
    : null;

  const visibleBuses = activeRouteId
    ? routes.filter(route => route.id === activeRouteId)
    : routes;

  const routePositions: LatLngTuple[] = allStops.map(stop => [
    stop.latitude,
    stop.longitude
  ]);

  return (
    <div className="relative w-full" style={{ height: '600px' }}>
      <style>{mapStyles}</style>
      <MapContainer 
        center={[3.1390, 101.6869]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {routes.map((route) => {
          const details = getBusDetails(route);
          const capacityPercentage = Math.round((details.currentPassengers / details.capacity) * 100);
          
          return (
            <React.Fragment key={route.id}>
              <Marker
                position={[route.current_location.latitude, route.current_location.longitude]}
                icon={busIcon}
              >
                <Popup className="w-64">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{route.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        details.status === 'In Service' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {details.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Capacity:</span>
                        <span>{details.currentPassengers}/{details.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            capacityPercentage > 80 ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${capacityPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-gray-500">Next Stop:</p>
                      <p className="font-medium">{details.nextStop}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {route.bus_stops.map((stop, idx) => {
                const stopKey = `${route.id}-${idx}`;
                
                return (
                  <Marker
                    key={stopKey}
                    position={[stop.latitude, stop.longitude]}
                    icon={idx === selectedStop ? stopIconSelected : stopIcon}
                    eventHandlers={{ click: () => handleMarkerClick(idx) }}
                  >
                    <Popup className="w-48">
                      <div className="space-y-2">
                        <div className="font-semibold text-center">
                          {stop.name || `Stop ${idx + 1}`}
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Next Bus:</span>
                            <span className="font-medium">
                              {busStopTimes[stopKey] || 'Loading...'}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            Route: {route.name}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </React.Fragment>
          );
        })}

        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
            }}
          />
        )}

        <FitBounds positions={allStops.map(stop => [stop.latitude, stop.longitude] as LatLngTuple)} />
      </MapContainer>
    </div>
  );
}
